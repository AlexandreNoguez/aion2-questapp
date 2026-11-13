import { z } from "zod";
import { ArmoryError } from "./armory";

export function queryParams(request: Request): Record<string, string> {
  return Object.fromEntries(new URL(request.url).searchParams);
}

export async function armoryResponse(load: () => Promise<unknown>) {
  try {
    return Response.json(await load(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const invalid = error instanceof z.ZodError;
    const busy = error instanceof Error && error.message === "ARMORY_BUSY";
    const status = error instanceof ArmoryError ? error.status : invalid ? 400 : busy ? 503 : 500;
    const message = error instanceof ArmoryError ? error.message : invalid ? "Confira a região, o servidor e os dados do personagem." : "Não foi possível concluir a consulta. Tente novamente em instantes.";
    return Response.json({ error: message }, {
      status, headers: { "Cache-Control": "no-store", ...(error instanceof ArmoryError && error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {}) },
    });
  }
}
