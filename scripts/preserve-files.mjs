import {mkdir,copyFile,cp,stat} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const runId=()=>new Date().toISOString().replaceAll(':','-')+'-'+randomUUID().slice(0,8);
export async function preserveFiles(paths,label){
 const destination=join('preserved',runId()+'-'+label);await mkdir(destination,{recursive:true});
 for(const path of paths){
  let info;try{info=await stat(path);}catch(error){if(error.code==='ENOENT')continue;throw error;}
  const target=join(destination,path);await mkdir(dirname(target),{recursive:true});
  if(info.isDirectory())await cp(path,target,{recursive:true,errorOnExist:true,force:false});
  else await copyFile(path,target,1);
 }
 return destination;
}
