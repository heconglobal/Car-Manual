import {detailFamilyIds,loadDetailBuilder} from './detail-loaders.js';
import {disposeModel} from './model-resources.js';
import {createDetailAssetLoader} from './detail-asset-loader.js';
import {loadVehicleAsset} from './vehicle-asset-loader.js';

// The complete native vehicle is resident before readiness. Explorer models
// retain the original persistent, visited-family cache behavior.
export async function loadWorkshop(beforeStage=async()=>{},{signal,onProgress=()=>{}}={}){
 const started=performance.now(),inspections=new Map(),stages=[],detailAssets=createDetailAssetLoader();
 const controller=new AbortController(),abort=()=>{controller.abort(signal.reason);detailAssets.dispose();};
 signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
 let vehicle=null;const total=3;
 const check=()=>{if(controller.signal.aborted)throw controller.signal.reason||new DOMException('Workshop loading cancelled','AbortError');};
 const stage=async(label,completed)=>{
  check();let abortStage;
  const aborted=new Promise((resolve,reject)=>{abortStage=()=>reject(controller.signal.reason||new DOMException('Workshop loading cancelled','AbortError'));controller.signal.addEventListener('abort',abortStage,{once:true});});
  try{await Promise.race([Promise.resolve().then(()=>{check();return beforeStage({label,completed,total});}),aborted]);}
  finally{controller.signal.removeEventListener('abort',abortStage);}
  check();stages.push({label,startedAt:performance.now()-started});
 };
 try{
  await stage('Loading workshop modules and complete vehicle',0);
  const prefetched=detailAssets.prefetch();
  // Handle rejection immediately while the verified vehicle stream is decoded.
  let prefetchError=null;const downloaded=prefetched.catch(error=>{prefetchError=error;controller.abort(error);});
  const [,...loadedBuilders]=await Promise.all([
   loadVehicleAsset({signal:controller.signal,onProgress:state=>{if(!controller.signal.aborted)onProgress(state);}}).then(model=>{if(controller.signal.aborted){disposeModel(model);check();}vehicle=model;}),
   ...detailFamilyIds.map(family=>loadDetailBuilder(family,detailAssets)),
  ]);
  const builders=new Map(detailFamilyIds.map((family,index)=>[family,loadedBuilders[index]]));
  await stage('Finishing body and engine explorer downloads',1);
  await downloaded;if(prefetchError)throw prefetchError;
  check();
  await stage('Preparing the complete workshop',2);
  return {vehicle,inspections,builders,detailAssets,initialization:{completed:total,total,buildCount:1,durationMs:performance.now()-started,stages,vehicleAsset:vehicle.deliveryStats},familyBuildCounts:{}};
 }catch(error){
  controller.abort(error);
  detailAssets.dispose();
  if(vehicle)disposeModel(vehicle);
  if(error&&typeof error==='object'&&error.name!=='AbortError')error.workshopLoad=true;
  throw error;
 }finally{
  signal?.removeEventListener('abort',abort);
 }
}
