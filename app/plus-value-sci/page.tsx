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
        text: "En SCI soumise à l'IR (transparence fiscale), chaque associé est imposé personnellement sur sa quote-part de plus-value, selon le régime des plus-values des particuliers. Le calcul est identique à celui d'un particulier : prix de vente − prix d'achat corrigé, puis abattements pour durée de détention (exonération IR après 22 ans, PS après 30 ans). La seule différence est que tous les montants sont proratisés selon votre pourcentage de parts dans la SCI.",
      },
    },
    {
      "@type": "Question",
      name: "La plus-value d'une SCI à l'IS bénéficie-t-elle d'abattements pour durée de détention ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. C'est la différence fondamentale entre l'IR et l'IS. En SCI à l'IS, la plus-value est une plus-value professionnelle calculée sur la valeur nette comptable (prix d'achat − amortissements cumulés). Il n'y a aucun abattement pour durée de détention. Même après 30 ans, la totalité de la plus-value est imposée au taux de l'IS (15% jusqu'à 42 500€ de bénéfice, 25% au-delà). En revanche, il n'y a pas de prélèvements sociaux au niveau de la société.",
      },
    },
    {
      "@type": "Question",
      name: "La surtaxe sur les plus-values élevées s'applique-t-elle par associé ou sur la SCI entière ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En SCI à l'IR, la surtaxe (2% à 6% au-delà de 50 000€ de PV nette) s'apprécie par associé, sur sa quote-part de plus-value. Concrètement, si la SCI réalise une plus-value de 80 000€ et que vous détenez 50% des parts, votre quote-part est de 40 000€ — en dessous du seuil de 50 000€. Vous échappez à la surtaxe alors qu'un propriétaire unique l'aurait payée. En SCI à l'IS, la surtaxe ne s'applique pas (c'est un impôt sur les sociétés, pas sur les particuliers).",
      },
    },
    {
      "@type": "Question",
      name: "Vaut-il mieux être à l'IR ou à l'IS pour la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ça dépend de la durée de détention et du montant des amortissements. À l'IR, les abattements réduisent l'impôt avec le temps et l'exonération est totale après 22-30 ans. À l'IS, pas d'abattement mais un taux potentiellement plus bas (15% vs 36,2%) et pas de PS. Sur une détention courte (< 10 ans) avec peu d'amortissements, l'IS peut être avantageux. Sur une détention longue (> 15 ans), l'IR est presque toujours préférable.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si on passe de l'IR à l'IS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le passage de l'IR à l'IS est irrévocable et déclenche des conséquences fiscales immédiates. Les biens détenus par la SCI sont réputés apportés à une société à l'IS, ce qui génère une imposition de la plus-value latente comme si les biens étaient vendus. De plus, les amortissements commencent à courir depuis la date du passage (sur la valeur vénale à cette date), réduisant la valeur nette comptable pour le futur calcul de PV à l'IS. C'est une décision structurante à ne prendre qu'après avis d'un expert-comptable.",
      },
    },
    {
      "@type": "Question",
      name: "Les associés d'une SCI à l'IR peuvent-ils avoir des durées de détention différentes ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, si les parts ont été acquises à des dates différentes. Chaque associé calcule sa durée de détention à partir de la date d'acquisition de ses propres parts (achat, donation, succession). Si un associé a acquis ses parts il y a 25 ans et un autre il y a 5 ans, leurs abattements seront très différents. Le premier sera exonéré d'IR, le second n'aura aucun abattement.",
      },
    },
    {
      "@type": "Question",
      name: "Comment sont imposés les associés lors de la distribution du prix de vente en SCI IS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En SCI à l'IS, l'impôt sur la plus-value est payé par la société (IS 15%/25%). Mais quand les associés se distribuent le produit de la vente sous forme de dividendes, une seconde imposition s'applique au niveau personnel : flat tax à 30% (12,8% IR + 17,2% PS) ou option pour le barème progressif avec abattement de 40%. C'est la double imposition qui rend le régime IS souvent moins avantageux qu'il n'y paraît à première vue. Le coût fiscal total (IS + imposition des dividendes) peut dépasser le coût en SCI IR sur une détention longue.",
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
