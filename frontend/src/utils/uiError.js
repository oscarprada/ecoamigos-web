// Only audited, literal functional responses may reach the UI. Never render raw errors.
const messages = new Set([
  "El email ya existe",
  "El nombre del equipo ya existe",
  "Se alcanzo el maximo de 15 usuarios totales",
  "Datos inválidos",
  "Datos de usuario inválidos",
  "Usuario no encontrado",
  "Equipo inválido para el rol del usuario",
  "Datos de equipo inválidos",
  "Equipo no encontrado",
  "is_active debe ser booleano",
  "Conflicto al crear periodo",
  "Datos de periodo invalidos",
  "Contenido no encontrado",
  "Credenciales inválidas",
  "Enlace de recuperación inválido o vencido",
  "Email inválido",
  "Token o contraseña inválidos (contraseña de 1 a 72 bytes UTF-8)",
  "No fue posible restablecer la contraseña",
  "Necesitas un equipo valido asignado para registrar reciclaje",
  "record_date debe ser una fecha valida YYYY-MM-DD",
  "period_id no coincide con el periodo activo; actualiza el formulario",
  "El equipo asignado ya no existe; solicita actualizar tu asignacion",
  "Estado inválido",
  "Registro no encontrado",
  "El registro ya fue revisado",
  "No existe un periodo activo",
  "Configuracion de periodos activos inconsistente",
  "record_date debe estar dentro del periodo activo (incluidos inicio y fin)",
  "record_date no puede ser futura",
  "Material o cantidad inválidos para determinar la referencia de catálogo.",
  "La referencia de catálogo no corresponde al material y cantidad registrados.",
  "No existe una configuración de catálogo para el material y cantidad indicados."
]);
export function uiError(error, fallback = 'No fue posible completar la operación. Intenta nuevamente.') {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;
  return status >= 400 && status < 500 && messages.has(message) ? message : fallback;
}
