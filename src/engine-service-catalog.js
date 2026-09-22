const gm='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf';
const diy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf';
// One entry per selectable service item or explicitly named set. These are
// diagram-based reconstructions, not a complete engine bill of materials.
const rows=[
 ['thermostat-housing','thermostat-detail','Thermostat filler housing','Open steel filler neck with rolled lip, side hose outlet, mounting flange and coolant passage.',[0,0,0],'H-22',87],
 ['thermostat-gasket','thermostat-detail','Thermostat housing gasket','Separate thin flange gasket with a coolant opening and two bolt holes; outline is reconstructed.',[0,-.065,0],'H-22',86],
 ['thermostat-bolts','thermostat-detail','Thermostat housing bolts','Two mounting bolts and washers, grouped as a separate service set.',[.065,.025,0],'H-22',88],
 ['thermostat-element','thermostat-detail','Thermostat with pull handle','Fiero-style tall stamped handle, valve disc, spring, copper pellet capsule and sealing ring. The replaceable thermostat remains one service assembly.',[0,.17,0],'H-22',89],
 ['thermostat-cap','thermostat-detail','Thermostat housing cap','Shallow stamped locking cap with grip ears, folded locking tabs and underside seal. This is the engine filler cap, distinct from the front radiator cap.',[0,.29,0],'H-22',90],
 ['dipstick','dipstick-detail','Engine oil dipstick','Flat spring-steel blade and formed loop handle. Blade length and level marks are illustrative; do not use the model to calibrate oil level.',[.065,.18,.035],'H-19',40],
 ['dipstick-tube','dipstick-detail','Dipstick guide tube','Hollow bent guide tube with a flared mouth and attached mounting tab. Route is reconstructed from the lower-engine drawing.',[0,0,0],'H-19',42],
 ['dipstick-bolt','dipstick-detail','Dipstick tube attachment bolt','Separate guide-tube mounting fastener.',[.065,0,.07],'H-19',41],
 ['dipstick-seal','dipstick-detail','Dipstick tube seal','Separate rubber seal at the tube entry into the engine.',[-.06,-.055,0],'H-19',43],
 ['oil-pressure-sender','oil-pressure-detail','Oil-pressure sender / fuel-pump switch','Early large-body sender with metal base, molded shell and three terminal blades. 1985–87 application; not the smaller 1988 sender.',[0,.13,0],'H-22',79],
 ['oil-pressure-fitting','oil-pressure-detail','Oil-pressure pipe fitting · A/C','Adapter at the engine oil gallery for the A/C sender-pipe arrangement shown in GM H-22.',[.08,0,0],'H-22',77],
 ['oil-pressure-pipe','oil-pressure-detail','Oil-pressure sender pipe · A/C','Formed steel line, upper sender fitting and mounting ear for the A/C configuration. This is an option preview; its installation on this VIN is not established.',[0,0,0],'H-22',78],
 ['oil-pressure-bolt','oil-pressure-detail','Oil-pressure pipe mounting bolt','Mounting fastener for the sender-pipe support.',[-.06,.045,0],'H-22',82],
 ['oil-pump-drive','lubrication','Oil-pump intermediate drive shaft','Separate hexagonal drive shaft between the distributor drive and oil pump. Local engagement lengths remain approximate.',[.16,.10,0],'H-19',36],
 ['oil-filter-fitting','lubrication','Oil-filter threaded fitting','Hollow threaded attachment fitting between the block and spin-on oil filter.',[.12,0,-.16],'H-19',18],
 ['oil-filter-bypass','lubrication','Oil-filter bypass valve','Separate bypass-valve assembly at the filter mounting pad. Retainer, spring and valve represented together; calibration is not specified.',[.06,.035,-.13],'H-19',26],
 ['pan-rear-seal','lubrication','Oil-pan rear end seal · 1985–86','Separate molded semicircular rear seal shown for the early pan. The 1987–88 one-piece gasket and reinforcement are not used.',[.065,-.09,0],'H-19',44],
 ['pan-bolts','lubrication','Oil-pan flange bolt set','Flange fasteners grouped separately from the pan. Exact lengths and tightening order remain unverified.',[0,-.31,.08],'H-19',46],
 ['pan-drain-plug','lubrication','Oil-pan drain plug','Hex-head drain plug with threaded shank. Separate from the pan so the drain boss can be inspected.',[0,-.10,-.14],'H-19',null],
 ['front-crank-seal','timing','Front crankshaft oil seal','Steel-backed annular seal with rubber sealing lips in the front cover.',[-.43,-.075,0],'H-19',74],
 ['timing-cover-gasket','timing','Timing-cover gasket','Thin open gasket following the reconstructed timing-cover perimeter. Exact port and fastener profiles remain unverified.',[-.29,0,0],'H-19',77],
 ['timing-guide','timing','Timing-chain guide','Formed guide at the timing-chain run, with separate-looking wear surface and mounting ears. Local guide profile is approximate.',[-.18,0,.11],'H-19',79],
 ['timing-pointer','timing','Ignition timing pointer','Stamped pointer bracket beside the crank damper. Marks are illustrative and cannot be used to set ignition timing.',[-.49,.10,.075],'H-19',70],
 ['water-pump-gasket','water-pump-detail','Water-pump mounting gasket','Separate contoured gasket between pump and front cover. Follows the reconstructed flange rather than a fabrication template.',[.06,0,0],'H-19',73],
 ['water-pump-fitting','water-pump-detail','Water-pump heater-hose fitting · 1985–86','Threaded hose fitting at the pump, retained for the 1985–86 application in the GM catalog.',[0,.11,.065],'H-19',71],
 ['water-pump-bolts','water-pump-detail','Water-pump attachment bolt set','Separate hex-head fasteners at the pump flange. Shank lengths and complete mounting map remain approximate.',[-.095,0,0],'H-19',null],
 ['water-pulley-bolts','water-pump-detail','Water-pump pulley bolt set','Separate pulley-to-hub fasteners, grouped.',[-.24,0,0],'H-19',68],
];
export const engineServiceParts=rows.map(([key,section,name,description,spread,drawing,callout])=>({
 id:`eng-${key}`,section,system:'engine',name,description,spread,callout,
 location:section==='oil-pressure-detail'?'L44 engine · A/C sender-routing preview':'L44 engine service components',
 source:`GM 22P · ${drawing}`,sourceUrl:`${gm}#page=${drawing==='H-19'?14:17}`,
 aliases:`${key.replaceAll('-',' ')} service rebuild seals coolant oil lubrication`,
 referenceNote:section==='oil-pressure-detail'?'GM H-22 / H-24 shows the A/C pipe arrangement. This scope previews that arrangement independently of the vehicle options; non-A/C routing is not modeled. Dimensions are reconstructed.':'Factory callouts establish the component identity. Unspecified dimensions, finishes and attachment locations are reconstructed; this is not factory CAD.',
}));
engineServiceParts.find(p=>p.id==='eng-thermostat-element').serviceReference={
 title:'Thermostat references',
 rows:[['GM catalog nominal rating','195 °F (about 91 °C)'],['Replacement reference only','MotoRad 211-195'],['Replacement overall height','93.22 mm'],['Replacement seal diameter','43.69 mm']],
 note:'GM H-24 supplies the original application rating. MotoRad dimensions anchor the modeled replacement-style envelope; they do not establish the dimensions or identity of the factory-installed thermostat. The handle, spring and valve details are reconstructed.',
 links:[['GM 22P · H-24',`${gm}#page=19`],['Pontiac DIY · thermostat illustration',`${diy}#page=48`],['MotoRad · dimensional reference','https://motorad.com/part/211-195/']],
};
