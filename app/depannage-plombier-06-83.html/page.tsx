import type { Metadata } from "next";
import ServicePage from "@/app/components/ServicePage";

export const metadata: Metadata = {
  title: "Dépannage Plomberie Urgence 24h/24 Nice (06) | AQUAPURE",
  description:
    "Plombier d'urgence à Nice et Alpes-Maritimes 24h/24, 7j/7. Fuite d'eau, canalisation bouchée, WC, chauffe-eau en panne. Intervention rapide garantie ☎ 04 84 35 04 86",
};

export default function DepannagePage() {
  return (
    <ServicePage
      eyebrow="Dépannage & urgences"
      h1="Dépannage plomberie urgence 24h/24 dans les Alpes-Maritimes et le Var"
      subtitle="Plombier d'urgence à Nice et Alpes-Maritimes 24h/24, 7j/7. Fuite d'eau, canalisation bouchée, WC, chauffe-eau en panne. Intervention rapide garantie."
      introH2="Intervention rapide en cas d'urgence"
      introText="Service 24h/24, 7j/7, jours fériés inclus sur Nice, tout le 06 et le Var (83)."
      image="/photos/depannage-urgence.webp"
      imageAlt="Plombier AQUAPURE réparant une fuite d'eau en urgence à Nice"
      sections={[
        {
          id: "fuite-d-eau",
          h2: "Fuites d'eau",
          text: "Intervention rapide pour identifier et réparer ; détecteurs acoustiques et caméras thermiques.",
        },
        {
          id: "recherche-de-fuite",
          h2: "Recherche de fuite",
          text: "Détection non destructive : détecteurs acoustiques électroniques, caméras thermiques, gaz traceur, électro-acoustique.",
          image: "/photos/recherche-de-fuite.webp",
          imageAlt:
            "Recherche de fuite non destructive à Nice avec détecteur acoustique et caméra thermique — AQUAPURE",
        },
        {
          id: "canalisation-bouchee",
          h2: "Canalisation bouchée",
          text: "Éviers, lavabos, douches, baignoires, cuisine, eaux pluviales, colonnes d'immeuble ; furet, hydrocurage haute pression, pompe à vide.",
        },
        {
          id: "wc-evier-douche-bouche",
          h2: "WC / évier / douche bouchés",
          text: "Ventouse pneumatique, furet électrique, pompe manuelle.",
        },
        {
          id: "chauffe-eau-en-panne",
          h2: "Chauffe-eau en panne",
          text: "Électrique, thermodynamique ou gaz ; réparation le jour même ou remplacement par modèle plus performant.",
        },
      ]}
    />
  );
}
