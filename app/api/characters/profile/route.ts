import { armoryResponse, queryParams } from "@/domains/character/services/api-response";
import { getCharacterProfile } from "@/domains/character/services/armory";

export const runtime = "nodejs";
export function GET(request: Request) {
  return armoryResponse(() => getCharacterProfile(queryParams(request)));
}
