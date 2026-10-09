import * as T from 'three';
import {parts} from './data.js';
import {interiorColor} from './interior-surfaces.js';
import {defaultConfiguration,paints,sanitizeConfiguration} from './configuration.js';

export function createVehicleGroups(){
 const root=new T.Group(),groups=new Map();
 for(const p of parts){const g=new T.Group();g.name=p.id;g.userData={partId:p.id,system:p.system,spread:new T.Vector3(0,.2,0)};groups.set(p.id,g);root.add(g);}
 return {root,groups};
}
export function setVehicleSpreads(groups){
 for(const [id,g] of groups){
  const s=g.userData.system;
  if(s==='body')g.userData.spread.set(id.includes('left')?.65:id.includes('right')?-.65:0,id==='spaceframe'?0:1,id==='nose'?-.65:id==='rear-fascia'?.65:0);
  if(s==='engine')g.userData.spread.set(.10,.47,0);
  if(s==='drivetrain')g.userData.spread.set(.45,.10,.12);
  if(s==='brakes')g.userData.spread.set(0,0,0);
  if(s==='interior')g.userData.spread.set(0,.48,0);
 }
 groups.get('rear-clip').userData.spread.set(0,1.10,.35);
 groups.get('rear-window').userData.spread.set(0,.48,.18);
 groups.get('sail-left').userData.spread.set(.75,.60,0);
 groups.get('sail-right').userData.spread.set(-.75,.60,0);
 groups.get('decklid').userData.spread.set(0,.67,.48);
 groups.get('air-lid').userData.spread.set(.1,1.05,0);
 groups.get('air-filter').userData.spread.set(.1,.76,0);
 groups.get('air-cleaner').userData.spread.set(.1,.38,0);
 groups.get('intake').userData.spread.set(.1,.86,0);
 groups.get('heads').userData.spread.set(.1,.65,0);
 groups.get('oil-pan').userData.spread.set(.1,-.11,0);
 groups.get('distributor').userData.spread.set(.25,.7,.15);
 groups.get('ignition-coil').userData.spread.set(.45,.5,-.15);
 groups.get('ignition-leads').userData.spread.set(.1,.85,0);
}
export function vehicleConfiguration(groups){
 let configuration={...defaultConfiguration};
 function configure(input){
  configuration=sanitizeConfiguration(input);const paint=paints.find(p=>p.id===configuration.paint);
  for(const [id,g] of groups)g.traverse(m=>{
   if(!m.isMesh)return;const {option,value,materialName,finish}=m.userData;
   const surfaceMaterial=m.userData.surfaceMaterial||m.material;
   m.visible=!option||configuration[option]===value;
   if(materialName==='red'&&(g.userData.system==='body'||id==='headlights')){
    m.userData.original.color.set(paint.color);surfaceMaterial.metalness=paint.metalness;surfaceMaterial.roughness=paint.id==='gray'?.38:.36;
   }
   if(materialName==='interior')m.userData.original.color.set(configuration.interior==='tan'?'#9b7a50':'#555b60');
   if(materialName==='vinyl')m.userData.original.color.set(configuration.interior==='tan'?'#604931':'#2e3338');
   const cabinColor=interiorColor(materialName,configuration);if(cabinColor)m.userData.original.color.set(cabinColor);
   if(finish==='wheel')m.userData.original.color.set(configuration.wheelFinish==='dark'?'#5e6468':'#bdc1c3');
   m.material.color.copy(m.userData.original.color);
   surfaceMaterial.color.copy(m.userData.original.color);
  });
 }
 configure(configuration);
 return {configure,getConfiguration:()=>({...configuration})};
}
