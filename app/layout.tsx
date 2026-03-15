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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Combien d'impôt vais-je payer sur ma plus-value immobilière ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La plus-value est taxée à 36,2% au taux plein (19% d'IR + 17,2% de PS). Mais les abattements pour durée de détention réduisent ce taux progressivement. Après 15 ans, le taux effectif tombe à environ 17%. Après 22 ans, l'IR est exonéré. Après 30 ans, plus aucun impôt. Utilisez le simulateur pour votre montant exact."
                }
              },
              {
                "@type": "Question",
                "name": "Après combien d'années est-on exonéré de plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "L'exonération est progressive : l'IR (19%) est totalement exonéré après 22 ans, les PS (17,2%) après 30 ans. Entre 22 et 30 ans, seuls les PS restent dus sur un montant réduit. L'onglet Scénarios du simulateur montre l'évolution année par année."
                }
              },
              {
                "@type": "Question",
                "name": "Comment réduire le montant de ma plus-value imposable ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Quatre leviers : déduisez vos frais d'acquisition (forfait 7,5% ou réels), déduisez vos travaux (forfait 15% après 5 ans ou factures réelles), déduisez vos frais de cession (diagnostics, agence), et si possible attendez un seuil d'abattement favorable. Le comparateur de scénarios indique l'économie potentielle en décalant la vente."
                }
              },
              {
                "@type": "Question",
                "name": "La plus-value est-elle imposée si je vends ma résidence principale ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Non. La vente de votre résidence principale est totalement exonérée, quelle que soit la durée de détention et le montant du gain. Le bien doit être votre résidence principale effective au jour de la vente. Si vous avez déménagé, un délai d'environ un an est toléré sans location entre-temps."
                }
              },
              {
                "@type": "Question",
                "name": "Que change la réforme LMNP 2025 pour la plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Les amortissements déduits en LMNP sont désormais réintégrés dans le calcul de la plus-value. Votre prix d'acquisition est réduit des amortissements, ce qui augmente la plus-value imposable. Par exemple, pour un bien acheté 200 000€ avec 50 000€ d'amortissements, la base de calcul part de 150 000€."
                }
              },
              {
                "@type": "Question",
                "name": "Un non-résident paie-t-il le même impôt sur la plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pas exactement. L'IR reste à 19%, mais les PS sont réduits à 7,5% pour les non-résidents affiliés à la sécurité sociale UE/EEE. Le taux total passe de 36,2% à 26,5%. De plus, une exonération jusqu'à 150 000€ de PV nette est possible pour les anciens résidents fiscaux."
                }
              },
              {
                "@type": "Question",
                "name": "Comment est calculée la plus-value d'un bien hérité ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le prix d'acquisition retenu est la valeur déclarée dans la déclaration de succession. La durée de détention court depuis la date du décès. Seuls les frais réels sont déductibles (droits de succession + notaire) — le forfait 7,5% ne s'applique pas."
                }
              },
              {
                "@type": "Question",
                "name": "Qu'est-ce que la surtaxe sur les plus-values supérieures à 50 000€ ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Quand la PV nette (après abattements) dépasse 50 000€, une surtaxe de 2% à 6% s'ajoute. Elle est calculée sur le montant total, pas sur la fraction au-dessus de 50 000€. En indivision, le seuil s'apprécie par vendeur — à deux, vous pouvez y échapper si chaque part reste sous 50 000€."
                }
              }
            ]
          }) }}
        />
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
                <span style={{ fontSize: 11, color: "#6E6B8A", display: "flex", alignItems: "center", gap: 8 }}>
                  © {new Date().getFullYear()} calculplusvalue.fr — Tous droits réservés
                  <span style={{ color: "#4a4870" }}>|</span>
                  <a href="/mentions-legales" style={{ color: "#9B97C4", textDecoration: "none" }}>Mentions légales</a>
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
