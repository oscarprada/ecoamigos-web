// Genera bcrypt para el bootstrap. No conecta a PostgreSQL ni guarda contrasenas.
// Recibe la clave por stdin, no por argumentos del proceso.
import bcrypt from 'bcrypt';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
if (!password || Buffer.byteLength(password, 'utf8') > 72 || /[\r\n]/.test(password)) {
  console.error('La clave debe ser no vacia, de una linea y de hasta 72 bytes UTF-8.');
  process.exitCode = 1;
} else {
  const hash = await bcrypt.hash(password, 10);
  if (!(await bcrypt.compare(password, hash))) throw new Error('No fue posible verificar bcrypt.');
  console.log(hash);
}
