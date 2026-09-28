// GM 22P early P37 cabin diagrams, reconciled in references/interior-i1-reconstruction.md.
const source='/references/fiero-parts-cd.pdf';
export const interiorSections=[
 {id:'interior-system',name:'1985 SE cabin & removable trim'},
 {id:'interior-seat-left',parent:'interior-system',name:'Driver bucket seat',spread:[.27,.15,0]},
 {id:'interior-seat-right',parent:'interior-system',name:'Passenger bucket seat',spread:[-.27,.15,0]},
 {id:'interior-restraints',parent:'interior-system',name:'Belts, buckles & anchors',spread:[0,.10,.24]},
 {id:'interior-dashboard',parent:'interior-system',name:'Dashboard, speakers & instrument pod',spread:[0,.16,-.25]},
 {id:'interior-console',parent:'interior-system',name:'Four-speed console & rear storage',spread:[0,.30,.08]},
 {id:'interior-radio',parent:'interior-console',name:'Delco radio & controls',spread:[0,.28,-.1]},
 {id:'interior-door-left',parent:'interior-system',name:'Driver door trim & fittings',spread:[.38,0,0]},
 {id:'interior-door-right',parent:'interior-system',name:'Passenger door trim & fittings',spread:[-.38,0,0]},
 {id:'interior-trim',parent:'interior-system',name:'Carpet, pillars, headliner & visors',spread:[0,.34,.12]},
 {id:'interior-steering',parent:'interior-system',name:'Steering wheel & column trim',spread:[.12,.18,-.14]},
 {id:'interior-pedals',parent:'interior-system',name:'Driver pedals & parking brake',spread:[.12,-.12,-.1]},
];
export const interiorParts=[];
function part(key,section,name,description,spread,page,callout,owner,extra={}){
 interiorParts.push({id:'in-'+key,section:'interior-'+section,system:'interior',name,description,spread,source:'GM 22P · '+(page===294?'1984–85 console':page===347?'1984–85 door trim':page===351?'early AR9 seats':'P37 cabin'),sourceUrl:source+'#page='+page,callout,vehiclePart:owner,location:interiorSections.find(s=>s.id==='interior-'+section).name,referenceNote:'Diagram callouts identify the parent service assembly; subdivided construction pieces and unlisted fasteners do not imply separate factory callouts. Local profiles, dimensions and unlisted fastener counts remain reconstructed. Riveted or bonded construction is shown for inspection, not as a service removal instruction.',...extra});
}
for(const [side,s] of [['left',1],['right',-1]]){
 const section='seat-'+side,key='seat-'+side+'-',label=side==='left'?'Driver':'Passenger';
 for(const [k,n,d,v,c] of [
 ['pan','Cushion steel pan','Pressed open seat pan with side flanges and spring attachment points.',[0,-.10,0],17],
 ['back-frame','Integrated-headrest back frame','Welded backrest frame supporting the shoulder and headrest pad.',[0,0,.19],25],
 ['cushion-springs','Cushion support springs','Separate zigzag support wires beneath the foam; wire count is reconstructed.',[0,-.06,0],17],
 ['back-springs','Backrest support wires','Cross wires within the seat-back frame.',[0,0,.10],25],
 ['cushion-foam','Molded cushion pad','Contoured pad beneath the complete two-tone cloth cushion cover.',[0,.14,0],18],
 ['back-foam','Molded backrest/headrest pad','Integrated headrest and lateral-restraint foam with speaker recesses.',[0,0,-.12],25],
 ['cushion-cover','Two-tone cushion upholstery','Light cloth insert, dark sculpted bolsters, transverse seam and underside return.',[0,.30,-.10],5],
 ['back-cover','Two-tone backrest upholstery','Rounded integrated headrest, dark side bolsters, light insert and sewn boundaries. Speaker areas are fabric, not square plastic boxes.',[0,.18,-.28],26],
 ['rear-cover','Seat-back rear upholstery','Separate rear cloth panel and lower closure seam.',[0,0,.31],26],
 ['listing','Cover listing wires','Embedded upholstery retaining rods, shown separately from the cover.',[0,.07,-.06],26],
 ['hog-rings','Upholstery hog-ring set','Open retaining rings at the lower cover and listing wires. Locations/count are reconstructed rather than a verified production bill.',[s*.24,.06,-.08],26],
 ['track-inner','Inboard fixed seat track','Floor-mounted channel with separate sliding upper rail.',[-s*.08,-.14,0],s>0?11:15],
 ['track-outer','Outboard fixed seat track','Floor-mounted locking track.',[s*.12,-.14,0],s>0?10:16],
 ['slider-inner','Inboard sliding rail','Seat-side rail retained in the fixed channel.',[-s*.08,-.035,0],s>0?11:15],
 ['slider-outer','Outboard sliding rail','Locking upper rail and tooth strip.',[s*.12,-.035,0],s>0?10:16],
 ['adjust-handle','Seat slide release handle','Front manual release handle and lever.',[s*.13,-.04,-.23],null],
 ['adjust-wire','Track latch connecting wire','Wire linking the two track latches.',[0,-.06,-.16],8],
 ['adjust-spring','Track return spring','Coiled return spring alongside the adjuster.',[s*.19,-.09,0],7],
 ['recliner','Outboard recliner control','Separate stamped recliner assembly. Internal toothed locking profile remains grouped and uncalibrated.',[s*.22,.04,.06],19],
 ['inner-hinge','Inboard backrest hinge','Inboard pivot strap and support plate.',[-s*.17,.02,.06],null],
 ['recliner-cover','Recliner lower cover','Molded cover concealing the outboard mechanism.',[s*.31,.04,.06],20],
 ['hinge-protector','Recliner hinge protector','Upper protective trim around the backrest pivot.',[s*.26,.14,.08],21],
 ['recliner-knob','Recliner release handle','Small lever knob outside the seat.',[s*.40,.08,0],22],
 ])part(key+k,section,label+' '+n,d,v,351,c,'seats');
 for(const [i,position] of ['front inner','front outer','rear inner','rear outer'].entries()){
  part(key+'floor-nut-'+i,section,label+' track floor nut · '+position,'Separate floor-stud retaining nut and washer. Size and exact stud locations await measurement.',[(i%2?s:-s)*.13,-.22,i<2?-.20:.17],351,null,'seats');
  part(key+'rail-bolt-'+i,section,label+' rail-to-pan bolt · '+position,'Individual upper track attachment bolt.',[(i%2?s:-s)*.16,.05,i<2?-.16:.15],351,17,'seats');
 }
 for(let i=0;i<2;i++){
  part(key+'pivot-'+i,section,label+' hinge pivot pin · '+(i?'outer':'inner'),'Peened hinge pin. Separation illustrates riveted construction; not a factory remove-and-reuse step.',[(i?s:-s)*.27,.02,.13],351,19,'seats');
  part(key+'cover-screw-'+i,section,label+' recliner cover screw '+(i+1),'Individual recessed trim screw.',[s*.38,.08+i*.06,.12],351,20,'seats');
 }
 for(const speaker of ['inner','outer'])for(const [k,n,v] of [['basket','speaker basket',[0,0,.10]],['cone','speaker cone',[0,0,-.07]],['magnet','speaker magnet',[0,0,.18]],['leads','speaker leads',[s*.14,0,.06]]])part(key+'speaker-'+speaker+'-'+k,section,label+' headrest '+speaker+' '+n,'Separate original-layout headrest speaker component. Local basket and magnet dimensions remain reconstructed.',[v[0],v[1]+.17,v[2]],351,24,'seats',{option:'speakerSeats',value:true});
 const restraint='belt-'+side+'-';
 for(const [k,n,v,c] of [['retractor','Belt retractor',[s*.20,-.05,.12],25],['webbing','Three-point belt webbing',[s*.12,.10,0],25],['guide','Upper belt guide',[s*.24,.20,.10],27],['guide-cover','Upper guide cover',[s*.30,.25,.10],27],['latchplate','Sliding belt tongue',[s*.13,.04,-.10],25],['buckle','Inboard buckle',[-s*.17,.08,0],3],['button','Buckle release button',[-s*.20,.13,0],3],['buckle-stalk','Buckle anchor stalk',[-s*.10,0,0],3],['retractor-cover','Lower retractor cover',[s*.24,0,.20],25],['warning-wire','Buckle warning lead',[-s*.10,-.06,0],3]])part(restraint+k,'restraints',label+' '+n,'Independent restraint component. Belt routing and mechanism packaging are reconstructed; emergency locking and restraint performance are not simulated.',v,351,c,'seats');
 for(const [i,name]of ['upper guide','retractor','lower outer anchor','buckle anchor'].entries())part(restraint+'bolt-'+i,'restraints',label+' belt '+name+' bolt','Individual anchor bolt, kept separate from the belt and trim.',[s*.30,.03*i,.24],351,25,'seats');
}
const addRows=(section,owner,page,rows)=>{for(const [k,n,d,v,c,extra] of rows)part(k,section,n,d,v,page,c,owner,extra||{});};
addRows('dashboard','dashboard',290,[
 ['dash-pad','Instrument-panel molded pad','Sculpted upper pad and lower face with an open passenger map-pocket aperture.',[0,.20,-.08],1],
 ['dash-pocket','Passenger map-pocket tub','Recessed map pocket with an open mouth, not a conventional glovebox.',[-.05,0,.15],7],
 ['dash-pocket-lip','Passenger map-pocket retaining lip','Removable lower pocket holder.',[-.05,-.04,.24],8],
 ['dash-left-end','Driver end-vent surround','Tall trapezoidal pod around the vertical outlet.',[.20,0,.08],5],
 ['dash-right-end','Passenger end-vent surround','Matching right outlet surround.',[-.20,0,.08],27],
 ['dash-carrier','Instrument-panel carrier','Cross-car carrier, brackets and column opening beneath the pad.',[0,-.15,-.12],1],
 ['dash-lower-trim','Lower driver hush trim','Removable panel below the instrument pod and column.',[.1,-.22,.08],17],
]);
for(const [side,s]of [['left',1],['right',-1]])for(const [k,n,v,c]of [['grille','dash speaker grille',[0,.16,0],2],['speaker-basket','dash speaker basket',[0,.09,0],3],['speaker-cone','dash speaker cone',[0,.20,0],3],['speaker-magnet','dash speaker magnet',[0,-.06,0],3],['speaker-plug','dash speaker plug',[s*.08,-.05,0],3]])part('dash-'+side+'-'+k,'dashboard',(s>0?'Driver':'Passenger')+' '+n,'Separate component of the elongated dash speaker assembly; original local tooling remains unmeasured.',v,290,c,'dashboard');
for(let i=0;i<6;i++)part('dash-screw-'+i,'dashboard','Instrument-panel attachment screw '+(i+1),'Individual pad/carrier attachment. Pattern reconstructed from the catalog relationship.',[(i%2?1:-1)*.12,.28,-.04],290,4,'dashboard');
addRows('console','shifter',294,[
 ['console-skeleton','Console mounting skeleton','Open mounting spine under the front bezel, shift plate and rear storage.',[0,-.13,0],17],
 ['console-front','Radio/HVAC console surround','Tapered front surround with real openings for the outlet, heater control and radio.',[0,.08,.22],1],
 ['console-face','Oxford-gray radio/HVAC trim plate','1985 gray face plate with separate control and receiver apertures.',[0,.10,.32],32],
 ['console-shift-surround','Manual shift surround','Molded forward floor-console surround with an open shift/control aperture.',[0,.15,0],9],
 ['console-shift-plate','Four-speed shift trim plate','Oxford-gray four-speed insert with boot, ashtray and control openings.',[0,.24,0],9],
 ['console-boot','Four-speed shift boot','Flexible sewn boot with tapered folds and lower flange.',[0,.34,-.04],9],
 ['console-boot-ring','Shift-boot retainer','Separate lower boot retaining frame.',[0,.20,-.10],9],
 ['console-lever','Manual shift lever','Formed lever and pivot barrel above the existing cable linkage.',[0,.39,-.03],9],
 ['console-knob','Four-speed shift knob','Rounded tapered grip with a four-speed shift-pattern cap.',[0,.52,-.03],9],
 ['console-knob-clip','Shift-knob retaining clip','Removable retaining clip at the knob base.',[.12,.45,-.03],9],
 ['console-rear-pad','Rear console padded shell','High padded armrest continuing to the rear upright; real storage-door and side-vent openings.',[0,.18,.20],19],
 ['console-storage','Rear console storage tub','Open cubby above the ECM area.',[0,.06,.21],25],
 ['console-storage-door','Rear storage door','Upright padded front door and latch opening.',[0,.10,-.16],29],
 ['console-storage-hinge','Storage-door hinge','Lower pin-and-leaf hinge.',[.12,.03,.10],30],
 ['console-storage-latch','Storage-door latch','Separate latch at the upper door edge.',[0,.16,-.10],28],
 ['console-storage-spring','Storage-door latch spring','Small return spring, separate from latch.',[.10,.18,-.10],26],
 ['console-storage-striker','Storage-door striker','Striker retained inside the console shell.',[-.10,.16,.10],27],
 ['console-lighter','Cigarette lighter insert','Separate knob and element carrier; not electrically simulated.',[.08,.16,.12],34],
 ['console-lighter-socket','Lighter socket and insulator','Open metal socket with insulated terminal.',[.08,.08,.18],35],
 ['console-lighter-retainer','Lighter retaining ring','Separate threaded retaining ring.',[.16,.10,.18],35],
]);
for(const [side,s]of [['left',1],['right',-1]]){
 for(const [k,n,v,c]of [['ashtray','removable ashtray',[0,.24,0],3],['ashtray-door','ashtray lid',[0,.31,0],3],['ashtray-spring','ashtray hinge spring',[s*.10,.25,0],3],['vent','rear-console side vent',[s*.15,0,0],18]])part('console-'+side+'-'+k,'console',(s>0?'Left':'Right')+' '+n,'Independent early-console part, following the 1984–85 diagram.',v,294,c,'shifter');
 part('console-window-'+side,'console',(s>0?'Driver':'Passenger')+' power-window switch','Separate rocker and switch housing.',[s*.11,.32,0],295,s>0?44:45,'shifter',{option:'powerWindows',value:true});
 part('console-blank-'+side,'console',(s>0?'Driver':'Passenger')+' manual-window blank','Blanking insert used when the power-window switches are absent.',[s*.11,.32,0],294,12,'shifter',{option:'powerWindows',value:false});
}
part('console-mirror-switch','console','Power-mirror control','Four-way control and mounting plate.',[0,.34,.10],294,13,'shifter',{option:'powerMirrors',value:true});
for(let i=0;i<10;i++)part('console-screw-'+i,'console','Console trim screw '+(i+1),'Individually separated screw at the radio face, shift surround or rear shell. Exact pattern remains reconstructed.',[(i%2?1:-1)*.14,.20+(i%3)*.06,(i-5)*.03],294,2,'shifter');
addRows('radio','dashboard',290,[['radio-case','Delco receiver case','Separate folded receiver enclosure; internal electronic boards remain grouped.',[0,0,-.15],11],['radio-face','Delco radio face and display','Period horizontal display, tuning controls and preset row; configured audio variants remain previews.',[0,.03,.13],11],['radio-bracket','Radio mounting bracket','Stamped support behind the receiver.',[0,-.12,-.12],11],['radio-plugs','Radio connectors and antenna lead','Separate rear connectors and short coaxial branch; pin assignments remain unverified.',[.12,0,-.16],11]]);
for(let i=0;i<2;i++)part('radio-knob-'+i,'radio',i?'Radio tuning knob':'Radio volume knob','Independent concentric knob and shaft.',[(i?1:-1)*.05,0,.22],290,11,'dashboard');
for(let i=0;i<4;i++)part('radio-screw-'+i,'radio','Radio attachment screw '+(i+1),'Separate receiver bracket/face attachment screw.',[(i%2?1:-1)*.1,.06,.15],290,11,'dashboard');
for(const [side,s]of [['left',1],['right',-1]]){
 const pre='door-'+side+'-',section='door-'+side,owner='door-trim-'+side,label=s>0?'Driver':'Passenger';
 for(const [k,n,d,v,c]of [
 ['panel','door-trim board and upholstery','Two-tone molded upper panel, lower carpet and formed rear edge.',[s*.15,0,0],37],
 ['armrest','door armrest and pull','Long horizontal armrest with an inclined forward pull handle.',[s*.27,.08,0],25],
 ['armrest-bracket','armrest support bracket','Metal support behind the removable pull.',[s*.06,.05,0],33],
 ['handle-cup','inside handle escutcheon','Black inset cup with a real lever recess.',[s*.25,.10,-.04],21],
 ['handle','inside release lever','Separate interior release lever and pivot.',[s*.33,.10,-.04],23],
 ['lock-slider','manual lock slider','Separate lock control adjacent to the release lever.',[s*.32,.15,-.02],21],
 ['water-shield','door water deflector','Thin inner moisture shield behind the trim board. Adhesive route remains reconstructed.',[-s*.06,0,0],37],
 ['retainers','door-trim retaining clips','Shared nine-clip set already present in the Body explorer; not duplicated in the installed vehicle.',[s*.1,-.08,0],37],
 ])part(pre+k,section,label+' '+n,d,v,347,c,owner,{sharedVehicle:k==='retainers',doorSkin:k==='panel'});
 part(pre+'crank',section,label+' window crank','Manual winding handle with rotating knob.',[s*.31,0,-.10],347,28,owner,{option:'powerWindows',value:false});
 part(pre+'crank-clip',section,label+' window-crank retaining clip','Spring clip behind the handle hub.',[s*.23,0,-.10],347,27,owner,{option:'powerWindows',value:false});
 part(pre+'pocket',section,label+' door map pocket','Separate soft map pocket with an open upper edge.',[s*.25,-.06,.10],347,31,owner,{option:'mapPockets',value:true});
 for(let i=0;i<2;i++)part(pre+'armrest-screw-'+i,section,label+' armrest screw '+(i+1),'Separate armrest attachment screw.',[s*.37,-.01,i? .13:-.13],347,34,owner);
 part(pre+'handle-screw',section,label+' handle-bezel screw','Individual escutcheon attachment screw.',[s*.37,.12,-.02],347,22,owner);
}
addRows('trim','cabin-trim',347,[
 ['trim-bulkhead','Carpeted rear bulkhead panel','Separate carpet panel behind both seats with a centre console relief.',[0,.04,.25],1],
 ['trim-headliner','Molded fabric headliner','Roof-shaped lining with an actual opening for the glass-roof configuration. Contour reconstructed from the body; this diagram does not dimension the headliner.',[0,.24,0],null],
 ['trim-mirror','Interior rear-view mirror','Mirror head, rim and reflective glass.',[0,.10,.12],11],
 ['trim-mirror-stem','Interior mirror stalk','Independent adjustable stem.',[0,.12,.02],11],
 ['trim-mirror-button','Windshield mirror button','Bonded mounting button; separation is construction illustration.',[0,.14,-.03],11],
]);
for(const [side,s]of [['left',1],['right',-1]])for(const [k,n,d,v,c]of [
 ['carpet','formed footwell carpet','Contoured floor carpet rising over the sill and centre tunnel.',[0,.08,0],12],
 ['underlay','floor sound pad','Insulating pad beneath the carpet.',[0,-.04,0],12],
 ['sill','door-sill plate','Long removable sill trim with attachment recesses.',[s*.12,0,0],15],
 ['a-pillar','A-pillar interior garnish','Slim molded inner windshield-pillar trim following the shared body opening.',[s*.15,.08,-.07],15],
 ['b-pillar','rear pillar garnish','Early 1985 quarter trim without the later sail-panel speakers.',[s*.16,.04,.12],17],
 ['visor','sun visor','Padded visor with separate pivot and support.',[s*.05,.16,-.08],9],
 ['visor-pivot','visor pivot and bracket','Separate metal pivot and body bracket.',[s*.09,.21,-.08],8],
 ['visor-clip','visor support clip','Independent inner visor retainer; support subcomponent reconstructed.',[s*.04,.23,-.08],8],
 ])part('trim-'+side+'-'+k,'trim',(s>0?'Driver':'Passenger')+' '+n,d,v,k==='carpet'||k==='underlay'?351:347,c,'cabin-trim');
