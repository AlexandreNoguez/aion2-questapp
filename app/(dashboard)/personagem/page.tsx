import type { Metadata } from "next";
import { CharacterPage } from "@/domains/character/components/character-page";

export const metadata: Metadata = {
  title: "Personagem e equipamentos — AION 2 Companion",
  description: "Busque personagens do AION 2 Global e consulte perfil, equipamentos e atributos no armory oficial.",
};

export default function Page() {
  return <CharacterPage />;
}
