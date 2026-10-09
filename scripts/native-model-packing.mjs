import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packAttribute,unpackAttribute} from '../src/model-buffer-codec.js';

const types={Float32Array,Uint32Array,Uint16Array,Uint8Array,Int16Array,Int8Array};
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const align=n=>n+(4-n%4)%4;
export function nativeHeader(metadata){
 const json=Buffer.from(JSON.stringify(metadata)),header=Buffer.alloc(align(12+json.length));
 header.write('FIEROV01');header.writeUInt32LE(json.length,8);json.copy(header,12);return header;
}
// Offline generator/audit contract. No coordinate conversion or quantization.
export function inspectNativeContainer(bytes,packing){
 const data=Buffer.from(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 assert(data.length>=12&&data.subarray(0,8).toString()==='FIEROV01','Invalid native header');
 const end=12+data.readUInt32LE(8),start=align(end);assert(start<=data.length,'Truncated native metadata');
 const metadata=JSON.parse(data.subarray(12,end).toString());assert.equal(metadata.version,1);
 assert(data.subarray(end,start).every(v=>v===0),'Nonzero native header padding');
 assert.deepEqual(nativeHeader(metadata),data.subarray(0,start),'Noncanonical native metadata');
 const entries=[];let cursor=0;
 for(const group of metadata.groups)for(const mesh of group.meshes){
  for(const entry of [...Object.values(mesh.attributes),mesh.index].filter(Boolean)){
   const Type=types[entry.type];assert(Type,'Unsupported native array');
   for(const key of ['offset','length','itemSize'])assert(Number.isSafeInteger(entry[key])&&entry[key]>=0,'Invalid native '+key);
   assert(entry.itemSize>0&&entry.length%entry.itemSize===0,'Invalid native stride');
   assert.equal(entry.quantization,null,'Quantized vehicle input is prohibited');
   assert.equal(entry.packing,packing,'Unexpected native packing');
   assert.equal(entry.offset,align(cursor),'Nonsequential native layout');
   assert(data.subarray(start+cursor,start+entry.offset).every(v=>v===0),'Nonzero native padding');
   const size=entry.length*Type.BYTES_PER_ELEMENT;cursor=entry.offset+size;
   assert(start+cursor<=data.length,'Native attribute exceeds payload');
   entries.push({entry,Type,size});
  }
 }
 assert.equal(start+cursor,data.length,'Native payload has trailing bytes');
 return{data,metadata,start,entries};
}
export function packNativeContainer(bytes){
 const {data,metadata,start,entries}=inspectNativeContainer(bytes,null);
 for(const {entry}of entries)entry.packing='delta-byte-plane';
 const header=nativeHeader(metadata),output=Buffer.alloc(header.length+data.length-start);header.copy(output);
 for(const {entry,Type,size}of entries){
  // Copy avoids assuming the caller's Buffer byteOffset is aligned.
  const original=Uint8Array.from(data.subarray(start+entry.offset,start+entry.offset+size));
  const values=new Type(original.buffer),packed=packAttribute(values,entry.itemSize);
  const restored=unpackAttribute(packed,Type,entry.itemSize);
  assert(Buffer.from(restored.buffer,restored.byteOffset,restored.byteLength).equals(Buffer.from(original)),'Lossless native packing changed attribute bits');
  output.set(packed,header.length+entry.offset);
 }
 return output;
}
export function restoredNativeIdentity(bytes){
 const {data,metadata,start,entries}=inspectNativeContainer(bytes,'delta-byte-plane');
 for(const {entry}of entries)entry.packing=null;
 const header=nativeHeader(metadata),hash=createHash('sha256').update(header);let cursor=0;
 for(const {entry,Type,size}of entries){
  hash.update(data.subarray(start+cursor,start+entry.offset));
  const restored=unpackAttribute(data.subarray(start+entry.offset,start+entry.offset+size),Type,entry.itemSize);
  hash.update(new Uint8Array(restored.buffer,restored.byteOffset,restored.byteLength));cursor=entry.offset+size;
 }
 return{sha256:hash.digest('hex'),bytes:header.length+data.length-start};
}
