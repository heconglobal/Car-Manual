import * as T from 'three';
const lerp=T.MathUtils.lerp,gauss=x=>Math.exp(-x*x);
export const interiorColors={gray:{clothInsert:'#b9b9b3',clothBolster:'#484b4d',cabinVinyl:'#9fa5a5',dashTop:'#51595c',carpet:'#454743',consoleTrim:'#595d60',headlining:'#8e9493'},tan:{clothInsert:'#b69a73',clothBolster:'#665141',cabinVinyl:'#a88c65',dashTop:'#65513f',carpet:'#6c5742',consoleTrim:'#655d50',headlining:'#b69e78'}};
export function interiorColor(name,configuration){return interiorColors[configuration?.interior==='tan'?'tan':'gray'][name];}
// Native lofts constrained by the early AR9 seat photographs. These local
// ordinates are reconstruction values, not factory cushion/frame dimensions.
const backWidths=[[.365,.191],[.43,.208],[.62,.226],[.755,.222],[.815,.192],[.855,.158],[.900,.149],[.977,.145],[1.023,.118],[1.035,.090]];
export const seatDatum={centre:.383,cushionFront:-.145,cushionRear:.345,backTop:1.035};
export function backWidth(y){
 for(let i=1;i<backWidths.length;i++)if(y<=backWidths[i][0]){
  const a=backWidths[i-1],b=backWidths[i],prev=backWidths[Math.max(0,i-2)],next=backWidths[Math.min(backWidths.length-1,i+1)],t=T.MathUtils.clamp((y-a[0])/(b[0]-a[0]),0,1),d=b[0]-a[0];
  const m0=(b[1]-prev[1])/(b[0]-prev[0]),m1=(next[1]-a[1])/(next[0]-a[0]);
  return (2*t**3-3*t*t+1)*a[1]+(t**3-2*t*t+t)*d*m0+(-2*t**3+3*t*t)*b[1]+(t**3-t*t)*d*m1;
 }return backWidths.at(-1)[1];
}
export function seatBackPoint(s,u,v,rear=false,inset=0){
 const vv=lerp(inset*1.5,1-inset*1.5,v),y=lerp(.365,1.035,vv),a=2*u-1,w=backWidth(y)-inset;
 const bowl=.051*Math.sin(Math.PI*Math.min(vv/.77,1))**.7*Math.abs(a)**1.5;
 const head=.013*gauss((y-.952)/.065)*(gauss((a-.45)/.28)+gauss((a+.45)/.28));
 return[s*seatDatum.centre+a*w,y-.009*Math.abs(a)**4*T.MathUtils.smoothstep(vv,.89,1),.257+(y-.365)*.29+(rear?.085-.005*Math.abs(a)**8:-bowl-head+.010*Math.abs(a)**10)+inset*(rear?-1:1)];
}
export function seatCushionPoint(s,u,v,lower=false,inset=0){
 const vv=lerp(inset*2.2,1-inset*2.2,v),a=u*2-1,z=lerp(seatDatum.cushionFront,seatDatum.cushionRear,vv)+.012*Math.abs(a)**8*(1-2*vv),w=.213-(lower?.009:0)+.012*Math.sin(vv*Math.PI)-.018*vv**5-inset;
 const rim=.071*Math.abs(a)**3*Math.sin(Math.PI*(.08+.84*vv))+.007*gauss((vv-.09)/.16);
 return[s*seatDatum.centre+a*w,lower?.302+inset:.376-.027*vv+rim-inset-.017*Math.abs(a)**16-.014*gauss(vv/.07),z];
}
export function buildDoorTrimSkin(h,id,s){
 const {surface,tube}=h;
 const point=(u,v)=>{const z=lerp(-.557,.516,u),y=lerp(.290,.780,v);return[s*(.739-.010*Math.sin(v*Math.PI)),y,z+.024*(1-v)*(1-v)];};
 surface(id,30,18,point,'cabinVinyl');
 for(const u of [0,1])surface(id,18,3,(v,t)=>{const p=point(u,v);p[0]+=s*.012*t;return p;},'cabinVinyl');
 surface(id,30,3,(u,t)=>{const p=point(u,1);p[0]+=s*.025*t;p[1]-=.010*t;return p;},'dashTop');
 surface(id,28,10,(u,v)=>{const p=point(.02+.96*u,.025+.31*v);p[0]-=s*.003;return p;},'carpet');
 tube(id,Array.from({length:28},(_,i)=>{const p=point(.02+.96*i/27,.34);p[0]-=s*.003;return p;}),.0018,'clothBolster');
}
