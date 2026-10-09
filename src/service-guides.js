// Sequence checked against original 1985 Pontiac DIY, printed 2-28–2-30.
// The native model highlights referenced hardware; it does not simulate removal.
const diy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf';
export const headlightReplacement={
 id:'headlight-replacement',title:'Replace a sealed headlamp',subtitle:'9 steps · 1985 factory sequence',system:'electrical',kind:'service',assembly:'headlight-left',configuration:{headlights:true},
 tools:'T-15 Torx driver, Phillips screwdriver, pliers, 10-inch hooked stiff wire and protective rag.',
 caution:'Keep hands and clothing clear of powered headlamp mechanisms. The model highlights parts; it does not demonstrate removal clearances.',
 source:'1985 Pontiac DIY · printed 2-28–2-30',sourceUrl:diy+'#page=37',
 steps:[
  {title:'Raise the headlamps',text:'Open the front lid. Switch the headlights on to raise both assemblies. The driver lamp is illustrated.',part:'hl-left-upper-bezel',page:37},
  {title:'Deactivate this motor',text:'Disconnect its single-cavity black connector on the blue wire. Switch headlights off; this lamp must remain raised. Unplug the lamp socket.',part:'hl-left-disconnect',page:37},
  {title:'Remove bezel fasteners',text:'Lower the lid without latching; remove both upper-corner bezel screws. Raise and secure the lid; remove both side screws.',part:'hl-left-bezel-screws',page:37},
  {title:'Lift off the outer bezel',text:'Hold the spring-loaded cover open. Lift the bezel upward, then rearward toward the cabin.',part:'hl-left-upper-bezel',page:38},
  {title:'Release the lamp carrier',text:'Lower the lid. Protect the finish with the rag. Unhook the lower-corner spring; turn the carrier counterclockwise off the adjusters. Leave aiming screws unchanged.',part:'hl-left-aim-spring',page:38},
  {title:'Change the sealed unit',text:'Remove four Phillips retainer screws. Separate the two-piece retainer and replace the sealed lamp; do not open its bonded envelope.',part:'hl-left-ring-screws',page:38},
  {title:'Reseat the aiming tabs',text:'Reassemble the retainer around the replacement. Refit with its tabs correctly seated in the aiming-screw slots.',part:'hl-left-mounting-ring',page:39},
  {title:'Refit spring and bezel',text:'Reconnect the spring. Refit bezel and side screws, then lower the lid and refit front screws. Factory bezel-screw torque: 8 N·m (6 lb·ft).',part:'hl-left-bezel-screws',page:39},
  {title:'Reconnect in factory order',text:'Open the lid; plug in the lamp, leaving blue disconnected. Switch headlights on, reconnect blue, then switch off. Confirm both retract; close the lid.',part:'hl-left-disconnect',page:39},
 ].map(s=>({...s,system:'electrical',camera:'home',sourceUrl:diy+'#page='+s.page}))
};

