// Lenis needs frames only while easing. Keep explicit modal pause separate from
// page visibility so returning to a tab cannot restart a paused background.
export function createScrollFrameLoop({ tick, isAnimating, request, cancel, isVisible }) {
  let frame = null;
  let paused = false;
  let disposed = false;
  let inFrame = false;
  let lastTimestamp = null;
  let clock = 1;
  const run = time => {
    frame = null;
    if (disposed || paused || !isVisible()) return;
    // Exclude idle/hidden time from Lenis's clock. Otherwise the first wheel
    // event after a pause advances the new easing by the entire idle interval.
    clock += lastTimestamp === null ? 1000 / 60 : Math.min(64, Math.max(0, time - lastTimestamp));
    lastTimestamp = time;
    inFrame = true;
    try { tick(clock); } finally { inFrame = false; }
    if (isAnimating()) schedule();
  };
  function schedule() {
    if (!disposed && !paused && isVisible() && frame === null) frame = request(run);
  }
  function wake() {
    if (frame === null && !inFrame) lastTimestamp = null;
    schedule();
  }
  function cancelPending() {
    if (frame !== null) cancel(frame);
    frame = null;
    lastTimestamp = null;
  }
  return {
    wake,
    pause() { paused = true; cancelPending(); },
    resume() { paused = false; wake(); },
    visibilityChanged() { if (isVisible()) wake(); else cancelPending(); },
    dispose() { disposed = true; cancelPending(); },
  };
}
