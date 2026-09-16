import { query } from '../config/db.js';
import { safeStoredPath } from '../services/fileStore.js';
import { formats, extension } from '../services/fileFormats.js';
// Input is an entity ID, never a pathname. Query relation/status before touching disk.
export function createFileHandlers(runQuery) {
  const serve = kind => async(req,res) => {
    if(!/^[1-9]\d{0,9}$/.test(req.params.id) || Number(req.params.id)>2147483647) return res.status(404).json({message:'Archivo no encontrado'});
    try {
      const result=kind==='evidence'
        ? await runQuery('SELECT evidence_url AS url,user_id FROM recycling_records WHERE id=$1',[req.params.id])
        : await runQuery('SELECT file_url AS url,status FROM content_items WHERE id=$1',[req.params.id]);
      const row=result.rows[0];
      if(!row?.url) return res.status(404).json({message:'Archivo no encontrado'});
      if(kind==='evidence' && req.user.role!=='admin' && (req.user.role!=='leader' || req.user.id!==row.user_id)) return res.status(403).json({message:'No tienes permisos para este archivo'});
      if(kind==='public' && row.status!=='published') return res.status(404).json({message:'Archivo no encontrado'});
      let filename;
      try {filename=await safeStoredPath(row.url);}catch{return res.status(404).json({message:'Archivo no encontrado'});}
      const ext=extension(filename), format=formats[ext];
      const inline=format && (format.kind==='image' || format.kind==='video');
      res.set({'Content-Type':format?.mime || (ext==='doc'?'application/msword':'application/octet-stream'),
        'X-Content-Type-Options':'nosniff','Cache-Control':'no-store',
        'Content-Security-Policy':"sandbox; default-src 'none'",
        'Content-Disposition':(inline?'inline':'attachment')+'; filename="archivo.'+(format?ext:ext==='doc'?'doc':'bin')+'"'});
      res.sendFile(filename,{acceptRanges:true,cacheControl:false,lastModified:false},error=>{
        if(error && !res.headersSent) res.status(error.status===404?404:500).json({message:'No fue posible obtener el archivo'});
      });
    } catch {res.status(500).json({message:'No fue posible obtener el archivo'});}
  };
  return {evidence:serve('evidence'),content:serve('content'),published:serve('public')};
}
export const {evidence,content,published}=createFileHandlers(query);
