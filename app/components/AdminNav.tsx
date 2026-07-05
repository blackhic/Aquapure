import Link from "next/link";

// Onglets de navigation entre les deux espaces admin. Composant serveur : la
// page active est passée en prop (pas besoin de hook client).
export default function AdminNav({ active }: { active: "devis" | "kb" }) {
  return (
    <nav className="admin-nav" aria-label="Navigation admin">
      <Link
        href="/admin"
        className={`admin-nav-link${active === "devis" ? " active" : ""}`}
        aria-current={active === "devis" ? "page" : undefined}
      >
        Demandes de devis
      </Link>
      <Link
        href="/admin/base-de-connaissances"
        className={`admin-nav-link${active === "kb" ? " active" : ""}`}
        aria-current={active === "kb" ? "page" : undefined}
      >
        Base de connaissances
      </Link>
    </nav>
  );
}
