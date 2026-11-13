"use client";

import { useState } from "react";
import { Avatar, Box, Button, Chip, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ExternalLink, RefreshCw, Shield, Star } from "lucide-react";
import { REGIONS } from "../data/regions";
import type { CharacterProfile as Profile, EquipmentGroup, EquipmentItem } from "../types";

const GROUPS: { id: EquipmentGroup; label: string }[] = [
  { id: "weapons", label: "Armas" }, { id: "armor", label: "Armaduras" },
  { id: "accessories", label: "Acessórios" }, { id: "arcana", label: "Arcanas" },
];
const GRADES: Record<string, { label: string; color: string }> = {
  Common: { label: "Comum", color: "#b4c2ca" }, Rare: { label: "Raro", color: "#6aafff" },
  Legend: { label: "Lendário", color: "#d094ff" }, Unique: { label: "Único", color: "#f5c45e" },
  Epic: { label: "Épico", color: "#f89565" }, Special: { label: "Especial", color: "#4bd6d0" },
};
const numberFormat = new Intl.NumberFormat("pt-BR");

function ItemCard({ item }: { item: EquipmentItem }) {
  const grade = GRADES[item.grade] ?? { label: item.grade, color: "#96aebe" };
  return (
    <Paper component="li" variant="outlined" sx={{ listStyle: "none", p: 2, bgcolor: "rgba(13,27,39,.72)", borderLeft: `3px solid ${grade.color}`, minWidth: 0 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar variant="rounded" src={item.icon ?? undefined} alt="" imgProps={{ loading: "lazy", referrerPolicy: "no-referrer" }} sx={{ width: 54, height: 54, bgcolor: "rgba(149,183,203,.06)", border: "1px solid", borderColor: "divider" }}><Shield size={24} /></Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary">{item.slotName}</Typography>
          <Typography sx={{ fontWeight: 800, color: grade.color, overflowWrap: "anywhere", lineHeight: 1.4 }}>{item.name}</Typography>
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: .5 }}>
            <Typography variant="caption" sx={{ color: grade.color }}>{grade.label}</Typography>
            <Typography variant="caption" fontWeight={800}>+{item.enchantLevel}</Typography>
            {item.exceedLevel > 0 && <Typography variant="caption" color="text.secondary">Transcendência +{item.exceedLevel}</Typography>}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

type Props = { profile: Profile; loading: boolean; isFavorite: boolean; onFavorite: () => void; onRefresh: () => void };

export function CharacterProfile({ profile, loading, isFavorite, onFavorite, onRefresh }: Props) {
  const [tab, setTab] = useState("equipment");
  const officialUrl = `https://aion2.plaync.com/en-us/characters/${profile.serverId}/${encodeURIComponent(profile.characterId)}?region=${profile.region}`;
  const region = REGIONS.find((entry) => entry.id === profile.region)?.label;
  return (
    <Box component="section" aria-labelledby="character-name" sx={{ mt: 3 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3.5 }, background: "linear-gradient(120deg, rgba(75,214,208,.09), rgba(13,27,39,.9) 60%)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Avatar src={profile.image ?? undefined} alt={`Retrato de ${profile.name}`} imgProps={{ referrerPolicy: "no-referrer" }} sx={{ width: 96, height: 96, bgcolor: "rgba(75,214,208,.08)", border: "2px solid rgba(75,214,208,.3)" }}><Shield size={40} /></Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" color="primary.main" fontWeight={800}>{profile.className} · Nível {profile.level}</Typography>
            <Typography id="character-name" component="h2" variant="h4" fontWeight={900} sx={{ overflowWrap: "anywhere" }}>{profile.name}</Typography>
            {profile.title && <Typography color="secondary.main" variant="body2" sx={{ mt: .5 }}>{profile.title}</Typography>}
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>{profile.serverName} · {region} · {profile.faction}</Typography>
          </Box>
          <Stack spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button variant={isFavorite ? "contained" : "outlined"} startIcon={<Star size={17} fill={isFavorite ? "currentColor" : "none"} />} onClick={onFavorite} aria-pressed={isFavorite}>{isFavorite ? "Personagem favorito" : "Salvar como favorito"}</Button>
            <Button startIcon={<RefreshCw size={16} />} onClick={onRefresh} disabled={loading}>{loading ? "Consultando…" : "Atualizar equipamentos"}</Button>
          </Stack>
        </Stack>
        <Stack direction="row" gap={1.25} flexWrap="wrap" sx={{ mt: 3 }}>
          <Chip variant="outlined" label={`Poder de combate: ${profile.combatPower === null ? "não informado" : numberFormat.format(profile.combatPower)}`} />
          <Chip variant="outlined" label={`Item level: ${profile.itemLevel === null ? "não informado" : numberFormat.format(profile.itemLevel)}`} />
          <Chip variant="outlined" label={`${profile.equipment.length} equipamentos`} />
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} gap={1} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">Consultado em {new Date(profile.fetchedAt).toLocaleString("pt-BR")} · Cache de até 5 minutos.</Typography>
          <Button component="a" href={officialUrl} target="_blank" rel="noopener noreferrer" endIcon={<ExternalLink size={14} />} size="small">Ver no armory oficial</Button>
        </Stack>
      </Paper>

      <Tabs value={tab} onChange={(_, value: string) => setTab(value)} aria-label="Informações do personagem" sx={{ mt: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab id="character-equipment-tab" aria-controls="character-equipment-panel" value="equipment" label="Equipamentos" />
        <Tab id="character-stats-tab" aria-controls="character-stats-panel" value="stats" label="Atributos" />
      </Tabs>
      {tab === "equipment" && <Box role="tabpanel" id="character-equipment-panel" aria-labelledby="character-equipment-tab" sx={{ mt: 3 }}>
        <Typography color="text.secondary" variant="body2">Equipamentos publicados no armory. Nomes no idioma da fonte; os dados podem levar um tempo para refletir alterações no jogo.</Typography>
        {profile.equipment.length === 0 && <Paper variant="outlined" sx={{ p: 3, mt: 2 }}><Typography color="text.secondary">O armory não informou equipamentos para este personagem.</Typography></Paper>}
        {GROUPS.map((group) => {
          const items = profile.equipment.filter((item) => item.group === group.id);
          if (!items.length) return null;
          return <Box component="section" key={group.id} aria-labelledby={`gear-${group.id}`} sx={{ mt: 3 }}>
            <Typography id={`gear-${group.id}`} component="h3" variant="h6" fontWeight={850}>{group.label} <Box component="span" sx={{ color: "text.secondary", fontWeight: 500, fontSize: 14 }}>· {items.length}</Box></Typography>
            <Box component="ul" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 1.5, p: 0, mt: 1.5 }}>{items.map((item) => <ItemCard key={item.slot} item={item} />)}</Box>
          </Box>;
        })}
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2 }}>Esta versão mostra raridade e melhorias dos itens. Atributos individuais e avaliações de gear ainda não estão disponíveis.</Typography>
      </Box>}
      {tab === "stats" && <Box role="tabpanel" id="character-stats-panel" aria-labelledby="character-stats-tab" sx={{ mt: 3 }}>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>Atributos do personagem informados pelo armory, com os respectivos bônus.</Typography>
        {profile.stats.length === 0 && <Typography color="text.secondary">O armory não informou atributos para este personagem.</Typography>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 1.5 }}>
          {profile.stats.map((stat) => <Paper variant="outlined" key={stat.type} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" gap={1}><Typography fontWeight={800}>{stat.name}</Typography><Typography color="primary.main" fontWeight={900}>{numberFormat.format(stat.value)}</Typography></Stack>
            {stat.bonuses.map((bonus) => <Typography key={bonus} variant="body2" color="text.secondary" sx={{ mt: .75 }}>{bonus}</Typography>)}
          </Paper>)}
        </Box>
      </Box>}
    </Box>
  );
}
