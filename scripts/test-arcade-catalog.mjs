import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { gamesList, getGameCategory } = await server.ssrLoadModule('/src/gamesData.jsx');
  const ids = new Set(gamesList.map(game => game.id));
  assert.equal(ids.size, gamesList.length, 'Game IDs must be unique for scores and restart');
  for (const id of ['mario64', 'lale_savascilari', 'flappy_bird', 'tetris', 'breakout', 'astray', 'clumsy_bird', 'minesweeper', 'raft', 'untitled_goose']) assert(!ids.has(id), `Removed game ${id} must not reappear`);
  for (const id of ['doom3', 'arx_fatalis', 'netquake', 'red_alert2', 'hotline_miami', 'celeste', 'plants_vs_zombies', 'slime_rancher', 'cuphead', 'silksong', 'bendy', 'iron_lung', 'tabs', 'miside']) assert(ids.has(id), `Missing port ${id}`);
  for (const game of gamesList) assert(['simulation','arcade','puzzle'].includes(getGameCategory(game.id)));
  const code = await readFile('src/gamesData.jsx', 'utf8');
  const html = await readFile('index.html','utf8');
  const scriptPolicy = html.match(/script-src ([^;]+);/)[1];
  assert(!scriptPolicy.includes('cdn.jsdelivr.net') && !scriptPolicy.includes('unsafe-eval'), 'Portfolio must not execute upstream game scripts');
  const framePolicy = html.match(/frame-src ([^;]+);/)[1];
  for (const match of code.matchAll(/hosted\(\{([^\n]+)\}\)/g)) {
    if (match[1].includes('external:true')) continue;
    const local = match[1].match(/url:`\$\{import.meta.env.BASE_URL\}ports\/([^`]+)`/);
    if (local) {
      assert(match[1].includes('opaqueOrigin:true'), 'Local adapters must isolate remote scripts from the portfolio');
      const adapter = JSON.parse(await readFile(`public/ports/${local[1]}`, 'utf8')).html;
      assert(adapter.includes('<base href="https://cdn.jsdelivr.net/gh/web-ports/'), 'Adapter assets must retain their upstream base');
      continue;
    }
    const url = match[1].match(/url:'([^']+)'/)[1];
    assert(framePolicy.includes(new URL(url).origin), `Frame policy blocks ${url}`);
  }
  const additions = JSON.parse(await readFile('src/data/additionalBrowserPorts.json', 'utf8'));
  assert(code.includes('opaqueOrigin: true'), 'Bulk ports must retain the opaque-origin sandbox');
  for (const port of additions) {
    assert(ids.has(port.id), `Bulk port missing from catalogue: ${port.id}`);
    assert.equal(getGameCategory(port.id), port.category, `Incorrect category: ${port.id}`);
    assert(/^[a-z0-9-]+\.json$/.test(port.entry), `Unsafe entry path: ${port.entry}`);
    assert(new URL(port.source).hostname === 'github.com', 'Every port must link its source');
    const entry = JSON.parse(await readFile(`public/ports/${port.entry}`, 'utf8')).html;
    assert(entry.includes('<base href="https://cdn.jsdelivr.net/gh/web-ports/'), `Missing upstream base: ${port.entry}`);
    assert(entry.indexOf('const memoryStorage') < entry.indexOf('<base '), `Memory storage must load before the remote base: ${port.entry}`);
  }
  const library = await readFile('src/GameLibrary.jsx','utf8');
  const highlights = library.split('const featuredHighlights = [')[1].split('];')[0];
  for (const match of highlights.matchAll(/id: '([^']+)'/g)) assert(ids.has(match[1]), `Portal references removed game ${match[1]}`);
  console.log(`${gamesList.length} games: IDs, categories, removals, highlights and frame policies passed.`);
} finally { await server.close(); }
