import test from 'node:test';
import assert from 'node:assert/strict';
import {packAttribute,unpackAttribute} from '../src/model-buffer-codec.js';
test('transport packing preserves every bit across signed widths, index wraps and float representations',()=>{
 for(const Type of [Uint8Array,Int8Array,Uint16Array,Int16Array,Uint32Array,Float32Array])for(const stride of [1,2,3]){
  const bytes=new Uint8Array(1026*Type.BYTES_PER_ELEMENT);let seed=71;
  for(let i=0;i<bytes.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;bytes[i]=seed>>>24;}
  bytes.fill(0,0,Type.BYTES_PER_ELEMENT*6);bytes.fill(255,Type.BYTES_PER_ELEMENT*6,Type.BYTES_PER_ELEMENT*12);
  const array=new Type(bytes.buffer),decoded=unpackAttribute(packAttribute(array,stride),Type,stride);
  assert.deepEqual(new Uint8Array(decoded.buffer),bytes,Type.name+' stride '+stride);
 }
 const floats=new Float32Array([-0,0,Infinity,-Infinity,NaN,1e-30,-1e30,3.14159]);
 assert.deepEqual(new Uint8Array(unpackAttribute(packAttribute(floats,1),Float32Array,1).buffer),new Uint8Array(floats.buffer));
});
test('transport packing validates element boundaries and strides',()=>{
 assert.throws(()=>unpackAttribute(new Uint8Array(3),Uint16Array,1),/Truncated/);
 assert.throws(()=>packAttribute(new Float32Array(3),0),/stride/);
 assert.throws(()=>packAttribute(new Float64Array(3),1),/width/);
});
