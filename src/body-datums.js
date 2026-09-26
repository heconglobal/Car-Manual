// Pontiac 1985 MVMA, PDF 22–23; definitions PDF 29 and 31.
// SI metres, Y up, front -Z, origin midway between axle centres.
export const bodyNominal={wheelbase:2.373,width:1.752,length:4.082,height:1.192,frontOverhang:.924,rearOverhang:.785,frontTrack:1.468,rearTrack:1.492,cowlHeight:.832,deckPointHeight:.875,upperStructureLength:1.518,rockerFront:.168,rockerRear:.171,doorBottom:.245,seatSectionWidth:1.751,rearAxleBaseGrid:2.173,cowlBaseGrid:.197,seatBaseGrid:1.152,frontBumperGround:.315,rearBumperGround:.333,frontBumperCurb:.341,rearBumperCurb:.343};
export const bodyStations={frontAxle:-bodyNominal.wheelbase/2,rearAxle:bodyNominal.wheelbase/2};
bodyStations.frontTip=bodyStations.frontAxle-bodyNominal.frontOverhang;
bodyStations.rearTip=bodyStations.rearAxle+bodyNominal.rearOverhang;
bodyStations.cowl=bodyStations.rearAxle-bodyNominal.rearAxleBaseGrid+bodyNominal.cowlBaseGrid;
bodyStations.deckPoint=bodyStations.cowl+bodyNominal.upperStructureLength;
bodyStations.seat=bodyStations.rearAxle-bodyNominal.rearAxleBaseGrid+bodyNominal.seatBaseGrid;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function bell(z,a,b,c){return z<=a||z>=c?0:z<=b?smooth((z-a)/(b-a)):1-smooth((z-b)/(c-b));}

// Local, monotone remapping of the previous reconstruction. Anchor corrections
// are sourced; the smooth interpolation between them is NOT factory loft data.
// Axle stations and the engine/transaxle are not scaled or translated.
export function bodyLongitudinal(z,y=.840){
 if(z< -1.790)return -1.790+(z+1.790)*(bodyStations.frontTip+1.790)/(-2.03687291+1.790);
 if(z>1.867)return 1.867+(z-1.867)*(bodyStations.rearTip-1.867)/(2.0336808-1.867);
 const upper=smooth((y-.647)/.182);
 // Keep the wheel opening and sill endpoint fixed. The short forward segment
 // is linear to remain monotone despite the 149.5 mm cowl correction.
 const cowl=z<=-.8475||z>=-.104?0:z<-.640?(z+.8475)/.2075:1-smooth((z+.640)/.536);
 // Photo-guided upper windshield/roof correction. Lower DLO datums stay
 // fixed; this is a reconstructed profile adjustment, not a published angle.
 const roofForward=-.065*smooth((y-.86)/.24)*bell(z,-.55,-.104,.470);
 return z+roofForward+(bodyStations.cowl+.640)*cowl+upper*(bodyStations.deckPoint-.742)*bell(z,.488,.742,1.1865);
}
export function bodyPoint([x,y,z]){
 const lift=.003*bell(z,-1.1865,-.640,-.104)+.035*bell(z,.488,.742,1.867);
 const heightWeight=smooth((y-.245)/.350)*Math.min(1,Math.max(0,(1.192-y)/.352));
 return[x,y+lift*heightWeight,bodyLongitudinal(z,y)];
}
export function authoredBodyZ(z){let a=-2.3,b=2.3;for(let i=0;i<48;i++){const m=(a+b)/2;if(bodyLongitudinal(m)<z)a=m;else b=m;}return(a+b)/2;}

// MVMA PDF22/26 specify different load states. Interpolation of the stated
// front/rear bumper rise is a reconstruction of static pitch, not a published
// suspension deflection curve. Keep it explicit rather than mixing heights.
export function estimatedCurbRise(z){
 const t=Math.max(0,Math.min(1,(z-bodyStations.frontTip)/(bodyStations.rearTip-bodyStations.frontTip)));
 return (bodyNominal.frontBumperCurb-bodyNominal.frontBumperGround)*(1-t)+(bodyNominal.rearBumperCurb-bodyNominal.rearBumperGround)*t;
}
export const exteriorLampNominal={frontMarkerCurb:.555,rearMarkerCurb:.655,tailCurb:.716,tailOutside:.678,frontTurnOffset:.500,rearTurnOffset:.538};
export const designLampHeight=(curbHeight,z)=>curbHeight-estimatedCurbRise(z);
