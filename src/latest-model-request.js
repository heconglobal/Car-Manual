// Cancel superseded requests before allocation. Import promises may complete
// after navigation; only the newest request may instantiate or publish a model.
export function createLatestModelRequest(){
 let revision=0;
 return {
  cancel(){revision++;},
  async run(load,allocate,publish){
   const mine=++revision,builder=await load();
   if(mine!==revision)return false;
   // Paint the loading status before CPU-bound procedural construction.
   await new Promise(resolve=>setTimeout(resolve,0));
   if(mine!==revision)return false;
   const model=allocate(builder);
   if(mine!==revision)return false;
   publish(model);return true;
  },
 };
}
