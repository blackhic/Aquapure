import type { Metadata } from "next";
import ServicePage from "@/app/components/ServicePage";

export const metadata: Metadata = {
  title: "Installation Chauffe-Eau Nice | Dépannage Ballon Eau Chaude",
  description:
    "Expert chauffe-eau à Nice : installation électrique et thermodynamique, remplacement, entretien, dépannage. Conseils personnalisés et devis gratuit ☎ 04 84 35 04 86",
};

export default function ChauffeEauPage() {
  return (
    <ServicePage
      eyebrow="Chauffe-eau & ballon d'eau chaude"
      h1="Installation & dépannage chauffe-eau à Nice - Expert ballon d'eau chaude"
      subtitle="Expert chauffe-eau à Nice : installation électrique et thermodynamique, remplacement, entretien, dépannage. Conseils personnalisés et devis gratuit."
      introH2="Le ballon d'eau chaude est un équipement essentiel de votre logement."
      image="/photos/chauffe-eau.webp"
      imageAlt="Installation de chauffe-eau à Nice par un plombier AQUAPURE — électrique et thermodynamique"
      sections={[
        {
          h2: "Installation chauffe-eau électrique / thermodynamique",
          text: "Dimensionnement : 50L (1 pers.), 100L (couple), 200L (4 pers.), 300L (famille nombreuse) ; pose conforme.",
        },
        {
          h2: "Remplacement de votre chauffe-eau",
          text: "Vidange, démontage, évacuation ancien appareil, pose du nouveau ; grandes marques avec garanties, conservation heures creuses, formats compacts/horizontaux, souvent une demi-journée.",
        },
        {
          h2: "Entretien de votre ballon d'eau chaude",
          text: "Entretien annuel : groupe de sécurité, anode, thermostat, résistance, détartrage (enjeu calcaire à Nice).",
        },
        {
          h2: "Dépannage eau chaude 7j/7",
          text: "Diagnostic : résistance HS, thermostat défaillant, groupe bloqué, anode usée, fuite de cuve ; pièces courantes en véhicule.",
        },
      ]}
    />
  );
}
