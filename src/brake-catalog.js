export const brakeSources={
 parts:'https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf',
 diy:'https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=59',
 service:'https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf',
 rear1985:'https://cdn11.bigcommerce.com/s-ragx7opcj4/content/files/1985-pontiac-fiero-service-manual-sample1.jpg?t=1663030449',
};
// 1985 Pontiac DIY, printed 3-2: nominal dimensions, NOT discard limits.
export const brakeDimensions={diameter:9.72*.0254,frontThickness:.43*.0254,rearThickness:.50*.0254};
export const brakeCorners=[
 {id:'fl',name:'Left front',front:true,side:'left',sign:1,z:-1.1865},
 {id:'fr',name:'Right front',front:true,side:'right',sign:-1,z:-1.1865},
 {id:'rl',name:'Left rear',front:false,side:'left',sign:1,z:1.1865},
 {id:'rr',name:'Right rear',front:false,side:'right',sign:-1,z:1.1865},
];
export const brakeSections=[
 {id:'braking-system',name:'Complete 1985 braking system'},
 {id:'brake-front',parent:'braking-system',name:'Front discs, calipers & hubs'},
 {id:'brake-rear',parent:'braking-system',name:'Rear discs, calipers & hubs'},
 {id:'brake-hydraulics',parent:'braking-system',name:'Master cylinder, booster & lines'},
 {id:'brake-master',parent:'brake-hydraulics',name:'Composite master cylinder',spread:[.10,.16,-.22]},
 {id:'brake-booster',parent:'brake-hydraulics',name:'Tandem vacuum booster',spread:[0,.20,0]},
 {id:'brake-lines',parent:'brake-hydraulics',name:'Hydraulic lines & vacuum supply',spread:[0,-.12,0]},
 {id:'brake-pedal',parent:'brake-hydraulics',name:'Manual-car brake pedal & switch',spread:[0,.20,.10]},
 {id:'brake-parking',parent:'braking-system',name:'Parking lever, cables & equalizer',spread:[.15,-.12,0]},
];
for(const c of brakeCorners){
 const id='brake-'+c.id;
 brakeSections.push({id,parent:c.front?'brake-front':'brake-rear',name:c.name+' brake'},
  {id:id+'-hub',parent:id,name:c.name+(c.front?' rotor, bearings & spindle':' rotor & hub carrier'),spread:[c.sign*.20,0,c.front?-.14:.14]},
  {id:id+'-caliper',parent:id,name:c.name+' caliper & pads',spread:[c.sign*.34,.12,c.front?-.14:.14]});
}
export const brakeParts=[];
const limits='Factory figures establish part identity and assembly relationships. Unspecified casting dimensions, clearances and finish details are reconstructed. Exploded views are for inspection, not an approved repair sequence.';
function add(id,section,name,description,spread,source,page,callout,extra={}){
 brakeParts.push({id:'br-'+id,section,system:'brakes',name,description,spread,callout,
  source,sourceUrl:page==='rear1985'?brakeSources.rear1985:page<200?brakeSources.parts+'#page='+page:brakeSources.service+'#page='+page,
  location:brakeSections.find(s=>s.id===section).name,referenceNote:limits,...extra});
}
for(const c of brakeCorners){
 const hub='brake-'+c.id+'-hub',cal='brake-'+c.id+'-caliper',s=c.sign;
 const entry=(key,name,desc,x,y=0,z=0,callout=null,extra={})=>add(c.id+'-'+key,hub,c.name+' '+name,desc,[s*x,y,z],`GM 22P · ${c.front?'front':'rear'} disc and hub`,c.front?171:172,callout,{corner:c.id,role:key,...extra});
 entry('rotor',c.front?'integral rotor and hub':'solid brake rotor',c.front?'Solid disc and integral wheel-bearing hub; this is not the later vented rotor or a separate front hub.':'Separate solid rear disc with a five-hole mounting hat; the bearing hub is a different selection.',.12,0,0,c.front?6:1);
 brakeParts.at(-1).serviceReference={title:'1985 nominal rotor dimensions',rows:[['Nominal disc diameter','9.72 in · 246.888 mm'],['Nominal disc thickness',c.front?'0.43 in · 10.922 mm':'0.50 in · 12.700 mm']],note:'Pontiac DIY printed 3-2 gives nominal dimensions. These are not machining or discard limits. Detailed hub offsets and mounting geometry remain reconstructed.',links:[['1985 Pontiac DIY · 3-2',brakeSources.diy]]};
 if(c.front){
  for(const [key,name,x,callout] of [['inner-bearing','inner tapered bearing',-.13,7],['inner-race','inner bearing cup',-.075,7],['outer-bearing','outer tapered bearing',.24,5],['outer-race','outer bearing cup',.18,5],['grease-seal','inner grease seal',-.20,null],['spindle-washer','keyed spindle washer',.30,4],['spindle-nut','castellated spindle nut',.35,2],['cotter','spindle cotter pin',.40,3],['grease-cap','wheel-bearing grease cap',.46,1]])entry(key,name,'Separate '+name+'. Bearing profiles and running clearances are reconstructed.',x,0,key==='cotter'?.05:0,callout);
  entry('spindle','steering knuckle and spindle','Formed steering knuckle, bearing spindle, ball-joint bosses and steering arm. Local pivot coordinates are approximate.',-.28,0,0,10);
  entry('bracket','caliper mounting bracket','Open caliper support bracket, separate from the steering knuckle and sliding caliper.',-.17,0,.09,11);
  entry('bracket-bolts','caliper bracket bolts and washers','Paired bracket-to-knuckle fasteners.',-.31,.04,.08,13);
 }else{
  entry('hub','sealed bearing hub assembly','Five-stud flange and sealed rear wheel-bearing unit. Internal race and ball geometry remain grouped; the unit is not a loose front tapered bearing.',.015,0,0,3);
  entry('hub-bolts','rear hub attachment bolts','Three hub-to-knuckle attachment bolts, grouped.',-.16,0,0,11);
  entry('axle-nut','rear axle retaining nut','Separate drive-axle retaining nut and washer representation. Thread dimensions and torque are not specified.',.25,0,0,null);
  entry('knuckle-seal','rear knuckle bore seal','Separate seal at the rear wheel carrier bore.',-.10,0,0,5);
  entry('knuckle','rear wheel carrier','Rear hub bore, strut attachment ears, lower ball-joint boss and toe-link arm. This is the 1984–87 architecture.',-.24,0,0,4);
 }
 entry('studs','wheel stud set','Five press-in studs. Pitch circle, serration and thread forms are reconstructed.',.23,.05,0,null);
 entry('shield','formed splash shield','Thin formed disc shield with a caliper opening and mounting reliefs.',-.09,0,0,c.front?9:2);
 entry('shield-bolts','splash-shield fasteners','Shield attachment hardware, grouped separately.',-.17,-.08,0,c.front?8:null);
 const cp=(key,name,desc,offset,callout,primary1985=true)=>add(c.id+'-'+key,cal,c.name+' '+name,desc,[s*offset[0],offset[1],offset[2]],c.front?'Pontiac service · 5B1-1 (1986); GM 22P 1985–87 application':primary1985?'1985 Pontiac service · 5-27, figure 5-42':'GM 22P · 1984–87 rear caliper mounting',c.front?245:primary1985?'rear1985':172,callout,{corner:c.id,role:key,aliases:`${c.name} brake rebuild ${key.replaceAll('-',' ')}`});
 cp('housing','caliper housing','Cast body with an open piston bore, bridge, pad window, guide-pin eyes and machined seats. Local contours are reconstructed.',[-.10,0,0],c.front?13:25);
 cp('piston','caliper piston',c.front?'Hollow front hydraulic piston with a separate square-section seal and folded dust boot.':'Rear piston assembly with the adjuster recess and face features. Its internal clutch is not modeled as a validated operating mechanism.',[.18,0,0],c.front?10:17);
 cp('piston-seal','square-section piston seal','Hydraulic bore seal, distinct from the external dust boot.',[.105,0,0],c.front?11:18);
 cp('piston-boot','piston dust boot','Folded annular boot between the piston lip and caliper counterbore.',[.24,0,0],c.front?9:15);
 cp('pad-inner','inboard brake pad','Curved steel backing plate with bonded friction material, mounting ears and retaining features. Material thickness is reconstructed.',[.31,0,0],c.front?6:null,false);
 cp('pad-outer','outboard brake pad','Distinct outer backing plate, bonded lining and outer attachment features.',[.41,0,0],c.front?5:null,false);
 cp('guide-bolts','caliper guide bolt pair','Two separate-looking guide bolts grouped for selection. Pins slide along the wheel axis.',[-.31,0,0],c.front?1:8,false);
 cp('guide-sleeves','guide sleeve pair','Hollow steel sleeves around the sliding mounting bolts.',[-.23,0,0],c.front?2:8,false);
 cp('guide-bushings','guide bushing set','Elastomer bushings at both guide eyes, distinct from steel sleeves.',[-.17,.10,0],c.front?3:9,false);
 if(c.front)cp('guide-small-bushings','small guide bushing pair','Separate smaller inboard bushings; the front drawing distinguishes these from the larger outer bushings.',[-.13,-.09,0],4);
 cp('guide-covers','guide end cover pair','Protective end covers at the guide bores. Appearance follows the early catalog.',[-.37,0,0],c.front?null:9,false);
 cp('bleeder','caliper bleeder screw','Separate hexagonal bleeder with a conical tip and hose nipple at the high point of the bore.',[0,.15,0],c.front?12:24);
 cp('bleeder-cap','bleeder protective cap','Rubber protective cap on the bleed nipple.',[0,.20,0],c.front?null:23);
 cp('pad-spring',c.front?'inboard pad retainer spring':'pad dampening spring',c.front?'Stamped spring clip inside the front piston retains the inner pad.':'Three-lobed spring at the rear piston face; distinct from the parking-lever return spring.',[.35,.04,0],c.front?8:14);
 cp('wear-tab','pad wear indicator','Bent acoustic wear tab at the pad edge.',[.38,.13,0],c.front?7:null,false);
 if(!c.front){
  for(const [key,name,desc,offset,callout] of [
   ['actuator','parking-brake actuator screw','Threaded actuator between the outer lever and piston adjuster. Helix and internal fits are illustrative.',[-.02,0,0],19],
   ['balance-spring','piston balance spring','Helical spring between the housing and piston recess.',[.055,0,0],20],
   ['thrust-washer','actuator thrust washer','Separate thrust washer behind the actuator head.',[-.045,.07,0],21],
   ['shaft-seal','actuator shaft seal','Small inner shaft seal, separate from the outside lever seal.',[-.055,-.06,0],22],
   ['check-valve','piston two-way check valve','Small valve represented at the piston face. This is not a working hydraulic simulation.',[.27,-.06,0],16],
   ['lever-seal','parking-lever seal','External seal at the mechanical actuator shaft.',[-.20,-.055,0],6],
   ['lever-washer','parking-lever anti-friction washer','Separate washer between the lever and the housing seal.',[-.24,-.055,0],7],
   ['lever','parking-brake lever','Pressed steel lever with actuator opening, cable seat and spring hook. Left and right placement is preserved.',[-.30,0,0],2],
   ['lever-nut','parking-lever retaining nut','Hexagonal retaining nut on the actuator shaft.',[-.36,0,0],1],
   ['return-spring','parking-lever return spring','External extension spring with hooked ends. Distinct from the internal balance spring.',[-.22,0,-.14],3],
   ['cable-bracket','parking-cable support bracket','Formed steel bracket that locates the cable sheath beside the mechanical lever.',[-.14,0,-.12],5],
   ['cable-bracket-bolt','parking-cable bracket bolt','Separate cable-support attachment fastener.',[-.28,-.07,-.12],4],
  ])cp(key,name,desc,offset,callout);
 }
}
const master=[
 ['body','Stepped master-cylinder body','Open stepped bore, mounting flange, two reservoir bosses and separate line ports.',[0,0,0],12],
 ['reservoir','Dual-chamber brake-fluid reservoir','Open molded reservoir with a dividing wall and two feed spigots.',[0,.12,0],3],
 ['cover','Master reservoir cover','Separate rectangular cover with retaining edge and shallow stamped ribs.',[0,.28,0],1],
 ['diaphragm','Reservoir cover diaphragm','Folded rubber diaphragm with separate pockets over the reservoir chambers.',[0,.21,0],2],
 ['grommets','Reservoir feed grommets','Pair of rubber seals between the reservoir outlets and master body.',[0,.065,0],4],
 ['lock-ring','Master piston retaining ring','Open retaining ring at the pushrod end.',[0,0,.34],5],
 ['primary','Primary master piston assembly','Stepped primary piston, return spring and retained seal assembly. Detailed port timing is unverified.',[0,0,.28],6],
 ['secondary','Secondary master piston','Separate forward piston with spring locating features.',[0,0,.14],10],
 ['secondary-seal','Secondary piston seal','Separate lip seal on the secondary piston.',[.055,0,.18],7],
 ['primary-seal','Secondary piston primary seal','Separate hydraulic cup seal at the forward piston shoulder.',[-.055,0,.10],9],
 ['retainer','Secondary spring retainer','Stamped spring seat behind the forward return spring.',[.06,0,.07],8],
 ['spring','Secondary piston return spring','Independent helical spring inside the master bore.',[0,0,-.13],11],
 ['take-up-valve','Quick-take-up valve assembly','Valve feature beneath the reservoir boss. It is represented as one inspection assembly; internal calibration is not established.',[.10,.10,0],13],
 ['mounting-nuts','Master-cylinder mounting nuts','Pair of fasteners on the booster studs.',[.08,0,-.08],null],
];
for(const [key,name,desc,spread,callout] of master)add('master-'+key,'brake-master',name,desc,spread,'GM 22P · 1985–88 composite master cylinder',170,callout,{role:key});
const booster=[
 ['boot','Booster input-rod boot',1],['input-silencer','Input silencer',2],['check-valve','Vacuum check valve',3],['check-grommet','Vacuum check-valve grommet',4],
 ['front-seal','Booster front housing seal',7],['primary-bearing','Primary power-piston bearing',8],['rear-shell','Booster rear shell',9],['front-shell','Booster front shell',10],['return-spring','Booster main return spring',11],
 ['output-rod','Master-cylinder pushrod',12],['reaction-retainer','Reaction piston retainer',13],['head-silencer','Power-head silencer',14],['diaphragm-retainer','Primary diaphragm retainer',15],
 ['primary-diaphragm','Primary vacuum diaphragm',16],['primary-plate','Primary diaphragm support plate',17],['secondary-bearing','Secondary power-piston bearing',18],['divider','Booster chamber divider',19],
 ['secondary-diaphragm','Secondary vacuum diaphragm',20],['secondary-plate','Secondary diaphragm support plate',21],['reaction-disc','Reaction disc',22],['reaction-piston','Reaction piston',23],
 ['body-retainer','Reaction-body retainer',24],['reaction-body','Reaction body',25],['air-spring','Air-valve spring',26],['reaction-bumper','Reaction bumper',27],['retaining-ring','Power-piston retaining ring',28],
 ['filter','Booster air filter',29],['valve-retainer','Air-valve retainer',30],['valve-o-ring','Air-valve O-ring',31],['input-rod','Input pushrod and air valve',32],['power-piston','Booster power piston',33],['mounting','Booster mounting studs and nuts',null],
];
const boosterOffsets={'rear-shell':.40,'front-shell':-.45,'primary-diaphragm':.25,'primary-plate':.18,'divider':0,'secondary-diaphragm':-.12,'secondary-plate':-.18,'return-spring':-.30,'output-rod':-.57,'input-rod':.70,'boot':.56};
for(const [i,[key,name,callout]] of booster.entries())add('booster-'+key,'brake-booster',name,'Tandem-diaphragm component reconstructed from the factory exploded drawing. Local dimensions and valve interfaces are illustrative.',[key in boosterOffsets?0:i%2?.13:-.13,key in boosterOffsets?0:(i%5-2)*.047,boosterOffsets[key]??(i-15)*.021],'GM 22P · 1985–87 tandem vacuum booster',166,callout,{role:key});
for(const [key,name,desc,spread,callout] of [
 ['valve','Combination valve','Separate brass-colored valve body with pressure-warning switch and front/rear line ports. Internal proportioning calibration is not modeled.',[.16,.07,0],37],
 ['valve-bracket','Combination-valve mounting bracket','Folded mounting bracket beside the master cylinder.',[.22,.04,0],50],
 ['master-pipes','Master-to-combination valve pipes','Two short formed pipes connecting the separate master circuits to the combination valve.',[0,.11,0],36],
 ['front-left-pipe','Left front brake hard line','Individual front circuit branch to the left front hose bracket.',[.14,0,0],44],
 ['front-right-pipe','Right front brake hard line','Cross-car front circuit branch to the right front hose bracket.',[-.14,0,0],46],
 ['rear-feed','Rear brake feed pipe','Single rear-circuit feed from the combination valve to the rear junction. Bend coordinates are provisional.',[0,-.08,0],47],
 ['rear-junction','Rear hydraulic junction block','Separate rear branch fitting.',[0,.12,.10],22],
 ['rear-left-pipe','Left rear brake hard line','Cross-car rear branch to the left hose bracket.',[.15,0,.08],52],
 ['rear-right-pipe','Right rear brake hard line','Short rear branch to the right hose bracket.',[-.15,0,.08],23],
 ['hose-fl','Left front brake hose','Flexible front hose with crimped ends and caliper banjo fitting.',[.21,0,-.10],40],
 ['hose-fr','Right front brake hose','Distinct right-front hose and end fittings.',[-.21,0,-.10],11],
 ['hose-rl','Left rear brake hose','Flexible rear hose with bracket and caliper-end fitting.',[.21,0,.10],28],
 ['hose-rr','Right rear brake hose','Distinct right-rear hose and end fittings.',[-.21,0,.10],21],
 ['banjos','Caliper banjo bolts and copper washer pairs','Four hollow hose bolts, each with two copper sealing washers. Thread form and torque are not specified.',[0,.17,0],32],
 ['hose-brackets','Brake hose brackets and retaining clips','Four formed supports, open U-clips and attachment hardware.',[0,.12,0],29],
 ['pipe-clips','Brake-pipe support clips','Grouped underbody line clips. The complete mounting map remains provisional.',[0,-.14,0],18],
 ['vacuum-pipe','Booster vacuum tube','Long vacuum supply tube from the rear engine compartment to the front booster.',[.09,-.04,0],26],
 ['vacuum-hoses','Booster vacuum hose connections','Front and rear rubber connections with clamps. Intake connection details remain provisional.',[.10,.16,0],13],
 ['vacuum-filter','1985 booster vacuum filter','In-line booster vacuum filter housing, distinct from the front check valve.',[-.12,.10,0],27],
])add(key,'brake-lines',name,desc,spread,'GM 22P · 1984–85 brake mounting and plumbing',177,callout);
for(const [key,name,desc,spread,callout] of [
 ['lever','Driver-side parking-brake lever','Low-mounted lever beside the driver seat, with pivot, release button and stamped mounting cheeks.',[.10,.10,0],9],
 ['boot','Parking-brake lever boot','Separate molded lever boot in the 1984–85 style; local folds and attachment shape remain approximate.',[.10,.22,0],12],
 ['switch','Parking-brake indicator switch','Small plunger switch and mounting screw at the lever.',[.18,.10,0],10],
 ['front-cable','Front parking-brake cable','Cable leaves the driver-side lever and follows the left wheelhouse toward the rear equalizer.',[.11,0,0],8],
 ['left-cable','Left rear parking-brake cable','Shorter left rear cable, separate from the front operating cable.',[.20,0,.08],5],
 ['right-cable','Right rear parking-brake cable','Longer cross-car cable to the right rear caliper.',[-.14,0,.08],1],
 ['equalizer','Parking-brake equalizer','Open steel equalizer and threaded cable adjuster. Setting is not specified.',[0,-.13,.08],3],
 ['clips','Parking-cable clips','Formed clips at the cradle and front cable supports, grouped.',[0,-.08,0],2],
 ['grommet','Parking-cable floor grommet','Elastomer sleeve where the front cable passes through the floor.',[.10,-.10,0],null],
 ['bolts','Parking lever mounting bolts','Pair of separate mounting fasteners.',[.14,-.12,0],13],
])add('park-'+key,'brake-parking',name,desc,spread,'GM 22P · 1984–87 parking-brake system',182,callout);
for(const [key,name,desc,spread,callout] of [
 ['arm','Manual-car brake pedal arm','Formed hanging pedal with pivot bore and booster pushrod pin.',[0,0,0],1],
 ['pad','Brake pedal rubber pad','Narrow manual-transmission pedal cover with molded horizontal ribs.',[0,-.07,.06],3],
 ['pivot','Brake pedal pivot and bushings','Cross-shaft, nylon bushings and retaining hardware, grouped.',[.15,.08,0],1],
 ['switch','Manual-car stop-lamp switch','Threaded plunger switch in the pedal bracket. Cruise-control-specific release hardware remains unverified.',[-.10,.06,0],5],
 ['pushrod-retainer','Brake pushrod pin retainer','Separate spring clip at the booster input-rod connection.',[.07,0,0],8],
])add('pedal-'+key,'brake-pedal',name,desc,spread,'GM 22P · 1984–85 brake pedal / manual application',177,callout);
