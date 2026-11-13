import { z } from "zod";

export const regionSchema = z.enum(["la", "nae", "naw", "eu", "as"]);
const serverIdSchema = z.coerce.number().int().min(1000).max(9999);

export function canonicalCharacterId(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const identitySchema = z.object({
  region: regionSchema,
  serverId: serverIdSchema,
  characterId: z.string().transform(canonicalCharacterId).pipe(z.string().min(1).max(256).regex(/^[\w=+-]+$/)),
});

export const searchQuerySchema = z.object({
  region: regionSchema,
  name: z.string().trim().min(2, "Informe pelo menos dois caracteres.").max(32).regex(/^[^\p{C}<>]+$/u),
  serverId: serverIdSchema.optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

export const favoriteSchema = identitySchema.extend({
  name: z.string().min(1).max(64),
  serverName: z.string().min(1).max(64),
});

const imageSchema = z.string().nullish();
export const officialServersSchema = z.object({
  serverList: z.array(z.object({ serverId: serverIdSchema, serverName: z.string().min(1), raceId: z.number() })),
});

export const officialSearchSchema = z.object({
  list: z.array(z.object({
    characterId: identitySchema.shape.characterId, name: z.string().min(1), serverId: serverIdSchema,
    serverName: z.string().min(1), level: z.number(), race: z.number(), profileImageUrl: imageSchema,
  })).nullable(),
  pagination: z.object({ page: z.number().int().min(1), total: z.number().int().nonnegative(), endPage: z.number().int().nonnegative() }),
});

export const officialInfoSchema = z.object({
  profile: z.object({
    characterId: z.string().min(1), characterName: z.string().min(1), characterLevel: z.number(),
    serverId: serverIdSchema, serverName: z.string().min(1), className: z.string(), raceId: z.number(),
    profileImage: imageSchema, titleName: z.string().nullish(), combatPower: z.number().nullish(),
  }),
  stat: z.object({ statList: z.array(z.object({
    name: z.string(), type: z.string(), value: z.number(), statSecondList: z.array(z.string()).nullish(),
  })).nullable() }),
});

export const officialEquipmentSchema = z.object({
  equipment: z.object({ equipmentList: z.array(z.object({
    id: z.number().int(), name: z.string().min(1), slotPos: z.number().int(), slotPosName: z.string(),
    grade: z.string(), icon: imageSchema, enchantLevel: z.number(), exceedLevel: z.number().nullish(),
  })).nullable() }),
});
