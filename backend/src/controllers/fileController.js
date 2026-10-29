import { query } from '../config/db.js';
import { createStorage } from '../services/fileStore.js';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream';
import { formats } from '../services/fileFormats.js';
// Input is an entity ID, never a pathname. Query relation/status before touching disk.
export function createFileHandlers(runQuery, storage = createStorage()) {
  const serve = kind => async(req,res) => {
    if(!/^[1-9]\d{0,9}$/.test(req.params.id) || Number(req.params.id)>2147483647) return res.status(404).json({message:'Archivo no encontrado'});
    try {
      const result=kind==='garden'
        ? await runQuery('SELECT e.evidence_url AS url,c.team_id FROM garden_evidence e JOIN garden_crops c ON c.id=e.crop_id WHERE e.id=$1',[req.params.id])
        : kind==='evidence'
        ? await runQuery('SELECT evidence_url AS url,user_id FROM recycling_records WHERE id=$1',[req.params.id])
        : await runQuery('SELECT file_url AS url,status FROM content_items WHERE id=$1',[req.params.id]);
      const row=result.rows[0];
      if(!row?.url) return res.status(404).json({message:'Archivo no encontrado'});
      if(kind==='garden' && req.user.role!=='admin' && (req.user.role!=='leader' || req.user.team_id!==row.team_id)) return res.status(403).json({message:'No tienes permisos para este archivo'});
      if(kind==='evidence' && req.user.role!=='admin' && (req.user.role!=='leader' || req.user.id!==row.user_id)) return res.status(403).json({message:'No tienes permisos para este archivo'});
      if(kind==='public' && row.status!=='published') return res.status(404).json({message:'Archivo no encontrado'});
      const controller = new AbortController();
      const cancel = () => controller.abort();
      res.once('close', cancel);
      let stored;
      try {stored=await storage.open(row.url,{range:req.headers?.range,signal:AbortSignal.any([controller.signal,AbortSignal.timeout(120000)])});}
      catch(error){res.off('close',cancel);return res.status([404,416,502].includes(error.status)?error.status:500).json({message:'No fue posible obtener el archivo'});}
      const ext=stored.ext, format=formats[ext];
      const inline=format && (format.kind==='image' || format.kind==='video');
      res.set({'Content-Type':format?.mime || (ext==='doc'?'application/msword':'application/octet-stream'),
        'X-Content-Type-Options':'nosniff','Cache-Control':'no-store',
        'Content-Security-Policy':"sandbox; default-src 'none'",
        'Content-Disposition':(inline?'inline':'attachment')+'; filename="archivo.'+(format?ext:ext==='doc'?'doc':'bin')+'"'});
      if(stored.response){
        res.status(stored.response.status);
        for(const name of ['content-length','content-range','accept-ranges']){
          const value=stored.response.headers.get(name);if(value) res.set(name,value);
        }
        pipeline(Readable.fromWeb(stored.response.body),res,error=>{res.off('close',cancel);if(error && !res.headersSent)res.status(502).end();});
        return;
      }
      res.sendFile(stored.filename,{acceptRanges:true,cacheControl:false,lastModified:false},error=>{
        res.off('close',cancel);
        if(error && !res.headersSent) res.status(error.status===404?404:500).json({message:'No fue posible obtener el archivo'});
      });
    } catch {res.status(500).json({message:'No fue posible obtener el archivo'});}
  };
  return {garden:serve('garden'),evidence:serve('evidence'),content:serve('content'),published:serve('public')};
}
export const {garden,evidence,content,published}=createFileHandlers(query);
