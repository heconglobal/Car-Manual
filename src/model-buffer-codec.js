// Lossless transport transform: predict each attribute component from the
// preceding vertex, then group its bytes so gzip sees the repeated high bytes.
// Arithmetic wraps at the original element width, preserving float bit patterns
// as well as integer coordinates, indices, normals, UVs and signed zero.
function unsignedType(width){if(width===1)return Uint8Array;if(width===2)return Uint16Array;if(width===4)return Uint32Array;throw Error('Unsupported overview element width');}
function checkStride(stride){if(!Number.isInteger(stride)||stride<1)throw Error('Invalid overview attribute stride');}
export function packAttribute(array,stride){
 checkStride(stride);const width=array.BYTES_PER_ELEMENT,C=unsignedType(width),raw=new C(array.buffer,array.byteOffset,array.length),delta=new C(raw.length),shift=32-width*8;
 for(let i=0;i<raw.length;i++){const difference=((raw[i]-(i<stride?0:raw[i-stride]))<<shift)>>shift;delta[i]=(difference<<1)^(difference>>31);}
 const bytes=new Uint8Array(delta.buffer),packed=new Uint8Array(bytes.length);
 for(let byte=0;byte<width;byte++)for(let i=0;i<raw.length;i++)packed[byte*raw.length+i]=bytes[i*width+byte];
 return packed;
}
export function unpackAttribute(bytes,Type,stride){
 checkStride(stride);const width=Type.BYTES_PER_ELEMENT,C=unsignedType(width);if(bytes.byteLength%width)throw Error('Truncated overview attribute');
 const raw=new C(bytes.byteLength/width),view=new Uint8Array(raw.buffer);
 for(let byte=0;byte<width;byte++)for(let i=0;i<raw.length;i++)view[i*width+byte]=bytes[byte*raw.length+i];
 for(let i=0;i<raw.length;i++){const delta=(raw[i]>>>1)^-(raw[i]&1);raw[i]=(i<stride?0:raw[i-stride])+delta;}
 return new Type(raw.buffer);
}
