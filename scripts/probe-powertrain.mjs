import * as T from 'three';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createVehicle}=await import('../src/model.js');
const {engineOffset,transmissionToVehicle,transaxleDatum}=await import('../src/powertrain-layout.js');
const m=createVehicle();m.root.updateMatrixWorld(true);
for(const id of ['engine-block','intake','heads','oil-pan','decklid','gearbox','clutch','thermostat','alternator','starter','distributor','air-cleaner','spaceframe']){const b=new T.Box3().setFromObject(m.groups.get(id));console.log(id,JSON.stringify({min:b.min.toArray(),max:b.max.toArray()}));}
console.log('placement',engineOffset,'input',transmissionToVehicle([0,...transaxleDatum.input]));
const deck=m.groups.get('decklid').children.filter(x=>x.isMesh),fails=[],checks=[];
for(const id of ['intake','heads','thermostat','distributor','ignition-coil','ignition-leads','engine-controls','alternator','air-lid']){
 let min=Infinity;let samples=0;
 m.groups.get(id).traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;
 for(let i=0;i<a.count;i+=19){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);if(p.y<.65)continue;const ray=new T.Raycaster(new T.Vector3(p.x,1.7,p.z),new T.Vector3(0,-1,0));const hits=ray.intersectObjects(deck,false);if(!hits.length)continue;const under=hits.at(-1).point.y,gap=under-p.y;min=Math.min(min,gap);samples++;if(gap<.002)fails.push({id,point:p.toArray(),gap});}});
 checks.push({id,minGap:min,samples});
}
console.log('deck',JSON.stringify(checks));console.log('worst',JSON.stringify(fails.sort((a,b)=>a.gap-b.gap).slice(0,8)));
