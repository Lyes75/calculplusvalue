import type { Metadata } from "next";
import ExonerationsClient from "./ExonerationsClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Exonérations de plus-value immobilière | calculplusvalue.fr",
  description:
    "Calculez la plus-value sur la vente de votre terrain. Forfait 15% travaux non applicable, viabilisation et bornage déductibles sur factures. Gratuit, barèmes 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/exonerations-plus-value",
  },
  openGraph: {
    title: "Exonérations Plus-Value Immobilière 2026 — Guide Complet",
    description:
      "Résidence principale, 22 ans de détention, primo-accédant, retraité, expatrié… Tous les cas d'exonération expliqués avec références légales et exemples.",
    url: "https://calculplusvalue.fr/exonerations-plus-value",
    siteName: "Calculplusvalue.fr",
    locale: "fr_FR",
    type: "website",
  },
  robots: "index, follow",
};

// ── FAQ JSON-LD ──────────────────────────────────────────────────────────────
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Peut-on être exonéré si on a quitté sa résidence principale avant la vente ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, sous conditions. L'administration fiscale admet un délai raisonnable entre le départ du logement et la vente, généralement jusqu'à 1 an, à condition que le bien ait été mis en vente dès le départ et qu'il n'ait pas été loué ni occupé par un tiers entre-temps. Au-delà d'un an, l'exonération peut être contestée. Le délai est apprécié au cas par cas selon les circonstances (marché immobilier local, diligences du vendeur). Si le délai est trop long, le bien est requalifié en résidence secondaire et l'exonération RP est perdue.",
      },
    },
    {
      "@type": "Question",
      name: "L'exonération résidence principale s'applique-t-elle si je loue une chambre de mon logement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. L'exonération s'applique à l'ensemble du logement dès lors qu'il constitue votre résidence principale habituelle et effective, même si une partie est louée (chambre meublée, colocation). En revanche, si une partie significative du bien est affectée à un usage professionnel exclusif (cabinet, atelier), cette partie peut être exclue de l'exonération et la PV sur cette fraction sera imposée au prorata.",
      },
    },
    {
      "@type": "Question",
      name: "Je suis primo-accédant : comment fonctionne l'exonération avec réemploi partiel ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si vous ne réemployez qu'une partie du prix de vente dans l'achat de votre résidence principale, l'exonération est proportionnelle au montant réemployé. Par exemple, si vous vendez un bien 200 000€ et n'en réemployez que 150 000€ dans votre RP, l'exonération porte sur 75% de la plus-value (150/200). Les 25% restants sont imposés normalement. Le réemploi doit intervenir dans les 24 mois suivant la cession.",
      },
    },
    {
      "@type": "Question",
      name: "Le seuil de 15 000€ s'apprécie-t-il par bien ou par vendeur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Par cédant pour chaque bien. Si vous vendez seul un bien à 15 000€, vous êtes exonéré. Si vous vendez à deux (indivision 50/50) un bien à 25 000€, chaque cédant a une quote-part de 12 500€ — les deux sont exonérés. En revanche, si vous vendez deux biens distincts à 10 000€ chacun le même jour, chaque vente est appréciée séparément — les deux sont exonérées. Le seuil s'apprécie par cession et par cédant.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les conditions de revenus pour l'exonération retraité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Votre revenu fiscal de référence (RFR) de l'avant-dernière année (N-2, soit celui figurant sur l'avis d'imposition de l'année précédente) doit être inférieur au seuil légal, revalorisé chaque année. Pour 2026 (revenus 2024), le seuil est d'environ 11 885€ pour 1 part, majoré d'environ 3 174€ par demi-part supplémentaire. Vous ne devez pas non plus être assujetti à l'IFI au titre de l'une des deux années précédant la cession. Ces deux conditions (RFR + absence d'IFI) sont cumulatives.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on cumuler plusieurs exonérations sur le même bien ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En pratique, non — une seule exonération s'applique par cession. Si vous êtes dans plusieurs cas d'exonération (par exemple, retraité ET détention > 30 ans), la plus favorable s'applique automatiquement. En revanche, certaines exonérations sont utilisables sur des biens différents : l'exonération RP s'applique à chaque vente de RP (pas de limite dans le temps), tandis que l'exonération non-résident 150K€ n'est utilisable qu'une seule fois.",
      },
    },
    {
      "@type": "Question",
      name: "Ma résidence secondaire peut-elle être requalifiée en résidence principale pour bénéficier de l'exonération ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "C'est risqué. L'administration fiscale vérifie que le bien est votre résidence habituelle et effective — pas simplement un lieu de villégiature. Les indices retenus sont : l'adresse sur vos déclarations fiscales, les factures d'énergie (consommation normale), l'inscription sur les listes électorales, la scolarisation des enfants, la proximité avec votre lieu de travail. Une requalification artificielle (déménager 6 mois avant la vente) peut être considérée comme un abus de droit. Le risque de redressement est réel et les pénalités peuvent atteindre 80% de l'impôt éludé.",
      },
    },
  ],
};

export default function ExonerationsPlusValue() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ExonerationsClient />
    </>
  );
}
