import type { Metadata } from "next";
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#2D2B55" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P9WX964B" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        {children}
      </body>
    </html>
  );
}
