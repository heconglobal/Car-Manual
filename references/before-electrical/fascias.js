import * as T from 'three';
import { shoulderWidth, shoulderDrop, rearLowerRise } from './body-contours.js';

// GM 22P G-13 / G-19 and the 1985 SE brochure: rounded bumper-pad
// fascias. Cross sections are reconstructed contours, not measured tooling.
const lerp=T.MathUtils.lerp;
const clamp=T.MathUtils.clamp;
function section(stations){
 return y=>{
  let i=0;while(i<stations.length-2&&y>stations[i+1][0])i++;
  const a=stations[i],b=stations[i+1],t=clamp((y-a[0])/(b[0]-a[0]),0,1);
  const before=stations[Math.max(0,i-1)],after=stations[Math.min(stations.length-1,i+2)];
  const ma=(b[1]-before[1])/(b[0]-before[0]),mb=(after[1]-a[1])/(after[0]-a[0]);
  return (2*t**3-3*t*t+1)*a[1]+(t**3-2*t*t+t)*(b[0]-a[0])*ma+(-2*t**3+3*t*t)*b[1]+(t**3-t*t)*(b[0]-a[0])*mb;
 };
}
const frontSection=section([[.245,-1.81],[.285,-1.937],[.365,-2.012],[.465,-2.026],[.517,-2.029],[.548,-2.020],[.599,-1.920],[.625,-1.790]]);
const rearSection=section([[.245,1.884],[.280,1.984],[.350,2.023],[.437,2.024],[.520,2.012],[.565,2.001],[.605,1.987],[.700,1.940],[.750,1.904],[.780,1.867]]);
function crown(x,inner,rear){
 const a=Math.abs(x);
 if(a<=inner)return .012*(1-(a/inner)**2);
 const z=rear?1.867:-1.790,t=clamp((a-inner)/(shoulderWidth(z)-inner),0,1);
 return -shoulderDrop(z,rear)*(1-Math.sqrt(1-t*t));
}
function width(v,rear){return lerp(.8065,shoulderWidth(rear?1.867:-1.790),v)+.015*Math.sin(v*Math.PI);}
function point(x,y,rear){
 const top=rear?.780:.625,join=rear?1.867:-1.790;
 const v=clamp((y-.245)/(top+crown(x,rear?.650:.659,rear)-.245),0,1);
 const z=(rear?rearSection:frontSection)(lerp(.245,top,v));
 const w=width(v,rear),corner=rear?.604:.588,q=clamp((Math.abs(x)-corner)/(w-corner),0,1);
 // An elliptical corner meets the adjoining side panel tangentially.
 const turn=1-Math.sqrt(Math.max(0,1-q*q));
 const bow=(rear?-1:1)*.018*(Math.abs(x)/w)**2*(1-turn);
 const finalZ=lerp(z,join,turn)+bow;
 return [x,y+(rear?rearLowerRise(finalZ,y):0),finalZ];
}
export const frontFace=(x,y)=>point(x,y,false);
export const rearFace=(x,y)=>point(x,y,true);

export function buildFascias(h){
 const {surface,tube,box,label}=h;
 for(const rear of [false,true]){
  const id=rear?'rear-fascia':'nose',top=rear?.780:.625;
  surface(id,112,64,(u,v)=>{const x=(u*2-1)*width(v,rear),y=lerp(.245,top+crown(x,rear?.650:.659,rear),v);return point(x,y,rear);});
 }
 // Rounded contour patch follows the underlying fascia, including its wrap.
 function patch(id,face,cx,cy,w,h,offset,mat){
  surface(id,96,14,(u,v)=>{
   const a=u*Math.PI*2,dx=Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.25*w/2,dy=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.25*h/2;
   const p=face(cx+dx*v,cy+dy*v);p[2]+=offset;return p;
  },mat);
 }
 function molding(id,face,y,offset){
  for(const dy of [-.006,0,.006])tube(id,Array.from({length:97},(_,i)=>{const p=face(lerp(-.827,.827,i/96),y+dy);p[2]+=offset;return p;}),dy===0?.0045:.003,'rubber');
 }
 molding('nose',frontFace,.520,-.004);
 molding('rear-fascia',rearFace,.563,.004);
 for(const s of [-1,1]){
  // Paired low bumper pads, with inset front park/turn lamps.
  patch('nose',frontFace,s*.480,.382,.610,.142,-.006,'rubber');
  patch('nose',frontFace,s*.557,.365,.111,.032,-.008,'indicator');
  patch('rear-fascia',rearFace,s*.480,.375,.612,.157,.007,'rubber');
  patch('rear-fascia',rearFace,s*.635,.352,.096,.025,.009,'dark');
 }
 patch('nose',frontFace,0,.355,.265,.116,-.006,'dark');
 patch('rear-fascia',rearFace,0,.375,.337,.151,.005,'dark');
 const plate=rearFace(0,.375);
 label('rear-fascia','PONTIAC',[.282,.079],[0,plate[1],plate[2]+.009],[0,0,0],{background:'#d8d9d0',foreground:'#34393b',font:'bold 52px Arial',border:true});
 label('rear-fascia','P O N T I A C',[.41,.024],[0,.499,rearFace(0,.499)[2]+.002],[0,0,0],{background:'transparent',foreground:'#756965',font:'48px Arial'});
 const badge=rearFace(.50,.767),badgeSlope=(rearFace(.50,.768)[2]-rearFace(.50,.766)[2])/.002;
 label('rear-fascia','Fiero 2M6',[.158,.023],[badge[0],badge[1]+.001,badge[2]+.002],[Math.atan(badgeSlope),0,0],{background:'transparent',foreground:'#c7c8c5',font:'italic 62px Arial'});
 // Thin lower front deflector follows the rolled-under edge.
 surface('nose',72,8,(u,v)=>{const x=(u*2-1)*.772;const p=frontFace(x,.248);return [x,p[1]-v*.025,p[2]+v*.016];},'rubber');
 // Notchback tail lenses rake forward into the rolled deck edge. The
 // center split and fine optical grid stay on the curved lens surface.
 patch('taillights',rearFace,0,.670,1.496,.128,.004,'blackPaint');
 for(const s of [-1,1]){
  patch('taillights',rearFace,s*.376,.670,.717,.112,.006,'smokedLamp');
  patch('taillights',rearFace,s*.118,.670,.076,.088,.007,'reverseLens');
  for(let i=0;i<38;i++){
   const x=s*(.026+i*.0187);
   tube('taillights',Array.from({length:9},(_,j)=>{const p=rearFace(x,.626+j/8*.088);p[2]+=.0076;return p;}),.00045,'lensGrid');
  }
  for(let j=0;j<7;j++)tube('taillights',Array.from({length:49},(_,i)=>{const p=rearFace(s*(.030+i/48*.686),.626+j*.0147);p[2]+=.0076;return p;}),.00045,'lensGrid');
 }
}
