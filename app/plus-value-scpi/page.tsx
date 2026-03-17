import type { Metadata } from "next";
import SCPIClient from "./SCPIClient";

export const metadata: Metadata = {
  title: "Simulateur plus-value SCPI - Revente parts SCPI | calculplusvalue.fr",
  description:
    "Simulateur plus-value SCPI gratuit. Calculez l'impôt à la revente de vos parts. Barèmes CGI 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-scpi",
  },
  openGraph: {
    title: "Plus-Value SCPI 2026 — Simulateur Cession de Parts",
    description:
      "Parts de SCPI en direct : régime des particuliers, frais de souscription 8-12% déductibles, abattements 22 ans IR / 30 ans PS. Calculez votre impôt gratuitement.",
    url: "https://calculplusvalue.fr/plus-value-scpi",
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
      name: "Les parts de SCPI en assurance-vie sont-elles concernées par ce simulateur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Les parts de SCPI détenues dans un contrat d'assurance-vie ou un PER sont soumises à la fiscalité de l'enveloppe (assurance-vie ou PER), pas au régime des plus-values immobilières. La taxation se fait lors des retraits du contrat, au PFU de 30% ou au barème progressif selon l'option choisie, avec un abattement après 8 ans en assurance-vie. Ce simulateur ne concerne que les parts détenues en direct (achat en pleine propriété ou en démembrement, hors enveloppe fiscale).",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il choisir le forfait 7,5% ou les frais réels pour les SCPI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dans 90% des cas, les frais réels sont plus avantageux. Les frais de souscription des SCPI sont généralement de 8 à 12% du montant souscrit, bien supérieurs au forfait 7,5%. L'exception concerne les parts achetées sur le marché secondaire, où les frais sont très faibles. Dans ce cas, le forfait 7,5% est nettement préférable. Demandez toujours le justificatif de frais à votre société de gestion avant de faire le choix.",
      },
    },
    {
      "@type": "Question",
      name: "Comment connaître mes frais de souscription exacts ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contactez votre société de gestion (Corum, Primonial, Amundi, La Française, etc.) et demandez une attestation de frais de souscription. Le montant figure généralement sur votre bulletin de souscription initial. Si vous avez acheté via un conseiller ou une plateforme, les frais peuvent avoir été négociés à la baisse — vérifiez le montant effectivement payé, pas le taux affiché par la SCPI.",
      },
    },
    {
      "@type": "Question",
      name: "La durée de détention court-elle depuis la souscription ou depuis la jouissance des parts ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La durée de détention pour le calcul des abattements court depuis la date d'acquisition des parts, c'est-à-dire la date de souscription effective (date de paiement) ou la date d'achat sur le marché secondaire. Ce n'est PAS la date de jouissance (qui est la date à partir de laquelle vous percevez les dividendes, souvent 3 à 6 mois après la souscription). La date d'acquisition figure sur votre bulletin de souscription.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on déduire des travaux pour réduire la plus-value sur des parts de SCPI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le forfait 15% pour travaux et la déduction de travaux réels ne s'appliquent pas aux parts de SCPI. Vous ne pouvez pas déduire les travaux réalisés par la SCPI sur son patrimoine immobilier — ces travaux sont supportés par la société et impactent la valeur de la part, mais ne constituent pas des dépenses engagées par l'associé. Les seules déductions possibles sont les frais d'acquisition et les frais de cession éventuels.",
      },
    },
    {
      "@type": "Question",
      name: "Comment est calculée la plus-value si j'ai souscrit en plusieurs fois (DCA) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si vous avez souscrit des parts à des dates et prix différents (investissement progressif), chaque lot de parts a son propre prix d'acquisition et sa propre durée de détention. Lors de la revente, vous pouvez choisir la méthode FIFO (First In, First Out — les parts les plus anciennes sont vendues en premier, donc avec les abattements les plus élevés) ou vendre un lot spécifique. La méthode FIFO est souvent la plus avantageuse.",
      },
    },
    {
      "@type": "Question",
      name: "La surtaxe sur les plus-values > 50 000€ s'applique-t-elle aux SCPI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Si votre plus-value nette d'IR dépasse 50 000€, la surtaxe progressive de 2% à 6% s'applique comme pour un bien en direct. En pratique, cette surtaxe est rare sur les SCPI car les montants investis par particulier dépassent rarement le seuil qui génère une PV nette > 50K€.",
      },
    },
  ],
};

export default function PlusValueSCPIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SCPIClient />
    </>
  );
}
