// Only the explicitly named disposable GitHub service. No dotenv/application config.
import { createRequire } from 'node:module';
const require=createRequire(new URL('../backend/package.json',import.meta.url));const {Client}=require('pg');
if(process.env.GITHUB_ACTIONS!=='true'||process.env.CI!=='true'||process.env.NODE_ENV!=='test')throw Error('Solo servicio efímero de GitHub Actions');
const client=new Client({host:'127.0.0.1',port:55432,user:'ecoamigos_ci_s12',password:'fake_ci_only_password',database:'ecoamigos_ci_s12',ssl:false,connectionTimeoutMillis:5000});
try{await client.connect();const {rows}=await client.query('SELECT current_database() AS db, current_user AS username');if(rows[0].db!=='ecoamigos_ci_s12'||rows[0].username!=='ecoamigos_ci_s12')throw Error('Servicio incorrecto');await client.query('CREATE TEMP TABLE ci_probe(id integer)');await client.query('INSERT INTO ci_probe VALUES (1)');console.log('Servicio PostgreSQL efímero verificado');}finally{await client.end();}
