import type { Metadata } from "next";
import DonationClient from "./DonationClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Plus-Value après Donation ou Succession 2026 — Simulateur Gratuit | calculplusvalue.fr",
  description:
    "Calculez la plus-value sur un bien hérité ou reçu en donation. Prix d'acquisition = valeur déclarée dans l'acte. Forfait 7,5% non applicable. Frais réels et forfait travaux déductibles. Simulateur gratuit.",
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
      name: "Comment calculer la plus-value d'un bien hérité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La plus-value d'un bien hérité est égale à la différence entre le prix de vente corrigé (prix de vente moins les frais à votre charge) et le prix d'acquisition corrigé. Pour un bien hérité, le prix d'acquisition est la valeur vénale déclarée dans la déclaration de succession, majorée des droits de succession effectivement payés par l'héritier vendeur et des travaux déductibles. Les mêmes abattements pour durée de détention s'appliquent, depuis la date du décès.",
      },
    },
    {
      "@type": "Question",
      name: "Le forfait 7,5% s'applique-t-il en cas de succession ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le forfait de frais d'acquisition de 7,5% est réservé aux acquisitions à titre onéreux (achat classique). En cas de succession ou de donation, seuls les frais réellement payés sont déductibles : les droits de mutation à titre gratuit (droits de succession ou de donation) effectivement supportés par le vendeur, et les frais de notaire réels. En revanche, le forfait travaux de 15% reste applicable si la durée de détention dépasse 5 ans.",
      },
    },
    {
      "@type": "Question",
      name: "La durée de détention court-elle depuis la donation ou depuis l'achat initial du donateur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La durée de détention court depuis la date de la donation ou du décès, et non depuis la date d'acquisition initiale par le donateur ou le défunt. Pour une donation, c'est la date de l'acte notarié. Pour une succession, c'est la date du décès. Exception notable : pour une donation avec réserve d'usufruit, la durée court depuis la date de la donation initiale (pas la date de réunion de l'usufruit au décès du donateur).",
      },
    },
    {
      "@type": "Question",
      name: "Les droits de succession sont-ils déductibles de la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les droits de succession effectivement payés par le vendeur (l'héritier) sont déductibles et viennent augmenter le prix d'acquisition corrigé, réduisant ainsi la plus-value imposable. Attention : seuls les droits effectivement supportés par l'héritier vendeur sont déductibles. Si le défunt avait souscrit une assurance couvrant les droits de succession, ou si les droits ont été payés par un tiers, ils ne sont pas déductibles.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si la valeur déclarée dans l'acte était sous-évaluée ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si le bien a été déclaré à une valeur inférieure à sa valeur de marché dans l'acte de donation ou la déclaration de succession (pour réduire les droits de mutation à titre gratuit), la conséquence directe est une plus-value imposable plus élevée lors de la vente. De plus, l'administration fiscale peut remettre en cause la valeur déclarée et la rehausser, ce qui entraîne à la fois un redressement sur les droits de mutation et une modification de la base de calcul de la plus-value. Une évaluation correcte dès l'origine est donc préférable.",
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
