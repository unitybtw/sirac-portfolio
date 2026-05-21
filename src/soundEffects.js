// Retro Sound Effects Synthesizer using Web Audio API
let audioCtx = null;
let isMuted = localStorage.getItem('portfolio-muted') === 'true';

export const setMutedState = (muted) => {
  isMuted = muted;
  localStorage.setItem('portfolio-muted', muted ? 'true' : 'false');
};

export const getMutedState = () => isMuted;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a synthesized sound sequence
const playTone = (freqs, durations, type = 'sine', volume = 0.1) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    gainNode.gain.setValueAtTime(volume, now);
    const totalDuration = durations.reduce((a, b) => a + b, 0);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);
    
    let timeOffset = 0;
    freqs.forEach((freq, idx) => {
      osc.frequency.setValueAtTime(freq, now + timeOffset);
      timeOffset += durations[idx];
    });
    
    osc.start(now);
    osc.stop(now + timeOffset);
  } catch (err) {
    console.warn('Audio synthesis failed:', err);
  }
};

// 1. UI Click: Fast triangle pop
export const playClick = () => {
  playTone([800, 1200], [0.04, 0.04], 'triangle', 0.15);
};

// 2. UI Hover: Short sine wave frequency slide — throttled to prevent scroll audio storms
let lastHoverTime = 0;
export const playHover = () => {
  const now = Date.now();
  if (now - lastHoverTime < 120) return;
  lastHoverTime = now;
  playTone([180, 240], [0.02, 0.02], 'sine', 0.05);
};

// 3. Level Up / Success Chime: Bright square arpeggio
export const playSuccess = () => {
  playTone([261.63, 329.63, 392.00, 523.25], [0.08, 0.08, 0.08, 0.15], 'square', 0.08);
};

// 4. Arcade Window Open: Upwards retro arpeggio run
export const playArcadeOpen = () => {
  playTone([440, 554.37, 659.25, 880, 1109.73, 1318.51], [0.04, 0.04, 0.04, 0.04, 0.04, 0.1], 'triangle', 0.1);
};

// 5. Robot Dialogue Mumble: Fast random chirps mimicking 8-bit speech
let lastDroneSoundTime = 0;
export const playDroneChat = () => {
  const now = Date.now();
  // Throttle speech chirps so they don't overlay into white noise
  if (now - lastDroneSoundTime < 80) return;
  lastDroneSoundTime = now;
  
  const randomFreqs = Array.from({ length: 3 }, () => Math.floor(Math.random() * 300) + 400);
  playTone(randomFreqs, [0.04, 0.04, 0.04], 'square', 0.04);
};
