// Sequence checked against original 1985 Pontiac DIY, printed 2-28–2-30.
// The native model highlights referenced hardware; it does not simulate removal.
const diy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf';
export const headlightReplacement={
 id:'headlight-replacement',title:'Replace a sealed headlamp',subtitle:'9 steps · 1985 factory sequence',system:'electrical',kind:'service',assembly:'headlight-left',
 tools:'T-15 Torx driver, Phillips screwdriver, pliers, 10-inch hooked stiff wire and protective rag.',
 caution:'Keep hands and clothing clear of powered headlamp mechanisms. The model highlights parts; it does not demonstrate removal clearances.',
 source:'1985 Pontiac DIY · printed 2-28–2-30',sourceUrl:diy+'#page=37',
 steps:[
  {title:'Raise the headlamps',text:'Open the front lid. Switch the headlights on to raise both assemblies. The driver lamp is illustrated.',part:'hl-left-upper-bezel',page:37},
  {title:'Deactivate this motor',text:'Disconnect its single-cavity black connector on the blue wire. Switch headlights off; this lamp must remain raised. Unplug the lamp socket.',part:'hl-left-motor-leads',page:37},
  {title:'Remove bezel fasteners',text:'Lower the lid without latching; remove both upper-corner bezel screws. Raise and secure the lid; remove both side screws.',part:'hl-left-bezel-screws',page:37},
  {title:'Lift off the outer bezel',text:'Hold the spring-loaded cover open. Lift the bezel upward, then rearward toward the cabin.',part:'hl-left-upper-bezel',page:38},
  {title:'Release the lamp carrier',text:'Lower the lid. Protect the finish with the rag. Unhook the lower-corner spring; turn the carrier counterclockwise off the adjusters. Leave aiming screws unchanged.',part:'hl-left-aim-spring',page:38},
  {title:'Change the sealed unit',text:'Remove four Phillips retainer screws. Separate the two-piece retainer and replace the sealed lamp; do not open its bonded envelope.',part:'hl-left-ring-screws',page:38},
  {title:'Reseat the aiming tabs',text:'Reassemble the retainer around the replacement. Refit with its tabs correctly seated in the aiming-screw slots.',part:'hl-left-mounting-ring',page:39},
  {title:'Refit spring and bezel',text:'Reconnect the spring. Refit bezel and side screws, then lower the lid and refit front screws. Factory bezel-screw torque: 8 N·m (6 lb·ft).',part:'hl-left-bezel-screws',page:39},
  {title:'Reconnect in factory order',text:'Open the lid; plug in the lamp, leaving blue disconnected. Switch headlights on, reconnect blue, then switch off. Confirm both retract; close the lid.',part:'hl-left-motor-leads',page:39},
 ].map(s=>({...s,system:'electrical',camera:'home',sourceUrl:diy+'#page='+s.page}))
};
