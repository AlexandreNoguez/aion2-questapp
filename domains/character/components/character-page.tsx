"use client";

import { Alert, Avatar, Box, Button, CircularProgress, Container, MenuItem, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { ArrowRight, Search, Shield, Star } from "lucide-react";
import { REGIONS } from "../data/regions";
import { useCharacter } from "../hooks/use-character";
import type { Region } from "../types";
import { CharacterProfile } from "./character-profile";

export function CharacterPage() {
  const model = useCharacter();
  const serverOptions = model.servers.some((server) => String(server.id) === model.serverId);
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="overline" color="secondary.main" fontWeight={850} sx={{ letterSpacing: ".13em" }}>Armory · AION 2 Global</Typography>
      <Typography component="h1" sx={{ mt: .5, fontSize: { xs: "2.15rem", md: "3.2rem" }, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.04em" }}>Seu personagem.<br /><Box component="span" color="primary.main">Cada equipamento.</Box></Typography>
      <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 690, lineHeight: 1.7 }}>Busque um personagem e confira seu perfil, equipamentos e atributos com os dados do armory da NCSOFT.</Typography>

      <Paper component="form" onSubmit={(event) => { event.preventDefault(); void model.submitSearch(); }} variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1.15fr 1fr 1.3fr auto" }, gap: 2, alignItems: "start" }}>
          <TextField select fullWidth label="Região" value={model.region} onChange={(event) => model.changeRegion(event.target.value as Region)}>{REGIONS.map((region) => <MenuItem key={region.id} value={region.id}>{region.label}</MenuItem>)}</TextField>
          <TextField select fullWidth label="Servidor" value={model.serverId} disabled={model.serversLoading || !!model.serversError} helperText={model.serversLoading ? "Carregando servidores…" : "Opcional: busque em toda a região."} onChange={(event) => model.setServerId(event.target.value)}>
            <MenuItem value="">Todos os servidores</MenuItem>
            {model.serverId && !serverOptions && <MenuItem value={model.serverId}>{model.serverId === "2403" ? "Triniel" : `Servidor ${model.serverId}`}</MenuItem>}
            {model.servers.map((server) => <MenuItem key={server.id} value={String(server.id)}>{server.name} · {server.faction}</MenuItem>)}
          </TextField>
          <TextField fullWidth required label="Nome do personagem" value={model.name} onChange={(event) => model.setName(event.target.value)} placeholder="Ex.: Hadamiri" slotProps={{ htmlInput: { minLength: 2, maxLength: 32 } }} autoComplete="off" />
          <Button type="submit" variant="contained" disabled={model.searchLoading || model.name.trim().length < 2} startIcon={model.searchLoading ? <CircularProgress size={17} color="inherit" /> : <Search size={18} />} sx={{ minHeight: 56 }}>{model.searchLoading ? "Buscando…" : "Buscar personagem"}</Button>
        </Box>
        {model.serversError && <Alert severity="warning" sx={{ mt: 1 }} action={<Button color="inherit" size="small" onClick={model.retryServers}>Tentar novamente</Button>}>{model.serversError} Você ainda pode buscar pelo nome.</Alert>}
      </Paper>

      {model.favorite && <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: 2 }}>
        <Star size={15} color="#f5c45e" /><Typography variant="body2" color="text.secondary">Favorito neste navegador:</Typography>
        <Button size="small" onClick={() => void model.openCharacter(model.favorite!)} disabled={model.profileLoading || model.searchLoading}>{model.favorite.name} · {model.favorite.serverName} · {REGIONS.find((region) => region.id === model.favorite?.region)?.label}</Button>
      </Stack>}
      {model.storageError && <Alert severity="warning" sx={{ mt: 2 }}>{model.storageError}</Alert>}
      {model.searchError && <Alert severity="error" sx={{ mt: 2 }} action={<Button color="inherit" size="small" onClick={model.retrySearch}>Tentar novamente</Button>}>{model.searchError}</Alert>}
      {model.profileError && <Alert severity="error" sx={{ mt: 2 }} action={<Button color="inherit" size="small" onClick={model.refreshProfile}>Tentar novamente</Button>}>{model.profileError}</Alert>}

      {model.searchLoading && <Box role="status" aria-label="Buscando personagens" sx={{ mt: 3 }}><Skeleton variant="rounded" height={96} /><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Buscando personagens no armory…</Typography></Box>}
      {model.search && <Box component="section" aria-labelledby="character-results" sx={{ mt: 3 }}>
        <Typography id="character-results" component="h2" variant="h6" fontWeight={850}>Resultados da busca</Typography>
        {model.search.characters.length === 0 ? <Paper variant="outlined" sx={{ p: 3, mt: 1.5 }}>
          <Typography fontWeight={800}>Nenhum personagem encontrado nesta página.</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: .75 }}>Confira o nome, a região e o servidor. Se houver outras páginas, você também pode consultá-las.</Typography>
        </Paper> : <Stack gap={1.25} sx={{ mt: 1.5 }}>{model.search.characters.map((character) => <Button key={`${character.serverId}:${character.characterId}`} variant="outlined" onClick={() => void model.openCharacter(character)} disabled={model.profileLoading} sx={{ p: 2, borderColor: "divider", justifyContent: "flex-start", textAlign: "left", color: "text.primary" }}>
          <Avatar src={character.image ?? undefined} alt="" imgProps={{ loading: "lazy", referrerPolicy: "no-referrer" }} sx={{ mr: 2, bgcolor: "rgba(75,214,208,.08)" }}><Shield size={20} /></Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={850} sx={{ overflowWrap: "anywhere" }}>{character.name}</Typography><Typography variant="body2" color="text.secondary">{character.serverName} · Nível {character.level} · {character.faction}</Typography></Box>
          <ArrowRight size={18} />
        </Button>)}</Stack>}
        {model.search.pages > 1 && <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Button disabled={model.search.page <= 1 || model.profileLoading} onClick={() => model.changePage(model.search!.page - 1)}>Anterior</Button>
          <Typography variant="body2" color="text.secondary">{model.search.page} / {model.search.pages}</Typography>
          <Button disabled={model.search.page >= model.search.pages || model.profileLoading} onClick={() => model.changePage(model.search!.page + 1)}>Próxima</Button>
        </Stack>}
      </Box>}

      {model.profileLoading && <Box role="status" aria-label="Carregando equipamentos" sx={{ mt: 3 }}><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Consultando perfil e equipamentos…</Typography><Skeleton variant="rounded" height={180} /></Box>}
      {model.profile && <CharacterProfile key={`${model.profile.region}:${model.profile.serverId}:${model.profile.characterId}`} profile={model.profile} loading={model.profileLoading} isFavorite={model.isFavorite} onFavorite={model.toggleFavorite} onRefresh={model.refreshProfile} />}
      {!model.profile && !model.profileLoading && !model.search && !model.searchLoading && !model.searchError && !model.profileError && <Paper variant="outlined" sx={{ mt: 3, p: { xs: 3, md: 5 }, textAlign: "center", borderStyle: "dashed", bgcolor: "transparent" }}>
        <Shield size={36} color="#4bd6d0" aria-hidden="true" /><Typography component="h2" variant="h6" fontWeight={850} sx={{ mt: 1.5 }}>Encontre seu personagem</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Busque pelo nome, selecione o resultado e explore os equipamentos. Salve um favorito para abri-lo automaticamente nas próximas visitas.</Typography>
      </Paper>}
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 4 }}>Fonte: armory oficial da NCSOFT. Este Companion é um projeto independente, sem afiliação com a NCSOFT. Não é necessário informar senha nem instalar addon.</Typography>
    </Container>
  );
}
