export const spareSources={parts:'https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=251',diy:'https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=13',owners:'https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FOwners+Manuals%2F1985%2F1985+Fiero+Owners+Manual.pdf'};
export const spareSections=[
 {id:'spare-system',name:'Compact spare, jack & stowage'},
 {id:'spare-wheel',parent:'spare-system',name:'Compact tire, steel wheel & valve',spread:[0,.16,0]},
 {id:'spare-jack',parent:'spare-system',name:'Factory jack construction',spread:[-.13,.10,0]},
 {id:'spare-stowage',parent:'spare-system',name:'Retainers, bracket & wheel wrench',spread:[0,.03,.13]},
];
export const spareParts=[];
const note='GM 22P PDF 251, figure 2P08-009, explicitly covers 1985–88. The nominal steel wheel is 15 × 4 inches; the 1985 owner manual specifies 415 kPa / 60 psi for the original compact spare. Other geometry, jack internals, thread pitch, clearances and tooling remain reconstructed. Subdivision of the jack illustrates construction, not a disassembly or lifting procedure. Inspect the actual spare and its condition before use.';
function part(key,section,name,description,spread,callout,number=null,extra={}){spareParts.push({id:'sp-'+key,section:'spare-'+section,system:'brakes',vehiclePart:'spare-wheel',name,description,spread,callout,partNumber:number,source:'GM 22P · 1985–88 spare stowage',sourceUrl:spareSources.parts,location:'Front compartment',referenceNote:note,...extra});}
part('tire','wheel','Compact spare tire','Separate narrow tire carcass and reconstructed tread ribs. Exact tire size, original manufacturer/compound and remaining usable condition are not established by the catalog wheel specification.',[0,.15,0],10,null,{source:'1985 Pontiac owner · compact spare',sourceUrl:spareSources.owners+'#page=55',serviceReference:{title:'Original compact-spare information',rows:[['Pressure','415 kPa / 60 psi'],['Use','Temporary compact spare'],['Rim','15 × 4-inch RK steel wheel; GM 9590503'],['Tire size','Requires tire marking / vehicle placard verification']],links:[['Original 1985 owner · printed 3-4 / 3-5',spareSources.owners+'#page=55'],['1985–88 wheel and stowage · GM 22P',spareSources.parts]],note}});
part('rim','wheel','15 × 4-inch compact steel wheel','RK compact wheel, GM 9590503. The open center, five lug holes and ventilation openings replace a solid disc proxy. Only bead diameter and width are sourced nominal dimensions; bore, bolt circle, offset and stamped contour remain reconstructed.',[0,.03,0],10,'9590503');
part('valve','wheel','Compact-spare valve stem','Separate hollow stem and rubber seat at the wheel rim; original valve series and dimensions remain unverified.',[.16,.1,-.07],10);
part('valve-core','wheel','Valve-core construction','Separate illustrative core body and central pin; not a certified replacement core specification.',[.19,.15,-.09],10);
part('valve-cap','wheel','Valve dust cap','Separate open-bottom cap over the valve stem.',[.21,.20,-.10],10);
part('markings','wheel','Compact-spare use / pressure markings','The original owner publication states temporary use and 60 psi. The displayed lettering is a legible reconstruction, not an exact tire mold/font or proof of the current tire condition.',[0,.22,0],10,null,{source:'1985 Pontiac owner · printed 3-4',sourceUrl:spareSources.owners+'#page=55'});
for(const [key,name,desc,spread,callout,number]of [
 ['retaining-rod','Spare-wheel retaining rod','Cross-compartment rod with hooked end and eye, following the factory stowage drawing. It replaces the former short hub-mounted bar.',[0,.18,-.08],1,'10023232'],
 ['spare-bolt','Spare retaining hand screw','Separate knurled hand screw securing the retaining rod, rather than an invented long shaft through the wheel center.',[.15,.23,-.08],2,'10024098'],
 ['jack-bolt','Jack retaining hand screw','Separate hand screw securing the folded jack to its bracket.',[-.15,.20,.02],4,'10030929'],
 ['u-nut','Jack bracket U-shaped nut','Separate U-shaped spring nut, identified as M8 × 1.25 in the 1985–88 catalog table.',[-.22,.06,.07],5,'12337966'],
 ['bracket-nut','Jack bracket M6 nut','Hex nut and conical washer, M6 × 1 in the source table.',[-.25,-.02,.07],6,'11508277'],
 ['bracket','Jack stowage bracket','Folded supporting bracket with open lightening apertures and mounting feet. This is the 1985–88 bracket, not the different 1984 non-Y82 arrangement.',[-.17,-.08,.07],7,'10041843'],
 ['bracket-screw','Jack bracket retaining screw','Separate M6 × 1 × 20 hex/washer-head screw, as specified in the catalog.',[-.27,-.06,.10],8,'11508800'],
 ['wrench','Wheel-nut wrench / jack handle','Bent wheel-nut wrench with a hollow socket and flattened jack-drive end. Catalog size is 19.56 mm; handle bends and engagement dimensions are reconstructed.',[-.18,.06,.20],9,'14036400'],
 ['wrench-clip','Wheel-wrench retaining clip','Clip beneath the jack holds the wrench behind the spare tire, as shown in the original 1985 owner manual. No separate 1985 part number is inferred from the 1984 table.',[-.15,-.08,.20],null,null],
 ])part(key,'stowage',name,desc,spread,callout,number,key==='wrench-clip'?{source:'1985 Pontiac owner · printed 3-8',sourceUrl:spareSources.owners+'#page=59'}:{});
