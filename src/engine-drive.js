import * as T from 'three';
import {alternatorEngine} from './powertrain-layout.js';

// Reconstructed pulley envelopes and belt centreline. These describe visual
// assembly fit, not an OEM pulley diameter or replacement-belt specification.
export const drivePlane=-.339;
export const drivePulleys=[
 {id:'crank',y:1.05,z:0,r:.080},
 {id:'water',y:1.218,z:.076,r:.057},
 {id:'alternator',y:alternatorEngine[1],z:alternatorEngine[2],r:.030},
];
export function driveBeltPoints(){
 const points=drivePulleys.flatMap(p=>Array.from({length:192},(_,i)=>{const a=i/192*Math.PI*2;return [p.y+Math.cos(a)*p.r,p.z+Math.sin(a)*p.r];})).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const half=ps=>{const h=[];for(const p of ps){while(h.length>=2&&cross(h.at(-2),h.at(-1),p)<=0)h.pop();h.push(p);}h.pop();return h;};
 const hull=[...half(points),...half([...points].reverse())];return [...hull,hull[0]].map(([y,z])=>[drivePlane,y,z]);
}
export function buildEngineDrive(h){
 const crank=drivePulleys[0];
 // Separate drawn pulley, with open centre and recessed dish. The harmonic
 // balancer remains an independent engine part behind it.
 const profile=[[.014,-.005],[.022,-.005],[.038,.014],[.074,.014],[.083,.006],[.083,.004],[.079,.002],[.079,-.002],[.083,-.004],[.083,-.006],[.075,.010],[.039,.010],[.023,-.007],[.014,-.007],[.014,-.005]];
 h.add('eng-crank-pulley',new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),96),'blackPaint',[drivePlane,crank.y,crank.z],[0,0,Math.PI/2]);
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;h.bolt('eng-crank-pulley',[drivePlane-.008,crank.y+Math.cos(a)*.027,crank.z+Math.sin(a)*.027],.004,'x');}
 const points=driveBeltPoints(),path=new T.CurvePath();for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));
 h.add('eng-belt',new T.TubeGeometry(path,600,.0038,8,false),'rubber');
}
