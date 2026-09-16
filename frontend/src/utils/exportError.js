// Axios delivers JSON failures as Blob when the successful response is XLSX.
export async function exportError(error) {
  const fallback = 'No fue posible generar el reporte.';
  try {
    let data = error?.response?.data;
    if (data instanceof Blob) {
      if (data.size > 4096) return fallback;
      data = JSON.parse(await data.text());
    }
    if (error?.response?.status === 422 && data?.code === 'EXPORT_LIMIT_EXCEEDED' &&
        Number.isInteger(data.maxRows) && data.maxRows >= 1 && data.maxRows <= 10000) {
      return 'El reporte supera el límite de ' + data.maxRows + ' filas. No se descargó un archivo incompleto. Solicita a la administración técnica revisar el volumen o ajustar la configuración.';
    }
    if (error?.response?.status === 429 && data?.code === 'EXPORT_BUSY') return 'Ya hay una exportación en curso. Intenta nuevamente cuando termine.';
  } catch { /* Never display server text, SQL or raw Blob errors. */ }
  return fallback;
}
