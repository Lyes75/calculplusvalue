import type { Metadata } from "next";
import TerrainClient from "./TerrainClient";

export const metadata: Metadata = {
  title: "Plus-Value Terrain Constructible 2026 — Simulateur Gratuit | calculplusvalue.fr",
  description:
    "Calculez la plus-value sur la vente d'un terrain constructible, agricole ou jardin. Mêmes abattements que les particuliers, pas de forfait travaux. Simulateur gratuit.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-terrain",
  },
  openGraph: {
    title: "Plus-Value Terrain Constructible 2026 — Simulateur Gratuit",
    description:
      "Terrain constructible, jardin ou parcelle agricole : mêmes abattements 22 ans / 30 ans, pas de forfait 15% travaux. Calculez votre impôt gratuitement.",
    url: "https://calculplusvalue.fr/plus-value-terrain",
    siteName: "Calculplusvalue.fr",
    locale: "fr_FR",
    type: "website",
  },
  robots: "index, follow",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "La plus-value sur un terrain est-elle imposée comme un appartement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le régime fiscal est identique : taux IR de 19%, prélèvements sociaux de 17,2%, abattements pour durée de détention (exonération IR à 22 ans, PS à 30 ans), surtaxe progressive au-delà de 50 000 € de plus-value nette. La seule différence est que le forfait de 15% pour travaux ne s'applique pas aux terrains non bâtis — seuls les travaux réels justifiés par factures (viabilisation, clôture, bornage...) sont déductibles.",
      },
    },
    {
      "@type": "Question",
      name: "Le forfait 15% pour travaux s'applique-t-il à un terrain ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le forfait de 15% du prix d'achat pour les travaux est réservé aux biens bâtis (appartements, maisons). Il ne s'applique pas aux terrains non bâtis. Pour un terrain, seuls les travaux réels réalisés par une entreprise et justifiés par des factures sont déductibles : viabilisation, raccordements, clôtures, drainage, géomètre-expert pour le bornage. En revanche, le forfait de frais d'acquisition de 7,5% reste applicable.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on vendre une partie de son jardin sans payer de plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si le jardin est vendu en même temps que la résidence principale et constitue une dépendance immédiate et nécessaire de celle-ci, l'exonération résidence principale s'applique. Si le jardin est vendu séparément, la plus-value est imposable. Le prix d'acquisition du terrain cédé se calcule au prorata de la surface cédée par rapport à la surface totale du bien (ex : vous cédez 1/3 de la parcelle → 1/3 du prix d'achat initial). Si le prix de cession ne dépasse pas 15 000 €, une exonération totale s'applique.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce que la taxe communale sur les terrains devenus constructibles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'article 1529 du CGI permet aux communes d'instaurer une taxe forfaitaire de 10% sur la plus-value brute réalisée lors de la première cession d'un terrain nu rendu constructible suite à un classement ou reclassement par un plan local d'urbanisme (PLU). Cette taxe est facultative — seules les communes ayant délibéré en ce sens l'appliquent. Elle s'ajoute à l'impôt classique sur la plus-value. Des exonérations existent (détention > 18 ans depuis le classement, prix ≤ 15 000 €). Vérifiez auprès de votre mairie avant la vente.",
      },
    },
  ],
};

export default function PlusValueTerrainPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TerrainClient />
    </>
  );
}
