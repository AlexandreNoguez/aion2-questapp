import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { Clock3 } from "lucide-react";
import type { ScheduleViewModel } from "../types";

type Props = { schedule: ScheduleViewModel };

export function ScheduleCard({ schedule }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2.25, height: "100%", borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: "rgba(75,214,208,.1)", color: "primary.main" }}><Clock3 size={17} /></Box>
        <Typography fontWeight={850}>{schedule.title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.55 }}>{schedule.scheduleLabel}</Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
        {schedule.nextLabel && <Chip size="small" label={`${schedule.nextLabel} · ${schedule.countdownLabel}`} sx={{ bgcolor: "rgba(75,214,208,.12)", color: "primary.light", fontWeight: 750 }} />}
        {schedule.durationLabel && <Chip size="small" variant="outlined" label={`Duração: ${schedule.durationLabel}`} sx={{ borderColor: "divider", color: "text.secondary" }} />}
        {!schedule.nextLabel && <Chip size="small" variant="outlined" label="Depende da última morte" sx={{ borderColor: "rgba(245,196,94,.3)", color: "secondary.main" }} />}
      </Stack>
      {schedule.note && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, lineHeight: 1.55 }}>{schedule.note}</Typography>}
    </Paper>
  );
}

