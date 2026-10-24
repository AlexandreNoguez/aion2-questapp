import { Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import type { EventAgendaModel } from "../hooks/use-event-agenda";
import type { AgendaFilters } from "../types";
import { EventAgendaCard } from "./event-agenda-card";

type Props = EventAgendaModel;

export function EventAgenda({ events, filters, categories, total, hasActiveFilters, actions }: Props) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 900, letterSpacing: "-.03em" }}>Agenda de eventos</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Acompanhe a próxima ocorrência de cada evento. Horários em BRT (UTC−3).</Typography>
      <Paper component="section" aria-label="Filtros da agenda" variant="outlined" sx={{ mt: 3, p: 2, bgcolor: "rgba(13,27,39,.72)" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "2fr 1fr 1fr 1.3fr" }, gap: 2 }}>
          <TextField label="Buscar evento" placeholder="Nome do evento" size="small" value={filters.search} onChange={(event) => actions.setSearch(event.target.value)} />
          <TextField select label="Categoria" size="small" value={filters.category} onChange={(event) => actions.setCategory(event.target.value as AgendaFilters["category"])}>
            <MenuItem value="all">Todas</MenuItem>
            {categories.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
          </TextField>
          <TextField select label="Tipo de horário" size="small" value={filters.schedule} onChange={(event) => actions.setSchedule(event.target.value as AgendaFilters["schedule"])}>
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="scheduled">Programado</MenuItem>
            <MenuItem value="respawn">Após a morte</MenuItem>
          </TextField>
          <TextField select label="Ordenar por" size="small" value={filters.sort} onChange={(event) => actions.setSort(event.target.value as AgendaFilters["sort"])}>
            <MenuItem value="default">Ordem padrão</MenuItem>
            <MenuItem value="next">Próxima ocorrência</MenuItem>
            <MenuItem value="name">Nome (A–Z)</MenuItem>
          </TextField>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary" role="status">{events.length} de {total} eventos</Typography>
          <Button size="small" onClick={actions.reset} disabled={!hasActiveFilters}>Limpar filtros</Button>
        </Stack>
      </Paper>
      {events.length === 0 && <Paper variant="outlined" sx={{ mt: 3, p: 4, textAlign: "center" }}>
        <Typography fontWeight={800}>Nenhum evento encontrado</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Tente outro nome ou limpe os filtros para ver todos os eventos.</Typography>
        <Button onClick={actions.reset} sx={{ mt: 2 }}>Limpar filtros</Button>
      </Paper>}
      <Box component="section" aria-label="Próximos eventos" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2, mt: 3 }}>
        {events.map((event) => <EventAgendaCard key={event.id} event={event} />)}
      </Box>
    </Container>
  );
}