// All twenty numbered steps are retained, including the water flush and
// recovery-bottle cleaning. A change of assembly follows the actual part ID.
// This is a source-checked walkthrough, pending physical workshop validation.
export const coolantReplacement={
 id:'coolant-replacement',title:'Replace engine coolant',subtitle:'20 steps · 1985 factory sequence',system:'cooling',kind:'service',assembly:'thermostat-detail',
 tools:'Ratchet, extension, 15 mm socket and 3/16-inch Allen wrench (factory list); suitable drain containers, water and the specified coolant mixture.',
 caution:'Let the engine and radiator cool before opening any cap. Keep clear of the automatic electric fan and avoid coolant on hot engine or exhaust parts. Monitor temperature during each engine-running stage; stop if it overheats. The model does not demonstrate safe underbody access or removal paths. Optional engine-block drain plugs are not yet separately modeled.',
 source:'1985 Pontiac DIY · printed 2-38–2-40',sourceUrl:diy+'#page=47',
 steps:[
  {title:'Start with a cool engine',text:'Open the rear compartment after the engine has cooled. On the V6, the thermostat filler housing is at the upper passenger-side end of the engine. Locate the housing cap, separate from the front radiator pressure cap.',part:'eng-thermostat-housing',page:47},
  {title:'Turn the housing cap to its stop',text:'Slowly turn the thermostat housing cap counterclockwise to the first stop. Do not push down at this stage.',part:'eng-thermostat-cap',page:47},
  {title:'Release remaining pressure',text:'Wait until any hissing has stopped and remaining pressure is relieved. Only then press down and continue turning counterclockwise to remove the thermostat housing cap.',part:'eng-thermostat-cap',page:47},
  {title:'Remove the thermostat',text:'Pull the thermostat straight out using its handle. Keep it out through the flush and initial filling stages; reinstall it at step 19.',part:'eng-thermostat-element',page:47},
  {title:'Circulate the old coolant',text:'Refit the thermostat housing cap, leaving the thermostat out. Run the engine for one minute to circulate coolant.',part:'eng-thermostat-cap',page:48},
  {title:'Drain the old coolant',text:'Stop the engine. Collect coolant from the radiator drain valve at the lower passenger-side corner. The factory sequence also permits removing both underbody pipe plugs and engine-block drain plugs to speed draining. Each pipe plug is just ahead of a rear wheel; block plugs are not separately modeled. Let the system cool before opening caps.',part:'cool-drain',page:48},
  {title:'Flush through the filler housing',text:'With the engine off and cool, release and remove the housing cap as in steps 2–3. Run water through the open thermostat housing until the liquid leaving the drains is nearly colorless.',part:'eng-thermostat-housing',page:48},
  {title:'Close the drains for the water fill',text:'Refit any engine-block and underbody pipe plugs removed in step 6, and close the radiator drain valve. The selected set contains the left and right underbody pipe plugs.',part:'cool-pipe-drains',page:48},
  {title:'Fill with water to the radiator neck',text:'With the system cool, remove the front radiator pressure cap. Add water through the rear thermostat housing until it reaches the front radiator neck.',part:'cool-pressure-cap',page:48},
  {title:'Cap the system with the thermostat out',text:'Refit the radiator and thermostat housing caps. Leave the thermostat out. Turn the housing cap to the first notch: it clicks and cannot be turned counterclockwise without pressing down.',part:'eng-thermostat-cap',page:48},
  {title:'Warm the flush water, then drain',text:'Run the engine until the hose at the thermostat housing becomes hot, watching the temperature gauge. Stop the engine and drain again as in step 6. Keep all caps closed while hot; allow cooling before subsequent cap removal.',part:'cool-rear-inlet',page:48},
  {title:'Refit drains for the coolant fill',text:'Close the radiator drain valve tightly. Refit any removed block and pipe plugs. Fully seat the block plugs; tighten only the underbody coolant-pipe plugs to 12 N·m (8 lb·ft). This value does not apply to the radiator valve or block plugs.',part:'cool-pipe-drains',page:49},
  {title:'Clean the recovery bottle',text:'Disconnect the recovery-bottle hoses, remove the bottle and collect its contents. Clean its inside with soap and water, rinse thoroughly and drain. Reinstall the bottle and reconnect its hoses.',part:'cool-recovery-tank',page:49},
  {title:'Fill with the coolant mixture',text:'With the engine off and cool, remove the radiator cap and release the thermostat housing cap as in steps 2–3. Add coolant through the housing until it reaches the radiator-neck spill point. The 1985 publication specifies ethylene-glycol antifreeze meeting GM 1825-M, mixed with water: at least 50% and no more than 70% antifreeze. This is the historical factory specification, not a current brand recommendation. Do not use alcohol, methanol antifreeze or plain water alone.',part:'eng-thermostat-housing',page:49},
  {title:'Refit both caps for the initial purge',text:'Refit the radiator and thermostat housing caps, still without the thermostat. Turn the housing cap to the first notch until it clicks and requires downward pressure to turn back.',part:'eng-thermostat-cap',page:49},
  {title:'Fill the recovery bottle',text:'The factory sequence specifies adding 3 liters (3.2 quarts) of coolant to the recovery reservoir at this stage. Use the same coolant mixture. The reconstructed bottle and its markings are not a calibrated measuring container.',part:'cool-recovery-tank',page:49},
  {title:'Run the timed purge',text:'Run the engine at normal idle for 3 minutes, then at fast idle for another 15–20 seconds. Monitor coolant temperature throughout. Stop the engine.',part:'eng-thermostat-housing',page:49},
  {title:'Top up the housing after cooling',text:'Allow the engine and radiator to cool before opening the housing cap. Release pressure as in steps 2–3, remove the cap and add coolant until it reaches the housing cap seat.',part:'eng-thermostat-housing',page:49},
  {title:'Reinstall the thermostat and cap',text:'Seat the thermostat fully in the housing. Refit the cap with its arrows aligned with the coolant hose at the housing. The 3D view identifies the pieces; it does not certify seating force or the original cap markings.',part:'eng-thermostat-element',page:49},
  {title:'Check after a full heat-and-cool cycle',text:'After a complete warm-up and cool-down cycle, adjust the recovery-bottle level between its Add and Full marks. Use the physical bottle markings; the model is not a level gauge. Recheck the system for leaks and abnormal temperature before considering service complete.',part:'cool-recovery-tank',page:49},
 ].map((s,i)=>({...s,factoryStep:i+1,system:s.part.startsWith('eng-')?'engine':'cooling',assembly:s.part.startsWith('eng-')?'thermostat-detail':s.part==='cool-pipe-drains'||s.part==='cool-rear-inlet'?'cool-pipes':s.part==='cool-drain'?'cool-radiator':'cool-recovery',camera:'home',sourceUrl:diy+'#page='+s.page}))
};

