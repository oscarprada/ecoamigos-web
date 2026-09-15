import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React, { act } from 'react';
import { transformWithOxc } from 'vite';
import { installDom } from './helpers/minimalDom.js';
import * as session from '../src/api/session.js';
import { uiError } from '../src/utils/uiError.js';
const document=installDom();
const { createRoot }=await import('react-dom/client');
const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
let source=fs.readFileSync(new URL('../src/context/AuthContext.jsx',import.meta.url),'utf8');
source=source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g,'').replace(/export /g,'');
const {code}=await transformWithOxc(source,'AuthContext.jsx',{jsx:{runtime:'classic'}});
function module(api){const scope={React,...React,...session,api};return new Function(...Object.keys(scope),code+';return {AuthProvider,useAuth};')(...Object.values(scope));}
async function mount(api){let current;const {AuthProvider,useAuth}=module(api);function Probe(){current=useAuth();return null;}
 const root=createRoot(document.createElement('div'));await act(async()=>root.render(React.createElement(AuthProvider,null,React.createElement(Probe))));
 return {get current(){return current;},close:()=>act(async()=>root.unmount())};}
function interceptors(){let send,reject;session.attachSessionInterceptors({interceptors:{request:{use:fn=>send=fn},response:{use:(_ok,fn)=>reject=fn}}});return {send,reject};}
test('S02 login guarda solo token, recarga consulta me, logout limpia y 401 retira sesión',async()=>{
 values.clear();const user={id:1,role:'leader',team_id:2};let calls=0;
 const api={get:async()=>{calls++;return {data:user};},post:async()=>({data:{token:'fixture',user}})};
 let app=await mount(api);assert.equal(calls,0);assert.equal(app.current.user,null);
 await act(async()=>app.current.login('fixture@test.invalid','password'));assert.equal(session.getToken(),'fixture');assert.deepEqual([...values.keys()],['ecoamigos_token']);
 await app.close();app=await mount(api);assert.equal(calls,1);assert.deepEqual(app.current.user,user);
 const {send,reject}=interceptors();const config=send({url:'/admin/users',headers:{}});assert.equal(config.headers.Authorization,'Bearer fixture');
 await act(async()=>{await assert.rejects(reject({config,response:{status:401}}));});assert.equal(app.current.user,null);assert.equal(session.getToken(),null);
 await act(async()=>app.current.login('fixture@test.invalid','password'));await act(async()=>app.current.logout());assert.equal(app.current.user,null);assert.equal(session.getToken(),null);
 await app.close();
});
test('S02 403 y 500 no borran sesión; 401 tardío no borra un login posterior',async()=>{
 values.clear();session.saveToken('old');const {send,reject}=interceptors();const config=send({url:'/protected',headers:{}});
 for(const status of [403,500]) await assert.rejects(reject({config,response:{status}}));assert.equal(session.getToken(),'old');
 session.saveToken('new');await assert.rejects(reject({config,response:{status:401}}));assert.equal(session.getToken(),'new');
 assert.equal(uiError({response:{status:429,data:{message:'Demasiados intentos. Intenta de nuevo más tarde.'}}},'fallback'),'Demasiados intentos. Intenta de nuevo más tarde.');
});
test('S02 me pendiente no restaura usuario después de logout; fallo me no autoriza',async()=>{
 values.clear();session.saveToken('old');let finish;const api={get:()=>new Promise(resolve=>finish=resolve)};
 const app=await mount(api);await act(async()=>app.current.logout());await act(async()=>finish({data:{role:'admin'}}));assert.equal(app.current.user,null);await app.close();
 session.saveToken('old');const failed=await mount({get:async()=>{throw Error('offline');}});assert.equal(failed.current.user,null);assert.equal(failed.current.loading,false);await failed.close();
});
test('S02 contrato Bearer explícito, sin cookies ni usuario local como autoridad',()=>{
 const client=fs.readFileSync(new URL('../src/api/client.js',import.meta.url),'utf8');assert.match(client,/withCredentials: false/);assert.match(client,/attachSessionInterceptors/);
 assert.doesNotMatch(source,/localStorage|document.cookie/);
 const guard=fs.readFileSync(new URL('../src/components/ProtectedRoute.jsx',import.meta.url),'utf8');assert.match(guard,/!user/);assert.match(guard,/to="\/login"/);
});
