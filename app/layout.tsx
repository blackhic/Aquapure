import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plombier Nice (06) & Var (83) — Dépannage 24h/24 | AQUAPURE",
  description:
    "Plombier à Nice et dans le 06/83. Intervention d'urgence 24h/24 et 7j/7, rénovation de salle de bain, chauffe-eau. Artisan certifié, 15 ans d'expérience, devis gratuit. ☎ 04 84 35 04 86",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