// Each added guide was compared with the rendered original 1985 pages recorded
// in references/service-source-review-20261001. PDF page numbers are 1-based.
// A model selection locates the component; it does not prove real access,
// installed part identity, tool clearance or workshop validation.
const parked='Park on level ground, apply the parking brake and secure the vehicle against rolling. Wear eye protection. For a step requiring engine operation, select Neutral before starting and run only in a ventilated place; stop the engine before reaching into the work area. Never work beneath a car supported only by its jack; use suitable safety stands when underbody access is needed.';
const guide=({id,title,system,assembly=null,pages,tools,caution,applicability='1985 Fiero SE with the L44 2.8L V6 and original four-speed manual transaxle.',steps,...rest})=>({
 id,title,subtitle:`${steps.length} steps · 1985 factory reference`,system,assembly,kind:'service',tools,caution,applicability,
 prerequisites:parked,validation:{sourceChecked:true,workshopValidated:false},
 source:`1985 Pontiac DIY · printed ${pages}`,sourceUrl:diy+'#page='+steps[0].page,
 ...rest,steps:steps.map(s=>({system,assembly,camera:'home',...s,sourceUrl:s.sourceUrl||diy+'#page='+s.page})),
});

export const engineOilCheck=guide({
 id:'engine-oil-check',title:'Check and add engine oil',system:'engine',pages:'2-6–2-7',
 tools:'Clean lint-free cloth and a clean oil spout or funnel.',
 caution:'Stop the engine before reaching into the engine bay. Use the physical dipstick markings; the reconstructed blade is not a calibrated level gauge. Do not overfill. Select oil quality and viscosity from the applicable owner manual and installed-engine requirements.',
 steps:[
  {title:'Let the oil settle',text:'Park level and stop the warm engine. Wait several minutes for oil to return to the pan. If checking a cold engine, do not briefly start it first; cold oil may not drain back quickly enough for an accurate reading.',part:'eng-dipstick',assembly:'dipstick-detail',page:15},
  {title:'Clean and fully seat the dipstick',text:'Withdraw the dipstick, wipe it clean and reinsert it all the way. Its upper seal must be fully seated before taking the reading.',part:'eng-dipstick',assembly:'dipstick-detail',page:15},
  {title:'Read the actual marks',text:'Withdraw the dipstick again. Compare the oil level with its operating-range marks. Reinsert it fully after reading. The model identifies the dipstick; it cannot measure fluid level.',part:'eng-dipstick',assembly:'dipstick-detail',page:16},
  {title:'Add only the amount needed',text:'If necessary, remove the oil-fill cap on the V6 valve cover and add suitable engine oil in small amounts. Let it settle and repeat the dipstick check; avoid filling above the Full mark. The cap is included in the selected valve-cover assembly.',part:'eng-rear-cover',assembly:'head-rear',page:15},
  {title:'Close the filler and recheck',text:'Refit the oil-fill cap and fully seat the dipstick. Clear the work area before closing the rear lid. Investigate repeated low readings rather than treating repeated topping-up as a repair.',part:'eng-dipstick',assembly:'dipstick-detail',page:15},
 ]
});

