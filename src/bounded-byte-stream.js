// DecompressionStream output boundaries are browser-controlled. Rechunk lazily
// before the decoder applies its input limit; do not queue every slice or copy
// the complete inflated model. At most one upstream chunk is retained here.
export function boundedByteStream(stream,maxChunkBytes=64*1024){
 if(!Number.isSafeInteger(maxChunkBytes)||maxChunkBytes<1)throw new Error('Invalid byte stream chunk limit');
 const reader=stream.getReader();let pending=null,offset=0,released=false;
 const release=()=>{if(!released){released=true;reader.releaseLock();}};
 return new ReadableStream({
  async pull(controller){
   try{
    while(!pending){
     const {value,done}=await reader.read();
     if(done){release();controller.close();return;}
     if(!(value instanceof Uint8Array))throw new Error('Byte stream must contain Uint8Array chunks');
     if(value.byteLength){pending=value;offset=0;}
    }
    const end=Math.min(offset+maxChunkBytes,pending.length);
    controller.enqueue(pending.subarray(offset,end));offset=end;
    if(offset===pending.length){pending=null;offset=0;}
   }catch(error){
    pending=null;
    try{await reader.cancel(error);}catch{/* Preserve the original stream error. */}
    release();controller.error(error);
   }
  },
  async cancel(reason){
   pending=null;
   try{await reader.cancel(reason);}finally{release();}
  },
 },{highWaterMark:0});
}
