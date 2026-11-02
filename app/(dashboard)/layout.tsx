import type { PropsWithChildren } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppTheme } from "@/components/layout/app-theme";
import { EventNotificationsProvider } from "@/domains/game-content/components/event-notifications";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AppTheme><EventNotificationsProvider><AppShell>{children}</AppShell></EventNotificationsProvider></AppTheme>;
}

