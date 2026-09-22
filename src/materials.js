import * as T from 'three';

// Authored procedural material detail, not photographs of another vehicle.
function texture(kind,size=256){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');
 const img=ctx.createImageData(size,size);let seed=8193;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const grain=random();let value=128;
  if(kind==='cast')value=105+grain*62;
  if(kind==='vinyl')value=120+grain*20+Math.sin(x*.5)*Math.sin(y*.5)*15;
  if(kind==='cloth')value=110+grain*30+((x%4<2)!==(y%4<2)?28:0);
  if(kind==='rubber')value=110+grain*14;
  if(kind==='brushed'){const r=Math.hypot(x-size/2,y-size/2);value=125+Math.sin(r*4)*16+grain*8;}
  const i=(y*size+x)*4;img.data[i]=img.data[i+1]=img.data[i+2]=value;img.data[i+3]=255;
 }
 ctx.putImageData(img,0,0);const t=new T.CanvasTexture(canvas);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='cloth'?4:2,kind==='cloth'?4:2);t.anisotropy=4;return t;
}
export function createMaterials(){
 const cast=texture('cast'),vinyl=texture('vinyl'),cloth=texture('cloth'),rubber=texture('rubber'),brushed=texture('brushed');
 const standard=(color,metalness,roughness,extra={})=>new T.MeshStandardMaterial({color,metalness,roughness,...extra});
 return {
  red:new T.MeshPhysicalMaterial({color:'#a80912',metalness:0,roughness:.3,clearcoat:.7,clearcoatRoughness:.28,envMapIntensity:.60}),
  dark:standard('#191c1e',.45,.36),
  frame:standard('#26292a',.55,.48,{bumpMap:cast,bumpScale:.00025}),
  blackPaint:new T.MeshPhysicalMaterial({color:'#101214',metalness:.1,roughness:.29,clearcoat:.8,clearcoatRoughness:.18}),
  metal:standard('#9d9e9d',.85,.39,{bumpMap:cast,bumpScale:.0011}),
  alloy:standard('#babdc0',.95,.22),
  rotor:standard('#979c9f',1,.34,{bumpMap:brushed,bumpScale:.0006}),
  iron:standard('#454746',.65,.7,{bumpMap:cast,bumpScale:.002}),
  rubber:standard('#101112',0,.88,{bumpMap:rubber,bumpScale:.001}),
  plastic:standard('#1f2022',0,.7,{bumpMap:vinyl,bumpScale:.001}),
  sailGlass:new T.MeshPhysicalMaterial({color:'#192123',metalness:.12,roughness:.15,clearcoat:1,clearcoatRoughness:.07,side:T.DoubleSide}),
  glass:new T.MeshPhysicalMaterial({color:'#bac9c6',metalness:0,roughness:.06,transmission:.88,thickness:.004,ior:1.52,attenuationColor:'#8ba59b',attenuationDistance:.12,side:T.DoubleSide}),
  headlampGlass:new T.MeshPhysicalMaterial({color:'#f5f7f4',roughness:.12,transmission:.92,thickness:.006,ior:1.52,side:T.DoubleSide}),
  headlampFlute:new T.MeshPhysicalMaterial({color:'#d7dedb',roughness:.19,metalness:.05,transparent:true,opacity:.35,clearcoat:1}),
  interior:standard('#737779',0,.89,{bumpMap:cloth,bumpScale:.0018}),
  vinyl:standard('#41464a',0,.66,{bumpMap:vinyl,bumpScale:.0014}),
  blue:standard('#6e7679',.94,.28),
  amber:standard('#d8b985',0,.95),
  white:standard('#d3d4cb',.1,.22,{emissive:'#e2e1c6',emissiveIntensity:.08}),
  reservoir:new T.MeshPhysicalMaterial({color:'#d9d8c9',roughness:.43,metalness:0,transparent:true,opacity:.9}),
  lamp:new T.MeshPhysicalMaterial({color:'#a41411',metalness:0,roughness:.2,clearcoat:1,emissive:'#89130b',emissiveIntensity:.12}),
  lensGrid:standard('#232423',0,.67),
  smokedLamp:new T.MeshPhysicalMaterial({color:'#402d29',roughness:.22,metalness:.12,clearcoat:1,clearcoatRoughness:.12}),
  reverseLens:new T.MeshPhysicalMaterial({color:'#60655f',roughness:.23,metalness:.15,clearcoat:1}),
  indicator:new T.MeshPhysicalMaterial({color:'#a34908',roughness:.24,clearcoat:1}),
  wire:standard('#27292a',0,.78),
  castAluminum:standard('#9ba0a2',.82,.40,{bumpMap:cast,bumpScale:.00012}),
  zinc:standard('#a9adb0',.92,.29),
  copper:standard('#b3773e',.92,.28),
  ceramic:new T.MeshPhysicalMaterial({color:'#efeee2',metalness:0,roughness:.19,clearcoat:.65,clearcoatRoughness:.12}),
  phenolic:new T.MeshPhysicalMaterial({color:'#252121',roughness:.32,metalness:0,clearcoat:.35,clearcoatRoughness:.28}),
  silicone:standard('#272a2c',0,.55),
  pickupPlastic:standard('#cfbe8c',0,.6),
  wireGreen:standard('#536e48',0,.6),
  wireWhite:standard('#b6afa0',0,.6),
  wirePink:standard('#975d69',0,.6),
  wireTan:standard('#987b54',0,.6),
  wirePurple:standard('#695573',0,.6),
  chrome:standard('#d6d8da',1,.12),
  gold:standard('#967f45',.85,.4),
 };
}
export function textMaterial(text,{background='#161a1c',foreground='#c9cbd0',width=512,height=128,font='bold 62px Arial',border=false}={}){
 const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,width,height);if(border){ctx.strokeStyle=foreground;ctx.lineWidth=4;ctx.strokeRect(8,8,width-16,height-16);}ctx.fillStyle=foreground;ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,width/2,height/2,width-20);
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return new T.MeshStandardMaterial({map,roughness:.55,metalness:.15,side:T.DoubleSide,transparent:background==='transparent',alphaTest:background==='transparent'?.1:0});
}
