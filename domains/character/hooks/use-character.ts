"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { favoriteSchema } from "../contracts";
import type { CharacterFavorite, CharacterIdentity, CharacterProfile, CharacterSearch, CharacterServer, Region } from "../types";

const STORAGE_KEY = "aion2-character:v1";
type SearchQuery = { region: Region; name: string; serverId: string };

async function request<T>(path: string, params: Record<string, string>, signal: AbortSignal): Promise<T> {
  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(`${path}?${new URLSearchParams(params)}`, { signal, cache: "no-store" });
    payload = await response.json();
  } catch {
    throw new Error("Não foi possível conectar ao Companion. Confira sua conexão e tente novamente.");
  }
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string" ? payload.error : "Não foi possível consultar o personagem.";
    throw new Error(message);
  }
  return payload as T;
}

export function sameCharacter(a: CharacterIdentity | null, b: CharacterIdentity | null): boolean {
  return !!a && !!b && a.region === b.region && a.serverId === b.serverId && a.characterId === b.characterId;
}

export function useCharacter() {
  const [region, setRegion] = useState<Region>("la");
  const [serverId, setServerId] = useState("2403");
  const [name, setName] = useState("Hadamiri");
  const [servers, setServers] = useState<CharacterServer[]>([]);
  const [serversLoading, setServersLoading] = useState(true);
  const [serversError, setServersError] = useState<string | null>(null);
  const [serversAttempt, setServersAttempt] = useState(0);
  const [search, setSearch] = useState<CharacterSearch | null>(null);
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CharacterProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState<CharacterFavorite | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const searchController = useRef<AbortController | null>(null);
  const profileController = useRef<AbortController | null>(null);
  const selectedCharacter = useRef<CharacterIdentity | null>(null);

  const openCharacter = useCallback(async (identity: CharacterIdentity) => {
    profileController.current?.abort();
    const controller = new AbortController();
    profileController.current = controller;
    selectedCharacter.current = identity;
    setProfile((current) => sameCharacter(current, identity) ? current : null);
    setProfileError(null);
    setProfileLoading(true);
    try {
      const result = await request<CharacterProfile>("/api/characters/profile", {
        region: identity.region, serverId: String(identity.serverId), characterId: identity.characterId,
      }, controller.signal);
      if (!controller.signal.aborted) setProfile(result);
    } catch (error) {
      if (!controller.signal.aborted) setProfileError(error instanceof Error ? error.message : "Não foi possível carregar os equipamentos.");
    } finally {
      if (!controller.signal.aborted) setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = favoriteSchema.safeParse(JSON.parse(stored));
        if (!parsed.success) return;
        setFavorite(parsed.data);
        setRegion(parsed.data.region);
        setServerId(String(parsed.data.serverId));
        setName(parsed.data.name);
        void openCharacter(parsed.data);
      } catch {
        // Storage is optional; character searches still work without it.
      }
    }, 0);
    return () => {
      window.clearTimeout(hydration);
      searchController.current?.abort();
      profileController.current?.abort();
    };
  }, [openCharacter]);

  useEffect(() => {
    const controller = new AbortController();
    const start = window.setTimeout(async () => {
      setServersLoading(true);
      setServersError(null);
      setServers([]);
      try {
        const result = await request<CharacterServer[]>("/api/characters/servers", { region }, controller.signal);
        if (!controller.signal.aborted) setServers(result);
      } catch (error) {
        if (!controller.signal.aborted) setServersError(error instanceof Error ? error.message : "Não foi possível carregar os servidores.");
      } finally {
        if (!controller.signal.aborted) setServersLoading(false);
      }
    }, 0);
    return () => { window.clearTimeout(start); controller.abort(); };
  }, [region, serversAttempt]);

  async function runSearch(query: SearchQuery, page: number) {
    searchController.current?.abort();
    profileController.current?.abort();
    selectedCharacter.current = null;
    const controller = new AbortController();
    searchController.current = controller;
    setSearchLoading(true);
    setSearchError(null);
    setSearch(null);
    setProfile(null);
    setProfileLoading(false);
    setProfileError(null);
    setSearchQuery(query);
    try {
      const result = await request<CharacterSearch>("/api/characters/search", {
        region: query.region, name: query.name.trim(), page: String(page), ...(query.serverId ? { serverId: query.serverId } : {}),
      }, controller.signal);
      if (!controller.signal.aborted) setSearch(result);
    } catch (error) {
      if (!controller.signal.aborted) setSearchError(error instanceof Error ? error.message : "Não foi possível buscar o personagem.");
    } finally {
      if (!controller.signal.aborted) setSearchLoading(false);
    }
  }

  function toggleFavorite() {
    if (!profile) return;
    const next: CharacterFavorite | null = sameCharacter(profile, favorite) ? null : {
      region: profile.region, serverId: profile.serverId, characterId: profile.characterId,
      name: profile.name, serverName: profile.serverName,
    };
    setFavorite(next);
    setStorageError(null);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageError("O navegador não permitiu salvar a preferência. Ela valerá apenas nesta visita.");
    }
  }

  return {
    region, serverId, name, servers, serversLoading, serversError, search, searchLoading, searchError,
    profile, profileLoading, profileError, favorite, storageError,
    isFavorite: sameCharacter(profile, favorite),
    setName, setServerId, toggleFavorite, openCharacter,
    changeRegion: (value: Region) => {
      searchController.current?.abort();
      profileController.current?.abort();
      selectedCharacter.current = null;
      setSearch(null);
      setSearchQuery(null);
      setSearchLoading(false);
      setSearchError(null);
      setProfile(null);
      setProfileLoading(false);
      setProfileError(null);
      setRegion(value);
      setServerId("");
      setServers([]);
      setServersLoading(true);
    },
    retryServers: () => setServersAttempt((current) => current + 1),
    submitSearch: () => runSearch({ region, name, serverId }, 1),
    changePage: (page: number) => { if (searchQuery) void runSearch(searchQuery, page); },
    retrySearch: () => { if (searchQuery) void runSearch(searchQuery, 1); },
    refreshProfile: () => { if (selectedCharacter.current) void openCharacter(selectedCharacter.current); },
  };
}
