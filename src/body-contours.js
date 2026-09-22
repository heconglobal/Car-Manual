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

// Shallow upsweep behind the rear wheel, shared by quarter skins and fascia.
export function rearLowerRise(z,y){
 const smooth=t=>{const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v);};
 return .036*smooth((z-1.54)/.484)*(1-smooth((y-.30)/.25));
}
