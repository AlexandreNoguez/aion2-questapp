import { Box, Button, Chip, Stack, Tab, Tabs } from "@mui/material";
import { RotateCcw } from "lucide-react";
import type { ChecklistFilter, ChecklistPeriod } from "../types";

type Props = { period: ChecklistPeriod; filter: ChecklistFilter; onPeriodChange: (period: ChecklistPeriod) => void; onFilterChange: (filter: ChecklistFilter) => void; onReset: () => void };
const FILTERS = [["all", "Todas"], ["pending", "Pendentes"], ["done", "Concluídas"]] as const;

export function ChecklistToolbar({ period, filter, onPeriodChange, onFilterChange, onReset }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }}>
        <Tabs value={period} onChange={(_, value: ChecklistPeriod) => onPeriodChange(value)} aria-label="Categoria das atividades" variant="scrollable" scrollButtons={false} sx={{ minHeight: 48, maxWidth: "100%", "& .MuiTabs-indicator": { height: 3, borderRadius: 3 }, "& .MuiTab-root": { minHeight: 48, minWidth: "auto", px: { xs: 1.5, sm: 2.5 }, fontWeight: 800, letterSpacing: "-.01em" } }}><Tab value="daily" label="Diárias" /><Tab value="weekly" label="Semanais" /><Tab value="events" label="Eventos" /></Tabs>
        <Button onClick={onReset} color="inherit" size="small" startIcon={<RotateCcw size={15} />} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, color: "text.secondary" }}>Reiniciar esta lista</Button>
      </Stack>
      <Box role="group" aria-label="Filtrar atividades"><Stack direction="row" spacing={1}>{FILTERS.map(([value, label]) => <Chip key={value} label={label} onClick={() => onFilterChange(value)} variant={filter === value ? "filled" : "outlined"} sx={{ borderColor: "divider", bgcolor: filter === value ? "rgba(75,214,208,.13)" : "transparent", color: filter === value ? "primary.light" : "text.secondary", fontWeight: 700 }} />)}</Stack></Box>
    </Stack>
  );
}
