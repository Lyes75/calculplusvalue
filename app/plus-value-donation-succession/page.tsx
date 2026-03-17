import type { Metadata } from "next";
import DonationClient from "./DonationClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Simulateur plus-value immobilière succession et donation 2026 | calculplusvalue.fr",
  description:
    "Calculez la plus-value d'un bien hérité ou reçu en donation. Gratuit, barèmes 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-donation-succession",
  },
  openGraph: {
    title: "Simulateur Plus-Value Donation / Succession 2026",
    description:
      "Valeur déclarée dans l'acte, droits de mutation déductibles, forfait 7,5% non applicable. Calculez votre impôt sur la plus-value après héritage ou donation.",
    url: "https://calculplusvalue.fr/plus-value-donation-succession",
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
      name: "Peut-on utiliser le forfait de 7,5% pour les frais d'acquisition d'un bien hérité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le forfait de 7,5% est réservé aux acquisitions à titre onéreux (achat). Pour un bien reçu par donation ou succession, seuls les frais réellement engagés et payés par le vendeur (héritier ou donataire) sont déductibles. Il s'agit principalement des droits de mutation à titre gratuit et des frais de notaire liés à l'acte. Si le donateur a pris les droits à sa charge, le donataire ne peut pas les déduire.",
      },
    },
    {
      "@type": "Question",
      name: "La durée de détention repart-elle à zéro après une donation ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. En cas de donation, la durée de détention pour le calcul des abattements court à partir de la date de l'acte notarié de donation, pas de la date d'acquisition initiale par le donateur. Si votre parent avait acheté le bien il y a 30 ans et vous l'a donné il y a 2 ans, votre durée de détention est de 2 ans et vous n'avez aucun abattement. Exception notable : en donation avec réserve d'usufruit, le délai court depuis la date de la donation initiale de la nue-propriété.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre la valeur déclarée basse et une valeur juste ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une valeur déclarée basse réduit les droits de mutation au moment de la succession ou donation, mais augmente la plus-value imposable lors de la revente. Inversement, une valeur fidèle au marché augmente les droits mais réduit la PV. Dans la plupart des cas, le gain sur la PV est supérieur au surcoût en droits de mutation, car la PV est taxée à 36,2% tandis que les droits bénéficient d'abattements spécifiques (100 000€ par enfant en ligne directe). Le fisc peut contester une valeur sous-évaluée.",
      },
    },
    {
      "@type": "Question",
      name: "Un bien hérité en indivision : comment calculer la PV ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En cas de succession avec plusieurs héritiers, le bien est en indivision. Chaque héritier est imposé sur sa quote-part de plus-value. Le seuil de surtaxe (50 000€ de PV nette) s'apprécie par héritier, pas sur la totalité. Si la PV totale est de 80 000€ et que vous êtes 2 héritiers à 50%, votre quote-part est de 40 000€ — en dessous du seuil de surtaxe.",
      },
    },
    {
      "@type": "Question",
      name: "La résidence principale du défunt est-elle exonérée de plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pas automatiquement. L'exonération résidence principale bénéficie au vendeur, pas au défunt. Si le bien était la résidence principale du défunt mais pas la vôtre, l'exonération ne s'applique pas. En revanche, si vous avez occupé le bien comme votre propre résidence principale après la succession et jusqu'au jour de la vente, l'exonération peut s'appliquer. Le bien doit être VOTRE résidence principale au jour de la cession.",
      },
    },
    {
      "@type": "Question",
      name: "Donation-partage ou donation simple : quelles conséquences sur la PV ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fiscalement, le calcul de la PV est identique dans les deux cas : la valeur d'acquisition est celle déclarée dans l'acte, et la durée de détention court à partir de la date de la donation. La différence est juridique : la donation-partage fige les valeurs, tandis que la donation simple peut être rapportée à la succession. Pour la PV, c'est toujours la valeur figurant dans l'acte de donation qui sert de base de calcul.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il déclarer la plus-value si le bien est vendu moins cher que la valeur déclarée ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Si le prix de vente est inférieur à la valeur déclarée dans l'acte de succession ou de donation (majorée des frais déductibles), la plus-value est négative — il y a une moins-value. Aucun impôt n'est dû. En revanche, cette moins-value n'est pas imputable sur d'autres plus-values immobilières ni sur votre revenu global. C'est un cas fréquent quand le bien a été surévalué dans l'acte ou quand le marché a baissé.",
      },
    },
  ],
};

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function PlusValueDonationSuccession() {
  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Simulateur + Contenu (Client Component) */}
      <DonationClient />
    </>
  );
}
