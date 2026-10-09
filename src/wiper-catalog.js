const catalog='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf';
const service='https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf';
export const wiperSections=[
 {id:'wiper-system',name:'Wipers & washer'},
 {id:'wiper-linkage',parent:'wiper-system',name:'Arms, blades & transmission links'},
 {id:'wiper-motor',parent:'wiper-system',name:'Motor, park mechanism & pulse preview'},
 {id:'wiper-washer',parent:'wiper-system',name:'Washer bottle, pump & nozzles'},
];
export const wiperParts=[];
function part(id,section,name,description,spread,page,callout=null,extra={}){
 wiperParts.push({id:'ww-'+id,section:'wiper-'+section,system:'electrical',name,description,spread,callout,
  source:page<1000?'GM parts catalog · PDF '+page:'1986 Pontiac 8E2 · adjacent-year construction',
  sourceUrl:(page<1000?catalog:service)+'#page='+page,
  referenceNote:'Static reconstruction. Catalog applications and service-unit boundaries are distinguished from measured dimensions. Pivot coordinates, sweep, gear profile, electrical calibration and original installed option remain unverified. Exploded offsets are not a removal sequence.',
  location:wiperSections.find(s=>s.id==='wiper-'+section).name,...extra});
}
for(const [side,s] of [['left',1],['right',-1]]){
 const who=side==='left'?'Driver':'Passenger';
 part('arm-'+side,'linkage',who+' wiper arm & cap','Shared parked arm geometry with the complete car; spring loading and splines remain unverified.',[s*.04,.12,0],284,2);
 part('blade-'+side,'linkage',who+' 18-inch blade & refill','Shared curved refill, articulated bows and retaining clips. The nominal envelope is 18 inches; tooling and full sweep remain unmeasured.',[s*.04,.24,0],284,1);
 part('pivot-'+side,'linkage',who+' transmission pivot & support','Service assembly includes shaft, support, lever and bearings. Internal construction is grouped; not a verified bearing stack.',[s*.12,-.06,0],284,4,{partNumber:side==='left'?'22039337':'22039336'});
 part('link-'+side,'linkage',who+' transmission operating link','Independent linkage rod ending at the motor crank and pivot lever. Positions are reconstructed, not calibrated sweep data.',[s*.10,-.13,0],284,4);
 part('joint-'+side,'linkage',who+' linkage socket ends','Separate socket ends, grouped as a service construction set. Catalog item 4 includes these joints.',[s*.16,-.19,0],284,4);
}
part('link-deflector','linkage','Rear transmission-link deflector','Separate protection over the rear operating link; local section remains reconstructed.',[0,.06,.06],284,3,{partNumber:'20451044'});
const standard={option:'delayWipers',value:false},pulse={option:'delayWipers',value:true};
for(const [id,name,description,spread,callout,number] of [
 ['housing','Standard motor die-cast housing','Open gear pocket and motor flange with separate mounting ears. GM 22062915 identifies the complete standard motor service unit, not a separately catalogued bare housing.',[0,0,.02],1,'22062915'],
 ['seal','Output-shaft seal','Annular seal around the output shaft.',[0,0,.08],2,null],
 ['mounts','Motor mounting grommets & fasteners','Grouped mount isolation and retaining hardware; exact installed quantities and fastener lengths remain unverified.',[.09,-.05,0],5,null],
 ['washers','Gear thrust washers','Separate washer pair shown with the drive gear; measured end play is not established.',[0,.04,.12],6,null],
 ['gear','Reduction gear assembly','Annular reconstructed gear blank with shaft and park cam. Tooth count/profile is deliberately unspecified pending original measurements.',[0,0,.17],7,null],
 ['bearings','Armature shaft bearings','Separate end bearings around the motor shaft, with open bores.',[.10,.07,0],8,null],
 ['brush-holder','Brush holder, brushes & thermal protector','Construction follows adjacent-year Pontiac 8E2: common, low and high brushes with a protector. Terminal positions here are not a physical pinout.',[.12,0,.07],9,'22029825'],
 ['bearing-straps','Armature bearing retaining straps','Separate retainers at both bearing ends.',[.17,.08,0],10,null],
 ['armature','Armature, commutator & worm shaft','Separate rotor and shaft construction. Winding turns and worm lead are not calibrated.',[.21,0,0],11,'22030808'],
 ['cover','Standard motor cover','Removable cover over the gear and park mechanism.',[0,0,.24],12,'22038937'],
 ['field','Permanent-magnet field assembly','Open motor barrel with paired field segments and end wall; magnet dimensions remain reconstructed.',[.29,0,0],13,'22030807'],
 ['park','Park-switch actuator','Cam follower and contact support. Contact timing and dynamic braking are not electrically simulated.',[-.08,.07,.12],14,'22029824'],
])part('motor-'+id,'motor',name,description,spread,287,callout,{...standard,...(number?{partNumber:number}:{})});
part('motor-crank','motor','Motor output crank','Shared output crank, including separate locknut. Its throw and parked angle are reconstructed.',[0,.04,-.09],286,4,{partNumber:'22039338'});
part('motor-nut','motor','Output-crank locknut','Separate nut on the output shaft; no unsupported torque is assigned.',[0,.07,-.14],287,4);
part('pulse-motor','motor','CD4 pulse motor service unit','1985–87 CD4 application 22062913. Motor internals remain grouped because the pulse drawing defines a service assembly.',[.10,0,0],284,7,{...pulse,partNumber:'22062913'});
part('pulse-board','motor','CD4 pulse circuit-board substrate','Separate board and connector carrier. No invented component population, circuit values or repair pinout.',[0,0,.15],286,2,{...pulse,partNumber:'22102002'});
part('pulse-cover','motor','CD4 motor cover kit','Separate cover and attachment set matching the pulse board compartment.',[0,0,.25],286,1,{...pulse,partNumber:'22039315'});
for(const [id,name,description,spread] of [
 ['bottle','Washer-fluid container','Open-neck reconstructed bottle with a separate cap and bottom-mounted pump. Original volume and molded markings remain unverified.',[0,0,0]],
 ['cap','Washer bottle cap','Separate cap at the filler neck.',[0,.16,0]],
 ['pump','Bottom-mounted washer pump','Sealed service unit beneath the bottle, with separate inlet and outlet. Internal impeller and winding calibration remain unverified.',[0,-.14,0]],
 ['pump-seal','Pump inlet seal','Annular seal between the bottle outlet and the pump inlet. Local cross-section is reconstructed.',[0,-.07,0]],
 ['check-valve','Washer check valve','Distinct inline check-valve service unit. Internal opening pressure is not assigned.',[.13,0,0]],
 ['feed-hose','Pump-to-valve hose','Reconstructed hose connects the actual pump outlet to the check valve.',[.12,-.06,0]],
 ['branches','Washer distribution hoses','Separate branches from the valve to both cowl nozzles. Routing and clip coordinates remain unmeasured.',[0,.09,0]],
 ['nozzles','Left & right washer nozzles','Two separate hollow outlet forms, grouped as a pair. Spray angle and flow remain uncalibrated.',[0,.16,-.05]],
])part('washer-'+id,'washer',name,description,spread,1131);
