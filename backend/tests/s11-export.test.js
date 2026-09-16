import { postgresHarness } from './helpers/postgresCluster.js';
import ExcelJS from 'exceljs';
import jwt from 'jsonwebtoken';
import { authModuleUrl } from './helpers/authModule.js';
// S11: only a new disposable PostgreSQL cluster; never loads .env or application DB.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import pg from 'pg';
import express from 'express';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
const materialTypes = ['papel_carton', 'plastico', 'vidrio', 'metal', 'organico'];
const closeTo = (actual, expected) => assert.ok(
  Math.abs(Number(actual) - expected) < 1e-10, `${actual} != ${expected}`,
);

test('S11: exportación XLSX limitada en PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-s11-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 's11-export.test.js' });
  let port;
  let started = false;
  let client;
  let testPool;
  let server;
  const previousLimit=process.env.EXPORT_MAX_ROWS,previousSecret=process.env.JWT_SECRET;
  try {
    port = await start();
    started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await client.connect();
    const psql = args => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args]);
    ok(psql(['-f', 'database/schema.sql']));
    ok(psql(['-f', 'database/import_points_catalog.sql']));
    const catalogBefore = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
    testPool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });


    process.env.EXPORT_MAX_ROWS='1000';process.env.JWT_SECRET='s11-only-temporary-secret';
    let fail=false,hold=null,entered;const seen=[];
    const transport={query:async(sql,params)=>{seen.push({sql,params});if(fail)throw Error('SECRET SQL internal/path');if(hold){entered();await hold;}return testPool.query(sql,params);}};
    globalThis.__s11Export=transport;
    let code=fs.readFileSync(path.join(root,'backend/src/controllers/exportController.js'),'utf8');
    code=code.replace("import { query } from '../config/db.js';",'const transport=globalThis.__s11Export;const query=(...args)=>transport.query(...args);');
    code=code.replace("import { logError } from '../utils/logger.js';",'const logError=()=>{};');
    code=code.replace("'exceljs'",JSON.stringify(pathToFileURL(require.resolve('exceljs')).href));
    const controllerUrl='data:text/javascript;base64,'+Buffer.from(code).toString('base64');
    const controller=await import(controllerUrl);delete globalThis.__s11Export;
    let routes=fs.readFileSync(path.join(root,'backend/src/routes/adminRoutes.js'),'utf8');
    routes=routes.replace(/import \{\r?\n([\s\S]*?)\} from '..\/controllers\/adminController.js';/,(_,names)=>'const {'+names+'}=new Proxy({}, {get:()=>()=>{throw Error("Unrelated route in S11 test");}});');
    routes=routes.replace("'express'",JSON.stringify(pathToFileURL(require.resolve('express')).href));
    routes=routes.replace("'../middleware/uploadMiddleware.js'",JSON.stringify(new URL('../src/middleware/uploadMiddleware.js',import.meta.url).href));
    routes=routes.replace("'../controllers/exportController.js'",JSON.stringify(controllerUrl));
    routes=routes.replace("'../middleware/authMiddleware.js'",JSON.stringify(await authModuleUrl(testPool)));
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routes).toString('base64'));
    const app=express();app.use('/api/admin',router);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Equipo normal','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Admin','admin@test.invalid','fixture','admin',null),('Líder normal','leader@test.invalid','fixture','leader',1)");
    await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Período normal','2026-01-01','2026-12-31',true)");
    const request=(id=1,suffix='')=>fetch('http://127.0.0.1:'+server.address().port+'/api/admin/export/excel'+suffix,{headers:id?{Authorization:'Bearer '+jwt.sign({id,sv:0},process.env.JWT_SECRET,{expiresIn:'5m'})}:{}});
    const reset=()=>client.query('DELETE FROM recycling_records');
    const seed=count=>client.query("INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,unit,quality_level,status,points_awarded,record_date) SELECT 2,1,1,'papel_carton',3.50,'kg','alta','approved',-7,'2026-01-01'::date FROM generate_series(1,$1)",[count]);
    const read=async(response)=>{assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/spreadsheetml/);assert.match(response.headers.get('content-disposition'),/Reporte_Ecoamigos.xlsx/);const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(Buffer.from(await response.arrayBuffer()));return workbook.getWorksheet('Reporte Ecoamigos');};
    await t.test('admin exporta vacío con encabezados y formato conservados',async()=>{
      const sheet=await read(await request());assert.equal(sheet.rowCount,1);assert.deepEqual(sheet.getRow(1).values.slice(1),['Fecha','Líder','Equipo','Material','Cantidad','Unidad','Estado','Puntos','Período']);assert.equal(sheet.getRow(1).font.bold,true);assert.equal(sheet.views[0].ySplit,1);assert.equal(sheet.autoFilter,'A1:I1');
    });
    await t.test('no autenticado y líder rechazados antes de consulta de exportación',async()=>{const n=seen.length;assert.equal((await request(null)).status,401);assert.equal((await request(2)).status,403);assert.equal(seen.length,n);});
    await t.test('dataset pequeño y texto normal; no existían filtros de servidor',async()=>{await seed(1);const sheet=await read(await request(1,'?status=pending'));assert.equal(sheet.rowCount,2);assert.equal(sheet.getCell('B2').value,'Líder normal');assert.equal(sheet.getCell('E2').value,'3.50');assert.equal(sheet.getCell('F2').value,'kg');assert.equal(sheet.getCell('G2').value,'approved');assert.equal(sheet.getCell('H2').value,-7);assert.equal(sheet.getCell('I2').value,'Período normal');assert.ok(sheet.getCell('A2').value instanceof Date);});
    for(const prefix of ['=','+','-','@'])await t.test('texto '+prefix+' es string XLSX, nunca fórmula; números no se alteran',async()=>{
      const value=prefix+'SUM(1,2)';await client.query('UPDATE users SET name=$1 WHERE id=2',[value]);await client.query('UPDATE teams SET name=$1 WHERE id=1',[value]);await client.query('UPDATE periods SET name=$1 WHERE id=1',[value]);await client.query('UPDATE recycling_records SET unit=$1',[value]);const sheet=await read(await request());
      for(const col of ['B','C','F','I']){assert.equal(sheet.getCell(col+'2').type,ExcelJS.ValueType.String);assert.equal(sheet.getCell(col+'2').value,value);assert.equal(sheet.getCell(col+'2').formula,undefined);}assert.equal(sheet.getCell('H2').type,ExcelJS.ValueType.Number);assert.equal(sheet.getCell('H2').value,-7);
    });
    await t.test('cercano y límite exacto permitidos; SQL acota filas antes de workbook',async()=>{await reset();await seed(999);assert.equal((await read(await request())).rowCount,1000);await seed(1);assert.equal((await read(await request())).rowCount,1001);assert.match(seen.at(-1).sql,/LIMIT \$1/);assert.deepEqual(seen.at(-1).params,[1001]);});
    await t.test('límite+1 rechaza sin Excel ni truncamiento silencioso',async()=>{await seed(1);const response=await request();assert.equal(response.status,422);assert.equal(response.headers.get('content-disposition'),null);assert.deepEqual(await response.json(),{message:'El reporte supera el límite de exportación',code:'EXPORT_LIMIT_EXCEEDED',maxRows:1000});});
    await t.test('configuración inválida controlada; máximo configurable y acotado',async()=>{assert.equal(controller.exportMaxRows({}),1000);assert.equal(controller.exportMaxRows({EXPORT_MAX_ROWS:'25'}),25);for(const raw of ['','0','-1','10001','1.5','secret'])assert.throws(()=>controller.exportMaxRows({EXPORT_MAX_ROWS:raw}));process.env.EXPORT_MAX_ROWS='invalid';const response=await request();assert.equal(response.status,500);assert.deepEqual(await response.json(),{message:'Error al generar el reporte'});process.env.EXPORT_MAX_ROWS='1000';});
    await t.test('SQL fallido no expone secreto/stack y libera exclusión',async()=>{fail=true;const response=await request();assert.equal(response.status,500);assert.deepEqual(await response.json(),{message:'Error al generar el reporte'});fail=false;await reset();assert.equal((await request()).status,200);});
    await t.test('segunda exportación simultánea recibe 429 y la siguiente funciona',async()=>{let release;hold=new Promise(resolve=>release=resolve);const ready=new Promise(resolve=>entered=resolve);const first=request();await ready;const second=await request();assert.equal(second.status,429);assert.equal((await second.json()).code,'EXPORT_BUSY');release();hold=null;assert.equal((await first).status,200);assert.equal((await request()).status,200);});

    await t.test('límite personalizado se aplica en SQL y HTTP',async()=>{
      await reset();await seed(2);process.env.EXPORT_MAX_ROWS='2';assert.equal((await read(await request())).rowCount,3);assert.deepEqual(seen.at(-1).params,[3]);await seed(1);assert.equal((await request()).status,422);process.env.EXPORT_MAX_ROWS='1000';
    });
    await t.test('fallo XLSX controlado libera exclusión y no expone error original',async()=>{
      const proto=Object.getPrototypeOf(new ExcelJS.Workbook().xlsx);const original=proto.write;proto.write=async function(){throw Error('SECRET XLSX internal/path');};
      try{const response=await request();assert.equal(response.status,500);assert.deepEqual(await response.json(),{message:'Error al generar el reporte'});}
      finally{proto.write=original;}
      assert.equal((await request()).status,200);
    });
    assert.equal(catalogBefore.length,56);assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
  } finally {
    if(previousLimit===undefined)delete process.env.EXPORT_MAX_ROWS;else process.env.EXPORT_MAX_ROWS=previousLimit;
    if(previousSecret===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=previousSecret;
    if(server)await new Promise(resolve=>server.close(resolve));
    if(testPool)await testPool.end();if(client)await client.end();
    if(started)ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
