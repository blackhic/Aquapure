import Link from "next/link";
import { ALL_LINKS } from "./navLinks";

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
        <strong style={{ color: "rgba(255,255,255,0.7)" }}>
          AQUAPURE Plomberie
        </strong>
        <br />
        29 Boulevard Victor Hugo, 06000 Nice
        <br />
        Alpes-Maritimes (06) · Est du Var (83) · 7j/7 · 24h/24
        <br />
        Artisan certifié · Garantie décennale · 15 ans d&apos;expérience
        <br />
        <a href="tel:0484350486">04 84 35 04 86</a> ·{" "}
        <a href="mailto:contact@aquapureplomberie.fr">
          contact@aquapureplomberie.fr
        </a>
        <br />
        <Link href="/mentionslegales.html">Mentions légales &amp; RGPD</Link>
      </div>
    </footer>
  );
}
