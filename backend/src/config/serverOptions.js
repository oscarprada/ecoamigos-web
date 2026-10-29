// Pure startup validation. Never supplies or returns a fallback signing secret.
export function serverOptions(env = process.env) {
  const value = env.PORT || '3000';
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error('Configuración de puerto inválida');
  }
  const secret = env.JWT_SECRET;
  if (typeof secret !== 'string' || !secret.trim()) throw new Error('JWT_SECRET es obligatorio');
  if (env.NODE_ENV === 'production' && (Buffer.byteLength(secret, 'utf8') < 32 ||
      /^(?:replace_with_a_long_random_secret|change[_-]?me|example|test|secret)$/i.test(secret))) {
    throw new Error('JWT_SECRET no cumple los requisitos de producción');
  }
  return { port: Number(value) };
}
