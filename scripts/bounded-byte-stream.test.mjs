import assert from 'node:assert/strict';
import {test} from 'node:test';
import {boundedByteStream} from '../src/bounded-byte-stream.js';

test('Large and empty upstream chunks preserve exact bytes with bounded reads',async()=>{
 const bytes=Uint8Array.from({length:2*1024*1024+37},(_,i)=>i%251);
 const source=new ReadableStream({start(c){c.enqueue(new Uint8Array());c.enqueue(bytes);c.close();}});
 const reader=boundedByteStream(source).getReader(),output=[];
 while(true){const {value,done}=await reader.read();if(done)break;assert(value.length<=65536);output.push(value);}
 const result=new Uint8Array(bytes.length);let offset=0;
 for(const chunk of output){result.set(chunk,offset);offset+=chunk.length;}
 assert.equal(offset,bytes.length);assert.deepEqual(result,bytes);assert.equal(source.locked,false);
});
test('Backpressure and cancellation retain only the current source chunk',async()=>{
 let reads=0,cancelReason;
 const source=new ReadableStream({pull(c){reads++;c.enqueue(new Uint8Array(2*1024*1024));},cancel(reason){cancelReason=reason;}},{highWaterMark:0});
 const reader=boundedByteStream(source).getReader();
 await Promise.resolve();assert.equal(reads,0);
 await reader.read();await reader.read();assert.equal(reads,1);
 await reader.cancel('stop');assert.equal(cancelReason,'stop');assert.equal(source.locked,false);
});
test('Cancellation unblocks a pending upstream read',async()=>{
 let cancelled=false;
 const source=new ReadableStream({cancel(){cancelled=true;}}),reader=boundedByteStream(source).getReader();
 const pending=reader.read();await reader.cancel();assert.equal((await pending).done,true);
 assert(cancelled);assert.equal(source.locked,false);
});
test('Upstream failures and invalid chunks reject and release the lock',async()=>{
 for(const invalid of [false,true]){
  let cancelled=false;
  const source=new ReadableStream({pull(c){if(invalid)c.enqueue('invalid');else c.error(new Error('upstream failed'));},cancel(){cancelled=true;}});
  await assert.rejects(boundedByteStream(source).getReader().read(),invalid?/Uint8Array/:/upstream failed/);
  assert.equal(source.locked,false);if(invalid)assert(cancelled);
 }
});
