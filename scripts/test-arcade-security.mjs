import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import { isolatedPlayerUrl, scoreRecordKey } from '../src/utils/arcadeSecurity.js';
import { payloadPath, mountGame, GAME_SANDBOX, GAME_PERMISSIONS } from '../public/arcade-player.js';

const entries = JSON.parse(await readFile('public/ports/manifest.json','utf8'));
assert.equal(new Set(entries).size, entries.length);
assert(entries.includes('vice-city') && entries.includes('hollow-knight'));
assert(!(await readdir('public/ports')).some(name => name.endsWith('.html')), 'Direct executable adapter URLs must be absent');
assert(!entries.includes('minecraft-legacy'), 'Unmaintained legacy runtime must not be executable');
assert.throws(()=>payloadPath('minecraft-legacy',entries));
const legacyRoute=await readFile('public/minecraft_1_5_2.html','utf8');
assert(legacyRoute.includes('/#arcade') && !legacyRoute.includes('<script'));
const legacy=await readFile('public/ports/minecraft-legacy.json','utf8');
assert(!legacy.includes('<'));
for (const id of entries) {
  assert.equal(payloadPath(id, entries), `ports/${id}.json`);
  const serialized = await readFile(`public/ports/${id}.json`, 'utf8');
  assert(!serialized.includes('<'), 'Payload must not be HTML-sniffable');
  const html = JSON.parse(serialized).html;
  assert(typeof html === 'string' && html.includes('<script'));
  assert(!html.includes('@latest'), `Mutable runtime revision: ${id}`);
  // Compile every local inline script without running it or loading upstream code.
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=|type\s*=\s*["'](?:module|application\/json)/i.test(match[1])) continue;
    new vm.Script(match[2], {filename:`${id}:inline-script`});
  }
}
for (const bad of ['../celeste','%2e%2e/celeste','celeste.json','https://evil.test','<script>','constructor','']) assert.throws(()=>payloadPath(bad,entries));
assert.equal(isolatedPlayerUrl('/ports/celeste.json'),'/arcade-player.html?game=celeste');
assert.equal(isolatedPlayerUrl('/portfolio/ports/celeste.json','/portfolio/'),'/portfolio/arcade-player.html?game=celeste');
for(const bad of ['/ports/../celeste.json','/ports/%2e%2e.json','https://evil.test/ports/celeste.json','/ports/celeste.html'])assert.throws(()=>isolatedPlayerUrl(bad));
for(const name of ['Siraç','%2e%2e/visitors/payload','../../admin','a%2fb','a\\b','a?#[]','$#.%']) {
  const key=scoreRecordKey(name,'gta_vc');
  assert(/^[a-z0-9_-]+$/.test(key));
  assert(new URL(`https://db.test/scores/${key}.json`).pathname.startsWith('/scores/'));
}
assert.notEqual(scoreRecordKey('a/b','gta_vc'),scoreRecordKey('a_b','gta_vc'));
assert.throws(()=>scoreRecordKey('x','../admin'));
const attrs={};let mounted;
const fakeDocument={createElement(){return {setAttribute(k,v){attrs[k]=v},addEventListener(){},focus(){}}},body:{replaceChildren(frame){mounted=frame}}};
mountGame('<script>parent.document.body.remove()</script>',fakeDocument);
assert.equal(attrs.sandbox,GAME_SANDBOX);
assert(!attrs.sandbox.includes('allow-same-origin'));
for(const forbidden of ['allow-forms','allow-popups','allow-top-navigation','allow-downloads','allow-modals']) assert(!attrs.sandbox.includes(forbidden));
assert.equal(attrs.allow,GAME_PERMISSIONS);
assert.equal(attrs.referrerpolicy,'no-referrer');
assert(mounted.srcdoc.includes('parent.document'));
assert.throws(()=>mountGame({},fakeDocument));
const vice=JSON.parse(await readFile('public/ports/vice-city.json','utf8')).html;
assert(vice.includes('sessionFiles.set(name, buffer)') && vice.includes('sessionFiles.has(name)'));
for(const id of ['fear-and-hunger-2','in-stars-and-time']) {
 const html=JSON.parse(await readFile(`public/ports/${id}.json`,'utf8')).html;
 assert(!html.includes('new URL(url, location.href)'));
 assert(html.includes('new URL(url, document.baseURI)'));
}
console.log(`${entries.length} isolated runtime payloads: boundary, path, capability and inline syntax regressions passed.`);
