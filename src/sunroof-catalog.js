// GM 22P CD PDF 330 illustration / 331 AD3 application table.
// Dimensions and mechanism positions are reconstructed, not production data.
export const sunroofHardware=[];
function add(key,name,description,callout,spread,panel=false){
 sunroofHardware.push({id:'sunroof-'+key,section:'body-roof',name,description,page:330,callout,spread,option:'roof',...(panel?{value:'glass'}:{values:['glass','removed']}),referenceNote:'GM 22P roof hardware / vista vent AD3, CD PDF 330–331. Component identity follows the illustration and application table. Local profiles, thickness, latch travel and attachment spacing remain reconstructed.'});
}
for(const [side,s]of [['left',1],['right',-1]]){
 add('hinge-'+side,(s>0?'Driver':'Passenger')+' sunroof hinge tongue','Separate bent front hinge tongue carried by the removable glass panel; shown in the installed position.',1,[s*.13,.24,-.16],true);
 add('hinge-bushing-'+side,(s>0?'Driver':'Passenger')+' sunroof hinge bushing','Annular insulating bushing at the front glass attachment, distinct from the hinge and retaining nut.',2,[s*.13,.34,-.13],true);
}
add('hinge-nuts','Sunroof hinge retaining nuts','Two separate capped nuts grouped as an attachment set above the front glass hinge bushings.',3,[0,.45,-.15],true);
add('glass-handle','Sunroof glass-side latch handle','Glass-mounted rear handle and bent engagement link. Static closed pose; release travel is not calibrated.',5,[0,.15,.20],true);
add('handle-screws','Sunroof glass-handle screws','Separate attachment screw pair through the rear glass-side handle.',6,[0,.38,.20],true);
add('finish-lace','Sunroof opening finish lace','Continuous inner trim section around the roof opening, beneath the aperture seal.',7,[0,-.10,0]);
add('headliner-retainer','Sunroof headlining retainer','Open perimeter retaining frame under the finish lace; not a solid panel across the opening.',8,[0,-.20,0]);
add('air-deflector','Sunroof air deflector','Separate curved front air deflector shown seated along the forward opening. Stowage and deployed position remain unverified.',9,[0,.20,-.25]);
add('latch-spacer','Sunroof body-latch spacer','Separate spacer between the rear roof rail and body-side release housing.',11,[.14,-.10,.15]);
add('release-button','Sunroof release push button','Separate push button seated in the open body-side latch housing. Internal detent and spring travel remain incomplete.',12,[0,-.25,.18]);
add('latch-housing','Sunroof latch escutcheon','Open body-side latch housing with raised sides and a recess for the separate push button.',13,[0,-.14,.27]);
add('latch-screws','Sunroof body-latch screws','Two separate housing attachment screws, grouped as a set.',14,[-.14,-.24,.17]);
add('trim-retainers','Sunroof headliner fastening retainers','Separate spring clips at the front and rear roof trim margins; exact production locations remain unverified.',15,[0,-.31,0]);
add('glass-bushings','Sunroof handle glass bushings','Separate annular insulating bushings at the two rear glass-handle attachments.',17,[0,.27,.20],true);
