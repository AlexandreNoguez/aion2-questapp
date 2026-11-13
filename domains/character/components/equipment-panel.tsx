"use client";

import { Alert, Box, Button, Chip, Divider, LinearProgress, Link, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import { useEquipmentDetails } from "../hooks/use-equipment-details";
import { formatEquipmentStat, getGearReference, isCurrentBinding } from "../services/gear-reference";
import type { CharacterIdentity, EquipmentItem, EquipmentStat, GearMode } from "../types";

function StatList({ title, stats }: { title: string; stats: EquipmentStat[] }) {
  if (!stats.length) return null;
  return <Box sx={{ mt: 2 }}>
    <Typography component="h5" variant="body2" fontWeight={850}>{title}</Typography>
    <Box component="dl" sx={{ m: 0, mt: .75 }}>{stats.map((stat, index) => <Stack component="div" key={`${stat.id}:${index}`} direction="row" justifyContent="space-between" gap={2} sx={{ py: .5 }}>
      <Typography component="dt" variant="body2" color="text.secondary">{stat.name}{stat.exceed ? " · Transcendência" : ""}</Typography>
      <Typography component="dd" variant="body2" sx={{ m: 0, flexShrink: 0 }}>{formatEquipmentStat(stat)}</Typography>
    </Stack>)}</Box>
  </Box>;
}

type Props = { identity: CharacterIdentity; item: EquipmentItem; className: string; expanded: boolean; mode: GearMode };

export function EquipmentPanel({ identity, item, className, expanded, mode }: Props) {
  const { details, loading, error, retry } = useEquipmentDetails(identity, item, expanded);
  const guide = getGearReference(className, item.slot, mode);
  const modeLabel = mode === "pve" ? "PvE" : "PvP";
  return (
    <Box>
      <Typography component="h4" variant="subtitle2" fontWeight={850}>Atributos da sua peça</Typography>
      {loading && <Box role="status" aria-label="Consultando atributos do equipamento" sx={{ mt: 1.5 }}><LinearProgress /><Typography variant="caption" color="text.secondary">Consultando o armory…</Typography></Box>}
      {error && <Alert severity="warning" sx={{ mt: 1.5 }} action={<Button size="small" color="inherit" onClick={retry}>Tentar novamente</Button>}>{error}</Alert>}
      {details && <Box>
        {(details.category || details.itemLevel !== null) && <Typography variant="caption" color="text.secondary">{[details.category, details.itemLevel !== null ? `Item level ${details.itemLevel}` : null].filter(Boolean).join(" · ")}</Typography>}
        <StatList title="Atributos base" stats={details.mainStats} />
        <StatList title={`Gravações${details.soulBindRate !== null ? ` · Vínculo ${details.soulBindRate}%` : ""}`} stats={details.subStats} />
        {details.skills.length > 0 && <Box sx={{ mt: 2 }}><Typography component="h5" variant="body2" fontWeight={850}>Habilidades da peça</Typography>{details.skills.map((skill) => <Typography key={skill.id} color="text.secondary" variant="body2" sx={{ mt: .75 }}>{skill.name} +{skill.level}</Typography>)}</Box>}
        <StatList title="Pedras equipadas" stats={details.stones} />
        {!details.mainStats.length && !details.subStats.length && !details.skills.length && !details.stones.length && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>O armory não informou atributos para esta peça.</Typography>}
      </Box>}
      <Divider sx={{ my: 2.5 }} />
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap"><Typography component="h4" variant="subtitle2" fontWeight={850}>O que buscar · {guide.classLabel}</Typography><Chip size="small" label={`Referência ${modeLabel}`} variant="outlined" color="primary" /></Stack>
      {guide.status === "available" ? <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Atributos mais usados neste slot por {guide.sampleSize?.toLocaleString("pt-BR")} jogadores da classe na amostra {modeLabel}. Use como ponto de partida para comparar gravações.</Typography>
        <Stack component="ol" gap={1} sx={{ pl: 2.5, my: 1.5 }}>{guide.options.map((option) => <Box component="li" key={option.name} sx={{ pl: .25, "&::marker": { color: "text.secondary", fontSize: 12 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}><Box><Typography variant="body2" fontWeight={700}>{option.name}</Typography>{details && isCurrentBinding(option.name, details, option.id) && <Stack direction="row" alignItems="center" gap={.5} sx={{ color: "primary.main" }}><Check size={12} /><Typography variant="caption">Na gravação atual</Typography></Stack>}</Box><Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>{option.share.toLocaleString("pt-BR")}% usam</Typography></Stack>
        </Box>)}</Stack>
        <Typography variant="caption" color="text.secondary" component="p">Os percentuais indicam uso na amostra, não bônus ou chance de obter o atributo. A disponibilidade das opções varia por item.</Typography>
      </Box> : <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>{guide.status === "unknown-class" ? "Ainda não há uma referência validada para esta classe." : item.group === "arcana" ? "Ainda não há prioridades de habilidades validadas para esta Arcana e classe. Compare as habilidades e os níveis publicados acima com sua build." : "Ainda não há uma referência validada para este slot. Os atributos publicados no armory aparecem acima."}</Typography>}
      <Typography variant="caption" component="p" color="text.secondary" sx={{ mt: 1.5 }}>{guide.source.sampleDate ? `Amostra ${modeLabel} KR de ${guide.source.sampleDate.split("-").reverse().join("/")}.` : `Amostra ${modeLabel} KR consultada em ${guide.source.checkedDate.split("-").reverse().join("/")}; a fonte não informa a data da coleta.`} O patch Global pode diferir. A referência não separa funções de tanque, cura e dano nem considera os limites dos seus atributos. <Link href={guide.source.url} target="_blank" rel="noopener noreferrer" underline="hover">Fonte: {guide.source.label}</Link>.</Typography>
    </Box>
  );
}
