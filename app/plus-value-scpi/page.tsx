import type { Metadata } from "next";
import SCPIClient from "./SCPIClient";

export const metadata: Metadata = {
  title: "Plus-Value SCPI 2026 — Simulateur Cession de Parts | calculplusvalue.fr",
  description:
    "Calculez l'impôt sur la plus-value lors de la revente de parts de SCPI. Frais de souscription déductibles, abattements pour durée de détention. Simulateur gratuit.",
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
      name: "Comment est calculée la plus-value sur des parts de SCPI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La plus-value sur des parts de SCPI détenues en direct est calculée exactement comme une plus-value immobilière classique des particuliers. La plus-value brute = prix de cession − prix de souscription − frais de souscription. Des abattements pour durée de détention s'appliquent dès la 6e année, jusqu'à exonération totale d'IR à 22 ans et de prélèvements sociaux à 30 ans. Le taux d'imposition est de 19% (IR) + 17,2% (PS) = 36,2% avant abattements.",
      },
    },
    {
      "@type": "Question",
      name: "Les frais de souscription SCPI sont-ils déductibles de la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les frais de souscription sont déductibles du prix de revient des parts, ce qui réduit la plus-value imposable. Vous avez le choix entre le forfait de 7,5% du prix de souscription (sans justificatif) ou les frais réels effectivement payés (avec justificatif de la société de gestion). Les frais de souscription SCPI étant généralement de 8 à 12%, les frais réels sont presque toujours supérieurs au forfait 7,5% — il est donc conseillé d'opter pour les frais réels.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre SCPI en direct et SCPI en assurance-vie pour la plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La différence est fondamentale. Les parts de SCPI détenues en direct (hors enveloppe) relèvent du régime des plus-values immobilières des particuliers, avec les abattements pour durée de détention. Les parts de SCPI détenues dans un contrat d'assurance-vie ou un PER relèvent de la fiscalité de l'enveloppe (assurance-vie ou PER), pas du régime des plus-values immobilières. Ce simulateur concerne uniquement les parts de SCPI détenues en direct.",
      },
    },
    {
      "@type": "Question",
      name: "La durée de détention des parts de SCPI compte-t-elle pour les abattements ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, la durée de détention des parts de SCPI est prise en compte pour les abattements, exactement comme pour un bien immobilier en direct. Elle court depuis la date de souscription (ou d'achat en marché secondaire). Les abattements commencent à la 6e année de détention (6%/an pour l'IR), l'exonération totale d'IR intervient à 22 ans, et l'exonération totale des prélèvements sociaux à 30 ans.",
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
