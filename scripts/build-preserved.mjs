import {spawn} from 'node:child_process';
import {preserveFiles} from './preserve-files.mjs';
console.log('Preserved previous build in '+await preserveFiles(['dist'],'before-build'));
const code=await new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['node_modules/vite/bin/vite.js','build','--emptyOutDir','false',...process.argv.slice(2)],{stdio:'inherit'});
 child.on('error',reject);child.on('exit',code=>resolve(code??1));
});
process.exitCode=code;
