import {tailLampShape as A,tailLampEdges,tailLampOutline} from './tail-lamp-shape.js';
import {exteriorLampNominal} from './body-datums.js';

// Shared vehicle/detail construction. Positions are still in the electrical
// assembly frame here; the caller wraps every layer onto the same rear face.
export function buildTailLamp(h,groups,s,id,e){
 const {plate,bowl,bulb,socket,screw}=e;
 const local=(a,y,z)=>[s*(a-A.centerX),y,z];
 const outline=inset=>tailLampOutline(inset).map(([x,y])=>local(x,y-A.centerY,0));
 function border(key,outset,inset,z,depth,mat){
  const outer=outline(outset),inner=outline(inset),n=outer.length;
  h.surface(id(key),n,3,(u,v)=>{const i=Math.min(n-1,Math.floor(u*n)),j=(i+1)%n,t=u*n-i;const p=outer[i].map((a,k)=>a+(outer[j][k]-a)*t),q=inner[i].map((a,k)=>a+(inner[j][k]-a)*t);return[p[0]+(q[0]-p[0])*v,p[1]+(q[1]-p[1])*v,z+depth*Math.sin(v*Math.PI)];},mat);
 }
 const centers=[['tail',exteriorLampNominal.tailOutside,'2057'],['turn',exteriorLampNominal.rearTurnOffset,'2057'],['inner-stop',A.innerStopOffset,'2057'],['reverse',A.reverseOffset,'1156']];
 plate(id('housing'),.777,.110,.003,[0,0,-.078],'plastic',centers.map(([,x])=>[s*(x-A.centerX),0,.012]));
 border('housing',-.004,.003,-.008,.002,'plastic');
 const rim=outline(-.004),n=rim.length;
 h.surface(id('housing'),n,8,(u,v)=>{const i=Math.min(n-1,Math.floor(u*n)),j=(i+1)%n,t=u*n-i;return[rim[i][0]+(rim[j][0]-rim[i][0])*t,rim[i][1]+(rim[j][1]-rim[i][1])*t,-.010-.070*v];},'plastic');
 // Three red chambers plus one reverse chamber; the inboard end is a blind
 // portion of the clear insert, not a second reverse bulb.
 for(const [,a] of centers)bowl(id('housing'),.134,.098,.057,local(a,0,-.012));
 for(const a of [.188,.328,.468,.608])h.box(id('housing'),[.0025,.108,.063],local(a,0,-.045),'plastic');
 h.box(id('housing'),[.166,.106,.003],local(.100,0,-.026),'plastic');

 function opticalInsert(key,start,end,mat,columns){
  const bottom=-.052,top=.052;
  const at=(a,y,z)=>{const edge=tailLampEdges(y,.006);return local(Math.max(edge[0],Math.min(edge[1],a)),y,z);};
  h.surface(id(key),64,12,(u,v)=>at(start+(end-start)*u,bottom+(top-bottom)*v,A.opticDepth),mat);
  // Six rows of wide rectangular prisms are behind the smooth outer cover.
  // Count/proportions follow the original-part photographs and DIY drawing;
  // pitch/depth are not claimed to be dimensioned factory optical tooling.
  for(let c=0;c<columns;c++)for(let r=0;r<A.rows;r++){
   const x0=start+(end-start)*c/columns+.0010,x1=start+(end-start)*(c+1)/columns-.0010;
   const y0=bottom+(top-bottom)*r/A.rows+.0008,y1=bottom+(top-bottom)*(r+1)/A.rows-.0008;
   h.surface(id(key),12,4,(u,v)=>at(x0+(x1-x0)*u,y0+(y1-y0)*v,A.opticDepth+.0002+.00030*Math.sin(v*Math.PI)+.00025*Math.sin(u*Math.PI*6)**2),mat);
  }
  for(let c=0;c<=columns;c++){const a=start+(end-start)*c/columns;h.surface(id(key),2,16,(u,v)=>at(a+(u-.5)*.0018,bottom+(top-bottom)*v,A.opticDepth+.0018),'tailGrid');}
  for(let r=0;r<=A.rows;r++){const y=bottom+(top-bottom)*r/A.rows;h.surface(id(key),64,2,(u,v)=>at(start+(end-start)*u,y+(v-.5)*.0015,A.opticDepth+.0018),'tailGrid');}
 }
 opticalInsert('red-lens',A.redInner,A.redOuter,'tailInnerRed',12);
 opticalInsert('reverse-lens',A.reverseInner,A.reverseOuter,'tailInnerClear',8);

 h.surface(id('outer-lens'),96,24,(u,v)=>{const y=(v*2-1)*A.halfHeight,[l,r]=tailLampEdges(y);return local(l+(r-l)*u,y,A.coverDepth+.001*Math.sin(u*Math.PI)*Math.sin(v*Math.PI));},'tailOuter');
 const edge=outline(0);
 h.surface(id('outer-lens'),edge.length,5,(u,v)=>{const i=Math.min(edge.length-1,Math.floor(u*edge.length)),j=(i+1)%edge.length,t=u*edge.length-i;return[edge[i][0]+(edge[j][0]-edge[i][0])*t,edge[i][1]+(edge[j][1]-edge[i][1])*t,A.coverDepth-.020*v];},'tailOuter');
 border('outer-lens',0,.0035,A.coverDepth+.0003,.0004,'tailTrim');
 border('seal',-.005,-.001,-.007,.001,'rubber');
 for(const [key,a,type]of centers){bulb(id(key+'-bulb'),local(a,0,-.066),type);socket(id(key+'-socket'),local(a,0,-.081),key==='turn'||key==='inner-stop');}
 for(const a of [.105,.394,.685]){const x=s*(a-A.centerX);screw(id('retainers'),[x,.071,-.028],.004,.075,'y');plate(id('retainers'),.015,.013,.003,[x,-.060,-.027],'zinc',[[0,0,.002]],.002);plate(id('access-caps'),.025,.017,.003,[x,0,0],'plastic',[],.003);const m=groups.get(id('access-caps')).children.at(-1);m.rotation.x=-Math.PI/2;m.position.set(x,.080,-.028);}
}
