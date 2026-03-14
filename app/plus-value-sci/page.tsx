import type { Metadata } from "next";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Plus-Value SCI 2026 — Simulateur IR vs IS | calculplusvalue.fr",
  description:
    "Calculez la plus-value de votre SCI à l'IR ou à l'IS. Comparaison des deux régimes. Quote-part, amortissements, taux IS 15% et 25%. Simulateur gratuit.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-sci",
  },
  openGraph: {
    title: "Plus-Value SCI 2026 — Simulateur IR vs IS",
    description:
      "SCI à l'IR : abattements particuliers, exonération à 22 ans. SCI à l'IS : VNC, pas d'abattements, IS 15%/25%. Comparez les deux régimes en temps réel.",
    url: "https://calculplusvalue.fr/plus-value-sci",
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
      name: "Comment est calculée la plus-value d'une SCI à l'IR ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En SCI soumise à l'impôt sur le revenu (transparence fiscale), chaque associé est imposé personnellement sur sa quote-part de plus-value, comme s'il détenait le bien en direct. Le calcul est identique à celui des particuliers : plus-value brute = prix de cession corrigé − prix d'acquisition corrigé (avec frais de notaire et travaux). Des abattements pour durée de détention s'appliquent dès la 6e année, jusqu'à exonération totale d'IR à 22 ans et de prélèvements sociaux à 30 ans.",
      },
    },
    {
      "@type": "Question",
      name: "La plus-value d'une SCI à l'IS bénéficie-t-elle d'abattements pour durée de détention ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. En SCI soumise à l'IS, il n'existe aucun abattement pour durée de détention. La plus-value est calculée sur la valeur nette comptable (prix d'achat moins les amortissements cumulés) et imposée intégralement à l'IS, même après 30 ans de détention. C'est l'une des différences majeures avec le régime IR, particulièrement défavorable à long terme pour les biens immobiliers.",
      },
    },
    {
      "@type": "Question",
      name: "La surtaxe sur les plus-values élevées s'applique-t-elle par associé ou sur la SCI entière ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En SCI à l'IR, la surtaxe progressive (qui s'applique dès 50 000 € de plus-value nette imposable) s'apprécie par associé sur sa quote-part de plus-value, pas sur la SCI entière. Ainsi, si la SCI réalise une plus-value nette de 120 000 € et que chaque associé détient 50%, la quote-part de chaque associé est de 60 000 € — chacun est imposé à la surtaxe de 2% sur ces 60 000 €, et non pas à 6% sur 120 000 €. En SCI à l'IS, la surtaxe ne s'applique pas (c'est l'IS qui s'applique).",
      },
    },
    {
      "@type": "Question",
      name: "Vaut-il mieux être à l'IR ou à l'IS pour la plus-value immobilière en SCI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dans la grande majorité des situations immobilières résidentielles, le régime IR est plus avantageux à long terme pour la plus-value, car les abattements pour durée de détention permettent d'atteindre l'exonération totale après 22 ans (IR) et 30 ans (PS). Le régime IS peut être intéressant pendant la phase de détention (déduction des amortissements réduisant le résultat locatif imposable), mais il se révèle généralement très pénalisant à la revente : pas d'abattement, VNC réduite par les amortissements, et potentielle double imposition lors de la distribution.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si une SCI passe de l'IR à l'IS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le passage de l'IR à l'IS est irrévocable : il n'est pas possible de revenir en arrière. Sur le plan fiscal, ce passage est traité comme une cessation d'activité : il déclenche l'imposition immédiate des plus-values latentes sur tous les biens détenus par la SCI, calculées sur la base de la différence entre la valeur vénale du moment et le coût d'acquisition. Cette imposition peut être très lourde si les biens ont pris de la valeur. Il est impératif de réaliser une simulation complète avec un expert-comptable ou un notaire avant toute décision.",
      },
    },
  ],
};

import SCIClient from "./SCIClient";

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function PlusValueSCIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SCIClient />
    </>
  );
}
