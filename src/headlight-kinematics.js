// A consistent reconstructed linkage, not measured production hard points.
// The bulb center is anchored to Pontiac's 1985 nominal 709 mm curb-height
// datum. Cover hinges are separate from the bucket pivot. Dimensions and
// stop angles other than the bulb-center datum remain provisional.
export const headlightPose={pivotY:.656,pivotZ:-1.375,closedAngle:-.74,coverPivotY:.704,coverPivotZ:-1.372,coverRaisedAngle:.62};
export const headlightLinkage={motorY:.542,motorZ:-1.467,crankRadius:.032,linkLength:.086,bucketArm:.090};
export function headlightHoodPoint(u,v){const a=u*2-1;return[a*.659,.625+.193*v+.013*(1-a*a)+.019*Math.sin(v*Math.PI)+.007*Math.exp(-(((Math.abs(a*.659)-.42)/.055)**2))*Math.sin(v*Math.PI),-1.786+1.176*v];}
// One rigid cover, including its original hood curvature. The earlier two
// separately authored surfaces changed shape and hinge-arm length between
// endpoint views. The reconstructed fixed axis is independent of the bucket.
export function headlightCoverPose(point,lift){
 const a=headlightPose.coverRaisedAngle*Math.max(0,Math.min(1,lift)),c=Math.cos(a),s=Math.sin(a),y=point[1]-headlightPose.coverPivotY,z=point[2]-headlightPose.coverPivotZ;
 return[point[0],headlightPose.coverPivotY+c*y-s*z,headlightPose.coverPivotZ+s*y+c*z];
}
export function headlightCoverPoint(centerX,u,v,lift=0,depth=0){
 const p=headlightHoodPoint(((centerX+(u-.5)*.258)/.659+1)/2,(-1.685+v*.31+1.786)/1.176);p[1]+=.001-depth;return headlightCoverPose(p,lift);
}
export function headlightLinkPose(lift){
 const t=Math.max(0,Math.min(1,lift)),angle=headlightPose.closedAngle*(1-t),k=headlightLinkage;
 const a=[k.motorY,k.motorZ],c=[headlightPose.pivotY+Math.sin(angle)*k.bucketArm,headlightPose.pivotZ-Math.cos(angle)*k.bucketArm];
 const dy=c[0]-a[0],dz=c[1]-a[1],d=Math.hypot(dy,dz),u=dy/d,v=dz/d;
 const along=(k.crankRadius**2-k.linkLength**2+d*d)/(2*d),heightSquared=k.crankRadius**2-along**2;
 if(heightSquared<-.000000001)throw new RangeError('Headlight linkage cannot reach this pose');
 const h=Math.sqrt(Math.max(0,heightSquared));
 return{angle,motor:a,crank:[a[0]+along*u-h*v,a[1]+along*v+h*u],bucket:c};
}
