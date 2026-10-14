import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('index.html','utf8');
const source=html.match(/<script>\s*(\(\(\) => \{[\s\S]*?)<\/script>/)[1];
function boot({type='navigate',hash='',seen=false,reduced=false,storageBlocked=false}={}) {
  const classes=new Set();const timers=[];const root={dataset:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)}};
  const storage=value=>({getItem(){if(storageBlocked)throw Error('blocked');return value}});
  vm.runInNewContext(source,{document:{documentElement:root},sessionStorage:storage(seen?'1':null),localStorage:storage('dark'),performance:{getEntriesByType:()=>[{type}]},location:{hash},matchMedia:()=>({matches:reduced}),setTimeout:callback=>timers.push(callback)});
  return {root,classes,timers};
}
let result=boot();assert.equal(result.root.dataset.enterMotion,'on');assert.equal(result.root.dataset.intro,'pending');assert(result.classes.has('mini-crew-pending'));assert(result.classes.has('dark'));
for (const options of [{type:'reload'},{type:'back_forward'},{seen:true},{hash:'#contact'},{reduced:true}]) {
 result=boot(options);assert.equal(result.root.dataset.intro,'skip');if(options.type || options.hash)assert.equal(result.root.dataset.enterMotion,'off');assert(!result.classes.has('mini-crew-pending'));
}
result=boot({storageBlocked:true});assert.equal(result.root.dataset.intro,'pending');result.timers[0]();assert.equal(result.root.dataset.intro,'skip');assert(!result.classes.has('mini-crew-pending'));
const app=await readFile('src/App.jsx','utf8');assert(!app.includes('window.scrollTo(0, 0)'));assert(!app.includes('immediate: true'));
const css=await readFile('src/index.css','utf8');assert(!/section:not\(#hero\)\s*\{[^}]*content-visibility:\s*auto/.test(css));
console.log('Initial paint: first visit, reload, history, anchors, session reuse, reduced motion, blocked storage and timeout fallback passed.');
