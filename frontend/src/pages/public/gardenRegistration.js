// Keep the committed crop ID before uploading: a photo retry must never create another crop.
export async function registerGardenCrop({ api, fields, crop, onCreated, period }) {
  if (!crop) {
    const result = await api.post('/garden', {
      bed: fields.get('bed'), description: fields.get('description'), vegetables: fields.getAll('vegetables'),
    });
    crop = result.data;
    onCreated(crop);
  }
  const photo = fields.get('evidence');
  if (photo?.size > 0) {
    if (!period) throw new Error('No hay periodo activo para guardar la foto inicial.');
    const payload = new FormData();
    payload.append('evidence', photo);
    payload.append('stage', 'seguimiento');
    payload.append('record_date', fields.get('initial_date'));
    payload.append('story', crop.description);
    payload.append('period_id', period.id);
    await api.post(`/garden/${crop.id}/evidence`, payload);
  }
  return crop;
}
