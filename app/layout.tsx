import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/app/components/ChatWidget";

const SITE_URL = "https://aquapureplomberie.fr";

// Anti-duplicate-content : noindex tant que servi sur vercel.app.
// Go-live : NEXT_PUBLIC_ALLOW_INDEXING=true (voir docs/go-live.md).
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: allowIndexing ? undefined : { index: false, follow: false },
  title: "Plombier Nice (06) & Var (83) | AQUAPURE Plomberie 24h/24",
  description:
    "Plombier à Nice et dans le 06 & 83. Dépannage urgent 24h/24, installation salle de bain, chauffe-eau. Artisan qualifié, 15 ans d'expérience. Devis gratuit ☎ 04 84 35 04 86",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "AQUAPURE Plomberie",
    url: SITE_URL,
    title: "Plombier Nice (06) & Var (83) | AQUAPURE Plomberie 24h/24",
    description:
      "Plombier à Nice et dans le 06 & 83. Dépannage urgent 24h/24, installation salle de bain, chauffe-eau. Artisan qualifié, 15 ans d'expérience. Devis gratuit ☎ 04 84 35 04 86",
    images: [
      {
        url: "/photos/hero-plombier-nice.webp",
        width: 1024,
        height: 1024,
        alt: "AQUAPURE Plomberie — plombier à Nice et dans le 06",
      },
    ],
  },
};

// JSON-LD LocalBusiness (Plumber) — données réelles du business.
// NB : coordonnées geo approximatives (niveau ville, Nice) — à affiner au géocodage exact.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: "AQUAPURE Plomberie",
  founder: { "@type": "Person", name: "Mehdi Van Ardenne" },
  url: SITE_URL,
  image: `${SITE_URL}/photos/hero-plombier-nice.webp`,
  telephone: "+33484350486",
  email: "contact@aquapureplomberie.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "29 Boulevard Victor Hugo",
    addressLocality: "Nice",
    postalCode: "06000",
    addressRegion: "Alpes-Maritimes",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.7009,
    longitude: 7.2683,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Alpes-Maritimes (06)" },
    { "@type": "AdministrativeArea", name: "Var (83)" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "29",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
