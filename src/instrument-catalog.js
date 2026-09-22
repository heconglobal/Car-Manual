const owner='https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FOwners+Manuals%2F1985%2F1985+Fiero+Owners+Manual.pdf#page=32';
const parts='https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=289';
export const clusterWarnings=[
 ['deck','Deck ajar',1,0,'DECK\nAJAR','red'],['left-turn','Left turn',1,1,'←','green'],['door','Door ajar',1,2,'DOOR','red'],['beam','High beam',1,3,'HIGH','blue'],['brake','Brake warning',1,4,'BRAKE','red'],
 ['shift','Manual upshift',-1,0,'↑ SHIFT','amber'],['right-turn','Right turn',-1,1,'→','green'],['generator','Generator warning',-1,2,'BATT','red'],['belt','Seat-belt reminder',-1,3,'BELT','red'],['engine','Check engine',-1,4,'CHECK\nENGINE','amber'],
].map(([key,name,side,row,text,color])=>({key,name,side,row,text,color,x:side*.042,y:.056-row*.025}));
export const instrumentParts=[];
function part(key,name,description,spread=[0,0,0]){instrumentParts.push({id:'wr-cluster-'+key,section:'wiring-cluster',system:'electrical',name,description,spread,location:'1985 driver instrument pod',source:'1985 Pontiac owner’s manual · 2C-1',sourceUrl:owner,referenceNote:'The 1985 owner drawing establishes face layout and indicator identities; GM 22P 2P10-001 establishes the pod and trim. Dimensions, hidden mechanisms, fastener patterns and circuit-board details remain reconstructed. This is not a calibrated instrument or a cluster wiring diagram.'});}
for(const [key,name,description,spread]of[
 ['shell','1985 cluster rear housing','Open molded pod enclosing the two main instruments and center gauges. No later auxiliary rally-gauge pod is added.',[0,0,-.15]],
 ['cover','Instrument-pod upper cover','Removable formed top and rear cover. Local section and screw positions remain unmeasured.',[0,.17,-.03]],
 ['bezel','1985 instrument face trim','Separate metal-look trim with real openings for both main dials, center gauges and warning windows.',[0,0,.17]],
 ['lens','Instrument clear lens','Separate clear face covering the instrument openings.',[0,0,.23]],
 ['carrier','Instrument mounting carrier','Open support plate with instrument apertures and attachment pads.',[0,0,-.06]],
 ['flex','Cluster flexible-circuit substrate','Flexible support film and connector landing areas only. Unverified printed traces and terminal assignments are not shown.',[0,0,-.22]],
 ['plugs','Cluster connector housings','Separate molded wire-entry housings. Exact 1985 terminal population and pinout remain unverified.',[0,0,-.29]],
 ['mounts','Instrument-pod mounting hardware','Separated mounting fasteners. Reconstructed quantity and dimensions; no tightening specification is assigned.',[.23,.13,0]],
 ['speed-face','85 mph speedometer dial','Original U.S. 85 mph face, with an inner km/h scale. Native geometry and text, with a separate pointer.',[.15,.02,.04]],
 ['speed-pointer','Speedometer pointer','Independent pointer and central hub. Parked for a factory-new static display; no live speed signal is simulated.',[.15,.03,.11]],
 ['speed-unit','Electronic speedometer housing','Rear speedometer unit and its circuit substrate. Internal circuits and calibration are not reconstructed.',[.15,0,-.12]],
 ['odometer','Six-digit odometer display','Separate odometer drum display above the speedometer. Zero is a display preview, not a claim about vehicle mileage.',[.15,.12,.10]],
 ['trip','Four-digit trip odometer','Separate trip display at the bottom of the speedometer; zeroed display preview.',[.15,-.12,.10]],
 ['trip-reset','Trip reset shaft & knob','Separate front knob and rear reset shaft. Internal reset gear train remains unverified.',[.15,-.17,.12]],
 ['tach-face','1985 6000 rpm tachometer dial','Original tachometer face shares its lower sector with the oil-pressure gauge.',[-.15,.02,.04]],
 ['tach-pointer','Tachometer pointer','Separate tachometer pointer and hub, parked at zero for the static preview.',[-.15,.03,.11]],
 ['tach-unit','Tachometer rear housing','Separate instrument housing and circuit substrate. Calibration components remain unverified.',[-.15,0,-.12]],
 ['oil-face','Oil-pressure scale in tachometer','The 1985 oil gauge occupies the bottom of the tachometer; 0, 40 and 80 psi scale.',[-.15,-.09,.07]],
 ['oil-pointer','Oil-pressure pointer','Independent oil gauge needle and hub. This is a static display, not a simulated pressure reading.',[-.15,-.12,.13]],
 ['oil-unit','Oil-pressure gauge unit','Separate rear gauge casing; internal moving-coil construction remains unverified.',[-.15,-.08,-.16]],
 ['temperature-face','Center coolant-temperature dial','Upper center gauge with 100, 220 and 260 °F markings following the 1985 face.',[0,.13,.04]],
 ['temperature-pointer','Coolant-temperature pointer','Separate needle and hub in the upper center gauge.',[0,.13,.11]],
 ['temperature-unit','Coolant-temperature gauge unit','Separate casing behind the upper center display.',[0,.13,-.12]],
 ['fuel-face','Center fuel-level dial','Lower center gauge, with E, half and F marks; period unleaded-fuel label.',[0,-.12,.04]],
 ['fuel-pointer','Fuel-level pointer','Separate needle and hub; parked display does not report the actual fuel in this car.',[0,-.12,.11]],
 ['fuel-unit','Fuel-level gauge unit','Separate rear casing for the lower center gauge.',[0,-.12,-.12]],
 ['illumination','Instrument illumination bulbs & holders','Five reconstructed illumination positions, supported by the adjacent-year lighting schematic. Original 1985 bulb identity is 194; exact board position/count remains unverified.',[0,.18,-.12]],
])part(key,name,description,spread);
for(const w of clusterWarnings){
 part('warning-'+w.key,w.name+' indicator window','Separate '+w.name.toLowerCase()+' window in the original 1985 face location. Text/symbol rendering is a native approximation.',[w.side*.06,.03,.12+w.row*.014]);
 part('bulb-'+w.key,w.name+' bulb & twist socket','Separate warning bulb and holder behind the '+w.name.toLowerCase()+' window. The 1985 owner’s replacement table lists 194 cluster bulbs; local socket construction is reconstructed.',[w.side*.07,0,-.12-w.row*.014]);
}
for(const p of instrumentParts){p.aliases='instrument cluster speedometer tachometer gauges dash warning lights '+p.name;if(['wr-cluster-shell','wr-cluster-bezel','wr-cluster-cover'].includes(p.id)){p.source='GM 22P · 1984–85 instrument panel';p.sourceUrl=parts;}}
instrumentParts.find(p=>p.id==='wr-cluster-oil-face').serviceReference={title:'Original 1985 instrument layout',rows:[['Left dial','85 mph speedometer'],['Right dial','Tachometer with oil-pressure gauge'],['Center gauges','Coolant temperature above fuel']],links:[['1985 Pontiac owner’s manual · 2C-1',owner],['1984–85 instrument panel parts',parts]],note:'This is the 1985 face arrangement. Needle positions and zeroed odometer are display previews, not live vehicle data.'};
