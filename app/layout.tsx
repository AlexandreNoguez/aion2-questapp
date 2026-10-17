import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AION 2 Companion — Checklist e guias",
  description:
    "Organize atividades e consulte horários dos conteúdos do AION 2 Global.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
