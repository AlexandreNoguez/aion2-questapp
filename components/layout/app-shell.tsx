"use client";

import { Box, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useAppShell } from "@/hooks/use-app-shell";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({ children }: PropsWithChildren) {
  const { viewModel, actions } = useAppShell();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppSidebar viewModel={viewModel} actions={actions} />
      <Box sx={{ display: "flex", flex: 1, minWidth: 0, minHeight: "100vh", flexDirection: "column" }}>
        <AppTopbar onOpenNavigation={actions.openMobileSidebar} />
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", px: { xs: 2, sm: 3, md: 4 }, py: 2.5 }}>
          <Typography variant="caption" color="text.secondary">AION 2 Companion · Dados pessoais salvos apenas neste navegador.</Typography>
        </Box>
      </Box>
    </Box>
  );
}

