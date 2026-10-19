// Fullscreen changes can emit several resize events, including unchanged sizes.
// Rebuild once at the final geometry instead of treating resize as a user skip.
export function observeCrewViewport({ readSize, rebuild, schedule = setTimeout, cancel = clearTimeout }) {
  let size = readSize();
  let timer;
  let disposed = false;
  return {
    changed() {
      if (disposed) return;
      const next = readSize();
      if (next.width === size.width && next.height === size.height) return;
      size = next;
      cancel(timer);
      timer = schedule(() => { timer = undefined; if (!disposed) rebuild(); }, 160);
    },
    dispose() { disposed = true; cancel(timer); },
  };
}
