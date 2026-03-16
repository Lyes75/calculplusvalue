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
      name: "La surtaxe sur les PV > 50 000€ s'applique-t-elle sur la PV totale du bien ou sur ma quote-part ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sur votre quote-part uniquement. Le seuil de 50 000€ s'apprécie par cédant (art. 1609 nonies G du CGI). Si le bien génère une PV totale de 90 000€ et que vous détenez 50%, votre PV nette est de 45 000€ — en dessous du seuil, pas de surtaxe. Un propriétaire unique aurait payé la surtaxe sur les 90 000€. C'est l'un des avantages fiscaux de l'indivision pour les biens à forte plus-value.",
      },
    },
    {
      "@type": "Question",
      name: "En démembrement, qui paie l'impôt sur la plus-value : l'usufruitier ou le nu-propriétaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les deux. Si le bien est vendu en pleine propriété (vente conjointe usufruit + nue-propriété), le prix de vente est réparti entre l'usufruitier et le nu-propriétaire selon le barème de l'article 669 du CGI, en fonction de l'âge de l'usufruitier au jour de la cession. Chacun calcule sa propre plus-value sur sa fraction et paie son propre impôt. Si seul le nu-propriétaire vend sa nue-propriété (sans l'usufruit), il est seul imposé sur la plus-value de la nue-propriété.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il quand l'usufruitier décède ? Le nu-propriétaire paie-t-il une plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. La réunion de l'usufruit et de la nue-propriété au décès de l'usufruitier n'est pas une cession — elle ne génère aucune plus-value imposable pour le nu-propriétaire. Celui-ci récupère la pleine propriété en franchise d'impôt. C'est tout l'intérêt patrimonial de la donation avec réserve d'usufruit : les parents donnent la nue-propriété, conservent les revenus (usufruit), et au décès, les enfants récupèrent la pleine propriété sans droits de succession ni plus-value.",
      },
    },
    {
      "@type": "Question",
      name: "Un indivisaire peut-il avoir une durée de détention différente des autres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Chaque indivisaire calcule sa durée de détention depuis la date d'acquisition de SA quote-part. Cas classique : trois héritiers reçoivent un bien en 2018 par succession. L'un d'eux rachète les parts d'un autre en 2023. En 2026, les deux héritiers d'origine ont 8 ans de détention (abattements), mais celui qui a racheté n'a que 3 ans sur la part rachetée (aucun abattement). Le calcul se fait par fraction.",
      },
    },
    {
      "@type": "Question",
      name: "Lors d'un partage d'indivision (rachat de parts), y a-t-il une plus-value à payer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En principe, le partage pur et simple (un indivisaire reçoit sa quote-part du bien) n'est pas une cession et ne génère pas de plus-value. En revanche, si un indivisaire reçoit plus que sa quote-part (avec versement d'une soulte aux autres), la soulte reçue par les indivisaires qui cèdent leur part peut générer une plus-value imposable. La soulte est traitée comme un prix de vente. Un droit de partage de 2,5% est également dû sur la valeur nette de l'actif partagé.",
      },
    },
    {
      "@type": "Question",
      name: "Comment choisir entre vendre le bien ou sortir de l'indivision par rachat de parts ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fiscalement, la vente du bien entier à un tiers génère une plus-value immobilière (IR 19% + PS 17,2% − abattements). Le rachat de parts par un indivisaire génère un droit de partage de 2,5% sur la valeur nette du bien (pas de plus-value pour le racheteur, mais plus-value possible pour le vendeur de parts via la soulte). Sur un bien avec forte PV et longue détention, la vente au tiers avec abattements peut être plus avantageuse. Sur un bien avec faible PV, le rachat de parts avec le droit de partage de 2,5% est souvent moins cher. Simulez les deux scénarios.",
      },
    },
    {
      "@type": "Question",
      name: "En indivision successorale, le forfait 7,5% s'applique-t-il ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. En indivision successorale, le bien a été transmis par succession — c'est une acquisition à titre gratuit. Le forfait 7,5% n'est pas applicable (il est réservé aux acquisitions à titre onéreux). Seuls les frais réellement payés (droits de succession, frais de notaire) sont déductibles, au prorata de la quote-part de chaque héritier. Le forfait 15% travaux reste applicable si la détention dépasse 5 ans. Consultez notre simulateur donation/succession pour les détails.",
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
