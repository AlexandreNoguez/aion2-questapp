"use client";

import { useState } from "react";
import { Box, Button, Chip, Collapse, Stack, Tooltip, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { GEAR_RANKS, isGoldenRank } from "../services/gear-rating";
import type { GearRating } from "../services/gear-rating";

export function GearRank({ rating, loading, unavailable, error, incomplete }: { rating: GearRating | null; loading: boolean; unavailable: boolean; error: boolean; incomplete: boolean }) {
  if (!rating) {
    const label = unavailable ? "Sem referência" : error ? "Sem nota" : incomplete ? "Dados insuficientes" : loading ? "Calculando…" : "Rank pendente";
    return <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 76, minWidth: 155, color: "text.secondary" }}><Typography aria-hidden="true" sx={{ fontFamily: "Georgia, serif", fontSize: 44, color: "#536476" }}>—</Typography><Typography component="span" variant="caption" sx={{ maxWidth: 100 }}>{label}</Typography></Stack>;
  }
  const label = rating.rank.label === "BiS" ? "BiS*" : rating.rank.label;
  const golden = isGoldenRank(rating.rank);
  const color = rating.rank.color;
  return <Tooltip title={`${rating.score.toLocaleString("pt-BR")}% de afinidade · ${rating.matched}/${rating.total} prioridades presentes. Não avalia valores dos rolls, habilidades, pedras ou a força total da peça. BiS* indica afinidade com a referência, não o melhor item do jogo.`} arrow>
    <Box component="span" aria-label={`Rank de afinidade ${label}, ${rating.score.toLocaleString("pt-BR")}%`} sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: .75, minWidth: 166, minHeight: 82, pr: 1.75, borderRadius: "48px", color, background: golden ? "radial-gradient(ellipse at 48% 55%, rgba(245,196,94,.12), transparent 72%)" : `radial-gradient(ellipse at 55% 50%, ${color}0c, transparent 75%)`, "&::before": { content: '""', position: "absolute", left: 32, right: 0, top: 11, bottom: 9, border: `1px solid ${color}${golden ? "85" : "35"}`, borderLeftColor: "transparent", borderRadius: "50px", boxShadow: golden ? `0 0 16px ${color}18, inset 0 1px 0 ${color}22` : "none" } }}>
      <Box component="span" aria-hidden="true" sx={{ position: "relative", display: "grid", placeItems: "center", width: 80, height: 84, flexShrink: 0 }}>
        <Box component="svg" viewBox="0 0 100 100" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", color, opacity: golden ? .85 : .22, filter: golden ? `drop-shadow(0 0 5px ${color}55)` : "none" }}>
          <path d="M45 91C22 86 12 68 15 48M55 91C78 86 88 68 85 48" fill="none" stroke="currentColor" strokeWidth="1.3" />
          {[0, 1, 2, 3, 4].map((leaf) => <g key={leaf}><ellipse cx={19 + leaf * 3.6} cy={54 + leaf * 7.2} rx="3.5" ry="9" transform={`rotate(${-35 - leaf * 7} ${19 + leaf * 3.6} ${54 + leaf * 7.2})`} fill="currentColor" /><ellipse cx={81 - leaf * 3.6} cy={54 + leaf * 7.2} rx="3.5" ry="9" transform={`rotate(${35 + leaf * 7} ${81 - leaf * 3.6} ${54 + leaf * 7.2})`} fill="currentColor" /></g>)}
        </Box>
        <Typography component="span" sx={{ position: "relative", mt: -.75, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 800, fontStyle: "italic", letterSpacing: "-.075em", pr: .6, fontSize: rating.rank.label === "BiS" ? 34 : rating.rank.label === "S+" ? 47 : 64, lineHeight: 1, color, background: golden ? "linear-gradient(160deg, #fff9da 8%, #ffe6a0 30%, #c89131 65%, #ffe8ac 86%)" : `linear-gradient(160deg, #e4f3ff, ${color} 75%)`, backgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: golden ? "0 0 24px rgba(245,196,94,.3)" : "none", filter: golden ? "drop-shadow(0 2px 1px #4b300d)" : "none" }}>{label}</Typography>
      </Box>
      <Box component="span" sx={{ position: "relative", minWidth: 0 }}>
        <Typography component="span" display="block" sx={{ color: golden ? "#eadbbd" : "#b9cbd7", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Rank {label}</Typography>
        <Typography component="span" display="block" sx={{ color: golden ? color : "#d5e7f1", fontSize: { xs: 24, sm: 27 }, fontWeight: 900, lineHeight: 1.25, letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums", textShadow: golden ? `0 0 16px ${color}33` : "none" }}>{rating.score.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</Typography>
      </Box>
    </Box>
  </Tooltip>;
}

export function GearProgress({ rating }: { rating: GearRating | null }) {
  if (!rating) return null;
  const index = GEAR_RANKS.findIndex((rank) => rank.label === rating.rank.label);
  const next = GEAR_RANKS[index + 1];
  const golden = isGoldenRank(rating.rank);
  const color = rating.rank.color;
  return <Box>
    <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: .8 }}>
      <Typography variant="caption" sx={{ color: golden ? "#cbb98f" : "#809aaa", fontSize: 11 }}>{rating.matched} de {rating.total} prioridades</Typography>
      <Typography variant="caption" sx={{ color: golden ? "#e8d3a2" : "#9fb8c9", fontSize: 11 }}>{next ? `Próximo: ${next.label === "BiS" ? "BiS*" : next.label} · ${next.minimum}%` : "Referência BiS* alcançada"}</Typography>
    </Stack>
    <Box role="progressbar" aria-label="Afinidade com os atributos recomendados" aria-valuemin={0} aria-valuemax={100} aria-valuenow={rating.score} sx={{ height: 4, bgcolor: "rgba(133,167,189,.1)", borderRadius: 4, overflow: "hidden" }}>
      <Box sx={{ width: `${rating.score}%`, height: "100%", borderRadius: "inherit", background: golden ? "linear-gradient(90deg, #97671f, #f5c45e 65%, #fff0c2)" : `linear-gradient(90deg, ${color}44, ${color})`, boxShadow: golden ? `0 0 10px ${color}55` : "none", transition: "width .7s ease, background .3s ease", "@media (prefers-reduced-motion: reduce)": { transition: "none" } }} />
    </Box>
  </Box>;
}

export function GearRankLegend() {
  const [open, setOpen] = useState(false);
  return <Box sx={{ mt: 2 }}>
    <Stack direction="row" gap={.75} flexWrap="wrap" alignItems="center">
      <Typography variant="caption" color="text.secondary" sx={{ mr: .5 }}>Afinidade dos atributos</Typography>
      {GEAR_RANKS.map((rank) => <Chip key={rank.label} size="small" label={rank.label === "BiS" ? "BiS*" : rank.label} title={`A partir de ${rank.minimum}% de afinidade`} sx={{ height: 24, fontWeight: 850, color: rank.color, bgcolor: `${rank.color}12`, border: `1px solid ${rank.color}44` }} />)}
      <Button size="small" startIcon={<Info size={14} />} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="gear-rank-method">Como funciona</Button>
    </Stack>
    <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>BiS* indica afinidade com a referência; não garante o melhor item do jogo.</Typography>
    <Collapse in={open} id="gear-rank-method"><Box sx={{ p: 2, mt: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
      <Typography variant="body2" color="text.secondary">O rank considera quais dos seis atributos da referência aparecem com valor positivo nas gravações da peça, ponderados pelo uso na amostra da classe e do modo escolhido. Linhas repetidas contam uma vez. Atributos base, pedras e habilidades não entram na nota; o tamanho dos rolls também não é avaliado. A nota é própria do Companion e não equivale à do Kisk.</Typography>
      <Typography variant="caption" component="p" color="text.secondary" sx={{ mt: 1 }}>Faixas: D ≥0%, C ≥5%, B ≥12%, A ≥22%, S ≥35%, S+ ≥55% e BiS* ≥90%. Peças sem referência ou sem dados suficientes ficam sem nota.</Typography>
    </Box></Collapse>
  </Box>;
}
