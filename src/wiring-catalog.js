import {instrumentParts} from './instrument-catalog.js';
// Primary sources inspected as scans; ratings and connector assignments are
// distinct from the unmeasured exterior forms and routing in the model.
export const ownersSource='https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FOwners+Manuals%2F1985%2F1985+Fiero+Owners+Manual.pdf';
export const wiringSources={owners:ownersSource+'#page=93',diy:'https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=41',ecm:'https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=69',est:'https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=92',location:'https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1038'};
export const fusePositions=[
 [1,'ECM IGN',10,0,0,'ECM ignition supply'],[2,'F PUMP',10,1,0,'Fuel-pump relay and oil-pressure switch feed'],[3,'TAIL',20,2,0,'Tail, parking, marker and license lamps'],[4,'FAN E',20,3,0,'Cooling-fan relay coil'],
 [5,'TURN B/U',20,0,1,'Turn-signal flasher and reverse lamps'],[6,'TBI INJ1',5,1,1,'V6 fuel-injection feed'],[7,'STOP HAZ',20,2,1,'Stop-lamp switch, hazard flasher and warning chime'],[8,'HTR A/C',25,3,1,'Heater and air conditioner'],
 [9,'GAGES',10,0,2,'Instrument cluster, warning chime, VSS, generator lamp and related controls'],[10,'TBI INJ2',5,1,2,'V6 fuel-injection feed'],[11,'BAT',20,2,2,'Horn relay, dome lamps, clock and lighter'],[12,'WDO',30,3,2,'Power-window circuit breaker'],
 [13,'INST LPS',5,.5,3,'Instrument illumination and headlamp warning'],[14,'RADIO',10,1.5,3,'Radio and cruise control'],[15,'PWR ACC',30,3,3,'Power-lock / rear-defogger circuit breaker'],
 [16,'WIPER',20,1,4,'Windshield-wiper motor'],[17,'CTSY LID',20,3,4,'Deck release, luggage lamp, lock relay and power mirrors'],
].map(([number,label,amps,col,row,description])=>({number,label,amps,col,row,description,breaker:amps===30}));
export const wiringSections=[{id:'wiring-system',name:'Instruments, fuses & electronics'},{id:'wiring-fuses',parent:'wiring-system',name:'Driver-side fuse panel'},{id:'wiring-ecm',parent:'wiring-system',name:'ECM enclosure & connectors'},{id:'wiring-junction',parent:'wiring-system',name:'Battery junction & grounds'},{id:'wiring-flashers',parent:'wiring-system',name:'Flashers & convenience center'}];
export const wiringParts=[];
function part(section,key,name,description,spread,source='diy') {wiringParts.push({id:'wr-'+key,section:'wiring-'+section,system:'electrical',name,description,spread,source:source==='owners'?'1985 Pontiac owner’s manual · 6-5':source==='ecm'?'1985 Pontiac 6E3 · ECM construction':source==='est'?'1985 Pontiac 6E3 · figure 38':source==='location'?'1986 Pontiac 8A · supporting location view':'1985 Pontiac DIY · 2-32 / 2-33',sourceUrl:wiringSources[source],referenceNote:'Factory documents establish identities and relationships. Molded profiles, board details, dimensions, terminal construction and routing are reconstructed. Adjacent-year location evidence is identified separately. Internal views are construction illustrations, not circuit-board repair instructions.',location:wiringSections.find(s=>s.id==='wiring-'+section).name});}
for(const [key,name,description,spread]of[
 ['fuse-carrier','Fuse-block molded carrier','Open carrier with 17 protection positions and lower spare storage. Correct numbered layout follows the 1985 owner’s manual.',[0,0,0]],
 ['fuse-contacts','Fuse socket contacts','Paired folded spring terminals behind each fuse position; geometry is illustrative, with no invented internal bus connections.',[0,0,-.07]],
 ['fuse-bracket','Fuse-block pivot bracket','Separate under-dash support and hinge ears.',[0,.08,-.10]],
 ['fuse-pivot','Fuse-block hinge pin','Pivot at the top of the drop-down panel.',[.15,.07,0]],
 ['fuse-latches','Two fuse-block release tabs','Two center release tabs, pressed inward to lower the panel toward the seat per the 1985 DIY manual.',[.13,0,0]],
 ['fuse-spares','Five-place spare-fuse holder','Empty lower storage clips. The original number and ratings of spare fuses are unknown.',[0,-.09,0]],
 ['fuse-rear-plugs','Fuse-block rear connector housings','Rear wire-entry housings. Terminal population and exact 1985 connector pinouts remain unverified.',[0,0,-.14]],
 ['fuse-mounts','Fuse-panel mounting hardware','Separate panel support screws; local sizes and exact attachment count remain unmeasured.',[.15,.12,-.03]],
])part('fuses',key,name,description,spread,'owners');
for(const f of fusePositions){
 part('fuses','fuse-'+f.number,`${f.number}. ${f.label} · ${f.amps} A ${f.breaker?'breaker':'fuse'}`,f.description+'. '+(f.breaker?'Factory optional-equipment position shown; this does not establish the installed option.':'Translucent blade-fuse body, two terminals, exposed test points and internal element are modeled as one service unit.'),[(f.col-1.5)*.05,(2-f.row)*.02,.08+(f.row%2)*.045],'owners');
 wiringParts.at(-1).serviceReference={title:'1985 fuse-panel reference',rows:[['Panel position',String(f.number)],['Label',f.label],['Rating',`${f.amps} A`],['Type',f.breaker?'Circuit breaker':'Blade fuse']],links:[['Pontiac owner’s manual · 6-5',wiringSources.owners]],note:'Match the original circuit and rating. The modeled fuse panel is a reference layout; option-dependent positions do not establish this car’s build equipment.'};
}
for(const [key,name,description,spread]of[
 ['ecm-base','ECM lower enclosure','Folded metal enclosure with open interior and connector openings.',[0,0,0]],
 ['ecm-lid','ECM upper enclosure','Separate lid with a real opening for the calibration access cover.',[0,.10,0]],
 ['ecm-cover','PROM / CALPAK access cover','Separate service access plate shown in Pontiac figure 12.',[0,.18,0]],
 ['ecm-screws','ECM cover screws','Separate access and enclosure fasteners; dimensions and count remain reconstructed.',[.12,.21,0]],
 ['ecm-board','ECM board substrate','Board support surface only. Exact circuit traces, components, processor revision and solder joints have not been verified and are not invented here.',[0,.055,0]],
 ['ecm-prom','PROM in keyed carrier','Separate calibration carrier under the access cover. No broadcast code is assigned from the VIN.',[.03,.14,0]],
 ['ecm-calpak','CALPAK in carrier','Separate calibration pack. Original calibration identity must be established from the installed unit.',[-.06,.14,0]],
 ['ecm-sockets','PROM / CALPAK sockets','Separate socket bodies and contact rows below the calibration carriers.',[0,.10,.04]],
 ['ecm-header-ab','ECM A/B connector header','Two rows with 12 positions each, following the 24-position A/B connector in figure 38.',[.06,0,-.06]],
 ['ecm-header-cd','ECM C/D connector header','Two rows with 16 positions each, following the 32-position C/D connector in figure 38.',[-.06,0,-.06]],
 ['ecm-plug-ab','ECM C509 A/B harness plug','24 cavity positions with separate openings and retention latch. This shows cavity capacity, not a claim that every position is wired.',[.05,-.02,-.15]],
 ['ecm-plug-cd','ECM C510 C/D harness plug','32 cavity positions with separate openings and retention latch. Wire-entry orientation must be checked against the factory diagram.',[-.05,-.02,-.15]],
 ['ecm-mount','ECM mounting carrier','Formed console mounting carrier; the ECM is behind the seats in the rear console, as located in the 1985 top-view diagram.',[0,-.05,.10]],
 ['ecm-mount-bolts','ECM carrier fasteners','Separate carrier retention bolts, approximate local dimensions.',[.15,0,.12]],
])part('ecm',key,name,description,spread,key.includes('header')||key.includes('plug')?'est':'ecm');
for(const [key,name,description,spread]of[
 ['junction-base','Battery junction insulated base','Passenger-side rear power distribution block, beside the battery. Adjacent-year factory view supports its local arrangement.',[0,0,0]],
 ['junction-studs','Two junction studs & nuts','Two separate power attachment studs and insulating shoulders. Terminal assignments require the full 1985 distribution diagram.',[.08,.06,0]],
 ['junction-leads','Junction feed leads & eyelets','Distinct ring-terminal power leads. Exact branch lengths and fusible-link gauges remain unverified.',[.10,.02,.07]],
 ['junction-mount','Junction support & fasteners','Separate mounting plate and screws.',[0,-.07,-.05]],
 ['ground-body','Battery-area body ground eyelet','Passenger-side body attachment and negative pigtail. Factory location view is adjacent-year evidence.',[-.06,0,.07]],
 ['ground-engine','Engine ground eyelets & retaining nut','Ground terminal stack on the engine. Original branch identities and measured route remain unverified.',[-.06,-.04,-.08]],
])part('junction',key,name,description,spread,'location');
for(const [key,name,description,spread]of[
 ['turn-flasher','Turn-signal flasher','Cylindrical flasher near the left of the steering column, distinct from the right-side hazard flasher.',[0,0,0]],
 ['turn-flasher-clip','Turn-flasher retaining clip','Spring-steel clip holding the turn flasher beneath the driver dash.',[-.08,.05,0]],
 ['turn-flasher-plug','Turn-flasher socket & leads','Separate flasher plug with short illustrative wiring.',[0,-.06,-.06]],
 ['convenience-base','Convenience-center carrier','Passenger-side under-dash carrier for the hazard flasher and horn relay; placement is specified in the 1985 DIY manual.',[0,0,0]],
 ['hazard-flasher','Hazard-warning flasher','Separate cylindrical hazard flasher, plugged into the convenience center.',[.08,.06,0]],
 ['horn-relay','Horn relay','Separate relay at the right-side convenience center; exact internal contact construction remains unverified.',[-.08,.06,0]],
 ['convenience-plugs','Convenience-center sockets','Separate rear socket housings and short leads, without unverified circuit assignments.',[0,-.06,-.06]],
])part('flashers',key,name,description,spread);

wiringSections.push({id:'wiring-cluster',parent:'wiring-system',name:'1985 instrument cluster'});
wiringParts.push(...instrumentParts);

// Explode offsets use installed vehicle axes. The ECM cover opens toward
// the cabin (-Z), while its harness plugs withdraw downward from the case.
const ecmSpread={lid:[0,.025,-.11],cover:[0,.045,-.20],screws:[.12,.09,-.23],board:[0,0,-.06],prom:[.04,.025,-.15],calpak:[-.04,.025,-.15],sockets:[0,0,-.10],'header-ab':[.025,-.055,0],'header-cd':[-.025,-.055,0],'plug-ab':[.035,-.125,0],'plug-cd':[-.035,-.125,0],mount:[0,0,.08],'mount-bolts':[.13,0,.10]};
for(const [key,spread]of Object.entries(ecmSpread))wiringParts.find(p=>p.id==='wr-ecm-'+key).spread=spread;
