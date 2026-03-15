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
                  "text": "La plus-value immobilière est taxée à 36,2% au taux plein : 19% d'impôt sur le revenu et 17,2% de prélèvements sociaux. Mais grâce aux abattements pour durée de détention, le taux effectif diminue avec le temps. Par exemple, après 15 ans de détention, le taux effectif tombe à environ 17%. Après 22 ans, l'IR est totalement exonéré. Après 30 ans, plus aucun impôt. Utilisez notre simulateur pour calculer votre montant exact en fonction de votre situation."
                }
              },
              {
                "@type": "Question",
                "name": "Après combien d'années est-on exonéré de plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "L'exonération est progressive et se fait en deux temps. L'impôt sur le revenu (19%) est totalement exonéré après 22 ans de détention grâce à un abattement de 6% par an à partir de la 6e année. Les prélèvements sociaux (17,2%) sont exonérés après 30 ans, avec un abattement plus lent. Entre 22 et 30 ans, vous ne payez plus que les prélèvements sociaux sur un montant réduit."
                }
              },
              {
                "@type": "Question",
                "name": "Comment réduire le montant de ma plus-value imposable ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Quatre leviers principaux. Premièrement, déduisez vos frais d'acquisition : forfait 7,5% du prix d'achat ou frais de notaire réels si plus élevés. Deuxièmement, déduisez vos travaux : forfait 15% si vous détenez le bien depuis plus de 5 ans, ou montant réel avec factures d'entreprises. Troisièmement, déduisez vos frais de cession : diagnostics, frais d'agence à votre charge, mainlevée d'hypothèque. Quatrièmement, si possible, attendez un seuil d'abattement favorable."
                }
              },
              {
                "@type": "Question",
                "name": "La plus-value est-elle imposée si je vends ma résidence principale ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Non. La vente de votre résidence principale est totalement exonérée d'impôt sur la plus-value, quelle que soit la durée de détention et quel que soit le montant du gain. C'est l'exonération la plus courante. Le bien doit être votre résidence principale effective au jour de la vente. Si vous avez déménagé avant la vente, un délai raisonnable est toléré (généralement un an) à condition de ne pas avoir loué le bien entre-temps."
                }
              },
              {
                "@type": "Question",
                "name": "Que change la réforme LMNP 2025 pour la plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depuis la loi de finances 2025, les amortissements déduits en LMNP sont réintégrés dans le calcul de la plus-value. Concrètement, votre prix d'acquisition est réduit du montant des amortissements que vous avez déduits de vos revenus locatifs, ce qui augmente mécaniquement votre plus-value imposable. Par exemple, pour un bien acheté 200 000€ avec 50 000€ d'amortissements cumulés, la base de calcul de la plus-value part de 150 000€ au lieu de 200 000€."
                }
              },
              {
                "@type": "Question",
                "name": "Un non-résident paie-t-il le même impôt sur la plus-value ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pas exactement. Le taux d'IR reste à 19%, mais les prélèvements sociaux sont réduits à 7,5% (au lieu de 17,2%) pour les non-résidents affiliés à un régime de sécurité sociale UE/EEE/Suisse. Le taux total passe donc de 36,2% à 26,5%. De plus, les anciens résidents fiscaux français peuvent bénéficier d'une exonération jusqu'à 150 000€ de plus-value nette sous conditions."
                }
              },
              {
                "@type": "Question",
                "name": "Comment est calculée la plus-value d'un bien reçu en héritage ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pour un bien reçu par succession, le prix d'acquisition retenu est la valeur déclarée dans la déclaration de succession, pas le prix payé par le défunt à l'origine. La durée de détention court depuis la date du décès. Seuls les frais réels sont déductibles (droits de succession payés + frais de notaire) — le forfait 7,5% ne s'applique pas. Si la valeur déclarée était faible, la plus-value sera mécaniquement plus élevée."
                }
              },
              {
                "@type": "Question",
                "name": "Qu'est-ce que la surtaxe sur les plus-values supérieures à 50 000€ ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Lorsque votre plus-value nette imposable (après abattements pour durée de détention) dépasse 50 000€, une surtaxe progressive de 2% à 6% s'ajoute à l'IR et aux PS. Elle est calculée sur le montant total de la plus-value nette, pas sur la fraction au-dessus de 50 000€. En indivision, le seuil s'apprécie par vendeur — à deux propriétaires, vous pouvez y échapper si la part de chacun reste sous 50 000€. Le simulateur calcule automatiquement cette surtaxe et vous alerte si elle s'applique."
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
