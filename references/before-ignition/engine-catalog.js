export const engineSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf';
export const engineSections=[
 {id:'engine',name:'Complete 2.8L V6',description:'Explore the L44 engine, then open a subassembly to separate its modeled components.'},
 {id:'short-block',name:'Block & rotating assembly',spread:[0,0,0]},
 {id:'head-front',name:'Cabin-side cylinder head',spread:[0,.30,-.42]},
 {id:'head-rear',name:'Trunk-side cylinder head',spread:[0,.30,.42]},
 {id:'induction',name:'Intake & fuel injection',spread:[0,.68,0]},
 {id:'timing',name:'Camshaft & timing drive',spread:[-.46,0,0]},
 {id:'lubrication',name:'Oil pan & lubrication',spread:[0,-.38,0]},
 {id:'ignition',name:'Distributor & ignition',spread:[.46,.25,0]},
 {id:'accessories',name:'Water pump & accessories',spread:[-.68,.15,0]},
 {id:'flywheel',name:'Manual-engine flywheel',spread:[.46,-.08,0]},
];
export const engineParts=[];
const part=(id,section,name,description,spread=[0,0,0])=>engineParts.push({id:`eng-${id}`,section,system:'engine',name,description,location:engineSections.find(s=>s.id===section).name,spread,source:['short-block','timing','lubrication','accessories','flywheel'].includes(section)?'GM 22P · H-19':'GM 22P · H-22'});
part('block','short-block','Cylinder block','Reconstructed 60-degree V6 block with six open cylinder bores, crankcase walls and main-bearing saddles. Local casting details and dimensions are approximate.');
part('crankshaft','short-block','Crankshaft','Main journals, offset crankpins and counterweights. The crank is separated below the block for inspection.',[0,-.27,0]);
for(let i=1;i<=4;i++)part(`main-cap-${i}`,'short-block',`Main bearing cap ${i}`,'Separate main-bearing cap with representative fasteners. Bearing clearances and bolt torques are not supplied.',[0,-.45-(i%2)*.07,0]);
for(let i=1;i<=4;i++)part(`main-bearing-${i}`,'short-block',`Main bearing shell pair ${i}`,'Separate upper and lower shell representations, grouped as a pair. Bearing size and clearance are not specified.',[0,-.36,.13]);
for(const [bank,s] of [['front',-1],['rear',1]]){
 const section=`head-${bank}`,label=s<0?'Cabin-side':'Trunk-side';
 part(`${bank}-head`,section,`${label} cylinder head`,'Cast head with combustion chambers and valve ports. Geometry follows the catalog layout, not a measured replacement casting.');
 part(`${bank}-head-gasket`,section,`${label} head gasket`,'Separate gasket with cylinder openings; outline is illustrative, not a fabrication template.',[0,-.10,0]);
 part(`${bank}-cover`,section,`${label} valve cover`,'Finned red valve cover with machined rib faces.',[0,.43,s*.06]);
 part(`${bank}-cover-gasket`,section,`${label} valve-cover gasket`,'Separate perimeter gasket beneath the cover.',[0,.35,s*.05]);
 part(`${bank}-head-bolts`,section,`${label} head bolt set`,'Representative grouped head fasteners. Exact count, lengths and tightening sequence remain unverified.',[.08,.19,s*.12]);
 for(let c=1;c<=3;c++){
  const tag=`${bank}-${c}`,where=`${label}, cylinder position ${c}`;
  part(`piston-${tag}`,'short-block',`${where} piston`,'Separate piston with crown, skirt and ring grooves. Position numbering is for this viewer, not firing order.',[(c-2)*.10,.08,s*.35]);
  part(`rings-${tag}`,'short-block',`${where} piston rings`,'Two compression rings and an illustrative oil-control ring set, grouped for inspection.',[(c-2)*.10,.21,s*.35]);
  part(`pin-${tag}`,'short-block',`${where} wrist pin`,'Hollow pin connecting piston and rod.',[(c-2)*.10+.11,.08,s*.35]);
  part(`rod-${tag}`,'short-block',`${where} connecting rod`,'Connecting rod with open small and big ends.',[(c-2)*.10,-.06,s*.35]);
  part(`rod-cap-${tag}`,'short-block',`${where} rod cap`,'Separate big-end cap and representative bolts.',[(c-2)*.10,-.17,s*.35]);
  part(`rod-bearing-${tag}`,'short-block',`${where} rod bearing shells`,'Paired bearing-shell representations inside the connecting-rod big end.',[(c-2)*.10,-.06,s*.46]);
  for(const type of ['intake','exhaust']){
   const v=`${tag}-${type}`,name=`${where} ${type}`;
   part(`valve-${v}`,section,`${name} valve`,'Poppet valve with stem and head. Valve angle, lift and seating dimensions remain approximate.',[(c-2)*.075,-.17,s*.17]);
   part(`spring-${v}`,section,`${name} valve spring`,'Helical valve spring and retainer, grouped. Spring rate and installed height are not verified.',[(c-2)*.075,.16,s*.17]);
   part(`rocker-${v}`,section,`${name} rocker arm`,'Individual rocker arm and pivot representation.',[(c-2)*.075,.29,s*.17]);
   part(`pushrod-${v}`,section,`${name} pushrod`,'Individual pushrod between the lifter and rocker.',[(c-2)*.075,.04,-s*.15]);
   part(`lifter-${v}`,section,`${name} hydraulic lifter`,'Individual hydraulic-lifter exterior. Internal lifter pieces are not yet modeled.',[(c-2)*.075,-.09,-s*.15]);
  }
  part(`spark-${tag}`,'ignition',`${where} spark plug`,'Threaded shell, ceramic insulator and terminal.',[(c-2)*.09,0,s*.27]);
 }
 part(`${bank}-exhaust`,section,`${label} exhaust manifold`,'Three branch tubes joining a collector, following the engine layout. Welds, heat shields and exact flange profiles remain approximate.',[0,-.06,s*.34]);
 part(`${bank}-exhaust-gasket`,section,`${label} exhaust gasket set`,'Three port-gasket representations grouped for inspection; not fabrication templates.',[0,-.02,s*.22]);
}
for(const [id,name,desc,spread] of [
 ['lower-intake','Lower intake manifold','Lower casting bridging both banks.',[0,0,0]],
 ['middle-intake','Middle intake runners','Six formed runners between lower manifold and upper plenum.',[0,.17,0]],
 ['plenum','Upper intake plenum','Red upper plenum; catalog distinguishes 1985–86 from later versions.',[0,.35,0]],
 ['intake-gaskets','Intake gasket set','Grouped port gaskets; not fabrication outlines.',[0,-.10,0]],
 ['throttle','Throttle body','Bore, butterfly and external housing.',[.22,.35,0]],
 ['fuel-rail','Fuel rail & regulator','Twin rail tubes with a regulator representation.',[0,.09,.20]],
])part(id,'induction',name,desc,spread);
for(let i=0;i<6;i++)part(`injector-${i+1}`,'induction',`Fuel injector ${i+1}`,'Individual injector exterior with connector and seals. Numbering identifies model instances.',[(i%3-1)*.06,-.05,(i<3?-1:1)*.12]);
for(const [id,section,name,desc,spread] of [
 ['camshaft','timing','Camshaft','Cam-in-block shaft with twelve representative lobes.',[-.28,0,0]],
 ['cam-bearings','timing','Camshaft bearing set','Grouped journal-bearing sleeves. Exact bearing sizes and oil-hole positions remain unverified.',[.12,.10,0]],
 ['cam-gear','timing','Camshaft sprocket','Larger timing sprocket at the accessory end.',[-.13,.04,0]],
 ['crank-gear','timing','Crankshaft sprocket','Smaller crank timing sprocket.',[-.13,-.04,0]],
 ['chain','timing','Timing chain','Individual linked-chain representation between sprockets.',[-.23,0,0]],
 ['timing-cover','timing','Timing cover','Front cover with a crank-seal opening.',[-.36,0,0]],
 ['balancer','timing','Harmonic balancer','Crankshaft damper and belt-groove representation.',[-.49,0,0]],
 ['pan','lubrication','Oil pan','Open sump with flange and drain plug.',[0,-.20,0]],
 ['pan-gasket','lubrication','Oil-pan gasket','Separate perimeter seal.',[0,-.07,0]],
 ['oil-pump','lubrication','Oil pump','Pump housing below the crankcase.',[.13,0,0]],
 ['pickup','lubrication','Oil pickup & strainer','Formed pickup tube and screened inlet.',[-.13,-.04,0]],
 ['oil-filter','lubrication','Oil filter','Spin-on filter exterior.',[.18,-.05,-.24]],
 ['distributor','ignition','Distributor body & shaft','Shaft and distributor housing. Internal advance details are not yet modeled.',[0,0,0]],
 ['rotor','ignition','Distributor rotor','Separate rotor beneath the cap.',[0,.15,0]],
 ['cap','ignition','Distributor cap','Six plug-wire towers and central coil connection.',[0,.27,0]],
 ['water-pump','accessories','Water pump','Pump housing with inlet and pulley shaft.',[0,0,0]],
 ['water-pulley','accessories','Water-pump pulley','Separate belt pulley.',[-.16,0,0]],
 ['alternator','accessories','Alternator','Housing, cooling slots and pulley representation; internal electrical pieces are not yet modeled.',[0,.23,-.16]],
 ['belt','accessories','Accessory belt','Representative belt loop; not a routing or length specification.',[-.27,0,0]],
 ['flywheel','flywheel','Manual-transmission flywheel','Engine-side flywheel and ring gear; clutch and transaxle remain separate vehicle assemblies.',[.15,0,0]],
 ['rear-seal','flywheel','Rear crankshaft seal','Separate annular crank seal.',[0,0,0]],
])part(id,section,name,desc,spread);
export const enginePartById=new Map(engineParts.map(p=>[p.id,p]));
export const engineSectionById=new Map(engineSections.map(s=>[s.id,s]));
export const engineMembers=section=>engineParts.filter(p=>section==='engine'||p.section===section);
