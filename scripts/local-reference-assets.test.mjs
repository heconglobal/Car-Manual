import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localReferenceAssets,localSourceAssetPath,assertPublishableReference} from './local-reference-assets.mjs';
test('only explicitly named authored notes can enter the distribution',()=>{
 for(const path of localReferenceAssets)assert.equal(assertPublishableReference(path),path);
 for(const path of ['references/fiero-parts-cd.pdf','references/owner-body-review/IMG_5459.jpg','references/new-note.md','references/year-library/1984.pdf'])assert.throws(()=>assertPublishableReference(path),/not approved/);
});
test('local source links retain a safe path independent of query and fragment',()=>{
 assert.equal(localSourceAssetPath('/references/interior-i1-reconstruction.md?download=1#scope'),'references/interior-i1-reconstruction.md');
 assert.equal(localSourceAssetPath('https://example.org/manual.pdf'),null);
 assert.equal(localSourceAssetPath('//example.org/manual.pdf'),null);
 for(const path of ['/references/../secret.md','/references/%2e%2e/secret.md','/references/..\\secret.md'])assert.throws(()=>localSourceAssetPath(path),/Unsafe/);
});
