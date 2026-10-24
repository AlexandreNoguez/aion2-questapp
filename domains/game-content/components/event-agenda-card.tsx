import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";
import type { AgendaEventViewModel } from "../types";

type Props = { event: AgendaEventViewModel };

export function EventAgendaCard({ event }: Props) {
  return (
    <Paper component={Link} href={event.href} variant="outlined" sx={{
      position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      minHeight: { xs: 220, lg: 250 }, p: { xs: 2.5, lg: 3 }, overflow: "hidden",
      textDecoration: "none", color: "text.primary", borderColor: "divider", bgcolor: "#0d1b27",
      backgroundImage: event.imagePath
        ? `linear-gradient(180deg, rgba(8,20,30,.2), rgba(8,20,30,.94)), url(${JSON.stringify(event.imagePath)})`
        : "radial-gradient(ellipse at 85% 0%, rgba(75,214,208,.18), transparent 65%), linear-gradient(145deg, #192c40, #08141e)",
      backgroundSize: "cover", backgroundPosition: "center",
      transition: "transform .2s ease, border-color .2s ease",
      "&:hover": { transform: "translateY(-2px)", borderColor: "primary.main" },
      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 4 },
    }}>
      <Typography component="h2" sx={{ fontSize: { xs: 18, lg: 20 }, fontWeight: 850, lineHeight: 1.3 }}>{event.title}</Typography>
      <Typography component="p" aria-label={event.hasSchedule ? `Tempo até a próxima ocorrência: ${event.countdownLabel}` : "Horário variável"} sx={{
        mt: 1.5, fontSize: event.hasSchedule ? { xs: 36, lg: 40 } : 24, fontWeight: 900,
        fontVariantNumeric: "tabular-nums", letterSpacing: "-.03em", lineHeight: 1.2, color: "primary.light",
      }}>{event.hasSchedule ? event.countdownLabel : "Horário variável"}</Typography>
      <Box sx={{ mt: 1 }}><Typography variant="caption" sx={{ color: "#c3d3df" }}>{event.nextLabel}</Typography></Box>
    </Paper>
  );
}
