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

// ── FAQ JSON-LD (6 questions — synchronisé avec LMNPClient.tsx) ──────────────
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Les amortissements LMNP sont-ils toujours réintégrés dans la plus-value en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Depuis la loi de finances 2025, les amortissements admis en déduction au titre de l'article 39C du CGI sont réintégrés dans le calcul du prix d'acquisition corrigé lors de la revente. Cela concerne les amortissements du bien immobilier comme du mobilier. Le prix d'achat corrigé est diminué du montant total des amortissements déduits, ce qui augmente mécaniquement la plus-value imposable.",
      },
    },
    {
      "@type": "Question",
      name: "Quels amortissements sont concernés par la réintégration ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tous les amortissements admis en déduction des revenus BIC au titre du régime réel LMNP. Cela inclut l'amortissement du bâti, du mobilier, des travaux d'amélioration et des frais d'acquisition amortis. Les amortissements correspondant à des travaux de construction, reconstruction ou agrandissement déjà pris en compte dans le prix d'acquisition ne sont pas réintégrés une seconde fois. En micro-BIC, la question ne se pose pas puisqu'aucun amortissement n'est déduit.",
      },
    },
    {
      "@type": "Question",
      name: "Comment calculer la plus-value d'un LMNP en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le calcul suit le régime des plus-values des particuliers, avec une modification : PV brute = Prix de vente corrigé − (Prix d'achat + frais d'acquisition + travaux − amortissements déduits). Ensuite, appliquez les abattements pour durée de détention (6% par an en IR de la 6e à la 21e année, exonération à 22 ans). Le taux reste de 19% d'IR + 17,2% de PS. Notre simulateur en haut de page calcule tout automatiquement.",
      },
    },
    {
      "@type": "Question",
      name: "Le micro-BIC est-il concerné par la réintégration des amortissements ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le régime micro-BIC applique un abattement forfaitaire de 50% sur les recettes sans amortissement comptable. Il n'y a donc rien à réintégrer. La réforme ne concerne que les LMNP au régime réel qui ont effectivement déduit des amortissements.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on encore éviter l'impôt sur la plus-value en LMNP ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, plusieurs voies restent ouvertes. L'exonération par durée de détention reste applicable : exonération totale d'IR après 22 ans et de PS après 30 ans, y compris sur la fraction liée aux amortissements réintégrés. Le passage en LMP peut aussi permettre une exonération totale si les conditions sont réunies (activité > 5 ans, recettes < 90 000 €). Enfin, la vente de la résidence principale reste toujours exonérée si le bien est requalifié en RP avant la vente.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre LMNP et LMP pour la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En LMNP, la plus-value suit le régime des particuliers avec abattements pour durée de détention et réintégration des amortissements depuis 2025. En LMP, la plus-value relève du régime des plus-values professionnelles, avec une exonération totale possible après 5 ans d'activité si les recettes sont inférieures à 90 000 € (art. 151 septies CGI). Le statut LMP s'applique automatiquement si vos recettes dépassent 23 000 €/an ET vos autres revenus professionnels.",
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
