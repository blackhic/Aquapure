// Navigation partagée (navbar + footer).
// Structure de l'ancien site : Accueil · Les services proposés (déroulant) · Contact.
// URLs .html reproduites à l'identique (SEO).

export const HOME_LINK = { href: "/", label: "Accueil" };

export const SERVICE_LINKS = [
  { href: "/depannage-plombier-06-83.html", label: "Dépannage - Urgences" },
  {
    href: "/installation-renovation-sdb-cuisine-nice.html",
    label: "Installation et rénovation",
  },
  {
    href: "/installation-depannage-chauffe-eau-a-nice.html",
    label: "Chauffe-eau - Ballon d'eau chaude",
  },
  { href: "/plomberie-generale-a-nice.html", label: "Plomberie générale" },
];

export const CONTACT_LINK = {
  href: "/contacter-aquapure-plomberie.html",
  label: "Contact",
};

// Liste à plat (footer : maillage interne complet).
export const ALL_LINKS = [HOME_LINK, ...SERVICE_LINKS, CONTACT_LINK];
