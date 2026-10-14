// Only repository-owned payload IDs are accepted. Payload HTML is never inserted
// into this trusted document, including on standalone/direct navigation.
export const GAME_SANDBOX = 'allow-scripts allow-pointer-lock';
export const GAME_PERMISSIONS = "autoplay; fullscreen; camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; clipboard-read 'none'; clipboard-write 'none'; usb 'none'; serial 'none'; hid 'none'; display-capture 'none'";

export function payloadPath(id, manifest) {
  if (!/^[a-z0-9-]+$/.test(id) || !Array.isArray(manifest) || !manifest.includes(id)) {
    throw new Error('Unknown game');
  }
  return `ports/${id}.json`;
}

export function mountGame(html, documentObject = document) {
  if (typeof html !== 'string' || !html || html.length > 25_000_000) throw new Error('Invalid game payload');
  const frame = documentObject.createElement('iframe');
  frame.title = 'Sandboxed game';
  frame.setAttribute('sandbox', GAME_SANDBOX);
  frame.setAttribute('allow', GAME_PERMISSIONS);
  frame.setAttribute('referrerpolicy', 'no-referrer');
  frame.allowFullscreen = true;
  frame.addEventListener('load', () => frame.focus());
  frame.srcdoc = html;
  documentObject.body.replaceChildren(frame);
  return frame;
}

async function start() {
  try {
    const id = new URLSearchParams(location.search).get('game') || '';
    const manifestResponse = await fetch('ports/manifest.json', {credentials: 'omit'});
    if (!manifestResponse.ok) throw new Error('Catalogue unavailable');
    const path = payloadPath(id, await manifestResponse.json());
    const response = await fetch(path, {credentials: 'omit'});
    if (!response.ok) throw new Error('Game unavailable');
    const payload = await response.json();
    mountGame(payload.html);
  } catch {
    // Do not interpolate query values or upstream HTML into the error page.
    document.getElementById('status').textContent = 'This game could not load. Return to the library and try Restart.';
  }
}
if (typeof document !== 'undefined') start();
