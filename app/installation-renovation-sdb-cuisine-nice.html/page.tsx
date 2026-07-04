import ServicePage from "@/app/components/ServicePage";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Rénovation Salle de Bain & Cuisine Nice | AQUAPURE Plomberie",
  description:
    "Création et rénovation complète salle de bain à Nice. Pose douche italienne, baignoire, WC suspendu, carrelage, adaptation PMR. Artisan plombier expert ☎ 04 84 35 04 86",
  path: "/installation-renovation-sdb-cuisine-nice.html",
  image: "/photos/renovation-salle-de-bain.webp",
  imageAlt:
    "Rénovation de salle de bain à Nice avec douche italienne — AQUAPURE Plomberie",
});

export default function RenovationPage() {
  return (
    <ServicePage
      eyebrow="Installation & rénovation"
      h1="Installation & rénovation de salles de bain et cuisines à Nice - Plombier expert"
      subtitle="Création et rénovation complète salle de bain à Nice. Pose douche italienne, baignoire, WC suspendu, carrelage, adaptation PMR. Artisan plombier expert."
      introH2="Créer une nouvelle salle d'eau, moderniser vos installations sanitaires"
      image="/photos/renovation-salle-de-bain.webp"
      imageAlt="Rénovation complète de salle de bain à Nice avec douche italienne — AQUAPURE Plomberie"
      sections={[
        {
          h2: "Création ou rénovation complète",
          text: "Prise en charge intégrale : démolition, arrivées/évacuations d'eau, installation électrique, carrelage, sanitaires, robinetterie et meubles.",
        },
        {
          h2: "Pose de douche, baignoire, WC suspendu",
          text: "Douche italienne (étanchéité irréprochable), baignoires îlot ou d'angle avec balnéothérapie, WC suspendu sur bâti-support.",
        },
        {
          h2: "Robinetterie, meubles, carrelage",
          text: "Mitigeurs, thermostatiques, colonnes de douche, finitions design/noires ; meubles suspendus, doubles vasques ; choix du carrelage.",
        },
        {
          h2: "Adaptation PMR",
          text: "Remplacement baignoire par douche de plain-pied, barres d'appui, sièges muraux, sanitaires ajustés ; aides financières + accompagnement dossier.",
        },
      ]}
    />
  );
}
