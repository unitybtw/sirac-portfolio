// Optional character atlases retry transient errors without retrying every frame.
export function createAtlasLoader({ files, baseURL, onLoad, createImage = () => new Image(), schedule = setTimeout, cancel = clearTimeout }) {
  const records = new Map();
  let disposed = false;
  const load = name => {
    if (disposed || records.has(name) || !files[name]) return;
    const record = { attempts: 0, timer: null, image: null, state: 'loading' };
    records.set(name, record);
    const attempt = () => {
      if (disposed) return;
      record.timer = null;
      record.attempts += 1;
      const image = createImage();
      record.image = image;
      const failed = () => {
        if (disposed || record.image !== image) return;
        image.onload = image.onerror = null;
        record.image = null;
        if (record.attempts < 3) record.timer = schedule(attempt, record.attempts * 750);
        else record.state = 'failed';
      };
      image.onerror = failed;
      image.onload = async () => {
        try {
          if (image.decode) await image.decode();
          if (disposed || record.image !== image) return;
          image.onload = image.onerror = null;
          record.state = 'ready';
          onLoad(name, image);
        } catch { failed(); }
      };
      image.src = `${baseURL}assets/mini-sirac/${files[name]}`;
    };
    attempt();
  };
  return {
    load,
    retryFailed() {
      for (const [name, record] of records) if (record.state === 'failed') {
        records.delete(name);
        load(name);
      }
    },
    dispose() {
      disposed = true;
      for (const record of records.values()) {
        if (record.timer !== null) cancel(record.timer);
        if (record.image) record.image.onload = record.image.onerror = null;
      }
      records.clear();
    },
  };
}
