import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { exportError } from '../src/utils/exportError.js';
test('S11 error Blob de límite informa rechazo sin archivo incompleto',async()=>{
 const response={status:422,data:new Blob([JSON.stringify({code:'EXPORT_LIMIT_EXCEEDED',maxRows:1000,message:'SQL secret'})])};
 assert.equal(await exportError({response}),'El reporte supera el límite de 1000 filas. No se descargó un archivo incompleto. Solicita a la administración técnica revisar el volumen o ajustar la configuración.');
});
test('S11 exportación ocupada y errores arbitrarios permanecen controlados',async()=>{
 assert.match(await exportError({response:{status:429,data:{code:'EXPORT_BUSY'}}}),/en curso/);
 for(const data of [new Blob(['invalid JSON']),new Blob(['x'.repeat(5000)]),{code:'EXPORT_LIMIT_EXCEEDED',maxRows:999999},{message:'SQL secret'}])assert.equal(await exportError({response:{status:422,data}}),'No fue posible generar el reporte.');
 const source=fs.readFileSync(new URL('../src/pages/admin/AdminDashboard.jsx',import.meta.url),'utf8');assert.match(source,/alert\(await exportError\(error\)\)/);assert.match(source,/responseType: 'blob'/);
});
