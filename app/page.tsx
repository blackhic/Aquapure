"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";

const FAQ_ITEMS = [
  {
    q: "Êtes-vous disponibles la nuit et le week-end ?",
    a: "Oui, nous intervenons 24h/24 et 7j/7 dans tout le 06 pour les urgences, y compris les jours fériés.",
  },
  {
    q: "Le devis est-il vraiment gratuit ?",
    a: "Oui, chaque devis est gratuit, détaillé et sans engagement. Aucune surprise sur la facture finale.",
  },
  {
    q: "Quels sont vos délais d'intervention à Nice ?",
    a: "Pour une urgence à Nice, nous nous efforçons d'intervenir dans l'heure. En dehors de la ville, comptez 1h30 selon le secteur.",
  },
  {
    q: "Êtes-vous assurés et couverts ?",
    a: "Oui, tous nos travaux sont couverts par notre assurance décennale. Vous êtes protégés pendant 10 ans après l'intervention.",
  },
  {
    q: "Intervenez-vous pour les syndics et AirBnB ?",
    a: "Absolument. Nous travaillons avec des particuliers, des professionnels, des syndics et des propriétaires de locations saisonnières.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Appel",
    text: "Vous nous appelez, on cerne votre besoin et on vous oriente immédiatement.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
      </svg>
    ),
  },
  {
    title: "Diagnostic sur place",
    text: "Un plombier se déplace et identifie précisément l'origine du problème.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
      </svg>
    ),
  },
  {
    title: "Devis gratuit",
    text: "Un devis clair et détaillé, sans engagement, avant toute intervention.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
      </svg>
    ),
  },
  {
    title: "Intervention",
    text: "On réalise les travaux proprement, avec du matériel de qualité.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    title: "Garantie décennale",
    text: "Vos travaux sont couverts par notre garantie décennale et notre assurance.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
];

// Fourchettes indicatives — valeurs à confirmer par le client.
const PRICING = [
  { name: "Débouchage canalisation", prefix: "à partir de", price: "XX €" },
  { name: "Recherche de fuite", prefix: "à partir de", price: "XX €" },
  { name: "Remplacement chauffe-eau", prefix: "à partir de", price: "XX €" },
  { name: "Déplacement / diagnostic", prefix: "", price: "XX €" },
];

const REALISATIONS = [
  {
    label: "Rénovation complète de salle de bain — Nice",
    before: "/photos/avant-renovation.webp",
    after: "/photos/apres-renovation.webp",
  },
];

// Slugs prêts pour de futures pages /plombier-[ville].
const CITIES = [
  { name: "Nice", slug: "nice" },
  { name: "Cannes", slug: "cannes" },
  { name: "Antibes", slug: "antibes" },
  { name: "Grasse", slug: "grasse" },
  { name: "Cagnes-sur-Mer", slug: "cagnes-sur-mer" },
  { name: "Saint-Laurent-du-Var", slug: "saint-laurent-du-var" },
  { name: "Vence", slug: "vence" },
  { name: "Menton", slug: "menton" },
  { name: "Monaco", slug: "monaco" },
  { name: "Toulon", slug: "toulon" },
  { name: "Est du Var (83)", slug: "est-du-var" },
];