for(const side of ['left','right']){
 for(let i=0;i<4;i++)part('trim-'+side+'-sill-screw-'+i,'trim',side+' sill screw '+(i+1),'Individual sill-retaining screw; local pattern reconstructed.',[side==='left'?.16:-.16,.14,(i-1.5)*.06],347,15,'cabin-trim');
 for(let i=0;i<3;i++)part('trim-'+side+'-visor-screw-'+i,'trim',side+' visor bracket screw '+(i+1),'Individual visor pivot bracket screw.',[side==='left'?.08:-.08,.28,(i-1)*.04],347,9,'cabin-trim');
 part('trim-'+side+'-mat','trim',side+' removable floor mat','Independent carpeted footwell mat.',[0,.16,0],351,12,'cabin-trim',{option:'floorMats',value:true});
}
part('trim-vanity','trim','Passenger visor vanity mirror','Mirror and fitted surround on the passenger visor.',[-.06,.16,.05],347,12,'cabin-trim',{option:'vanityMirror',value:true});
addRows('steering','steering-wheel',289,[
 ['steering-rim','Three-spoke steering wheel','Round rim with two horizontal spokes and a lower spoke, matching the 1985 brochure.',[0,.06,.10],null],
 ['steering-horn','Horn button','Separate round centre pad.',[0,.06,.21],null],
 ['steering-contact','Horn contact plate and spring','Contact plate and spring behind the pad; electrical operation is not simulated.',[0,.06,.15],null],
 ['steering-nut','Steering wheel shaft nut','Individual wheel-retaining nut.',[0,.06,.18],null],
 ['steering-upper-shroud','Upper column shroud','Removable upper half of the column trim.',[0,.16,0],null],
 ['steering-lower-shroud','Lower column shroud','Removable lower half of the column trim.',[0,-.12,0],null],
 ['steering-column','Column jacket and shaft','Column support and lower shaft. Full collapsible/tilt internals remain grouped.',[0,0,-.14],null],
 ['steering-stalk','Turn-signal/dimmer stalk','Independent stalk with an option-specific cruise end.',[.18,.04,0],null],
 ['steering-ignition','Ignition lock cylinder','Right-side key cylinder and bezel.',[-.16,.03,0],null],
 ['steering-hazard','Hazard switch button','Separate hazard pull button.',[-.14,.10,0],null],
]);
for(let i=0;i<3;i++)part('steering-screw-'+i,'steering','Column shroud screw '+(i+1),'Individual shroud attachment screw.',[(i-1)*.08,-.18,0],289,null,'steering-wheel');
addRows('pedals','pedals',289,[
 ['pedal-clutch-arm','Clutch pedal arm','Separate clutch pedal arm and upper pivot.',[.10,-.02,0],null],
 ['pedal-clutch-pad','Clutch pedal rubber pad','Removable ribbed pad.',[.10,-.08,.10],null],
 ['pedal-clutch-pivot','Clutch pedal pivot and bushes','Pivot pin and bush pair, separated as an inspection set.',[.17,.04,0],null],
 ['pedal-clutch-spring','Clutch pedal return spring','Separate torsion spring at the pivot. Rate and travel remain unverified.',[.21,.06,0],null],
 ['pedal-accelerator','Accelerator pedal','Narrow ribbed accelerator with hinge.',[-.08,-.06,.07],null],
 ['pedal-throttle-cable','Accelerator cable end','Cable end, guide and short route through the footwell.',[-.12,.04,-.1],null],
 ['parking-lever','Parking-brake lever','Outboard driver-side handle and ratchet support.',[.17,.12,.06],null],
 ['parking-boot','Parking-brake trim boot','Slotted gaiter around the outboard handle.',[.22,.06,.06],null],
]);
// Existing assemblies are linked, not replaced by new approximations.
for(const [key,section,name,assembly,owner,page]of [
 ['shared-light-controls','dashboard','Headlight switch and panel dimmer · open components','headlight-controls','lighting-controls',290],
 ['shared-cluster','dashboard','1985 instrument pod · open component explorer','wiring-cluster','instrument-cluster',289],
 ['shared-outlets','dashboard','Cabin vents · open HVAC explorer','hvac-ducts','hvac-ducts',289],
 ['shared-heater','console','Heater/A/C control · open component explorer','hvac-controls','hvac-controls',294],
 ['shared-ecm','console','Rear-console ECM · open component explorer','wiring-ecm','ecm',294],
 ['shared-brake','pedals','Brake pedal · open component explorer','brake-pedal','pedals',289],
 ['shared-dome','trim','Overhead lamps · open component explorer','lighting-dome','cabin-lamps',347],
])part(key,section,name,'Shared installed assembly; open its existing explorer for its independently selectable internal parts.',[0,.08,.04],page,null,owner,{sharedVehicle:true,relatedAssembly:assembly,relatedAssemblyLabel:'Open detailed assembly'});

