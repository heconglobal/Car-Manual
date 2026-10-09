import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {trianglesContact,triangleTree,firstTreeContact} from './triangle-contact.mjs';
const a=[-1,-1,0,1,-1,0,0,1,0];
test('actual triangle contact detects edge crossings and coplanar contact, rejects separated surfaces',()=>{
 assert(trianglesContact(a,[-1,0,-1,1,0,-1,0,0,1]));
 assert(trianglesContact(a,[-1,0,0,1,0,0,0,-2,0]));
 assert(!trianglesContact(a,[2,0,0,3,0,0,2,1,0]));
 assert(!trianglesContact(a,a.map((v,i)=>i%3===2?v+.00001:v)));
 assert(!trianglesContact(a,[0,0,0,0,0,0,0,0,0]));
});
test('BVH uses the supplied rigid transform and detects an intermediate-only collision',()=>{
 const moving=triangleTree([a]),fixed=triangleTree([a]);
 for(const z of[-1,1])assert.equal(firstTreeContact(moving,fixed,new T.Matrix4().makeTranslation(0,0,z).elements),null);
 assert(firstTreeContact(moving,fixed,new T.Matrix4().identity().elements));
 assert.equal(firstTreeContact(moving,fixed,new T.Matrix4().makeTranslation(5,0,0).elements),null);
 const many=triangleTree(Array.from({length:80},(_,i)=>a.map((v,j)=>j%3===0?v+i*4:v)));
 assert(firstTreeContact(moving,many,new T.Matrix4().makeTranslation(79*4,0,0).elements));
 assert.equal(firstTreeContact(moving,many,new T.Matrix4().makeTranslation(79*4,0,.01).elements),null);
});
