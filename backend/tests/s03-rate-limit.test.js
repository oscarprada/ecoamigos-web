import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAuthRateLimit } from '../src/middleware/authRateLimit.js';
import { corsOptions, configureProxy } from '../src/middleware/httpConfig.js';
test('S03 ventana, IP, Retry-After, capacidad acotada y reinicio determinista',()=>{
  let now=0,allowed=0;const limit=createAuthRateLimit({max:2,windowMs:1000,now:()=>now,capacity:2});
  const call=ip=>{const out={};const res={set:(k,v)=>out[k]=v,status:s=>{out.status=s;return res;},json:b=>out.body=b};limit({ip},res,()=>allowed++);return out;};
  call('one');call('one');assert.equal(allowed,2);
  assert.equal(call('one').status,429);assert.equal(call('one')['Retry-After'],'1');
  call('two');assert.equal(allowed,3);assert.equal(call('three').status,429);
  now=1000;call('one');call('three');assert.equal(allowed,5);
});
test('S03 IP directa ignora X-Forwarded-For; proxy solo si configurado',async()=>{
  const app=express();configureProxy(app,{});assert.equal(app.get('trust proxy'),false);
  app.use(createAuthRateLimit({max:1,windowMs:1000}));app.get('/',(_req,res)=>res.json({ok:true}));
  const server=await new Promise(resolve=>{const server=app.listen(0,'127.0.0.1',()=>resolve(server));});
  try {const url='http://127.0.0.1:'+server.address().port;
    assert.equal((await fetch(url,{headers:{'X-Forwarded-For':'1.1.1.1'}})).status,200);
    assert.equal((await fetch(url,{headers:{'X-Forwarded-For':'2.2.2.2'}})).status,429);
  } finally {await new Promise(resolve=>server.close(resolve));}
  const proxy=express();configureProxy(proxy,{TRUSTED_PROXIES:'127.0.0.1'});assert.equal(proxy.get('trust proxy fn')('127.0.0.1',0),true);assert.equal(proxy.get('trust proxy fn')('8.8.8.8',0),false);
  assert.throws(()=>corsOptions({CORS_ORIGINS:'*'}));assert.equal(corsOptions({CLIENT_URL:'https://example.test'}).credentials,true);
});