for(const p of interiorParts)if(['in-parking-lever','in-parking-boot'].includes(p.id))Object.assign(p,{sharedVehicle:true,relatedAssembly:'brake-parking',relatedAssemblyLabel:'Open parking-brake components'});

// The rear carpet is the seat/floor drawing callout, not windshield garnish.
Object.assign(interiorParts.find(p=>p.id==='in-trim-bulkhead'),{sourceUrl:source+'#page=351',callout:1});
for(const p of interiorParts.filter(p=>p.id.includes('-sill')))p.callout=null;

// Additional small service pieces identified during the enlarged drawing audit.
for(const [side,s]of [['left',1],['right',-1]]){
 const seat='seat-'+side+'-',door='door-'+side+'-';
 part(seat+'pivot-bushes','seat-'+side,'Seat '+side+' hinge bushings','Separate inner/outer hinge bush set; GM early seat drawing callout 4.',[s*.30,.03,.04],351,4,'seats');
 part(seat+'stereo-harness','seat-'+side,'Seat '+side+' stereo harness','1985 seat branch and floor connector, separate from the short speaker leads. Exact terminal population remains unverified.',[s*.13,-.1,.12],351,6,'seats',{option:'speakerSeats',value:true});
 for(const [k,n,c,opt]of [['crank-bearing','window-crank bearing plate',32,'manual'],['pocket-clips','map-pocket clip set',30,'pocket'],['armrest-plug','armrest screw-access plug',34],['upper-bracket','upper armrest hanger plate',36],['armrest-nuts','armrest hanger nut set',35]])part(door+k,'door-'+side,(s>0?'Driver ':'Passenger ')+n,'Separate early door-fitting component; local shape and unspecified quantity reconstructed.',[s*.19,.025,.035],347,c,'door-trim-'+side,opt==='manual'?{option:'powerWindows',value:false}:opt==='pocket'?{option:'mapPockets',value:true}:{});
 part('trim-'+side+'-lower-garnish','trim',(s>0?'Driver':'Passenger')+' lower windshield-side molding','Removable lower garnish at the forward door opening.',[s*.13,-.04,-.10],347,14,'cabin-trim');
 part('console-'+side+'-carpet-support','console',(s>0?'Driver':'Passenger')+' console carpet support','Separate lower console side support channel.',[s*.15,-.09,0],294,41,'shifter');
}
addRows('console','shifter',294,[
 ['console-storage-strap','Storage-door retaining strap','Flexible strap limits the open door; a static installed construction view.',[.17,.10,-.03],24],
 ['console-shift-seal','Shift-trim/carrier seal','Thin continuous gasket beneath the shift insert.',[0,.13,0],11],
 ['console-shift-clips','Shift-plate spring clip set','Separate spring clips beneath the trim plate.',[.16,.10,0],10],
 ['console-lighter-plate','Lighter console trim plate','Small escutcheon around the cigarette-lighter socket.',[0,.12,.10],33],
 ['console-lighter-lamp','Cigarette-lighter lamp','Separate bulb and holder behind the console plate; circuit remains unverified.',[.15,.12,.14],36],
 ['console-carpet-retainers','Console carpet retaining set','Separate carpet-retaining channels and clips; count reconstructed.',[.18,-.07,0],38],
]);
addRows('dashboard','dashboard',290,[
 ['dash-accessory-panel','Right instrument-pod accessory plate','Removable narrow panel opposite the lighting controls; opening accepts the optional rear-defogger switch.',[-.10,.06,.17],15],
 ['dash-column-filler','Column-opening filler','Removable lower filler under the instrument pod.',[0,-.14,.05],17],
 ['dash-mount-unuts','Dashboard U-nut set','Separate nylon U-type attachment nuts; reconstructed pattern.',[.12,.12,-.07],4],
]);
part('dash-defrost-switch','dashboard','Rear-window defogger switch','Optional rocker/control housing in the right accessory plate. Electrical timer internals remain grouped.',[-.12,.06,.25],290,18,'dashboard',{option:'rearDefrost',value:true});
// Component callouts are parent-service identifiers; unnamed attachment screws
// must not be assigned a neighboring plug, nut or trim-board callout.
for(const p of interiorParts){
 if(p.id.startsWith('in-belt-'))p.callout=p.id.includes('buckle')||p.id.endsWith('-button')?3:p.id.includes('guide-cover')?27:p.id.includes('-bolt-')?null:23;
 if(p.id.endsWith('-warning-wire'))p.sourceUrl=source+'#page=347',p.callout=7;
 if(p.id.startsWith('in-dash-screw-')||p.id.endsWith('-handle-screw')||p.id.includes('-armrest-screw-'))p.callout=null;
 if(p.id.includes('-sill'))p.sourceUrl=source+'#page=351',p.callout=14;
 if(p.id==='in-console-left-vent')p.callout=23;
 if(p.id==='in-dash-left-end')p.callout=27;
 if(p.id==='in-dash-right-end')p.callout=5;
}

part('shared-center-outlet','console','Centre adjustable air outlet · open HVAC explorer','Shared centre outlet, placed with the console for an assembled trim/control view. The rest of the ducts remain in Dashboard.',[0,.13,.20],294,42,'hvac-ducts',{sharedVehicle:true,relatedAssembly:'hvac-ducts',relatedAssemblyLabel:'Open detailed assembly'});
