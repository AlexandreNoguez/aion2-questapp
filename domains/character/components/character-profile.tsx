"use client";

import { useState } from "react";
import { Avatar, Box, Button, Chip, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ExternalLink, RefreshCw, Shield, Star } from "lucide-react";
import { REGIONS } from "../data/regions";
import type { CharacterProfile as Profile } from "../types";
import { EquipmentGallery } from "./equipment-gallery";
const numberFormat = new Intl.NumberFormat("pt-BR");

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
      <Box role="tabpanel" id="character-equipment-panel" aria-labelledby="character-equipment-tab" hidden={tab !== "equipment"} sx={{ mt: 3 }}>
        <EquipmentGallery profile={profile} />
      </Box>
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
