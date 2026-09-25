import {test,expect} from '@playwright/test';
test('1985 rear lamps retain four chambers, clear outer covers and separate inner optics in shared geometry',async({page})=>{
 test.setTimeout(300000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/tail-review.html');await page.waitForFunction(()=>window.__tailReview&&document.querySelector('canvas').dataset.ready==='true');
 const lamps=await page.evaluate(()=>Object.fromEntries(['left','right'].map(side=>{const groups=window.__tailReview.groups,stem='lt-rear-'+side+'-';return [side,{bulbs:['tail','turn','inner-stop','reverse'].every(k=>groups.get(stem+k+'-bulb')?.children.length),outer:groups.get(stem+'outer-lens').children.filter(m=>m.userData.materialName==='tailOuter').map(m=>({transparent:m.material.transparent,opacity:m.material.opacity})),red:groups.get(stem+'red-lens').children.length,reverse:groups.get(stem+'reverse-lens').children.length}];})));
 for(const value of Object.values(lamps)){expect(value.bulbs).toBe(true);expect(value.outer.length).toBeGreaterThan(0);for(const m of value.outer){expect(m.transparent).toBe(true);expect(m.opacity).toBeLessThan(.4);}expect(value.red).toBeGreaterThan(0);expect(value.reverse).toBeGreaterThan(0);}
 for(const name of ['straight','quarter','lamp','exploded']){await page.locator(`button[data-view="${name}"]`).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`artifacts/tail-r8-${name}.png`,fullPage:true});}
 expect(errors).toEqual([]);
});
