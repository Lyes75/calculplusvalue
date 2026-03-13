import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Calcul Plus-Value Immobilière 2026 — Simulateur Gratuit",
  description:
    "Calculez gratuitement votre impôt sur la plus-value immobilière. Résultat en temps réel, scénarios comparatifs, pistes d'optimisation. Barèmes 2026 à jour.",
  keywords: [
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
    title: "Simulateur Plus-Value Immobilière 2026 — Gratuit",
    description:
      "Calculez votre impôt en temps réel. Comparez les scénarios de vente. Découvrez vos pistes d'optimisation fiscale.",
    url: "https://calculplusvalue.fr",
    siteName: "calculplusvalue.fr",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulateur Plus-Value Immobilière 2026",
    description:
      "Calcul gratuit, résultat en temps réel, scénarios comparatifs.",
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
