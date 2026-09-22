import {engineParts,engineSections} from './engine-catalog.js';
import {transmissionParts,transmissionSections} from './transmission-catalog.js';
import {coolingParts,coolingSections} from './cooling-catalog.js';
import {brakeParts,brakeSections} from './brake-catalog.js';
export const detailFamilies={
 engine:{id:'engine',name:'Engine',shortName:'2.8L V6',system:'engine',icon:'engine',kicker:'L44 / 2.8L V6',coverage:'Engine internals, ignition and service hardware. Measured castings, complete passages, routing and some accessory internals remain incomplete.'},
 transmission:{id:'transmission',name:'Transmission',shortName:'Four-speed',system:'drivetrain',icon:'gear',kicker:'FOUR-SPEED / 76 MM',coverage:'Case, gear trains, reverse idler, synchronizers, bearings, differential, selector and clutch. Gear profiles and casting dimensions are reconstructed. Detailed hydraulics, CV joints and mounting hardware remain incomplete.'},
 'cooling-system':{id:'cooling-system',name:'Cooling',shortName:'Coolant circuit',system:'cooling',icon:'water',kicker:'L44 / COOLANT CIRCUIT',coverage:'Radiator, fan, asymmetric inlet and return pipes, recovery bottle and heater circuit preview. Hose bends, fan variant, clearances and local dimensions need further verification. Thermostat and water pump can be opened through the engine service views.'},
 'braking-system':{id:'braking-system',name:'Brakes',shortName:'1985 brakes',system:'brakes',icon:'disc',kicker:'1985 / FOUR-WHEEL DISC',coverage:'Four separate corners, front integral rotor/hubs, rear hub units, calipers and parking actuators, composite master, tandem booster, lines and cables. Nominal rotor dimensions follow the 1985 DIY manual. Casting profiles, detailed fits, hose clearances, rear piston clutch internals and valve calibration remain unverified.'},
};
export const detailParts=[...engineParts.map(p=>({...p,family:'engine'})),...transmissionParts.map(p=>({...p,family:'transmission'})),...coolingParts.map(p=>({...p,family:'cooling-system'})),...brakeParts.map(p=>({...p,family:'braking-system'}))];
export const detailSections=[...engineSections.map(s=>({...s,family:'engine',parent:s.id==='engine'?undefined:s.parent||'engine'})),...transmissionSections.map(s=>({...s,family:'transmission'})),...coolingSections.map(s=>({...s,family:'cooling-system'})),...brakeSections.map(s=>({...s,family:'braking-system'}))];
export const detailPartById=new Map(detailParts.map(p=>[p.id,p]));
export const detailSectionById=new Map(detailSections.map(s=>[s.id,s]));
export const familyFor=section=>detailFamilies[detailSectionById.get(section)?.family||'engine'];
export function inDetailSection(part,section){if(!part)return false;let id=part.section;while(id){if(id===section)return true;id=detailSectionById.get(id)?.parent;}return false;}
export const detailMembers=section=>detailParts.filter(p=>inDetailSection(p,section));
