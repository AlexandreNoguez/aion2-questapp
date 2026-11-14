"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, ButtonBase, Chip, Collapse, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ChevronDown, RotateCw, Shield } from "lucide-react";
import { useEquipmentDetails } from "../hooks/use-equipment-details";
import { getGearReference } from "../services/gear-reference";
import { calculateGearRating, isGoldenRank } from "../services/gear-rating";
import type { CharacterProfile, EquipmentItem, EquipmentView, GearMode } from "../types";
import { EquipmentPanel, EquipmentRecommendations, EquipmentStats } from "./equipment-panel";
import { GearProgress, GearRank } from "./gear-rank";

const GRADES: Record<string, string> = {
  Common: "Comum", Rare: "Raro", Legend: "Lendário", Unique: "Único", Epic: "Épico", Special: "Especial",
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
  const grade = GRADES[item.grade] ?? item.grade;
  const golden = isGoldenRank(rating?.rank ?? null);
  const accent = rating?.rank.color ?? "#637b90";
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

  const heading = <Stack component="span" direction="row" spacing={1.75} alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
    <Avatar component="span" variant="rounded" src={item.icon ?? undefined} alt="" imgProps={{ loading: "lazy", referrerPolicy: "no-referrer" }} sx={{ width: { xs: 70, sm: 82 }, height: { xs: 78, sm: 92 }, flexShrink: 0, borderRadius: "20px", background: golden ? "radial-gradient(ellipse at 50% 65%, rgba(245,196,94,.12), #060e16 72%)" : "radial-gradient(ellipse at 50% 65%, rgba(121,182,255,.08), #060e16 72%)", border: `1px solid ${accent}${golden ? "88" : "55"}`, boxShadow: golden ? "inset 0 0 18px rgba(245,196,94,.07), 0 0 15px rgba(245,196,94,.08)" : "inset 0 1px 0 rgba(190,215,234,.08)", "& img": { objectFit: "contain", p: .5, filter: golden ? "drop-shadow(0 0 7px rgba(245,196,94,.22))" : "none" }, "@container (min-width: 760px)": { width: 100, height: 112 } }}><Shield size={32} /></Avatar>
    <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
      <Typography component="span" display="block" sx={{ color: "#8195a9", fontSize: 13, lineHeight: 1.4, mb: .5, "@container (min-width: 760px)": { fontSize: 16 } }}>{item.slotName}</Typography>
      <Typography component="span" display="block" sx={{ fontWeight: 850, fontSize: { xs: 17, sm: 19 }, letterSpacing: "-.025em", color: golden ? accent : "#dceaf4", overflowWrap: "anywhere", lineHeight: 1.22, textShadow: golden ? `0 0 22px ${accent}22` : "none", "@container (min-width: 760px)": { fontSize: 27 } }}>{item.name}</Typography>
      <Stack component="span" direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ color: golden ? accent : "#acbdce", fontSize: 12 }}>{grade}</Typography><Typography variant="caption" sx={{ fontSize: 14, fontWeight: 850, color: "#f0f5fa" }}>+{item.enchantLevel}</Typography>
        {item.exceedLevel > 0 && <Typography variant="caption" sx={{ color: "#6d95b6", fontSize: 12 }}>Transcendência +{item.exceedLevel}</Typography>}
      </Stack>
    </Box>
    {view === "grid" && <ChevronDown size={18} style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "none" }} />}
  </Stack>;

  return <Box component="li" ref={root} sx={{ listStyle: "none", minWidth: 0 }}>
    <Paper variant="outlined" data-gear-rank={rating?.rank.label ?? "unranked"} data-golden={golden ? "true" : "false"} sx={{ position: "relative", containerType: "inline-size", overflow: "hidden", borderRadius: "22px", border: `1px solid ${accent}${golden ? "80" : "40"}`, background: golden ? "radial-gradient(ellipse at 85% 0%, rgba(245,196,94,.07), transparent 55%), linear-gradient(120deg, #07121c, #0b1823 70%, #0a1520)" : "radial-gradient(ellipse at 95% 0%, rgba(121,182,255,.04), transparent 50%), linear-gradient(120deg, #07121c, #0b1823 70%, #0a1520)", boxShadow: golden ? `inset 0 1px 0 ${accent}30, 0 6px 28px rgba(0,0,0,.22), 0 0 22px ${accent}0c` : "inset 0 1px 0 rgba(177,203,225,.05), 0 6px 28px rgba(0,0,0,.18)", transition: "border-color .35s ease, box-shadow .35s ease", animation: golden ? "gear-unlock .8s ease-out" : "none", "@keyframes gear-unlock": { "0%": { boxShadow: `0 0 36px ${accent}45` }, "100%": { boxShadow: `0 0 22px ${accent}0c` } }, "@media (prefers-reduced-motion: reduce)": { animation: "none", transition: "none" }, "&::before": { content: '""', position: "absolute", zIndex: 1, pointerEvents: "none", left: 0, top: 0, bottom: 0, width: golden ? 5 : 2, background: golden ? "linear-gradient(180deg, #fff6cd 0%, #b57a24 18%, #f5c45e 52%, #fff0b4 80%, #90611c 100%)" : `linear-gradient(180deg, ${accent}aa, ${accent}25 50%, ${accent}88)`, boxShadow: golden ? "0 0 12px rgba(245,196,94,.4)" : "none" }, "&::after": { content: '""', position: "absolute", pointerEvents: "none", left: 28, right: 28, top: 0, height: "1px", background: golden ? `linear-gradient(90deg, transparent, ${accent}aa, transparent)` : "linear-gradient(90deg, transparent, rgba(177,203,225,.25), transparent)" } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gridTemplateAreas: '"item item" "rank mode" "progress progress"', columnGap: 1.5, rowGap: .5, p: { xs: 2, sm: 2.5 }, "@container (min-width: 480px)": { gridTemplateAreas: '"item rank" "item mode" "progress progress"', columnGap: 2 } }}>
        <Box sx={{ gridArea: "item", minWidth: 0 }}>{view === "grid" ? <ButtonBase onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls={`${id}-details`} aria-label={`${expanded ? "Recolher" : "Expandir"} ${item.slotName}: ${item.name}`} sx={{ display: "flex", width: "100%", height: "100%", textAlign: "left", borderRadius: 2, "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 5 } }}>{heading}</ButtonBase> : heading}</Box>
        <Box sx={{ gridArea: "rank", justifySelf: "start", alignSelf: "center", "@container (min-width: 480px)": { justifySelf: "end" } }}><GearRank rating={rating} loading={state.loading} unavailable={guide.status !== "available"} error={!!state.error} incomplete={!!state.details && !rating} /></Box>
        <Box sx={{ gridArea: "mode", alignSelf: "center", justifySelf: "end" }}><ToggleButtonGroup size="small" exclusive color="primary" value={mode} onChange={(_, value: unknown) => { if (value === "pve" || value === "pvp") onMode(value); }} aria-label={`Foco de ${item.slotName}`} sx={{ bgcolor: "rgba(0,0,0,.2)", borderRadius: "18px", overflow: "hidden", "& .MuiToggleButton-root": { py: .4, px: 1.5, fontSize: 12, fontWeight: 850, lineHeight: 1.3, borderColor: "rgba(133,167,189,.13)", color: "#778fa4" }, "& .MuiToggleButton-root.Mui-selected": { color: "#40d9e6", bgcolor: "rgba(30,174,203,.11)", textShadow: "0 0 12px rgba(64,217,230,.2)" } }}><ToggleButton value="pve">PvE</ToggleButton><ToggleButton value="pvp">PvP</ToggleButton></ToggleButtonGroup></Box>
        <Box sx={{ gridArea: "progress", mt: 1 }}><GearProgress rating={rating} /></Box>
      </Box>
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
