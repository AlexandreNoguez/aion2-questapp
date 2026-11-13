import type { EquipmentDetails } from "../types";

type Job = { query: string; signal: AbortSignal; resolve: (value: EquipmentDetails) => void; reject: (error: unknown) => void };
const queue: Job[] = [];
const cache = new Map<string, { value: EquipmentDetails; expires: number }>();
let running = false;

async function drain() {
  if (running) return;
  running = true;
  try {
    while (queue.length) {
      const job = queue.shift()!;
      if (job.signal.aborted) { job.reject(new DOMException("Aborted", "AbortError")); continue; }
      const cached = cache.get(job.query);
      if (cached && cached.expires > Date.now()) { job.resolve(cached.value); continue; }
      try {
        const response = await fetch(`/api/characters/equipment?${job.query}`, { signal: job.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Não foi possível consultar esta peça.");
        const value = payload as EquipmentDetails;
        if (cache.size >= 100) cache.delete(cache.keys().next().value!);
        cache.set(job.query, { value, expires: Date.now() + 300_000 });
        job.resolve(value);
      } catch (error) { job.reject(error); }
    }
  } finally { running = false; }
}

/** One request at a time keeps background rank lookups within armory limits. */
export function requestEquipmentDetails(query: string, signal: AbortSignal): Promise<EquipmentDetails> {
  if (signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
  const cached = cache.get(query);
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.value);
  return new Promise((resolve, reject) => { queue.push({ query, signal, resolve, reject }); void drain(); });
}
