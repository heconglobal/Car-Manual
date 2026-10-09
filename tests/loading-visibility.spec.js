import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {parts} from '../src/data.js';
import {detailAvailable,detailMembers} from '../src/inspection-catalog.js';
import {defaultConfiguration} from '../src/configuration.js';
import {sourceFingerprint} from '../scripts/source-fingerprint.mjs';
import {waitForViewer,evaluateViewer} from './viewer-ready.js';

const electricalOwners=parts.filter(part=>part.system==='electrical'&&detailAvailable(part,defaultConfiguration));
const requiredIgnitionOwners=['distributor','ignition-coil','ignition-leads'];
const requiredDistributorParts=['eng-cap','eng-rotor','eng-icm','eng-pickup-coil','eng-distributor'];

function expectGeometryBounds(bounds,id){
 expect(bounds,`${id} must have visible mesh bounds, not only a catalogue entry`).not.toBeNull();
 expect(bounds.min,`${id} minimum coordinates`).toHaveLength(3);
 expect(bounds.max,`${id} maximum coordinates`).toHaveLength(3);
 expect([...bounds.min,...bounds.max].every(Number.isFinite),`${id} finite coordinates`).toBe(true);
 const extent=bounds.max.map((maximum,axis)=>maximum-bounds.min[axis]);
 expect(extent.every(value=>value>=0),`${id} ordered bounds`).toBe(true);
 expect(Math.hypot(...extent),`${id} nonzero geometry extent`).toBeGreaterThan(0);
}

function expectCameraFrames(bounds,camera,id){
 const subtract=(a,b)=>a.map((value,axis)=>value-b[axis]);
 const dot=(a,b)=>a.reduce((sum,value,axis)=>sum+value*b[axis],0);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const normalize=vector=>vector.map(value=>value/Math.hypot(...vector));
 const forward=normalize(subtract(camera.target,camera.position));
 const right=normalize(cross(forward,[0,1,0])),up=cross(right,forward);
 const centre=bounds.min.map((value,axis)=>(value+bounds.max[axis])/2);
 const relative=subtract(centre,camera.position),depth=dot(relative,forward);
 const verticalScale=Math.tan(camera.fov*Math.PI/360);
 const projected=[dot(relative,right)/(depth*verticalScale*camera.aspect),dot(relative,up)/(depth*verticalScale)];
 expect(depth,`${id} geometry in front of the camera`).toBeGreaterThan(0);
 expect(projected.every(Number.isFinite),`${id} finite projected centre`).toBe(true);
 expect(Math.abs(projected[0]),`${id} horizontally inside the viewport`).toBeLessThan(1);
 expect(Math.abs(projected[1]),`${id} vertically inside the viewport`).toBeLessThan(1);
}

