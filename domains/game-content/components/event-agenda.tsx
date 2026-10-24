import { Box, Container, Typography } from "@mui/material";
import type { AgendaEventViewModel } from "../types";
import { EventAgendaCard } from "./event-agenda-card";

type Props = { events: AgendaEventViewModel[] };

export function EventAgenda({ events }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: "-.03em" }}>Agenda de eventos</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Acompanhe a próxima ocorrência de cada evento. Horários em BRT (UTC−3).</Typography>
      <Box component="section" aria-label="Próximos eventos" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2, mt: 3 }}>
        {events.map((event) => <EventAgendaCard key={event.id} event={event} />)}
      </Box>
    </Container>
  );
}
