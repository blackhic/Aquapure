import type { Metadata } from "next";
import ServicePage from "@/app/components/ServicePage";

export const metadata: Metadata = {
  title: "Plomberie Générale Nice | Travaux & Raccordements | AQUAPURE",
  description:
    "Tous travaux de plomberie à Nice : création réseaux d'eau, pose cuisine, robinetterie, raccordements. Plombier professionnel qualifié. Devis gratuit ☎ 04 84 35 04 86",
};

export default function PlomberieGeneralePage() {
  return (
    <ServicePage
      eyebrow="Plomberie générale"
      h1="Plomberie Générale à Nice - Tous travaux de plomberie"
      subtitle="Tous travaux de plomberie à Nice : création réseaux d'eau, pose cuisine, robinetterie, raccordements. Plombier professionnel qualifié. Devis gratuit."
      introH2="Travaux de plomberie générale dans le 06 et le 83"
      introText="Respect des normes DTU, NF ; matériaux de qualité."
      image="/photos/plomberie-generale.webp"
      imageAlt="Plombier AQUAPURE installant un robinet de cuisine et raccordant les tuyaux à Nice"
      sections={[
        {
          h2: "Création ou modification de réseaux d'eau",
          text: "Construction neuve, extension, combles ; étude des plans, choix du diamètre des canalisations.",
        },
        {
          h2: "Pose de cuisine, évier, robinetterie",
          text: "Éviers inox/résine/céramique/granit, mitigeurs extractibles, raccordement lave-vaisselle, frigo américain, osmoseur, chauffe-eau instantané.",
        },
        {
          h2: "Raccordements divers",
          text: "Lave-linge/sèche-linge avec robinets aquastop, eau chaude collective, points d'eau conformes aux normes d'hygiène.",
        },
        {
          h2: "Expertise et conseil",
          text: "Analyse des contraintes (pression réseau, qualité de l'eau, calcaire, immeubles anciens) ; devis détaillé, disponibilité après intervention.",
        },
      ]}
    />
  );
}
