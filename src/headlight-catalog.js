import {mvma1985} from './factory-specifications.js';
import {actuatorTerminals,isolationTerminals,headlightCircuitSource,headlightCircuitPrimary,headlightCircuitNote} from './headlight-electrical-data.js';
export const headlightSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=69';
export const headlightDiy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=37';
export const headlightMotorSource='https://www.rodneydickman.com/product_info.php?products_id=230';
export const headlightSections=[{id:'headlight-system',name:'1985 headlight assemblies'}];
export const headlightParts=[];
function part(key,section,name,description,spread,callout=null,sourceUrl=headlightSource){headlightParts.push({id:'hl-'+key,section:'headlight-'+section,system:'electrical',name,description,spread,callout,source:sourceUrl===headlightSource?'GM 22P · front lamps':sourceUrl===headlightDiy?'1985 Pontiac DIY · 2-28 / 2-29':sourceUrl===headlightMotorSource?'Early motor construction · supplier reference':'Pontiac 1986 service · 8A-102',sourceUrl,location:headlightSections.find(s=>s.id==='headlight-'+section).name,referenceNote:'1984–86 motor architecture; original 1985 application. Profiles, dimensions, tooth counts, contact geometry and linkage travel remain reconstructed. Bulb-center height and lateral offset follow 1985 nominal data; the constant-length reconstructed linkage is checked through its travel. Production hard points, motor stops and cover contact remain unmeasured. Exploding a sealed lamp or riveted motor illustrates construction, not a service sequence.'});}
for(const [side,s,label]of [['left',1,'Driver / LH'],['right',-1,'Passenger / RH']]){
 headlightSections.push({id:'headlight-'+side,parent:'headlight-system',name:label+' headlight',spread:[s*.22,0,0]});
 for(const [key,name,spread]of [['lamp','Sealed beam, aim & bucket',[0,.10,-.15]],['door','Cover, hinge & lift linkage',[0,.20,.06]],['motor','1984–86 lift motor',[s*-.15,0,.08]]])headlightSections.push({id:`headlight-${side}-${key}`,parent:'headlight-'+side,name:label+' · '+name,spread});
 const rows=[
 ['lens','lamp','Sealed-beam glass lens','Convex rectangular optical glass with modeled flute relief; factory sealed-beam construction, not a replaceable-bulb housing.',[0,0,-.17],13],
 ['reflector','lamp','Sealed-beam reflector bowl','Separate bowl behind the bonded lens. The explorer separates the sealed envelope to reveal its construction.',[0,0,-.07],13],
 ['filaments','lamp','Dual filaments, shield & glass stem','Illustrative high/low-beam filament supports inside the sealed envelope; filament spacing and optical focus are unverified.',[0,0,-.02],13],
 ['terminals','lamp','Three sealed-beam terminals','Three independent flat contact blades and rear insulating support.',[0,0,.025],13],
 ['socket','lamp','Three-cavity lamp socket & pigtail','Molded plug at the lamp rear. Short flexible leads follow the bucket pose; full factory loom routing is pending.',[0,0,.09],27],
 ['retaining-ring','lamp','Front lamp retaining ring','Thin formed open metal ring around the glass edge, separate from the rear mounting ring.',[0,0,-.23],14],
 ['mounting-ring','lamp','Rear mounting ring & aiming tabs','Open frame carrying the lamp and tabs for two aiming screws and the corner spring.',[0,0,.055],15],
 ['ring-screws','lamp','Four retaining-ring screws','Four separate Phillips screw heads securing the two-piece lamp retainer.',[0,0,-.28],14],
 ['aim-screws','lamp','Top and side aiming screws','Two adjusters act on the retaining tabs. They are distinct from the four lamp-retainer screws.',[.08,.06,.02],10],
 ['aim-anchors','lamp','Aiming-screw nylon anchors','Separate plastic anchor blocks behind the two adjusters.',[.11,.10,.06],10],
 ['aim-spring','lamp','Lower-corner aiming spring','Tension spring between the lamp mounting ring and bucket. The factory DIY identifies the bottom-corner spring.',[-.08,-.08,.025],24],
 ['bucket','lamp','Stamped lamp bucket','Open dished mounting body with formed margins, aperture and pivot ears; exact pressing is unmeasured.',[0,0,.14],11],
 ['upper-bezel','lamp','Upper outer bezel & side cheeks','Rounded open face and tapering cheeks around the raised lamp; the accepted low exterior envelope is retained.',[0,.08,-.30],26],
 ['lower-bezel','lamp','Lower bezel / tray','Separate lower tray with a shallow return beneath the lamp.',[0,-.13,-.05],25],
 ['bezel-screws','lamp','Four bezel screws','Top-corner and side screw pairs, separate from aiming and lamp-retaining hardware.',[.10,.10,-.30],21],
 ['pivot-bolts','lamp','Bucket pivot bolts & washers','Separate left/right pivot hardware at the rear of the rotating bucket.',[s*.19,0,.11],11],
 ['cover','door','Painted headlight cover','Curved hood cover with an independent spring-loaded hinge. This is not rigidly attached to the rotating lamp bucket.',[0,.24,0],1],
 ['filler','door','Cover underside filler & spacers','Open reinforcing frame, spacers and contact pad under the painted panel.',[0,.17,0],5],
 ['hinge','door','Cover hinge','Folded hinge bar and two arms between the hood cover and its pivot.',[0,.12,.12],2],
 ['door-spring','door','Cover return spring','Spring-loaded cover return at the rear hinge; coil and anchor shapes remain illustrative.',[s*.12,.15,.10],null],
 ['cover-fasteners','door','Cover hinge screws & push rivets','Grouped screws, hinge fixings and filler rivets at the represented interfaces.',[s*.13,.26,.05],7],
 ['mount','door','Motor / bucket mounting bracket','Open formed bracket and paired bucket supports, separate from motor and rotating bucket.',[0,-.14,.08],9],
 ['mount-bolts','door','Assembly mounting fasteners','Independent mounting nuts, washers and motor attachment screws.',[s*.18,-.14,.08],19],
 ['crank','door','Motor output crank arm','Short crank on the actuator output shaft, independent of the longer operating link.',[s*-.08,-.02,-.05],8],
 ['link','door','Bucket operating link','Formed operating arm connecting the output crank to the bucket. A constant-length link now joins a solved crank position to the bucket in both poses; original hard points remain reconstructed.',[s*.08,0,-.10],8],
 ['link-clip','door','Link retaining clip & washers','Spring retaining clip and washers at the crank/link joint.',[s*.13,0,-.10],34],
 ['housing','motor','Early actuator gearcase','Open black case and motor cradle. Original actuator assembly: '+(side==='left'?'22039672 (LH).':'22039673 (RH).'),[-s*.08,0,0],35],
 ['case-half','motor','Gearcase outer half','Separate riveted case half with output-shaft bore and mounting flange.',[s*.15,0,0],35],
 ['case-rivets','motor','Eight factory case rivets','Original riveted housing fasteners; aftermarket screw conversion is not substituted.',[s*.22,0,0],35],
 ['field','motor','Motor field housing & magnets','Open steel motor shell with internal pole faces around the armature.',[0,.10,.02],35],
 ['armature','motor','Armature, commutator & worm shaft','Vertical rotor with laminated stack, copper windings, segmented commutator and worm drive. Winding and tooth counts are illustrative.',[0,.20,0],35],
 ['bearings','motor','Armature bushings & thrust seats','Separate bearing seats at the ends of the vertical armature shaft.',[s*-.07,.24,0],35],
 ['knob','motor','Manual raising knob','Ribbed hand knob above the motor; part of the original early actuator.',[0,.30,0],35],
 ['intermediate','motor','Metal intermediate gear','Metal reduction gear between the armature worm and output gear. Profile and ratio are not manufacturing data.',[s*.035,-.11,0],35],
 ['output-gear','motor','Original plastic output gear','Pale molded output gear and internal drive pockets; no aftermarket metal replacement is shown.',[s*.075,-.02,0],35],
 ['drive-plate','motor','Output-shaft drive plate','Steel drive cage engages four cushion blocks inside the plastic gear.',[s*.12,-.02,0],35],
 ['output-shaft','motor','Output shaft & support bushings','Steel shaft passes through the case to the crank arm.',[s*.27,-.02,0],35],
 ['switch','motor','Brush carrier & limit-contact assembly','Early brush and end-of-travel contact assembly, GM 22038870. Internal contacts interrupt motor drive at the endpoints; no later electronic controller is used.',[-s*.11,.03,.03],36],
 ['brushes','motor','Two motor brushes & contact arms','Pair of separate carbon brushes on spring contact arms at the commutator.',[-s*.15,.07,.03],36],
 ['switch-cover','motor','Brush / switch side cover','Removable side inspection cover, separate from the riveted gearcase.',[-s*.20,.04,.03],36],
 ['switch-screws','motor','Three switch-cover screws','Screw set for the removable brush/contact cover.',[-s*.26,.04,.03],36],
 ['motor-leads','motor','Motor lead protective sleeve','Short protective loom around the three motor conductors before they branch to the C2 motor plug and the separate C101 / C102 white-to-blue disconnect.',[-s*.12,-.05,.10],27],
 ];
 for(const [key,section,name,desc,spread,callout]of rows)part(side+'-'+key,side+'-'+section,name,desc,spread,section==='motor'&&!['housing','switch','brushes'].includes(key)?null:callout,section==='motor'&&!['housing','switch','brushes'].includes(key)?headlightMotorSource:headlightSource);
 for(let i=0;i<4;i++)part(`${side}-bumper-${i+1}`,side+'-motor',`Output-gear cushion ${i+1} of 4`,'Individual original-style green polyurethane cushion between the gear and steel drive plate.',[s*(.11+i*.016),-.045+(i%2)*.09,(i<2?-.06:.06)],null,headlightMotorSource);
}
headlightSections.push({id:'headlight-relays',parent:'headlight-system',name:'Relays, connectors & front harness',spread:[0,-.10,.10]});
for(const [key,name,spread] of [['left','LH actuator relay',[.12,0,0]],['right','RH actuator relay',[-.12,0,0]],['isolation','Driver-side isolation relay',[0,.08,.10]]])headlightSections.push({id:`headlight-${key}-relay`,parent:'headlight-relays',name,spread});
for(const [side,s]of [['left',1],['right',-1]]){
 part(side+'-relay','relays',(side==='left'?'LH':'RH')+' actuator relay','One early actuator relay at each lamp assembly; independent from the isolation relay.',[s*.10,.12,0],28);
 part(side+'-relay-bracket','relays',(side==='left'?'LH':'RH')+' relay bracket & screws','Separate folded mounting bracket behind the corresponding lamp.',[s*.16,.06,.10],29);
 part(side+'-relay-socket','relays',(side==='left'?'LH':'RH')+' relay C1 connector shell','Open three-cavity feed/control/ground connector with separate retaining latch. C2 carries the two motor conductors. Five relay blades are individually selectable.',[s*.12,-.08,.05],27);
 part(side+'-ground','relays',(side==='left'?'LH':'RH')+' forward-lamp ground','Front fender ground lug below the corresponding headlamp; location supported by adjacent-year circuit component views.',[s*.20,-.10,0],null,'https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=995');
}
part('isolation-relay','relays','Headlight isolation relay','Third relay on the driver side of the front compartment behind the LH headlamp. Early relay operation is separate from the later 1987–88 module.',[.16,.13,.12],28);
part('isolation-bracket','relays','Isolation-relay bracket & fasteners','Separate mounting tab, fasteners and plug base.',[.20,.02,.16],29);
part('forward-harness','relays','Forward headlamp harness branches','Separate branches to the lamp sockets, actuator relays and isolation relay. Factory wire lengths, every clip and full C100 routing remain pending.',[0,-.20,.18],27);

