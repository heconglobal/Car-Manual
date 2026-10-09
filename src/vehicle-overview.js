import {createMaterials} from './materials.js';
import {geometryTools} from './geometry.js';
import {buildBody} from './body.js';
import {buildMechanics,buildInterior} from './mechanics.js';
import {buildHeadlightOverview} from './headlight-detail.js';
import {buildLightingOverview} from './lighting-detail.js';
import {correctLegacyHandedness} from './vehicle-frame.js';
import {createVehicleGroups,setVehicleSpreads,vehicleConfiguration} from './vehicle-state.js';

// The overview evaluates the same authored exterior curves at a lower sampling
// density. Hidden engine, transmission, brake and electrical internals are not
// constructed. Opening an assembly still uses its original full-detail builder.
export function createVehicleOverview(){
 const model=createVehicleGroups(),materials=createMaterials();
 const h=geometryTools(model.groups,materials,{resolution:.55});
 buildBody(h);buildMechanics(h);buildInterior(h);h.optimize();
 buildHeadlightOverview(model.groups,materials,{resolution:.45});
 buildLightingOverview(model.groups,materials,{resolution:.45});
 setVehicleSpreads(model.groups);correctLegacyHandedness(model.groups);
 return {...model,...vehicleConfiguration(model.groups),level:'overview'};
}
