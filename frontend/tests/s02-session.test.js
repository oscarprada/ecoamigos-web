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
test('S02 login sin token, recarga consulta me, logout remoto limpia y 401 retira sesión',async()=>{
 values.clear();values.set('ecoamigos_token','legacy');const user={id:1,role:'leader',team_id:2};let calls=0,authenticated=false;
 const api={get:async()=>{calls++;if(!authenticated)throw Error('401');return {data:user};},post:async url=>{authenticated=url==='/auth/login';return {data:{user}};}};
 let app=await mount(api);assert.equal(calls,1);assert.equal(app.current.user,null);assert.equal(values.size,0);
 await act(async()=>app.current.login('fixture@test.invalid','password'));assert.equal(values.size,0);assert.deepEqual(app.current.user,user);
 await app.close();app=await mount(api);assert.equal(calls,2);assert.deepEqual(app.current.user,user);
 const {send,reject}=interceptors();const config=send({url:'/admin/users',method:'post',headers:{}});
 assert.equal(config.headers.Authorization,undefined);assert.equal(config.headers['X-Ecoamigos-Request'],'1');
 await act(async()=>{await assert.rejects(reject({config,response:{status:401}}));});assert.equal(app.current.user,null);
 await act(async()=>app.current.login('fixture@test.invalid','password'));await act(async()=>app.current.logout());assert.equal(app.current.user,null);assert.equal(authenticated,false);
 await app.close();
});
test('S02 403/500 no invalidan y 401 tardío no retira login posterior',async()=>{
 const {send,reject}=interceptors();const config=send({url:'/protected',headers:{}});const before=session.sessionRevision();
 for(const status of [403,500])await assert.rejects(reject({config,response:{status}}));assert.equal(session.sessionRevision(),before);
 session.advanceSession();const next=session.sessionRevision();await assert.rejects(reject({config,response:{status:401}}));assert.equal(session.sessionRevision(),next);
 const login=send({url:'/auth/login',method:'post',headers:{}});await assert.rejects(reject({config:login,response:{status:401}}));assert.equal(session.sessionRevision(),next);
 const anonymous=send({url:'/auth/me',headers:{}});await assert.rejects(reject({config:anonymous,response:{status:401}}));assert.equal(session.sessionRevision(),next);
 assert.equal(uiError({response:{status:429,data:{message:'Demasiados intentos. Intenta de nuevo más tarde.'}}},'fallback'),'Demasiados intentos. Intenta de nuevo más tarde.');
});
test('S02 me pendiente no restaura usuario después de logout; fallo me no autoriza',async()=>{
 let finish;const api={get:()=>new Promise(resolve=>finish=resolve),post:async()=>({data:{}})};
 const app=await mount(api);await act(async()=>app.current.logout());await act(async()=>finish({data:{role:'admin'}}));assert.equal(app.current.user,null);await app.close();
 const failed=await mount({get:async()=>{throw Error('offline');}});assert.equal(failed.current.user,null);assert.equal(failed.current.loading,false);await failed.close();
});
test('S02 logout fallido informa error sin fingir eliminación de cookie',async()=>{
 const user={id:1,role:'leader'};const app=await mount({get:async()=>({data:user}),post:async()=>{throw Error('offline');}});
 let success;await act(async()=>{success=await app.current.logout();});assert.equal(success,false);assert.deepEqual(app.current.user,user);await app.close();
});
test('S02 login/logout concurrentes serializan las respuestas que cambian cookies',async()=>{
 let finish;const calls=[];const api={get:async()=>{throw Error('401');},post:url=>{calls.push(url);return url==='/auth/login'?new Promise(resolve=>finish=resolve):Promise.resolve({data:{}});}};
 const app=await mount(api);let login,logout;
 await act(async()=>{login=app.current.login('a','b').catch(error=>error);await Promise.resolve();logout=app.current.logout();});
 assert.deepEqual(calls,['/auth/login']);
 await act(async()=>{finish({data:{user:{id:1}}});await login;await logout;});assert.deepEqual(calls,['/auth/login','/auth/logout']);assert.equal(app.current.user,null);await app.close();
});
test('S02 contrato cookie: Axios credentials, sin almacenamiento/lectura JWT ni Authorization',()=>{
 const client=fs.readFileSync(new URL('../src/api/client.js',import.meta.url),'utf8');assert.match(client,/withCredentials: true/);
 const sessionSource=fs.readFileSync(new URL('../src/api/session.js',import.meta.url),'utf8');
 assert.doesNotMatch(sessionSource,/localStorage\.(getItem|setItem)|Authorization|Bearer|document.cookie/);
 assert.doesNotMatch(source,/getToken|saveToken|data.token|document.cookie/);
 const guard=fs.readFileSync(new URL('../src/components/ProtectedRoute.jsx',import.meta.url),'utf8');assert.match(guard,/!user/);assert.match(guard,/to="\/login"/);
});
