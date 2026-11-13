"use client";

import { useEffect, useState } from "react";
import type { CharacterIdentity, EquipmentDetails, EquipmentItem } from "../types";

export function useEquipmentDetails(identity: CharacterIdentity, item: EquipmentItem, enabled: boolean) {
  const [data, setData] = useState<{ key: string; value: EquipmentDetails; expires: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const query = new URLSearchParams({
    region: identity.region, serverId: String(identity.serverId), characterId: identity.characterId,
    itemId: String(item.id), slot: String(item.slot),
  }).toString();

  useEffect(() => {
    if (!enabled || (data?.key === query && data.expires > Date.now())) return;
    const controller = new AbortController();
    const start = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/characters/equipment?${query}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Não foi possível carregar os atributos desta peça.");
        if (!controller.signal.aborted) setData({ key: query, value: payload as EquipmentDetails, expires: Date.now() + 300_000 });
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error && !(failure instanceof TypeError) && !(failure instanceof SyntaxError) ? failure.message : "Não foi possível conectar ao Companion. Tente novamente em instantes.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 0);
    return () => { window.clearTimeout(start); controller.abort(); };
  }, [enabled, query, attempt, data]);

  return {
    details: data?.key === query ? data.value : null, loading, error,
    retry: () => setAttempt((current) => current + 1),
  };
}
