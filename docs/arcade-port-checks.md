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


## Bulk catalogue expansion — 2026-10-14

Added 28 more community browser ports, bringing the catalogue to 62 entries. Descriptors are centralized in `src/data/additionalBrowserPorts.json`, with categories, source links, pinned entry revisions and download sizes when the source loader provides them. The adapters keep runtime binaries upstream and retain the opaque sandbox and session-only storage. No game binary is downloaded just by opening the catalogue.

The user requested additions without opening or gameplay-testing each game. Only source entries were read and catalogue/build checks were run; these additions are not gameplay-verified. ANTONBLAST is explicitly labelled as a demo. KinitoPET's repository had no entry to retrieve; Animal Crossing's ROM-import client was omitted from this batch. Previously excluded broken games remain excluded.

| Added game | Source | Entry revision |
| --- | --- | --- |
| Terraria | https://github.com/web-ports/terraria | `47731568354e` |
| Granny | https://github.com/web-ports/granny | `60c96c26856a` |
| Granny: Chapter Two | https://github.com/web-ports/granny-2 | `93217d1f5384` |
| ANTONBLAST — Demo | https://github.com/web-ports/antonblast | `1534cf1f683c` |
| NEEDY STREAMER OVERLOAD | https://github.com/web-ports/needy-streamer-overload | `59681566ec4e` |
| 20 Minutes Till Dawn | https://github.com/web-ports/20-minutes | `e82366ecffd3` |
| Fear & Hunger | https://github.com/web-ports/fear-and-hunger | `491156e1a00d` |
| Fear & Hunger 2: Termina | https://github.com/web-ports/fear-and-hunger-2 | `b52a0b60d230` |
| Your Only Move Is HUSTLE | https://github.com/web-ports/yomi-hustle | `dab11bc3c2f5` |
| Cruelty Squad | https://github.com/web-ports/cruelty-squad | `19362b389fec` |
| Just Shapes & Beats | https://github.com/web-ports/jsab | `d641f8b750b2` |
| FNaF World — Refreshed | https://github.com/web-ports/fnaf-world-refreshed | `5ad15720ba66` |
| Peaks of Yore | https://github.com/web-ports/peaks-of-yore | `2ea4ff35ac44` |
| CloverPit | https://github.com/web-ports/clover-pit | `2ea4c7c5e25f` |
| Spaceflight Simulator | https://github.com/web-ports/spaceflight-simulator | `c10c91692e4e` |
| Look Outside | https://github.com/web-ports/look-outside | `648f71f7680a` |
| In Stars and Time | https://github.com/web-ports/in-stars-and-time | `27e9333ba913` |
| Sonic Robo Blast 2 | https://github.com/web-ports/srb2 | `f6702b8f077b` |
| Christmas Massacre | https://github.com/web-ports/christmas-massacre | `156b0e5a5665` |
| MINDWAVE | https://github.com/web-ports/mindwave | `df0638158961` |
| Saihate Station | https://github.com/web-ports/saihate-station | `d9537964e102` |
| Gorilla Tag — Web | https://github.com/web-ports/gorilla-tag | `01e75c72bbf0` |
| Five Nights at Candy’s | https://github.com/web-ports/fnac/tree/ba0ff4088706af7db1da0a60a77b5b8704863376/1 | `ba0ff4088706` |
| Five Nights at Candy’s 2 | https://github.com/web-ports/fnac/tree/ba0ff4088706af7db1da0a60a77b5b8704863376/2 | `ba0ff4088706` |
| Five Nights at Candy’s 3 | https://github.com/web-ports/fnac/tree/ba0ff4088706af7db1da0a60a77b5b8704863376/3 | `ba0ff4088706` |
| Slendytubbies | https://github.com/web-ports/slendytubbies/tree/efd9ef91acd1282a9ec4cae5bfd2fadc4f9f07ce/1 | `efd9ef91acd1` |
| Slendytubbies II | https://github.com/web-ports/slendytubbies/tree/efd9ef91acd1282a9ec4cae5bfd2fadc4f9f07ce/2 | `efd9ef91acd1` |
| Slendytubbies 2D | https://github.com/web-ports/slendytubbies/tree/efd9ef91acd1282a9ec4cae5bfd2fadc4f9f07ce/2d | `efd9ef91acd1` |
