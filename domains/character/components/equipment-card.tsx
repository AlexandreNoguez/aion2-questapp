"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, ButtonBase, Chip, Collapse, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ChevronDown, RotateCw, Shield } from "lucide-react";
import { useEquipmentDetails } from "../hooks/use-equipment-details";
import { getGearReference } from "../services/gear-reference";
import { calculateGearRating } from "../services/gear-rating";
import type { CharacterProfile, EquipmentItem, EquipmentView, GearMode } from "../types";
import { EquipmentPanel, EquipmentRecommendations, EquipmentStats } from "./equipment-panel";
import { GearRank } from "./gear-rank";

const GRADES: Record<string, { label: string; color: string }> = {
  Common: { label: "Comum", color: "#b4c2ca" }, Rare: { label: "Raro", color: "#6aafff" },
  Legend: { label: "Lendário", color: "#d094ff" }, Unique: { label: "Único", color: "#f5c45e" },
  Epic: { label: "Épico", color: "#f89565" }, Special: { label: "Especial", color: "#4bd6d0" },
};

type Props = { item: EquipmentItem; profile: CharacterProfile; mode: GearMode; view: EquipmentView; onMode: (mode: GearMode) => void };

export function EquipmentCard({ item, profile, mode, view, onMode }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const root = useRef<HTMLLIElement>(null);
  const guide = getGearReference(profile.className, item.slot, mode);
  const state = useEquipmentDetails(profile, item, expanded || flipped || (nearViewport && (guide.status === "available" || view !== "grid")));
  const rating = calculateGearRating(state.details, guide);
  const grade = GRADES[item.grade] ?? { label: item.grade, color: "#96aebe" };
  const id = `equipment-${item.slot}`;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setNearViewport(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const heading = <Stack component="span" direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
    <Avatar component="span" variant="rounded" src={item.icon ?? undefined} alt="" imgProps={{ loading: "lazy", referrerPolicy: "no-referrer" }} sx={{ width: 54, height: 54, bgcolor: "rgba(149,183,203,.06)", border: "1px solid", borderColor: "divider" }}><Shield size={24} /></Avatar>
    <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
      <Typography component="span" display="block" variant="caption" color="text.secondary">{item.slotName}</Typography>
      <Typography component="span" display="block" sx={{ fontWeight: 800, color: grade.color, overflowWrap: "anywhere", lineHeight: 1.4 }}>{item.name}</Typography>
      <Stack component="span" direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: .5 }}>
        <Typography variant="caption" sx={{ color: grade.color }}>{grade.label}</Typography><Typography variant="caption" fontWeight={800}>+{item.enchantLevel}</Typography>
        {item.exceedLevel > 0 && <Typography variant="caption" color="text.secondary">Transcendência +{item.exceedLevel}</Typography>}
      </Stack>
    </Box>
    {view === "grid" && <ChevronDown size={18} style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "none" }} />}
  </Stack>;

  return <Box component="li" ref={root} sx={{ listStyle: "none", minWidth: 0 }}>
    <Paper variant="outlined" sx={{ overflow: "hidden", bgcolor: "rgba(13,27,39,.72)", borderLeft: `3px solid ${grade.color}` }}>
      {view === "grid" ? <ButtonBase onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls={`${id}-details`} aria-label={`${expanded ? "Recolher" : "Expandir"} ${item.slotName}: ${item.name}`} sx={{ display: "flex", width: "100%", textAlign: "left", p: 2, "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -3 } }}>{heading}</ButtonBase> : <Box sx={{ p: 2 }}>{heading}</Box>}
      <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ px: 2, pb: 1.5 }}>
        <GearRank rating={rating} loading={state.loading} unavailable={guide.status !== "available"} error={!!state.error} incomplete={!!state.details && !rating} />
        <ToggleButtonGroup size="small" exclusive color="primary" value={mode} onChange={(_, value: unknown) => { if (value === "pve" || value === "pvp") onMode(value); }} aria-label={`Foco de ${item.slotName}`}>
          <ToggleButton value="pve" sx={{ py: .25, px: 1.25 }}>PvE</ToggleButton><ToggleButton value="pvp" sx={{ py: .25, px: 1.25 }}>PvP</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {state.error && view === "grid" && !expanded && <Button size="small" onClick={state.retry} sx={{ mx: 2, mb: 1.5 }}>Tentar calcular o rank novamente</Button>}
      {view === "grid" && <Collapse in={expanded} unmountOnExit><Box id={`${id}-details`} sx={{ px: 2, pb: 2.5 }}><EquipmentPanel item={item} className={profile.className} mode={mode} details={state.details} state={state} /></Box></Collapse>}
      {view === "comparison" && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(0,1fr)" }, borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}><Chip size="small" label="Equipado agora" sx={{ mb: 2 }} /><EquipmentStats {...state} /></Box>
        <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0, bgcolor: "rgba(75,214,208,.035)", borderLeft: { md: "1px solid" }, borderTop: { xs: "1px solid", md: 0 }, borderColor: "divider" }}><Chip size="small" label="Atributos desejados" color="primary" variant="outlined" sx={{ mb: 2 }} /><EquipmentRecommendations item={item} className={profile.className} mode={mode} details={state.details} /></Box>
      </Box>}
      {view === "flip" && <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ perspective: "1200px" }}>
          <Box sx={{ display: "grid", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform .45s ease", "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
            <Box id={`${id}-front`} aria-hidden={flipped} inert={flipped} sx={{ gridArea: "1 / 1", minWidth: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}><EquipmentStats {...state} compact /></Box>
            <Box id={`${id}-back`} aria-hidden={!flipped} inert={!flipped} sx={{ gridArea: "1 / 1", minWidth: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", p: 2, borderRadius: 2, border: "1px solid rgba(75,214,208,.3)", bgcolor: "#102732" }}><EquipmentRecommendations item={item} className={profile.className} mode={mode} details={state.details} /></Box>
          </Box>
        </Box>
        <Button fullWidth variant="outlined" startIcon={<RotateCw size={16} />} onClick={() => setFlipped((value) => !value)} aria-pressed={flipped} aria-controls={`${id}-front ${id}-back`} sx={{ mt: 2 }}>{flipped ? "Voltar ao equipamento" : "Virar: ver atributos desejados"}</Button>
      </Box>}
    </Paper>
  </Box>;
}
