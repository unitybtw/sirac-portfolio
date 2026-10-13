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
