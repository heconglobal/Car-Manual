import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planBrowserBatches} from './browser-batch-plan.mjs';
const required = [
 {id:'a',file:'workshop.spec.js',title:'pick a part (left) + focus'},
 {id:'b',file:'workshop.spec.js',title:'mobile [390]'},
 {id:'c',file:'workshop.spec.js',title:'reset'},
 {id:'d',file:'new-family.spec.js',title:'new family appears'},
];
test('new files are included exactly once and batch size is bounded', () => {
 const batches = planBrowserBatches(required);
 assert.deepEqual(batches.flatMap(b => b.ids), ['a','b','c','d']);
 assert(batches.every(b => b.ids.length <= 2));
});
test('resume excludes only confirmed passing IDs', () => {
 assert.deepEqual(planBrowserBatches(required,new Set(['a','c'])).flatMap(b => b.ids), ['b','d']);
});
test('literal punctuation in titles does not change selection', () => {
 const [batch] = planBrowserBatches(required);
 const pattern = new RegExp(batch.args[2]);
 assert(pattern.test('workshop.spec.js pick a part (left) + focus'));
 assert(pattern.test('workshop.spec.js mobile [390]'));
 assert(!pattern.test('workshop.spec.js mobile 3'));
});
test('ambiguous selection and invalid inventories fail before execution', () => {
 assert.throws(() => planBrowserBatches([...required,required[0]]),/Duplicate/);
 assert.throws(() => planBrowserBatches(required,new Set(),0),/positive/);
 assert.throws(() => planBrowserBatches([{id:'a',file:'f',title:'same'},{id:'b',file:'f',title:'same'}],new Set(),1),/Ambiguous/);
});
