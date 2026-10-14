# Arcade security boundary

Local runtime documents are stored in `public/ports/*.json`, with `<` escaped so they cannot be interpreted as HTML on direct navigation. `arcade-player.html` loads only manifest-listed IDs. It inserts the payload only into an inner `srcdoc` iframe with `allow-scripts allow-pointer-lock`, without `allow-same-origin`. The trusted shell retains its own origin to fetch JSON; it never executes upstream markup in its own DOM. The unmaintained standalone Minecraft entry redirects to the Arcade library. Its original markup is retained only as inert JSON, outside the player allowlist; it is not one of the 62 catalogue games. Its native world storage and multiplayer relays are not supported by the isolated player.

Remote URL games retain their upstream origin, with sandbox restrictions on forms, popups, downloads and top-level navigation. Sensitive device permissions and referrers are denied. The explicit Red Alert 2 external launch remains a user-selected link with `noopener noreferrer`; the site cannot sandbox a separate external tab.

Opaque local games use memory-only storage. Restarting or closing the game discards those saves. Vice City's merged downloads remain in a per-frame memory map when IndexedDB is unavailable. Upstream dependencies for Hollow Knight and Silksong use fixed revisions. This controls revision selection, not proof that upstream game code is trustworthy.

## Verification

- `npm run build`
- `npm run lint`
- `node scripts/test-arcade-security.mjs`: all 39 playable runtime payloads and the inert legacy archive, syntax of local inline scripts, manifest/path restrictions, capability restrictions, nickname-derived flat database keys and storage compatibility wiring.
- `node scripts/test-arcade-catalog.mjs`: all 62 catalogue entries, categories and frame policies.
- `node scripts/test-arcade-browser-security.mjs`: a benign local fixture reproduces the old shared-origin storage read, then confirms DOM/storage access, top navigation, popups and camera/microphone/geolocation permissions are denied. Memory saves, WebAssembly and Blob workers remain usable. Requires installed Chrome, localhost server permission and a current build. No actual game is downloaded or played.
- `npm audit`: dependency advisory status is separate from game-code auditing.

## Limits

The sandbox contains the game's browser authority; it does not audit third-party code, prevent all tracking within remote game origins, or limit memory/bandwidth consumption. Some upstream runtimes may need additional compatibility work under opaque origins; actual gameplay was not retested at the user's request. Browser-origin guarantees follow the [iframe sandbox model](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe). A [CSP sandbox directive cannot be enforced through a meta tag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/sandbox), so the boundary is supplied by the trusted iframe owner rather than a pretend header.

Firebase rules are outside this repository and were not remotely verified. Flat client-side keys and bounded score values prevent the client from constructing unintended paths, but do not authorize writes, prove score legitimacy or enforce record ownership. Those properties require deployed Firebase rules/authentication or a trusted score service. No claim of complete security or backend authorization is made.
