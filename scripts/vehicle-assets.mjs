import {existsSync,readFileSync} from 'node:fs';
export function vehicleAssetInputs(){
 const path='src/vehicle-manifest.js';if(!existsSync(path))return [];
 const source=readFileSync(path,'utf8'),manifest=JSON.parse(source.slice(source.indexOf('{'),source.lastIndexOf('}')+1));
 if(!/^\/models\/vehicle-[a-f0-9]{24}\.fiero$/.test(manifest.url))throw Error('Unexpected authored vehicle asset path');
 return ['public'+manifest.url];
}
