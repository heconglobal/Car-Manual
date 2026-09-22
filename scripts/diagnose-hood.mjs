import * as T from 'three';
globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})};
const {createVehicle}=await import('../src/model.js');const {root,groups}=createVehicle();root.updateMatrixWorld(true);const meshes=[];root.traverseVisible(m=>{if(m.isMesh)meshes.push(m)});
for(const z of [-1.78,-1.74,-1.70,-1.66,-1.62,-1.58,-1.54])for(const x of [0,.20,.34]){
const ray=new T.Raycaster(new T.Vector3(x,2,z),new T.Vector3(0,-1,0));const hits=ray.intersectObjects(meshes,false);console.log(JSON.stringify({x,z,hits:hits.slice(0,4).map(h=>({part:h.object.userData.partId,mat:h.object.userData.materialName,y:h.point.y}))}));}
