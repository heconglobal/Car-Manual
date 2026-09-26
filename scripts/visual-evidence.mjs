import {readFile} from 'node:fs/promises';
import {basename,join} from 'node:path';
import {createHash} from 'node:crypto';

// A screenshot is eligible only while its bytes still match what was reviewed.
// Same-name captures from a later run must not silently inherit that review.
export async function assessVisualEvidence(manifest,applicationSha256,directory='artifacts'){
 const captures=[];
 for(const record of manifest?.captures||[]){
  let reason=null;
  if(typeof record.file!=='string'||basename(record.file)!==record.file)reason='Invalid capture filename';
  else try{
   const hash=createHash('sha256').update(await readFile(join(directory,record.file))).digest('hex');
   if(hash!==record.sha256)reason='Capture changed after inspection';
  }catch(error){reason='Capture unavailable: '+error.code;}
  captures.push({file:record.file,valid:!reason,...(reason?{reason}:{})});
 }
 const sameApplication=manifest?.applicationSha256===applicationSha256;
 return {passed:!!sameApplication&&captures.length>0&&captures.every(c=>c.valid),sameApplication,captures};
}
