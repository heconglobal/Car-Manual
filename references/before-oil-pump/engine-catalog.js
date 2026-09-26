import {lifterSections,lifterInternalParts,lifterSource,lifterReferenceNote} from './engine-lifters.js';
import {cylinderNumber,cylinderReference,mvma1985,chevroletV6Blueprint} from './factory-specifications.js';
import {valveHardwareParts} from './engine-valvetrain.js';
import {engineServiceParts,waterPumpInternals} from './engine-service-catalog.js';
import {engineControlParts} from './engine-controls.js';
import {ignitionParts,ignitionReferences,sparkPlugReference} from './ignition-catalog.js';
export const engineSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf';
export const engineSections=[
 {id:'engine',name:'Complete 2.8L V6',description:'Explore the L44 engine, then open a subassembly to separate its modeled components.'},
 {id:'short-block',name:'Block & rotating assembly',spread:[0,0,0]},
 {id:'head-front',name:'Cabin-side cylinder head',spread:[0,.30,-.42]},
 {id:'head-rear',name:'Trunk-side cylinder head',spread:[0,.30,.42]},
 {id:'engine-controls',name:'Sensors, valves & lines',spread:[0,.37,-.42]},
 {id:'induction',name:'Intake & fuel injection',spread:[0,.68,0]},
 {id:'timing',name:'Camshaft & timing drive',spread:[-.46,0,0]},
 {id:'lubrication',name:'Oil pan & lubrication',spread:[0,-.38,0]},
 {id:'dipstick-detail',parent:'lubrication',name:'Dipstick & guide tube',spread:[0,-.38,0]},
 {id:'oil-pressure-detail',parent:'lubrication',name:'Oil-pressure sender · A/C',spread:[0,-.38,0]},
 {id:'ignition',name:'Ignition & tune-up',spread:[.46,.25,0]},
 {id:'distributor-detail',parent:'ignition',name:'Distributor & ICM',spread:[.46,.25,0]},
 {id:'coil-detail',parent:'ignition',name:'Coil, harnesses & tach filter',spread:[.46,.25,0]},
 {id:'plug-wires',parent:'ignition',name:'Spark plugs & HT leads',spread:[.46,.25,0]},
 {id:'accessories',name:'Cooling & accessories',spread:[-.68,.15,0]},
 {id:'thermostat-detail',parent:'accessories',name:'Thermostat & filler neck',spread:[-.68,.15,0]},
 {id:'water-pump-detail',parent:'accessories',name:'Water pump & pulley',spread:[-.68,.15,0]},
 {id:'flywheel',name:'Manual-engine flywheel',spread:[.46,-.08,0]},
];
for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++)for(const type of ['intake','exhaust'])engineSections.push({id:`valve-${bank}-${c}-${type}`,parent:`head-${bank}`,name:`Cylinder ${cylinderNumber(bank,c)} ${type} valve gear`,spread:[0,.30,s*.42]});
engineSections.push(...lifterSections);
export const engineParts=[];
const part=(id,section,name,description,spread=[0,0,0])=>engineParts.push({id:`eng-${id}`,section,system:'engine',name,description,location:engineSections.find(s=>s.id===section).name,spread,source:['short-block','timing','lubrication','accessories','flywheel'].includes(section)?'GM 22P · H-19':'GM 22P · H-22'});
part('block','short-block','Cylinder block','Reconstructed 60-degree V6 block with six open cylinder bores, crankcase walls and main-bearing saddles. Local casting details and dimensions are approximate.');
part('crankshaft','short-block','Crankshaft','Main journals, offset crankpins and counterweights. The crank is separated below the block for inspection.',[0,-.27,0]);
for(let i=1;i<=4;i++)part(`main-cap-${i}`,'short-block',`Main bearing cap ${i}`,'Separate main-bearing cap with representative fasteners. Bearing clearances and bolt torques are not supplied.',[0,-.45-(i%2)*.07,0]);
for(let i=1;i<=4;i++)part(`main-bearing-${i}`,'short-block',`Main bearing shell pair ${i}`,'Separate upper and lower shell representations, grouped as a pair. Bearing size and clearance are not specified.',[0,-.36,.13]);
for(const [bank,s] of [['front',-1],['rear',1]]){
 const section=`head-${bank}`,label=s<0?'Cabin-side':'Trunk-side';
 part(`${bank}-head`,section,`${label} cylinder head`,'Cast head with a machined deck, valve openings, spring bosses and an open rocker gallery. Combustion-pocket profiles and water passages remain incomplete; this is not a measured replacement casting.');
 part(`${bank}-head-gasket`,section,`${label} head gasket`,'Separate gasket with cylinder openings; outline is illustrative, not a fabrication template.',[0,-.10,0]);
 part(`${bank}-cover`,section,`${label} valve cover`,'Finned red valve cover with machined rib faces.',[0,.43,s*.06]);
 part(`${bank}-cover-gasket`,section,`${label} valve-cover gasket`,'Separate perimeter gasket beneath the cover.',[0,.35,s*.05]);
 part(`${bank}-head-bolts`,section,`${label} head bolt set`,'Representative grouped head fasteners. Exact count, lengths and tightening sequence remain unverified.',[.08,.19,s*.12]);
 for(let c=1;c<=3;c++){
  const tag=`${bank}-${c}`,where=`${label}, cylinder ${cylinderNumber(bank,c)}`;
  part(`piston-${tag}`,'short-block',`${where} piston`,'Separate piston with crown, skirt and ring grooves. Cylinder identity follows the Pontiac bank layout; the displayed static piston position is not a running-engine simulation.',[(c-2)*.10,.08,s*.35]);
  part(`rings-${tag}`,'short-block',`${where} piston rings`,'Two compression rings and an illustrative oil-control ring set, grouped for inspection.',[(c-2)*.10,.21,s*.35]);
  part(`pin-${tag}`,'short-block',`${where} wrist pin`,'Hollow pin connecting piston and rod.',[(c-2)*.10+.11,.08,s*.35]);
  part(`rod-${tag}`,'short-block',`${where} connecting rod`,'Connecting rod with open small and big ends.',[(c-2)*.10,-.06,s*.35]);
  part(`rod-cap-${tag}`,'short-block',`${where} rod cap`,'Separate big-end cap and representative bolts.',[(c-2)*.10,-.17,s*.35]);
  part(`rod-bearing-${tag}`,'short-block',`${where} rod bearing shells`,'Paired bearing-shell representations inside the connecting-rod big end.',[(c-2)*.10,-.06,s*.46]);
  for(const type of ['intake','exhaust']){
   const v=`${tag}-${type}`,name=`${where} ${type}`,valveSection=`valve-${v}`;
   part(`valve-${v}`,valveSection,`${name} valve`,'One-piece poppet valve with a beveled seat edge, curved tulip transition and long stem. Valve angle, lift and seating dimensions remain approximate.',[(c-2)*.075,-.17,s*.17]);
   part(`spring-${v}`,valveSection,`${name} valve spring`,'Helical valve spring. The spring cap, keeper pair and stem seals are separate selections. Spring rate and installed height are not verified.',[(c-2)*.075,.16,s*.17]);
   part(`rocker-${v}`,valveSection,`${name} rocker arm`,'Hollow stamped rocker arm with raised side flanges, a slotted stud opening, contact pads and a spherical fulcrum. Stud, guide plate and adjusting nut are separate selections.',[(c-2)*.075,.29,s*.17]);
   part(`pushrod-${v}`,valveSection,`${name} pushrod`,'Individual pushrod with rounded ends connecting its lifter seat to the rocker socket. Length and running clearance remain reconstructed.',[(c-2)*.075,.04,-s*.15]);
   part(`lifter-${v}`,`lifter-${v}`,`${name} hydraulic lifter body`,'Hollow flat-tappet body with a closed cam-contact foot, open oil-feed drilling, annular oil groove and internal retaining-ring groove. Open its nine-piece lifter scope to inspect the internal pieces.',[(c-2)*.075,-.09,-s*.15]);
  }
  part(`spark-${tag}`,'plug-wires',`${where} spark plug`,'Spark plug with ribbed ceramic, metal terminal, hex, tapered seat, threaded shell and ground electrode. Shape is reconstructed. The factory reference below is specific to the original 1985 six-cylinder engine.',[(c-2)*.09,0,s*.27]);
  Object.assign(engineParts.at(-1),{system:'electrical',source:ignitionReferences.est.label,sourceUrl:ignitionReferences.est.url,aliases:'ignition tune up plugs',serviceReference:sparkPlugReference});
 }
 part(`${bank}-exhaust`,section,`${label} exhaust manifold`,'Shared tubular manifold, individual port flanges, common collector and weld beads. Open the V6 exhaust explorer for crossover shields and attachment sets. Local profiles remain reconstructed.',[0,-.06,s*.34]);
 part(`${bank}-exhaust-gasket`,section,`${label} exhaust gasket set`,'Three port-gasket representations grouped for inspection; not fabrication templates.',[0,-.02,s*.22]);
}
for(const [id,name,desc,spread] of [
 ['lower-intake','Lower intake manifold','Lower casting bridging both banks.',[0,0,0]],
 ['middle-intake','Middle intake runners','Six formed runners between lower manifold and upper plenum.',[0,.17,0]],
 ['plenum','Upper intake plenum','Red upper plenum; catalog distinguishes 1985–86 from later versions.',[0,.35,0]],
 ['intake-gaskets','Intake gasket set','Grouped port gaskets; not fabrication outlines.',[0,-.10,0]],
 ['throttle','Throttle body','Bore, butterfly and external housing.',[.22,.35,0]],
 ['fuel-rail','Fuel rail & regulator','Twin rail tubes with a regulator representation.',[0,.09,.20]],
])part(id,'induction',name,desc,spread);
for(let i=0;i<6;i++)part(`injector-${i+1}`,'induction',`Cylinder ${cylinderNumber(i<3?'front':'rear',i%3+1)} fuel injector`,'Individual injector exterior with connector and seals. Cylinder identity follows the Pontiac bank layout.',[(i%3-1)*.06,-.05,(i<3?-1:1)*.12]);
for(const [id,section,name,desc,spread] of [
 ['camshaft','timing','Camshaft','Cam-in-block shaft at the GM production-family 159.03 mm crank-to-cam datum, with twelve reconstructed lobes, four journals and a locating nose. Static lobe phases are illustrative.',[-.28,0,0]],
 ['cam-bearings','timing','Camshaft bearing set','Four annular bearing sleeves surrounding the cam journals. Bore surfaces and axial separation are checked in the model; original sizes, running clearances and oil holes remain unverified.',[.12,.10,0]],
 ['cam-gear','timing','Camshaft sprocket','Larger open-web timing sprocket with three mounting bolts. Forty teeth follow researched replacement data; original GM tooth tooling, hole dimensions and application equivalence remain unverified.',[-.13,.04,0]],
 ['crank-gear','timing','Crankshaft sprocket','Twenty-tooth reconstructed crank sprocket paired at 2:1 with the cam sprocket. Tooth tooling, keyway and original-part fit remain unverified.',[-.13,-.04,0]],
 ['chain','timing','Timing chain','Pin-connected plate links following tangent runs around both sprockets. Link profiles, pitch, silent-chain plate stack and tooth engagement are illustrative, not a running timing simulation.',[-.23,0,0]],
 ['timing-cover','timing','Timing cover','Open-backed timing-cover shell with a crank-seal aperture, rear flange and matching separate gasket. Chain containment is checked; original casting, coolant passages and bolt map remain unmeasured.',[-.36,0,0]],
 ['balancer','timing','Harmonic balancer','Crankshaft damper and belt-groove representation.',[-.49,0,0]],
 ['crank-pulley','accessories','Crankshaft accessory pulley','Separate dished drive pulley ahead of the harmonic balancer. The belt follows the shared crank, water-pump and generator pulley envelopes; diameters and belt length remain reconstructed.',[-.37,0,0]],
 ['pan','lubrication','Oil pan','Stepped stamped sump with a shallow timing-end shelf, drawn corners, open interior, flange and separate drain plug and flange fasteners. Shape follows GM H-19; local dimensions and finish are reconstructed.',[0,-.20,0]],
 ['pan-gasket','lubrication','Oil-pan gasket','Two separate side-rail gasket strips, grouped. The early rear end seal is a separate selection. Front end sealing and exact flange profiles remain incomplete; not a fabrication template.',[0,-.07,0]],
 ['oil-pump','lubrication','Oil pump','Pump housing below the crankcase.',[.13,0,0]],
 ['pickup','lubrication','Oil pickup & strainer','Formed pickup tube and screened inlet.',[-.13,-.04,0]],
 ['oil-filter','lubrication','Oil filter','Spin-on filter exterior.',[.18,-.05,-.24]],
 ['water-pump','water-pump-detail','Water pump','Contoured cast pump, open rear chamber, irregular mounting flange, bearing nose. Hub, unitized shaft/bearing, mechanical seal and impeller are selectable; exact original coolant passages and internal variants remain unverified.',[0,0,0]],
 ['water-pulley','water-pump-detail','Water-pump pulley','Stamped dish pulley with a formed rim and open centre. Fasteners are separately selectable; local dimensions remain reconstructed.',[-.16,0,0]],
 ['alternator','accessories','Alternator','Shared generator castings, rotor/stator, bearings, regulator/rectifier and brushes. Open its linked component explorer for individual selections.',[0,.23,-.16]],
 ['belt','accessories','Accessory belt','Representative belt loop; not a routing or length specification.',[-.27,0,0]],
 ['flywheel','flywheel','Manual-transmission flywheel','Engine-side flywheel and ring gear; clutch and transaxle remain separate vehicle assemblies.',[.15,0,0]],
 ['rear-seal','flywheel','Rear crankshaft seal','Separate annular crank seal.',[0,0,0]],
])part(id,section,name,desc,spread);
engineParts.push(...ignitionParts,...engineControlParts,...engineServiceParts,...waterPumpInternals,...valveHardwareParts,...lifterInternalParts);
for(const p of engineParts.filter(p=>/^eng-lifter-(front|rear)-/.test(p.id)))Object.assign(p,{callout:1,source:'GM 1986 · 6A-20 figure 46',sourceUrl:lifterSource,referenceNote:lifterReferenceNote});
for(const [id,callout] of [['eng-water-pump',72],['eng-water-pulley',69]])Object.assign(engineParts.find(p=>p.id===id),{source:'GM 22P · H-19',sourceUrl:engineSource+'#page=14',callout});
for(const p of engineParts){const m=p.id.match(/(?:piston|rings|pin|rod|rod-cap|rod-bearing|spark|valve|spring|rocker|pushrod|lifter)-(front|rear)-([123])/);if(m){p.cylinder=cylinderNumber(m[1],Number(m[2]));if(!p.serviceReference)p.serviceReference=cylinderReference;}}
Object.assign(engineParts.find(p=>p.id==='eng-block'),{serviceReference:{title:'1985 L44 nominal engine dimensions',rows:[['Bore','89.0 mm'],['Stroke','76.0 mm'],['Cylinder pitch','111.8 mm'],['Block deck height','224 mm'],['Bank offset','44 mm']],links:[['Pontiac 1985 engine specifications',mvma1985+'#page=5'],['GM production V6 blueprint · figure 11',chevroletV6Blueprint]],note:'Nominal bore and pitch are applied to this reconstruction. Deck height and bank stagger use the GM production-family blueprint. Casting contours, installed mounts, bore fits and operating clearances remain unmeasured.'}});
export const enginePartById=new Map(engineParts.map(p=>[p.id,p]));
export const engineSectionById=new Map(engineSections.map(s=>[s.id,s]));
export function inEngineSection(part,section){
 if(section==='engine')return true;
 let id=part.section;while(id){if(id===section)return true;id=engineSectionById.get(id)?.parent;}
 return false;
}
export const engineMembers=section=>engineParts.filter(p=>inEngineSection(p,section));

Object.assign(engineParts.find(p=>p.id==='eng-alternator'),{relatedAssembly:'charging-alternator',relatedAssemblyLabel:'Inspect generator internals'});
