type Entry = { value: unknown; expires: number };

/** Bounded, per-process cache. Failed requests are never retained. */
export function createQueryCache(capacity = 200, now = () => Date.now()) {
  const entries = new Map<string, Entry>();
  const pending = new Map<string, Promise<unknown>>();

  async function get<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
    const cached = entries.get(key);
    if (cached && cached.expires > now()) return cached.value as T;
    entries.delete(key);
    const running = pending.get(key);
    if (running) return running as Promise<T>;
    if (pending.size >= 20) throw new Error("ARMORY_BUSY");

    const request = Promise.resolve().then(load).then((value) => {
      if (entries.size >= capacity) entries.delete(entries.keys().next().value!);
      entries.set(key, { value, expires: now() + ttl });
      return value;
    }).finally(() => pending.delete(key));
    pending.set(key, request);
    return request;
  }

  return { get };
}
