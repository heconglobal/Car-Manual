import {Session} from 'node:inspector';
import {promisify} from 'node:util';
import {performance} from 'node:perf_hooks';
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint} from './source-fingerprint.mjs';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createVehicle}=await import('../src/model.js');
const session=new Session();session.connect();const post=promisify(session.post.bind(session));
await post('Profiler.enable');await post('Profiler.start');
const startedAt=new Date().toISOString(),sourceSha256=sourceFingerprint(),start=performance.now();
const model=createVehicle();
const constructionMs=performance.now()-start,{profile}=await post('Profiler.stop');session.disconnect();
await writeFile('artifacts/model-construction.cpuprofile',JSON.stringify(profile));
const nodes=new Map(profile.nodes.map(n=>[n.id,n])),self=new Map(),inclusive=new Map(),parent=new Map();
for(const n of profile.nodes)for(const child of n.children||[])parent.set(child,n.id);
for(let i=0;i<profile.samples.length;i++){
 const id=profile.samples[i],ms=(profile.timeDeltas[i]||0)/1000;self.set(id,(self.get(id)||0)+ms);
 for(let at=id;at;at=parent.get(at))inclusive.set(at,(inclusive.get(at)||0)+ms);
}
const rows=values=>[...values].sort((a,b)=>b[1]-a[1]).slice(0,35).map(([id,ms])=>{const f=nodes.get(id).callFrame;return {function:f.functionName||'(anonymous)',file:f.url.replace('file://'+process.cwd()+'/',''),line:f.lineNumber+1,milliseconds:ms};});
const report={startedAt,finishedAt:new Date().toISOString(),sourceSha256,constructionMs,self:rows(self),inclusive:rows(inclusive),limits:'Single Node CPU sample during concurrent regression with stubbed canvas. Identifies construction hotspots; excludes browser layout, actual canvas drawing, shader compilation and rendering. It does not establish an isolated device benchmark.'};
await writeFile('artifacts/model-construction-hotspots.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,self:report.self.slice(0,12),inclusive:report.inclusive.slice(0,12)},null,2));
model.root.traverse(o=>o.geometry?.dispose());
