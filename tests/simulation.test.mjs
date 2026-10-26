import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
function harness(){
 const elements=new Map();
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getParameter:()=> 'Mock GPU'}, {get:(t,k)=>k in t?t[k]:/^[A-Z_0-9]+$/.test(k)?1:()=>({})});
 function element(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){},toggle(){}},getContext:()=>gl,addEventListener(){},focus(){},isConnected:true});return elements.get(id);}
 const document={getElementById:element,addEventListener(){},querySelectorAll:()=>[],activeElement:null,documentElement:{}};
 let seed=12;const math=Object.create(Math);math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const context=vm.createContext({document,navigator:{},window:{},location:{protocol:'http:'},innerWidth:844,innerHeight:390,devicePixelRatio:1,addEventListener(){},requestAnimationFrame(){},performance:{now:()=>0},localStorage:{getItem:()=>null,setItem(){}},Math:math,console});
 vm.runInContext(scripts[0],context);
 // Test-only access to closure state; shipped game has no mutable debug API.
 const engine=scripts[1].replace(/\}\)\(\);\s*$/,`globalThis.testEngine={start,update,emp,shoot,cycleWeapon,finish,createObjective,damageEnemy,get hazards(){return hazards},get pickups(){return pickups},get objective(){return objective},get empCooldown(){return empCooldown},get profile(){return profile},get bullets(){return bullets},get state(){return state},get mode(){return mode},get enemies(){return enemies},get input(){return input},get player(){return player},get rules(){return Rules}};})();`);
 vm.runInContext(engine,context);
 return context.testEngine;
}
test('Eight-wave mission defeats both multi-phase bosses through combat',()=>{
 const e=harness();e.start();e.rules.toggle(e.state,'god',true);e.rules.toggle(e.state,'money',true);
 for(const type of ['weapon','armor','speed'])for(let i=0;i<3;i++)assert.equal(e.rules.buy(e.state,type).ok,true);
 e.input.fire=true;
 // Circle through the arena instead of waiting behind cover.
 const encountered=new Set();let phase2=false;
 for(let tick=0;tick<60*900&&e.mode==='playing';tick++){
   const t=tick/60;e.input.x=Math.cos(t*.24)*.55;e.input.z=Math.sin(t*.24)*.55;
   if(tick%120===0)e.emp();if(tick%360===0)e.cycleWeapon();
   for(const enemy of e.enemies){encountered.add(enemy.kind);if(enemy.enraged)phase2=true;}
   while(e.state.perkPoints>0){const type=['power','shield','dash','magnet'].find(k=>e.state.perks[k]<3);if(!type)break;e.rules.perk(e.state,type);}
   e.update(1/60);
 }
 assert.equal(e.mode,'won',JSON.stringify({wave:e.state.wave,kills:e.state.kills,enemies:e.enemies}));
 assert.equal(e.state.wave,8);assert.equal(e.state.wavesCleared,8);assert.equal(e.state.bosses,2);assert.ok(e.state.kills>70);assert.equal(e.state.hp,e.state.maxHp);assert.equal(e.state.usedMods,true);assert.equal(e.profile.chips,0);assert.equal(encountered.size,6);assert.equal(phase2,true);
});
test('EMP damages and stuns enemies, clears projectiles, and respects cooldown',()=>{
 const e=harness();e.start();e.update(.5);const enemy=e.enemies[0];enemy.x=e.player.x+2;enemy.z=e.player.z;enemy.hp=500;enemy.maxHp=500;const hp=enemy.hp;e.bullets.push({x:e.player.x,z:e.player.z,hostile:true});e.emp();assert.ok(enemy.hp<hp);assert.ok(enemy.stun>0);assert.equal(e.bullets.length,0);assert.equal(e.empCooldown,10);const after=enemy.hp;e.emp();assert.equal(enemy.hp,after);assert.equal(e.state.empUses,1);
});
test('Collecting data cores completes a side contract exactly once',()=>{
 const e=harness();e.start();e.rules.toggle(e.state,'god',true);for(const p of [...e.pickups]){e.player.x=p.x;e.player.z=p.z;e.update(.016);}assert.equal(e.objective.done,true);assert.equal(e.state.objectives,1);assert.equal(e.state.money,100);e.update(.016);assert.equal(e.state.money,100);
});
test('Shield waits before regenerating and heat limits sustained fire',()=>{
 const e=harness();e.start();e.rules.hurt(e.state,20);e.rules.toggle(e.state,'god',true);e.update(1);assert.equal(e.state.shield,10);for(let i=0;i<360;i++)e.update(1/60);assert.ok(e.state.shield>10);e.rules.toggle(e.state,'god',true);e.input.fire=true;let overheated=false;for(let i=0;i<900;i++){e.update(1/60);if(e.state.overheat>0)overheated=true;}assert.equal(overheated,true);assert.ok(e.state.heat>=0&&e.state.heat<=100);
});
test('Scatter emits five distinct pellets; rail pierces three targets once each',()=>{
 const scatter=harness();scatter.start();scatter.state.weapon='scatter';scatter.shoot();assert.equal(scatter.bullets.length,5);assert.equal(new Set(scatter.bullets.map(b=>b.dx)).size,5);
 const e=harness();e.start();e.rules.toggle(e.state,'god',true);e.update(.5);const template=e.enemies[0];e.enemies.length=0;for(let i=0;i<3;i++)e.enemies.push({...template,id:100+i,x:0,z:-2-i*2,hp:500,maxHp:500,stun:3});e.state.weapon='rail';e.shoot();for(let tick=0;tick<60;tick++)e.update(1/60);for(const enemy of e.enemies.filter(e=>e.id>=100))assert.ok(Math.abs(enemy.hp-(500-24*3.2))<1e-8);
});
test('Sniper warns before firing and boss enters a second attack phase',()=>{
 const e=harness();e.start();e.rules.toggle(e.state,'god',true);e.update(.5);const enemy=e.enemies[0];Object.assign(enemy,{kind:'sniper',x:0,z:-8,speed:0,cooldown:0});e.update(.016);assert.ok(enemy.aimTimer>.9);assert.equal(e.bullets.filter(b=>b.hostile).length,0);for(let tick=0;tick<59;tick++)e.update(1/60);assert.ok(e.bullets.some(b=>b.hostile&&b.speed===18));Object.assign(enemy,{kind:'boss',hp:40,maxHp:100,enraged:false});e.update(.016);assert.equal(enemy.enraged,true);
});
test('A vulnerable stationary player reaches defeat and a fresh mission resets progress',()=>{
 const e=harness();e.start();for(let tick=0;tick<60*120&&e.mode==='playing';tick++)e.update(1/60);
 assert.equal(e.mode,'lost');assert.equal(e.state.hp,0);e.start();assert.equal(e.mode,'playing');assert.equal(e.state.hp,100);assert.equal(e.state.kills,0);assert.equal(e.state.wave,1);assert.equal(e.state.usedMods,false);
});
