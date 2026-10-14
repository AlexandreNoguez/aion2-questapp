import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { CalendarDays, Info, Server } from "lucide-react";
import { ROUTINE } from "../data/quests";

export function SideNotes() {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2.5, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2.2}><CalendarDays size={18} color="#4bd6d0" /><Typography fontWeight={800}>Ritmo da semana</Typography></Stack>
        <Stack spacing={2}>{ROUTINE.map((item, index) => <Box key={item.day}><Typography variant="caption" sx={{ color: index === 2 ? "secondary.main" : "primary.main", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".09em" }}>{item.day}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .4, lineHeight: 1.55 }}>{item.text}</Typography></Box>)}</Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2.5, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
        <Stack direction="row" spacing={1} alignItems="center"><Server size={18} color="#f5c45e" /><Typography fontWeight={800}>Limites compartilhados</Typography></Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.4, lineHeight: 1.6 }}>Não repita em cada alt: 5 Duty, 14 Masmorras Diárias, chaves Shugo, chaves da Invasão e compras marcadas como <strong>Servidor</strong>.</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1} alignItems="flex-start"><Info size={16} color="#96aebe" style={{ marginTop: 2, flexShrink: 0 }} /><Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>Nem todo limite precisa ser esgotado. Priorize custo/benefício e os contadores exibidos no jogo.</Typography></Stack>
      </Paper>
    </Stack>
  );
}
