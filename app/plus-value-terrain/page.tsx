import type { Metadata } from "next";
import TerrainClient from "./TerrainClient";

export const metadata: Metadata = {
  title: "Plus-value sur la vente d'un terrain — Simulateur 2026 | calculplusvalue.fr",
  description:
    "Calculez la plus-value sur la vente de votre terrain. Forfait 15% travaux non applicable, viabilisation et bornage déductibles sur factures. Gratuit, barèmes 2026.",
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
      name: "Pourquoi le forfait 15% travaux ne s'applique-t-il pas aux terrains ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le forfait de 15% est prévu par l'article 150 VB II 4° du CGI pour couvrir les travaux de construction, reconstruction, agrandissement ou amélioration réalisés sur un bien bâti. Un terrain nu n'étant pas un bien bâti, ce forfait n'est pas applicable. En revanche, si vous avez réalisé des travaux sur le terrain (viabilisation, raccordement aux réseaux, bornage, clôture, drainage), vous pouvez les déduire pour leur montant réel sur présentation de factures d'entreprises. Les travaux réalisés par vous-même ne sont pas déductibles.",
      },
    },
    {
      "@type": "Question",
      name: "Comment calcule-t-on la plus-value lors d'une division parcellaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le prix d'acquisition du terrain vendu est calculé au prorata de la surface cédée par rapport à la surface totale du bien au moment de l'achat. Par exemple, si vous avez acheté une maison sur 1 000 m² pour 300 000€ et que vous vendez 300 m² de jardin, le prix d'acquisition retenu est 300 000 × (300/1000) = 90 000€. La durée de détention court depuis la date d'achat initiale du bien (pas depuis la date du permis d'aménager ou du bornage).",
      },
    },
    {
      "@type": "Question",
      name: "La vente d'une partie de mon jardin est-elle exonérée comme ma résidence principale ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pas automatiquement. L'exonération résidence principale peut s'appliquer au terrain attenant SI deux conditions sont réunies : le terrain doit constituer une dépendance immédiate et nécessaire de la résidence principale, ET la cession du terrain doit être simultanée à la vente de la maison. Si vous vendez uniquement le terrain sans vendre la maison, l'exonération RP ne s'applique pas. Vous pouvez toutefois bénéficier de l'exonération si le prix de cession est ≤ 15 000€ (art. 150 U II 6° CGI).",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce que la taxe communale sur les terrains devenus constructibles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "C'est une taxe facultative de 10% instituée par l'article 1529 du CGI. Elle frappe la plus-value brute des terrains nus rendus constructibles par une modification du PLU. Elle ne s'applique que dans les communes qui ont délibéré en ce sens. Elle s'ajoute à l'impôt sur la PV classique (IR + PS). Exonérations : détention > 18 ans depuis le classement constructible, prix de cession ≤ 15 000€, ou classement intervenu avant le 13 janvier 2010. Vérifiez auprès de votre mairie. Notre simulateur ne calcule pas cette taxe.",
      },
    },
    {
      "@type": "Question",
      name: "La viabilisation d'un terrain est-elle déductible de la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, si elle a été réalisée par une entreprise et que vous disposez des factures. Les travaux de viabilisation déductibles comprennent : le raccordement au réseau d'eau potable, au réseau d'assainissement, au réseau électrique, au réseau de gaz, et au réseau de télécommunications. Les frais de géomètre-expert pour le bornage, les frais de clôture et les travaux de drainage sont également déductibles. Conservez toutes vos factures — le notaire les demandera au moment de la vente.",
      },
    },
    {
      "@type": "Question",
      name: "Un terrain agricole est-il soumis à la plus-value immobilière ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, la vente d'un terrain agricole par un particulier (non exploitant agricole) est soumise au régime des plus-values immobilières des particuliers, comme tout autre terrain. Les mêmes abattements pour durée de détention s'appliquent. Si le terrain est exploité dans le cadre d'une activité agricole professionnelle, le régime des plus-values professionnelles peut s'appliquer (avec des exonérations spécifiques). Pour les petits terrains agricoles vendus ≤ 15 000€, l'exonération totale s'applique.",
      },
    },
    {
      "@type": "Question",
      name: "Comment est imposée la vente d'un terrain reçu en donation ou succession ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le calcul combine les règles du terrain (pas de forfait 15%) et celles de la donation/succession (valeur déclarée dans l'acte, frais réels uniquement, durée de détention depuis la transmission). Concrètement, le forfait 7,5% ne s'applique pas non plus (car c'est une transmission gratuite) et le forfait 15% travaux non plus (car c'est un terrain). Seuls les droits de mutation réellement payés et les travaux réels facturés sont déductibles. C'est le cas le plus défavorable en termes de déductions.",
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
