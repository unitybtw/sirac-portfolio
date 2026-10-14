# Arcade port checks — 2026-10-13

The catalogue contains browser ports, demo editions and an external browser client. These are not all complete games or first-party ports. Upstream availability can change.

## Removed entries

- Super Mario 64 (`64.js.org`): the address serves JS.ORG's 302 error page instead of the game.
- Flappy Bird (`wayou.github.io/FlappyBird`): HTTP 404.
- Istanbul Legends / Lale Savaşçıları: the component shows a YouTube video and ZIP download, not a playable browser game.
- The five newly proposed small games were removed at the user's request before publication.
- Proposed Raft port: necessary loader and data parts return HTTP 403 from its configured CDN; it never progressed past the loading screen in Dia.

Existing source components and saved scores are retained; removed entries are absent from the catalogue and portal shortcuts.

## Added PC ports

| Entry | Runtime | Edition / requirements |
| --- | --- | --- |
| DOOM 3 | https://wasm.continuation-labs.com/d3demo/ | Demo, approximately 400 MB initial download |
| Arx Fatalis | https://wasm.continuation-labs.com/arxdemo/ | Demo |
| Quake | https://www.netquake.io/ | Free first episode; original game files unlock further episodes |
| Red Alert 2 / Chrono Divide | https://game.chronodivide.com/ | Community beta, launches in a new tab; upstream frame policy forbids embedding |
| Hotline Miami | https://raw.githack.com/genizy/web-port/main/hotline-miami/index.html | Community port |

Sources and keyboard controls are linked inside the player. The existing inline Vice City/Hollow Knight players require exact CDN script paths; Vice City additionally requires its pinned base URL in `base-uri`. These paths were added without granting access to an entire CDN host. Exact iframe origins are included in the site's frame policy. No third-party code or game data is rehosted by these additions.

The existing remote entry pages and their referenced scripts were checked over HTTP. Successful responses are availability evidence, not full gameplay validation. For example, Cookie Clicker's missing `excanvas` script is an old-IE conditional fallback and does not establish that the modern game is broken. ULTRAKILL's loader responds successfully to GET even though HEAD was rejected, so it was not removed on that basis.

Run `node scripts/test-arcade-catalog.mjs` to validate IDs, categories, removals, portal shortcuts and iframe origins. Run `npm run build` before publishing.

## Browser verification

Dia was used against localhost. DOOM 3 and Arx Fatalis completed their initial downloads and rendered their game opening screens. Quake reached a rendered 3D game scene. Hotline Miami passed its splash and rendered the top-down game scene. The Red Alert 2 link opened its actual client in a new tab and reached the asset import/download screen; no account was created and no full match was tested.

Vice City loaded data from the pinned CDN after the policy correction. A successful download alone is not proof of a complete playthrough. The rest of the existing catalogue received entry-page and referenced-script availability checks rather than exhaustive gameplay testing.

## Additional ports — second batch

- Celeste: `web-ports/celeste`, pinned entry base `4f043a5ce121b74dc54ce56d74f213a2eeea6b4e`.
- Plants vs. Zombies: `web-ports/pvz`, pinned entry base `e3b5ddce5a318df69698d906a6d78313e327f965`, approximately 43 MB game archive.
- Untitled Goose Game was investigated but **excluded**: an isolated adapter reached the menu, but Begin did not advance and the engine reported a save-file exception. A menu alone does not qualify as a working game.
- Slime Rancher: `web-ports/slime-ranchers`, pinned entry base `f0c5856ac43cf0cfbab4c58139282fc75f9b1861`. This is a community alpha, not the current retail release.

Small entry adapters are stored under `public/ports`. Game engines and binary assets remain on the upstream CDN; source links stay visible inside the player. The hosting proxy now serves an external-content notice instead of directly serving some HTML entries, so these ports use their own source entry adapters rather than embedding that proxy notice.

Local adapters deliberately omit `allow-same-origin` from their iframe sandbox: upstream code cannot access the portfolio document or its storage. Celeste expects storage APIs during startup; a session-only storage adapter supplies local/session storage without granting origin access. Persistent saves are not provided. The player labels this limitation; Celeste's upstream save manager can export a save. Plants vs. Zombies' entry cache is disabled, and its runtime falls back to memory when IndexedDB is unavailable.

Loading indicators are neutral and engine failures show a retry message instead of a silently frozen loader. Initial runtime/script/data availability checks returned successful responses. These checks alone do not establish gameplay support.

## Catalogue expansion — 2026-10-14

Added Cuphead, Hollow Knight: Silksong, Bendy and the Ink Machine, Iron Lung, Totally Accurate Battle Simulator and MiSide using source entry adapters. Binary assets stay upstream. Cuphead uses its existing pinned base; other additions use the retrieved commit revision. Sandbox storage now implements in-memory Cache Storage as well as local/session storage because Silksong extracts downloaded files into that API before booting. Nothing persists after the game iframe is closed.

**These six games were not opened or gameplay-tested, as requested by the user.** Source entries were read to integrate loaders and disclose large initial downloads. Catalogue/build checks verify wiring, not upstream availability or gameplay. Approximate downloads in the upstream loaders are 2.1 GB for Cuphead, 2 GB for Silksong, 685 MB for Bendy and 1.75 GB for TABS.

Mobile GitHub layout: the flex chart container now has a zero minimum width and a bounded width. Only the calendar grid scrolls; the explanatory link and colour legend remain outside it. The mobile card uses smaller padding and a scroll hint, and initially positions the calendar at its newest weeks.

Dia visual review confirmed that the GitHub card fits 390 px and 320 px device widths, with its footer and year selectors visible. The newly added six game runtimes were not opened. Earlier in the work, Celeste reached its title screen, Plants vs. Zombies reached its new-player/menu screen, and Slime Rancher reached its alpha menu; these are opening-screen checks, not complete-playthrough evidence.
