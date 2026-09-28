import * as T from 'three';
import {bodyPoint,authoredBodyPoint} from './body-datums.js';
const lerp=T.MathUtils.lerp;
const blend=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
const bezier=(a,b,c,d,t)=>a.map((x,i)=>x*(1-t)**3+3*b[i]*t*(1-t)**2+3*c[i]*t*t*(1-t)+d[i]*t**3);
// Shared reconstructed glazing boundaries, not replacement-glass templates.
const windshieldDatum=(u,v)=>{const a=2*u-1,corner=.022*Math.exp(-v*55)+.032*Math.exp(-(1-v)*55);return [a*(lerp(.773,.583,v)-corner),lerp(.817,1.145,v)+(.012+.012*v)*(1-a*a),lerp(-.612,-.118,v)-.028*(1-a*a)];};
export const windshield=(u,v)=>{
 const a=bodyPoint(windshieldDatum(u,0)),b=bodyPoint(windshieldDatum(u,1)),p=blend(a,b,v);
 p[0]=windshieldDatum(u,v)[0];p[2]-=.006*Math.sin(v*Math.PI);return authoredBodyPoint(p);
};
// Pontiac 1985 catalog p12: the swept A-post turns into the roof rail ahead
// of the header edge. The 44 mm head correction and the paint/trim land below
// the windshield are reconstructed from the photos, not published ordinates.
const postFoot=bodyPoint([.787,.818,-.568]),postHead=bodyPoint([.619,1.132,-.096]);
export const aPost=t=>{const p=blend(postFoot,postHead,t),c=Math.sin(t*Math.PI);p[0]+=.003*c;p[1]+=.002*c;p[2]-=.002*c;return authoredBodyPoint(p);};
export const rail=t=>bezier([.619,1.132,-.096],[.603,1.166,-.026],[.610,1.155,.409],[.623,1.136,.470],t);
export const windowTop=u=>u<.48?aPost(u/.48):rail((u-.48)/.52);
export const sideWindow=(s,u,v)=>{const p=blend([.787,.814,lerp(-.568,.572,u)],windowTop(u),v);p[0]+=.009*Math.sin(v*Math.PI)*Math.sin(u*Math.PI);p[0]*=s;return p;};
