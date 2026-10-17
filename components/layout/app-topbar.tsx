import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Menu } from "lucide-react";

type Props = {
  onOpenNavigation: () => void;
};

export function AppTopbar({ onOpenNavigation }: Props) {
  return (
    <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 10, minHeight: 72, borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(7,18,28,.82)", backdropFilter: "blur(16px)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ minHeight: 72, px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <IconButton onClick={onOpenNavigation} aria-label="Abrir navegação" sx={{ display: { md: "none" }, color: "text.primary" }}>
            <Menu size={21} />
          </IconButton>
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1 }}>Central de missões</Typography>
            <Typography variant="caption" color="text.secondary">Checklist e guias do AION 2</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "primary.main", boxShadow: "0 0 14px #4bd6d0" }} />
          <Typography variant="caption" sx={{ display: { xs: "none", sm: "block" } }}>Salvo neste navegador</Typography>
          <Typography variant="caption" sx={{ display: { xs: "block", sm: "none" } }}>Local</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

