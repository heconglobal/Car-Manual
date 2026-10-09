// Every model owns its allocations. Retained scene resources are protected when
// a linked explorer happens to share a material or texture with another model.
export function modelResources(root){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 root.traverse(o=>{
  if(o.geometry)geometries.add(o.geometry);
  for(const m of [o.material,o.userData?.surfaceMaterial,o.userData?.ghostMaterial,o.userData?.wireMaterial].flat().filter(Boolean)){
   materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);
  }
 });return{geometries,materials,textures};
}
export function disposeModel(model,retainedRoots=[]){
 if(!model)return;
 const owned=modelResources(model.root),retained={geometries:new Set(),materials:new Set(),textures:new Set()};
 for(const root of retainedRoots){const resources=modelResources(root);for(const kind of Object.keys(retained))for(const value of resources[kind])retained[kind].add(value);}
 model.root.removeFromParent();
 for(const kind of Object.keys(owned))for(const value of owned[kind])if(!retained[kind].has(value))value.dispose();
 model.root.clear();model.groups?.clear();
}
export function allocationStats(models){
 const geometries=new Set(),materials=new Set(),textures=new Set();let geometryBytes=0;
 for(const model of models){if(!model)continue;const r=modelResources(model.root);for(const g of r.geometries)geometries.add(g);for(const m of r.materials)materials.add(m);for(const t of r.textures)textures.add(t);}
 for(const g of geometries){for(const a of Object.values(g.attributes))geometryBytes+=a.array.byteLength;if(g.index)geometryBytes+=g.index.array.byteLength;}
 return {models:models.filter(Boolean).length,geometries:geometries.size,materials:materials.size,textures:textures.size,geometryBytes};
}
