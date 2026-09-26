import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {geometryTools} from '../src/geometry.js';
import {cutPanelAperture} from '../src/panel-aperture.js';
test('clipped curved panel preserves its boundary and shares smooth surface vertices',()=>{
 const groups=new Map([['panel',new T.Group()]]),h=geometryTools(groups,{paint:new T.MeshStandardMaterial()}),face=(x,y)=>[x,y,.2*x*x+.1*y*y];
 const mesh=h.surface('panel',36,24,(u,v)=>face(u*2-1,v*2-1),'paint');
 cutPanelAperture(mesh,[[-.37,-.23],[.43,-.23],[.43,.31],[-.37,.31]],face);
 const g=mesh.geometry,p=g.attributes.position,ix=g.index;
 assert(p.count<ix.count/2,'split triangles retain duplicate vertices and facet normals');
 for(let i=0;i<p.count;i++)assert(Math.abs(p.getZ(i)-face(p.getX(i),p.getY(i))[2])<1e-6,'cut point left the original curved surface');
 const ray=new T.Raycaster();for(const [x,y,expected]of [[0,0,false],[-.369,.1,false],[.429,0,false],[-.38,.1,true],[.44,0,true],[0,.32,true],[0,-.24,true]]){ray.set(new T.Vector3(x,y,2),new T.Vector3(0,0,-1));assert.equal(ray.intersectObject(mesh).length>0,expected,'incorrect opening boundary at '+[x,y]);}
 const bounds=new T.Box3().setFromObject(mesh);assert.equal(bounds.min.x,-1);assert.equal(bounds.max.x,1);assert.equal(bounds.min.y,-1);assert.equal(bounds.max.y,1);
});
