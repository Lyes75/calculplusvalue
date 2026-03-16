import type { Metadata } from "next";
import NonResidentClient from "./NonResidentClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Plus-Value Immobilière Non-Résident 2026 — Simulateur Expatrié | calculplusvalue.fr",
  description:
    "Calculez votre impôt sur la plus-value en tant que non-résident ou expatrié. Taux PS réduit UE/EEE (7,5%), exonération 150K€ anciens résidents, représentant fiscal. Simulateur gratuit barèmes 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-non-resident",
  },
  openGraph: {
    title: "Simulateur Plus-Value Non-Résident 2026 — Expatrié français",
    description:
      "Taux réduit UE/EEE (7,5% PS au lieu de 17,2%), exonération 150 000€ pour anciens résidents, représentant fiscal. Simulateur gratuit mis à jour 2026.",
    url: "https://calculplusvalue.fr/plus-value-non-resident",
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
      name: "Quel taux d'imposition pour un non-résident qui vend un bien en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le taux d'IR est de 19 % (art. 200 B du CGI), identique aux résidents. Les prélèvements sociaux sont de 17,2 % hors UE, soit un total de 36,2 % avant abattements. Pour les résidents UE/EEE/Suisse affiliés à la sécurité sociale de leur pays, les PS sont réduits à 7,5 %, soit un total de 26,5 %. Pour les résidents de pays non coopératifs (art. 238-0 A CGI), le taux d'IR est majoré à 75 %.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi les non-résidents UE paient-ils moins de prélèvements sociaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Suite à l'arrêt de Ruyter (CJUE 2015), les non-résidents affiliés à un régime obligatoire de sécurité sociale dans un État de l'UE, de l'EEE, de la Suisse ou du Royaume-Uni ne sont redevables que du prélèvement de solidarité de 7,5 % (au lieu des 17,2 % de CSG-CRDS). Ce taux réduit s'applique automatiquement sur justificatif d'affiliation. Total : 19 % + 7,5 % = 26,5 % avant abattements.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce que l'exonération de 150 000 € pour les expatriés ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'article 150 U II 2° du CGI prévoit une exonération d'IR (pas de PS) sur la plus-value nette jusqu'à 150 000 €. Conditions : avoir été domicilié fiscalement en France pendant au moins 2 ans à un moment quelconque, céder le bien dans les 10 ans suivant le transfert de domicile, et ne pas avoir déjà utilisé cette exonération. Les prélèvements sociaux restent dus. L'exonération est limitée à une seule cession par contribuable.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un représentant fiscal et quand est-il obligatoire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le représentant fiscal accrédité est une société agréée qui vérifie le calcul de la plus-value, signe la déclaration 2048-IMM et se porte garante auprès du fisc. Il est obligatoire pour les non-résidents hors UE/EEE dès que le prix de vente dépasse 150 000 € ou que la PV est positive (art. 244 bis A CGI). Non obligatoire pour les résidents UE/EEE/Suisse depuis 2015. Coût : 0,5 % à 1 % du prix de vente (déductible des frais de cession).",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on vendre son ancienne résidence principale en exonération totale après un départ à l'étranger ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, si la vente intervient au plus tard le 31 décembre de l'année suivant le départ et que le bien n'a pas été mis en location entre-temps (art. 150 U II 1° CGI). L'exonération est alors totale (IR + PS). Au-delà de ce délai, l'exonération de 150 000 € peut s'appliquer si les conditions sont remplies. Il est recommandé de mettre en vente avant le départ pour sécuriser le délai.",
      },
    },
    {
      "@type": "Question",
      name: "Les abattements pour durée de détention s'appliquent-ils aux non-résidents ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les abattements pour durée de détention sont identiques pour les résidents et les non-résidents (art. 150 VC du CGI). Exonération totale d'IR après 22 ans de détention, exonération totale de PS après 30 ans. Comme le taux de PS est réduit pour les non-résidents UE (7,5 % au lieu de 17,2 %), l'économie en euros sur les PS abattus est proportionnellement moindre.",
      },
    },
    {
      "@type": "Question",
      name: "Comment déclarer une plus-value immobilière en tant que non-résident ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La déclaration s'effectue via le formulaire 2048-IMM, déposé par le notaire (ou le représentant fiscal pour les hors UE) lors de la signature. L'impôt est retenu à la source sur le prix de vente. Pour les UE/EEE, le notaire gère directement. Pour les hors UE avec représentant fiscal, celui-ci co-signe la déclaration. Fournir au notaire les justificatifs (acte d'achat, frais, travaux) au moins 2 semaines avant la signature.",
      },
    },
  ],
};

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function PlusValueNonResident() {
  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Simulateur + Contenu (Client Component) */}
      <NonResidentClient />
    </>
  );
}
