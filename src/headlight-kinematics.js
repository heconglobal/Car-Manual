// A consistent reconstructed linkage, not measured production hard points.
// The bulb center is anchored to Pontiac's 1985 nominal 709 mm curb-height
// datum. Cover hinges are separate from the bucket pivot. Dimensions and
// stop angles other than the bulb-center datum remain provisional.
export const headlightPose={pivotY:.656,pivotZ:-1.375,closedAngle:-.74,coverRaisedAngle:.305};
export const headlightLinkage={motorY:.542,motorZ:-1.467,crankRadius:.032,linkLength:.086,bucketArm:.090};
export function headlightLinkPose(lift){
 const t=Math.max(0,Math.min(1,lift)),angle=headlightPose.closedAngle*(1-t),k=headlightLinkage;
 const a=[k.motorY,k.motorZ],c=[headlightPose.pivotY+Math.sin(angle)*k.bucketArm,headlightPose.pivotZ-Math.cos(angle)*k.bucketArm];
 const dy=c[0]-a[0],dz=c[1]-a[1],d=Math.hypot(dy,dz),u=dy/d,v=dz/d;
 const along=(k.crankRadius**2-k.linkLength**2+d*d)/(2*d),heightSquared=k.crankRadius**2-along**2;
 if(heightSquared<-.000000001)throw new RangeError('Headlight linkage cannot reach this pose');
 const h=Math.sqrt(Math.max(0,heightSquared));
 return{angle,motor:a,crank:[a[0]+along*u-h*v,a[1]+along*v+h*u],bucket:c};
}
