const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await context.addInitScript(()=>{if(!localStorage.getItem('neon-test-seed')){localStorage.setItem('neon-profile-v2',JSON.stringify({chips:20}));localStorage.setItem('neon-test-seed','1');}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8080/');await page.waitForFunction(()=>window.neonDiagnostics?.().frame>5);
 assert.equal(await page.locator('#error').isVisible(),false);
 const screenshots=process.env.NEON_SCREENSHOTS||'/tmp/neon-outpost-v2-qa';fs.mkdirSync(screenshots,{recursive:true});
 await page.screenshot({path:path.join(screenshots,'home-landscape.png')});
 await page.locator('#hangar').click();await page.locator('[data-module="hull"]').click();await page.locator('[data-module="hull"]').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).profile.hull,2);assert.equal((await page.evaluate(()=>neonDiagnostics())).profile.chips,14);await page.locator('#closePanel').click();
 await page.locator('#start').click();await page.locator('#sectorSelect').selectOption('rust');await page.locator('#difficultySelect').selectOption('nightmare');await page.locator('#weaponSelect').selectOption('rail');await page.screenshot({path:path.join(screenshots,'loadout-landscape.png')});await page.locator('#launch').click();const launched=await page.evaluate(()=>neonDiagnostics());assert.equal(launched.mode,'playing');assert.equal(launched.version,2);assert.equal(launched.weapon,'rail');assert.equal(launched.config.sector,'rust');assert.equal(launched.config.difficulty,'nightmare');assert.equal(launched.maxHp,120);
 await page.locator('#weaponSwitch').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).weapon,'pulse');await page.locator('#weaponSwitch').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).weapon,'scatter');await page.locator('#weaponSwitch').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).weapon,'rail');await page.locator('#emp').click();assert.ok((await page.evaluate(()=>neonDiagnostics())).empCooldown>9);assert.equal(await page.locator('#emp').isDisabled(),true);
 await page.locator('#mods').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'paused');
 await page.locator('#godToggle').check();await page.locator('#moneyToggle').check();await page.locator('#resume').click();
 assert.equal((await page.evaluate(()=>neonDiagnostics())).mods.god,true);
 await page.locator('#shop').click();await page.locator('[data-buy="weapon"]').click();await page.locator('[data-buy="weapon"]').click();await page.locator('[data-buy="weapon"]').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).weaponLevel,3);assert.equal((await page.evaluate(()=>neonDiagnostics())).money,0);await page.locator('#resume').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'playing');
 // Simultaneous touch pointers: move while holding the fire button.
 const start=await page.evaluate(()=>neonDiagnostics().player);const joystick=await page.locator('#joystick').boundingBox();
 const fire=await page.locator('#fire').boundingBox(),cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:joystick.x+joystick.width*.8,y:joystick.y+joystick.height*.5,id:7},{x:fire.x+fire.width*.5,y:fire.y+fire.height*.5,id:8}]});
 await page.waitForTimeout(1300);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const moved=await page.evaluate(()=>neonDiagnostics().player);assert.ok(Math.hypot(moved.x-start.x,moved.z-start.z)>1);
 await page.screenshot({path:path.join(screenshots,'game-landscape.png')});
 // Earn XP through the actual combat loop, then spend a perk in the UI.
 await page.keyboard.down('Space');await page.waitForFunction(()=>neonDiagnostics().perkPoints>0,{},{timeout:45000});await page.keyboard.up('Space');await page.locator('#shop').click();await page.locator('#perksTab').click();const beforePerk=await page.evaluate(()=>neonDiagnostics().perkPoints);await page.locator('[data-perk="shield"]').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).perkPoints,beforePerk-1);await page.screenshot({path:path.join(screenshots,'perks-landscape.png')});await page.locator('#resume').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'playing');
 // Pause must freeze health and position, and resume must work after buying.
 await page.locator('#mods').click();const paused=await page.evaluate(()=>neonDiagnostics());await page.waitForTimeout(300);assert.deepEqual((await page.evaluate(()=>neonDiagnostics())).player,paused.player);
 await page.locator('#moneyToggle').uncheck();await page.locator('#godToggle').uncheck();await page.locator('#resume').click();const switched=await page.evaluate(()=>neonDiagnostics());assert.equal(switched.mods.money,false);assert.equal(switched.mods.god,false);assert.equal(switched.usedMods,true);
 await page.locator('#pause').click();await page.locator('#pauseSettings').click();await page.locator('#quality').selectOption('battery');await page.locator('#closePanel').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'playing');
 // Resize to a narrow phone; controls and menus must remain in bounds.
 await page.setViewportSize({width:390,height:844});await page.locator('#mods').click();
 await page.screenshot({path:path.join(screenshots,'mods-portrait.png')});
 for(const selector of ['#panel','#godToggle','#moneyToggle','#resume']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=391&&b.y+b.height<=845,selector+' visible '+JSON.stringify(b));}
 await page.locator('#resume').click();await page.screenshot({path:path.join(screenshots,'game-portrait.png')});
 for(const selector of ['#joystick','#fire','#dash','#emp','#weaponSwitch','#minimap']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=391&&b.y+b.height<=845,selector+' visible');}
 await page.locator('#pause').click();await page.locator('#abandon').click();await page.locator('#backHome').click();await page.screenshot({path:path.join(screenshots,'home-portrait.png')});await page.locator('#start').click();await page.locator('#launch').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).usedMods,false);
 await page.locator('#pause').click();await page.locator('#abandon').click();await page.locator('#backHome').click();await page.setViewportSize({width:320,height:640});await page.locator('#start').click();await page.screenshot({path:path.join(screenshots,'loadout-small-phone.png')});await page.locator('#launch').click();for(const selector of ['#joystick','#fire','#emp','#weaponSwitch']){const b=await page.locator(selector).boundingBox();assert.ok(b.x>=0&&b.x+b.width<=321,selector+' narrow phone');}
 // Offline reload once the service worker has control.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);assert.ok((await page.evaluate(()=>caches.keys())).includes('neon-outpost-v2'));await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.neonDiagnostics?.().frame>2);assert.equal(await page.locator('#start').isVisible(),true);assert.equal((await page.evaluate(()=>neonDiagnostics())).profile.hull,2);await context.setOffline(false);
 assert.deepEqual(errors,[]);
 // A test-only scene renders a phase-two boss without adding debug controls to the shipped HTML.
 const bossContext=await browser.newContext({viewport:{width:1100,height:680},serviceWorkers:'block'}),bossPage=await bossContext.newPage();bossPage.on('pageerror',e=>errors.push(e.message));
 const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const fixture=source.replace(/\}\)\(\);\s*<\/script>\s*<\/body>/,`window.previewBoss=()=>{start();state.wave=8;enemies=[];remainingSpawns=1;bossQueued=true;spawnEnemy();remainingSpawns=0;const e=enemies[0];e.x=0;e.z=-3;e.hp=e.maxHp*.4;state.mods.god=true;};})();</script></body>`);
 await bossPage.route('**/preview-boss',route=>route.fulfill({contentType:'text/html',body:fixture}));await bossPage.goto('http://127.0.0.1:8080/preview-boss');await bossPage.waitForFunction(()=>window.previewBoss&&neonDiagnostics().frame>2);await bossPage.evaluate(()=>previewBoss());await bossPage.waitForFunction(()=>document.getElementById('bossName').textContent.includes('FASE 2'));await bossPage.screenshot({path:path.join(screenshots,'overlord-phase-2.png')});assert.equal(await bossPage.locator('#bossHud').isVisible(),true);assert.deepEqual(errors,[]);await bossContext.close();
 console.log('PASS: V2 WebGL, loadout, difficulty/sector, 3 weapons, EMP cooldown, real combat XP, perk purchase, dual touch, mods, upgrade pause/resume, 320px/390px/844px layouts, hangar persistence, offline V2 reload; no page errors.');
 console.log('Screenshots: '+screenshots);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
