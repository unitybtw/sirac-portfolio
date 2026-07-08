// Mechanical Keyboard & UI Sound Synthesizer using Web Audio API
// Default: MUTED — user opens with the speaker button in navbar

let audioCtx = null;

// Default muted = true (user must opt-in)
let isMuted = localStorage.getItem('portfolio-sound-enabled') !== 'true';

export const setMutedState = (muted) => {
  isMuted = muted;
  localStorage.setItem('portfolio-sound-enabled', muted ? 'false' : 'true');
};

export const getMutedState = () => isMuted;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = window.sharedAudioCtx || (
      window.sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
    );
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Core tone builder
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

// Noise burst helper (for the "thock" component of mech keys)
const playNoise = (duration = 0.012, volume = 0.06) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  } catch (err) {
    console.warn('Noise synthesis failed:', err);
  }
};

// 1. Mechanical Key CLICK
export const playClick = () => {
  if (isMuted) return;
  playTone([1400, 700], [0.008, 0.025], 'square', 0.09);
  playNoise(0.018, 0.08);
};

// 2. Mechanical Key HOVER (subtle, throttled)
let lastHoverTime = 0;
export const playHover = () => {
  const now = Date.now();
  if (now - lastHoverTime < 90) return;
  lastHoverTime = now;
  if (isMuted) return;
  playTone([900, 500], [0.005, 0.018], 'triangle', 0.05);
  playNoise(0.010, 0.04);
};

// 3. Success / Form Submit Chime
export const playSuccess = () => {
  playTone([523.25, 659.25, 783.99, 1046.5], [0.07, 0.07, 0.07, 0.15], 'sine', 0.10);
};

// 4. Arcade Window Open
export const playArcadeOpen = () => {
  playTone([440, 554.37, 659.25, 880, 1109.73, 1318.51], [0.04, 0.04, 0.04, 0.04, 0.04, 0.1], 'triangle', 0.1);
};

// 5. Robot Dialogue Mumble
let lastDroneSoundTime = 0;
export const playDroneChat = () => {
  const now = Date.now();
  if (now - lastDroneSoundTime < 80) return;
  lastDroneSoundTime = now;
  const randomFreqs = Array.from({ length: 3 }, () => Math.floor(Math.random() * 300) + 400);
  playTone(randomFreqs, [0.04, 0.04, 0.04], 'square', 0.04);
};

// 6. Sound toggle ON jingle
export const playSoundOn = () => {
  const prev = isMuted;
  isMuted = false;
  playTone([440, 554, 659], [0.06, 0.06, 0.1], 'sine', 0.12);
  isMuted = prev;
};

// 7. Sound toggle OFF subtle thud
export const playSoundOff = () => {
  const prev = isMuted;
  isMuted = false;
  playTone([300, 200], [0.05, 0.08], 'triangle', 0.08);
  isMuted = prev;
};
