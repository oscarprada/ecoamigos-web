// Contenido de ejemplo: edita los textos o añade entradas a cada lista.
export const gameContent = {
  pregunta: [
    { text: '¿Qué puedes hacer con las luces al salir de una habitación vacía?', answer: 'Apagarlas para evitar consumir energía innecesariamente.' },
    { text: '¿Cómo puedes ahorrar papel antes de imprimir?', answer: 'Revisar el documento y compartirlo en formato digital cuando sea posible.' },
  ],
  intentando: [
    { text: '¡Sigue intentando! Piensa en una acción para cuidar el agua y vuelve a girar.' },
  ],
  reto: [
    { text: 'Durante un minuto, identifica tres objetos que puedas reutilizar.' },
    { text: 'Comparte con otra persona una idea para reducir los residuos de tu día.' },
  ],
  dato: [
    { text: 'Un objeto reutilizado puede tener una segunda vida: un frasco puede servir para organizar materiales.' },
    { text: 'Cerrar la llave mientras te enjabonas ayuda a evitar el desperdicio de agua.' },
  ],
};

export const wheelSectors = Array.from({ length: 8 }, (_, index) => [
  { type: 'pregunta', label: 'Pregunta', color: '#dce9c8' },
  { type: 'intentando', label: 'Sigue intentando', color: '#f9e7b5' },
  { type: 'reto', label: 'Reto', color: '#c9e8df' },
  { type: 'dato', label: 'Dato curioso', color: '#dae4f4' },
][index % 4]);