export const engineOilReplacement=guide({
 id:'engine-oil-replacement',title:'Replace engine oil and filter',system:'engine',pages:'2-7–2-8; 3-4',assembly:'lubrication',
 tools:'15 mm nut driver, 7 mm nut driver for the V6 heat shield, cup-type oil-filter wrench, drain pan, clean cloth, suitable replacement filter and engine oil.',
 caution:parked+' Warm oil and nearby exhaust parts can burn. The V6 filter heat shield is described in the instructions but is not separately modeled. No numerical drain-plug torque is specified by these DIY pages; do not invent one.',
 steps:[
  {title:'Prepare for draining',text:'Warm the oil; the factory suggests running a completely cold engine for five minutes. Stop the engine. Establish safe underbody access and place a suitable drain pan beneath the oil-pan drain plug.',part:'eng-pan-drain-plug',page:16},
  {title:'Drain and inspect the old oil',text:'Remove the drain plug and collect the oil. Check the drained oil for metal particles or other abnormal debris; investigate these findings before treating the oil change as complete.',part:'eng-pan-drain-plug',page:17},
  {title:'Open access to the V6 filter',text:'If the V6 heat shield prevents filter access, remove its two bolts and the shield. It is not a separate model selection; the highlighted filter shows the service location.',part:'eng-oil-filter',page:17},
  {title:'Remove the old filter and seal',text:'Move the drain pan under the filter. Unscrew the filter and make sure its old sealing gasket comes off with it. Allow at least five more minutes for the remaining oil to drain.',part:'eng-oil-filter',page:17},
  {title:'Clean the mounting face',text:'Wipe the filter-bracket recess and sealing face with a clean shop towel. Confirm that no old gasket remains. Lightly coat the new filter gasket with clean engine oil.',part:'eng-oil-filter-fitting',page:17},
  {title:'Fit the replacement filter',text:'Screw the new filter on by hand until its gasket is snug. The 1985 sequence specifies a further half-turn by hand, or the filter manufacturer’s installation instruction. Reinstall the V6 heat shield if removed.',part:'eng-oil-filter',page:17},
  {title:'Refit the drain plug',text:'Clean the plug and drain opening with a clean cloth. Reinstall the plug and tighten it securely. The source says snugly and supplies no numerical torque; obtain the specification for the actual pan and plug if a torque value is required.',part:'eng-pan-drain-plug',page:17},
  {title:'Refill at the valve cover',text:'Refill through the oil-fill opening and replace the cap. The original V6 capacity table gives approximately 3.8 liters (4.0 US quarts), with or without a filter change. Use the dipstick to establish the actual level; the listed capacity is not an instruction to overfill.',part:'eng-rear-cover',assembly:'head-rear',page:61},
  {title:'Run, stop and check',text:'Run the engine for five minutes, watching for oil leakage at the drain plug and filter. Stop it, allow drainback and check the dipstick on level ground. Correct the level and repair any leak before normal operation.',part:'eng-dipstick',assembly:'dipstick-detail',page:17},
 ]
});

export const airFilterReplacement=guide({
 id:'air-filter-replacement',title:'Replace the V6 air filter',system:'engine',pages:'2-15–2-16',
 tools:'10 mm nut driver, clean cloth and the correct replacement filter.',
 caution:'Keep the engine off with the air cleaner open. The air-cleaner assembly also limits flame escape during a backfire. Do not allow dirt or foreign objects into the intake. The crankcase-separator steps on these pages apply to the four-cylinder engine, not this V6.',
 steps:[
  {title:'Locate the V6 housing',text:'Open the rear compartment and find the air cleaner at the driver-side end. Confirm that the replacement element matches the installed housing before opening the intake.',part:'air-cleaner',page:25},
  {title:'Lift off the cover',text:'Remove the air-cleaner cover retaining nuts with the 10 mm driver, retain the hardware and lift off the cover. The model groups the cover hardware with the cover.',part:'air-lid',page:24},
  {title:'Remove the filter element',text:'Lift the old element out. The following crankcase-separator operations in the printed manual are marked L4 only; leave those out of this L44 V6 procedure.',part:'air-filter',page:24},
  {title:'Clean the housing',text:'Remove loose dirt and foreign material from inside the housing. Keep all debris out of the throttle body and intake connection.',part:'air-cleaner',page:25},
  {title:'Seat the new element',text:'Install the replacement element squarely in the housing. The factory text permits either side of the original-style filter upward. Follow any orientation markings on a different replacement element.',part:'air-filter',page:25},
  {title:'Refit and secure the cover',text:'Refit the cover and retaining nuts. The factory cover-nut specification is 6 N·m (4 lb·ft). Check that the cover is seated and that the intake remains closed before starting the engine.',part:'air-lid',page:25},
 ]
});

