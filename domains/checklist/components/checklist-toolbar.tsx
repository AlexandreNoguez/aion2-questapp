import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { RotateCcw } from "lucide-react";
import type { ChecklistFilter } from "../types";

type Props = { filter: ChecklistFilter; onFilterChange: (filter: ChecklistFilter) => void; onReset: () => void };
const FILTERS = [["all", "Todas"], ["pending", "Pendentes"], ["done", "Concluídas"]] as const;

export function ChecklistToolbar({ filter, onFilterChange, onReset }: Props) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Exibir atividades</Typography>
        <Box role="group" aria-label="Filtrar atividades">
          <Stack direction="row" spacing={1}>
            {FILTERS.map(([value, label]) => <Chip key={value} label={label} onClick={() => onFilterChange(value)} variant={filter === value ? "filled" : "outlined"} sx={{ borderColor: "divider", bgcolor: filter === value ? "rgba(75,214,208,.13)" : "transparent", color: filter === value ? "primary.light" : "text.secondary", fontWeight: 700 }} />)}
          </Stack>
        </Box>
      </Stack>
      <Button onClick={onReset} color="inherit" size="small" startIcon={<RotateCcw size={15} />} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, color: "text.secondary" }}>Reiniciar esta lista</Button>
    </Stack>
  );
}
