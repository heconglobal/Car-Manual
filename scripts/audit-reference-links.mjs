import {writeFile} from 'node:fs/promises';
import {sources,parts,tours} from '../src/data.js';
import {detailParts} from '../src/inspection-catalog.js';
const urls=new Map();
function collect(value){
 if(typeof value==='string'&&/^https?:\/\//.test(value)){
  const u=new URL(value),fragment=u.hash;u.hash='';const base=u.href;
  if(!urls.has(base))urls.set(base,new Set());if(fragment)urls.get(base).add(fragment);
 }else if(Array.isArray(value))value.forEach(collect);
 else if(value&&typeof value==='object')Object.values(value).forEach(collect);
}
collect([sources,parts,tours,detailParts]);
const queue=[...urls].map(([url,fragments])=>({url,fragments:[...fragments].sort()}));
const results=[];
async function inspect(entry){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(entry.url,{signal:controller.signal,redirect:'follow',headers:{Range:'bytes=0-1023'}});
  const reader=response.body?.getReader(),chunk=reader?await reader.read():null;
  const prefix=chunk?.value?new TextDecoder().decode(chunk.value.slice(0,1024)):'';
  await reader?.cancel().catch(()=>{});
  const pdf=/\.pdf(?:$|[?&#])/i.test(entry.url)||/serve_file=.*\.pdf/i.test(entry.url);
  const formatOkay=!pdf||prefix.includes('%PDF-');
  const result={...entry,httpStatus:response.status,finalUrl:response.url,contentType:response.headers.get('content-type'),formatOkay,status:response.ok&&formatOkay?'reachable':'needs-review'};
  results.push(result);console.log(result.status+' '+response.status+' '+entry.url);
 }catch(error){results.push({...entry,status:'needs-review',error:error.message});console.log('needs-review '+entry.url+' '+error.message);}
 finally{clearTimeout(timer);}
}
await Promise.allSettled(Array.from({length:4},async()=>{while(queue.length)await inspect(queue.shift());}));
results.sort((a,b)=>a.url.localeCompare(b.url));
const report={date:new Date().toISOString(),status:results.every(r=>r.status==='reachable')?'passed':'needs-review',uniqueDocuments:results.length,reachable:results.filter(r=>r.status==='reachable').length,results,limits:'Reachability and PDF signature check only. Does not verify source claims, full download integrity, fragment destinations, copyright or applicability to the original vehicle. Some sites may block automated requests.'};
await writeFile('artifacts/reference-link-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,uniqueDocuments:report.uniqueDocuments,reachable:report.reachable}));
