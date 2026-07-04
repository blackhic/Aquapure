import type { MetadataRoute } from "next";

const BASE = "https://aquapureplomberie.fr";

// Garde-fou anti-duplicate-content : tant que le site est servi sur vercel.app
// (l'ancien site aquapureplomberie.fr est encore en ligne), on bloque toute
// indexation. Au go-live : NEXT_PUBLIC_ALLOW_INDEXING=true (voir docs/go-live.md).
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    // Blocage total de l'indexation.
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
