"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { NavigationSection } from "@/config/navigation";

const STORAGE_KEY = "aion2-shell:v1";

type StoredShell = {
  desktopCollapsed?: boolean;
  expandedSections?: NavigationSection["id"][];
};

export type AppShellViewModel = {
  activePath: string;
  desktopCollapsed: boolean;
  mobileOpen: boolean;
  expandedSections: ReadonlySet<NavigationSection["id"]>;
};

export type AppShellActions = {
  toggleDesktopSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleSection: (id: NavigationSection["id"]) => void;
  handleNavigation: () => void;
};

export function useAppShell(): { viewModel: AppShellViewModel; actions: AppShellActions } {
  const pathname = usePathname();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<NavigationSection["id"]>>(
    new Set(["checklist", "content"]),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw) as StoredShell;
          if (typeof stored.desktopCollapsed === "boolean") setDesktopCollapsed(stored.desktopCollapsed);
          if (Array.isArray(stored.expandedSections)) {
            const valid = stored.expandedSections.filter((id): id is NavigationSection["id"] => id === "checklist" || id === "content");
            setExpandedSections(new Set(valid));
          }
        }
      } catch {
        // The navigation remains usable when storage is unavailable.
      }
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload: StoredShell = { desktopCollapsed, expandedSections: [...expandedSections] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // The navigation remains usable when storage is unavailable.
    }
  }, [desktopCollapsed, expandedSections, isHydrated]);

  const toggleSection = useCallback((id: NavigationSection["id"]) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const actions = useMemo<AppShellActions>(() => ({
    toggleDesktopSidebar: () => setDesktopCollapsed((current) => !current),
    openMobileSidebar: () => setMobileOpen(true),
    closeMobileSidebar: () => setMobileOpen(false),
    toggleSection,
    handleNavigation: () => setMobileOpen(false),
  }), [toggleSection]);

  return {
    viewModel: { activePath: pathname, desktopCollapsed, mobileOpen, expandedSections },
    actions,
  };
}

