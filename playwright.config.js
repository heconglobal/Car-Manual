import {sourceFingerprint} from './scripts/source-fingerprint.mjs';
import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const snapLibraries='/snap/chromium/current/usr/lib/x86_64-linux-gnu:/snap/gnome-46-2404/current/usr/lib/x86_64-linux-gnu';
const runOutput=process.env.FIERO_RUN_OUTPUT||'artifacts/test-runs/'+new Date().toISOString().replaceAll(':','-')+'-'+process.pid;
export default defineConfig({
 metadata:{sourceSha256:sourceFingerprint()},
 testDir:'./tests', timeout:240000, fullyParallel:false, workers:1,
 outputDir:runOutput+'/results',
 reporter:[['list'],['html',{open:'never',outputFolder:runOutput+'/html'}],['json',{outputFile:'artifacts/full-regression.json'}]],
 use:{baseURL:'http://127.0.0.1:5185',viewport:{width:1440,height:1000},reducedMotion:'reduce',navigationTimeout:240000,screenshot:'only-on-failure',trace:'retain-on-failure',
  launchOptions:{executablePath:process.env.CHROMIUM_PATH||'/home/hesh913/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',env:{...process.env,...(existsSync('/snap/chromium/current')?{LD_LIBRARY_PATH:snapLibraries}:{})},args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}
 },
 webServer:{command:'npm run dev',url:'http://127.0.0.1:5185',reuseExistingServer:true,timeout:30000}
});
