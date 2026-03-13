import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Simulation Plus-Value Immobilière 2026 — Simulateur Gratuit",
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3C3226" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
