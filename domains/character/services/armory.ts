import { z } from "zod";
import { canonicalCharacterId, identitySchema, officialEquipmentSchema, officialInfoSchema, officialSearchSchema, officialServersSchema, regionSchema, searchQuerySchema } from "../contracts";
import { normalizeProfile, normalizeSearch, normalizeServers } from "../normalizers";
import { createQueryCache } from "./query-cache";

const cache = createQueryCache();
const hostSlots = new Map<string, number>();
let blockedUntil = 0;

export class ArmoryError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

async function officialGet<T>(url: URL, schema: z.ZodType<T>): Promise<T> {
  if (blockedUntil > Date.now()) throw new ArmoryError(429, "O armory está limitando as consultas. Aguarde antes de tentar novamente.", Math.ceil((blockedUntil - Date.now()) / 1000));
  // Space calls to each host and bound the wait. No retries on upstream blocks.
  const scheduledAt = Math.max(Date.now(), hostSlots.get(url.host) ?? 0);
  if (scheduledAt - Date.now() > 10_000) throw new ArmoryError(503, "Há muitas consultas em andamento. Tente novamente em alguns segundos.");
  hostSlots.set(url.host, scheduledAt + 1000);
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, scheduledAt - Date.now())));
  if (blockedUntil > Date.now()) throw new ArmoryError(429, "O armory está limitando as consultas. Aguarde antes de tentar novamente.", Math.ceil((blockedUntil - Date.now()) / 1000));

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store", signal: AbortSignal.timeout(20_000), redirect: "error",
      headers: { Accept: "application/json", "User-Agent": "aion2-companion/0.1 (public armory lookup)" },
    });
  } catch {
    throw new ArmoryError(503, "Não foi possível conectar ao armory da NCSOFT. Tente novamente em instantes.");
  }
  if (response.status === 429) {
    const retryHeader = response.headers.get("Retry-After");
    const delay = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) * 1000 : retryHeader ? Date.parse(retryHeader) - Date.now() : 60_000;
    const seconds = Math.max(1, Math.ceil((Number.isFinite(delay) ? delay : 60_000) / 1000));
    blockedUntil = Date.now() + seconds * 1000;
    throw new ArmoryError(429, "O armory está limitando as consultas. Aguarde antes de tentar novamente.", seconds);
  }
  if (response.status === 404) throw new ArmoryError(404, "Personagem ou recurso não encontrado no armory.");
  if (!response.ok) throw new ArmoryError(503, "O armory da NCSOFT está indisponível. Tente novamente mais tarde.");
  let payload: unknown;
  try { payload = await response.json(); } catch { throw new ArmoryError(502, "O armory retornou uma resposta incompatível."); }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new ArmoryError(502, "Os dados do armory mudaram ou estão incompletos. Tente novamente mais tarde.");
  return parsed.data;
}

export async function getServers(input: unknown) {
  const region = regionSchema.parse(input);
  return cache.get(`servers:${region}`, 3_600_000, async () => {
    const url = new URL("https://aion2.plaync.com/en-us/api/gameinfo/servers");
    url.search = new URLSearchParams({ region, lang: "en-US" }).toString();
    return normalizeServers(await officialGet(url, officialServersSchema));
  });
}

export async function searchCharacters(input: unknown) {
  const query = searchQuerySchema.parse(input);
  return cache.get(`search:${JSON.stringify(query)}`, 60_000, async () => {
    const url = new URL("https://api-search.plaync.com/aion2global/search/v2/character");
    url.search = new URLSearchParams({ region: query.region, keyword: query.name, localeInfo: "en-US", page: String(query.page), ...(query.serverId ? { serverId: String(query.serverId) } : {}) }).toString();
    const result = normalizeSearch(await officialGet(url, officialSearchSchema), query.region);
    // Enforce the selected server even if the upstream search ignores its filter.
    if (query.serverId) result.characters = result.characters.filter((character) => character.serverId === query.serverId);
    return result;
  });
}

export async function getCharacterProfile(input: unknown) {
  const identity = identitySchema.parse(input);
  return cache.get(`profile:${JSON.stringify(identity)}`, 300_000, async () => {
    const params = new URLSearchParams({ region: identity.region, lang: "en-US", characterId: identity.characterId, serverId: String(identity.serverId) });
    const infoUrl = new URL(`https://aion2.plaync.com/api/character/info?${params}`);
    const gearUrl = new URL(`https://aion2.plaync.com/api/character/equipment?${params}`);
    const info = await officialGet(infoUrl, officialInfoSchema);
    if (canonicalCharacterId(info.profile.characterId) !== identity.characterId || info.profile.serverId !== identity.serverId) {
      throw new ArmoryError(502, "O armory retornou um personagem diferente do solicitado.");
    }
    const equipment = await officialGet(gearUrl, officialEquipmentSchema);
    return normalizeProfile(info, equipment, identity);
  });
}
