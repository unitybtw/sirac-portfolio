// Sandboxed game runtimes use session-only storage, never the portfolio's storage.
// These adapters implement the standard APIs without granting origin access.
(() => {
  const memoryStorage = () => {
    const entries = new Map();
    return {
      get length() { return entries.size; },
      key(index) { return [...entries.keys()][index] ?? null; },
      getItem(key) { return entries.get(String(key)) ?? null; },
      setItem(key, value) { entries.set(String(key), String(value)); },
      removeItem(key) { entries.delete(String(key)); },
      clear() { entries.clear(); },
    };
  };
  for (const name of ['localStorage', 'sessionStorage']) {
    try { void window[name]; }
    catch { Object.defineProperty(window, name, { value: memoryStorage() }); }
  }
  try { void window.caches; }
  catch {
    const stores = new Map();
    const keyOf = (request) => new URL(typeof request === 'string' ? request : request.url, document.baseURI).href;
    Object.defineProperty(window, 'caches', { value: {
      async open(name) {
        if (!stores.has(name)) {
          const entries = new Map();
          stores.set(name, {
            async match(request) { return entries.get(keyOf(request))?.clone(); },
            async put(request, response) { entries.set(keyOf(request), response.clone()); },
            async delete(request) { return entries.delete(keyOf(request)); },
            async keys() { return [...entries.keys()].map(url => new Request(url)); },
          });
        }
        return stores.get(name);
      },
      async match(request) {
        for (const cache of stores.values()) {
          const response = await cache.match(request);
          if (response) return response;
        }
      },
      async delete(name) { return stores.delete(name); },
      async keys() { return [...stores.keys()]; },
    } });
  }
})();
