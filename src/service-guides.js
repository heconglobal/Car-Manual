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
