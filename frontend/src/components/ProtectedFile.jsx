import { useEffect, useState } from 'react';
import api from '../api/client';
export default function ProtectedFile({ kind, id, label = 'Ver archivo' }) {
  const [attempt,setAttempt]=useState(0), [file,setFile]=useState(null), [error,setError]=useState(''), [busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!attempt) return;
    let active=true, objectUrl;const controller=new AbortController();
    setBusy(true);setFile(null);setError('');
    api.get('/files/'+kind+'/'+id,{responseType:'blob',signal:controller.signal})
      .then(({data})=>{if(active){objectUrl=URL.createObjectURL(data);setFile({url:objectUrl,type:data.type});}})
      .catch(()=>{if(active) setError('No fue posible obtener el archivo.');})
      .finally(()=>{if(active) setBusy(false);});
    return ()=>{active=false;controller.abort();if(objectUrl) URL.revokeObjectURL(objectUrl);};
  },[attempt,kind,id]);
  return <div>
    <button type="button" disabled={busy} onClick={()=>setAttempt(value=>value+1)}>{busy?'Cargando archivo…':label}</button>
    {error && <p role="alert">{error}</p>}
    {file && <>
      {['image/jpeg','image/png','image/webp'].includes(file.type) && <img src={file.url} alt="Archivo adjunto" style={{maxWidth:'100%',maxHeight:260}} />}
      {['video/mp4','video/quicktime','video/x-msvideo'].includes(file.type) && <video src={file.url} controls style={{maxWidth:'100%',maxHeight:260}} />}
      <a href={file.url} download="archivo">Descargar archivo</a>
    </>}
  </div>;
}