function circuitPart(key,section,name,description,spread,rows=[]){
 part(key,section,name,description,spread,null,headlightCircuitSource);
 Object.assign(headlightParts.at(-1),{source:'GM 1986 8A-102-0 · adjacent-year circuit',sourceUrl:headlightCircuitPrimary,referenceNote:headlightCircuitNote,serviceReference:{title:'Early headlamp circuit / construction',rows,links:[['Pontiac 1986 service · 8A-102-0',headlightCircuitPrimary],['Circuit scan indexed under 1985',headlightCircuitSource],['GM 22P · early headlight assemblies',headlightSource]],note:headlightCircuitNote}});
}
for(const [key,s,label,terminals] of [['left',1,'LH actuator',actuatorTerminals],['right',-1,'RH actuator',actuatorTerminals],['isolation',1,'Isolation',isolationTerminals]]){
 const section=key+'-relay',prefix=key==='isolation'?'isolation':key+'-relay';
 for(const oldKey of key==='isolation'?['isolation-relay','isolation-bracket']:[key+'-relay',key+'-relay-bracket',key+'-relay-socket']){
  const p=headlightParts.find(p=>p.id==='hl-'+oldKey);p.section='headlight-'+section;p.location=headlightSections.find(s=>s.id===p.section).name;
 }
 const cover=headlightParts.find(p=>p.id==='hl-'+(key==='isolation'?'isolation-relay':key+'-relay'));
 cover.description+=' Hollow removable cover; the coil, magnetic frame, armature, linked contacts and terminals can be explored separately. Internal tooling is reconstructed.';
 for(const [suffix,name,description,spread] of [
  ['base','Insulating terminal base','Separate insulating plate with blade openings; blade positions are illustrative and are not a factory connector-end view.',[0,-.04,0]],
  ['coil','Coil bobbin & copper winding','Hollow bobbin, end flanges and modeled winding around the magnetic core. Turn count and resistance are unverified.',[-s*.065,.04,0]],
  ['core','Magnetic core & return yoke','Steel pole and folded magnetic return frame, separate from the coil.',[-s*.105,.06,0]],
  ['armature','Armature & return spring','Separate pivoting armature and return spring above the pole; static reconstructed geometry.',[s*.06,.10,0]],
  ['contacts','Linked changeover contact set','Two mechanically linked contact leaves with stationary contact buttons and an insulating bridge, following the schematic function. Contact tooling and travel are unmeasured.',[s*.11,.045,0]],
  ['diode','Coil suppression diode','Separate axial diode with leads and a cathode band. The schematic places a suppression diode across the relay coil; package dimensions and rating are unverified.',[-s*.07,-.025,.07]],
  ['socket-contacts','Connector female contacts & crimps','Folded open receptacles, spring tongues, conductor crimps and insulation support wings. Exact original terminal series is unverified.',[0,-.17,0]],
  ['socket-latches','Connector retaining latches','Flexible molded latch beams and engagement tabs on the separate plug shells.',[s*.11,-.09,.02]],
  ['pigtails','Feed / control / ground pigtails','Individually colored local conductors attached to their contact positions. Full body harness length, supports and C100 route remain open.',[0,-.23,0]],
 ])circuitPart(prefix+'-'+suffix,section,label+' · '+name,description,spread);
 if(key==='isolation'){
  circuitPart('isolation-steering-diode',section,'Isolation · control steering diode','Second diode shown between yellow circuit 10 and pink circuit 113, separate from coil suppression. Static package illustration; no certified diode test is implied.',[.10,.025,.07]);
  circuitPart('isolation-socket',section,'Isolation · C1 and C2 connector shells','Two separate three-cavity plugs, six terminals total; molded partitions, open sockets and latches. Physical cavity orientation is reconstructed.',[0,-.10,0]);
 }else circuitPart(prefix+'-motor-socket',section,label+' · C2 motor connector shell','Separate open two-cavity plug for gray C2 A and green C2 B conductors, with its own retaining latch.',[0,-.11,.08]);
 for(const [i,t]of terminals.entries())circuitPart(prefix+'-terminal-'+t.key,section,label+' · '+t.cavity+' blade / '+t.color,t.function+'. Individually selectable male blade with internal tail; schematic number '+t.number+'.',[s*(-.12+i*.05),-.065,(i<3?-.08:.08)],[['Schematic connector',t.cavity],['Internal number',String(t.number)],['Conductor',t.color+(t.circuit?' · circuit '+t.circuit:'')],['Connection',t.function]]);
}
for(const [side,s]of [['left',1],['right',-1]]){
 const name=side==='left'?'LH':'RH',disconnect=side==='left'?'C101':'C102';
 for(const [key,label,desc,spread]of [
  ['lead-white','White motor lead','Motor-side white conductor to '+disconnect+'. The harness conductor is '+(side==='left'?'dark blue 110':'dark blue / white 104')+'; these are distinct sides of the disconnect.',[-s*.08,-.09,.09]],
  ['lead-green','Green motor lead','Green conductor from actuator relay C2 B / internal terminal 5 to the motor circuit breaker.',[-s*.04,-.13,.07]],
  ['lead-gray','Gray motor lead','Gray conductor from actuator relay C2 A / internal terminal 6 to the motor endpoint-contact circuit.',[-s*.14,-.17,.04]],
  ['disconnect',disconnect+' one-cavity plug pair','Separate keyed single-cavity shells and latch at the white-to-blue conductor transition. The 1985 DIY replacement sequence identifies this blue-wire disconnect.',[-s*.19,-.05,.15]],
  ['disconnect-contacts',disconnect+' male / female contacts','Separate blade and open spring receptacle with crimped wire ends inside the one-cavity plug pair.',[-s*.24,-.09,.15]],
  ['lead-grommet','Motor lead grommet','Three-entry insulating strain relief at the contact housing; exact rubber profile is reconstructed.',[-s*.20,.01,.04]],
  ['motor-breaker','Motor internal circuit breaker','Separate illustrative bimetal strip and contact pair in the early motor circuit. Distinct from the dashboard headlight-switch circuit breaker; rating and tooling remain unverified.',[-s*.22,.07,-.03]],
 ])circuitPart(side+'-'+key,side+'-motor',name+' · '+label,desc,spread);
}
for(const [side,s,code,color]of [['left',1,'110','dark blue'],['right',-1,'104','dark blue / white']])circuitPart('isolation-'+side+'-output','relays',(side==='left'?'LH C101':'RH C102')+' harness lead · '+color,'Circuit '+code+' from the isolation-relay branch to the white motor lead disconnect. Routing is reconstructed; the long harness branch is separate from the relay internals for close inspection.',[s*.10,-.13,.13],[['Circuit',code],['Harness conductor',color],['Motor conductor','white']]);
headlightSections.push({id:'headlight-power',parent:'headlight-relays',name:'Fusible links C / D and feed branches',spread:[0,-.08,.12]});
for(const [i,key]of ['c','d'].entries())for(const [suffix,name,description,spread]of [
 ['insulation','fusible-link insulation','Separate red insulated fusible-link segment. Adjacent-year GM 8A-102-0 identifies .35 mm² red link wire; length and insulation outside diameter are reconstructed.',[-.05+i*.10,0,0]],
 ['conductor','fusible-link conductor','Separate copper conductor inside the insulation. The schematic cross-section annotation is adjacent-year evidence, not a verified replacement instruction for this car.',[-.05+i*.10,.045,0]],
 ['splices','link end splices & sleeves','Crimp barrels and separate protective sleeves at both ends. Splice construction and exact factory tooling remain unmeasured.',[-.05+i*.10,-.04,.04]],
 ['feed','actuator battery-feed branch','Independent red circuit 2 feed to the '+(key==='c'?'LH':'RH')+' actuator relay, separate from the cabin TAIL fuse. Both links are represented in the front lighting harness near the master cylinder; full C100 wiring is pending.',[-.05+i*.10,-.10,.08]],
 ]){
  circuitPart('link-'+key+'-'+suffix,'power','Link '+key.toUpperCase()+' · '+name,description,spread,[['Supplies',key==='c'?'LH actuator relay C1 A':'RH actuator relay C1 A'],['Location evidence','1986 GM 8A-201-9 figure D; adjacent year']]);
  headlightParts.at(-1).serviceReference.links.push(['GM front-harness component location','https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1047']);
}

