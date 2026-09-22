import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
export function sourceFingerprint(){
 const hash=createHash('sha256');
 const files=['package.json','package-lock.json','playwright.config.js',...['src','tests'].flatMap(dir=>readdirSync(dir,{recursive:true}).filter(p=>/\.(js|css)$/.test(p)).map(p=>dir+'/'+p))].sort();
 for(const file of files)hash.update(file+'\0').update(readFileSync(file)).update('\0');
 return hash.digest('hex');
}
