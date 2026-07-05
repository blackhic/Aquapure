"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HOME_LINK,
  SERVICE_LINKS,
  CONTACT_LINK,
} from "./navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const isServiceActive = SERVICE_LINKS.some((l) => l.href === pathname);

  // Menu burger (mobile / tablette)
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(isServiceActive);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // La fermeture à la navigation est gérée par `closeMenu` sur chaque lien
  // du panneau (voir onClick plus bas).

  // Ouvert : verrouille le scroll, gère Échap, déplace le focus dans le panneau.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    // Rend le focus au bouton burger (accessibilité clavier).
    burgerRef.current?.focus();
  }

  return (
    <>
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-12z" />
            </svg>
          </div>
          <div>
            <span className="logo-name">AQUAPURE Plomberie</span>
            <span className="logo-tagline">
              Nice · Alpes-Maritimes (06) · Est du Var (83)
            </span>
          </div>
        </Link>

        <div className="nav-menu">
          <Link
            href={HOME_LINK.href}
            className={pathname === HOME_LINK.href ? "active" : undefined}
          >
            {HOME_LINK.label}
          </Link>

          <div className={`nav-dropdown${isServiceActive ? " active" : ""}`}>
            <button type="button" className="nav-dropdown-trigger">
              Les services proposés
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <div className="nav-dropdown-panel">
              {SERVICE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? "active" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={CONTACT_LINK.href}
            className={pathname === CONTACT_LINK.href ? "active" : undefined}
          >
            {CONTACT_LINK.label}
          </Link>
        </div>

        <div className="nav-actions">
          <div className="nav-badge">
            <span className="pulse-dot"></span>
            Disponible 24h/24
          </div>
          <Link href="/devis" className="btn-devis">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm0 12H4V8.82l8 5 8-5V18z" />
            </svg>
            Devis gratuit
          </Link>
          <a href="tel:0484350486" className="btn-phone">
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            04 84 35 04 86
          </a>

          <button
            type="button"
            className="nav-burger"
            ref={burgerRef}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    {/* ── Menu mobile (drawer) — hors du <nav> pour ne pas hériter du
        contexte d'empilement de la navbar (z-index:200) et passer
        au-dessus de la sticky-bar et de la bulle chat. ── */}
      <div
        className={`nav-drawer-backdrop${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      <div
        id="mobile-drawer"
        className={`nav-drawer${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="nav-drawer-head">
          <span className="nav-drawer-title">Menu</span>
          <button
            type="button"
            className="nav-drawer-close"
            ref={closeRef}
            aria-label="Fermer le menu"
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
            </svg>
          </button>
        </div>

        <nav className="nav-drawer-links" aria-label="Navigation principale">
          <Link
            href={HOME_LINK.href}
            className={`nav-drawer-link${
              pathname === HOME_LINK.href ? " active" : ""
            }`}
            onClick={closeMenu}
          >
            {HOME_LINK.label}
          </Link>

          <button
            type="button"
            className={`nav-drawer-sub-trigger${servicesOpen ? " open" : ""}`}
            aria-expanded={servicesOpen}
            aria-controls="drawer-services"
            onClick={() => setServicesOpen((o) => !o)}
          >
            Les services proposés
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          <div
            id="drawer-services"
            className={`nav-drawer-sub${servicesOpen ? " open" : ""}`}
          >
            {/* Wrapper unique : requis pour l'animation grid 0fr↔1fr.
                inert quand replié → liens hors tabulation clavier. */}
            <div className="nav-drawer-sub-inner" inert={!servicesOpen}>
              {SERVICE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-drawer-sublink${
                    pathname === link.href ? " active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={CONTACT_LINK.href}
            className={`nav-drawer-link${
              pathname === CONTACT_LINK.href ? " active" : ""
            }`}
            onClick={closeMenu}
          >
            {CONTACT_LINK.label}
          </Link>
        </nav>

        <div className="nav-drawer-cta">
          <a href="tel:0484350486" className="btn-phone" onClick={closeMenu}>
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            04 84 35 04 86
          </a>
          <Link href="/devis" className="btn-devis" onClick={closeMenu}>
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm0 12H4V8.82l8 5 8-5V18z" />
            </svg>
            Devis gratuit
          </Link>
        </div>
      </div>
    </>
  );
}
