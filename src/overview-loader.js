import manifest from './overview-manifest.js';
import {decodeModel} from './model-codec.js';
import {textureFromRecipe} from './materials.js';
import {vehicleConfiguration} from './vehicle-state.js';
export async function loadVehicleOverview(){
 if(!manifest.url||!globalThis.DecompressionStream){const {createVehicleOverview}=await import('./vehicle-overview.js');return {...createVehicleOverview(),delivery:'procedural-fallback'};}
 const response=await fetch((import.meta.env?.BASE_URL||'/')+manifest.url.replace(/^\//,''));if(!response.ok)throw Error('Vehicle overview could not be downloaded');
 let bytes=new Uint8Array(await response.arrayBuffer());
 // Vite and some static hosts send Content-Encoding:gzip for .gz files, so
 // fetch may already have decompressed the body. Other hosts send raw bytes.
 const decoded=new TextDecoder().decode(bytes.subarray(0,8))==='FIEROV01';
 if(bytes.byteLength!==(decoded?manifest.decodedBytes:manifest.bytes))throw Error('Vehicle overview is incomplete');
 const expected=decoded?manifest.decodedSha256:manifest.sha256;
 if(expected&&globalThis.crypto?.subtle){const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');if(digest!==expected)throw Error('Vehicle overview failed its integrity check');}
 if(!decoded)bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 const model=decodeModel(bytes,textureFromRecipe);
 return {...model,...vehicleConfiguration(model.groups),level:'overview',delivery:'prebuilt'};
}
