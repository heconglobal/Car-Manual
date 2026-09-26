import {designLampHeight,exteriorLampNominal} from './body-datums.js';

// The bulb datums come from the 1985 MVMA, PDF26. The cover outline, optical
// pitch and the two inboard centers are reconstructed from GM 2P02-002,
// Pontiac DIY 2-25 and photographs of opened original notchback assemblies.
// No dimensioned GM outer-lens/tooling drawing has been obtained.
export const tailLampShape={
 centerX:.394,centerY:designLampHeight(exteriorLampNominal.tailCurb,1.91),
 halfHeight:.0616,inner:.004,outerBottom:.786,outerTop:.767,upperOuterRadius:.034,upperInnerRadius:.022,lowerRadius:.007,
 coverDepth:.010,opticDepth:-.008,
 redInner:.318,redOuter:.768,reverseInner:.016,reverseOuter:.308,
 innerStopOffset:.398,reverseOffset:.258,
 columns:20,rows:6,
};
export function tailLampEdges(y,inset=0){
 const a=tailLampShape,t=Math.max(0,Math.min(1,(y+a.halfHeight)/(2*a.halfHeight)));
 const h=a.halfHeight-inset;
 const corner=radius=>{const r=Math.max(.002,radius-inset),q=Math.max(0,Math.abs(y)-(h-r));return r-Math.sqrt(Math.max(0,r*r-q*q));};
 const innerCorner=corner(y>0?a.upperInnerRadius:a.lowerRadius),outerCorner=corner(y>0?a.upperOuterRadius:a.lowerRadius);
 return [Math.max(.001,a.inner+inset+innerCorner),a.outerBottom+(a.outerTop-a.outerBottom)*t-inset-outerCorner];
}
export function tailLampOutline(inset=0){
 const h=tailLampShape.halfHeight-inset,out=[];
 for(let i=0;i<=32;i++){const y=-h+2*h*i/32;out.push([tailLampEdges(y,inset)[1],tailLampShape.centerY+y]);}
 for(let i=32;i>=0;i--){const y=-h+2*h*i/32;out.push([tailLampEdges(y,inset)[0],tailLampShape.centerY+y]);}
 return out;
}
