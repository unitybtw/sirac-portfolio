export const SEATED_END = 120 / 16;
const IDLE_FRAMES = 24;
const IDLE_PERIOD = IDLE_FRAMES * 2 / 16;

// Return to the same phone pose before standing; never hold a final video frame.
export function seatedFrameAt(time) {
  if (time <= SEATED_END) return Math.min(120, Math.floor(time * 16));
  const phase = Math.floor((time - SEATED_END) * 16) % (IDLE_FRAMES * 2);
  return 120 - (phase <= IDLE_FRAMES ? phase : IDLE_FRAMES * 2 - phase);
}

export function departureTimeFor(time) {
  return SEATED_END + Math.max(0, Math.ceil((time - SEATED_END) / IDLE_PERIOD)) * IDLE_PERIOD;
}
