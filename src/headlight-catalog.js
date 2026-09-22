export const headlightSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=69';
export const headlightDiy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=37';
export const headlightMotorSource='https://www.rodneydickman.com/product_info.php?products_id=230';
export const headlightSections=[{id:'headlight-system',name:'1985 headlight assemblies'}];
export const headlightParts=[];
function part(key,section,name,description,spread,callout=null,sourceUrl=headlightSource){headlightParts.push({id:'hl-'+key,section:'headlight-'+section,system:'electrical',name,description,spread,callout,source:sourceUrl===headlightSource?'GM 22P · front lamps':sourceUrl===headlightDiy?'1985 Pontiac DIY · 2-28 / 2-29':sourceUrl===headlightMotorSource?'Early motor construction · supplier reference':'Pontiac 1986 service · 8A-102',sourceUrl,location:headlightSections.find(s=>s.id==='headlight-'+section).name,referenceNote:'1984–86 motor architecture; original 1985 application. Profiles, dimensions, tooth counts, contact geometry and linkage travel remain reconstructed. The two poses show end positions, not calibrated motion. Exploding a sealed lamp or riveted motor illustrates construction, not a service sequence.'});}
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
 ['link','door','Bucket operating link','Formed operating arm connecting the output crank to the bucket. Endpoint poses are illustrative.',[s*.08,0,-.10],8],
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
 ['motor-leads','motor','Actuator leads & blue-wire connector','Early three-wire actuator lead group, including the one-cavity connector on the blue wire shown in the 1985 DIY manual.',[-s*.12,-.05,.10],27],
 ];
 for(const [key,section,name,desc,spread,callout]of rows)part(side+'-'+key,side+'-'+section,name,desc,spread,section==='motor'&&!['housing','switch','brushes'].includes(key)?null:callout,section==='motor'&&!['housing','switch','brushes'].includes(key)?headlightMotorSource:headlightSource);
 for(let i=0;i<4;i++)part(`${side}-bumper-${i+1}`,side+'-motor',`Output-gear cushion ${i+1} of 4`,'Individual original-style green polyurethane cushion between the gear and steel drive plate.',[s*(.11+i*.016),-.045+(i%2)*.09,(i<2?-.06:.06)],null,headlightMotorSource);
}
headlightSections.push({id:'headlight-relays',parent:'headlight-system',name:'Relays, connectors & front harness',spread:[0,-.10,.10]});
for(const [side,s]of [['left',1],['right',-1]]){
 part(side+'-relay','relays',(side==='left'?'LH':'RH')+' actuator relay','One early actuator relay at each lamp assembly; independent from the isolation relay.',[s*.10,.12,0],28);
 part(side+'-relay-bracket','relays',(side==='left'?'LH':'RH')+' relay bracket & screws','Separate folded mounting bracket behind the corresponding lamp.',[s*.16,.06,.10],29);
 part(side+'-relay-socket','relays',(side==='left'?'LH':'RH')+' relay plug & leads','Recessed molded connector and short bundled leads. Pin assignments are not certified from this geometry.',[s*.12,-.08,.05],27);
 part(side+'-ground','relays',(side==='left'?'LH':'RH')+' forward-lamp ground','Front fender ground lug below the corresponding headlamp; location supported by adjacent-year circuit component views.',[s*.20,-.10,0],null,'https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=995');
}
part('isolation-relay','relays','Headlight isolation relay','Third relay on the driver side of the front compartment behind the LH headlamp. Early relay operation is separate from the later 1987–88 module.',[.16,.13,.12],28);
part('isolation-bracket','relays','Isolation-relay bracket & fasteners','Separate mounting tab, fasteners and plug base.',[.20,.02,.16],29);
part('forward-harness','relays','Forward headlamp harness branches','Separate branches to the lamp sockets, actuator relays and isolation relay. Factory wire lengths, every clip and full C100 routing remain pending.',[0,-.20,.18],27);

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
