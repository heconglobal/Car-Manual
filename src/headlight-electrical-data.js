// Circuit designations transcribed from the headlamp-door schematic indexed
// under 1985. The cropped scan lacks its edition page: retain that qualification.
// Positions below describe reconstructed tooling, NOT a connector-end drawing.
export const headlightCircuitSource='https://charm.li/Pontiac/1985/Fiero%20V6-173%202.8L/Repair%20and%20Diagnosis/Diagrams/Electrical%20Diagrams/Lighting%20and%20Horns/Headlamp/Headlamp%20Motor/';
export const headlightCircuitPrimary='https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=994';
export const headlightCircuitNote='Connections cross-checked against original 1986 Pontiac 8A-102-0, used as adjacent-year evidence. A matching circuit scan is indexed under 1985 but lacks its printed edition page. Connector-face orientation, terminal series, relay tooling, wire lengths and internal dimensions are reconstructed. This static construction view is not a back-probing diagram or an electrical diagnostic procedure.';
export const actuatorTerminals=[
 {key:'c1-a',cavity:'C1 A',number:3,color:'red',circuit:'2',function:'Battery feed through the separate fusible link',material:'wireRed',x:-.009,z:-.008},
 {key:'c1-b',cavity:'C1 B',number:2,color:'pink',circuit:'113',function:'Relay coil control from the isolation relay',material:'wirePink',x:0,z:-.008},
 {key:'c1-c',cavity:'C1 C',number:1,color:'black',circuit:'150',function:'Coil and contact ground',material:'wire',x:.009,z:-.008},
 {key:'c2-a',cavity:'C2 A',number:6,color:'gray',circuit:null,function:'Gray motor conductor',material:'wireGray',x:-.0045,z:.008},
 {key:'c2-b',cavity:'C2 B',number:5,color:'green',circuit:null,function:'Green motor conductor through its internal circuit breaker',material:'wireGreen',x:.0045,z:.008},
];
export const isolationTerminals=[
 {key:'c1-a',cavity:'C1 A',number:3,color:'white',circuit:'103',function:'Headlight switch F through C100 J6',material:'wireWhite',x:-.009,z:-.008},
 {key:'c1-b',cavity:'C1 B',number:2,color:'yellow',circuit:'10',function:'Headlight switch D through C100 J9',material:'wireYellow',x:0,z:-.008},
 {key:'c1-c',cavity:'C1 C',number:1,color:'black',circuit:'150',function:'Ground through S103 / G101',material:'wire',x:.009,z:-.008},
 {key:'c2-a',cavity:'C2 A',number:6,color:'pink',circuit:'113',function:'Shared coil feed to both actuator relays',material:'wirePink',x:-.009,z:.008},
 {key:'c2-b',cavity:'C2 B',number:5,color:'dark blue / white',circuit:'104',function:'RH white motor lead through C102',material:'wireBlue',stripe:true,x:0,z:.008},
 {key:'c2-c',cavity:'C2 C',number:4,color:'dark blue',circuit:'110',function:'LH white motor lead through C101',material:'wireBlue',x:.009,z:.008},
];
export const relayPlacements={left:[.405,.606,-1.290],right:[-.405,.606,-1.290],isolation:[.472,.588,-1.230]};
export const motorLeadMaterials={white:'wireWhite',green:'wireGreen',gray:'wireGray'};
