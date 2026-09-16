// Synthetic controller benchmark: never imports db.js or reads .env.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { Writable } from 'node:stream';
const require=createRequire(import.meta.url);
const count=Number(process.argv[2]??1000);
if(!Number.isInteger(count)||count<0||count>10000)throw Error('Synthetic count must be 0..10000');
process.env.EXPORT_MAX_ROWS='1000';
let source=fs.readFileSync(new URL('../src/controllers/exportController.js',import.meta.url),'utf8');
source=source.replace("import { query } from '../config/db.js';",'const query = globalThis.__syntheticExportQuery;');
source=source.replace("import { logError } from '../utils/logger.js';",'const logError=()=>{};');
source=source.replace("'exceljs'",JSON.stringify(pathToFileURL(require.resolve('exceljs')).href));
let returned=0;
globalThis.__syntheticExportQuery=async(_sql,params)=>{
  returned=Math.min(count,params?.[0]??count);
  return {rows:Array.from({length:returned},(_,i)=>({record_date:new Date('2026-01-01'),leader:'Líder sintético '+i,team:'Equipo de prueba',material_type:'Papel',quantity:'3.50',unit:'kg',status:'approved',points_awarded:10,period:'Período sintético'}))};
};
const {exportRecyclingReport}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
global.gc?.();const before=process.memoryUsage();let peak=before.heapUsed,bytes=0,status=200;
const sample=()=>{peak=Math.max(peak,process.memoryUsage().heapUsed);};const timer=setInterval(sample,5);
const res=new Writable({write(chunk,_encoding,done){bytes+=chunk.length;sample();done();}});
res.setHeader=()=>sample();res.status=value=>{status=value;return res;};res.json=()=>res.end();res.headersSent=false;
const start=performance.now();await exportRecyclingReport({query:{},user:{id:1}},res);sample();clearInterval(timer);
console.log(JSON.stringify({syntheticRows:count,returnedRows:returned,status,xlsxBytes:bytes,milliseconds:Math.round(performance.now()-start),heapDeltaMiB:+((peak-before.heapUsed)/1048576).toFixed(2),rssDeltaMiB:+((process.memoryUsage().rss-before.rss)/1048576).toFixed(2)}));
