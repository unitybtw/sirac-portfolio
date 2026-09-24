// Hafif arcade ses efektleri — bağımlılıksız WebAudio blip'leri.
// GameLibrary'nin beklediği isimlerle dışa açılır. Her şey guarded:
// AudioContext ilk kullanıcı etkileşiminde açılır, hata verirse sessiz geçilir.

let ctx = null;

function audio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function blip(freqFrom, freqTo, duration, type = 'square', volume = 0.05) {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freqFrom, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), ac.currentTime + duration);
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch {
    /* sessiz geç */
  }
}

export function playClick() {
  blip(900, 500, 0.07);
}

export function playHover() {
  blip(1400, 1800, 0.04, 'sine', 0.025);
}

export function playSuccess() {
  blip(600, 1200, 0.16, 'sine', 0.07);
  setTimeout(() => blip(900, 1800, 0.2, 'sine', 0.06), 90);
}

export function playArcadeOpen() {
  blip(300, 900, 0.22, 'sawtooth', 0.05);
}
