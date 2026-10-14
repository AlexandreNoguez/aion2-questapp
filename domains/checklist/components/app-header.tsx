import { Box, Container, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";

export function AppHeader() {
  return (
    <Box component="header" sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "rgba(7,18,28,.72)", backdropFilter: "blur(16px)" }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ minHeight: 72 }}>
          <Stack direction="row" spacing={1.4} alignItems="center">
            <Box sx={{ width: 40, height: 40, display: "grid", placeItems: "center", border: "1px solid rgba(75,214,208,.35)", borderRadius: "12px", bgcolor: "rgba(75,214,208,.09)", color: "primary.main" }}><ShieldCheck size={21} strokeWidth={1.8} /></Box>
            <Box><Typography sx={{ fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1 }}>AION 2</Typography><Typography variant="caption" color="text.secondary" sx={{ letterSpacing: ".14em", textTransform: "uppercase" }}>Central de missões</Typography></Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "primary.main", boxShadow: "0 0 14px #4bd6d0" }} />
            <Typography variant="caption" sx={{ display: { xs: "none", sm: "block" } }}>Salvo neste navegador</Typography>
            <Typography variant="caption" sx={{ display: { xs: "block", sm: "none" } }}>Local</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
