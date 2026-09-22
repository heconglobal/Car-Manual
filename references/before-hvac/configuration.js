// Availability and appearance are distinct from bolt-on interchangeability.
// Source: Pontiac 1985 Canadian brochure, PDF pages 2–6; factory DIY manual §3.
export const defaultConfiguration = {
 paint:'red', exhaustFinish:'bright', interior:'gray', roof:'solid', deck:'clean', wheelFinish:'machined',
 headlights:false, windows:'closed', airConditioning:false, cruise:false,
 powerWindows:false, powerMirrors:false, rearDefrost:false, floorMats:false,
 mapPockets:false, vanityMirror:false, lampGroup:false, radio:'amfm',
 speakerSeats:true, steeringWheel:'formula', dimensions:false, studio:'light'
};
export const paints = [
 {id:'red',name:'Red',color:'#a80912',metalness:0},
 {id:'white',name:'White',color:'#e5e4dc',metalness:0},
 {id:'black',name:'Black',color:'#101113',metalness:0},
 {id:'gray',name:'Light gray metallic',color:'#868c91',metalness:.72}
];
export const options = [
 {key:'paint',label:'Exterior finish',type:'paint',note:'Period colour previews. Your paint code is not encoded in the VIN; colour matching is approximate.'},
 {key:'interior',label:'Interior finish',type:'select',choices:[['gray','Gray cloth'],['tan','Tan cloth']],note:'Display variants; your original trim code remains unknown.'},
 {key:'roof',label:'Roof panel',type:'select',choices:[['solid','Solid roof'],['glass','Tinted glass roof'],['removed','Glass panel removed']],note:'Glass roof availability: brochure p. 6. Removed panel is a viewing state. Conversion requires the correct roof assembly and hardware.'},
 {key:'deck',label:'Rear deck equipment',type:'select',choices:[['clean','Plain decklid'],['rack','Carrier with integral spoiler'],['wing','GT-style rear wing']],note:'Carrier and integral spoiler: GM 22P H-7. Pedestal wing: G-10 and brochure p. 2. Wing is an appearance preview, not proof of SE factory fitment or a bolt-on swap.'},
 {key:'exhaustFinish',label:'Twin tailpipe finish',type:'select',choices:[['bright','Bright stainless preview'],['black','Black SE preview']],note:'GM 22P PDF 122 identifies black W69 SE and bright WU2 GT tailpipes for 1985. The accepted bright rendering is retained as a preview; this VIN does not establish the installed tailpipe finish. The larger accepted tips remain reconstructed.'},
 {key:'wheelFinish',label:'14-inch alloy finish',type:'select',choices:[['machined','Machined alloy'],['dark','Dark recesses']],note:'Reference-inspired Hi-Tech wheel. WS6 brochure lists P215/60R14 tires; finish variants are visualization choices.'},
 {key:'steeringWheel',label:'Steering wheel',type:'select',choices:[['formula','Formula style'],['leather','Leather-wrapped style']],note:'Both listed in the period option chart. Shape and finish are reconstructed from reference views.'},
 {key:'radio',label:'Audio unit',type:'select',choices:[['am','AM'],['amfm','AM/FM stereo'],['cassette','AM/FM cassette'],['equalizer','Cassette + graphic equalizer']],note:'Period sound-system choices, brochure p. 6. Faceplates are reconstructed; wiring and connector differences are not modeled.'},
 {key:'airConditioning',label:'Air conditioning',type:'toggle',note:'Adds visible compressor, condenser and schematic plumbing. Full HVAC conversion parts and installation are not validated.'},
 {key:'cruise',label:'Electronic cruise control',type:'toggle',note:'Adds a reference-inspired servo and stalk details. Cable / electrical compatibility is pending.'},
 {key:'powerWindows',label:'Power windows',type:'toggle',note:'Changes the cabin controls and door crank representation; internal regulators are not yet modeled.'},
 {key:'powerMirrors',label:'Electric sport mirrors',type:'toggle',note:'Adds the mirror control. Mirror drive motors and wiring remain unmodeled.'},
 {key:'rearDefrost',label:'Rear window defroster',type:'toggle',note:'Adds conductive traces to the rear glass. The required switch, circuit and glass must be checked for a real conversion.'},
 {key:'speakerSeats',label:'Headrest speaker seats',type:'toggle',note:'Headrest speaker arrangement shown in brochure p. 4; visible mesh changes with this option.'},
 {key:'floorMats',label:'Carpeted floor mats',type:'toggle',note:'Adds removable mat geometry in both footwells.'},
 {key:'mapPockets',label:'Door map pockets',type:'toggle',note:'Adds pocket geometry to the interior door panels.'},
 {key:'vanityMirror',label:'Visor vanity mirror',type:'toggle',note:'Adds a visor mirror surface. Your actual equipment is unconfirmed.'},
 {key:'lampGroup',label:'Lamp group',type:'toggle',note:'Adds schematic courtesy lights; complete factory lamp-group content is pending verification.'}
];
export const referenceOptions = [
 ['Tilt steering column','Requires column and control details; mechanical animation not implemented.'],
 ['Power door locks','Actuators, rods, switches and wiring need detailed modeling.'],
 ['Controlled-cycle wipers','Switch and delay-module differences need factory wiring references.'],
 ['Engine block heater','Electrical heater and cable routing are not yet modeled.'],
 ['Front compartment power release','Latch, actuator, switch and circuit details are pending.'],
 ['Rear compartment power release','Latch, actuator, switch and circuit details are pending.'],
 ['Custom suede seat trim','Period option listed for GT; availability / fitment on this SE is not established.'],
 ['Automatic transmission alternative','Was a factory powertrain choice; a conversion involves more than exchanging a transaxle. This VIN profile stays manual.'],
 ['Four-cylinder / five-speed combination','Separate factory configuration. Not represented as a V6 bolt-on option.'],
 ['GT aero bodywork','Different fascias and associated exterior parts. The complete conversion is not yet modeled or fitment-verified.']
];
export const factoryDimensions = [
 ['Wheelbase','2,373 mm'],['SE overall length','4,082 mm'],['Overall width','1,752 mm'],['Overall height','1,192 mm'],['Front track, except GT','1,468 mm'],['Rear track, except GT','1,492 mm']
];
export function sanitizeConfiguration(input={}){
 const result={...defaultConfiguration};
 for(const [key,value] of Object.entries(input)){
  if(!(key in result))continue;
  if(typeof result[key]==='boolean'){if(typeof value==='boolean')result[key]=value;continue;}
  const option=options.find(o=>o.key===key);const values=key==='paint'?paints.map(p=>p.id):option?.choices?.map(c=>c[0])||(key==='studio'?['light','dark']:key==='windows'?['closed','open']:[]);
  if(values.includes(value))result[key]=value;
 }
 return result;
}
