import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {assessVisualEvidence} from './visual-evidence.mjs';

test('visual evidence rejects replaced captures, absent files and changed application',async()=>{
 // Retain the fixture directory, following the owner's no-deletion constraint.
 const directory=await mkdtemp(join(tmpdir(),'fiero-visual-evidence-'));
 const bytes=Buffer.from('original inspected capture');await writeFile(join(directory,'capture.png'),bytes);
 const manifest={applicationSha256:'application',captures:[{file:'capture.png',sha256:createHash('sha256').update(bytes).digest('hex')}]};
 assert.equal((await assessVisualEvidence(manifest,'application',directory)).passed,true);
 assert.equal((await assessVisualEvidence(manifest,'different',directory)).passed,false);
 await writeFile(join(directory,'replacement.png'),'unreviewed capture');
 assert.equal((await assessVisualEvidence({...manifest,captures:[{...manifest.captures[0],file:'replacement.png'}]},'application',directory)).passed,false);
 assert.equal((await assessVisualEvidence({...manifest,captures:[{...manifest.captures[0],file:'missing.png'}]},'application',directory)).passed,false);
 assert.equal((await assessVisualEvidence({...manifest,captures:[{...manifest.captures[0],file:'../capture.png'}]},'application',directory)).passed,false);
 assert.equal((await assessVisualEvidence({...manifest,captures:[]},'application',directory)).passed,false);
});
