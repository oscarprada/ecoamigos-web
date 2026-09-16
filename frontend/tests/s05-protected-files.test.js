import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React,{act} from 'react';
import {transformWithOxc} from 'vite';
import {installDom} from './helpers/minimalDom.js';
const document=installDom();const {createRoot}=await import('react-dom/client');
const source=fs.readFileSync(new URL('../src/components/ProtectedFile.jsx',import.meta.url),'utf8');
const {code}=await transformWithOxc(source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g,'').replace('export default ',''),'ProtectedFile.jsx',{jsx:{runtime:'classic'}});
async function fixture(){
 let button,link;const requests=[],revoked=[],created=[];
 const api={get:(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}))};
 const FakeURL={createObjectURL:blob=>{created.push(blob);return 'blob:fixture-'+created.length;},revokeObjectURL:url=>revoked.push(url)};
 const react={...React,createElement:(type,props,...children)=>{if(type==='button')button=props;if(type==='a')link=props;return React.createElement(type,props,...children);}};
 const Component=new Function('React','useState','useEffect','api','URL',code+';return ProtectedFile;')(react,React.useState,React.useEffect,api,FakeURL);
 const root=createRoot(document.createElement('div'));
 const render=(id=1)=>act(async()=>root.render(React.createElement(Component,{kind:'evidence',id})));
 await render();return {requests,revoked,created,render,get link(){return link;},click:()=>act(async()=>button.onClick()),close:()=>act(async()=>root.unmount())};
}
test('S05 Blob autenticado, sin token URL; libera al cambiar ID y desmontar',async()=>{
 const f=await fixture();assert.equal(f.requests.length,0);await f.click();const request=f.requests[0];assert.equal(request.url,'/files/evidence/1');assert.equal(request.options.responseType,'blob');
 await act(async()=>request.resolve({data:new Blob(['safe'],{type:'image/png'})}));assert.equal(f.link.href,'blob:fixture-1');assert.equal(f.link.download,'archivo');
 await f.render(2);assert.deepEqual(f.revoked,['blob:fixture-1']);assert.equal(request.options.signal.aborted,true);
 await act(async()=>f.requests[1].resolve({data:new Blob(['safe'],{type:'video/mp4'})}));await f.close();assert.deepEqual(f.revoked,['blob:fixture-1','blob:fixture-2']);
});
test('S05 desmontar cancela carga y respuesta tardía no crea Blob URL',async()=>{
 const f=await fixture();await f.click();const request=f.requests[0];await f.close();assert.equal(request.options.signal.aborted,true);
 await act(async()=>request.resolve({data:new Blob(['safe'])}));assert.deepEqual(f.created,[]);
});
test('S05 fallo de descarga permite reintentar sin crear URLs',async()=>{
 const f=await fixture();await f.click();await act(async()=>f.requests[0].reject(Error('private path')));assert.deepEqual(f.created,[]);await f.click();assert.equal(f.requests.length,2);await f.close();
});
test('S05 vistas usan ID y cliente Bearer existente, sin enlaces privados estáticos',()=>{
 for(const file of ['admin/AdminContentPage','admin/AdminReviewsPage','leader/LeaderDashboard']){
  const page=fs.readFileSync(new URL('../src/pages/'+file+'.jsx',import.meta.url),'utf8');assert.match(page,/<ProtectedFile/);assert.doesNotMatch(page,/getBackendUrl/);
 }
 const education=fs.readFileSync(new URL('../src/pages/public/EducationCategoryPage.jsx',import.meta.url),'utf8');assert.match(education,/api\/files\/public\/content/);
 assert.doesNotMatch(source,/localStorage|token=|window.open|dangerouslySetInnerHTML/);assert.match(source,/import api/);
});

test('S05 respuesta vieja tras cambiar ID no reemplaza el Blob vigente',async()=>{
 const f=await fixture();await f.click();const old=f.requests[0];await f.render(2);assert.equal(old.options.signal.aborted,true);
 await act(async()=>f.requests[1].resolve({data:new Blob(['new'],{type:'image/png'})}));
 await act(async()=>old.resolve({data:new Blob(['old'],{type:'image/png'})}));
 assert.equal(f.created.length,1);assert.equal(await f.created[0].text(),'new');assert.equal(f.link.href,'blob:fixture-1');await f.close();assert.deepEqual(f.revoked,['blob:fixture-1']);
});
