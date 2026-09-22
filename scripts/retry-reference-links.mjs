import {readFile,writeFile} from 'node:fs/promises';
const report=JSON.parse(await readFile('artifacts/reference-link-audit.json'));
for(const entry of report.results.filter(r=>r.status!=='reachable')){
 const first={...entry},startedAt=new Date().toISOString();
 try{
  const response=await fetch(entry.url,{signal:AbortSignal.timeout(50000),headers:{Range:'bytes=0-1023'}}),reader=response.body.getReader(),chunk=await reader.read();await reader.cancel();
  const prefix=new TextDecoder().decode(chunk.value.slice(0,1024)),formatOkay=prefix.includes('%PDF-'),retry={startedAt,finishedAt:new Date().toISOString(),httpStatus:response.status,contentType:response.headers.get('content-type'),formatOkay};
  entry.attempts=[first,retry];if(response.ok&&formatOkay)Object.assign(entry,{status:'reachable',httpStatus:response.status,formatOkay,contentType:retry.contentType});
  console.log(entry.status,entry.url);
 }catch(error){entry.attempts=[first,{startedAt,error:error.message}];console.log('needs-review',entry.url,error.message);}
}
report.retriedAt=new Date().toISOString();report.reachable=report.results.filter(r=>r.status==='reachable').length;report.status=report.reachable===report.uniqueDocuments?'passed-after-retry':'needs-review';
await writeFile('artifacts/reference-link-audit.json',JSON.stringify(report,null,2)+'\n');console.log({status:report.status,reachable:report.reachable,total:report.uniqueDocuments});
