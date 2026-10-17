"use client";

import Link from "next/link";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronDown, ChevronLeft, ChevronRight, ShieldCheck, X } from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/config/navigation";
import type { AppShellActions, AppShellViewModel } from "@/hooks/use-app-shell";

export const SIDEBAR_EXPANDED_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 76;

type Props = {
  viewModel: AppShellViewModel;
  actions: AppShellActions;
};

type SidebarContentProps = Props & {
  collapsed: boolean;
  mobile?: boolean;
};

function isActive(activePath: string, href: string, exact?: boolean) {
  return exact ? activePath === href : activePath === href || activePath.startsWith(`${href}/`);
}

function SidebarContent({ viewModel, actions, collapsed, mobile = false }: SidebarContentProps) {
  return (
    <Stack sx={{ height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent={collapsed ? "center" : "space-between"} sx={{ minHeight: 72, px: collapsed ? 1 : 2 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <Box sx={{ width: 40, height: 40, flexShrink: 0, display: "grid", placeItems: "center", border: "1px solid rgba(75,214,208,.35)", borderRadius: "12px", bgcolor: "rgba(75,214,208,.09)", color: "primary.main" }}>
            <ShieldCheck size={21} strokeWidth={1.8} />
          </Box>
          {!collapsed && <Box sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 900, letterSpacing: "-.02em", lineHeight: 1.05 }}>AION 2</Typography><Typography variant="caption" color="text.secondary" sx={{ letterSpacing: ".12em", textTransform: "uppercase" }}>Companion</Typography></Box>}
        </Stack>
        {mobile && <IconButton onClick={actions.closeMobileSidebar} aria-label="Fechar navegação" size="small"><X size={20} /></IconButton>}
      </Stack>
      <Divider />

      <Box component="nav" aria-label="Navegação principal" sx={{ flex: 1, overflowY: "auto", py: 1.5, px: collapsed ? 1 : 1.25 }}>
        {NAVIGATION_SECTIONS.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          const expanded = viewModel.expandedSections.has(section.id);
          const sectionActive = section.items.some((item) => isActive(viewModel.activePath, item.href, item.exact));

          if (collapsed) {
            return (
              <Box key={section.id}>
                {sectionIndex > 0 && <Divider sx={{ my: 1 }} />}
                <List disablePadding>
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = isActive(viewModel.activePath, item.href, item.exact);
                    return (
                      <Tooltip key={item.href} title={item.label} placement="right" arrow>
                        <ListItemButton component={Link} href={item.href} onClick={actions.handleNavigation} selected={active} aria-label={item.label} sx={{ minHeight: 48, justifyContent: "center", px: 1, mb: .5, borderRadius: 2.5, color: active ? "primary.main" : "text.secondary", "&.Mui-selected": { bgcolor: "rgba(75,214,208,.12)" } }}>
                          <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}><ItemIcon size={19} /></ListItemIcon>
                        </ListItemButton>
                      </Tooltip>
                    );
                  })}
                </List>
              </Box>
            );
          }

          return (
            <Box key={section.id} sx={{ mb: 1.25 }}>
              <ListItemButton onClick={() => actions.toggleSection(section.id)} aria-expanded={expanded} aria-controls={`navigation-${section.id}`} sx={{ minHeight: 44, borderRadius: 2.5, color: sectionActive ? "text.primary" : "text.secondary" }}>
                <ListItemIcon sx={{ minWidth: 38, color: sectionActive ? "primary.main" : "inherit" }}><SectionIcon size={19} /></ListItemIcon>
                <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight: 850, fontSize: 14 }} />
                <ChevronDown size={17} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
              </ListItemButton>
              <Collapse in={expanded} timeout="auto" unmountOnExit id={`navigation-${section.id}`}>
                <List disablePadding sx={{ mt: .5 }}>
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = isActive(viewModel.activePath, item.href, item.exact);
                    return (
                      <ListItemButton key={item.href} component={Link} href={item.href} onClick={actions.handleNavigation} selected={active} sx={{ minHeight: 42, pl: 2, pr: 1.5, mb: .35, borderRadius: 2.25, color: active ? "primary.light" : "text.secondary", "&.Mui-selected": { bgcolor: "rgba(75,214,208,.11)", "&:hover": { bgcolor: "rgba(75,214,208,.14)" } } }}>
                        <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}><ItemIcon size={17} /></ListItemIcon>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 800 : 600, noWrap: true }} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {!mobile && <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
        <Tooltip title={collapsed ? "Expandir menu" : "Recolher menu"} placement="right" arrow>
          <ListItemButton onClick={actions.toggleDesktopSidebar} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} sx={{ minHeight: 44, justifyContent: collapsed ? "center" : "flex-start", borderRadius: 2.5, color: "text.secondary" }}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: "inherit" }}>{collapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}</ListItemIcon>
            {!collapsed && <ListItemText primary="Recolher menu" primaryTypographyProps={{ fontSize: 13.5, fontWeight: 700 }} />}
          </ListItemButton>
        </Tooltip>
      </Box>}
    </Stack>
  );
}

export function AppSidebar({ viewModel, actions }: Props) {
  const desktopWidth = viewModel.desktopCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <>
      <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, width: desktopWidth, flexShrink: 0, transition: "width .22s ease", "& .MuiDrawer-paper": { width: desktopWidth, overflowX: "hidden", bgcolor: "rgba(8,20,30,.96)", borderRightColor: "divider", transition: "width .22s ease" } }}>
        <SidebarContent viewModel={viewModel} actions={actions} collapsed={viewModel.desktopCollapsed} />
      </Drawer>
      <Drawer variant="temporary" open={viewModel.mobileOpen} onClose={actions.closeMobileSidebar} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: 288, maxWidth: "88vw", bgcolor: "#08141e", borderRightColor: "divider" } }}>
        <SidebarContent viewModel={viewModel} actions={actions} collapsed={false} mobile />
      </Drawer>
    </>
  );
}