const TRUST_BADGES = [
  { label: "Note Google 5,0/5", star: true },
  { label: "Garantie décennale" },
  { label: "Assurance RC Pro" },
  { label: "SIRET 934 336 637 00012" },
  { label: "15 ans d'expérience" },
  { label: "Intervention 24h/24" },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badges">
              <div className="hero-badge">
                <span className="pulse-dot"></span>
                Disponible maintenant · 24h/24 – 7j/7
              </div>
              <div className="hero-rating">
                <span className="hero-rating-stars" aria-hidden="true">
                  ★★★★★
                </span>
                <strong>5,0/5</strong>
                <span className="hero-rating-count">· 29 avis Google</span>
              </div>
            </div>
            <h1>
              Plombier à Nice
              <br />
              et dans les <span>Alpes-Maritimes (06)</span>
            </h1>
            <p className="hero-sub">
              Fuite, canalisation bouchée, chauffe-eau en panne ? AQUAPURE
              intervient rapidement, de jour comme de nuit, sur toute la Côte
              d&apos;Azur — dans les Alpes-Maritimes (06) et le Var (83). Artisan
              local, 15 ans d&apos;expérience, garanti décennale.
            </p>
            <div className="hero-ctas">
              <a href="tel:0484350486" className="cta-call">
                <svg viewBox="0 0 24 24">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
                <div className="cta-call-inner">
                  <span>Appeler maintenant — 04 84 35 04 86</span>
                  <span className="cta-call-sub">
                    Réponse en quelques minutes · Intervention dans l&apos;heure
                  </span>
                </div>
              </a>
              <Link href="/devis" className="cta-devis-hero">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                </svg>
                Demander mon devis gratuit — sans engagement
              </Link>
            </div>
            <div className="reassurance">
              <span className="re-item">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
                Intervention 24h/24 – 7j/7
              </span>
              <span className="re-item">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
                Devis gratuit
              </span>
              <span className="re-item">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
                Garantie décennale
              </span>
              <span className="re-item">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
                Artisan local Nice
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RATING BANNER */}
      <div className="rating-banner">
        <div className="rating-inner">
          <div>
            <div className="rating-num">5,0 / 5</div>
            <div className="rating-stars">★★★★★</div>
            <div className="rating-label">29 avis Google vérifiés</div>
          </div>
          <div className="rating-sep">|</div>
          <div className="rating-badges">
            <div className="rating-badge-item">
              <svg viewBox="0 0 24 24">
                <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 15l-5-5 1.4-1.4L10 13.2l7.6-7.6L19 7l-9 9z" />
              </svg>
              15 ans d&apos;expérience
            </div>
            <div className="rating-badge-item">
              <svg viewBox="0 0 24 24">
                <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 15l-5-5 1.4-1.4L10 13.2l7.6-7.6L19 7l-9 9z" />
              </svg>
              Garantie décennale
            </div>
            <div className="rating-badge-item">
              <svg viewBox="0 0 24 24">
                <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 15l-5-5 1.4-1.4L10 13.2l7.6-7.6L19 7l-9 9z" />
              </svg>
              Artisan local basé à Nice
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Nos services</div>
          <h2 className="section-title">
            4 domaines d&apos;intervention en plomberie
          </h2>
          <p className="section-lead">
            De l&apos;urgence à la rénovation complète, AQUAPURE Plomberie couvre
            tous vos besoins à Nice et sur toute la Côte d&apos;Azur —
            Alpes-Maritimes (06) et Var (83).
          </p>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon si-urgence">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div className="service-name">Dépannage &amp; urgences 24h/24</div>
              <div className="service-desc">
                Fuite d&apos;eau, canalisation bouchée, WC / évier engorgé,
                chauffe-eau en panne. Intervention dans l&apos;heure à Nice.
              </div>
              <div className="service-link">
                <svg viewBox="0 0 24 24">
                  <path d="M10 6l6 6-6 6V6z" />
                </svg>
                En savoir plus
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon si-reno">
                <svg viewBox="0 0 24 24">
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
              </div>
              <div className="service-name">
                Rénovation salle de bain &amp; cuisine
              </div>
              <div className="service-desc">
                Douche italienne, baignoire, WC suspendu, robinetterie, carrelage.
                Création ou rénovation complète, de A à Z.
              </div>
              <div className="service-link">
                <svg viewBox="0 0 24 24">
                  <path d="M10 6l6 6-6 6V6z" />
                </svg>
                Voir les rénovations
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon si-chauffe">
                <svg viewBox="0 0 24 24">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                </svg>
              </div>
              <div className="service-name">
                Chauffe-eau &amp; ballon d&apos;eau chaude
              </div>
              <div className="service-desc">
                Installation, remplacement et entretien de chauffe-eaux
                électriques ou thermodynamiques. Conseil personnalisé.
              </div>
              <div className="service-link">
                <svg viewBox="0 0 24 24">
                  <path d="M10 6l6 6-6 6V6z" />
                </svg>
                Nos prestations
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon si-general">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="service-name">Plomberie générale</div>
              <div className="service-desc">
                Création ou modification de réseaux d&apos;eau, pose de cuisine,
                évier, robinetterie, raccordements divers.
              </div>
              <div className="service-link">
                <svg viewBox="0 0 24 24">
                  <path d="M10 6l6 6-6 6V6z" />
                </svg>
                Tout savoir
              </div>
            </div>
          </div>

          {/* Photos services */}
          <div className="services-photos">
            <div>
              <div className="service-photo">
                <img
                  src="/photos/depannage-urgence.webp"
                  alt="Plombier AQUAPURE réparant une fuite d'eau en urgence à Nice"
                  width={900}
                  height={900}
                  loading="lazy"
                />
              </div>
              <div className="service-photo-label">Dépannage urgence</div>
            </div>
            <div>
              <div className="service-photo">
                <img
                  src="/photos/renovation-salle-de-bain.webp"
                  alt="Rénovation de salle de bain à Nice par AQUAPURE Plomberie"
                  width={900}
                  height={900}
                  loading="lazy"
                />
              </div>
              <div className="service-photo-label">Rénovation salle de bain</div>
            </div>
            <div>
              <div className="service-photo">
                <img
                  src="/photos/chauffe-eau.webp"
                  alt="Installation de chauffe-eau à Nice par un plombier AQUAPURE"
                  width={900}
                  height={900}
                  loading="lazy"
                />
              </div>
              <div className="service-photo-label">Installation chauffe-eau</div>
            </div>
          </div>

          <div className="inline-cta">
            <p>
              Un problème de plomberie à Nice ?{" "}
              <strong>
                Ne laissez pas la situation s&apos;aggraver — appelez maintenant.
              </strong>
            </p>
            <a href="tel:0484350486" className="btn-cta-inline">
              <svg viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              04 84 35 04 86 — on arrive
            </a>
          </div>
        </div>
      </section>

      {/* NOTRE PROCESSUS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">Notre méthode</div>
          <h2 className="section-title">Comment se passe une intervention</h2>
          <p className="section-lead">
            De votre appel à la garantie, un déroulé simple et transparent en 5
            étapes.
          </p>
          <div className="process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div className="process-step" key={step.title}>
                <div className="process-num">{i + 1}</div>
                <div className="process-icon">{step.icon}</div>
                <div className="process-title">{step.title}</div>
                <div className="process-text">{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS INDICATIFS */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Tarifs</div>
          <h2 className="section-title">Tarifs indicatifs</h2>
          <p className="section-lead">
            Des fourchettes pour vous situer. Le prix exact est toujours confirmé
            par devis avant l&apos;intervention.
          </p>
          <div className="pricing-grid">
            {PRICING.map((p) => (
              <div className="pricing-card" key={p.name}>
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-price">
                  {p.prefix ? `${p.prefix} ` : ""}
                  {/* TODO CLIENT: prix à valider */}
                  <span>{p.price}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="pricing-note">
            <svg viewBox="0 0 24 24">
              <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 15l-5-5 1.4-1.4L10 13.2l7.6-7.6L19 7l-9 9z" />
            </svg>
            Devis gratuit et sans engagement — tarif confirmé avant toute
            intervention.
          </p>
        </div>
      </section>

      {/* RÉALISATIONS AVANT / APRÈS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">Réalisations</div>
          <h2 className="section-title">Avant / après</h2>
          <p className="section-lead">
            Quelques chantiers récents à Nice et sur la Côte d&apos;Azur (06 &amp;
            83).
          </p>
          <div className="ba-grid">
            {REALISATIONS.map((r) => (
              <div className="ba-card" key={r.label}>
                <div className="ba-images">
                  <figure className="ba-img">
                    <img
                      src={r.before}
                      alt="Salle de bain à Nice avant rénovation par AQUAPURE Plomberie"
                      width={680}
                      height={680}
                      loading="lazy"
                    />
                    <figcaption>Avant</figcaption>
                  </figure>
                  <figure className="ba-img">
                    <img
                      src={r.after}
                      alt="Salle de bain à Nice après rénovation par AQUAPURE Plomberie"
                      width={680}
                      height={680}
                      loading="lazy"
                    />
                    <figcaption>Après</figcaption>
                  </figure>
                </div>
                <div className="ba-label">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="div" />

      {/* WHY US */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">Pourquoi nous choisir</div>
          <h2 className="section-title">Ce qui fait la différence</h2>
          <p className="section-lead">
            AQUAPURE Plomberie, c&apos;est un artisan local qui connaît Nice, le
            06 et le Var comme sa poche — avec les certifications, l&apos;équipe et
            la disponibilité qui vont avec.
          </p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-check">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
              </div>
              <div>
                <div className="why-title">
                  15 ans d&apos;expérience dans la région niçoise
                </div>
                <div className="why-detail">
                  Mehdi Van Ardenne et son équipe connaissent parfaitement le 06
                  et l&apos;est du Var.
                </div>
              </div>
            </div>
            <div className="why-card">
              <div className="why-check">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
              </div>
              <div>
                <div className="why-title">
                  Intervention rapide, même la nuit et le week-end
                </div>
                <div className="why-detail">
                  Pour les urgences à Nice, nous nous efforçons d&apos;intervenir
                  dans l&apos;heure.
                </div>
              </div>
            </div>
            <div className="why-card">
              <div className="why-check">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
              </div>
              <div>
                <div className="why-title">
                  Devis gratuit, clair, sans surprise sur la facture
                </div>
                <div className="why-detail">
                  Chaque devis est détaillé et sans engagement. La facture
                  correspond toujours.
                </div>
              </div>
            </div>
            <div className="why-card">
              <div className="why-check">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
                </svg>
              </div>
              <div>
                <div className="why-title">
                  Travaux couverts par la garantie décennale
                </div>
                <div className="why-detail">
                  Artisan assuré. Particuliers, professionnels, syndics et AirBnB
                  bienvenus.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONE + FOUNDER */}
      <section className="section">
        <div className="section-inner">
          <div className="photo-text">
            <div>
              <div className="section-eyebrow">Zone d&apos;intervention</div>
              <h2 className="section-title">Nice et tout le 06 – Est du Var</h2>
              <p className="section-lead" style={{ marginBottom: "24px" }}>
                Basés au 29 Boulevard Victor Hugo à Nice, nous intervenons sur
                toute la Côte d&apos;Azur — Alpes-Maritimes (06) et Var (83). Un
                doute sur votre secteur ? Appelez-nous.
              </p>
              <div className="zone-box">
                <div className="zone-box-title">Nous intervenons dans :</div>
                <div className="zone-pills">
                  <span className="zone-pill">Fréjus</span>
                  <span className="zone-pill">Saint-Raphaël</span>
                  <span className="zone-pill">Draguignan</span>
                  <span className="zone-pill">Est du Var (83)</span>
                  <span className="zone-pill">Nice</span>
                  <span className="zone-pill">Antibes</span>
                  <span className="zone-pill">Cannes</span>
                  <span className="zone-pill">Cagnes-sur-Mer</span>
                  <span className="zone-pill">Saint-Laurent-du-Var</span>
                  <span className="zone-pill">Menton</span>
                </div>
                <a href="tel:0484350486" className="zone-cta-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                  </svg>
                  Vérifier votre secteur — appelez-nous
                </a>
              </div>
            </div>
            <div className="photo-block">
              <img
                src="/photos/plomberie-piscine-villa.webp"
                alt="Plomberie de villa avec piscine à Nice et dans le 06 — AQUAPURE Plomberie"
                width={900}
                height={900}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="div" />

      {/* VILLES DESSERVIES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Villes desservies</div>
          <h2 className="section-title">
            Votre plombier dans tout le 06 et l&apos;est du Var
          </h2>
          <p className="section-lead">
            Nous intervenons à Nice, dans le Var (83) et sur toute la Côte
            d&apos;Azur — communes des Alpes-Maritimes (06) et du Var.
          </p>
          <div className="cities-pills">
            {/* TODO: futures pages locales par ville (/plombier-[ville]) — liens inactifs pour l'instant */}
            {CITIES.map((city) => (
              <span className="city-pill" key={city.slug}>
                {city.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="photo-text reverse">
            <div className="photo-block">
              {/* TODO CLIENT: remplacer par une vraie photo de Mehdi Van Ardenne / de l'équipe */}
              <img
                src="/photos/plomberie-generale.webp"
                alt="Artisan plombier AQUAPURE au travail à Nice"
                width={900}
                height={900}
                loading="lazy"
              />
            </div>
            <div>
              <div className="section-eyebrow">Le fondateur</div>
              <h2 className="section-title">Faisons connaissance</h2>
              <div className="founder">
                <div className="founder-avatar">MV</div>
                <div>
                  <p className="founder-quote">
                    « Après 15 ans de plomberie dans la région niçoise et dans le
                    Var, je peux vous dire avec sincérité que ce métier reste ma
                    passion. Mon équipe et moi nous engageons chaque jour à vous
                    offrir un service honnête et de qualité, bien au-delà du simple
                    dépannage. À Nice, nous ne sommes pas simplement votre
                    plombier : nous sommes votre partenaire de confiance. »
                  </p>
                  <div className="founder-name">
                    — Mehdi Van Ardenne, fondateur d&apos;AQUAPURE Plomberie
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Avis clients</div>
          <h2 className="section-title">Ce que disent nos clients à Nice</h2>
          <p className="section-lead">
            Plus de 29 avis Google avec une note moyenne de 5,0/5. Voici quelques
            témoignages récents.
          </p>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-top">
                <span className="review-name">Sophie M.</span>
                <span className="review-stars">★★★★★</span>
              </div>
              <p className="review-text">
                Intervention en moins d&apos;une heure pour une fuite importante.
                Travail propre, tarif honnête. Je recommande sans hésiter !
              </p>
            </div>
            <div className="review-card">
              <div className="review-top">
                <span className="review-name">Thomas R.</span>
                <span className="review-stars">★★★★★</span>
              </div>
              <p className="review-text">
                Rénovation complète de notre salle de bain. Résultat impeccable,
                délais respectés. Mehdi est un vrai professionnel.
              </p>
            </div>
            <div className="review-card">
              <div className="review-top">
                <span className="review-name">Isabelle C.</span>
                <span className="review-stars">★★★★★</span>
              </div>
              <p className="review-text">
                Chauffe-eau remplacé le soir même, un dimanche. Prix correct et
                travail soigné. Merci AQUAPURE !
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "1px solid var(--gray-border)",
                borderRadius: "10px",
                padding: "11px 22px",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--navy)",
                cursor: "pointer",
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#F59E0B">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
              </svg>
              Voir tous nos avis Google
            </button>
          </div>
          <div className="inline-cta">
            <p>
              Rejoignez nos clients satisfaits à Nice et sur toute la Côte
              d&apos;Azur.{" "}
              <strong>Confiez-nous votre installation.</strong>
            </p>
            <a href="tel:0484350486" className="btn-cta-inline">
              <svg viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              Appeler AQUAPURE maintenant
            </a>
          </div>
        </div>
      </section>

      <hr className="div" />

      {/* FAQ */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className={`faq-item${openFaq === index ? " open" : ""}`}
              >
                <div className="faq-q" onClick={() => toggleFaq(index)}>
                  {item.q}
                  <svg viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="final-cta-bg"></div>
        <div className="final-cta-inner">
          <h2>Besoin d&apos;un plombier à Nice ?</h2>
          <p>
            Un problème de plomberie n&apos;attend pas. Appelez AQUAPURE pour une
            intervention rapide et un devis gratuit — 7j/7, 24h/24.
          </p>
          <div className="final-btns">
            <a href="tel:0484350486" className="final-btn-call">
              <svg viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              04 84 35 04 86
            </a>
            <a
              href="mailto:contact@aquapureplomberie.fr"
              className="final-btn-mail"
            >
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm0 12H4V8.82l8 5 8-5V18z" />
              </svg>
              contact@aquapureplomberie.fr
            </a>
          </div>
        </div>
      </section>

      {/* BANDEAU RÉASSURANCE / BADGES */}
      <section className="trust-band">
        <div className="trust-inner">
          {TRUST_BADGES.map((b) => (
            <div className="trust-item" key={b.label}>
              {b.star ? (
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm-2 15l-5-5 1.4-1.4L10 13.2l7.6-7.6L19 7l-9 9z" />
                </svg>
              )}
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <StickyBar />
    </>
  );
}
