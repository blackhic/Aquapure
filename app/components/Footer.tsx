import Link from "next/link";
import { ALL_LINKS } from "./navLinks";

// Villes desservies — Var (83) mis en avant (Mehdi basé côté Var), puis 06.
// Slugs prêts pour de futures landing pages /plombier-[slug] (étape 7i).
// Rendus en <span> non cliquables pour l'instant : aucune de ces pages
// n'existe encore, donc aucun lien mort ni 404. L'étape 7i remplacera ces
// <span> par des <Link href={`/plombier-${slug}`}>.
const FOOTER_CITIES = [
  // Var (83)
  { name: "Fréjus", slug: "frejus" },
  { name: "Saint-Raphaël", slug: "saint-raphael" },
  { name: "Draguignan", slug: "draguignan" },
  { name: "Le Muy", slug: "le-muy" },
  { name: "Roquebrune-sur-Argens", slug: "roquebrune-sur-argens" },
  // Alpes-Maritimes (06)
  { name: "Nice", slug: "nice" },
  { name: "Cannes", slug: "cannes" },
  { name: "Antibes", slug: "antibes" },
  { name: "Grasse", slug: "grasse" },
  { name: "Cagnes-sur-Mer", slug: "cagnes-sur-mer" },
];

// Documentation légale (maillage bas de page).
const LEGAL_LINKS = [
  { href: "/mentionslegales.html", label: "Mentions légales" },
  {
    href: "/politique-de-confidentialite.html",
    label: "Politique de confidentialité",
  },
  { href: "/politique-de-cookies.html", label: "Politique de cookies" },
  { href: "/cgu.html", label: "CGU" },
  { href: "/cgv.html", label: "CGV" },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <nav className="footer-nav">
          {ALL_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-cities">
          <div className="footer-cities-title">
            Plombier dans le Var (83) &amp; les Alpes-Maritimes (06)
          </div>
          <div className="footer-cities-list">
            {FOOTER_CITIES.map((city) => (
              <span
                key={city.slug}
                className="footer-city"
                data-slug={city.slug}
              >
                {city.name}
              </span>
            ))}
          </div>
        </div>

        <strong style={{ color: "rgba(255,255,255,0.7)" }}>
          AQUAPURE Plomberie
        </strong>
        <br />
        29 Boulevard Victor Hugo, 06000 Nice
        <br />
        Côte d&apos;Azur · Alpes-Maritimes (06) · Var (83) · 7j/7 · 24h/24
        <br />
        Artisan certifié · Garantie décennale · 15 ans d&apos;expérience
        <br />
        <a href="tel:0484350486">04 84 35 04 86</a> ·{" "}
        <a href="mailto:contact@aquapureplomberie.fr">
          contact@aquapureplomberie.fr
        </a>

        <nav className="footer-legal" aria-label="Informations légales">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
