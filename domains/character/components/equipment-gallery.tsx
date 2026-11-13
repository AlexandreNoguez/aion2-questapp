"use client";

import { useState } from "react";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Columns2, LayoutGrid, RotateCw } from "lucide-react";
import { useGearMode } from "../hooks/use-gear-mode";
import { useEquipmentView } from "../hooks/use-equipment-view";
import { resolveCardMode } from "../services/equipment-view";
import type { CharacterProfile, EquipmentGroup, GearMode } from "../types";
import { EquipmentCard } from "./equipment-card";
import { GearRankLegend } from "./gear-rank";

const GROUPS: { id: EquipmentGroup; label: string }[] = [
  { id: "weapons", label: "Armas" }, { id: "armor", label: "Armaduras" },
  { id: "accessories", label: "Acessórios" }, { id: "arcana", label: "Arcanas" },
];

export function EquipmentGallery({ profile }: { profile: CharacterProfile }) {
  const { mode, changeMode } = useGearMode();
  const { view, changeView } = useEquipmentView();
  const [overrides, setOverrides] = useState<Record<number, GearMode>>({});
  const cardModes = new Set(profile.equipment.map((item) => resolveCardMode(mode, overrides, item.slot)));
  const allMode = cardModes.size === 1 ? [...cardModes][0] : null;
  const applyMode = (value: unknown) => {
    if (value !== "pve" && value !== "pvp") return;
    changeMode(value);
    setOverrides({});
  };
  return <Box>
    <Stack gap={2}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box><Typography component="h3" variant="subtitle1" fontWeight={850}>Visualização dos equipamentos</Typography><Typography variant="body2" color="text.secondary">Explore as peças, compare as prioridades ou vire os cards.</Typography></Box>
        <ToggleButtonGroup exclusive value={view} onChange={(_, value: unknown) => changeView(value)} aria-label="Visualização dos equipamentos" color="primary" size="small" sx={{ flexWrap: "wrap" }}>
          <ToggleButton value="grid" sx={{ gap: .75 }}><LayoutGrid size={15} />Grade</ToggleButton><ToggleButton value="comparison" sx={{ gap: .75 }}><Columns2 size={15} />Comparação</ToggleButton><ToggleButton value="flip" sx={{ gap: .75 }}><RotateCw size={15} />Virar cards</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Typography variant="body2" color="text.secondary" aria-live="polite">{cardModes.size > 1 ? "As peças estão com focos diferentes. Use os botões para aplicar um modo a todas." : "Aplique um foco a todas as peças ou use o toggle de cada card."}</Typography>
        <ToggleButtonGroup value={allMode} exclusive onChange={(_, value: unknown) => applyMode(value)} aria-label="Aplicar foco a todas as peças" color="primary" size="small"><ToggleButton value="pve" sx={{ px: 2 }}>Todas PvE</ToggleButton><ToggleButton value="pvp" sx={{ px: 2 }}>Todas PvP</ToggleButton></ToggleButtonGroup>
      </Stack>
    </Stack>
    <GearRankLegend />
    {profile.equipment.length === 0 && <Typography color="text.secondary" sx={{ p: 3 }}>O armory não informou equipamentos para este personagem.</Typography>}
    {GROUPS.map((group) => {
      const items = profile.equipment.filter((item) => item.group === group.id);
      if (!items.length) return null;
      return <Box component="section" key={group.id} aria-labelledby={`gear-${group.id}`} sx={{ mt: 3 }}>
        <Typography id={`gear-${group.id}`} component="h3" variant="h6" fontWeight={850}>{group.label} <Box component="span" sx={{ color: "text.secondary", fontWeight: 500, fontSize: 14 }}>· {items.length}</Box></Typography>
        <Box component="ul" sx={{ display: "grid", gridTemplateColumns: view === "comparison" ? "1fr" : { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, alignItems: "start", gap: 1.5, p: 0, mt: 1.5 }}>
          {items.map((item) => <EquipmentCard key={item.slot} item={item} profile={profile} mode={resolveCardMode(mode, overrides, item.slot)} view={view} onMode={(value) => setOverrides((current) => ({ ...current, [item.slot]: value }))} />)}
        </Box>
      </Box>;
    })}
  </Box>;
}
