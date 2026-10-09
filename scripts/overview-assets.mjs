import {existsSync,readFileSync} from 'node:fs';
export function overviewAssetInputs(){
 const path='src/overview-manifest.js';if(!existsSync(path))return [];
 const text=readFileSync(path,'utf8'),manifest=JSON.parse(text.slice(text.indexOf('{'),text.lastIndexOf('}')+1));
 if(!/^\/models\/overview-[a-f0-9]{24}\.bin\.gz$/.test(manifest.url))throw Error('Unexpected overview asset path');
 return ['public'+manifest.url];
}