export const manualFluidCheck=guide({
 id:'manual-fluid-check',title:'Check four-speed transaxle fluid',system:'drivetrain',assembly:'trans-case',pages:'2-10',
 tools:'Clean funnel, 12-inch rubber tube to fit the funnel, oil spout and the tools appropriate to the installed speed-sensor retainer.',
 caution:'Engine off; vehicle level; transaxle cool enough to touch. Remove the speedometer fitting carefully. The physical fitting provides the level marks; the 3D part is not a calibrated dipstick. The lubricant specification quoted here is historical, not a current replacement-product recommendation.',
 steps:[
  {title:'Let the transaxle cool',text:'Stop the engine and place the vehicle level. Wait until the transaxle case is cool enough to rest your fingers on it before checking the fluid.',part:'tx-case',page:19},
  {title:'Remove the speedometer fitting carefully',text:'Locate the speedometer fitting above the axle shaft on the driver side of the transaxle. Release its retainer and carefully withdraw the fitting used for the level check; keep dirt and loose parts out of the opening.',part:'tx-speed-sensor',page:19},
  {title:'Check the L and H marks',text:'The fluid should be between the L and H marks on the actual fitting. Do not substitute the modeled sensor or its apparent height for those physical markings.',part:'tx-speed-sensor',page:19},
  {title:'Add fluid only if needed',text:'Use a funnel and extension tube if filling is necessary. The 1985 publication specifies SAE 5W-30 engine oil of the then-current SF, SF/CC or SF/CD category, added to the L mark. Confirm an appropriate present-day lubricant for the installed transaxle before service.',part:'tx-speed-sensor',page:19},
  {title:'Reseat the fitting',text:'Refit the speedometer fitting fully and secure its retainer. Confirm the opening is sealed and the fitting is seated. Investigate leakage or repeated low readings before normal operation.',part:'tx-speed-retainer',page:19},
 ]
});

export const manualFluidReplacement=guide({
 id:'manual-fluid-replacement',title:'Replace four-speed transaxle fluid',system:'drivetrain',assembly:'trans-case',pages:'2-10; 2-12; 3-4',
 tools:'13 mm nut driver, 15 mm wrench, drain pan, funnel, 12-inch rubber tube for the funnel and suitable lubricant.',
 caution:parked+' Drain warm fluid carefully. Final level checking requires the engine off and the case cool enough to touch. The DIY source gives no numerical drain-plug torque. Its SAE 5W-30 SF/SF-CC/SF-CD oil designation is historical; confirm present-day lubricant applicability.',
 steps:[
  {title:'Prepare the vehicle',text:'The factory calls for changing fluid warm and suggests five minutes of engine operation if completely cold. Stop the engine. Establish safe underbody access, then locate the drain plug near the driver-side rear of the transaxle.',part:'tx-drain',page:21},
  {title:'Drain into a container',text:'Place a suitable container beneath the drain. Remove the plug with the 13 mm driver and allow the fluid to drain out.',part:'tx-drain',page:21},
  {title:'Refit the drain plug',text:'Reinstall the plug and tighten it snugly. This DIY page supplies no numerical torque; use the applicable full service specification if one is required for the installed plug.',part:'tx-drain',page:21},
  {title:'Refill the four-speed',text:'Add suitable lubricant through the speedometer-fitting opening. The original four-speed capacity is approximately 2.8 liters (5.9 US pints); the five-speed capacity on the same page does not apply. Use the final level check rather than the listed capacity alone.',part:'tx-speed-sensor',page:61},
  {title:'Check the physical level marks',text:'With the engine off, vehicle level and case cool enough to touch, check the fitting’s L and H marks. The 1985 check procedure calls for adding oil to L if low; do not overfill.',part:'tx-speed-sensor',page:19},
  {title:'Secure the fitting and inspect for leaks',text:'Fully reseat the speedometer fitting and secure its retainer. Check the drain plug for leakage. Restore safe vehicle support and clear the work area before normal operation.',part:'tx-speed-retainer',page:21},
 ]
});

