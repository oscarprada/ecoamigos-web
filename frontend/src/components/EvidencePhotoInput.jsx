import { useEffect, useState } from 'react';

// Multipart field name matches recycling; the server validates actual bytes and limits.
export default function EvidencePhotoInput({ required = false, disabled = false, onSelected }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!photo) { setPreview(''); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  return <div>
    <label>{required ? 'Foto del progreso' : 'Foto inicial (opcional)'}
      <input name="evidence" type="file" accept=".jpg,.jpeg,.png,.webp" required={required} disabled={disabled}
        onChange={event => {
          const file = event.target.files?.[0];
          const valid = !file || (file.size > 0 && /\.(jpe?g|png|webp)$/i.test(file.name) && ['image/jpeg','image/png','image/webp'].includes(file.type));
          event.target.setCustomValidity(valid ? '' : 'Selecciona una foto JPG, PNG o WebP válida y no vacía.');
          setPhoto(valid ? file : null);
          onSelected?.(Boolean(valid && file));
        }} />
    </label>
    {preview && <img src={preview} alt="Vista previa de la foto seleccionada" className="garden-photoPreview" />}
  </div>;
}
