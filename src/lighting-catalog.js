export const lightingSource='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf';
export const lightingDiy='https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf';
export const lightingSections=[{id:'lighting-system',name:'Exterior & cabin lamps'}];
export const lightingParts=[];
const note='Original 1985 bulb and assembly architecture follows GM illustrations. Mold profiles, optical prisms, seal sections, local dimensions and socket details remain reconstructed. Splitting bonded lenses illustrates construction, not a service operation.';
function section(id,name,parent='lighting-system'){lightingSections.push({id:'lighting-'+id,parent,name});}
function part(scope,key,name,description,spread=[0,0,.1],page=72,callout=null,option=null){lightingParts.push({id:`lt-${scope}-${key}`,section:'lighting-'+scope,system:'electrical',name,description,spread,source:page<60?'1985 Pontiac DIY · lamps':'GM 22P · lamps',sourceUrl:(page<60?lightingDiy:lightingSource)+'#page='+page,referenceNote:note,callout,location:lightingSections.find(s=>s.id==='lighting-'+scope).name,...(option?{option,value:true}:{})});}
for(const [side,s,label]of[['left',1,'Driver / LH'],['right',-1,'Passenger / RH']]){
 const front='front-'+side;section(front,label+' front park / turn lamp');
 for(const [key,name,desc,spread,callout]of[
  ['housing','Park / turn reflector housing','Open shaped reflector bowl, bulb neck and attachment ears behind the front lens.',[0,0,.08],22],
  ['lens','Amber park / turn lens','Rounded rectangular amber optical lens with modeled vertical and horizontal fluting.',[0,0,-.16],22],
  ['gasket','Lens perimeter seal','Separate elastomer perimeter seal between housing and removable lens.',[0,0,-.09],22],
  ['bulb','2057 dual-filament bulb','Glass envelope, two filaments, bayonet shell, offset locking pins and two insulated base contacts.',[0,.08,-.03],22],
  ['socket','Park / turn socket & leads','Separate dual-contact socket with locking tabs, seal and three leads.',[0,0,.14],22],
  ['screws','Two lens screws','Two front-access Torx screws shown in the 1985 DIY illustration.',[0,.08,-.20],21],
  ['bracket','Park-lamp bracket & attaching screws','Folded support behind the front lamp; separate from the reflector body.',[s*.11,-.08,.08],30],
 ])part(front,key,`${label} · ${name}`,desc,spread,69,callout);
 for(const [end,z]of[['front',-1],['rear',1]]){const scope=`marker-${end}-${side}`;section(scope,label+' '+end+' side marker');for(const [key,name,desc,spread]of[
  ['housing','Marker housing','Long recessed base with bulb opening and mounting ends.',[-s*.08,0,0]],
  ['lens',(end==='front'?'Amber':'Red')+' marker lens','Separate ribbed optical lens following the side molding.',[s*.12,0,0]],
  ['bulb','194 wedge bulb','Miniature glass envelope, filament, flattened wedge and folded lead contacts.',[s*.03,.05,0]],
  ['socket','Marker socket & leads','Quarter-turn bulb holder, sealing ring and paired leads.',[-s*.14,0,0]],
  ['seal','Marker mounting seal','Thin perimeter seal seated between lamp and body.',[-s*.035,-.04,0]],
  ['screws','Two marker screws','Two end screws as illustrated in the 1985 DIY marker-lamp procedure.',[s*.16,.04,0]],
 ])part(scope,key,`${label} ${end} · ${name}`,desc,spread,end==='front'?69:72,end==='front'?18:9);}
 const rear='rear-'+side;section(rear,label+' 1984–85 rear combination lamp');
 for(const [key,name,desc,spread,callout]of[
  ['housing','Divided rear reflector housing','Four bulb chambers: three behind the red insert and one behind the inboard clear reverse insert. Original catalog housing '+(side==='left'?'16500453':'16500454')+'.',[0,0,-.14],1],
  ['outer-lens','Clear outer lens & perimeter lip','Smooth clear outer cover with a tapered, rounded outline and separate inner optical grid; local contours remain reconstructed. Original lens '+(side==='left'?'16500461':'16500462')+'.',[0,0,.24],4],
  ['red-lens','Red inner lens','Red inner stop / tail / turn lens separated from the clear outer lens; original '+(side==='left'?'16500457':'16500458')+'.',[0,0,.14],3],
  ['reverse-lens','Clear inner reverse lens','Separate inboard clear lens, GM 16500460.',[-s*.09,0,.14],2],
  ['seal','Rear lamp perimeter seal','Continuous sealing bead between outer lens and divided housing.',[0,0,.18],null],
  ['tail-bulb','2057 outer tail bulb','Outboard tail-lamp bulb. Its 678 mm offset follows the 1985 MVMA. The 1985 tail-only socket does not make this a third stop lamp.',[s*.11,.08,.03],13],
  ['turn-bulb','2057 outer stop / turn bulb','Outer of the two stop/turn bulbs; 538 mm offset from the vehicle centerline in the 1985 MVMA.',[0,.08,.03],14],
  ['inner-stop-bulb','2057 inner stop / turn bulb','Second stop/turn bulb behind the red insert. Its local position is reconstructed; the source does not dimension this center.',[-s*.07,.10,.03],14],
  ['reverse-bulb','1156 reverse bulb','Inboard single-filament bulb with one base contact and level bayonet pins.',[-s*.10,.08,.03],15],
  ['tail-socket','Outer tail socket & leads','Separate twist-lock socket behind the outboard chamber. Catalog socket 12030065.',[s*.07,0,-.23],13],
  ['turn-socket','Outer stop / turn socket & leads','Separate twist-lock socket behind the outer stop/turn chamber. Catalog socket 12003757.',[0,0,-.23],14],
  ['inner-stop-socket','Inner stop / turn socket & leads','Second dual-contact stop/turn socket behind the red insert.',[-s*.03,0,-.26],14],
  ['reverse-socket','Reverse socket & leads','Single-contact socket behind the inboard chamber. Catalog socket 12003758.',[-s*.07,0,-.23],15],
  ['retainers','Three long retaining screws & clips','Three top-access screws per assembly with lower receiving clips; early DIY procedure removes all three.',[0,.18,-.05],19],
  ['access-caps','Three upper access caps','Black caps over the three retaining-screw access openings.',[0,.23,0],18],
 ])part(rear,key,`${label} · ${name}`,desc,spread,72,callout);
 const license='license-'+side;section(license,label+' license lamp');
 for(const [key,name,desc,spread,callout]of[
  ['housing','License-lamp housing & bracket','Separate shallow reflector above the plate with mounting ears.',[s*.09,.08,0],17],
  ['lens','Clear license lens','Optical lens facing down toward the plate.',[0,-.12,0],17],
  ['bulb','194 license bulb','Wedge-base miniature incandescent bulb.',[s*.06,-.07,0],16],
  ['socket','License socket & leads','Separate wedge socket and wiring at the top of the plate recess.',[0,.10,-.06],16],
  ['screws','License-lamp mounting screws','Separate attachment pair; local fastener form is reconstructed.',[s*.11,-.10,0],17],
 ])part(license,key,`${label} · ${name}`,desc,spread,72,callout);
}
section('dome','Four-lamp dome / reading module');
part('dome','housing','Dome / map lamp carrier','Single overhead module with four separate lamp wells and mounting bosses.',[0,.12,0],33);
part('dome','screws','Four dome-module screws','Four mounting screws; the rear pair is accessed beneath the outboard lenses.',[.13,-.17,0],33);
for(const [key,x,name]of[['left-map',.110,'LH reading'],['left-dome',.037,'LH dome'],['right-dome',-.037,'RH dome'],['right-map',-.110,'RH reading']]){
 for(const [suffix,label,desc,spread]of[
  ['lens',name+' lens','Separate textured lens with retaining tabs.',[x*.6,-.20,0]],
  ['bulb',name+' 906 bulb','Wedge-base bulb with clear envelope, filament and folded contacts.',[x*.6,-.08,.08]],
  ['socket',name+' socket & contacts','Spring terminal contacts behind the lamp well.',[x*.6,.03,.08]],
  ['switch',name+' pushbutton','Separate pushbutton and contact spring behind the corresponding light.',[x*.6,-.04,-.10]],
 ])part('dome',key+'-'+suffix,label,desc,spread,33);
}
section('courtesy','Optional courtesy & compartment lamps');
for(const [scope,name,bulb]of[['foot-left','Driver footwell','168'],['foot-right','Passenger footwell','168'],['front-compartment','Front compartment','168'],['rear-compartment','Rear luggage compartment','561']]){
 for(const [key,title,desc,spread]of[
  ['housing',name+' lamp housing','Separate socket support and mounting bracket; optional lamp-group preview.',[0,.07,.04]],
  ['bulb',name+' '+bulb+' bulb',bulb==='561'?'Double-ended festoon bulb with spring contacts; no wedge or bayonet base.':'Miniature wedge-base lamp with a clear envelope and folded contacts.',[0,-.08,.08]],
  ['contacts',name+' contacts & leads','Spring contacts, short harness branch and attachment screw.',[.08,0,-.05]],
 ])part('courtesy',scope+'-'+key,title,desc,spread,33,null,'lampGroup');
}
section('console','Manual console / ashtray lamps');
for(const [side,s]of[['left',1],['right',-1]]){
 part('console',side+'-bulb',(s===1?'LH':'RH')+' ashtray 70 bulb','One miniature bulb beneath each ashtray. The manual-transmission console has two; no automatic shift-indicator lamp is added.',[s*.08,.12,0],35);
 part('console',side+'-socket',(s===1?'LH':'RH')+' ashtray socket & leads','Separate miniature lamp holder and short two-wire branch beneath the shifter trim plate.',[s*.12,.05,.06],35);
}
