import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
function harness(){
 const elements=new Map();
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getParameter:()=> 'Mock GPU'}, {get:(t,k)=>k in t?t[k]:/^[A-Z_0-9]+$/.test(k)?1:()=>({})});
 function element(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},getContext:()=>gl,addEventListener(){},focus(){},isConnected:true});return elements.get(id);}
 const document={getElementById:element,addEventListener(){},querySelectorAll:()=>[],activeElement:null,documentElement:{}};
 let seed=12;const math=Object.create(Math);math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const context=vm.createContext({document,navigator:{},window:{},location:{protocol:'http:'},innerWidth:844,innerHeight:390,devicePixelRatio:1,addEventListener(){},requestAnimationFrame(){},performance:{now:()=>0},localStorage:{getItem:()=>null,setItem(){}},Math:math,console});
 vm.runInContext(scripts[0],context);
 // Test-only access to closure state; shipped game has no mutable debug API.
 const engine=scripts[1].replace(/\}\)\(\);\s*$/,`globalThis.testEngine={start,update,get state(){return state},get mode(){return mode},get enemies(){return enemies},get input(){return input},get player(){return player},get rules(){return Rules}};})();`);
 vm.runInContext(engine,context);
 return context.testEngine;
}
test('A complete mission can reach victory through normal combat and max upgrades with God mode',()=>{
 const e=harness();e.start();e.rules.toggle(e.state,'god',true);e.rules.toggle(e.state,'money',true);
 for(const type of ['weapon','armor','speed'])for(let i=0;i<3;i++)assert.equal(e.rules.buy(e.state,type).ok,true);
 e.input.fire=true;
 // Circle through the arena instead of waiting behind cover.
 for(let tick=0;tick<60*420&&e.mode==='playing';tick++){
   const t=tick/60;e.input.x=Math.cos(t*.24)*.55;e.input.z=Math.sin(t*.24)*.55;e.update(1/60);
 }
 assert.equal(e.mode,'won',JSON.stringify({wave:e.state.wave,kills:e.state.kills,enemies:e.enemies}));
 assert.equal(e.state.wave,5);assert.equal(e.state.kills,70);assert.equal(e.state.hp,e.state.maxHp);assert.equal(e.state.usedMods,true);
});
test('A vulnerable stationary player reaches defeat and a fresh mission resets progress',()=>{
 const e=harness();e.start();for(let tick=0;tick<60*120&&e.mode==='playing';tick++)e.update(1/60);
 assert.equal(e.mode,'lost');assert.equal(e.state.hp,0);e.start();assert.equal(e.mode,'playing');assert.equal(e.state.hp,100);assert.equal(e.state.kills,0);assert.equal(e.state.wave,1);assert.equal(e.state.usedMods,false);
});
