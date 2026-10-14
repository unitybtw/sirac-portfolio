import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
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
  const basePolicy = html.match(/base-uri ([^;]+);/)[1];
  const viceBase = 'https://cdn.jsdelivr.net/gh/web-ports/vice-city@49409b9dd26b45d0cbfdb5c93dd19f38750e4207/';
  const hollowBase = 'https://cdn.jsdelivr.net/gh/web-ports/hollow-knight@latest/';
  assert(scriptPolicy.includes(viceBase) && basePolicy.includes(viceBase), 'Vice City requires its pinned CDN base and script policy');
  assert(scriptPolicy.includes(hollowBase), 'Hollow Knight requires its CDN loader policy');
  const framePolicy = html.match(/frame-src ([^;]+);/)[1];
  for (const match of code.matchAll(/hosted\(\{([^\n]+)\}\)/g)) {
    if (match[1].includes('external:true')) continue;
    const local = match[1].match(/url:`\$\{import.meta.env.BASE_URL\}ports\/([^`]+)`/);
    if (local) {
      assert(match[1].includes('opaqueOrigin:true'), 'Local adapters must isolate remote scripts from the portfolio');
      const adapter = await readFile(`public/ports/${local[1]}`, 'utf8');
      assert(adapter.includes('<base href="https://cdn.jsdelivr.net/gh/web-ports/'), 'Adapter assets must retain their upstream base');
      continue;
    }
    const url = match[1].match(/url:'([^']+)'/)[1];
    assert(framePolicy.includes(new URL(url).origin), `Frame policy blocks ${url}`);
  }
  const library = await readFile('src/GameLibrary.jsx','utf8');
  const highlights = library.split('const featuredHighlights = [')[1].split('];')[0];
  for (const match of highlights.matchAll(/id: '([^']+)'/g)) assert(ids.has(match[1]), `Portal references removed game ${match[1]}`);
  console.log(`${gamesList.length} games: IDs, categories, removals, highlights and frame policies passed.`);
} finally { await server.close(); }
