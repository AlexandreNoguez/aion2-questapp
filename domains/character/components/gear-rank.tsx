"use client";

import { useState } from "react";
import { Box, Button, Chip, Collapse, Stack, Tooltip, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { GEAR_RANKS } from "../services/gear-rating";
import type { GearRating } from "../services/gear-rating";

export function GearRank({ rating, loading, unavailable, error, incomplete }: { rating: GearRating | null; loading: boolean; unavailable: boolean; error: boolean; incomplete: boolean }) {
  if (!rating) {
    const label = unavailable ? "Sem referência" : error ? "Sem nota" : incomplete ? "Dados insuficientes" : loading ? "Calculando…" : "Rank pendente";
    return <Chip component="span" size="small" variant="outlined" label={label} sx={{ color: "text.secondary", borderColor: "divider" }} />;
  }
  const label = rating.rank.label === "BiS" ? "BiS*" : rating.rank.label;
  return <Tooltip title={`${rating.score.toLocaleString("pt-BR")}% de afinidade · ${rating.matched}/${rating.total} prioridades presentes. Não avalia valores dos rolls, habilidades, pedras ou a força total da peça. BiS* indica afinidade com a referência, não o melhor item do jogo.`} arrow>
    <Chip component="span" size="small" label={`Rank ${label} · ${rating.score.toLocaleString("pt-BR")}%`} aria-label={`Rank de afinidade ${label}, ${rating.score.toLocaleString("pt-BR")}%`} sx={{ fontWeight: 900, color: rating.rank.color, bgcolor: `${rating.rank.color}12`, border: `1px solid ${rating.rank.color}55` }} />
  </Tooltip>;
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
