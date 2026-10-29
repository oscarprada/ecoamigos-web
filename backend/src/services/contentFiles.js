import { cleanupUnused, cleanupUncommitted, createStorage } from './fileStore.js';
export function createContentHandlers(pool, query, storage = createStorage()) {
  const mutate = operation => async (req,res) => {
    let client, open=false, committed=false, commitAttempted=false, previous, row, releaseError;
    try {
      if(operation!=='create' && !/^[1-9]\d{0,9}$/.test(req.params.id)) return res.status(404).json({message:'Contenido no encontrado'});
      client=await pool.connect();await client.query('BEGIN');open=true;
      if(operation!=='create'){
        const current=await client.query('SELECT * FROM content_items WHERE id=$1 FOR UPDATE',[req.params.id]);
        if(!current.rows[0]){await client.query('ROLLBACK');open=false;return res.status(404).json({message:'Contenido no encontrado'});}
        previous=current.rows[0].file_url;
      }
      if(operation==='delete') await client.query('DELETE FROM content_items WHERE id=$1',[req.params.id]);
      else {
        const {title,category,type,description,status}=req.body;
        const url=req.file?.url || previous || null;
        const values=[title,category,type,description || null,url,status || (operation==='create'?'published':status)];
        if(operation==='create') row=(await client.query(
          'INSERT INTO content_items(title,category,type,description,file_url,status,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [...values,req.user.id])).rows[0];
        else row=(await client.query(
          'UPDATE content_items SET title=$1,category=$2,type=$3,description=$4,file_url=$5,status=$6 WHERE id=$7 RETURNING *', [...values,req.params.id])).rows[0];
      }
      commitAttempted=true;await client.query('COMMIT');open=false;committed=true;client.release();client=null;
      if(previous && (operation==='delete' || previous!==row.file_url)) await cleanupUnused(previous,query,storage);
      return res.status(operation==='create'?201:200).json(operation==='delete'?{message:'Contenido eliminado correctamente'}:row);
    } catch {
      if(open) {try{await client.query('ROLLBACK');}catch(error){releaseError=error;}}
      return res.status(500).json({message:operation==='create'?'Error al crear contenido':operation==='delete'?'Error al eliminar contenido':'Error al actualizar contenido'});
    } finally {
      if(client) client.release(releaseError);
      if(req.file && !committed) await cleanupUncommitted(req.file.url,query,{commitAttempted,storage});
    }
  };
  return {createContent:mutate('create'),updateContent:mutate('update'),deleteContent:mutate('delete')};
}
