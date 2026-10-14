import { Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { Clock3, Sparkles } from "lucide-react";
import type { ChecklistPeriod, PeriodSummary, PlayerClassId } from "../types";
import { ClassSelector } from "./class-selector";

type Props = { period: ChecklistPeriod; summary: PeriodSummary; playerClass: PlayerClassId; onClassChange: (playerClass: PlayerClassId) => void };

export function ProgressHero({ period, summary, playerClass, onClassChange }: Props) {
  return (
    <Paper sx={{ position: "relative", overflow: "hidden", border: "1px solid rgba(149,183,203,.14)", borderRadius: { xs: 3, md: 4 }, bgcolor: "rgba(13,27,39,.88)", p: { xs: 2.5, md: 4 } }}>
      <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(75,214,208,.10), transparent 43%), radial-gradient(circle at 92% 15%, rgba(245,196,94,.11), transparent 28%)" }} />
      <Stack position="relative" direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={4}>
        <Box sx={{ maxWidth: 620 }}>
          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
            <Box sx={{ display: "flex", alignItems: "center", minHeight: 32, px: 1.25, borderRadius: 5, bgcolor: "rgba(75,214,208,.09)", border: "1px solid rgba(75,214,208,.2)" }}><ClassSelector value={playerClass} onChange={onClassChange} /></Box>
            <Chip icon={<Clock3 size={14} />} label="Reset qua. · 04:00 BRT" size="small" variant="outlined" sx={{ borderColor: "divider", color: "text.secondary" }} />
          </Stack>
          <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: ".14em", fontWeight: 800 }}>{period === "daily" ? "Ritual de hoje" : "Jornada da semana"}</Typography>
          <Typography component="h1" sx={{ mt: .5, fontSize: { xs: "2rem", sm: "3rem", md: "3.55rem" }, fontWeight: 800, lineHeight: .98, letterSpacing: "-.05em", maxWidth: 600 }}>
            Cada missão conta.<br /><Box component="span" sx={{ color: "primary.main" }}>Nenhum limite perdido.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 540, lineHeight: 1.65 }}>Semana de 14 a 20 de outubro de 2026. Confirme sempre os contadores no cliente do jogo.</Typography>
        </Box>
        <Box sx={{ minWidth: { md: 240 }, alignSelf: { md: "flex-end" } }}>
          <Stack direction="row" alignItems="flex-end" spacing={1} mb={1.5}><Typography sx={{ fontSize: "3.6rem", lineHeight: .85, fontWeight: 800, letterSpacing: "-.06em" }}>{summary.percentage}</Typography><Typography sx={{ mb: .4, color: "primary.main", fontWeight: 800 }}>%</Typography></Stack>
          <LinearProgress variant="determinate" value={summary.percentage} sx={{ height: 7, borderRadius: 20, bgcolor: "rgba(255,255,255,.07)", "& .MuiLinearProgress-bar": { borderRadius: 20, background: "linear-gradient(90deg,#3ec3c2,#79e4d6)" } }} />
          <Stack direction="row" justifyContent="space-between" mt={1.25}><Typography variant="caption" color="text.secondary">{summary.completed} concluídas</Typography><Typography variant="caption" color="text.secondary">{summary.pending} pendentes</Typography></Stack>
          {summary.percentage === 100 && <Stack direction="row" alignItems="center" spacing={.7} mt={1.5} color="secondary.main"><Sparkles size={15} /><Typography variant="caption" fontWeight={800}>Ciclo completo</Typography></Stack>}
        </Box>
      </Stack>
    </Paper>
  );
}
