import assert from 'node:assert/strict';
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createLightingDetail}=await import('../src/lighting-detail.js');const {lightingParts}=await import('../src/lighting-catalog.js');const {createChargingDetail}=await import('../src/charging-detail.js');const {chargingParts}=await import('../src/charging-catalog.js');const {createHeadlightDetail}=await import('../src/headlight-detail.js');const {headlightParts}=await import('../src/headlight-catalog.js');
const report={date:new Date().toISOString(),models:{},limits:'Software geometry and selection audit. Original manufacturing dimensions, electrical operation and physical fit are not certified.'};
for(const [name,make,parts]of[['lighting',createLightingDetail,lightingParts],['charging',createChargingDetail,chargingParts],['headlights',createHeadlightDetail,headlightParts]]){
 const model=make();model.root.updateMatrixWorld(true);assert.equal(model.groups.size,parts.length);const bounds=id=>new T.Box3().setFromObject(model.groups.get(id));
 for(const p of parts){const g=model.groups.get(p.id);assert(g.children.length,p.id+' missing geometry');for(const m of g.children){assert(m.geometry.attributes.position.array.every(Number.isFinite),p.id+' nonfinite geometry');assert(m.matrixWorld.determinant()>0,p.id+' inverted transform');assert.equal(m.userData.partId,p.id);if(p.option){assert.equal(m.userData.option,p.option);assert.equal(m.userData.value,p.value);}}}
 if(name==='lighting'){
  for(const side of['left','right'])for(const scope of['front','rear','marker-front','marker-rear','license']){const list=parts.filter(p=>p.section===`lighting-${scope}-${side}`);assert(list.length);for(const p of list){const b=bounds(p.id);assert(side==='left'?b.max.x<0:b.min.x>0,p.id+' wrong side');}}
  for(const side of['left','right']){const b=bounds(`lt-rear-${side}-reverse-bulb`).getCenter(new T.Vector3()),t=bounds(`lt-rear-${side}-tail-bulb`).getCenter(new T.Vector3());assert(Math.abs(b.x)<Math.abs(t.x),'reverse bulb must be inboard');}
  assert.equal(parts.filter(p=>p.section==='lighting-dome'&&p.id.endsWith('-bulb')).length,4,'four overhead lamps');assert.equal(parts.filter(p=>p.section==='lighting-console'&&p.id.endsWith('-bulb')).length,2,'manual console has two bulbs');
  assert.equal(parts.filter(p=>p.option==='lampGroup').length,12,'four optional lamps with three component groups each');
 }
 if(name==='charging'){
  assert(bounds('ch-battery-case').min.x>0,'battery passenger side');assert(bounds('ch-alt-front').min.x>0,'alternator accessory side');
  assert(bounds('ch-battery-terminals').max.y<bounds('ch-battery-lid').min.y,'battery must have side terminals, not top posts');
  assert(bounds('ch-alt-pulley').min.x>bounds('ch-alt-rear').max.x,'pulley faces passenger/outboard end');
  assert(bounds('ch-starter-nose').max.x<bounds('ch-starter-end').min.x,'starter drive faces transaxle');
  assert(bounds('ch-starter-through-bolts').getSize(new T.Vector3()).x>.18,'starter through-bolts must span the motor');
 }
 if(name==='headlights')for(const p of parts.filter(p=>p.section==='headlight-controls'))assert(bounds(p.id).max.x<0,p.id+' driver side controls');
 report.models[name]={parts:parts.length,status:'passed'};
 model.root.traverse(m=>{if(m.isMesh){m.geometry.dispose();m.material.dispose();}});
}
await writeFile('artifacts/electrical-geometry-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
