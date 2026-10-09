// All families are initialized during workshop startup and retained for navigation.
const loaders={
 'spare-system':()=>import('./spare-detail.js').then(m=>m.createSpareDetail),
 'wiper-system':()=>import('./wiper-detail.js').then(m=>m.createWiperDetail),
 'interior-system':()=>import('./interior-detail.js').then(m=>m.createInteriorDetail),
 'wiring-system':()=>import('./wiring-detail.js').then(m=>m.createWiringDetail),
 'charging-system':()=>import('./charging-detail.js').then(m=>m.createChargingDetail),
 'lighting-system':()=>import('./lighting-detail.js').then(m=>m.createLightingDetail),
 'headlight-system':()=>import('./headlight-detail.js').then(m=>m.createHeadlightDetail),
 'hvac-system':()=>import('./hvac-detail.js').then(m=>m.createHvacDetail),
 'body-system':()=>import('./body-detail.js').then(m=>m.createBodyDetail),
 'exhaust-system':()=>import('./exhaust-detail.js').then(m=>m.createExhaustDetail),
 'fuel-system':()=>import('./fuel-detail.js').then(m=>m.createFuelDetail),
 'suspension-system':()=>import('./suspension-detail.js').then(m=>m.createSuspensionDetail),
 engine:()=>import('./engine-detail.js').then(m=>m.createEngineDetail),
 transmission:()=>import('./transmission-detail.js').then(m=>m.createTransmissionDetail),
 'cooling-system':()=>import('./cooling-detail.js').then(m=>m.createCoolingDetail),
 'braking-system':()=>import('./brake-detail.js').then(m=>m.createBrakeDetail),
};
export function loadDetailBuilder(family,assets){if(!loaders[family])return Promise.reject(new Error('Unknown assembly '+family));if(assets?.has(family))return Promise.resolve(()=>assets.build(family));return loaders[family]();}

export const detailFamilyIds=Object.freeze(Object.keys(loaders));
