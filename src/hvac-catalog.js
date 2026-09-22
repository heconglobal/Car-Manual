export const hvacSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf';
export const hvacSections=[
 {id:'hvac-system',name:'Heating & ventilation'},
 {id:'hvac-module',parent:'hvac-system',name:'Heater case, core & doors',spread:[0,.15,0]},
 {id:'hvac-blower',parent:'hvac-system',name:'Blower, resistor & relay',spread:[-.12,0,-.22]},
 {id:'hvac-ducts',parent:'hvac-system',name:'Cabin ducts & outlets',spread:[0,.25,.10]},
 {id:'hvac-controls',parent:'hvac-system',name:'Heater / A/C controls',spread:[0,-.12,.25]},
 {id:'hvac-evaporator',parent:'hvac-system',name:'C60 evaporator & accumulator',spread:[-.10,0,-.35]},
];
export const hvacParts=[];
const add=(key,section,name,description,spread,callout,page=254,option)=>hvacParts.push({id:'hv-'+key,section:'hvac-'+section,system:'cooling',name,description,spread,callout,source:'GM 22P · '+(page===254?'C41 heater / blower':page===263?'C60 heater / A/C module':page===261?'1985–88 C41 controls':page===280?'1985–88 C60 controls':'air distribution'),sourceUrl:hvacSource+'#page='+page,location:hvacSections.find(s=>s.id==='hvac-'+section).name,referenceNote:'Factory illustrations establish identity and construction. Housings, folds, blade count, local dimensions and connection paths are reconstructed, not measured tooling data. Options are previews, not a VIN-decoded build sheet. Exploded views are not a removal sequence.',...(option===undefined?{}:{option:'airConditioning',value:option})});
for(const row of [
 ['case','Heater main case','Open molded case with a separate blower aperture, core pocket, partitions and mounting flange. The C60 preview adds its evaporator chamber.',[0,0,-.15],8],
 ['cover','Core access cover','Removable core cover with edge folds and screw locations; separated from the main case.',[0,0,.23],25],
 ['cover-seal','Core-cover gasket','Perimeter gasket between the core cover and case.',[0,0,.17],24],
 ['core','Heater core · C41 / C60 variants','Finned coolant heat exchanger with open fin passages. The catalog lists different cores: C41 3052181 and C60 3052427. The configuration swaps reconstructed envelopes, not dimensionally certified replacements.',[0,0,.09],23],
 ['core-tanks','Heater core tanks & tubes','Separate formed end tanks, inlet and outlet necks. C41 and C60 tube arrangements are previewed with their corresponding core.',[.13,0,.08],23],
 ['core-seals','Heater core perimeter foam','Independent foam strips prevent airflow bypass around the core.',[0,.12,.11],22],
 ['core-clamp','Heater core retaining strap','Formed metal strap and its two mounting feet.',[0,-.13,.13],21],
 ['tube-seal','Heater tube bulkhead seal','Molded rubber seal with two true openings for the coolant tubes.',[0,0,-.22],19],
 ['temperature-door','Temperature blend door','Separate hinged door controls the air path through the core. It is not a coolant shutoff valve. Travel and sealing clearances are not calibrated.',[.15,0,.04],11],
 ['temperature-shaft','Temperature-door shaft & lever','Independent operating shaft and external lever at the cable connection.',[.18,.08,0],4],
 ['case-seal','Blower-to-heater case seal','Annular foam gasket around the blower passage.',[0,0,-.10],7],
 ['distributor','Upper air-distribution case','Hollow stepped distributor with open inlet and defrost throats; upper cover separates for inspection.',[0,.21,0],1],
 ['distributor-cover','Air-distributor upper cover','Independent molded upper shell with its rectangular open throat.',[0,.29,0],1],
 ['vent-door','Vent / mode air door','Independent pivoting flap in the upper distributor. C41 linkage and C60 electrical mode operation remain distinct.',[0,.35,.10],2],
 ['defrost-door','Defroster air door','Separate door and sealing edge controlling the defroster branch.',[0,.35,-.13],3],
 ['door-shafts','Vent and defroster shafts','Separate operating shafts and external levers for the upper doors.',[.16,.30,0],29],
 ['cable-bracket','Temperature cable bracket','Folded bracket holding the temperature cable sheath near the blend-door lever.',[.13,.17,0],6],
 ['fasteners','Heater case, cover & core fasteners','Grouped fasteners at the represented mounting interfaces. Full factory retainer inventory remains incomplete.',[0,.13,-.26],9],
])add(row[0],'module',...row.slice(1));
for(const row of [
 ['inlet-actuator','C60 air-inlet electric actuator','Separate electric actuator and mounting ears. No vacuum motor is substituted for the Fiero control.',[-.14,.10,0],49],
 ['mode-actuator','C60 mode electric actuator','Independent mode actuator on the upper distribution case. Internal gears and wiring are not yet modeled.',[.14,.24,0],51],
 ['actuator-links','C60 actuator links & retainers','Formed operating rods, spring return and retaining clips.',[.20,.30,.06],50],
])add(row[0],'module',...row.slice(1),263,true);
for(const row of [
 ['blower-cover','Blower mounting cover','Pressed/molded cover with an open circular wheel passage and three mounting ears.',[0,0,-.15],18],
 ['wheel','Centrifugal blower wheel','Open cage with curved axial vanes, rim and hub. Blade number/profile is illustrative.',[0,0,-.045],12],
 ['wheel-nut','Blower wheel retaining nut','Separate shaft nut, distinct from the motor mounting screws.',[0,0,.02],16],
 ['wheel-washer','Blower wheel support washer','Independent washer between the retaining hardware and impeller hub.',[0,0,-.015],16],
 ['motor','Blower motor','External motor can, end-cap relief, shaft and mounting flange. Armature and brushes remain a sealed grouped assembly.',[0,0,-.27],31],
 ['motor-gasket','Blower mounting gasket','Annular gasket at the motor flange.',[0,0,-.21],null],
 ['motor-screws','Blower motor screw set','Grouped motor-flange screws and washers.',[0,0,-.37],13],
 ['cooling-hose','Blower motor cooling hose','Short curved motor ventilation tube to the blower case. Not a coolant hose.',[-.12,0,-.18],15],
 ['ground','Blower motor ground terminal','Separate ground lug, screw and short lead. Full body-harness routing remains incomplete.',[-.14,-.06,-.23],14],
 ['connector','Blower power connector & lead','Recessed connector housing and short power pigtail.',[-.14,.09,-.23],null],
 ['resistor','Blower resistor assembly','Open wire-coil resistor array on an insulating base. C41 and 1985 C60 use different catalog assemblies; resistance values and winding counts are uncalibrated.',[.13,0,-.20],3],
 ['resistor-seal','Blower resistor gasket','Separate flange gasket with an open center for the resistance elements.',[.13,0,-.25],null],
 ['relay','High blower relay','Separate relay enclosure and mounting bracket. Terminals and circuit behavior remain unverified.',[.14,.13,-.17],5],
])add(row[0],'blower',...row.slice(1),row[0]==='relay'||row[0]==='resistor'?252:254);
for(const row of [
 ['module-gasket','HVAC-to-dash seal','Open perimeter seal between the cabin module and bulkhead.',[0,0,.14],1],
 ['defrost-duct','Defroster distributor duct','Long tapered hollow duct with an inlet throat and two windshield outlets.',[0,.23,0],10],
 ['defrost-seal','Defroster duct foam seal','Perimeter foam along the distributor-to-dash interface.',[0,.30,0],9],
 ['dash-duct','Instrument-panel air duct','Hollow transverse duct with independent left, center and right branches.',[0,0,.21],13],
 ['duct-foam','Side outlet foam seals','Separate seals at the ends of the instrument-panel duct.',[0,.10,.19],12],
 ['left-outlet','Driver-side adjustable outlet','Open outlet frame and separate visible vanes. Full internal vane linkage remains grouped.',[.20,0,.24],21],
 ['right-outlet','Passenger-side adjustable outlet','Opposite-side outlet frame and vane set.',[-.20,0,.24],15],
 ['center-outlet','Center adjustable outlet','Center dashboard outlet, with open throat and horizontal vanes.',[0,.13,.28],14],
 ['floor-duct','Floor outlet distributor','Two open lower branches directing air toward the footwells. Local shape and clearance remain reconstructed.',[0,-.20,.14],10],
 ['duct-fasteners','Duct attachment screws & nuts','Independent hardware groups at the represented duct mounts.',[0,.35,.20],11],
])add(row[0],'ducts',...row.slice(1),278);
for(const row of [
 ['control-housing','Heater / A/C control housing','Open-backed housing with mounting tabs, cable pivot and faceplate recess. The C41 two-slider and C60 pushbutton layouts change with Configure.',[0,0,-.10],2],
 ['control-face','Control faceplate & light pipe','Readable period-style C41 or C60 faceplate. Letter spacing and graphic tooling are reconstructed.',[0,0,.10],8],
 ['fan-switch','Four-position blower switch','Independent rotary switch shell and shaft. Contact internals are not yet modeled.',[.09,0,-.04],3],
 ['fan-knob','Blower knob','Separate ribbed rotary knob at the driver side of the control head.',[.08,0,.14],6],
 ['knob-spring','Blower-knob retaining spring','Separate retaining clip inside the fan knob.',[.08,0,.09],7],
 ['temperature-slider','Temperature slider & cable lever','Independent slider grip, guide and external lever; temperature remains mechanically cable operated with C60.',[0,-.08,.06],5],
 ['temperature-cable','Temperature Bowden cable','Curved outer sheath with separate visible inner-wire ends, between the controller and blend-door lever.',[-.10,-.08,0],20],
 ['control-lamp','Control-head illumination lamp','Separate bulb and socket at the control housing.',[-.10,.08,0],4],
 ['control-screws','Control-head mounting screws','Independent screw set at the mounting ears.',[0,.12,.15],null],
])add(row[0],'controls',...row.slice(1),261);
add('mode-slider','controls','C41 mode slider & cables','Standard-heater mode slider, pivot levers and mechanical Bowden control links. Hidden when the C60 preview is selected.',[0,.08,.08],5,261,false);
add('mode-buttons','controls','C60 mode pushbuttons','Separate bank of Off / A/C / Vent / Heat / Defrost mode pushbuttons. Electrical actuation is represented by the associated module motors.',[0,.08,.08],8,280,true);
for(const row of [
 ['evaporator','C60 evaporator core','Finned refrigerant evaporator and its paired tubes, physically distinct from the coolant heater core. Exact fin pitch and tube geometry remain reconstructed.',[0,0,.08],33],
 ['evaporator-cover','C60 evaporator case cover','Hollow forward chamber cover; removing it in the explorer reveals the separate evaporator.',[0,0,-.15],15],
 ['evaporator-seal','Evaporator perimeter seal','Independent foam seal around the evaporator perimeter.',[0,.14,.05],32],
 ['drain','Evaporator sump drain & seal','Separate downward condensate drain, gasket and elbow.',[0,-.15,0],40],
 ['accumulator','C60 suction accumulator','Spun cylindrical shell, seam, upper ports and mounting band. Desiccant and oil-return internals remain grouped.',[-.15,0,-.12],26],
 ['accumulator-bracket','Accumulator support bracket & band','Independent support bracket, band and hardware. Local placement follows the module drawing and needs vehicle measurement.',[-.22,0,-.04],27],
 ['cycling-switch','Accumulator pressure-cycling switch','Separate pressure-cycling switch and connector. No pressure calibration or refrigerant charge value is provided.',[-.15,.15,-.12],24],
 ['orifice','Fixed orifice tube & seals','Open mesh-screen cage and metering tube, at the evaporator inlet. This is not a thermostatic expansion valve.',[.12,0,-.17],30],
 ['evaporator-pipes','Evaporator / accumulator connecting tubes','Separate short refrigerant connections and flare-style fittings. Full compressor-to-condenser routing remains incomplete.',[0,.16,-.19],29],
])add(row[0],'evaporator',...row.slice(1),263,true);
