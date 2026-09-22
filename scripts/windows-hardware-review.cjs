// Run with a native Windows Node executable against the dedicated Edge test
// profile on loopback port 9224. No default/user browser profile is accessed.
const fs=require('fs'),path=require('path'),http=require('http'),net=require('net'),crypto=require('crypto');
const output=path.resolve(__dirname,'../artifacts');
const reviewInput=JSON.parse(fs.readFileSync(path.join(output,'native-review-input.json'),'utf8'));
const getJSON=url=>new Promise((resolve,reject)=>http.get(url,r=>{let body='';r.on('data',d=>body+=d);r.on('end',()=>{try{resolve(JSON.parse(body));}catch(e){reject(e);}});}).on('error',reject));
async function connect(url){
 const u=new URL(url),socket=net.connect(Number(u.port),u.hostname);let buffer=Buffer.alloc(0),handshake=false,nextId=0,fragments=[],pending=new Map();
 const events=[];
 const frame=(opcode,payload)=>{const mask=crypto.randomBytes(4),n=payload.length;let h;if(n<126){h=Buffer.from([0x80|opcode,0x80|n]);}else if(n<65536){h=Buffer.alloc(4);h[0]=0x80|opcode;h[1]=0xfe;h.writeUInt16BE(n,2);}else{h=Buffer.alloc(10);h[0]=0x80|opcode;h[1]=0xff;h.writeUInt32BE(0,2);h.writeUInt32BE(n,6);}const data=Buffer.from(payload);for(let i=0;i<n;i++)data[i]^=mask[i%4];socket.write(Buffer.concat([h,mask,data]));};
 const opened=new Promise((resolve,reject)=>{
  socket.on('error',reject);socket.on('connect',()=>socket.write('GET '+u.pathname+' HTTP/1.1\r\nHost: '+u.host+'\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: '+crypto.randomBytes(16).toString('base64')+'\r\nSec-WebSocket-Version: 13\r\n\r\n'));
  socket.on('data',data=>{buffer=Buffer.concat([buffer,data]);if(!handshake){const end=buffer.indexOf('\r\n\r\n');if(end<0)return;const headers=buffer.slice(0,end).toString();if(!headers.startsWith('HTTP/1.1 101')){reject(Error(headers));return;}buffer=buffer.slice(end+4);handshake=true;resolve();}
   while(buffer.length>=2){const first=buffer[0],second=buffer[1],opcode=first&15;let n=second&127,offset=2;if(n===126){if(buffer.length<4)return;n=buffer.readUInt16BE(2);offset=4;}else if(n===127){if(buffer.length<10)return;if(buffer.readUInt32BE(2))throw Error('Oversized CDP frame');n=buffer.readUInt32BE(6);offset=10;}const masked=!!(second&128);if(buffer.length<offset+(masked?4:0)+n)return;const mask=masked?buffer.slice(offset,offset+4):null;if(masked)offset+=4;const payload=Buffer.from(buffer.slice(offset,offset+n));buffer=buffer.slice(offset+n);if(mask)for(let i=0;i<n;i++)payload[i]^=mask[i%4];if(opcode===9){frame(10,payload);continue;}if(opcode===8){socket.end();continue;}if(opcode===1||opcode===0){fragments.push(payload);if(!(first&128))continue;let msg;try{msg=JSON.parse(Buffer.concat(fragments).toString());}catch(e){reject(e);return;}fragments=[];if(msg.id&&pending.has(msg.id)){const item=pending.get(msg.id);pending.delete(msg.id);clearTimeout(item.timer);msg.error?item.reject(Error(JSON.stringify(msg.error))):item.resolve(msg.result);}else if(msg.method==='Runtime.exceptionThrown'||msg.method==='Log.entryAdded')events.push(msg);}}
  });
 });await opened;
 return {events,send:(method,params,sessionId)=>new Promise((resolve,reject)=>{const id=++nextId,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},240000);pending.set(id,{resolve,reject,timer});frame(1,Buffer.from(JSON.stringify({id,method,params:params||{},...(sessionId?{sessionId}:{})})));}),close:()=>socket.end()};
}
(async()=>{
 const version=await getJSON('http://127.0.0.1:9224/json/version'),client=await connect(version.webSocketDebuggerUrl);
 if(process.argv.includes('--close-only')){await client.send('Browser.close');client.close();return;}
 const report={startedAt:new Date().toISOString(),sourceSha256:reviewInput.sourceSha256,applicationSha256:reviewInput.applicationSha256,browser:version.Browser,captures:[],errors:[],limits:'Native Windows Edge development capture; not a complete browser regression or factory-geometry acceptance.'};let targetId;
 try{
  report.system=await client.send('SystemInfo.getInfo');console.log(JSON.stringify(report.system.gpu.devices));
  targetId=(await client.send('Target.createTarget',{url:'about:blank'})).targetId;const sessionId=(await client.send('Target.attachToTarget',{targetId,flatten:true})).sessionId;
  const send=(method,params)=>client.send(method,params,sessionId),evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1500,height:1000,deviceScaleFactor:1,mobile:false});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const loadStart=Date.now();await send('Page.navigate',{url:reviewInput.url});
  await evaluate('new Promise((resolve,reject)=>{const started=Date.now();function poll(){if(window.__fiero&&document.querySelector("canvas")?.dataset.ready==="true")resolve(true);else if(Date.now()-started>180000)reject(new Error("Workshop readiness timeout"));else setTimeout(poll,250);}poll();})');report.loadReadyMs=Date.now()-loadStart;
  report.renderer=await evaluate('(()=>{const g=document.querySelector("canvas").getContext("webgl2"),e=g.getExtension("WEBGL_debug_renderer_info");return {vendor:g.getParameter(e.UNMASKED_VENDOR_WEBGL),renderer:g.getParameter(e.UNMASKED_RENDERER_WEBGL),state:window.__fiero.getState(),stats:window.__fiero.getModelStats()};})()');console.log(JSON.stringify(report.renderer));
  const settle=()=>evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(resolve,1000))))');
  const capture=async name=>{await settle();const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(image.data,'base64'));report.captures.push({file:name+'.png',state:await evaluate('window.__fiero.getState()'),stats:await evaluate('window.__fiero.getModelStats()')});console.log('Captured '+name);};
  const click=selector=>evaluate('(()=>{const el=document.querySelector('+JSON.stringify(selector)+');if(!el)throw Error("Missing selector");el.click();})()');
  await capture('native-windows-vehicle');
  await click('#systems [data-system="engine"]');await click('.part-button[data-part="engine-block"]');await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Explore engine components").click()');
  for(const row of reviewInput.scopes){
   const began=Date.now();
   await click('[data-assembly="'+row.id+'"]');await click('[data-action="reset"]');
   const active=await evaluate('window.__fiero.getVisibleParts().slice().sort()');if(JSON.stringify(active)!==JSON.stringify(row.parts))throw Error('Selection mismatch '+row.id);
   await capture('native-windows-'+row.id+'-assembled');
   await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Explode assembly").click()');await capture('native-windows-'+row.id+'-exploded');
   row.elapsedMs=Date.now()-began;
  }
  report.scopes=reviewInput.scopes.map(row=>({id:row.id,parts:row.parts.length,elapsedMs:row.elapsedMs}));
  report.errors=client.events.filter(e=>e.method==='Runtime.exceptionThrown');report.status=report.errors.length?'failed':'captured; pending visual inspection';
 }catch(e){report.errors.push(String(e.stack||e));report.status='failed';process.exitCode=1;}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(output,'native-windows-review.json'),JSON.stringify(report,null,2)+'\n');if(targetId)await client.send('Target.closeTarget',{targetId}).catch(()=>{});await client.send('Browser.close').catch(()=>{});client.close();console.log(report.status);}
})().catch(e=>{console.error(e);process.exitCode=1;});
