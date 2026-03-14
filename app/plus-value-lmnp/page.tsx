import type { Metadata } from "next";
import LMNPClient from "./LMNPClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Simulateur Plus-Value LMNP 2026 — Réintégration des amortissements (Réforme 2025)",
  description:
    "Calculez la plus-value imposable de votre bien LMNP en tenant compte de la réintégration des amortissements (réforme LF 2025 — art. 150 VB II CGI). Simulateur gratuit, barèmes 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-lmnp",
  },
  openGraph: {
    title: "Simulateur Plus-Value LMNP 2026 — Réforme des amortissements",
    description:
      "Simulez l'impact de la réintégration des amortissements sur votre impôt de plus-value LMNP. Outil gratuit mis à jour pour la loi de finances 2025.",
    url: "https://calculplusvalue.fr/plus-value-lmnp",
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
      name: "Qu'est-ce que la réforme LMNP 2025 sur les amortissements ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La loi de finances 2025 (art. 150 VB II du CGI) prévoit que les amortissements admis en déduction des revenus LMNP (sur le bien immobilier, les meubles, les travaux) doivent être réintégrés dans le calcul de la plus-value immobilière. Concrètement, le montant des amortissements déduits est soustrait du prix d'acquisition corrigé, ce qui augmente mécaniquement la plus-value imposable.",
      },
    },
    {
      "@type": "Question",
      name: "Comment calculer la plus-value d'un bien LMNP avec la réforme 2025 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La formule est : Plus-value = Prix de vente corrigé − (Prix d'achat + Frais d'acquisition + Travaux − Amortissements déduits). Les amortissements réintégrés réduisent le prix d'acquisition corrigé, augmentant ainsi la plus-value brute soumise aux abattements pour durée de détention. Notre simulateur effectue ce calcul automatiquement.",
      },
    },
    {
      "@type": "Question",
      name: "Les abattements pour durée de détention s'appliquent-ils encore en LMNP ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les abattements pour durée de détention restent applicables aux biens LMNP : 6% par an de la 6e à la 21e année pour l'IR (exonération à 22 ans), et 1,65% par an de la 6e à la 21e année + 9% par an de la 23e à la 30e année pour les prélèvements sociaux (exonération à 30 ans). La réforme 2025 ne modifie que la base de calcul de la plus-value brute.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre LMNP et LMP pour la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En LMNP, la plus-value relève du régime des particuliers (art. 150 U CGI) avec les taux de 19% d'IR et 17,2% de PS, et les abattements pour durée de détention. En LMP (recettes > 23 000 € et > autres revenus professionnels), la plus-value relève des plus-values professionnelles : exonération totale après 5 ans d'activité si les recettes sont < 90 000 € (art. 151 septies CGI), sinon imposition au barème progressif.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on éviter la réintégration des amortissements en LMNP ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il n'est pas possible d'éviter légalement la réintégration des amortissements depuis la loi de finances 2025. Cependant, plusieurs stratégies peuvent limiter l'impact : attendre une durée de détention longue pour bénéficier des abattements, optimiser le prix de vente, ou passer sous le régime LMP si les conditions sont remplies et que la plus-value professionnelle est exonérée. Consultez un conseiller fiscal pour votre situation.",
      },
    },
  ],
};

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function PlusValueLMNP() {
  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Simulateur + Contenu (Client Component) */}
      <LMNPClient />
    </>
  );
}
