import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React, { act } from 'react';
import { transformWithOxc } from 'vite';
import { installDom } from './helpers/minimalDom.js';
import { uiError } from '../src/utils/uiError.js';

const document = installDom();
const { createRoot } = await import('react-dom/client');
const src = file => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
async function compile(source, exports, bindings) {
  source = source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '').replace(/export default /g, '').replace(/export /g, '');
  const { code } = await transformWithOxc(source, 'fixture.jsx', { jsx: { runtime: 'classic' } });
  const scope = { React, ...bindings };
  return new Function(...Object.keys(scope), code + '\nreturn {' + exports + '};')(...Object.values(scope));
}

async function fixture() {
  let fileProps, formProps, pending;
  const sent=[],toasts=[];
  const { LoadState } = await compile(src('components/LoadState.jsx'), 'LoadState', {});
  const captureReact={...React,createElement(type,props,...children){
    if(type==='input' && props?.type==='file')fileProps=props;
    if(type==='form')formProps=props;
    return React.createElement(type,props,...children);
  }};
  const api={get:async()=>({data:{currentPeriod:{id:1,name:'Fixture'}}}),post:async(url,payload)=>{
    assert.equal(url,'/recycling');sent.push(payload);
    return new Promise((resolve,reject)=>{pending={resolve,reject};});
  }};
  const showToast=(...args)=>toasts.push(args);
  const { RegisterRecyclingPage }=await compile(src('pages/leader/RegisterRecyclingPage.jsx'),'RegisterRecyclingPage',{
    ...React,React:captureReact,api,useToast:()=>({showToast}),LoadState,uiError,
  });
  const container=document.createElement('div'),root=createRoot(container);
  await act(async()=>root.render(React.createElement(RegisterRecyclingPage)));
  const input=fileProps.ref.current;input.value='';let selected;
  Object.defineProperty(input,'files',{get:()=>input.value && selected ? [selected] : []});
  return {sent,toasts,input,container,
    select:async file=>{
      const next='fixture-path/'+file.name;
      if(input.value===next)return false; // Models the native picker suppressing an unchanged choice.
      selected=file;input.value=next;
      await act(async()=>fileProps.onChange({target:input}));return true;
    },
    submit:async()=>{
      let task;await act(async()=>{task=formProps.onSubmit({preventDefault(){}});});return {task};
    },
    respond:async(success,task)=>{await act(async()=>{success?pending.resolve({data:{id:1}}):pending.reject(new Error('fixture failure'));await task;});},
    unmount:async()=>{await act(async()=>root.unmount());},
  };
}
const fileA=()=>new File(['evidence A'],'A.png',{type:'image/png'});

test('éxito limpia estado/input, no arrastra evidencia y permite el mismo archivo',async()=>{
  const f=await fixture();try{
    const a=fileA();assert.equal(await f.select(a),true);
    const first=await f.submit();assert.equal(f.sent[0].get('evidence'),a);
    assert.match(f.input.value,/A.png/);assert.equal(f.toasts.length,0,'sin éxito antes de respuesta');
    await f.respond(true,first.task);assert.equal(f.input.value,'');assert.equal(f.input.files.length,0);
    const second=await f.submit();assert.equal(f.sent[1].has('evidence'),false,'estado sin File anterior');
    assert.notEqual(f.sent[0],f.sent[1]);await f.respond(true,second.task);
    assert.equal(await f.select(a),true,'mismo archivo genera selección nueva tras reset');
    const third=await f.submit();assert.equal(f.sent[2].get('evidence'),a);
    await f.respond(true,third.task);assert.equal(f.input.value,'');
  }finally{await f.unmount();}
});
test('archivo nuevo reemplaza al anterior en FormData',async()=>{
  const f=await fixture();try{
    await f.select(fileA());const b=new File(['B'],'B.png',{type:'image/png'});await f.select(b);
    const {task}=await f.submit();assert.deepEqual(f.sent[0].getAll('evidence'),[b]);
    assert.match(f.input.value,/B.png/);await f.respond(true,task);assert.equal(f.input.value,'');
  }finally{await f.unmount();}
});
test('POST fallido conserva selección y datos; reintento usa el File conservado',async()=>{
  const f=await fixture();try{
    const a=fileA();await f.select(a);const first=await f.submit();
    await f.respond(false,first.task);
    assert.match(f.input.value,/A.png/);assert.equal(f.input.files[0],a);
    assert.equal(f.toasts.at(-1)[1],'error');assert.equal(f.toasts.some(t=>t[1]==='success'),false);
    const retry=await f.submit();assert.equal(f.sent[1].get('evidence'),a);
    for(const [key,value] of f.sent[0])assert.equal(f.sent[1].get(key),value);
    await f.respond(true,retry.task);assert.equal(f.input.value,'');assert.equal(f.input.files.length,0);
  }finally{await f.unmount();}
});
