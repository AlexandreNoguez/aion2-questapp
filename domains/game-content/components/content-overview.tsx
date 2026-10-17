import Link from "next/link";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { ArrowRight, Clock3, RefreshCw } from "lucide-react";
import type { GameContentViewModel } from "../types";

type Props = { contents: GameContentViewModel[] };

export function ContentOverview({ contents }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper sx={{ position: "relative", overflow: "hidden", p: { xs: 2.5, md: 4 }, border: "1px solid rgba(149,183,203,.14)", bgcolor: "rgba(13,27,39,.88)" }}>
        <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(75,214,208,.1), transparent 45%), radial-gradient(circle at 88% 10%, rgba(109,79,182,.18), transparent 30%)" }} />
        <Box position="relative">
          <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 850, letterSpacing: ".13em" }}>Guia de atividades</Typography>
          <Typography component="h1" sx={{ mt: .5, maxWidth: 720, fontSize: { xs: "2.15rem", md: "3.7rem" }, fontWeight: 900, lineHeight: 1, letterSpacing: "-.05em" }}>Saiba o que acontece.<br /><Box component="span" sx={{ color: "primary.main" }}>E chegue na hora certa.</Box></Typography>
          <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 650, lineHeight: 1.7 }}>Horários, requisitos e dicas dos principais conteúdos recorrentes do AION 2 Global na América do Sul.</Typography>
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2, mt: 3 }}>
        <Paper variant="outlined" sx={{ p: 2.25, borderColor: "divider", bgcolor: "rgba(13,27,39,.65)" }}><Stack direction="row" spacing={1.25} alignItems="center"><Clock3 size={19} color="#4bd6d0" /><Box><Typography fontWeight={850}>Reset diário</Typography><Typography variant="body2" color="text.secondary">Todos os dias · 04:00 BRT</Typography></Box></Stack></Paper>
        <Paper variant="outlined" sx={{ p: 2.25, borderColor: "divider", bgcolor: "rgba(13,27,39,.65)" }}><Stack direction="row" spacing={1.25} alignItems="center"><RefreshCw size={19} color="#f5c45e" /><Box><Typography fontWeight={850}>Reset semanal</Typography><Typography variant="body2" color="text.secondary">Quarta-feira · 04:00 BRT</Typography></Box></Stack></Paper>
        <Paper variant="outlined" sx={{ p: 2.25, borderColor: "divider", bgcolor: "rgba(13,27,39,.65)" }}><Stack direction="row" spacing={1.25} alignItems="center"><RefreshCw size={19} color="#96aebe" /><Box><Typography fontWeight={850}>Mercador Nuvem Negra</Typography><Typography variant="body2" color="text.secondary">Estoque renovado a cada 1 hora</Typography></Box></Stack></Paper>
      </Box>

      <Box component="section" aria-labelledby="content-list-title" sx={{ mt: { xs: 4, md: 5 } }}>
        <Typography id="content-list-title" variant="h5" fontWeight={900}>Conteúdos em destaque</Typography>
        <Typography color="text.secondary" sx={{ mt: .75 }}>Escolha uma atividade para ver agenda, funcionamento e recomendações.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 2, mt: 2.5 }}>
          {contents.map((content) => {
            const next = content.schedules.find((schedule) => schedule.nextLabel);
            return (
              <Paper key={content.id} variant="outlined" sx={{ display: "flex", flexDirection: "column", p: { xs: 2.5, md: 3 }, minHeight: 235, borderColor: "divider", bgcolor: "rgba(13,27,39,.72)", transition: "transform .2s ease,border-color .2s ease", "&:hover": { transform: "translateY(-2px)", borderColor: "rgba(75,214,208,.32)" } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box><Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 850, letterSpacing: ".1em" }}>{content.eyebrow}</Typography><Typography variant="h6" fontWeight={900}>{content.title}</Typography></Box>
                  <Chip size="small" label={content.category} variant="outlined" sx={{ borderColor: "divider", color: "text.secondary" }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.65 }}>{content.summary}</Typography>
                {next && <Stack direction="row" spacing={.8} alignItems="center" sx={{ mt: 2, color: "primary.main" }}><Clock3 size={15} /><Typography variant="caption" fontWeight={800}>{next.title}: {next.nextLabel} · {next.countdownLabel}</Typography></Stack>}
                <Button component={Link} href={`/conteudos/${content.id}`} endIcon={<ArrowRight size={16} />} sx={{ alignSelf: "flex-start", mt: "auto", pt: 2, px: 0 }}>Ver detalhes</Button>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}

