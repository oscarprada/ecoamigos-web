import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));let count=0;
function run(command,args){const result=spawnSync(command,args,{cwd:root,stdio:'inherit',windowsHide:true});if(result.status!==0)process.exit(result.status??1);}
function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())walk(file);else if(/\.(js|mjs)$/.test(entry.name)){run(process.execPath,['--check',file]);count++;}}}
for(const folder of ['backend/src','backend/tests','backend/scripts','frontend/tests','frontend/src/utils','frontend/src/api','scripts'])walk(path.join(root,folder));
run(process.execPath,['scripts/check-workflow.mjs']);run('git',['diff','--check']);console.log('Sintaxis correcta: '+count+' archivos; YAML/contrato CI y diff correctos.');
