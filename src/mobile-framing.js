import {Vector3} from 'three';

// Fit every corner in the unobstructed part of a full-size canvas. Projection
// stays centered on the object; the caller shifts it to the clear screen area.
export function framedDistance(bounds,direction,fov,aspect,widthFraction,heightFraction){
 const centre=bounds.getCenter(new Vector3()),right=new Vector3().crossVectors(new Vector3(0,1,0),direction).normalize();
 if(right.lengthSq()<1e-8)right.set(1,0,0);
 const up=new Vector3().crossVectors(direction,right).normalize(),tangent=Math.tan(fov*Math.PI/360);
 let distance=0;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
  const relative=new Vector3(x,y,z).sub(centre),depth=relative.dot(direction);
  distance=Math.max(distance,depth+Math.abs(relative.dot(right))/(tangent*aspect*widthFraction),depth+Math.abs(relative.dot(up))/(tangent*heightFraction));
 }
 return distance*1.08;
}