for(const profile of [
 {name:'desktop',viewport:{width:1440,height:1000},detailPart:'eng-cap'},
 {name:'mobile',viewport:{width:390,height:844},detailPart:'eng-icm'},
])test(`${profile.name} electrical selections contain visible geometry before and after detail navigation`,async({page},testInfo)=>{
 test.setTimeout(900000);page.setDefaultTimeout(90000);page.setDefaultNavigationTimeout(300000);
 const errors=[],evidence=[],sourceSha256=sourceFingerprint();
 page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize(profile.viewport);await page.goto('/');
 await page.waitForFunction(()=>document.querySelector('#render-status')?.textContent==='3D renderer unavailable'||window.__fiero&&document.querySelector('canvas')?.dataset.ready==='true',null,{timeout:300000});
 await expect(page.locator('#render-status')).not.toHaveText('3D renderer unavailable');
 await expect(page.locator('#loading')).toHaveCount(0);await waitForViewer(page);

 const settle=()=>evaluateViewer(page,()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const openNavigation=async()=>{
  const menu=page.getByRole('button',{name:'Open assemblies',exact:true});
  if(await menu.isVisible()&&!await page.locator('.sidebar').evaluate(element=>element.classList.contains('mobile-open')))await menu.click();
 };
 const checkParts=async(ids,stage)=>{
  const snapshot=await evaluateViewer(page,ids=>({bounds:Object.fromEntries(ids.map(id=>[id,window.__fiero.getPartBounds(id)])),visible:window.__fiero.getVisibleParts(),stats:window.__fiero.getModelStats()}),ids);
  for(const id of ids){expect(snapshot.visible,`${stage}: ${id} is visible`).toContain(id);expectGeometryBounds(snapshot.bounds[id],`${stage}: ${id}`);}
  expect(snapshot.stats.meshes,`${stage}: visible model meshes`).toBeGreaterThan(0);
  expect(Number.isFinite(snapshot.stats.triangles),`${stage}: finite triangle count`).toBe(true);
  expect(snapshot.stats.triangles,`${stage}: visible model triangles`).toBeGreaterThan(0);
  evidence.push({stage,...snapshot});return snapshot;
 };
 const inspectIsolated=async(id,stage)=>{
  const isolate=page.locator('#inspector-content [data-action="isolate"]');
  if(await isolate.getAttribute('aria-pressed')!=='true')await isolate.click();
  await page.getByRole('button',{name:'Focus part',exact:true}).click();await settle();
  const snapshot=await checkParts([id],stage);expect(snapshot.visible).toEqual([id]);
  const camera=await evaluateViewer(page,()=>window.__fiero.getCamera());expectCameraFrames(snapshot.bounds[id],camera,id);
  evidence.at(-1).camera=camera;
  await page.locator('canvas').scrollIntoViewIfNeeded();
  await page.screenshot({path:testInfo.outputPath(`${stage}.png`),fullPage:true});
 };

 // Checking every electrical owner catches classification/builder mismatches,
 // including ignition geometry built by the engine and the shared main loom.
 const ownerIds=electricalOwners.map(part=>part.id);
 for(const id of requiredIgnitionOwners)expect(ownerIds).toContain(id);
 await checkParts(ownerIds,'initial-electrical-owners');
 await openNavigation();await page.locator('#systems [data-system="electrical"]').click();await settle();
 await checkParts(ownerIds,'electrical-system-owners');
 const listed=await page.locator('.part-button').evaluateAll(buttons=>buttons.map(button=>button.dataset.part));
 expect(listed.sort()).toEqual([...ownerIds].sort());

 for(const id of [...requiredIgnitionOwners,'ecm']){
  const part=electricalOwners.find(part=>part.id===id);
  await openNavigation();await page.getByRole('searchbox').fill(part.name);await page.locator(`.part-button[data-part="${id}"]`).click();
  await waitForViewer(page);await expect(page.locator('canvas')).toHaveAttribute('data-assembly','');
  await expect(page.locator('canvas')).toHaveAttribute('data-selected',id);
  if(profile.name==='mobile')await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/);
  await inspectIsolated(id,`vehicle-${id}`);
  if(id!=='distributor')continue;

  await page.getByRole('button',{name:'Explode this assembly',exact:true}).click();await settle();
  await expect(page.locator('canvas')).toHaveAttribute('data-assembly','distributor-detail');
  const detailIds=detailMembers('distributor-detail').filter(part=>detailAvailable(part,defaultConfiguration)).map(part=>part.id);
  for(const id of requiredDistributorParts)expect(detailIds).toContain(id);
  const detailListed=await page.locator('.part-button').evaluateAll(buttons=>buttons.map(button=>button.dataset.part));
  expect(detailListed.sort()).toEqual([...detailIds].sort());await checkParts(detailIds,'distributor-detail-members');
  await openNavigation();await page.locator(`.part-button[data-part="${profile.detailPart}"]`).click();
  await inspectIsolated(profile.detailPart,`detail-${profile.detailPart}`);
  await page.getByRole('button',{name:'Back to vehicle',exact:false}).click();await settle();
  await expect(page.locator('canvas')).toHaveAttribute('data-assembly','');await expect(page.locator('canvas')).toHaveAttribute('data-selected','distributor');
  await inspectIsolated('distributor','returned-distributor');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);expect(sourceFingerprint()).toBe(sourceSha256);
 const report={sourceSha256,profile:profile.name,viewport:profile.viewport,electricalOwnerCount:ownerIds.length,evidence,errors,limits:'Read-only inspection of actual model mesh counts and visible geometry bounds, camera projection checks, and screenshots from real UI navigation. Screenshot appearance still requires human review; these checks do not establish measured factory dimensions or workshop validation.'};
 await writeFile(testInfo.outputPath('visibility-evidence.json'),JSON.stringify(report,null,2)+'\n');
 await testInfo.attach('electrical-geometry-evidence',{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
});
