import { Box, FormControl, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ChevronDown, Swords } from "lucide-react";
import { PLAYER_CLASSES } from "../data/classes";
import type { PlayerClassId } from "../types";

type Props = {
  value: PlayerClassId;
  onChange: (playerClass: PlayerClassId) => void;
};

export function ClassSelector({ value, onChange }: Props) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: "primary.main", display: "grid", placeItems: "center" }}><Swords size={15} /></Box>
      <FormControl size="small" variant="standard">
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value as PlayerClassId)}
          IconComponent={ChevronDown}
          inputProps={{ "aria-label": "Selecionar classe do personagem" }}
          sx={{
            minWidth: 150,
            color: "primary.light",
            fontSize: ".82rem",
            fontWeight: 800,
            "&:before, &:after": { display: "none" },
            "& .MuiSelect-select": { py: .4, pr: "30px !important" },
            "& .MuiSelect-icon": { color: "primary.main", width: 17 },
          }}
          MenuProps={{ PaperProps: { sx: { mt: 1, bgcolor: "#102333", border: "1px solid rgba(149,183,203,.18)", maxHeight: 360 } } }}
        >
          {PLAYER_CLASSES.map((playerClass) => (
            <MenuItem key={playerClass.id} value={playerClass.id}>
              <Box><Typography variant="body2" fontWeight={800}>{playerClass.label}</Typography><Typography variant="caption" color="text.secondary">{playerClass.role}</Typography></Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary">Nv. 45</Typography>
    </Stack>
  );
}
