import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {createVehicleGroups,setVehicleSpreads,vehicleConfiguration} from './vehicle-state.js';

// A vehicle context chunk lives only while that system is being explored.
// Dynamic imports keep unrelated mechanical builders off the startup path.
const entries={
 body:[()=>import('./body.js').then(m=>(g,mat)=>{const h=geometryTools(g,mat);m.buildBody(h);h.optimize();}),()=>import('./vehicle-body-hardware.js').then(m=>m.buildVehicleBodyHardware)],
 engine:[()=>import('./vehicle-engine.js').then(m=>m.buildVehicleEngine)],
 drivetrain:[()=>import('./vehicle-powertrain.js').then(m=>m.buildVehiclePowertrain)],
 suspension:[()=>import('./vehicle-suspension.js').then(m=>m.buildVehicleSuspension)],
 brakes:[()=>import('./vehicle-brakes.js').then(m=>m.buildVehicleBrakes)],
 cooling:[()=>import('./vehicle-powertrain.js').then(m=>m.buildVehiclePowertrain),()=>import('./vehicle-hvac.js').then(m=>m.buildVehicleHvac)],
 fuel:[()=>import('./vehicle-fuel.js').then(m=>m.buildVehicleFuel),()=>import('./vehicle-exhaust.js').then(m=>m.buildVehicleExhaust)],
 electrical:[()=>import('./headlight-detail.js').then(m=>m.buildVehicleHeadlights),()=>import('./lighting-detail.js').then(m=>m.buildVehicleLighting),()=>import('./charging-detail.js').then(m=>m.buildVehicleCharging),()=>import('./wiring-detail.js').then(m=>m.buildVehicleWiring),()=>import('./wiper-detail.js').then(m=>m.buildVehicleWipers)],
 interior:[()=>import('./mechanics.js').then(m=>(g,mat)=>{const h=geometryTools(g,mat);m.buildInterior(h);h.optimize();}),()=>import('./wiring-detail.js').then(m=>m.buildVehicleWiring),()=>import('./vehicle-hvac.js').then(m=>m.buildVehicleHvac),()=>import('./headlight-detail.js').then(m=>m.buildVehicleHeadlights),()=>import('./lighting-detail.js').then(m=>m.buildVehicleLighting),()=>import('./vehicle-brakes.js').then(m=>m.buildVehicleBrakes)],
 spare:[()=>import('./spare-detail.js').then(m=>m.buildVehicleSpare)],
};
export async function loadVehicleChunkBuilder(key){
 if(key==='all')return import('./model.js').then(m=>m.createVehicle);
 if(!entries[key])throw new Error('Unknown vehicle system '+key);
 const builders=await Promise.all(entries[key].map(load=>load()));
 return ()=>{
  const model=createVehicleGroups(),materials=createMaterials();
  for(const build of builders)build(model.groups,materials);
  setVehicleSpreads(model.groups);correctLegacyHandedness(model.groups);
  return {...model,...vehicleConfiguration(model.groups),level:'system',system:key};
 };
}