for(const [key,name,desc,spread]of [
 ['jack-base','Jack base / lower shoe','Formed base with separate side returns and pivot holes.',[0,-.13,0]],
 ['jack-lower-arms','Lower jack arm pair','Open folded channels between the base pivot and the screw trunnions.',[-.08,-.05,0]],
 ['jack-upper-arms','Upper jack arm pair','Separate folded channels between the trunnions and the head pivot.',[.08,.05,0]],
 ['jack-head','Grooved jack head','Separate head has an actual open groove for the rocker flange. Exact groove/vehicle interface remains unmeasured.',[0,.15,0]],
 ['jack-leg','Folding jack positioning leg','Separate positioning leg shown in the original owner jacking figure; displayed folded for storage. Its deployment is not simulated.',[-.10,.08,.10]],
 ['jack-pins','Jack pivot pin set','Separate transverse pivot pins and end heads; displayed quantity follows the reconstructed linkage, not a complete original fastener inventory.',[.13,.05,0]],
 ['jack-screw','Jack lead screw','Helical visual screw between the trunnions. Thread pitch, engagement, material and load rating are not certified.',[.08,.02,-.12]],
 ['jack-trunnion','Threaded jack trunnion','Illustrative threaded cross-head receiving the screw; internal thread form remains simplified.',[-.11,.02,.12]],
 ['jack-thrust','Jack thrust collar / washer set','Separate collars and washers at the drive end. Bearing type and internal race construction require a physical or detailed factory reference.',[.1,.02,-.16]],
 ['jack-drive','Jack screw drive eye','Open drive eye at the lead-screw end receives the wrench end. Engagement geometry is reconstructed.',[.1,.02,-.21]],
 ])part(key,'jack',name,desc,spread,3,'10030932',{serviceReference:{title:'Original jack assembly',rows:[['Parent catalog item','2P08-009 · item 3'],['Jack service number','10030932'],['Storage','Folded jack secured by its hand screw and bracket'],['Internal details','Reconstructed construction subdivisions; not separate catalog callouts']],links:[['1985–88 jack/stowage catalog',spareSources.parts],['Original 1985 owner · jacking / stowage',spareSources.owners+'#page=58']],note}});
