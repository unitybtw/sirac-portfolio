# Website and arcade security fix — 14 October 2026

Outcome: the demonstrated portfolio-origin game execution boundary is closed by the local player and tested with benign browser probes. The original static scan reviewed revision `f385a1c14cc6b109f44eabd49fed20ab8550da51`; its report is historical evidence, not a scan of the patched revision. The source review had partial coverage and did not establish deployed Firebase rules or exhaustively audit game vendors.

## Change

GTA Vice City and Hollow Knight previously executed upstream code in same-origin `srcdoc` frames. Local HTML adapters could also bypass their catalogue sandbox through direct navigation. Their markup now lives in inert JSON, with `<` escaped. The trusted shell accepts only manifest IDs and creates an opaque child frame for runtime execution. It never inserts payload HTML into its own DOM. All 39 supported local runtime documents follow that path; the 62-game catalogue is retained. The unused standalone Minecraft executable is retired to a library redirect, with its original markup archived as inert data outside the player allowlist.

Embedded games cannot open popups, navigate the top page, submit forms, download files, or request camera, microphone, location and other sensitive capabilities through the granted iframe permissions. External URL games retain their own origin; the explicit Red Alert 2 new-tab link remains outside iframe enforcement. Referrers are suppressed. The portfolio CSP no longer grants remote game script execution, remote base selection or JavaScript evaluation. The isolated runtime shell owns game-specific asset permissions instead.

Vice City's session map preserves merged downloads without granting IndexedDB access, and releases part buffers after merging. Relative URL adapters resolve against the upstream document base. Hollow Knight and Silksong executable loaders use fixed revisions. Flat Unicode-derived Firebase record keys eliminate nickname path selection; score writes accept only catalogue IDs and bounded integer scores. These are client protections, not server authorization.

The dependency advisory check initially reported 19 affected packages. Compatible updates plus removal of unused `gh-pages` reduced `npm audit` to zero known vulnerabilities. The Actions-based Pages workflow remains the release path.

## Verification

- Build: passed.
- Lint: passed with zero errors and five pre-existing warnings in unrelated/legacy UI code.
- Catalogue/static security: passed for 62 games, 39 allowed runtime payloads, inert legacy archive, malicious path variants, capability restrictions, memory-cache wiring and local inline script syntax.
- Browser: original same-origin storage read reproduced. The patched player denied parent DOM/top storage/IndexedDB access, top navigation, popups and camera/microphone/geolocation. Session memory saves, WebAssembly and Blob workers passed in installed Chrome. Direct old adapter URLs were absent; new URLs returned non-HTML JSON. Invalid player IDs did not create a game frame.
- Dependency advisory check: zero vulnerabilities.
- Independent read-only patch review: no surviving source-backed origin escape found. Its legacy Minecraft compatibility finding was addressed by retiring the unused standalone executable rather than enabling unsupported storage/network capabilities.

No third-party game was downloaded or played. The browser checks establish the boundary and basic runtime primitives, not gameplay compatibility. Upstream code remains unaudited and may consume resources or track users inside its own allowed context. Deployed Firebase rules, Web3Forms account settings and live hosting response headers remain unverified.
