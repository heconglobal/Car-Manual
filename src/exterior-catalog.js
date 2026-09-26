// Visible exterior service pieces, shared by the car and Body explorer.
// Contours are reconstructed from owner photographs and the cited GM figures.
import {sunroofHardware} from './sunroof-catalog.js';
const entries=[];
function add(id,section,name,description,page=336,callout=null,extra={}){
 const s=id.includes('left')?1:id.includes('right')?-1:0;
 entries.push({id,section,name,description,page,callout,spread:[s*.16,.07,id.startsWith('front')?-.14:id.startsWith('rear')?.14:0],...extra});
}
for(const side of ['left','right']){
 const who=side==='left'?'Driver':'Passenger',door='body-door-'+side;
 add('mirror-'+side,door,who+' exterior mirror housing','Tapered, rounded shell with an open rear rim and separate glass, pedestal and mounting pad. Manual/electric internal adjusters remain unverified.',288);
 add('mirror-glass-'+side,door,who+' mirror glass & carrier','Separate recessed reflective glass/carrier inside the mirror rim. Convexity and original etched markings remain unmeasured.',288);
 add('mirror-mount-'+side,door,who+' mirror pedestal & pad','Formed pedestal, triangular door mounting foot and insulating pad.',288);
 add('handle-'+side,door,who+' outside door handle','Black lift handle aligned with the rub strip, with a formed finger recess immediately below.',300);
 add('door-lock-'+side,door,who+' door key cylinder bezel','Separate key opening and bright bezel below the rear end of the handle. Tumbler internals are not represented.',300);
 add('door-molding-'+side,door,who+' door rub molding','Ribbed belt-line protective molding; interrupted at the separately selectable handle.');
 add('belt-seal-'+side,door,who+' outer window belt seal','Separate outer belt molding and wiping lip along the door glass opening.',300);
 add('front-molding-'+side,'body-front-panels',who+' front fender moldings','Separate ribbed strips before and behind the wheel opening, stopping at the side marker.',237);
 add('rear-molding-'+side,'body-rear-panels',who+' quarter moldings','Separate ribbed strips following the quarter shoulder and stopping at the rear marker.');
 for(const end of ['front','rear'])add(end+'-pad-'+side,'body-'+end+'-panels',who+' '+end+' bumper pad','Raised molded pad with a closed rounded perimeter and a real inset opening. Shape follows the SE photographs; no impact-performance claim.',end==='front'?237:336);
 add('wiper-arm-'+side,'body-glazing',who+' wiper arm & pivot cap','Parked arm with separate pivot cap, shank and blade saddle. Full sweep, hidden transmission and spring calibration remain incomplete.',284);
 add('wiper-blade-'+side,'body-glazing',who+' wiper blade & refill','Nominal 18-inch blade envelope with curved refill and articulated support bows, separate from its arm.',284);
}
for(const end of ['front','rear']){
 add(end+'-fascia-molding','body-'+end+'-panels',end==='front'?'Front wraparound rub molding':'Rear wraparound rub molding','Continuous formed ribbed molding follows the fascia corners, separate from the painted fascia.',end==='front'?237:336);
 add(end+'-plate-mount','body-'+end+'-panels',end==='front'?'Front license-plate mounting recess':'Rear license-plate pocket & bracket','Separate central recessed pocket and mounting lands; no registration number is fabricated.',end==='front'?237:336);
}
add('fuel-door','body-rear-panels','Driver fuel filler door','Separate circular painted door seated in a real opening in the driver quarter panel.',336,6);
add('fuel-door-hinge','body-rear-panels','Fuel door hinge & pocket','Recessed pocket, hinge leaf/pin and latch tab behind the removable painted fuel door. Exact release mechanism remains incomplete.',336,9);
add('side-intake','body-rear-panels','Driver quarter air-intake grille','Framed recessed intake with open gaps between horizontal vanes, separate from the quarter skin.',336,12);
add('front-deflector','body-front-panels','Lower front air deflector','Formed flexible lower deflector following the underturned nose.',237,13);
add('nose-emblem','body-front-panels','Front Fiero crest','Small separately selectable shield-shaped nose emblem, authored as geometry. Original fine artwork remains incomplete.',237,47);
add('rear-emblems','body-rear-panels','Rear Pontiac & Fiero 2M6 emblems','Separate rear identification lettering, positioned from the owner photographs.');
add('antenna','body-front-panels','Passenger front-fender antenna','Slender mast, ferrule and oval mounting foot beside the passenger windshield corner. Mast length and hidden radio connection remain reconstructed.',281,1);
add('cowl-grille','body-glazing','Cowl intake grille & washer nozzles','Open slotted cowl trim and two washer nozzles below the parked blades. Under-cowl drains and hidden plumbing remain incomplete.',237,38);
add('sunroof-glass','body-roof','Removable sunroof glass','Separate curved removable glass panel. Shown only with the glass-roof preview.',330,4,{option:'roof',value:'glass'});
add('sunroof-seal','body-roof','Sunroof aperture seal','Continuous stepped seal bed and contact lip around the glass/removed roof aperture. Production seal profile and water-management details remain unmeasured.',330,10,{option:'roof',values:['glass','removed']});
add('deck-carrier','body-decklid','V56 luggage carrier & integral spoiler','Longitudinal deck strips and raised rear carrier spoiler; option preview does not establish original equipment.',332,null,{option:'deck',value:'rack'});
add('deck-wing','body-decklid','Pedestal rear wing','Separate curved wing, pedestals and mounting pads. Preview only; original hole pattern and required torque rods remain unverified.',309,null,{option:'deck',value:'wing',sourceUrl:'https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=309'});
// Illustrative separation vectors; service removal paths are not inferred.
// Shell, glass and mounting foot must not share one offset and stay stacked.
for(const p of entries){
 const s=p.id.endsWith('left')?1:-1;
 for(const [prefix,offset]of [['mirror-glass-', [.46,.12,.16]],['mirror-mount-', [.25,.03,-.03]],['mirror-', [.36,.10,-.05]],['handle-', [.20,.02,.03]],['door-lock-', [.26,-.08,.05]],['door-molding-', [.16,-.025,0]],['belt-seal-', [.10,.20,0]],['wiper-arm-', [.03,.15,0]],['wiper-blade-', [.04,.29,0]]])if(p.id.startsWith(prefix)){p.spread=[s*offset[0],offset[1],offset[2]];break;}
 if(p.id.startsWith('front-pad-'))p.spread=[s*.08,-.08,-.34];
 if(p.id.startsWith('rear-pad-'))p.spread=[s*.08,-.08,.34];
 const special={'fuel-door':[.34,.08,0],'fuel-door-hinge':[.20,0,0],'side-intake':[.30,-.04,0],antenna:[0,.30,0],'sunroof-glass':[0,.38,0],'sunroof-seal':[0,.18,0],'deck-carrier':[0,.34,.10],'deck-wing':[0,.44,.20]};
 if(special[p.id])p.spread=special[p.id];
}
export const exteriorParts=[...entries,...sunroofHardware];