export const brakeFluidCheck=guide({
 id:'brake-fluid-check',title:'Check brake-fluid reservoir',system:'brakes',assembly:'brake-master',pages:'2-13',
 tools:'No hand tools; clean lint-free cloth and fresh DOT 3 brake fluid if required.',
 caution:'Do not press the brake pedal with the reservoir cover removed. Protect eyes, skin and painted surfaces from brake fluid. Low fluid or a brake warning requires inspection for leakage and brake wear; topping up is not a brake-system repair. This guide does not cover bleeding or hydraulic repairs.',
 steps:[
  {title:'Locate both reservoir chambers',text:'Open the front compartment. Find the brake master-cylinder reservoir on the driver side. View the level through the reservoir wall; both chambers must remain above their MIN lines.',part:'br-master-reservoir',page:22},
  {title:'Clean before opening',text:'If adding fluid is necessary, clean the cover and surrounding area so contamination cannot enter. Keep the brake pedal untouched while the cover is off.',part:'br-master-cover',page:22},
  {title:'Release the cover',text:'Grasp the retaining tabs at the sides of the cover and lift it from the reservoir. Keep the cover and diaphragm clean.',part:'br-master-cover',page:22},
  {title:'Add the specified fluid',text:'Add only the amount required, using DOT 3 brake fluid. The factory names Delco Supreme No. 11 or another DOT 3 fluid; the historical brand name does not establish a currently supplied product.',part:'br-master-reservoir',page:22},
  {title:'Reset the diaphragm and close',text:'Carefully compress the rubber diaphragm inside the cover, then snap the cover fully into place. Confirm it is secured. Resolve abnormal fluid loss or braking symptoms before driving.',part:'br-master-diaphragm',page:22},
 ]
});

export const clutchFluidCheck=guide({
 id:'clutch-fluid-check',title:'Check clutch-fluid reservoir',system:'drivetrain',pages:'2-14',
 tools:'No hand tools; clean lint-free cloth and fresh DOT 3 brake fluid if required.',
 caution:'Do not press the clutch pedal with its reservoir cover removed. Protect eyes, skin and paint from brake fluid. The master, reservoir and cap remain grouped in the vehicle model. This level check does not diagnose a failing clutch or replace a hydraulic bleeding procedure.',
 steps:[
  {title:'Find the clutch reservoir',text:'Open the front compartment. Locate the clutch master cylinder on the driver side, separate from the larger brake reservoir. The model highlights the combined clutch-hydraulics assembly.',part:'clutch-hydraulics',page:23},
  {title:'Read the level through the wall',text:'Check that the fluid is between the ADD and FULL markings on the physical clutch-fluid reservoir. Its reconstructed model has no calibrated capacity or level marks.',part:'clutch-hydraulics',page:23},
  {title:'Clean and remove the cap',text:'Only if adding fluid is needed, clean the cap and its surrounding area. Unscrew and remove the cap, preventing contamination from entering the reservoir.',part:'clutch-hydraulics',page:23},
  {title:'Add fluid and close',text:'Add DOT 3 brake fluid as needed, then screw the cover fully back into place. The original publication names Delco Supreme No. 11 or another DOT 3 fluid. Investigate repeated low levels, leakage or poor clutch operation before driving.',part:'clutch-hydraulics',page:23},
 ]
});

