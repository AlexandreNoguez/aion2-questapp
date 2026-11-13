"use client";

import { useEffect, useState } from "react";
import { parseEquipmentView } from "../services/equipment-view";
import type { EquipmentView } from "../types";

const STORAGE_KEY = "aion2-equipment-view:v1";

export function useEquipmentView() {
  const [view, setView] = useState<EquipmentView>("grid");
  useEffect(() => {
    const hydration = window.setTimeout(() => {
      try { setView(parseEquipmentView(window.localStorage.getItem(STORAGE_KEY))); } catch { /* Optional storage. */ }
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  function changeView(value: unknown) {
    if (value !== "grid" && value !== "comparison" && value !== "flip") return;
    setView(value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* Keep the selection for this visit. */ }
  }

  return { view, changeView };
}
