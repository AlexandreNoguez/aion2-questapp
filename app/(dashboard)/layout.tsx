import type { PropsWithChildren } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppTheme } from "@/components/layout/app-theme";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AppTheme><AppShell>{children}</AppShell></AppTheme>;
}

