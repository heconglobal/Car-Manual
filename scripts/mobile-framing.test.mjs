import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3,PerspectiveCamera} from 'three';
import {framedDistance} from '../src/mobile-framing.js';

test('framing leaves every bounds corner between asymmetric mobile overlays',()=>{
 for(const [width,height,top,bottom] of [[320,470,220,330],[390,664,220,500],[524,288,101,217]]){
  for(const size of [[4.2,1.2,1.8],[.05,.4,.08],[.3,.2,.15]]){
   const box=new Box3(new Vector3(...size).multiplyScalar(-.5),new Vector3(...size).multiplyScalar(.5));
   for(const direction of [new Vector3(-.8,.6,-1.7).normalize(),new Vector3(.1,1,.001).normalize()]){
    const camera=new PerspectiveCamera(37,width/height,.001,100),distance=framedDistance(box,direction,37,width/height,(width-16)/width,(bottom-top)/height);
    camera.position.copy(direction).multiplyScalar(distance);camera.lookAt(0,0,0);camera.setViewOffset(width,height,0,height/2-(top+bottom)/2,width,height);camera.updateMatrixWorld();
    for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
     const projected=new Vector3(x,y,z).project(camera),px=(projected.x+1)*width/2,py=(1-projected.y)*height/2;
     assert(px>=8&&px<=width-8,`horizontal corner ${px} in ${width}`);assert(py>=top&&py<=bottom,`vertical corner ${py} in ${top}–${bottom}`);
    }
   }
  }
 }
});
