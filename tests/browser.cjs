const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8080/');await page.waitForFunction(()=>window.neonDiagnostics?.().frame>5);
 assert.equal(await page.locator('#error').isVisible(),false);
 const screenshots=process.env.NEON_SCREENSHOTS||'/tmp/neon-outpost-qa';fs.mkdirSync(screenshots,{recursive:true});
 await page.screenshot({path:path.join(screenshots,'home-landscape.png')});
 await page.locator('#start').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'playing');
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
 // Pause must freeze health and position, and resume must work after buying.
 await page.locator('#mods').click();const paused=await page.evaluate(()=>neonDiagnostics());await page.waitForTimeout(300);assert.deepEqual((await page.evaluate(()=>neonDiagnostics())).player,paused.player);
 await page.locator('#moneyToggle').uncheck();await page.locator('#godToggle').uncheck();await page.locator('#resume').click();const switched=await page.evaluate(()=>neonDiagnostics());assert.equal(switched.mods.money,false);assert.equal(switched.mods.god,false);assert.equal(switched.usedMods,true);
 await page.locator('#pause').click();await page.locator('#pauseSettings').click();await page.locator('#quality').selectOption('battery');await page.locator('#closePanel').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).mode,'playing');
 // Resize to a narrow phone; controls and menus must remain in bounds.
 await page.setViewportSize({width:390,height:844});await page.locator('#mods').click();
 await page.screenshot({path:path.join(screenshots,'mods-portrait.png')});
 for(const selector of ['#panel','#godToggle','#moneyToggle','#resume']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=391&&b.y+b.height<=845,selector+' visible '+JSON.stringify(b));}
 await page.locator('#resume').click();await page.screenshot({path:path.join(screenshots,'game-portrait.png')});
 await page.locator('#pause').click();await page.locator('#backHome').click();await page.screenshot({path:path.join(screenshots,'home-portrait.png')});await page.locator('#start').click();assert.equal((await page.evaluate(()=>neonDiagnostics())).usedMods,false);
 // Offline reload once the service worker has control.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.neonDiagnostics?.().frame>2);assert.equal(await page.locator('#start').isVisible(),true);await context.setOffline(false);
 assert.deepEqual(errors,[]);
 console.log('PASS: WebGL startup, mobile layout, dual touch, movement, mod toggles, free upgrades, pause/resume, reset, offline reload; no page errors.');
 console.log('Screenshots: '+screenshots);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
