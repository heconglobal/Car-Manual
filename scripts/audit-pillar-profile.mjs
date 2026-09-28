// Independent drawing-derived angular bounds plus actual space-frame sightlines.
// These are reconstruction checks, not GM tooling tolerances.
import * as T from 'three';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sourceFingerprint} from './source-fingerprint.mjs';
import {preserveFiles} from './preserve-files.mjs';
const baseline=process.env.FIERO_PROFILE_BASELINE;
const src=file=>pathToFileURL(resolve(baseline||'.','src',file)).href;
const [{bodyPoint},{sideWindow,aPost},{rearFace},{geometryTools},{buildStructure}]=await Promise.all(['body-datums.js','glazing-contours.js','fascias.js','geometry.js','structure.js'].map(f=>import(src(f))));
const groups=new Map([['spaceframe',new T.Group()]]),mat=new T.MeshStandardMaterial({side:T.DoubleSide});
buildStructure(geometryTools(groups,new Proxy({},{get:()=>mat})));
const frame=groups.get('spaceframe');frame.updateMatrixWorld(true);
const checks=[];
const check=(name,fn)=>{try{checks.push({name,status:'passed',...fn()});}catch(e){checks.push({name,status:'failed',error:e.message});}};
const assert=(condition,message)=>{if(!condition)throw Error(message);};
check('Actual steel A/B/roof members leave the side-window sightlines clear',()=>{
 const ray=new T.Raycaster();let samples=0,obstructions=0;const examples=[];
 for(const s of [-1,1]){
  const edge=[];for(let i=0;i<=150;i++)for(const uv of [[i/150,1],[1,i/150],[0,i/150],[i/150,0]])edge.push(new T.Vector3(...bodyPoint(sideWindow(s,...uv))));
  for(let i=1;i<48;i++)for(let j=1;j<28;j++){
   const p=new T.Vector3(...bodyPoint(sideWindow(s,i/48,j/28)));
   if(Math.min(...edge.map(q=>q.distanceTo(p)))<.018)continue;
   ray.set(p.clone().add(new T.Vector3(s*.20,0,0)),new T.Vector3(-s,0,0));ray.far=.36;
   const hit=ray.intersectObject(frame,true)[0];samples++;
   if(hit){obstructions++;if(examples.length<6)examples.push({side:s,u:i/48,v:j/28,point:hit.point.toArray()});}
  }
 }
 assert(obstructions===0,JSON.stringify({samples,obstructions,examples}));return{samples,obstructions,insetMm:18,depthBehindGlassMm:160};
});
check('Installed A-post follows the straight sweep in Pontiac body photographs',()=>{
 const a=bodyPoint(aPost(0)),b=bodyPoint(aPost(1)),dy=b[1]-a[1],dz=b[2]-a[2];let deviation=0;
 for(let i=1;i<100;i++){const p=bodyPoint(aPost(i/100));deviation=Math.max(deviation,Math.abs(dz*(p[1]-a[1])-dy*(p[2]-a[2]))/Math.hypot(dy,dz));}
 assert(deviation<.004,JSON.stringify({maxElevationDeviationMm:deviation*1000}));return{maxElevationDeviationMm:deviation*1000,basis:'GM 1985 catalog p12 straight post sweep; 4 mm reconstruction bound, not a manufacturing tolerance.'};
});
check('Rear lamp-panel rake agrees with the GM production-profile angular band',()=>{
 // GM Performance Plus p46: hand-read line endpoints (1024,130)-(1045,162)
 // in artifacts/body-reference-r7/production-profile-detail.png. Axles
 // (302,886), ground331 and roof42 establish separate scan-axis scales.
 const drawingAngle=Math.atan2((1045-1024)*2.373/584,(162-130)*1.192/289)*180/Math.PI;
 const upper=bodyPoint(rearFace(.10,.78)),lower=bodyPoint(rearFace(.10,.65));
 const angle=Math.atan2(lower[2]-upper[2],upper[1]-lower[1])*180/Math.PI;
 assert(Math.abs(angle-drawingAngle)<8,JSON.stringify({angleFromVerticalDeg:angle,drawingAngleDeg:drawingAngle,comparisonAllowanceDeg:8}));
 return{angleFromVerticalDeg:angle,drawingAngleDeg:drawingAngle,comparisonAllowanceDeg:8,upper,lower,basis:'Hand-read published GM production silhouette, not a dimensioned fascia drawing.'};
});
const loadedContours=await import(src('body-contours.js'));
check('Lower rear side contour rises toward the bumper return',()=>{
 const {lowerPanelHeight}=loadedContours;
 const forward=bodyPoint([.80,lowerPanelHeight(1.54,true),1.54]),aft=bodyPoint([.80,lowerPanelHeight(1.86,true),1.86]);
 const rise=aft[1]-forward[1];assert(rise>.05&&rise<.10,JSON.stringify({riseMm:rise*1000}));
 return{riseMm:rise*1000,basis:'Direction and broad reconstruction range from GM production/CAD outlines; no published local ordinate.'};
});
const report={sourceSha256:baseline?null:sourceFingerprint(),comparisonHarnessSourceSha256:sourceFingerprint(),baseline:baseline||null,date:new Date().toISOString(),status:checks.every(c=>c.status==='passed')?'passed':'failed',checks,limits:'Drawing-derived angle/rise comparison and physical steel-frame visibility. No factory surface coordinate set or manufacturing tolerance was obtained.'};
const file='artifacts/pillar-profile-'+(baseline?'r10-baseline':'audit')+'.json';await preserveFiles([file],'before-pillar-profile-audit');await writeFile(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.status!=='passed'&&!baseline)process.exitCode=1;
