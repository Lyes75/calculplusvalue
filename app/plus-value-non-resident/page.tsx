import type { Metadata } from "next";
import NonResidentClient from "./NonResidentClient";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Plus-Value Immobilière Non-Résident 2026 — Simulateur Expatrié | calculplusvalue.fr",
  description:
    "Calculez votre impôt sur la plus-value en tant que non-résident ou expatrié. Taux PS réduit UE/EEE (7,5%), exonération 150K€ anciens résidents, représentant fiscal. Simulateur gratuit barèmes 2026.",
  alternates: {
    canonical: "https://calculplusvalue.fr/plus-value-non-resident",
  },
  openGraph: {
    title: "Simulateur Plus-Value Non-Résident 2026 — Expatrié français",
    description:
      "Taux réduit UE/EEE (7,5% PS au lieu de 17,2%), exonération 150 000€ pour anciens résidents, représentant fiscal. Simulateur gratuit mis à jour 2026.",
    url: "https://calculplusvalue.fr/plus-value-non-resident",
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
      name: "Quel taux d'imposition pour un non-résident qui vend un bien en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un non-résident est soumis à l'impôt sur le revenu au taux de 19% (art. 200 B du CGI), identique aux résidents. Pour les résidents hors UE, les prélèvements sociaux s'élèvent à 17,2%, soit un total de 36,2% avant abattements. Pour les résidents de pays non coopératifs (liste art. 238-0 A CGI), le taux d'IR est majoré à 33,33% (art. 244 bis A CGI). Les mêmes abattements pour durée de détention s'appliquent : exonération IR à 22 ans, PS à 30 ans.",
      },
    },
    {
      "@type": "Question",
      name: "Les non-résidents UE paient-ils les mêmes prélèvements sociaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Les non-résidents ressortissants de l'UE, de l'EEE, de la Suisse ou du Royaume-Uni qui sont affiliés à un régime obligatoire de sécurité sociale dans leur pays de résidence bénéficient d'un taux de prélèvements sociaux réduit à 7,5% (au lieu de 17,2%). Ce taux réduit résulte de la jurisprudence de Ruyter de la CJUE et s'applique depuis 2015. Le total IR + PS s'élève alors à 26,5% au lieu de 36,2%.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un représentant fiscal et est-il obligatoire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le représentant fiscal accrédité est une société agréée par l'administration fiscale française qui représente le vendeur non-résident, vérifie le calcul de la plus-value, signe la déclaration 2048-IMM et se porte garant auprès du fisc. Il est obligatoire pour les non-résidents hors UE/EEE lorsque le prix de vente dépasse 150 000 € ou que la plus-value est positive (art. 244 bis A CGI). Il n'est plus obligatoire pour les résidents de l'UE/EEE depuis 2015. Son coût est généralement de 0,5% à 1% du prix de vente.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on être exonéré de plus-value en tant qu'expatrié ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, sous certaines conditions. L'article 150 U II 2° du CGI prévoit une exonération d'IR sur la plus-value nette jusqu'à 150 000 €, réservée aux non-résidents ayant été domiciliés fiscalement en France pendant au moins 2 ans à tout moment, qui cèdent leur bien dans les 10 ans suivant leur départ. Les prélèvements sociaux restent dus. Cette exonération ne peut être utilisée qu'une seule fois. Par ailleurs, la vente de l'ancienne résidence principale dans l'année du départ bénéficie d'une exonération totale (art. 150 U II 1° CGI).",
      },
    },
    {
      "@type": "Question",
      name: "Comment déclarer une plus-value immobilière en tant que non-résident ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La déclaration s'effectue via le formulaire 2048-IMM (ou 2048-M pour les terrains), déposé par le notaire (ou le représentant fiscal pour les non-résidents hors UE) lors de la signature de l'acte de vente. L'impôt est retenu à la source directement sur le prix de vente et versé au Trésor par le notaire. Pour les résidents UE/EEE, le notaire peut gérer la procédure sans représentant fiscal. Il est conseillé de fournir au notaire tous les justificatifs de prix d'achat, frais d'acquisition et travaux avant la signature.",
      },
    },
  ],
};

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function PlusValueNonResident() {
  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Simulateur + Contenu (Client Component) */}
      <NonResidentClient />
    </>
  );
}
