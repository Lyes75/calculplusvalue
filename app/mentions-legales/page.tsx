import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — calculplusvalue.fr",
  description: "Mentions légales du site calculplusvalue.fr : éditeur, hébergeur, propriété intellectuelle.",
  robots: "index, follow",
};

export default function MentionsLegales() {
  return (
    <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#56CBAD", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            ← Retour au simulateur
          </Link>
        </div>
        <div style={{ maxWidth: 800, margin: "16px auto 0" }}>
          <h1 style={{ color: "#E0DEF0", fontSize: 26, fontWeight: 700, margin: 0, fontFamily: "'DM Serif Display', serif" }}>
            Mentions légales
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E0DEF0", padding: "36px 40px", lineHeight: 1.8, color: "#2D2B55" }}>

          {/* Éditeur */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Éditeur du site
            </h2>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: "#3F3D6E" }}>
              <strong>NETAUDIENCE</strong><br />
              Siège social : 8 rue Christian Dewet, 75012 Paris<br />
              SIRET : 513 899 305 00021<br />
              Capital social : 7 622,45 €
            </p>
          </section>

          {/* Directeur de la publication */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Directeur de la publication
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#3F3D6E" }}>
              M. Boussouf
            </p>
          </section>

          {/* Hébergeur */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Hébergeur
            </h2>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: "#3F3D6E" }}>
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723, États-Unis<br />
              Site web :{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "#56CBAD", textDecoration: "none" }}>
                vercel.com
              </a>
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Copyright et propriété intellectuelle
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#3F3D6E" }}>
              L&rsquo;ensemble des éléments figurant sur notre site sont protégés par les dispositions du Code de la Propriété Intellectuelle.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#3F3D6E" }}>
              En conséquence, toute reproduction de ceux-ci, totale ou partielle, ou imitation, sans notre accord exprès, préalable et écrit, est interdite.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#3F3D6E" }}>
              Il est formellement interdit de collecter et d&rsquo;utiliser les informations disponibles sur le site à des fins commerciales.
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "#3F3D6E" }}>
              Cette interdiction s&rsquo;étend notamment, sans que cette liste ne soit limitative, à tout élément rédactionnel figurant sur le site, à la présentation des écrans, aux logiciels nécessaires à l&rsquo;exploitation, aux logos, images, photos, graphiques, de quelque nature qu&rsquo;ils soient.
            </p>
          </section>

          {/* Protection des données */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Protection des données personnelles (RGPD)
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#3F3D6E" }}>
              calculplusvalue.fr collecte votre adresse email uniquement lorsque vous demandez à recevoir votre rapport de simulation par email. Cette donnée est stockée de manière sécurisée et n&rsquo;est jamais partagée avec des tiers.
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#3F3D6E" }}>
              Vous pouvez demander la suppression de vos données ou vous désabonner à tout moment en cliquant sur le lien prévu à cet effet dans chaque email, ou en contactant{" "}
              <a href="/contact" style={{ color: "#56CBAD", textDecoration: "none" }}>contact@calculplusvalue.fr</a>.
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "#3F3D6E" }}>
              <strong>Responsable du traitement :</strong> NETAUDIENCE.<br />
              <strong>Base légale :</strong> consentement (art. 6.1.a RGPD).
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2D2B55", borderBottom: "2px solid #56CBAD", paddingBottom: 8, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Avertissement
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#3F3D6E" }}>
              Les simulations fournies sur ce site sont données à titre indicatif et ne constituent pas un conseil fiscal ou juridique. Elles sont basées sur les barèmes fiscaux en vigueur au 1er janvier 2026 (art. 150 U à 150 VH du CGI). Pour tout calcul définitif, consultez votre notaire ou un conseiller fiscal agréé.
            </p>
          </section>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#2D2B55", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", fontSize: 11, color: "#6E6B8A" }}>
          © 2026 calculplusvalue.fr — Tous droits réservés
        </div>
      </div>
    </div>
  );
}
