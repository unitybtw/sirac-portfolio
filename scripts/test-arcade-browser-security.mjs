// Benign local security probes only: never downloads or executes a game runtime.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { GAME_PERMISSIONS } from '../public/arcade-player.js';

const shim = await readFile('public/ports/sandbox-storage.js','utf8');
const probe = `<!doctype html><script>${shim}</script><script>
(async () => {
 const result = {};
 try { result.parentDOM = !!parent.document.body; } catch { result.parentDOM = false; }
 try { result.topStorage = top.localStorage.getItem('security-sentinel'); } catch { result.topStorage = false; }
 try { result.indexedDB = !!indexedDB.open('probe'); } catch { result.indexedDB = false; }
 localStorage.setItem('session-probe','ok'); result.memorySave = localStorage.getItem('session-probe');
 result.wasm = !!new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0]));
 const policy = document.permissionsPolicy || document.featurePolicy;
 result.camera = policy ? policy.allowsFeature('camera') : null;
 result.microphone = policy ? policy.allowsFeature('microphone') : null;
 result.geolocation = policy ? policy.allowsFeature('geolocation') : null;
 result.popup = !!window.open('about:blank','_blank');
 try { top.location.hash = 'escaped'; result.topNavigation = true; } catch { result.topNavigation = false; }
 result.worker = await new Promise(resolve => {
  const url = URL.createObjectURL(new Blob(['postMessage("ok")'], {type:'application/javascript'}));
  const worker = new Worker(url);
  worker.onmessage = e => { worker.terminate(); URL.revokeObjectURL(url); resolve(e.data); };
  worker.onerror = () => resolve('failed');
  setTimeout(() => resolve('timeout'),3000);
 });
 top.postMessage({type:'security-probe',result}, '*');
})();</script>`;
const fixture = `<!doctype html><script>localStorage.setItem('security-sentinel','private');window.probeResult=null;addEventListener('message',e=>{if(e.data?.type==='security-probe')window.probeResult=e.data.result});</script><iframe style="width:100%;height:100vh" sandbox="allow-scripts allow-same-origin allow-pointer-lock" allow="${GAME_PERMISSIONS.replaceAll('"','&quot;')}" src="/arcade-player.html?game=security-fixture"></iframe>`;
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'};
const root=resolve('dist');
const server=createServer(async(req,res)=>{
 try {
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/fixture.html'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}
  if(pathname==='/ports/security-fixture.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({html:probe}).replaceAll('<','\\u003c'));return;}
  if(pathname==='/ports/manifest.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify([...JSON.parse(await readFile(`${root}/ports/manifest.json`,'utf8')),'security-fixture']));return;}
  const file=resolve(root,`.${pathname==='/'?'/index.html':pathname}`);
  if(!file.startsWith(`${root}/`) || !(await stat(file)).isFile())throw Error('missing');
  res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true, channel: 'chrome'});
try {
 const page=await browser.newPage();
 await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 // Reproduce the original boundary with benign same-origin srcDoc code.
 await page.goto(`${origin}/fixture.html`);
 await page.evaluate(()=>{document.querySelector('iframe').remove();const f=document.createElement('iframe');f.setAttribute('sandbox','allow-scripts allow-same-origin');f.srcdoc='<script>parent.baselineRead=parent.localStorage.getItem("security-sentinel");<\/script>';document.body.append(f)});
 await page.waitForFunction(()=>window.baselineRead==='private');
 await page.goto(`${origin}/fixture.html`);
 await page.waitForFunction(()=>window.probeResult!==null,{timeout:10000});
 const result=await page.evaluate(()=>window.probeResult);
 assert.equal(result.parentDOM,false);
 assert.equal(result.topStorage,false);
 assert.equal(result.indexedDB,false);
 assert.equal(result.popup,false);
 assert.equal(result.topNavigation,false);
 for(const capability of ['camera','microphone','geolocation'])assert.equal(result[capability],false);
 assert.equal(result.memorySave,'ok');assert.equal(result.wasm,true);assert.equal(result.worker,'ok');
 assert.equal(await page.evaluate(()=>localStorage.getItem('security-sentinel')),'private');
 assert(!page.url().includes('#escaped'));
 for(const path of ['/ports/celeste.html','/ports/vice-city.html'])assert.equal((await page.request.get(`${origin}${path}`)).status(),404);
 const json=await page.request.get(`${origin}/ports/celeste.json`);
 assert(json.headers()['content-type'].includes('application/json'));
 assert(!(await json.text()).includes('<'));
 await page.goto(`${origin}/arcade-player.html?game=%2e%2e%2fceleste`);
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('could not load'));
 assert.equal(await page.locator('iframe').count(),0);
 console.log('Browser: original origin breach reproduced; fixed DOM/storage/navigation/popup/device isolation passed; memory saves, WASM and Blob workers passed. No game runtime executed.');
}finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
