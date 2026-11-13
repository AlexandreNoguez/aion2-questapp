"use client";

import { useEffect, useState } from "react";
import { parseGearMode } from "../services/gear-reference";
import type { GearMode } from "../types";

const STORAGE_KEY = "aion2-gear-mode:v1";

export function useGearMode() {
  const [mode, setMode] = useState<GearMode>("pve");
  useEffect(() => {
    const hydration = window.setTimeout(() => {
      try { setMode(parseGearMode(window.localStorage.getItem(STORAGE_KEY))); } catch { /* Storage is optional. */ }
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  function changeMode(value: unknown) {
    if (value !== "pve" && value !== "pvp") return;
    setMode(value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* Keep the selection for this visit. */ }
  }

  return { mode, changeMode };
}
