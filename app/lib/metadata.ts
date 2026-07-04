import type { Metadata } from "next";

const SITE_URL = "https://aquapureplomberie.fr";

// Construit les métadonnées d'une page (title, description, canonical, Open Graph).
// Open Graph défini explicitement par page car Next n'hérite pas en profondeur
// l'objet openGraph du layout.
export function pageMetadata({
  title,
  description,
  path,
  image = "/photos/hero-plombier-nice.webp",
  imageAlt = "AQUAPURE Plomberie — plombier à Nice et dans le 06",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "AQUAPURE Plomberie",
      url: `${SITE_URL}${path}`,
      title,
      description,
      images: [{ url: image, width: 900, height: 900, alt: imageAlt }],
    },
  };
}
