import {waitForViewer,evaluateViewer} from './viewer-ready.js';
import {test,expect} from '@playwright/test';
test('R12 exterior loads in the manual and retains its opening trim with windows lowered',async({page})=>{
 test.setTimeout(600000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.waitForFunction(()=>window.__fiero&&document.querySelector('canvas').dataset.ready==='true');
 await expect(page.locator('.build-badge')).toContainText('BODY R12');
 for(const view of ['rear','front']){await page.locator(`[data-view="${view}"]`).click();await waitForViewer(page);await page.locator('#viewport').screenshot({path:`artifacts/body-r12-manual-${view}.png`});}
 await page.getByRole('button',{name:'Configure',exact:true}).click();await page.getByLabel('Side windows',{exact:true}).selectOption('open');
 const state=await evaluateViewer(page,()=>Object.fromEntries(['door-glass-left','door-glass-right','a-pillar-seal-left','a-pillar-seal-right','upper-window-seal-left','upper-window-seal-right','deck-vent-left','deck-vent-right'].map(id=>[id,window.__fiero.getPartBounds(id)])));
 for(const [id,b]of Object.entries(state))expect(!!b,id).toBe(!id.startsWith('door-glass'));
 expect(errors).toEqual([]);
});
