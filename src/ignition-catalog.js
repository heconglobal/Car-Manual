import {cylinderNumber,cylinderReference,mvma1985} from './factory-specifications.js';
// Factory relationship references. Profiles and routing are reconstructed;
// catalog callouts identify assemblies, not current replacement part numbers.
export const ignitionReferences={
 distributor:{label:'GM parts illustration K-13 · L44 distributor',url:'https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=65'},
 est:{label:'1985 Pontiac 6E3-90 / 91 · EST, figure 38',url:'https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=92'},
 coil:{label:'GM 22P H-22 · L44 coil and mounting hardware',url:'https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=17'},
 harness:{label:'The Fiero Store · reproduced V6 distributor harness',url:'https://www.fierostore.com/85-88-V6-Coil-To-Distributor-Wire/productinfo/62523/'},
};
// Transcribed from the original 1985 Pontiac figure 38 and checked against
// figure 2 (printed 6E3-5). Connector letters are not inferred from colors.
export const estCircuits=[
 {key:'a',cavity:'A',module:'G',circuit:453,color:'Black / red',base:'wire',stripe:'red',ecm:'B3',name:'Reference ground'},
 {key:'b',cavity:'B',module:'B',circuit:424,color:'Tan / black',base:'wireTan',stripe:'wire',ecm:'D5',name:'Bypass'},
 {key:'c',cavity:'C',module:'R',circuit:430,color:'Purple / white',base:'wirePurple',stripe:'wireWhite',ecm:'B5',name:'Distributor reference'},
 {key:'d',cavity:'D',module:'E',circuit:423,color:'White',base:'wireWhite',ecm:'B4',name:'Electronic spark timing'},
];
export const estReference={
 title:'1985 L44 · ICM / ECM circuit identification',
 rows:estCircuits.map(c=>[`${c.cavity} / module ${c.module}`,`${c.name} · CKT ${c.circuit} · ${c.color} · ECM ${c.ecm}`]),
 links:[['Pontiac figure 38 · connector orientation and circuits',ignitionReferences.est.url],['Pontiac figure 2 · ECM wiring','https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=8']],
 note:'The factory drawing identifies A–D at the distributor connector. Confirm the connector view in figure 38 before probing; mating and wire-entry views are opposite. The 3D wire branches stop at the engine loom and do not represent measured lengths or a complete diagnostic procedure.',
};
// Inspected directly in the scanned 1985 Pontiac DIY manual, PDF 31 / 60.
// Historical factory reference, not a claim of current replacement availability.
export const sparkPlugReference={
 title:'1985 Pontiac DIY · 6-cylinder spark plugs',
 rows:[['Gap','1.1 mm (0.045 in.)'],['Installation torque','15 N·m (11 lb-ft)'],['Socket size','5/8 in.'],['Period AC type','R42CTS']],
 links:[['§2-22 · gap, torque and socket','https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=31'],['§3-3 · original replacement type','https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=60']],
 note:'Factory values for the original 2.8L V6. The AC designation is the period manual reference; current replacement availability is not established. The modeled nominal gap is 1.1 mm; other plug dimensions are reconstructed.',
};
const distributorNote='GM K-13 lists two 1985 distributor variants (1103633 and 1103694). The VIN does not identify the installed distributor. Local dimensions and variant-specific details remain unmeasured.';
const rows=[
 ['distributor','distributor-detail','Distributor housing','Cast mounting plate, shaft bore, machined neck and O-ring groove. The L44 uses electronic spark timing; this housing has no vacuum-advance canister.',[0,0,0],7],
 ['distributor-shaft','distributor-detail','Distributor shaft & rotating pole','Separate shaft with its six-lobe rotating magnetic pole and keyed rotor end. The original-style pole arrangement follows the GM drawing.',[0,.13,-.10],4],
 ['pickup-coil','distributor-detail','Ignition pickup coil','Annular pickup winding and molded carrier, with two insulated leads to the ICM P/N terminals. Separate from the remote high-voltage ignition coil.',[-.12,.075,0],11],
 ['pickup-retainer','distributor-detail','Pickup-coil retainer','Thin annular retainer above the pickup coil.',[-.12,.125,0],12],
 ['pole-piece','distributor-detail','Stationary distributor pole piece','Six formed magnetic pole fingers around the pickup and rotating shaft. Geometry follows the original-style GM assembly, not the later star-wheel replacement.',[0,.075,0],13],
 ['pickup-shield','distributor-detail','Pickup-coil shield','Formed sheet-metal shield shown as a separate item in the distributor catalog.',[.115,.17,-.04],5],
 ['icm','distributor-detail','Ignition control module (ICM)','Distributor-mounted electronic module on a metal heat-transfer base. Figure 38 shows two pickup terminals (P/N), two coil terminals (+/C), and four ECM circuits (G/B/R/E).',[.13,.055,.12],9],
 ['icm-screws','distributor-detail','ICM mounting screws','Two module screws and washers, grouped separately from the module so its mounting face is visible.',[.13,.12,.12],10],
 ['distributor-seal','distributor-detail','Distributor housing O-ring','Rubber O-ring around the machined distributor neck. This seals the housing to the engine; it is not a cap gasket.',[-.09,-.055,0],6],
 ['distributor-gear','distributor-detail','Distributor drive gear','Helical drive gear on the lower end of the shaft. Tooth profile and mesh are visual reconstructions.',[0,-.13,0],15],
 ['distributor-roll-pin','distributor-detail','Distributor gear roll pin','Hollow spring pin through the gear and shaft.',[.11,-.13,0],14],
 ['distributor-washer','distributor-detail','Distributor thrust washer','Flat washer adjacent to the distributor drive gear.',[0,-.075,0],16],
 ['distributor-tang-washer','distributor-detail','Distributor tanged washer','Separate formed washer. GM K-13 lists different 1985 applications; exact installed version requires the distributor identifier.',[.085,-.075,0],17],
 ['distributor-housing-pin','distributor-detail','Distributor housing spring pin','Small slotted spring pin listed with the housing.',[-.07,0,.065],8],
 ['rotor','distributor-detail','Distributor rotor','Molded keyed rotor with a raised centre contact spring and radial conductor ending at the cap contacts.',[0,.225,0],3],
 ['cap','distributor-detail','Distributor cap','Hollow molded cap, six peripheral plug-wire towers, central coil tower, internal contacts and carbon brush. The interior can be inspected by isolating and orbiting it.',[0,.33,0],1],
 ['cap-screws','distributor-detail','Distributor cap screws','Two long cap screws and washers, separate from the cap.',[0,.40,0],2],
 ['distributor-clamp','distributor-detail','Distributor hold-down clamp','Slotted steel clamp and bolt at the engine mounting flange. Its local outline remains approximate.',[.10,-.015,.09],null],
 ['ignition-coil','coil-detail','External ignition coil','Single remote ignition coil with a laminated iron core, molded winding housing, high-voltage tower and two low-voltage connector sockets. This V6 does not use six individual coil packs.',[.12,.06,0],null,'coil'],
 ['coil-bracket','coil-detail','Ignition-coil mounting bracket','Formed steel bracket supporting the remote coil. Folded flanges and mounting holes are modeled; exact bracket dimensions remain unmeasured.',[0,-.07,0],null,'coil'],
 ['coil-fasteners','coil-detail','Ignition-coil mounting hardware','Separate coil mounting bolts and washers, grouped.',[.12,.14,0],null,'coil'],
 ['coil-primary-harness','coil-detail','Coil-to-ICM primary harness','Two low-voltage conductors between the coil and distributor module, with keyed connector housings. This is separate from the coil-to-cap high-voltage lead.',[.12,.10,.12],null,'est'],
 ['est-harness','coil-detail','ICM four-circuit EST connector & leads','Four-terminal connector with reference ground, bypass, reference and EST circuits. Displayed lead ends stop at the engine harness; the complete ECM loom is not yet modeled.',[.20,.025,-.10],null,'est'],
 ['coil-feed-harness','coil-detail','Coil power & tach connector','Separate primary feed/tach connector and short leads. Black and gray connector positions follow the factory EST diagram; routes are illustrative.',[.20,-.035,.10],null,'est'],
 ['tach-filter','coil-detail','Tachometer filter & pigtail','Cylindrical filter, mounting tab and paired leads on the tachometer signal branch. The exterior is reconstructed; internal filter electronics are not exploded.',[.17,-.04,-.13],null,'est'],
 ['coil-lead','plug-wires','Coil-to-cap high-voltage lead','Insulated secondary ignition lead with boots at the remote coil and the centre tower of the distributor cap.',[0,.17,0],null,'est'],
 ['wire-separators','plug-wires','Spark-plug wire separators','Molded comb clips keep the modeled leads apart. Exact factory clip count and routing remain under review.',[0,.21,0],null,'est'],
];
export const ignitionParts=rows.map(([id,section,name,description,spread,callout,ref='distributor'])=>({
 id:`eng-${id}`,section,system:'electrical',name,description,spread,location:'L44 engine ignition',
 source:ignitionReferences[ref].label,sourceUrl:ignitionReferences[ref].url,callout,
 referenceNote:section==='distributor-detail'?distributorNote:'External shapes and connections are reconstructed. Exact dimensions, wire lengths and installed part numbers are not verified.',
 aliases:id==='icm'?'ignition module ignition control module HEI EST electronics tune up rebuild':id==='pickup-coil'?'pick-up coil pickup magnetic sensor stator tune up rebuild':`${name} ignition tune up`,
}));
for(const id of ['eng-icm','eng-est-harness'])ignitionParts.find(p=>p.id===id).serviceReference=estReference;
for(const [i,c] of estCircuits.entries())ignitionParts.push({id:`eng-est-${c.key}`,section:'coil-detail',system:'electrical',name:`EST ${c.cavity} · ${c.name} · circuit ${c.circuit}`,description:`${c.color} lead between distributor cavity ${c.cavity} (module ${c.module}) and ECM ${c.ecm}. The visible segment terminates at the engine loom; the factory circuit assignment is verified, but routing and dimensions are reconstructed.`,spread:[.23+i*.045,.06+i*.025,-.12],location:'Distributor four-way connector',source:ignitionReferences.est.label,sourceUrl:ignitionReferences.est.url,serviceReference:estReference,aliases:`ICM EST circuit ${c.circuit} ${c.ecm} ${c.name} ${c.color}`});
for(const [bank,s] of [['front',-1],['rear',1]])for(let c=1;c<=3;c++){
 const where=`${s<0?'Cabin':'Trunk'}-side cylinder ${cylinderNumber(bank,c)}`,tag=`${bank}-${c}`;
 ignitionParts.push({id:`eng-wire-${tag}`,section:'plug-wires',system:'electrical',name:`${where} spark-plug wire`,description:'Individual high-tension lead with a distributor boot and a long spark-plug boot. Cylinder identity follows the Pontiac bank layout. Cap clocking and routing are reconstructed, not an installation diagram.',location:'Between distributor cap and cylinder head',spread:[(c-2)*.055,.11,s*.14],source:ignitionReferences.est.label,sourceUrl:ignitionReferences.est.url,cylinder:cylinderNumber(bank,c),serviceReference:cylinderReference,aliases:'ignition leads cables lines wires tune up'});
}
