import * as T from 'three';
import {sideWindow} from './glazing-contours.js';

// Sections are reconstructed. Coordinates are metres across the glass edge
// (positive into the pane) and normal to it (positive toward the exterior).
export const openingSealSection=[[-.012,-.004],[-.013,0],[-.009,.002],[-.003,.0025],[.002,.0015],[.003,-.001],[.001,-.003],[-.006,-.004],[-.012,-.004]];
export const glazingSealSection=[[-.004,-.002],[-.005,.0005],[-.003,.002],[.001,.0025],[.005,.0015],[.006,0],[.004,-.0015],[-.004,-.002]];
export const windshieldRevealSection=[[-.0038,-.001],[-.004,.0003],[-.0028,.0012],[.0025,.0012],[.004,.0003],[.0035,-.001],[-.0038,-.001]];
export const sunroofSealSection=[[-.015,-.006],[-.016,-.001],[-.013,.001],[-.005,.0018],[.001,.0015],[.002,-.001],[0,-.004],[-.008,-.007],[-.015,-.006]];
const vec=p=>new T.Vector3(...p),clamp=T.MathUtils.clamp;
const wrap=t=>((t%1)+1)%1;

export function surfaceNormal(surface,u,v,outward){
 const e=.0001,du=vec(surface(clamp(u+e,0,1),v)).sub(vec(surface(clamp(u-e,0,1),v))),dv=vec(surface(u,clamp(v+e,0,1))).sub(vec(surface(u,clamp(v-e,0,1))));
 const n=du.cross(dv).normalize();if(n.dot(vec(outward))<0)n.negate();return n;
}
export function edgeFrame(path,inside,normal,t,closed=false){
 const at=q=>path(closed?wrap(q):clamp(q,0,1)),p=vec(at(t)),tangent=vec(at(t+.0001)).sub(vec(at(t-.0001))).normalize();
 const n=normal(t).clone().addScaledVector(tangent,-normal(t).dot(tangent)).normalize();
 const inward=n.clone().cross(tangent).normalize();if(inward.dot(vec(inside(t)).sub(p))<0)inward.negate();
 return{p,inward,normal:n};
}
export function sweptSeal(h,id,frame,section,{start=0,end=1,segments=96,material='rubber',flags={},caps=false}={}){
 const point=(u,v)=>{const f=frame(T.MathUtils.lerp(start,end,u)),q=section[Math.round(v*(section.length-1))];return f.p.clone().addScaledVector(f.inward,q[0]).addScaledVector(f.normal,q[1]).toArray();};
 const mesh=h.surface(id,segments,section.length-1,point,material,flags);
 if(material==='rubber'){mesh.material.bumpScale=.00008;mesh.material.roughness=.82;}
 if(caps)for(const u of [0,1])h.surface(id,1,section.length-1,(v,w)=>{const a=point(u,w),b=point(u,0);return a.map((x,i)=>T.MathUtils.lerp(x,b[i],v));},material,flags);
 return mesh;
}
export function perimeterUV(t){
 const q=Math.min(3,Math.floor(t*4)),v=t*4-q;
 return q===0?[v,0]:q===1?[1,v]:q===2?[1-v,1]:[0,1-v];
}
export function glazingFrame(surface,outward,t){
 const path=q=>surface(...perimeterUV(q));
 return edgeFrame(path,()=>surface(.5,.5),q=>surfaceNormal(surface,...perimeterUV(wrap(q)),outward),t,true);
}
export function glazingSeal(h,id,surface,outward,{section=glazingSealSection,flags={}}={}){
 return sweptSeal(h,id,t=>glazingFrame(surface,outward,t),section,{segments:256,flags});
}

// All three roof-opening pieces use one boundary/frame, including their shared
// corner vertices. The glass tessellation includes the A-pillar/roof break.
export function openingUV(t){return t<=.4?[.48*t/.4,1]:t<=.75?[.48+.52*(t-.4)/.35,1]:[1,1-(t-.75)/.25];}
export function openingFrame(s,t){
 const pane=(u,v)=>sideWindow(s,u,v);
 return edgeFrame(q=>pane(...openingUV(q)),()=>pane(.55,.48),q=>surfaceNormal(pane,...openingUV(q),[s,0,0]),t);
}
export function buildOpeningSeals(h,s){
 const side=s>0?'left':'right';
 for(const [name,start,end]of [['a-pillar-seal',0,.4],['upper-window-seal',.4,.75],['b-pillar-seal',.75,1]]){
  const id=name+'-'+side;
  sweptSeal(h,id,t=>openingFrame(s,t),openingSealSection,{start,end});
  sweptSeal(h,id,t=>openingFrame(s,t),[[-.015,-.007],[-.015,-.004],[-.002,-.004],[-.002,-.006],[-.015,-.007]],{start,end,material:'windowTrim'});
 }
 // Formed glass stop follows the rail's local plane, rather than a floating
 // axis-aligned block. It projects just over the upper edge of the pane.
 sweptSeal(h,'upper-window-seal-'+side,t=>openingFrame(s,t),[[-.006,-.004],[-.006,.001],[.009,.001],[.009,-.001],[-.004,-.002],[-.006,-.004]],{start:.439,end:.450,segments:6,material:'windowTrim',caps:true});
}
export function buildBeltSeal(h,s){
 const pane=(u,v)=>sideWindow(s,u,v),frame=t=>edgeFrame(q=>pane(q,0),q=>pane(q,.03),q=>surfaceNormal(pane,q,0,[s,0,0]),t);
 sweptSeal(h,'belt-seal-'+(s>0?'left':'right'),frame,[[-.009,.003],[-.008,.010],[-.004,.011],[.001,.006],[.003,.001],[.001,-.0005],[-.002,.003],[-.009,.003]],{segments:96,caps:true});
}
export function buildDoorOpeningWeatherstrip(h,id,s){
 const points=[];
 // The inner gasket sits behind and outside the visible pane, not on the
 // old seven-point loop that crossed its upper/rear corners.
 for(let i=0;i<=160;i++){const f=openingFrame(s,i/160);points.push(f.p.clone().addScaledVector(f.inward,-.008).addScaledVector(f.normal,-.019));}
 const rear=points.at(-1),front=points[0],lower=[[s*.744,.770,.552],[s*.740,.370,.523],[s*.731,.308,.440],[s*.724,.308,-.518],[s*.735,.355,-.556],[s*.756,.765,-.586]];
 // Dense spline only on the lower jamb; the upper path must share glass data.
 const lowerPath=new T.CatmullRomCurve3([rear,...lower.map(vec),front],false,'centripetal');
 for(let i=1;i<=96;i++)points.push(lowerPath.getPoint(i/96));
 const path=new T.CurvePath();for(let i=0;i<points.length-1;i++)path.add(new T.LineCurve3(points[i],points[i+1]));
 const mesh=h.add(id,new T.TubeGeometry(path,384,.0045,8,true),'rubber');mesh.material.bumpScale=.00008;
}