export const sparkPlugReplacement=guide({
 id:'spark-plug-replacement',title:'Replace the V6 spark plugs',system:'electrical',assembly:'plug-wires',pages:'2-21–2-23; 3-3',
 tools:'5/8-inch deep spark-plug socket, ratchet, universal/flex socket, 8-inch extension, spark-plug gap tool and torque wrench covering 15 N·m. A boot tool may help; do not use pliers on the boot.',
 caution:'Work with the engine stopped and cool. Replace one plug at a time to preserve wire order. Pull the boot, never the wire. The model’s lead routing and distributor clocking are reconstructed, not a wiring installation diagram. The original R42CTS listing is a period reference; verify current replacement applicability.',
 steps:[
  {title:'Work on one plug at a time',text:'Identify the six V6 plugs on both banks. Keep each lead associated with its original cylinder by completing one plug before moving on. The selected trunk-side plug is cylinder 1.',part:'eng-spark-rear-1',page:30},
  {title:'Remove the boot without pulling the wire',text:'Grip the boot and pull it off the plug. If stuck, twist the boot slightly to release it. Do not pull on the cable, bend it sharply or use pliers; hidden damage can cause misfire.',part:'eng-wire-rear-1',page:31},
  {title:'Inspect the lead and terminals',text:'Wipe the lead clean and check for brittle or cracked insulation, damaged boots and broken or distorted terminals. Replace a defective lead; reconnect it in its original position.',part:'eng-wire-rear-1',page:31},
  {title:'Unscrew the old plug',text:'Use the 5/8-inch deep socket and suitable flex/extension arrangement to turn the plug counterclockwise. The modeled exploded view does not certify socket clearance around the installed engine.',part:'eng-spark-rear-1',page:31},
  {title:'Set the V6 gap',text:'Check the correct replacement plug and set its gap to the original V6 specification of 1.1 mm (0.045 inch). The 1.5 mm illustration on the next printed page is for the four-cylinder engine and must not be substituted.',part:'eng-spark-rear-1',page:31},
  {title:'Start by hand, then torque',text:'Thread the replacement plug in by hand until correctly seated to avoid cross-threading. Tighten it to the factory specification of 15 N·m (11 lb·ft).',part:'eng-spark-rear-1',page:31},
  {title:'Reconnect and repeat',text:'Refit that plug wire, then repeat the same sequence for the other five plugs. The four-cylinder air-cleaner refitting step in the source does not apply to this V6.',part:'eng-wire-separators',page:32},
  {title:'Check all connections',text:'Confirm all six boots are seated, each wire remains on its original cylinder and all tools are clear. Start the engine and check for misfire; stop and correct any fault before normal operation.',part:'eng-wire-separators',page:32},
 ]
});

export const batteryReplacement=guide({
 id:'battery-replacement',title:'Replace the side-terminal battery',system:'electrical',assembly:'charging-battery',pages:'2-30–2-32',
 tools:'7 mm nut driver, 8 mm and 13 mm wrenches, suitable torque wrench and eye protection.',
 caution:'Turn the ignition off and remove the key. Batteries contain corrosive acid and can emit explosive gas. Keep sparks/flames away, protect eyes and skin, and never bridge terminals with metal. Remove negative first; reconnect positive first. The physical tray, cables and replacement battery must be serviceable and correctly sized.',
 steps:[
  {title:'Open battery access',text:'Open the rear compartment. Remove the two thumb screws securing the battery access cover and lift it away. The highlighted passenger-side grille marks this access area.',part:'bd-skin-deck-vent-right',assembly:'body-decklid',system:'body',page:40},
  {title:'Disconnect negative first',text:'Remove the negative cable from the terminal marked minus. Keep the disconnected cable clear of the battery while working.',part:'ch-negative-cable',page:40},
  {title:'Disconnect positive',text:'Remove the positive cable from the terminal marked plus. Avoid touching the positive terminal and grounded metal with a tool.',part:'ch-positive-cable',page:40},
  {title:'Release the hold-down',text:'Unscrew the battery-retainer bolt and remove the retainer. Keep the bolt and retainer for refitting.',part:'ch-battery-retainer-bolt',page:40},
  {title:'Move the heat shield',text:'Loosen the heat-shield retaining bolts and move the shield out of the way. Carefully lift the battery out without tipping it.',part:'ch-battery-heat-shield',page:40},
  {title:'Check the replacement and supports',text:'Inspect cables and terminals for damage and corrosion before fitting the replacement. Verify the correct battery and serviceable tray, shield and hold-down; the VIN alone does not establish the original battery rating.',part:'ch-battery-tray',page:40},
  {title:'Secure the new battery',text:'Place the battery correctly in the tray. Install the retainer and tighten its bolt to 18 N·m (14 lb·ft), as specified in the original publication.',part:'ch-battery-retainer-bolt',page:40},
  {title:'Refit the heat shield',text:'Return the heat shield to position and secure its bolts. Check that the shield and cables sit clear of moving or hot components.',part:'ch-battery-shield-screws',page:40},
  {title:'Reconnect positive first',text:'Attach the positive cable before the negative cable. The original side-terminal cable-bolt torque is 12 N·m (9 lb·ft). Confirm compatibility with the installed replacement terminal hardware.',part:'ch-positive-cable',page:40},
  {title:'Reconnect negative and close access',text:'Attach the negative cable and tighten the side-terminal bolt to the applicable specification. Reinstall the access cover and its two thumb screws. Check that the battery is secure and clear all tools before operating the vehicle.',part:'ch-negative-cable',page:41},
 ]
});

