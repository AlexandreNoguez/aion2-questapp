import Link from "next/link";
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { ArrowLeft, ExternalLink, Info, Lightbulb, MapPin, ShieldAlert, Sparkles } from "lucide-react";
import type { GameContentViewModel } from "../types";
import { ScheduleCard } from "./schedule-card";

type Props = { content: GameContentViewModel };

export function ContentDetails({ content }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button component={Link} href="/conteudos" color="inherit" size="small" startIcon={<ArrowLeft size={16} />} sx={{ mb: 2.5, color: "text.secondary" }}>Todos os conteúdos</Button>

      <Paper sx={{ position: "relative", overflow: "hidden", p: { xs: 2.5, md: 4 }, border: "1px solid rgba(149,183,203,.14)", bgcolor: "rgba(13,27,39,.88)" }}>
        <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(75,214,208,.1), transparent 46%), radial-gradient(circle at 92% 16%, rgba(245,196,94,.12), transparent 30%)" }} />
        <Stack position="relative" spacing={2}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip size="small" label={content.category} sx={{ bgcolor: "rgba(75,214,208,.12)", color: "primary.light", fontWeight: 800 }} />
            <Chip size="small" variant="outlined" label={content.region} sx={{ borderColor: "divider", color: "text.secondary" }} />
            {content.minimumLevel && <Chip size="small" variant="outlined" label={`Nível ${content.minimumLevel}+`} sx={{ borderColor: "divider", color: "secondary.main" }} />}
          </Stack>
          <Box>
            <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 850, letterSpacing: ".13em" }}>{content.eyebrow}</Typography>
            <Typography component="h1" sx={{ mt: .4, maxWidth: 760, fontSize: { xs: "2.1rem", md: "3.6rem" }, lineHeight: 1, fontWeight: 900, letterSpacing: "-.045em" }}>{content.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 720, fontSize: { md: "1.08rem" }, lineHeight: 1.7 }}>{content.summary}</Typography>
          </Box>
          {content.location && <Stack direction="row" spacing={1} alignItems="flex-start" color="text.secondary"><MapPin size={17} style={{ marginTop: 3, flexShrink: 0 }} /><Typography variant="body2">{content.location}</Typography></Stack>}
        </Stack>
      </Paper>

      <Box component="section" aria-labelledby="schedule-title" sx={{ mt: { xs: 4, md: 5 } }}>
        <Typography id="schedule-title" variant="overline" sx={{ color: "primary.main", fontWeight: 850, letterSpacing: ".12em" }}>Agenda</Typography>
        <Typography variant="h5" fontWeight={900} sx={{ mt: .25, mb: 2.5 }}>Quando acontece</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: content.schedules.length > 1 ? "repeat(2,minmax(0,1fr))" : "1fr" }, gap: 2 }}>
          {content.schedules.map((schedule) => <ScheduleCard key={schedule.id} schedule={schedule} />)}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1.35fr) minmax(280px,.65fr)" }, gap: 3, mt: { xs: 4, md: 5 } }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}><Info size={18} color="#4bd6d0" /><Typography fontWeight={900}>Como funciona</Typography></Stack>
            <Stack spacing={1.4}>{content.description.map((paragraph) => <Typography key={paragraph} color="text.secondary" sx={{ lineHeight: 1.7 }}>{paragraph}</Typography>)}</Stack>
          </Paper>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}><Sparkles size={18} color="#f5c45e" /><Typography fontWeight={900}>Recompensas e objetivos</Typography></Stack>
            <Stack component="ul" spacing={1.2} sx={{ m: 0, pl: 2.5, color: "text.secondary" }}>{content.rewards.map((reward) => <Typography component="li" variant="body2" key={reward} sx={{ lineHeight: 1.55 }}>{reward}</Typography>)}</Stack>
          </Paper>
        </Stack>

        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}><Lightbulb size={18} color="#4bd6d0" /><Typography fontWeight={900}>Dicas rápidas</Typography></Stack>
            <Stack spacing={1.25}>{content.tips.map((tip) => <Typography variant="body2" color="text.secondary" key={tip} sx={{ lineHeight: 1.55 }}>• {tip}</Typography>)}</Stack>
            {content.warnings?.length ? <><Divider sx={{ my: 2 }} /><Stack direction="row" spacing={1} alignItems="flex-start"><ShieldAlert size={17} color="#f5c45e" style={{ marginTop: 2, flexShrink: 0 }} /><Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>{content.warnings.join(" ")}</Typography></Stack></> : null}
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: "divider", bgcolor: "rgba(13,27,39,.48)" }}>
            <Typography variant="caption" color="text.secondary">Conferido em {content.lastVerifiedAt}</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>{content.sources.map((source) => <Button key={source.url} component="a" href={source.url} target="_blank" rel="noreferrer" size="small" color="inherit" endIcon={<ExternalLink size={14} />} sx={{ justifyContent: "space-between", color: "text.secondary" }}>{source.label}</Button>)}</Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}

