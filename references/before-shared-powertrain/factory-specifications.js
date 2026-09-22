// Selected nominal 1985 Pontiac MVMA values. Clear application/units only;
// these design datums do not establish all casting surfaces or service fits.
export const mvma1985='https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FMotor+Vehicle+Specifcations%2F1985-86+Pontiac+Fiero.PDF';
export const l44Nominal={bore:.089,stroke:.076,borePitch:.1118,firingOrder:[1,2,3,4,5,6]};
export const m17Nominal={forwardRatios:[3.31,1.95,1.24,.81],reverseRatio:3.42,finalPinionTeeth:23,finalRingTeeth:84,clutchFacingOuter:.232,clutchFacingInner:.155,clutchFacingRivets:36};
export const lampNominal={bulbCenterHeight:.709,bulbCenterOffset:.511};
// Position 1 is at the pulley/passenger end, before legacy X reflection.
// Bank relation checked in Pontiac 1986 6A2-1; firing order in 1985 p3.
export function cylinderNumber(bank,position){
 if(!['front','rear'].includes(bank)||![1,2,3].includes(position))throw new RangeError('Unknown L44 cylinder position');
 return (position-1)*2+(bank==='rear'?1:2);
}
export const cylinderReference={
 title:'L44 cylinder identification',
 rows:[['Firing order','1–2–3–4–5–6'],['Trunk-side bank','1 · 3 · 5, passenger to driver'],['Cabin-side bank','2 · 4 · 6, passenger to driver']],
 links:[['Pontiac 1985 nominal specifications · engine',mvma1985+'#page=5'],['Pontiac engine layout · 1986 §6A2-1','https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=318']],
 note:'The pulley end is toward the passenger side; the transaxle is toward the driver side. Cylinder identities and firing order are verified; cap clocking and the displayed lead routes are reconstructed and are not a distributor-installation diagram.',
};
