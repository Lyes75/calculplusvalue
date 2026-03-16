import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Désabonnement confirmé — calculplusvalue.fr",
  robots: "noindex, nofollow",
};

export default function DesabonnementConfirme() {
  return (
    <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Link href="/" style={{ color: "#56CBAD", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            ← Retour au simulateur
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E0DEF0", padding: "48px 40px", maxWidth: 500, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2B55", marginBottom: 12 }}>
            Désabonnement confirmé
          </h1>
          <p style={{ fontSize: 14, color: "#3F3D6E", lineHeight: 1.7, marginBottom: 24 }}>
            Vous avez été désabonné avec succès. Vous ne recevrez plus d&rsquo;emails de calculplusvalue.fr.
          </p>
          <p style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 32 }}>
            Si vous souhaitez de nouveau recevoir des simulations à l&rsquo;avenir, il vous suffira de refaire une demande de rapport sur le site.
          </p>
          <Link href="/"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "#2D2B55",
              color: "#E0DEF0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            Retour au simulateur
          </Link>
        </div>
      </div>
    </div>
  );
}
