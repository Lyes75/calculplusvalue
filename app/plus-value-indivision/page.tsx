import type { Metadata } from "next";
import IndivisionClient from "./IndivisionClient";

export const metadata: Metadata = {
  title: "Plus-Value Indivision & Démembrement 2026 — Simulateur Gratuit | calculplusvalue.fr",
  description:
    "Calculez la plus-value en indivision (quote-part) ou en démembrement (barème art. 669 CGI). Surtaxe appréciée par indivisaire, fraction usufruit/nue-propriété calculée automatiquement.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-indivision",
  },
  openGraph: {
    title: "Plus-Value Indivision & Démembrement 2026 — Simulateur Gratuit",
    description:
      "Indivision : surtaxe par indivisaire, quote-part personnelle. Démembrement : barème art. 669 CGI, usufruit et nue-propriété. Calculez votre impôt gratuitement.",
    url: "https://calculplusvalue.fr/plus-value-indivision",
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
      name: "Comment est calculée la plus-value en cas d'indivision ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En indivision, chaque indivisaire est imposé personnellement sur sa quote-part de plus-value. La plus-value brute globale est calculée normalement (prix de vente − prix d'achat corrigé), puis multipliée par la quote-part du cédant. La surtaxe progressive (au-delà de 50 000 € de PV nette IR) s'apprécie par indivisaire, pas sur le bien entier. Les abattements pour durée de détention s'appliquent normalement.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le barème art. 669 CGI pour le démembrement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le barème de l'article 669 du CGI détermine la valeur de l'usufruit et de la nue-propriété en fonction de l'âge de l'usufruitier à la date de la cession. Par exemple, un usufruitier de 65 ans (tranche 61–70 ans) voit son usufruit valorisé à 40% et la nue-propriété à 60%. Ces fractions servent à répartir le prix de vente entre usufruitier et nu-propriétaire, chacun calculant sa plus-value sur sa fraction.",
      },
    },
    {
      "@type": "Question",
      name: "La réunion de l'usufruit et de la nue-propriété génère-t-elle une plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. La réunion de l'usufruit et de la nue-propriété au décès de l'usufruitier n'est pas considérée comme une cession. Le nu-propriétaire ne réalise pas de plus-value imposable à ce moment-là. C'est l'un des avantages de la donation avec réserve d'usufruit.",
      },
    },
    {
      "@type": "Question",
      name: "Depuis quand court la durée de détention pour un bien acquis en succession ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour un bien reçu par succession, la durée de détention court depuis la date du décès du défunt, pas depuis la date à laquelle le défunt avait acquis le bien. Le prix d'acquisition retenu est la valeur déclarée dans la déclaration de succession (valeur vénale au jour du décès). Si les héritiers conservent le bien en indivision et le vendent plus tard, la durée de détention est calculée depuis la date du décès.",
      },
    },
    {
      "@type": "Question",
      name: "Le seuil de surtaxe de 50 000 € s'applique-t-il par bien ou par vendeur en indivision ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le seuil de surtaxe de 50 000 € s'apprécie par cédant (par indivisaire), pas par bien. Ainsi, si un appartement génère 200 000 € de plus-value nette IR et est vendu par 4 indivisaires à parts égales, chaque indivisaire a 50 000 € de plus-value nette, ce qui correspond exactement au seuil. Aucune surtaxe n'est due pour les seuils inférieurs à 50 000 €. C'est un avantage significatif de l'indivision pour les biens générant de fortes plus-values.",
      },
    },
  ],
};

export default function PlusValueIndivisionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <IndivisionClient />
    </>
  );
}
