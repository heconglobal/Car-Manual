import {bodyNominal,exteriorLampNominal,designLampHeight,bodyPoint} from './body-datums.js';
// Shared transverse shoulder datums keep fascia and fender joins coherent.
// These curve controls are inferred from the reference views, not GM tooling.
export function shoulderWidth(z){
 const stations=[[-1.79,.817],[-1.43,.833],[-1.18,.837],[-.86,.834],[-.62,.827],[.59,.829],[1.18,.837],[1.53,.834],[1.867,.824]];
 let i=0;while(i<stations.length-2&&z>stations[i+1][0])i++;
 const [a,x]=stations[i],[b,y]=stations[i+1],t=Math.max(0,Math.min(1,(z-a)/(b-a))),s=t*t*(3-2*t);
 return x+(y-x)*s;
}
export function shoulderDrop(z,rear){
 const centre=rear?1.1865:-1.1865,end=rear?1.867:-1.790;
 const arch=Math.exp(-(((z-centre)/.30)**2)),tip=Math.exp(-(((z-end)/.18)**2));
 return .036+.022*arch+.014*tip;
}

// Lower apron controls are reconstructed, distinct from the MVMA bumper
// reference. Pontiac production profile (Performance Plus p46) shows the
// lower return continuing below the impact face. These are not tooling data.
export const fasciaProfile={frontLower:.270,rearLower:.245};
// Lower fender/quarter edges meet the painted apron bottoms.
// The wheel openings and door/rocker ground datums remain fixed.
export function lowerPanelHeight(z,rear){
 const t=Math.max(0,Math.min(1,rear?(z-1.5255)/(1.865-1.5255):(-z-1.5255)/(1.788-1.5255)));
 return .245+((rear?fasciaProfile.rearLower:fasciaProfile.frontLower)-.245)*t*t*(3-2*t);
}
export function exteriorBeltHeight(z){
 // Keep the final installed molding straight between the lamp stations.
 // Invert the upper-body lift instead of lifting the trim for a second time.
 const zz=bodyPoint([0,.59,z])[2],t=Math.max(0,Math.min(1,(zz+1.75)/3.53));
 const target=designLampHeight(exteriorLampNominal.frontMarkerCurb,-1.75)*(1-t)+designLampHeight(exteriorLampNominal.rearMarkerCurb,1.78)*t;
 let y=target;for(let i=0;i<5;i++)y+=target-bodyPoint([0,y,z])[1];return y;
}

// Shared skin coordinates prevent attached trim from floating above the panels.
const mix=(a,b,t)=>a+(b-a)*t;
export const deckHeight=z=>{const t=Math.max(0,Math.min(1,(z-.57)/1.295));return mix(.815,.816,t)+.006*Math.sin(t*Math.PI);};
export function panelUpper(z,rear){return rear?deckHeight(z):mix(.625,.818,(z+1.79)/1.18)+.019*Math.sin((z+1.79)/1.18*Math.PI);}
// Flare crown anchors the sampled skin envelope to the documented 1.752 m
// body width; it does not make these local sections measured tooling.
export function sideWidth(z,y,centre,rear){
 const q=Math.max(0,Math.min(1,(y-.245)/(panelUpper(z,rear)-shoulderDrop(z,rear)-.245))),flare=Math.exp(-(((z-centre)/.42)**4));
 const old=.783+(.052+shoulderWidth(z)-.835)*q+(.028+(rear?.03997:.0405732)*flare)*Math.sin(q*Math.PI);
 const t=Math.max(0,Math.min(1,rear?(.8475-z)/(.8475-.59):(z+.8475)/(.8475-.627))),w=t*t*(3-2*t);
 return mix(old,doorSection(Math.max(0,Math.min(1,(y-.245)/.533))),w)-moldingRecess(z,y);
}
// A recessed molding/handle land keeps fittings within the specified envelope.
const moldingRecess=(z,y)=>.0095*Math.exp(-(((y-exteriorBeltHeight(z))/.025)**4));
function doorSection(v){
 // Broad, gently convex face beneath a short upper shoulder. The relocated
 // factory-height molding follows this section rather than cutting through it.
 const knots=[[0,.804],[.35,.843],[.60,.869],[.76,.8755],[1,.827]];
 let i=0;while(i<knots.length-2&&v>knots[i+1][0])i++;
 const slopes=knots.slice(1).map(([a,x],j)=>(x-knots[j][1])/(a-knots[j][0]));
 const tangent=j=>j===0?slopes[0]:j===knots.length-1?slopes.at(-1):slopes[j-1]*slopes[j]<=0?0:2/(1/slopes[j-1]+1/slopes[j]);
 const [a,x]=knots[i],[b,y]=knots[i+1],t=(v-a)/(b-a);
 return (2*t*t*t-3*t*t+1)*x+(t*t*t-2*t*t+t)*(b-a)*tangent(i)+(-2*t*t*t+3*t*t)*y+(t*t*t-t*t)*(b-a)*tangent(i+1);
}
export function doorSkin(s,u,v){
 const z=mix(-.619,.582-.074*(1-v)**2,u),y=mix(.245,.778,v);
 return[s*(doorSection(v)-moldingRecess(z,y)),y,z];
}
export function doorAt(s,z,y){const v=(y-.245)/.533,u=(z+.619)/(1.201-.074*(1-v)**2);return doorSkin(s,u,v);}

// Park/turn housing fit reconstructed from the production front photographs.
// Only the 500 mm lateral bulb offset is a published MVMA datum.
export const frontLampMount={height:.410,openingWidth:.176,openingHeight:.080};
