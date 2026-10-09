// UI navigation starts asynchronous family loading. Inspect geometry only once
// that request has settled; a failed load remains a test failure.
export async function waitForViewer(page) {
 await page.waitForFunction(()=>typeof window.__fiero?.whenIdle==='function');
 await page.evaluate(async()=>{
  await window.__fiero.whenIdle();
  const loading=window.__fiero.getLoadingStats();
  if(loading.lastError)throw new Error('Viewer loading failed: '+loading.lastError);
  if(loading.loading)throw new Error('Viewer still loading after whenIdle');
 });
}

export async function evaluateViewer(page,callback,argument) {
 await waitForViewer(page);
 return page.evaluate(callback,argument);
}
