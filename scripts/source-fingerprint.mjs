import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
export const comparisonInputs=['body-review.html','tail-review.html',...['IMG_5459.jpg','IMG_5461.jpg','IMG_5462.jpg'].map(f=>'references/owner-body-review/'+f)];
export function sourceFingerprint(){
 const hash=createHash('sha256');
 const files=[...comparisonInputs,'package.json','package-lock.json','playwright.config.js',...['src','tests'].flatMap(dir=>readdirSync(dir,{recursive:true}).filter(p=>/\.(js|css)$/.test(p)).map(p=>dir+'/'+p))].sort();
 for(const file of files)hash.update(file+'\0').update(readFileSync(file)).update('\0');
 return hash.digest('hex');
}
