import * as T from 'three';

// Common assembly coordinates, metres, before the single US-LHD conversion.
// Shaft spacing is nominal; differential separation, installation angle and
// installed hard points are reconstructed packaging, not measured GM datums.
export const transaxleDatum={input:[.59,0],output:[.514,0],differential:[.424,.064]};
export const installationAngle=-50*Math.PI/180;
export const differentialVehicle=[.16,.304,1.1865];
export const transmissionPlacement=new T.Matrix4().makeTranslation(...differentialVehicle)
 .multiply(new T.Matrix4().makeRotationX(installationAngle))
 .multiply(new T.Matrix4().makeTranslation(0,-transaxleDatum.differential[0],-transaxleDatum.differential[1]));
export const transmissionToVehicle=p=>new T.Vector3(...p).applyMatrix4(transmissionPlacement).toArray();
// Existing external brackets/cylinder were authored at the old unrotated
// vehicle offset. Rebase those complete shapes with the same rigid placement.
export const transmissionAttachment=p=>transmissionToVehicle([p[0]-.16,p[1]+.12,p[2]-1.1225]);
const crank=transmissionToVehicle([0,...transaxleDatum.input]);
// Engine flywheel centre x=.231 coincides with transmission flywheel x=-.018.
export const engineOffset=[differentialVehicle[0]-.018-.231,crank[1]-1.05,crank[2]];
export const enginePlacement=new T.Matrix4().makeTranslation(...engineOffset);
export const engineToVehicle=p=>p.map((v,i)=>v+engineOffset[i]);
export const vehicleToEngine=p=>p.map((v,i)=>v-engineOffset[i]);
export const alternatorEngine=[-.252,1.20,.240];
export const starterVehicle=[crank[0]-.018-.132,crank[1]-.120,crank[2]-.105];
export const pumpInletEngine=[-.282,1.190,.171];
export const pumpHeaterReturnEngine=[-.282,1.301,.118];
