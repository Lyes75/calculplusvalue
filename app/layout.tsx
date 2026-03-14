import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Simulation Plus-Value Immobilière 2026 : Calcul, Tableau & Impôt Gratuit",
  description:
    "Simulation plus-value immobilière gratuite et instantanée. Calculez votre impôt, abattements pour durée de détention, surtaxe. Barèmes CGI 2026 à jour.",
  keywords: [
    "simulation plus-value immobilière",
    "plus-value immobilière",
    "calcul plus-value",
    "simulateur plus-value",
    "impôt plus-value",
    "taxe vente appartement",
    "abattement plus-value",
    "prélèvements sociaux immobilier",
  ],
  authors: [{ name: "calculplusvalue.fr" }],
  openGraph: {
    title: "Simulation Plus-Value Immobilière 2026 — Gratuit",
    description:
      "Simulation plus-value immobilière gratuite. Calculez votre impôt en temps réel, comparez les scénarios de vente, découvrez vos pistes d'optimisation fiscale.",
    url: "https://calculplusvalue.fr",
    siteName: "calculplusvalue.fr",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulation Plus-Value Immobilière 2026",
    description:
      "Simulation gratuite, résultat en temps réel, scénarios comparatifs.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://calculplusvalue.fr",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P9WX964B');` }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KN6409XJBV" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KN6409XJBV');` }} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#2D2B55" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P9WX964B" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        <NavBar />
        {children}
        <footer style={{ background: "#2D2B55", padding: "40px 24px 28px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Logo + tagline */}
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
              <img src="/logo.svg" alt="calculplusvalue.fr" style={{ height: 36, width: "auto" }} />
              <span style={{ fontSize: 13, color: "#9B97C4", lineHeight: 1.4, maxWidth: 340 }}>
                Simulateur gratuit de plus-value immobilière — Barèmes CGI 2026 à jour
              </span>
            </div>

            {/* Liens navigation */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px 24px", marginBottom: 28 }}>
              {[
                { href: "/", label: "Simulateur général" },
                { href: "/plus-value-lmnp", label: "Plus-value LMNP" },
                { href: "/plus-value-sci", label: "Plus-value SCI" },
                { href: "/plus-value-non-resident", label: "Plus-value Non-résident" },
                { href: "/plus-value-donation-succession", label: "Donation / Succession" },
                { href: "/plus-value-terrain", label: "Plus-value Terrain" },
                { href: "/plus-value-scpi", label: "Plus-value SCPI" },
                { href: "/plus-value-indivision", label: "Indivision & Démembrement" },
                { href: "/exonerations-plus-value", label: "Guide Exonérations" },
                { href: "/mentions-legales", label: "Mentions légales" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 13, color: "#9B97C4", textDecoration: "none", lineHeight: 1.7 }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: "#6E6B8A", lineHeight: 1.7, margin: "0 0 12px 0", maxWidth: 800 }}>
                Les simulations proposées par calculplusvalue.fr sont fournies à titre indicatif et ne constituent pas un conseil fiscal ou juridique. Elles sont basées sur les barèmes en vigueur au 1er janvier 2026 (art. 150 U à 150 VH du CGI). Pour tout calcul définitif, consultez votre notaire ou un conseiller fiscal agréé.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#6E6B8A" }}>
                  © {new Date().getFullYear()} calculplusvalue.fr — Tous droits réservés
                </span>
                <span style={{ fontSize: 11, color: "#6E6B8A" }}>
                  Simulation indicative — Non contractuelle
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
