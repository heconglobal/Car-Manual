const source='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf';
export const doorMechanismSections=[];
export const doorMechanismParts=[];
const note='GM 22P PDF 300 figure 2P10-004 and application tables on PDF 301–302 identify these components. Geometry, attachment counts, regulator pose and guide profiles are reconstructed; they are not measured production data or a validated removal/adjustment procedure. The glass-lowering display does not simulate this mechanism.';
for(const [side,s,word] of [['left',1,'Driver'],['right',-1,'Passenger']]){
 for(const [key,name]of [['window','Window regulator, cams & guides'],['lock','Door lock controls & linkage'],['panel','Outer-panel attachment hardware']])doorMechanismSections.push({id:`body-door-${side}-${key}`,parent:`body-door-${side}`,name:`${word} ${name.toLowerCase()}`,spread:[s*.055,0,0]});
 const add=(key,family,name,description,callout,number,spread,extra={})=>doorMechanismParts.push({id:`bd-door-${side}-${key}`,section:`body-door-${side}-${family}`,system:'body',vehiclePart:`door-${side}`,name:`${word} ${name}`,description,callout,partNumber:number,spread:[s*spread[0],spread[1],spread[2]],location:`${word} door ${family} mechanism`,source:'GM 22P · door hardware / 1985 application',sourceUrl:source+'#page=300',referenceNote:note,serviceReference:{title:'Door component identification',rows:[['Diagram',`2P10-004 · item ${callout}`],['Catalog service number',number||'Not separately listed'],['Application',key==='power-lock-stop'?'Regulator variant unverified':key==='belt-trim-retainer'?'1984–85 belt trim retainer':extra.option==='powerWindows'?(extra.value?'Electric-window preview':'Manual-window preview'):extra.option==='powerLocks'?'AU3 electric-lock preview':'1985 door hardware'],['Geometry','Reconstructed static construction; adjustment and full travel unverified']],links:[['GM exploded drawing · PDF 300',source+'#page=300'],['Application / service numbers · PDF 301–302',source+'#page=301']],note},...extra});
 const number=(left,right)=>s>0?left:right;
 for(const [key,name,desc,c,n,spread]of [
  ['glass-cam','glass-mounted regulator cam','Open lower-glass channel receives the regulator rollers; separate from the fixed inner-panel cam.',2,number('20364929','20364928'),[.07,.11,0]],
  ['belt-trim-retainer','1984–85 belt trim retainer','Separate long trim retainer at the window belt, distinct from either sealing strip. The 1984–85 service identities are RH 20352606 / LH 20352607; later 1986–88 retainers are RH 20350876 / LH 20350877 and are not substituted. Cross section, attachment details and dimensions are reconstructed.',11,number('20352607','20352606'),[-.08,.20,0]],
  ['inner-belt-seal','inner window belt sealing strip','Independent inner glass wiping strip, GM item 13; the outer belt seal is item 12. The catalog identifies RH/LH service parts, but the exact original lip profile, material and attachment details remain unverified.',13,number('20320535','20320534'),[-.14,.23,0]],
  ['glass-rear-stops','rear glass stop pair','Separate glass-mounted stops. Displayed set is a reconstructed arrangement; the diagram does not establish the complete per-door quantity.',3,'20085501',[.09,.13,.08]],
  ['glass-inner-stop','inner-panel glass stop','Rubber-faced adjustable stop on the door inner panel.',15,'20179560',[-.07,.08,-.13]],
  ['regulator-stop','regulator stop bumper','Separate rubber bumper for the regulator stop, grouped with its reconstructed attachment.',25,'20269755',[.08,-.1,0]],
  ['power-lock-stop','window-regulator stop bumper · item 34','GM item 34 is a door-window regulator stop bumper, with the same service number as item 25. The source does not annotate AU3 for this row. It is retained as a separate illustrated position in the window scope; regulator variant, original quantity and installed placement remain unverified.',34,'20269755',[.16,-.19,.12]],
  ['rear-cam-support','rear glass-cam support','Folded support for the rear guide cam.',30,'20325470',[.09,-.03,.22]],
  ['guide-cam','vertical glass guide cam','Open guide channel and upper/lower attachment ears; exact channel curvature remains unmeasured.',31,number('20349667','20349666'),[.13,0,.23]],
  ['inner-cam','inner-panel regulator cam','Fixed open channel receiving the opposite regulator roller.',32,number('20325483','20325482'),[-.07,-.1,0]],
  ['guide-retainer','guide-run channel retainer','Separate front guide-run retainer with an open channel.',37,number('20325457','20325456'),[.13,0,-.23]],
  ['guide-support','guide-run retainer support','Folded bracket attaches the front guide-run channel.',38,'20356700',[.17,-.06,-.23]],
  ['front-glass-stop','forward inner-panel glass stop','Separate front stop, catalog item 48; it shares service number 20179560 with item 15.',48,'20179560',[-.1,.12,-.22]],
  ['glass-stabilizers','belt glass stabilizer set','Separate felt-faced stabilizers near the belt. Quantity and felt profiles are reconstructed.',49,'20514937',[.1,.18,0]],
  ['glass-bushing-retainers','glass bushing retainer set','Retainers at the glass attachment points, independent from the bushings and buttons.',50,'20095585',[.15,.13,0]],
  ['glass-inner-buttons','inner glass button set','Inside attachment buttons associated with the glass bushing set.',51,'20216819',[-.12,.16,0]],
  ['glass-stabilizer-buttons','glass stabilizer button set','Separate stabilizer buttons at the guide interface.',52,'20146473',[.16,.19,.18]],
  ['glass-outer-buttons','outer glass button set','Outer glass attachment buttons, separated from the inner buttons.',53,'20216820',[.2,.15,0]],
  ['glass-bushings','1985–88 glass bushing set','Uses the 1985–88 catalog bushing identity; the distinct 1984 steel-type bushing 20178799 is not substituted.',54,'20562754',[.18,.10,0]],
 ])add(key,'window',name,desc,c,n,spread);
 add('manual-regulator','window','manual scissor regulator','Crossing arms, central pivot, drive sector and manual spindle form a static reconstructed regulator. The sector is smooth because factory tooth count/profile is unverified.',29,number('20302331','20302330'),[.13,-.02,-.03],{option:'powerWindows',value:false});
 add('power-regulator','window','electric scissor regulator','Separate electric-regulator assembly and mounting plate. Motor is independently selectable; manual crank hardware is excluded when this preview is active.',36,number('20311753','20311752'),[.13,-.02,-.03],{option:'powerWindows',value:true});
 add('window-motor','window','window regulator motor','Separate motor can, gearbox shell and mounting lugs. The catalog motor line annotates W/AU3 even though the table distinguishes electric regulators; this unresolved annotation is not used as a verified window-option code.',35,'22082528',[.2,-.08,-.12],{option:'powerWindows',value:true});
 for(const [key,name,desc,c,n,spread,extra]of [
  ['lock-overcenter-spring','lock over-center spring','Separate shaped lock spring identified in the exploded drawing. Preload, force and motion remain unverified.',4,number('20047023','20047022'),[.12,.06,.22]],
  ['handle-rod-clip','outside-handle rod retaining clip','Independent clip captures the existing outside-handle rod at the latch.',8,'20158344',[.19,.06,.18]],
  ['lock-cylinder-retainer','key-cylinder spring retainer','Open forked retainer secures the existing outer lock cylinder. Internal lock tumblers remain unmodeled.',9,'20318476',[.2,.04,.27]],
  ['lock-return-spring','inside lock-control return spring','Separate catalog push-button return spring. Coil form is illustrative.',14,'20888089',[-.08,.09,.05]],
  ['inside-lock-clip','inside lock-rod panel clip','Supports the inside lock-control rod at the inner panel.',16,'20474324',[-.11,-.04,-.12]],
  ['inside-latch-clip','inside lock-rod latch clip','Separate rod-to-lock retaining clip.',17,'20474900',[.1,.03,.19]],
  ['inside-release-rod','inside release-control rod','Bent rod connects the interior remote release to the latch; installed bend radii and exact routing are reconstructed.',18,number('20318487','20318486'),[-.12,.02,0]],
  ['striker-anchor','striker anchor plate','Separate body-side threaded anchor behind the existing striker. This plate stays with the body when servicing the door.',22,'20277001',[-.15,-.03,.26]],
  ['inside-lock-rod','inside lock-control rod','Long control rod links the inside lock slider to the lock assembly.',24,number('20807585','20807584'),[-.14,-.08,0]],
  ['power-lock-bellcrank','electric-lock bell-crank plate','Separate stamped bell-crank plate, identified for AU3 in the parts table.',26,number('20426399','20426398'),[.14,-.14,.08],{option:'powerLocks',value:true}],
  ['power-lock-rod','electric-lock actuator rod','Connects the electric actuator to the bell-crank plate.',27,number('20344921','20344920'),[.18,-.11,.06],{option:'powerLocks',value:true}],
  ['power-lock-actuator','electric-lock actuator','Motor/actuator housing with rod boot and separate mounting bracket. Internal motor, travel limit and electrical topology remain unverified.',33,'22020256',[.21,-.15,0],{option:'powerLocks',value:true}],
  ['power-lock-bracket','electric-lock actuator bracket','Catalog 22049760 bracket for the item-33 actuator, independently selectable.',33,'22049760',[.17,-.2,0],{option:'powerLocks',value:true}],
  ['remote-rod-clip','remote-control rod clip','Separate retainer for the inner release-control rod.',39,'20474324',[-.15,.05,-.16]],
 ])add(key,'lock',name,desc,c,n,spread,extra);
 add('outer-panel-block','panel','outer-panel attachment block','Independent GM item 23, service identity 20505072. A reconstructed block outline and boss distinguish it from the door latch and inner reinforcement; exact profile, material, mounting interface and original quantity remain unverified.',23,'20505072',[.22,.04,.20]);
 add('front-panel-block','panel','front outer-panel attachment block','Independent front attachment block, GM item 40, service identity 20505073. The separate reconstructed outline is not evidence of exact mounting position, material, fasteners or original quantity.',40,'20505073',[.22,-.02,-.22]);
}
