export const FRAME_PERMISSIONS = "autoplay; fullscreen; camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; clipboard-read 'none'; clipboard-write 'none'; usb 'none'; serial 'none'; hid 'none'; display-capture 'none'";

// Local JSON is data, never a frame document. Only the trusted player may consume it.
export function isolatedPlayerUrl(url, base = '/') {
  const prefix = `${base}ports/`;
  if (!url.startsWith(prefix)) throw new Error('Invalid local game path');
  const entry = url.slice(prefix.length);
  if (!/^[a-z0-9-]+\.json$/.test(entry)) throw new Error('Invalid local game entry');
  return `${base}arcade-player.html?game=${entry.slice(0, -5)}`;
}

export function scoreRecordKey(name, gameId) {
  // Unicode code points produce a flat, deterministic Firebase key. Display names
  // remain in the record body, never in the URL path, even after URL decoding.
  if (typeof name !== 'string' || !name.trim() || [...name].length > 32 || !/^[a-z0-9_]+$/.test(gameId)) throw new Error('Invalid score identity');
  return `u-${[...name.normalize('NFC')].map(char => char.codePointAt(0).toString(16)).join('-')}_${gameId}`;
}
