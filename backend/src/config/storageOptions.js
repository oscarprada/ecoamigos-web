// Configuration only: never loads .env or contacts a service.
export function storageOptions(env = process.env) {
  const provider = env.STORAGE_PROVIDER ?? (env.NODE_ENV === 'production' ? 'cloudinary' : 'local');
  if (!['local', 'cloudinary'].includes(provider) || (env.NODE_ENV === 'production' && provider !== 'cloudinary')) {
    throw new Error('Configuración de almacenamiento inválida');
  }
  return { provider };
}

export function cloudinaryOptions(env = process.env) {
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const key = env.CLOUDINARY_API_KEY;
  const secret = env.CLOUDINARY_API_SECRET;
  const folder = env.CLOUDINARY_FOLDER || 'ecoamigos';
  if (typeof cloud !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(cloud) ||
      typeof key !== 'string' || !/^\d+$/.test(key) || typeof secret !== 'string' || !secret.trim() ||
      !/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(folder) || folder.length > 100) {
    throw new Error('Configuración Cloudinary incompleta o inválida');
  }
  return { cloud, key, secret, folder };
}
