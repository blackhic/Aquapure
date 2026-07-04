import type { MetadataRoute } from "next";

// Domaine FINAL (celui qu'on indexera au go-live), pas l'URL vercel.app.
const BASE = "https://aquapureplomberie.fr";

// Date de dernière modification (fixe pour rester déterministe entre builds).
const LAST_MODIFIED = "2026-07-04";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/depannage-plombier-06-83.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/installation-renovation-sdb-cuisine-nice.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/installation-depannage-chauffe-eau-a-nice.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/plomberie-generale-a-nice.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/contacter-aquapure-plomberie.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/mentionslegales.html`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
