import {coverageAudit} from './coverage.js';
import './style.css';
import { vehicle, systems, parts, tours, sources, acceptance } from './data.js';
import { createViewer } from './viewer.js';
import {engineParts,enginePartById,engineSections,engineSectionById,engineMembers,engineSource} from './engine-catalog.js';
import { defaultConfiguration, sanitizeConfiguration, options, paints, referenceOptions, factoryDimensions } from './configuration.js';

const paths={
 car:'M3 15V9l3-5h12l3 5v6M3 10h18M5 15v4m14-4v4M7 13h2m6 0h2',
 layers:'m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
 engine:'M5 8h12v10H5zM8 5h6M11 5v3M2 10v6m0-3h3m12-3h3v6h-3M8 11v4m3-4v4m3-4v4',
 gear:'m9 3-1 3-3 1-2 3 2 2-1 4 3 1 2 4h5l1-3 4-1 2-4-2-2 1-4-4-1-2-3H9Zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
 spring:'M8 3h8M12 3v3m-5 1 10 3-10 3 10 3-10 3m5 0v2m-4 0h8',
 disc:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0M12 5v1m0 12v1M5 12h1m12 0h1',
 water:'M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12ZM8 15c0 2 1 3 3 3',
 flow:'M3 7h10a4 4 0 0 1 0 8H9m-6 0h3m12 0h3M6 4 3 7l3 3m12 2 3 3-3 3',
 bolt:'m13 2-9 12h7l-1 8 10-13h-8l1-7Z',
 seat:'M6 3v10h11l3 7M6 13l-2 6h12M9 3H6m3 3v4h8',
 search:'m20 20-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
 arrow:'M5 12h14m-6-6 6 6-6 6',
 chevron:'m9 5 7 7-7 7',
 reset:'M4 10a8 8 0 1 1 1 8M4 4v6h6',
 eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 focus:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M9 9h6v6H9z',
 tag:'M3 3h8l10 10-8 8L3 11V3Zm4 4h.01',
 expand:'M3 8V3h5m8 0h5v5M3 16v5h5m13-5v5h-5',
 check:'m5 12 4 4L19 6',
 close:'m6 6 12 12M6 18 18 6',
 book:'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15',
 download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
 note:'M4 3h16v18H4zM8 8h8m-8 4h8m-8 4h5',
 play:'m8 4 12 8-12 8V4Z',
 menu:'M4 6h16M4 12h16M4 18h16',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10v1',
 cube:'m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M12 12 3 7m9 5v10'
};
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.cube}"/></svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readStorage(){try{return JSON.parse(localStorage.getItem('fiero-uat-v1'))||{notes:[],checks:[]};}catch{return {notes:[],checks:[]};}}
let saved=readStorage();if(!Array.isArray(saved.notes)||!Array.isArray(saved.checks))saved={notes:[],checks:[]};
let configuration={...defaultConfiguration};try{configuration=sanitizeConfiguration(JSON.parse(localStorage.getItem('fiero-configuration-v2'))||{});}catch{}
let vehicleReturn=null;
const state={assembly:null,assemblyExplode:0,system:'all',selected:null,tab:'component',query:'',hideBody:false,isolate:false,explode:0,labels:false,wireframe:false,tour:null,step:0,camera:'home',configuration};
let viewer,toastTimer;
document.querySelector('#app').innerHTML=`
 <header class="header">
  <a class="brand" href="#" aria-label="Fiero Workshop home"><span class="brand-mark">F<span>↗</span></span><span class="brand-type">FIERO<span>WORKSHOP / 85</span></span></a>
  <div class="header-divider"></div><div class="vehicle-title"><strong>1985 Pontiac Fiero <span>SE 2M6</span></strong><span>2.8L V6 <i></i> 4-speed manual <i></i> WS6</span></div>
  <div class="header-actions"><span class="build-badge"><i></i> VISUAL REVIEW 0.2</span><button class="quiet" data-action="configure">${icon('gear')}<span>Configure</span></button><button class="quiet" data-action="sources">${icon('book')}<span>Reference library</span></button></div>
 </header>
 <div class="workspace-bar"><div class="workspace-label"><span class="tiny-square"></span> INTERACTIVE WORKSHOP <span class="slash">/</span> <span class="muted">VEHICLE EXPLORER</span></div><span class="vin">VIN ${vehicle.vin}</span></div>
 <main class="workspace">
  <aside class="sidebar" aria-label="Systems and components">
   <div class="sidebar-heading"><div><p class="eyebrow">YOUR VEHICLE</p><h1>Assembly explorer</h1></div><button class="icon-button mobile-close" data-action="menu" aria-label="Close assemblies">${icon('close')}</button></div>
   <div class="search-wrap">${icon('search')}<input id="search" type="search" autocomplete="off" placeholder="Find a component…" aria-label="Search components"/><span class="key-hint">/</span></div>
   <p class="section-label">SYSTEMS <span id="system-count">09</span></p><nav id="systems" aria-label="Vehicle systems"></nav>
   <div class="parts-heading"><p class="section-label">COMPONENTS <span id="part-count"></span></p><button class="text-button" data-action="clear-search" id="clear-search" hidden>Clear</button></div>
   <div id="part-list" class="part-list"></div>
   <div class="sidebar-footer">${icon('cube')}<span>Original configuration<br/><strong>WS6 handling package</strong></span><span class="status-dot"></span></div>
  </aside>
  <section class="stage" aria-label="3D vehicle explorer">
   <div class="stage-heading"><div><p class="eyebrow" id="stage-kicker">01 / COMPLETE VEHICLE</p><h2 id="stage-title">Anatomy of a Fiero<span>.</span></h2><p id="stage-subtitle">A different perspective on every part.</p></div><div class="stage-badges"><span>FACTORY-NEW FINISH</span><span class="outline-badge">REFERENCE RECONSTRUCTION</span></div></div>
   <div id="viewport"><div class="loading-state" id="loading">${icon('cube')}<span>Preparing your workshop…</span></div></div>
   <button class="assembly-return secondary" data-action="exit-assembly" hidden>← Back to vehicle</button><div class="view-tools"><button class="icon-button mobile-menu" data-action="menu" aria-label="Open assemblies">${icon('menu')}</button><button class="icon-button" data-action="reset" title="Reset view" aria-label="Reset view">${icon('reset')}</button><span class="tool-separator"></span><button class="icon-button" data-action="body" title="Hide body panels" aria-label="Hide body panels" aria-pressed="false">${icon('layers')}</button><button class="icon-button" data-action="labels" title="Component labels" aria-label="Component labels" aria-pressed="false">${icon('tag')}</button><button class="icon-button" data-action="wireframe" title="Wireframe" aria-label="Wireframe" aria-pressed="false">${icon('cube')}</button><button class="icon-button" data-action="fullscreen" title="Fullscreen viewer" aria-label="Fullscreen viewer">${icon('expand')}</button></div>
   <div class="camera-views" role="group" aria-label="Camera views">${['home','front','rear','side','top'].map((v,i)=>`<button data-view="${v}" aria-pressed="${i===0}">${v==='home'?'Perspective':v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div>
   <div class="stage-bottom"><div class="interaction-hint"><span>↔</span> Drag to orbit <b>·</b> Scroll to zoom <b>·</b> Click to inspect</div><div class="explode-control"><div><label for="explode">EXPLODED VIEW</label><output id="explode-value" for="explode">0%</output></div><input type="range" id="explode" min="0" max="100" value="0" aria-label="Exploded view"/><div class="range-ends"><span>Assembled</span><span>Separated</span></div></div></div>
   <div class="stage-footnote"><span class="status-dot"></span><span id="render-status">3D reconstruction · factory reference proportions</span><span id="selection-count">${parts.length} assemblies</span></div>
  </section>
  <aside class="inspector" aria-label="Component information and walkthroughs"><nav class="inspector-tabs" aria-label="Inspector pages">${[['component','Inspect'],['tours','Guides'],['specs','Specs'],['config','Options'],['uat','UAT']].map(([id,label])=>`<button data-tab="${id}" aria-pressed="${id==='component'}">${label}</button>`).join('')}</nav><div id="inspector-content"></div></aside>
 </main>
 <div class="bottom-bar"><span><i class="status-dot"></i> LOCAL WORKSPACE</span><span>1985 / SE 2M6 / WS6</span><button class="text-button" data-action="about">About this build ${icon('info')}</button></div>
 <dialog id="modal"><div id="modal-content"></div></dialog><div class="toast" role="status" aria-live="polite" hidden></div>`;

function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3300);}
function persist(){try{localStorage.setItem('fiero-uat-v1',JSON.stringify(saved));return true;}catch{toast('Browser storage is unavailable. Export feedback before leaving.');return false;}}
function getPart(){return state.assembly?enginePartById.get(state.selected):parts.find(p=>p.id===state.selected);}
function systemName(id){return systems.find(s=>s.id===id)?.name||'Whole vehicle';}
function renderSystems(){document.querySelector('#system-count').textContent=String(state.assembly?engineSections.filter(s=>s.id!=='engine'&&!s.parent).length:systems.length-1).padStart(2,'0');if(state.assembly){document.querySelector('#systems').innerHTML=engineSections.filter(s=>!s.parent||state.assembly===s.parent||engineSectionById.get(state.assembly)?.parent===s.parent).map(s=>`<button class="system-button ${state.assembly===s.id?'active':''} ${s.parent?'nested-system':''}" data-assembly="${s.id}" aria-pressed="${state.assembly===s.id}">${icon('engine')}<span>${s.name}</span><small>${engineMembers(s.id).length}</small></button>`).join('');return;}document.querySelector('#systems').innerHTML=systems.map(s=>`<button class="system-button ${state.system===s.id?'active':''}" data-system="${s.id}" aria-pressed="${state.system===s.id}">${icon(s.icon)}<span>${s.name}</span><small>${s.id==='all'?parts.length:parts.filter(p=>p.system===s.id).length}</small></button>`).join('');}
function renderParts(){
 const q=state.query.trim().toLowerCase();
 const tokens=q.replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean);
 const matches=p=>{const text=`${p.name} ${p.description} ${p.location} ${p.aliases||''} ${systemName(p.system)}`.toLowerCase().replace(/[^a-z0-9]+/g,' ');return tokens.every(t=>text.includes(t));};
 const candidates=state.assembly?engineMembers(state.assembly):q?[...parts,...engineParts]:parts.filter(p=>state.system==='all'||p.system===state.system);
 const filtered=candidates.filter(p=>!q||matches(p));
 document.querySelector('#part-count').textContent=String(filtered.length).padStart(2,'0');document.querySelector('#clear-search').hidden=!q;
 document.querySelector('#part-list').innerHTML=filtered.length?filtered.map(p=>`<button class="part-button ${state.selected===p.id?'active':''}" data-part="${p.id}" aria-pressed="${state.selected===p.id}"><span class="part-dot" style="--part-color:${systems.find(s=>s.id===p.system).color}"></span><span>${p.name}${!state.assembly&&enginePartById.has(p.id)?`<small class="part-scope">Engine / ${engineSectionById.get(p.section).name}</small>`:''}</span>${icon('chevron')}</button>`).join(''):`<div class="empty-state">No components match “${esc(state.query)}”.<br/><button class="text-button" data-action="clear-search">Clear search</button></div>`;
}
function notice(text='Geometry is illustrative. Repair procedures and service specifications await factory verification.'){return `<div class="notice">${icon('info')}<p>${text}</p></div>`;}
function configurationPanel(){
 return `<p class="eyebrow">FACTORY-NEW / CONFIGURATION PREVIEW</p><h2>Explore the options.</h2><p class="description">Your VIN confirms the SE / V6 identity. Paint, trim and accessories below are selectable previews, not a decoded build sheet.</p>
 <div class="config-shortcuts"><button class="secondary" data-action="show-exterior">Exterior</button><button class="secondary" data-action="show-cabin">Cabin</button><button class="secondary" data-action="show-chassis">Chassis</button></div>
 <div class="config-view"><label><input type="checkbox" data-config="headlights" ${state.configuration.headlights?'checked':''}/> Raise headlights</label><label><input type="checkbox" data-config="dimensions" ${state.configuration.dimensions?'checked':''}/> Factory dimensions</label><label>Studio <select data-config="studio" aria-label="Studio lighting"><option value="light" ${state.configuration.studio==='light'?'selected':''}>Light</option><option value="dark" ${state.configuration.studio==='dark'?'selected':''}>Dark</option></select></label><label>Side windows <select data-config="windows" aria-label="Side windows"><option value="closed" ${state.configuration.windows==='closed'?'selected':''}>Closed</option><option value="open" ${state.configuration.windows==='open'?'selected':''}>Open</option></select></label></div>
 <p class="section-label">LIVE 3D VARIANTS</p>${options.map(o=>`<div class="config-option"><div class="config-option-control"><label for="config-${o.key}">${o.label}</label>${o.type==='toggle'?`<input id="config-${o.key}" type="checkbox" data-config="${o.key}" ${state.configuration[o.key]?'checked':''}/>`:o.type==='select'?`<select id="config-${o.key}" data-config="${o.key}">${o.choices.map(([v,label])=>`<option value="${v}" ${state.configuration[o.key]===v?'selected':''}>${label}</option>`).join('')}</select>`:''}</div>${o.type==='paint'?`<div class="paint-swatches" role="group" aria-label="Exterior finish">${paints.map(p=>`<button data-paint="${p.id}" aria-label="${p.name} paint" title="${p.name}" aria-pressed="${state.configuration.paint===p.id}" style="--swatch:${p.color}"><span></span></button>`).join('')}<small>${paints.find(p=>p.id===state.configuration.paint).name}</small></div>`:''}<p>${o.note}</p></div>`).join('')}
 <div class="notice">${icon('info')}<p>Switching a visual option does not establish real-world interchangeability. Brackets, wiring, controls, trim-specific requirements and installation steps still need verification.</p></div>
 <details class="pending-options"><summary>Additional factory alternatives · reference only</summary>${referenceOptions.map(([name,note])=>`<article><strong>${name}</strong><p>${note}</p></article>`).join('')}</details>
 <button class="secondary full-width" data-action="reset-configuration">Reset preview choices</button><button class="text-button reference-link" data-action="sources">Factory sources & asset credits ${icon('arrow')}</button>`;
}
function saveConfiguration(){try{localStorage.setItem('fiero-configuration-v2',JSON.stringify(state.configuration));}catch{toast('Preview changed; browser storage is unavailable.');}viewer?.update(state);if(state.tab==='config')renderInspector();}
function renderInspector(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===state.tab));
 const panel=document.querySelector('#inspector-content');const part=getPart();
 if(state.tab==='component'&&state.assembly){panel.innerHTML=engineInspector(part);return;}
 if(state.tab==='component')panel.innerHTML=part?`
  <p class="eyebrow">${esc(systemName(part.system))}</p><div class="component-heading"><h2>${part.name}</h2><span class="part-number">${String(parts.indexOf(part)+1).padStart(2,'0')}</span></div><span class="pill">${icon('cube')} ILLUSTRATIVE GEOMETRY</span><p class="description">${part.description}</p>
  <div class="detail-actions"><button class="primary" data-action="focus">${icon('focus')} Focus part</button><button class="secondary ${state.isolate?'selected':''}" data-action="isolate" aria-pressed="${state.isolate}">${icon('eye')} ${state.isolate?'Show context':'Isolate'}</button></div>
  ${part.assembly?`<button class="primary full-width engine-entry" data-assembly="${part.assembly}">${icon('layers')} Explode this assembly</button>`:part.system==='engine'?engineEntry():''}
  <div class="detail-table"><div><span>Location</span><strong>${part.location}</strong></div><div><span>Assembly</span><strong>${systemName(part.system)}</strong></div><div><span>Configuration</span><strong>1985 SE · original</strong></div><div><span>${part.catalog?'Catalog reference':'Part number'}</span><strong class="${part.catalog?'':'pending'}">${part.catalog?esc(part.catalog.number):'Not yet verified'}</strong></div><div><span>Service specifications</span><strong class="pending">Not yet verified</strong></div></div>
  ${part.catalog?`<p class="description small">${esc(part.catalog.applies)}<br/><a href="${part.catalog.url}" target="_blank" rel="noopener noreferrer">${esc(part.catalog.reference)} ↗</a><br/>Dated catalog reference; current availability and interchangeability are not established.</p>`:''}
  <p class="section-label">RELATED EXPLORATION</p><button class="guide-link" data-tour="${part.system==='suspension'?'suspension':part.id.startsWith('air')?'air-cleaner':'orientation'}">${icon('play')}<span>${part.system==='suspension'?'Explore the WS6 chassis':part.id.startsWith('air')?'Air cleaner assembly':'Meet the mid-engine layout'}<small>Interactive 3D walkthrough</small></span>${icon('arrow')}</button>
  ${notice()}<button class="text-button reference-link" data-action="sources">Open reference library ${icon('arrow')}</button><button class="text-button" data-action="note-part">${icon('note')} Add a UAT note about this part</button>`:
  `<p class="eyebrow">BUILT AROUND YOUR CAR</p><h2>Your workshop,<br/>in another dimension.</h2><p class="description">Explore the assemblies that make your Fiero. Select a system, then a component to look closer.</p>
  <div class="vehicle-card"><div class="vehicle-card-top"><span>PONTIAC</span><strong>85</strong></div><h3>Fiero SE <span>2M6</span></h3><div class="vehicle-card-line"></div><div class="vehicle-card-specs"><span>2.8L<strong>V6 ENGINE</strong></span><span>4-SPD<strong>MANUAL</strong></span><span>WS6<strong>HANDLING</strong></span></div></div>
  ${engineEntry()}<p class="section-label">START EXPLORING</p>${tours.slice(0,2).map(t=>`<button class="guide-link" data-tour="${t.id}">${icon('play')}<span>${t.title}<small>${t.subtitle}</small></span>${icon('arrow')}</button>`).join('')}
  ${notice()}<div class="coverage"><span>UAT scope</span><strong>${parts.length} assemblies · 3 guided tours</strong><small>Interaction prototype. Full repair-manual content is still in development.</small></div>`;
 if(state.tab==='tours') {
  const tour=tours.find(t=>t.id===state.tour);
  panel.innerHTML=tour?`<button class="text-button back-button" data-action="exit-tour">← All guides</button><p class="eyebrow">3D ASSEMBLY WALKTHROUGH</p><h2>${tour.title}</h2><div class="tour-progress">${tour.steps.map((s,i)=>`<button data-step="${i}" class="${state.step===i?'current':state.step>i?'done':''}" aria-label="Step ${i+1}: ${s.title}" aria-current="${state.step===i?'step':'false'}">${i+1}</button>`).join('')}</div><p class="eyebrow">STEP ${state.step+1} OF ${tour.steps.length}</p><h3 class="step-title">${tour.steps[state.step].title}</h3><p class="description step-description">${tour.steps[state.step].text}</p><div class="tour-nav"><button class="secondary" data-action="prev-step" ${state.step===0?'disabled':''}>← Previous</button><button class="primary" data-action="next-step">${state.step===tour.steps.length-1?'Finish tour':'Next step'} ${icon('arrow')}</button></div>${notice('Assembly visualization only. These steps are not a validated repair procedure.')}<p class="section-label">IN THIS WALKTHROUGH</p><ol class="step-list">${tour.steps.map((s,i)=>`<li><button data-step="${i}" class="${state.step===i?'active':''}"><span>${state.step>i?'✓':String(i+1).padStart(2,'0')}</span>${s.title}</button></li>`).join('')}</ol>`:
   `<p class="eyebrow">LEARN BY EXPLORING</p><h2>Inside every assembly.</h2><p class="description">Guided 3D tours highlight components and move the camera as you explore.</p>${tours.map((t,i)=>`<button class="tour-card" data-tour="${t.id}"><span class="tour-card-top"><span>0${i+1} / ${t.id==='air-cleaner'?'ASSEMBLY DEMO':'SYSTEM TOUR'}</span>${icon(i===0?'engine':i===1?'layers':'spring')}</span><strong>${t.title}</strong><span class="tour-card-bottom">${t.subtitle}${icon('arrow')}</span></button>`).join('')}${notice('Verified repair procedures will be added after factory source review. Current guides demonstrate the interaction and assembly relationships.')}`;
 }
 if(state.tab==='specs') panel.innerHTML=`<p class="eyebrow">VEHICLE RECORD</p><h2>Known. Sourced.<br/>Traceable.</h2><p class="description">Vehicle identification is separated from technical values still awaiting verification.</p><div class="spec-group"><h3>Confirmed identification</h3>${[['Model year','1985','NHTSA'],['Make / model','Pontiac Fiero SE','NHTSA'],['Engine displacement','2.8 litres','NHTSA'],['Engine layout','V6','NHTSA'],['Assembly plant','Pontiac, Michigan','NHTSA'],['VIN check digit','Valid','NHTSA']].map(([k,v,s])=>`<div class="spec-row"><span>${k}<small>${s}</small></span><strong>${v}</strong></div>`).join('')}</div><div class="spec-group"><h3>Owner configuration</h3>${[['Transmission','Original 4-speed manual'],['Handling package','WS6'],['Originality','Owner-confirmed original']].map(([k,v])=>`<div class="spec-row"><span>${k}<small>Owner + factory configuration reference</small></span><strong>${v}</strong></div>`).join('')}</div><div class="spec-group"><h3>Pending factory verification</h3><p class="description small">Torque values, fluid capacities, alignment settings, spring codes, part numbers, service intervals, wiring pinouts, component dimensions and repair sequences.</p><p class="description small">Your paint, roof and accessory configuration cannot be decoded from the VIN. Use Options to preview alternatives; they do not change the confirmed vehicle record.</p></div><button class="secondary full-width" data-action="sources">${icon('book')} View sources & coverage</button>`;
 if(state.tab==='config')panel.innerHTML=configurationPanel();
 if(state.tab==='specs'){
  const section=document.createElement('div');section.className='spec-group';section.innerHTML=`<h3>Factory dimension references</h3><p class="description small">1985 Pontiac DIY manual, printed page 3-2. These anchor the reconstruction; detailed panel contours are not factory CAD.</p>${factoryDimensions.map(([k,v])=>`<div class="spec-row"><span>${k}<small>Factory DIY §3-2</small></span><strong>${v}</strong></div>`).join('')}`;panel.querySelector('.spec-group').after(section);
 }
 if(state.tab==='uat')panel.innerHTML=`<p class="eyebrow">USER ACCEPTANCE TESTING</p><h2>Make it your workshop.</h2><p class="description">Check the interactions, report anything confusing, and tell us what needs more detail. Notes stay in this browser.</p><div class="uat-progress"><span>${saved.checks.length} / ${acceptance.length} checks completed</span><div><i style="width:${saved.checks.length/acceptance.length*100}%"></i></div></div><div class="checklist">${acceptance.map((text,i)=>`<label><input type="checkbox" data-check="${i}" ${saved.checks.includes(i)?'checked':''}/><span>${text}</span></label>`).join('')}</div><form id="feedback-form"><label for="feedback">UAT note ${part?`<span>· ${part.name}</span>`:''}</label><textarea id="feedback" rows="4" maxlength="4000" required placeholder="What worked? What should change?"></textarea><div class="form-row"><select id="feedback-type" aria-label="Feedback type"><option>Observation</option><option>Bug</option><option>Model accuracy</option><option>Feature request</option></select><button class="primary" type="submit">Save note</button></div></form><div class="notes-heading"><p class="section-label">SAVED NOTES <span>${saved.notes.length}</span></p><button class="text-button" data-action="export">${icon('download')} Export</button></div><div class="saved-notes">${saved.notes.length?saved.notes.slice().reverse().map(n=>`<article><div><strong>${esc(n.type)}</strong><span>${new Date(n.date).toLocaleDateString()}</span></div>${n.part?`<small>${esc(n.part)}</small>`:''}<p>${esc(n.text)}</p></article>`).join(''):'<p class="description small">No notes yet. Your feedback will appear here.</p>'}</div>`;
}
function engineEntry(){return `<button class="primary full-width engine-entry" data-assembly="engine">${icon('layers')} Explore engine components</button><button class="secondary full-width ignition-entry" data-assembly="ignition">${icon('bolt')} Ignition & tune-up parts</button>`;}
function engineInspector(part){
 const section=engineSectionById.get(state.assembly),children=engineSections.filter(s=>state.assembly==='engine'?s.id!=='engine'&&!s.parent:s.parent===state.assembly);
 return `<nav class="assembly-breadcrumb" aria-label="Assembly path"><button class="text-button" data-action="exit-assembly">Vehicle</button><span>/</span><button class="text-button" data-assembly="engine">2.8L V6</button>${section.parent?`<span>/</span><button class="text-button" data-assembly="${section.parent}">${engineSectionById.get(section.parent).name}</button>`:''}${state.assembly!=='engine'?`<span>/</span><span>${section.name}</span>`:''}</nav>
 <p class="eyebrow">ENGINE COMPONENT EXPLORER</p><div class="component-heading"><h2>${part?part.name:section.name}</h2></div>
 <p class="description">${part?part.description:state.assembly==='engine'?'Separate the engine to inspect its internal components. Open a subassembly below for a closer breakdown.':'Use the engine explode slider to separate this subassembly. Select a component in the model or list to inspect it.'}</p>
 <div class="detail-actions"><button class="primary" data-action="assembly-explode">${icon('layers')} ${state.assemblyExplode>.95?'Reassemble':'Explode assembly'}</button><button class="secondary" data-action="frame-assembly">${icon('focus')} Fit assembly</button></div>
 ${part?`<div class="detail-actions"><button class="secondary" data-action="focus">Focus part</button><button class="secondary" data-action="isolate" aria-pressed="${state.isolate}">${state.isolate?'Show context':'Isolate'}</button></div><p class="description small">${part.source} · <a href="${part.sourceUrl||`${engineSource}#page=${part.source.endsWith('H-19')?14:17}`}" target="_blank" rel="noopener noreferrer">View reference ↗</a>${part.callout?` · callout ${part.callout}`:''}</p>${part.referenceNote?`<p class="description small">${part.referenceNote}</p>`:''}${part.serviceReference?`<section class="spec-group part-service-reference"><h3>${esc(part.serviceReference.title)}</h3>${part.serviceReference.rows.map(([key,value])=>`<div class="spec-row"><span>${esc(key)}</span><strong>${esc(value)}</strong></div>`).join('')}<p class="description small">${esc(part.serviceReference.note)}</p>${part.serviceReference.links.map(([label,url])=>`<p class="description small"><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a></p>`).join('')}</section>`:''}${part.section!==state.assembly?`<button class="secondary full-width" data-assembly="${part.section}">Open ${engineSectionById.get(part.section).name}</button>`:''}<button class="text-button reference-link" data-action="note-part">${icon('note')} Add a UAT note about this part</button>`:''}
 ${children.length?`<p class="section-label">OPEN A SUBASSEMBLY</p><div class="engine-section-list">${children.map(s=>`<button class="guide-link" data-assembly="${s.id}"><span>${s.name}<small>${engineMembers(s.id).length} selectable parts / sets</small></span>${icon('chevron')}</button>`).join('')}</div>`:`<button class="text-button reference-link" data-assembly="engine">← Complete engine</button>`}
 <details class="engine-coverage"><summary>Modeled components & reference limits</summary><p>${engineParts.length} selectable parts and grouped sets across ${engineSections.length-1} subassemblies. Includes rotating assembly, valve gear, intake, timing, lubrication, accessories and ${engineMembers('ignition').length} ignition parts / sets. Open individual valve gear, the distributor, thermostat, water pump, dipstick or oil-pressure sender for a closer breakdown.</p><p>Fasteners and some seals are grouped. Full harness routing, accessory internals and some catalog items remain missing. Shapes use GM engine and distributor illustrations, the 1985 EST diagram and documented replacement references; this is not a complete parts inventory or a repair sequence.</p><button class="text-button" data-action="sources">View vehicle-wide parts coverage</button></details>`;
}
function openAssembly(id){
 if(!engineSectionById.has(id))return;
 if(!state.assembly)vehicleReturn={state:{...state},camera:viewer?.getCamera()};
 Object.assign(state,{assembly:id,assemblyExplode:.65,selected:null,query:'',isolate:false,hideBody:false,tour:null,system:'engine',tab:'component',camera:'home'});
 document.querySelector('#search').value='';sync();document.querySelector('#part-list').scrollTop=0;viewer?.frameAssembly('home');document.querySelector('.sidebar').classList.remove('mobile-open');
}
function exitAssembly(){
 if(!state.assembly)return;
 const previous=vehicleReturn,currentConfiguration=state.configuration;vehicleReturn=null;
 Object.assign(state,previous?.state||{assembly:null,assemblyExplode:0,selected:null,system:'all',explode:0,isolate:false,query:'',tab:'component'});
 state.configuration=currentConfiguration;document.querySelector('#search').value=state.query;sync();if(previous?.camera)viewer?.restoreCamera(previous.camera);else viewer?.view('home');
}
function sync(){
 renderSystems();renderParts();renderInspector();viewer?.update(state);
 const system=systems.find(s=>s.id===state.system);document.querySelector('#stage-kicker').textContent=`${String(systems.indexOf(system)+1).padStart(2,'0')} / ${state.system==='all'?'COMPLETE VEHICLE':system.name.toUpperCase()}`;
 document.querySelector('#stage-title').innerHTML=state.system==='all'?'Anatomy of a Fiero<span>.</span>':`${system.name}<span>.</span>`;document.querySelector('#stage-subtitle').textContent=state.system==='all'?'A different perspective on every part.':system.subtitle+' · select a component to inspect';
 for(const [a,k] of [['body','hideBody'],['labels','labels'],['wireframe','wireframe']])document.querySelector(`[data-action="${a}"]`).setAttribute('aria-pressed',state[k]);
 const amount=state.assembly?state.assemblyExplode:state.explode;
 document.querySelector('#explode').value=Math.round(amount*100);document.querySelector('#explode-value').textContent=`${Math.round(amount*100)}%`;
 document.querySelector('label[for=explode]').textContent=state.assembly?'ENGINE EXPLODED VIEW':'EXPLODED VIEW';
 document.querySelector('#explode').setAttribute('aria-label',state.assembly?'Engine exploded view':'Exploded view');
 document.querySelector('.assembly-return').hidden=!state.assembly;document.querySelector('[data-action=body]').disabled=!!state.assembly;
 document.querySelector('.sidebar-heading h1').textContent=state.assembly?'Engine assemblies':'Assembly explorer';
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===state.camera));
 document.querySelector('#selection-count').textContent=state.selected?'1 assembly selected':`${state.system==='all'?parts.length:parts.filter(p=>p.system===state.system).length} assemblies`;
 if(state.assembly){document.querySelector('#stage-kicker').textContent='L44 / 2.8L V6';document.querySelector('#stage-title').textContent=engineSectionById.get(state.assembly).name;document.querySelector('#stage-subtitle').textContent='Select a component · separate the assembly · look inside';document.querySelector('#selection-count').textContent=`${engineMembers(state.assembly).length} parts / sets`;}
}
function selectPart(id){if(!state.assembly&&enginePartById.has(id)){const part=enginePartById.get(id);openAssembly(part.section);state.selected=id;sync();viewer?.focus(id);return;}if(state.assembly){const part=enginePartById.get(id);if(!part)return;state.selected=id;state.tab='component';sync();document.querySelector('.sidebar').classList.remove('mobile-open');return;}const part=parts.find(p=>p.id===id);if(!part)return;state.selected=id;state.system=part.system;state.tab='component';state.tour=null;if(part.system==='body')state.hideBody=false;sync();viewer?.focus(id);document.querySelector('.sidebar').classList.remove('mobile-open');}
function applyStep(index){if(state.assembly){const tourId=state.tour;exitAssembly();state.tour=tourId;}const tour=tours.find(t=>t.id===state.tour);if(!tour)return;state.step=Math.max(0,Math.min(index,tour.steps.length-1));const step=tour.steps[state.step];state.system=step.system;state.selected=step.part||null;state.isolate=false;state.hideBody=false;state.explode=step.explode||0;state.camera=step.camera;state.tab='tours';sync();viewer?.view(step.camera);if(tour.id==='air-cleaner')setTimeout(()=>{if(state.tour===tour.id&&state.step===index)viewer?.focus(step.part);},180);}
function reset(){if(state.assembly){Object.assign(state,{assemblyExplode:0,selected:null,isolate:false,query:'',wireframe:false,labels:false,camera:'home'});document.querySelector('#search').value='';sync();viewer?.frameAssembly('home');return;}Object.assign(state,{system:'all',selected:null,query:'',hideBody:false,isolate:false,explode:0,wireframe:false,tour:null,step:0,camera:'home'});document.querySelector('#search').value='';sync();viewer?.view('home');}
function openModal(type){
 const modal=document.querySelector('#modal');document.querySelector('#modal-content').innerHTML=`<div class="modal-heading"><p class="eyebrow">WORKSHOP / 85</p><button class="icon-button" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button></div>${type==='sources'?`<h2>Reference library</h2><p class="description">Source coverage is explicit. A source listing does not mean all of its content has been verified or imported.</p><details class="coverage-audit"><summary>Parts coverage · modeled and remaining</summary><p class="description small">${parts.length} vehicle assemblies and ${engineParts.length} engine parts / grouped sets. Counts overlap where the same part appears in both views; they are not a complete vehicle inventory.</p>${coverageAudit.map(row=>`<article class="coverage-row"><h3>${row.system}</h3><p><strong>Modeled:</strong> ${row.modeled}</p><p><strong>Still missing or simplified:</strong> ${row.remaining}</p></article>`).join('')}</details>${sources.map(s=>`<article class="source-card"><h3>${s.title}</h3><p>${s.note}</p>${s.url?`<a href="${s.url}" target="_blank" rel="noopener noreferrer">Open source ↗</a>`:''}</article>`).join('')}`:`<h2>A 3D workshop in progress.</h2><p class="description">Build 0.2 rebuilds the vehicle surfaces and materials around factory references: ${parts.length} selectable assemblies, nine systems, three guided tours, exploded views and local UAT feedback.</p><div class="source-card"><h3>What this build represents</h3><p>The vehicle is an owner-described original 1985 Fiero SE 2M6, four-speed manual, with WS6. VIN identity was checked with NHTSA.</p></div><div class="source-card"><h3>What is still in development</h3><p>The procedural model is illustrative, not a measured replica. The engine now has selectable internal parts and a detailed ignition breakdown. Many fasteners, gearbox mechanisms, exact routing, full accessory options and validated repair instructions remain incomplete. Technical service values are withheld until checked against factory references.</p></div><div class="source-card"><h3>Your data</h3><p>Feedback and checklist results are stored locally in this browser. Export them from the UAT tab to share or back up. No analytics, accounts or external assets are loaded by the app.</p></div>`}`;modal.showModal();
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.assembly){openAssembly(b.dataset.assembly);return;}
 if(b.dataset.paint){state.configuration.paint=b.dataset.paint;saveConfiguration();return;}
 if(b.dataset.system){if(state.assembly)exitAssembly();state.system=b.dataset.system;state.selected=null;state.isolate=false;state.tour=null;state.query='';document.querySelector('#search').value='';sync();viewer?.view('home');return;}
 if(b.dataset.part){selectPart(b.dataset.part);return;}
 if(b.dataset.tab){state.tab=b.dataset.tab;renderInspector();return;}
 if(b.dataset.view){state.camera=b.dataset.view;viewer?.view(state.camera);document.querySelectorAll('[data-view]').forEach(el=>el.setAttribute('aria-pressed',el===b));return;}
 if(b.dataset.tour){state.tour=b.dataset.tour;applyStep(0);return;}
 if(b.dataset.step!==undefined){applyStep(Number(b.dataset.step));return;}
 switch(b.dataset.action){
  case 'exit-assembly':exitAssembly();break;
  case 'assembly-explode':state.assemblyExplode=state.assemblyExplode>.95?0:1;state.isolate=false;sync();viewer?.frameAssembly();break;
  case 'frame-assembly':state.isolate=false;sync();viewer?.frameAssembly();break;
  case 'configure':state.tab='config';renderInspector();break;
  case 'reset-configuration':state.configuration={...defaultConfiguration};saveConfiguration();toast('Preview choices reset; vehicle identity unchanged');break;
  case 'show-exterior':if(state.assembly)exitAssembly();state.system='all';state.selected=null;state.hideBody=false;state.isolate=false;state.explode=0;state.camera='home';sync();viewer?.view('home');break;
  case 'show-cabin':if(state.assembly)exitAssembly();state.system='interior';state.selected=null;state.hideBody=true;state.isolate=false;state.camera='home';sync();viewer?.view('home');break;
  case 'show-chassis':if(state.assembly)exitAssembly();state.system='all';state.selected=null;state.hideBody=true;state.isolate=false;state.camera='home';sync();viewer?.view('home');break;
  case 'reset':reset();toast(state.assembly?'Assembly reassembled':'Vehicle view reset');break;
  case 'body':state.hideBody=!state.hideBody;if(state.hideBody&&getPart()?.system==='body'){state.selected=null;state.isolate=false;}sync();break;
  case 'labels':state.labels=!state.labels;sync();break;
  case 'wireframe':state.wireframe=!state.wireframe;sync();break;
  case 'focus':if(state.selected)viewer?.focus(state.selected);break;
  case 'isolate':state.isolate=!state.isolate;sync();break;
  case 'clear-search':state.query='';document.querySelector('#search').value='';renderParts();break;
  case 'sources':openModal('sources');break;
  case 'about':openModal('about');break;
  case 'close-modal':document.querySelector('#modal').close();break;
  case 'menu':document.querySelector('.sidebar').classList.toggle('mobile-open');break;
  case 'note-part':state.tab='uat';renderInspector();document.querySelector('#feedback').focus();break;
  case 'prev-step':applyStep(state.step-1);break;
  case 'next-step':{const tour=tours.find(t=>t.id===state.tour);if(state.step===tour.steps.length-1){state.tour=null;state.explode=0;sync();toast('Tour complete — explore another assembly');}else applyStep(state.step+1);break;}
  case 'exit-tour':state.tour=null;state.explode=0;sync();break;
  case 'export':{const payload={build:'0.2.0',configuration:state.configuration,exportedAt:new Date().toISOString(),vehicle,checkedItems:saved.checks.map(i=>acceptance[i]),notes:saved.notes};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='fiero-uat-feedback.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('UAT feedback exported');break;}
  case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.stage').requestFullscreen();}catch{toast('Fullscreen is unavailable in this browser.');}break;
 }
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();if(state.assembly)exitAssembly();state.tab='component';reset();});
document.querySelector('#search').addEventListener('input',e=>{state.query=e.target.value;renderParts();document.querySelector('#part-list').scrollTop=0;});
document.querySelector('#explode').addEventListener('input',e=>{state[state.assembly?'assemblyExplode':'explode']=Number(e.target.value)/100;document.querySelector('#explode-value').textContent=`${e.target.value}%`;viewer?.update(state);if(state.assembly&&state.tab==='component')renderInspector();});
document.addEventListener('change',e=>{if(e.target.id==='explode'&&state.assembly){viewer?.frameAssembly();return;}if(e.target.dataset.config){state.configuration[e.target.dataset.config]=e.target.type==='checkbox'?e.target.checked:e.target.value;saveConfiguration();return;}if(e.target.dataset.check!==undefined){const i=Number(e.target.dataset.check);saved.checks=e.target.checked?[...new Set([...saved.checks,i])]:saved.checks.filter(x=>x!==i);persist();const progress=document.querySelector('.uat-progress');progress.querySelector('span').textContent=`${saved.checks.length} / ${acceptance.length} checks completed`;progress.querySelector('i').style.width=`${saved.checks.length/acceptance.length*100}%`;}});
document.addEventListener('submit',e=>{if(e.target.id!=='feedback-form')return;e.preventDefault();const input=document.querySelector('#feedback');const text=input.value.trim();if(!text){input.setCustomValidity('Enter a note before saving.');input.reportValidity();return;}input.setCustomValidity('');saved.notes.push({id:globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+Math.random().toString(36).slice(2),date:new Date().toISOString(),type:document.querySelector('#feedback-type').value,text,part:getPart()?.name||null,system:state.system});const stored=persist();renderInspector();if(stored)toast('UAT note saved in this browser');});
document.addEventListener('input',e=>{if(e.target.id==='feedback')e.target.setCustomValidity('');});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('#modal').open){e.preventDefault();document.querySelector('.sidebar').classList.add('mobile-open');document.querySelector('#search').focus();}if(e.key==='Escape')document.querySelector('.sidebar').classList.remove('mobile-open');});
document.querySelector('#modal').addEventListener('click',e=>{if(e.target.id==='modal')e.target.close();});
sync();
try{viewer=createViewer(document.querySelector('#viewport'),selectPart);viewer.update(state);document.querySelector('#loading').remove();window.__fiero={getState:()=>({...state}),getModelState:()=>viewer.getState(),partCount:viewer.getPartCount(),getModelStats:()=>viewer.getModelStats(),getPartBounds:id=>viewer.getPartBounds(id),enginePartCount:engineParts.length,getVisibleParts:()=>viewer.getVisibleParts()};}catch(error){document.querySelector('#loading').innerHTML=`${icon('info')}<strong>3D rendering could not start</strong><span>Enable WebGL / hardware acceleration and reload. The component catalogue, references and UAT notes remain available.</span>`;document.querySelector('#render-status').textContent='3D renderer unavailable';console.error(error);}
