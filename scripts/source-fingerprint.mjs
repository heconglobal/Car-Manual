import {overviewAssetInputs} from './overview-assets.mjs';
import {detailAssetInputs} from './detail-assets.mjs';
import {vehicleAssetInputs} from './vehicle-assets.mjs';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
import {localReferenceAssets} from './local-reference-assets.mjs';
export const comparisonInputs=['scripts/local-reference-assets.mjs',...localReferenceAssets,'body-review.html','tail-review.html','interior-review.html','references/1985-interior-brochure-i1.png','references/gm-seat-components-i1.png','references/gm-console-components-i1.png','references/1985-se-seat-photo-i1.jpg',...['IMG_5459.jpg','IMG_5461.jpg','IMG_5462.jpg'].map(f=>'references/owner-body-review/'+f)];
export function sourceFingerprint(){
 const hash=createHash('sha256');
 const files=[...overviewAssetInputs(),...detailAssetInputs(),...vehicleAssetInputs(),...comparisonInputs,'package.json','package-lock.json','playwright.config.js',...['src','tests'].flatMap(dir=>readdirSync(dir,{recursive:true}).filter(p=>/\.(js|css)$/.test(p)).map(p=>dir+'/'+p))].sort();
 for(const file of files)hash.update(file+'\0').update(readFileSync(file)).update('\0');
 return hash.digest('hex');
}