headlightSections.push({id:'headlight-controls',parent:'headlight-system',name:'Dash switch, illumination wheel & beam dimmer',spread:[.18,.08,.12]});
const controlSource='https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=886';
for(const [key,name,description,spread] of [
 ['control-bezel','Driver light-control bezel','Separate vertical panel beside the instrument pod with switch and dimmer apertures.',[.08,0,.14]],
 ['switch-case','Headlight / parking switch case','Molded switch body behind the face. Internal cavity and mounting ears are reconstructed.',[0,0,-.10]],
 ['switch-rocker','Headlight rocker','Separate headlamp rocker above the parking-light control.',[0,.02,.19]],
 ['park-button','Parking-light control','Lower parking-light control within the headlamp switch face.',[0,-.025,.19]],
 ['switch-contacts','Switch contact carrier & circuit breaker','Illustrative contact bridges and resettable breaker construction. Adjacent-year GM diagrams identify the breaker; ratings and exact 1985 pin arrangement remain unverified.',[.10,0,-.06]],
 ['switch-plug','Headlight-switch harness connector','Open connector shell and recessed terminal cavities. This geometric reconstruction is not a certified connector-end view.',[0,0,-.18]],
 ['control-screws','Control-panel screws','Four separate attachment screws at the panel corners.',[.07,.04,.22]],
 ['panel-dimmer','Instrument illumination thumbwheel','Ribbed wheel below the light switch. It controls panel brightness and the full-up dome-light position; separate from high/low beam selection.',[-.08,-.07,.10]],
 ['dimmer-carrier','Thumbwheel carrier & wiper','Separate carrier and contact wiper behind the illumination wheel; contact track shape is reconstructed.',[-.08,-.07,-.10]],
 ['panel-transistor','Remote panel-dimming transistor & heat sink','Remote heat-sink-mounted transistor below the dash, identified by the GM lighting schematic. Not part of the high/low-beam switch.',[.11,-.16,-.10]],
 ['beam-switch','Column-mounted high/low-beam switch','Mechanical beam dimmer at the lower left side of the steering column; actuated through a rod from the column stalk.',[.09,-.09,-.08]],
 ['beam-rod','High/low-beam actuating rod','Thin formed rod from the stalk mechanism to the column switch. Exact bends and adjustment travel are unmeasured.',[.15,0,0]],
 ['beam-plug','Beam-dimmer three-cavity plug','Separate connector at the beam selector; cavity assignment requires the original 1985 connector-end drawing.',[.16,-.10,-.13]],
 ['beam-mount','Beam-dimmer mounting screws & strap','Slotted mounting strap and two screws on the column.',[.17,-.13,-.06]],
 ['control-wiring','Lighting control harness branches','Short dash and column branches. Original clip positions, branch lengths and complete bulkhead routing remain open.',[.08,-.22,-.11]],
]){
 part(key,'controls',name,description,spread,null,controlSource);
 const p=headlightParts.at(-1);p.source='GM service · lighting / column controls';p.referenceNote='1986 GM service 8A-12 and 8A-100 provide adjacent-year component relationships. 1985 owner instructions corroborate separate headlamp, panel-illumination and beam controls. Local dimensions, contacts and connector cavities are reconstructions; no 1985 pinout or electrical test values are certified.';
}

for(const side of ['left','right'])headlightParts.find(p=>p.id==='hl-'+side+'-lens').serviceReference={title:'1985 nominal raised headlamp position',rows:[['Bulb-center height','709 mm above ground at curb mass'],['Lateral bulb-center offset','511 mm from vehicle centerline']],links:[['Pontiac 1985 specifications · printed24',mvma1985+'#page=26']],note:'These two nominal datums are applied to the raised model. Bucket pivot, motor crank, connecting link, cover contact and stop angles remain reconstructions; the mechanism is not factory dimensional CAD.'};