export const wiperBladeReplacement=guide({
 id:'wiper-blade-replacement',title:'Replace a wiper blade',system:'body',assembly:'body-glazing',pages:'2-44–2-45',
 applicability:'1985 Fiero with the original pin-mounted wiper arms and matching replacement blades.',
 tools:'No hand tools; soft cloth to protect the windshield and a blade matching the original length and attachment.',
 caution:'Remove the ignition key before touching the blades. Support the spring-loaded arm throughout; do not let it snap against the windshield. The model identifies the parked components and does not animate a service position or prove compatibility with an aftermarket arm.',
 steps:[
  {title:'Stop the blades upright',text:'With the key off, select wipers on. Briefly turn the key on and switch it off as the blades reach the upright service position. Remove the key so the blades cannot move while being handled.',part:'bd-skin-wiper-blade-left',page:53},
  {title:'Lift and support the blade',text:'Lift the blade away from the glass by hand and keep the arm supported. Find the release lever near the middle of the original-style blade.',part:'bd-skin-wiper-blade-left',page:53},
  {title:'Release the blade from the pin',text:'Press the release lever while supporting the arm. Pull the blade straight off its mounting pin. This original connection is not a modern hook-arm fitting.',part:'bd-skin-wiper-arm-left',page:54},
  {title:'Protect the glass',text:'If the bare arm must be set down, protect the windshield with a soft cloth and lower the arm gently. Never release it to spring against the glass.',part:'bd-skin-wiper-arm-left',page:54},
  {title:'Engage the replacement',text:'Position the arm pin in the matching hole in the new blade. Press the blade into place until the pin is engaged. Confirm secure retention before lowering it gently to the glass.',part:'bd-skin-wiper-blade-left',page:54},
  {title:'Check both blades',text:'Repeat on the opposite side if required. Clear hands and cloths, then check that both blades remain attached and wipe and park correctly. Follow the replacement manufacturer’s directions if its locking design differs.',part:'bd-skin-wiper-blade-right',page:54},
 ]
});

export const wiperRefillReplacement=guide({
 id:'wiper-refill-replacement',title:'Replace a wiper rubber refill',system:'body',assembly:'body-glazing',pages:'2-44–2-46',
 applicability:'Original-style 1985 Fiero serviceable blade with a replaceable rubber element; does not apply to sealed replacement blades.',
 tools:'Flat screwdriver, equal-length matching refill and a soft windshield-protection cloth.',
 caution:'Remove the key and support the wiper arm. Follow the blade-removal procedure before working on the refill. The model groups the rubber with the blade and does not verify an aftermarket refill’s fit.',
 steps:[
  {title:'Remove the blade assembly',text:'Use the wiper-blade guide to stop the blades upright, remove the key, support the arm and release the blade from its pin. Protect the windshield if lowering the bare arm.',part:'bd-skin-wiper-blade-left',page:54},
  {title:'Release the old rubber',text:'On the removed original-style blade, insert a flat screwdriver between the rubber element and its plastic housing. Rotate the screwdriver while pulling the element until it releases.',part:'bd-skin-wiper-blade-left',page:55},
  {title:'Withdraw the old element',text:'Pull the old rubber element out completely. Match the replacement to its length and housing profile before installing it.',part:'bd-skin-wiper-blade-left',page:55},
  {title:'Slide in the new refill',text:'Feed the replacement through the housing from one end. Continue until the element is fully seated along the entire blade.',part:'bd-skin-wiper-blade-left',page:55},
  {title:'Refit and verify retention',text:'Refit the blade to the arm pin and confirm it is engaged. Lower it gently to the glass. Clear the work area and check wiping and parking before normal operation.',part:'bd-skin-wiper-blade-left',page:55},
 ]
});

export const additionalServiceGuides=[engineOilCheck,engineOilReplacement,airFilterReplacement,manualFluidCheck,manualFluidReplacement,brakeFluidCheck,clutchFluidCheck,sparkPlugReplacement,batteryReplacement,wiperBladeReplacement,wiperRefillReplacement];
export const serviceGuides=[headlightReplacement,coolantReplacement,...additionalServiceGuides];
for(const service of [headlightReplacement,coolantReplacement]){
 service.prerequisites=parked;
 service.applicability='1985 Fiero SE with the L44 2.8L V6; confirm the installed parts still match the original equipment.';
 service.validation={sourceChecked:true,workshopValidated:false};
}
