export const coolingSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf';
export const coolingSections=[
 {id:'cooling-system',name:'Complete coolant circuit'},
 {id:'cool-radiator',parent:'cooling-system',name:'Radiator, fan & mounting',spread:[0,0,-.35]},
 {id:'cool-pipes',parent:'cooling-system',name:'Left inlet & right return pipes',spread:[0,-.12,0]},
 {id:'cool-recovery',parent:'cooling-system',name:'Recovery tank & pressure cap',spread:[-.18,.12,0]},
 {id:'cool-heater',parent:'cooling-system',name:'Heater core & 1985 circuit',spread:[0,.18,0]},
];
export const coolingParts=[];
const add=(id,section,name,description,spread=[0,0,0],callout=null)=>coolingParts.push({id:'cool-'+id,section:'cool-'+section,system:'cooling',name,description,spread,callout,source:'GM 22P · L44 hoses / pipes / radiator',sourceUrl:coolingSource+'#page=51',location:coolingSections.find(s=>s.id==='cool-'+section).name,referenceNote:'Factory drawings establish component identity and circuit relationships. Local dimensions, folds and hose bends are reconstructed, not measured factory CAD. Exploded offsets are for inspection, not a repair sequence.'});
for(const [id,name,desc,spread] of [
 ['core','Radiator tube-and-fin core','Crossflow core with horizontal flattened tubes and individually corrugated fin surfaces. Tube count and fin pitch are visual approximations.',[0,0,0]],
 ['tank-left','Radiator left inlet tank','Driver-side inlet tank with the upper hose neck. A separate open tank shows the core interface.',[.18,0,0]],
 ['tank-right','Radiator right outlet tank','Passenger-side outlet tank with lower hose neck, filler neck and drain opening.',[-.18,0,0]],
 ['tank-seals','Radiator tank seal pair','Perimeter seals at both tank-to-header interfaces.',[0,0,-.10]],
 ['headers','Radiator header plates & crimp tabs','Separate header plates and folded tank-retaining tabs.',[0,0,-.16]],
 ['rails','Radiator top & bottom rails','Folded rails around the heat-exchanger core.',[0,.12,0]],
 ['isolators','Radiator rubber mounting cushions','Grouped lower and upper mounting pads. Exact compound and dimensions are unverified.',[0,-.12,0]],
 ['upper-support','Radiator upper support & screws','Stamped upper support, with separate edge folds and mounting fasteners.',[0,.23,0]],
 ['fan-shroud','Radiator fan shroud','Molded shroud with an open fan throat and curved transition from the rectangular core.',[0,0,.15]],
 ['fan-blade','Radiator fan blade assembly','Swept and pitched molded blades, central hub and reinforcing bosses. Blade profile and fan variant remain reconstructed.',[0,0,.28]],
 ['fan-motor','Radiator fan motor','Cylindrical motor shell, pressed end cap, shaft and electrical terminal housing. Motor internals are not yet modeled.',[0,0,.43]],
 ['fan-support','Fan motor support frame','Three mounting arms and circular motor seat.',[0,0,.51]],
 ['fan-fasteners','Fan blade & motor fasteners','Retaining nut, washers and motor attachment hardware, grouped for inspection.',[0,0,.60]],
 ['fan-connector','Fan motor connector & lead','Two-terminal motor connection and short lead. Full forward wiring harness remains incomplete.',[.16,0,.41]],
 ['drain','Radiator drain valve','Separate radiator drain valve at the lower passenger-side corner.',[-.20,-.05,0]],
])add(id,'radiator',name,desc,spread,id.startsWith('tank')||['core','headers','rails'].includes(id)?28:null);
for(const row of [
 ['pipe-left','Left radiator inlet pipe','Driver-side underbody pipe carries engine-outlet coolant forward to the radiator.',[.16,0,0],25],
 ['pipe-right','Right radiator outlet pipe · 1985–86','Passenger-side return pipe carries cooled coolant rearward. This early pipe has no later 1987 heater-return tee.',[-.16,0,0],32],
 ['front-inlet','Front upper inlet hose','Connects the left pipe to the radiator inlet tank.',[.18,.07,-.07],27],
 ['front-outlet','Front lower outlet hose','Connects the radiator lower passenger-side outlet to the right return pipe.',[-.18,-.03,-.07],29],
 ['rear-inlet','Rear thermostat outlet hose','Connects the passenger-side engine filler neck to the manual-transmission crossover pipe.',[0,.14,.05],31],
 ['crossover','Manual-transmission radiator inlet crossover','Distinct formed rear inlet pipe crosses toward the left underbody pipe. The factory catalog distinguishes manual and automatic variants.',[.08,.06,.10],35],
 ['rear-coupler','Left rear inlet-pipe coupling hose','Rubber coupling between the manual crossover and the left sill pipe.',[.17,.02,.09],18],
 ['rear-outlet','Right rear pump inlet hose','Curved return hose from the right sill pipe to the water-pump inlet.',[-.17,.02,.09],30],
 ['clamps','Coolant hose clamp set','Metal clamp bands and screw housings at the modeled hose ends. Separate from the hose geometry.',[0,.12,0],17],
 ['pipe-supports','Coolant pipe brackets & insulators','Two-sided pipe retaining brackets, rubber insulators and mounting screws.',[0,-.10,0],23],
 ['pipe-drains','Underbody coolant pipe drain plugs','One drain plug on each side, as shown in the 1985 DIY manual.',[0,-.17,0],null],
])add(row[0],'pipes',...row.slice(1));
for(const row of [
 ['recovery-tank','Coolant recovery tank','Translucent molded recovery bottle on the passenger side, with recessed panels and a formed mounting flange.',[0,0,0]],
 ['recovery-cap','Recovery bottle cap','Separate atmospheric recovery-bottle cap; it is distinct from the radiator pressure cap.',[0,.12,0]],
 ['recovery-hose','Radiator overflow / recovery hose','Small hose between radiator filler-neck overflow nipple and recovery bottle.',[.05,.06,0]],
 ['recovery-bracket','Recovery tank mounting bracket & screws','Mounting tabs and hardware for the front recovery bottle.',[-.10,0,0]],
 ['pressure-cap','Radiator pressure cap','Metal cap with locking ears, underside spring and rubber sealing surfaces. The engine thermostat housing has its own separate cap.',[0,.14,-.1]],
]){add(row[0],'recovery',...row.slice(1));Object.assign(coolingParts.at(-1),{source:'1985 DIY · 2-4; Pontiac service · 6B-2 / 6B-3',sourceUrl:'https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=13'});}
for(const row of [
 ['heater-core','Heater core','Small finned heat exchanger on the passenger side behind the instrument panel. The C41 / C60 preview shares its geometry with the Heating & ventilation explorer.',[0,0,0]],
 ['heater-tanks','Heater core end tanks & necks','Option-specific formed tanks and two hose connections, shared with the heater explorer. Local neck offsets are reconstructed.',[-.12,0,0]],
 ['heater-seals','Heater core foam seals','Separate perimeter sealing strips around the core.',[0,.10,0]],
 ['heater-pipes','Heater supply & return pipe pair','Long underbody heater circuit. The 1985 engine return is retained instead of a later return-pipe tee. Exact bends and clearances remain provisional.',[0,-.06,0]],
 ['heater-hoses','Heater hose set','Front heater connections and rear engine connections, grouped. Routes require further factory routing verification.',[0,.12,0]],
]){add(row[0],'heater',...row.slice(1));Object.assign(coolingParts.at(-1),{source:'GM 22P · heater module; 1985–86 pump heater fitting',sourceUrl:coolingSource+'#page=263'});}
