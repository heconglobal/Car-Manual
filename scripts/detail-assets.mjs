import {existsSync,readFileSync} from 'node:fs';
export function detailAssetInputs(){
 const path='src/detail-manifest.js';if(!existsSync(path))return [];
 const source=readFileSync(path,'utf8'),manifest=JSON.parse(source.slice(source.indexOf('{'),source.lastIndexOf('}')+1));
 return Object.values(manifest.families).map(entry=>{
  if(!/^\/models\/detail-(body|engine)-[a-f0-9]{24}\.bin\.gz$/.test(entry.url))throw Error('Unexpected authored detail asset path');
  return 'public'+entry.url;
 });
}
