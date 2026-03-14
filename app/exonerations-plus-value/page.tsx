import type { Metadata } from "next";
import Link from "next/link";

// ── Métadonnées SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Exonérations Plus-Value Immobilière 2026 — Guide Complet | calculplusvalue.fr",
  description:
    "Tous les cas d'exonération de la plus-value immobilière en 2026 : résidence principale, durée de détention, primo-accédant, retraité, expatrié, expropriation. Guide complet.",
  alternates: {
    canonical: "https://calculplusvalue.fr/exonerations-plus-value",
  },
  openGraph: {
    title: "Exonérations Plus-Value Immobilière 2026 — Guide Complet",
    description:
      "Résidence principale, 22 ans de détention, primo-accédant, retraité, expatrié… Tous les cas d'exonération expliqués avec références légales et exemples.",
    url: "https://calculplusvalue.fr/exonerations-plus-value",
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
      name: "Quand est-on exonéré de plus-value immobilière ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il existe plusieurs cas d'exonération : la vente de la résidence principale (exonération totale sans conditions de montant), la durée de détention supérieure à 22 ans pour l'IR et 30 ans pour les prélèvements sociaux, la première cession avec réemploi dans la résidence principale, le prix de vente inférieur à 15 000 €, les retraités et invalides sous conditions de revenus, l'expropriation avec réemploi, et certains cas pour les non-résidents. Chaque exonération a ses propres conditions cumulatives.",
      },
    },
    {
      "@type": "Question",
      name: "La résidence principale est-elle toujours exonérée de plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, la vente de la résidence principale bénéficie d'une exonération totale de la plus-value (IR et prélèvements sociaux), sans limite de montant. Condition : le bien doit être la résidence habituelle et effective du vendeur au jour de la cession. Si le vendeur a quitté le logement, un délai raisonnable est admis (généralement jusqu'à 1 an), à condition que le bien ne soit pas mis en location et soit activement mis en vente. Cette exonération est la plus puissante du dispositif.",
      },
    },
    {
      "@type": "Question",
      name: "Combien d'années faut-il garder un bien pour ne pas payer de plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour être totalement exonéré d'impôt sur le revenu (19%), il faut détenir le bien depuis au moins 22 ans. Pour être également exonéré des prélèvements sociaux (17,2%), il faut 30 ans de détention. Des abattements progressifs s'appliquent dès la 6e année : pour l'IR, 6%/an de la 6e à la 21e année puis 4% la 22e. Pour les PS, 1,65%/an de la 6e à la 21e, 1,60% la 22e, puis 9%/an de la 23e à la 30e année.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on être exonéré de plus-value sans que le bien soit sa résidence principale ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Plusieurs exonérations ne nécessitent pas que le bien soit la résidence principale : la première cession d'un bien autre que la RP avec réemploi du prix dans l'achat de la RP dans les 24 mois, le prix de vente inférieur à 15 000 €, les conditions liées à la durée de détention (22 ou 30 ans), le statut de retraité ou invalide sous conditions de revenus, l'expropriation avec réemploi de l'indemnité, et la vente à un organisme de logement social.",
      },
    },
    {
      "@type": "Question",
      name: "Les retraités paient-ils la plus-value immobilière ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les retraités peuvent être exonérés de plus-value sous trois conditions cumulatives : être titulaire d'une pension de retraite ou d'une carte d'invalidité à au moins 80%, avoir un revenu fiscal de référence de l'avant-dernière année inférieur au seuil légal (environ 11 500 € pour une personne seule, revalorisé chaque année), et ne pas être soumis à l'IFI (impôt sur la fortune immobilière). Si ces conditions sont remplies, l'exonération est totale (IR + prélèvements sociaux).",
      },
    },
    {
      "@type": "Question",
      name: "L'exonération de plus-value s'applique-t-elle aussi aux prélèvements sociaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cela dépend de l'exonération. La résidence principale, la durée de détention de 30 ans, le prix de vente inférieur à 15 000 €, le réemploi RP, le statut de retraité/invalide et l'expropriation exonèrent à la fois de l'IR et des prélèvements sociaux. En revanche, l'exonération de 150 000 € pour les non-résidents ayant anciennement résidé en France ne porte que sur l'IR : les prélèvements sociaux restent dus. Toujours vérifier les conditions précises de chaque exonération.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si je réinvestis le prix de vente dans ma résidence principale ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si vous n'êtes pas propriétaire de votre résidence principale depuis au moins 4 ans et que vous vendez un autre bien (appartement locatif, résidence secondaire…), vous pouvez bénéficier de l'exonération de première cession. La condition est de réemployer tout ou partie du prix de vente dans l'acquisition ou la construction de votre résidence principale dans les 24 mois suivant la cession. Si le réemploi est total, l'exonération est totale ; si le réemploi est partiel, l'exonération est proportionnelle.",
      },
    },
    {
      "@type": "Question",
      name: "Les non-résidents français peuvent-ils être exonérés de plus-value ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, sous certaines conditions. L'article 150 U II 2° du CGI prévoit une exonération d'IR (pas des PS) sur la plus-value nette jusqu'à 150 000 €, réservée aux personnes ayant été domiciliées fiscalement en France pendant au moins 2 ans, qui cèdent leur bien dans les 10 ans suivant leur départ. Cette exonération n'est utilisable qu'une seule fois. Par ailleurs, si l'ancienne résidence principale est vendue dans l'année civile du départ à l'étranger, l'exonération résidence principale s'applique pleinement.",
      },
    },
  ],
};

// ── Styles partagés ───────────────────────────────────────────────────────────
const colors = {
  indigo: "#2D2B55",
  indigoLight: "#3F3D6E",
  menthe: "#56CBAD",
  bg: "#F4F3FA",
  bgCard: "#FAFAFE",
  border: "#E0DEF0",
  muted: "#6E6B8A",
  mutedLight: "#9B97C4",
  green: "#2D8C5F",
  greenBg: "#E8F7F0",
  greenBorder: "#B5DECA",
  red: "#C0392B",
  redBg: "#FDF0EE",
  redBorder: "#E8B4B0",
  amber: "#D4923A",
  amberBg: "#FFF8EC",
  amberBorder: "#F4D99A",
};

// ── Données exonérations ──────────────────────────────────────────────────────
const exonerations = [
  {
    id: "rp",
    icon: "🏠",
    h2: "Résidence principale — exonération totale",
    article: "Art. 150 U II 1° CGI",
    badge: "Totale — IR + PS",
    badgeColor: colors.green,
    badgeBg: colors.greenBg,
    intro:
      "C'est l'exonération la plus puissante : la vente de votre résidence principale est totalement exonérée d'impôt sur le revenu et de prélèvements sociaux, sans aucune limite de montant.",
    conditions: [
      "Le bien doit être votre résidence habituelle et effective au jour de la cession.",
      "Si vous avez déjà quitté le logement, un délai raisonnable est admis par l'administration (jusqu'à 1 an, parfois plus selon les circonstances), à condition que le bien soit activement mis en vente.",
      "Le bien ne doit pas avoir été loué entre votre départ et la vente.",
      "Applicable à la résidence principale et à ses dépendances immédiates (garage, cave, parking) vendues simultanément.",
    ],
    example:
      "Vous achetez votre appartement 200 000 € en 2010 et le vendez 350 000 € en 2026. Plus-value brute : 150 000 €. Impôt dû : 0 € (exonération totale résidence principale).",
  },
  {
    id: "duree",
    icon: "📅",
    h2: "Durée de détention — exonération progressive",
    article: "Art. 150 VC CGI",
    badge: "Progressive dès 6 ans",
    badgeColor: colors.indigoLight,
    badgeBg: "#EEEDF5",
    intro:
      "Plus vous détenez un bien longtemps, moins vous payez de plus-value. Les abattements commencent dès la 6e année de détention et aboutissent à une exonération totale.",
    conditions: [
      "IR (19%) : abattement de 6%/an de la 6e à la 21e année, puis 4% la 22e → exonération totale après 22 ans.",
      "Prélèvements sociaux (17,2%) : abattement de 1,65%/an de la 6e à la 21e, 1,60% la 22e, puis 9%/an de la 23e à la 30e → exonération totale après 30 ans.",
      "La durée de détention court depuis la date de l'acte authentique d'achat (ou la date du décès / de l'acte de donation pour un bien hérité ou reçu en don).",
      "Aucune démarche à effectuer : le notaire applique automatiquement les abattements.",
    ],
    example:
      "Vous revendez un appartement locatif après 25 ans de détention. Vous êtes totalement exonéré d'IR. Pour les PS, l'abattement est de 1,65% × 16 ans + 1,60% + 9% × 3 ans = 54,80%. Vous ne payez des PS que sur 45,2% de la plus-value.",
  },
  {
    id: "primo",
    icon: "🔑",
    h2: "Première cession — réemploi dans la résidence principale",
    article: "Art. 150 U II 1° bis CGI",
    badge: "Totale* si réemploi total",
    badgeColor: colors.amber,
    badgeBg: colors.amberBg,
    intro:
      "Si vous n'êtes pas propriétaire de votre résidence principale et que vous vendez un autre bien, vous pouvez être exonéré à condition de réinvestir le produit de la vente dans l'achat de votre RP.",
    conditions: [
      "Vous ne devez pas avoir été propriétaire de votre résidence principale au cours des 4 années précédant la cession.",
      "Vous devez réemployer tout ou partie du prix de cession dans l'acquisition ou la construction d'un logement affecté à votre résidence principale.",
      "Le réemploi doit intervenir dans les 24 mois suivant la cession (ou la précéder si la RP est achetée avant la vente).",
      "Si le réemploi est total : exonération totale. Si le réemploi est partiel : l'exonération est proportionnelle au montant réemployé.",
    ],
    example:
      "Vous êtes locataire depuis 5 ans et vendez un studio locatif 150 000 €. Vous achetez votre résidence principale 250 000 € dans les 24 mois. Vous réemployez 100% du prix de vente → exonération totale de la plus-value sur le studio.",
  },
  {
    id: "seuil15k",
    icon: "💶",
    h2: "Cession d'un bien inférieur à 15 000 €",
    article: "Art. 150 U II 6° CGI",
    badge: "Totale — IR + PS",
    badgeColor: colors.green,
    badgeBg: colors.greenBg,
    intro:
      "Lorsque le prix de cession d'un bien est inférieur ou égal à 15 000 €, la plus-value est totalement exonérée. Cette règle concerne surtout les petites surfaces ou les parts d'indivision.",
    conditions: [
      "Le prix de vente ne doit pas dépasser 15 000 €.",
      "Le seuil s'apprécie par bien vendu, pas par vendeur.",
      "En cas d'indivision ou de démembrement, le seuil s'apprécie sur la quote-part revenant à chaque vendeur (non sur le prix global).",
      "Concerne principalement les caves, parkings, garages, petits terrains et parts indivises de faible valeur.",
    ],
    example:
      "Vous vendez votre part dans une cave indivise héritée pour 8 000 €. La plus-value est totalement exonérée, même si la quote-part achetée par l'autre héritier dépasse 15 000 €.",
  },
  {
    id: "retraite",
    icon: "👴",
    h2: "Retraités et invalides — exonération sous conditions de revenus",
    article: "Art. 150 U III CGI",
    badge: "Totale — IR + PS",
    badgeColor: colors.green,
    badgeBg: colors.greenBg,
    intro:
      "Les personnes titulaires d'une pension de retraite ou d'une carte d'invalidité et dont les revenus sont modestes bénéficient d'une exonération totale.",
    conditions: [
      "Être titulaire d'une pension de vieillesse OU d'une carte d'invalidité d'au moins 80%.",
      "Avoir un revenu fiscal de référence (RFR) de l'avant-dernière année (N-2) inférieur au seuil légal : environ 11 885 € pour une part (majoré selon le nombre de parts), revalorisé chaque année.",
      "Ne pas être assujetti à l'IFI (impôt sur la fortune immobilière) au titre de l'une des deux dernières années précédant la cession.",
      "L'exonération s'applique à tout type de bien (pas seulement la résidence principale).",
    ],
    example:
      "Vous êtes retraité avec un RFR N-2 de 10 500 € (1 part). Vous n'êtes pas soumis à l'IFI. Vous vendez une résidence secondaire avec une plus-value de 40 000 €. Impôt dû : 0 € (exonération totale).",
  },
  {
    id: "expropriation",
    icon: "🏗️",
    h2: "Expropriation pour utilité publique — avec réemploi",
    article: "Art. 150 U II 4° CGI",
    badge: "Totale si réemploi",
    badgeColor: colors.indigoLight,
    badgeBg: "#EEEDF5",
    intro:
      "En cas d'expropriation pour cause d'utilité publique, la plus-value sur l'indemnité perçue est exonérée, à condition de réinvestir cette indemnité dans un autre bien immobilier.",
    conditions: [
      "Le bien doit faire l'objet d'une expropriation pour cause d'utilité publique (décision judiciaire ou amiable avec DUP).",
      "La totalité de l'indemnité principale doit être réemployée dans l'acquisition, la construction, la reconstruction ou l'agrandissement d'un ou plusieurs immeubles.",
      "Le réemploi doit intervenir dans les 12 mois suivant la perception de l'indemnité.",
      "Si le réemploi est partiel, l'exonération est proportionnelle.",
    ],
    example:
      "Votre terrain est exproprié pour la construction d'une route nationale. Vous percevez 200 000 € d'indemnité et achetez un autre terrain dans les 12 mois pour 200 000 €. Plus-value exonérée en totalité.",
  },
  {
    id: "non-resident",
    icon: "✈️",
    h2: "Non-résidents — exonération de 150 000 € pour anciens résidents",
    article: "Art. 150 U II 2° CGI",
    badge: "IR exonéré jusqu'à 150K€",
    badgeColor: colors.amber,
    badgeBg: colors.amberBg,
    intro:
      "Les Français expatriés qui vendent un bien en France peuvent bénéficier d'une exonération partielle d'IR sur leur plus-value, sous conditions strictes.",
    conditions: [
      "Avoir été domicilié fiscalement en France pendant au moins 2 ans à tout moment (consécutifs ou non).",
      "La cession doit intervenir au plus tard le 31 décembre de la 10e année suivant le transfert de domicile hors de France.",
      "La plus-value nette (après abattements) ne doit pas dépasser 150 000 €. Au-delà, l'IR est dû sur le surplus.",
      "Cette exonération n'est utilisable qu'une seule fois. Les prélèvements sociaux restent dus.",
    ],
    example:
      "Vous avez quitté la France en 2018 et vendez votre appartement locatif parisien en 2026 avec une plus-value nette de 120 000 €. IR dû : 0 € (exonération art. 150 U II 2°). PS : 120 000 × 7,5% = 9 000 € (taux réduit UE si applicable).",
  },
  {
    id: "logement-social",
    icon: "🏢",
    h2: "Cession à un organisme de logement social",
    article: "Art. 150 U II 7° et 8° CGI",
    badge: "Totale — IR + PS",
    badgeColor: colors.green,
    badgeBg: colors.greenBg,
    intro:
      "La vente d'un bien à un organisme HLM, une société d'économie mixte ou un opérateur privé s'engageant à réaliser des logements sociaux est totalement exonérée.",
    conditions: [
      "Le bien doit être cédé à un organisme d'habitations à loyer modéré (HLM), une société d'économie mixte (SEM) agréée, ou toute personne morale s'engageant à réaliser des logements sociaux.",
      "L'opérateur privé doit prendre l'engagement de réaliser des logements sociaux dans un délai fixé (généralement 4 ans).",
      "La cession doit porter sur un terrain à bâtir ou un immeuble bâti en zone tendue ou dans une zone couverte par un plan de sauvegarde.",
      "Cas de niche, mais particulièrement intéressant pour les propriétaires de terrains constructibles en zone tendue.",
    ],
    example:
      "Vous cédez un terrain constructible en région parisienne à un bailleur social pour 300 000 €. Plus-value de 200 000 €. Impôt dû : 0 € si l'organisme s'engage à construire des logements sociaux dans le délai imparti.",
  },
];

// ── Données tableau récapitulatif ─────────────────────────────────────────────
const tableData = [
  { cas: "Résidence principale", ir: "Totale", ps: "Totale", conditions: "RP au jour de la vente", article: "150 U II 1°", irColor: colors.green, psColor: colors.green },
  { cas: "Détention ≥ 22 ans", ir: "Totale", ps: "Partielle", conditions: "—", article: "150 VC", irColor: colors.green, psColor: colors.amber },
  { cas: "Détention ≥ 30 ans", ir: "Totale", ps: "Totale", conditions: "—", article: "150 VC", irColor: colors.green, psColor: colors.green },
  { cas: "Primo-accédant — réemploi RP", ir: "Totale *", ps: "Totale *", conditions: "Réemploi dans les 24 mois", article: "150 U II 1° bis", irColor: colors.green, psColor: colors.green },
  { cas: "Prix de vente ≤ 15 000 €", ir: "Totale", ps: "Totale", conditions: "Par bien (quote-part si indivision)", article: "150 U II 6°", irColor: colors.green, psColor: colors.green },
  { cas: "Retraité / invalide", ir: "Totale", ps: "Totale", conditions: "RFR < seuil + pas d'IFI", article: "150 U III", irColor: colors.green, psColor: colors.green },
  { cas: "Expropriation", ir: "Totale", ps: "Totale", conditions: "Réemploi dans les 12 mois", article: "150 U II 4°", irColor: colors.green, psColor: colors.green },
  { cas: "Non-résident UE — anciens résidents", ir: "Totale **", ps: "Non", conditions: "≥ 2 ans résidence + < 10 ans départ + PV ≤ 150 000 €", article: "150 U II 2°", irColor: colors.green, psColor: colors.red },
  { cas: "Cession à logement social", ir: "Totale", ps: "Totale", conditions: "Cession à HLM / SEM / opérateur agréé", article: "150 U II 7°-8°", irColor: colors.green, psColor: colors.green },
];

// ── Liens internes ────────────────────────────────────────────────────────────
const internalLinks = [
  { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
  { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Réintégration amortissements 2025" },
  { href: "/plus-value-non-resident", icon: "✈️", title: "Non-résident", desc: "UE 7,5% PS, exonération 150K€" },
  { href: "/plus-value-donation-succession", icon: "📜", title: "Donation / Succession", desc: "Valeur vénale, frais réels déductibles" },
];

// ── Page (Server Component) ───────────────────────────────────────────────────
export default function ExonerationsPlusValue() {
  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Header ── */}
      <div style={{ background: colors.indigo, padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: `${colors.menthe}20`, border: `1px solid ${colors.menthe}40`, borderRadius: 20, padding: "4px 16px", fontSize: 12, color: colors.menthe, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 20 }}>
            Guide complet 2026
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 16, marginTop: 0 }}>
            Exonérations de Plus-Value Immobilière
          </h1>
          <p style={{ fontSize: 16, color: "#C8C6E0", lineHeight: 1.7, marginBottom: 32, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Résidence principale, durée de détention, primo-accédant, retraité, expatrié… Tous les cas où vous ne payez pas (ou moins) de plus-value, expliqués avec conditions et références légales.
          </p>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.menthe, color: colors.indigo, fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}
          >
            Calculer ma plus-value →
          </Link>
        </div>
      </div>

      {/* ── Intro rapide ── */}
      <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { num: "8", label: "cas d'exonération", icon: "✅" },
              { num: "0 €", label: "d'impôt sur la RP", icon: "🏠" },
              { num: "22 ans", label: "pour exonération IR totale", icon: "📅" },
              { num: "30 ans", label: "pour exonération PS totale", icon: "⏳" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "16px 12px", background: colors.bg, borderRadius: 12, border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: colors.indigo, fontWeight: 400 }}>{item.num}</div>
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 1.3 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu éditorial ── */}
      <div style={{ background: "#FFFFFF" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

          {exonerations.map((exo) => (
            <section key={exo.id} style={{ marginBottom: 56, borderBottom: `1px solid ${colors.border}`, paddingBottom: 48 }}>
              {/* En-tête section */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{exo.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: colors.indigo, margin: 0 }}>
                      {exo.h2}
                    </h2>
                    <span style={{ background: exo.badgeBg, color: exo.badgeColor, border: `1px solid ${exo.badgeColor}30`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {exo.badge}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: colors.mutedLight, fontFamily: "monospace" }}>{exo.article}</span>
                </div>
              </div>

              {/* Intro */}
              <p style={{ fontSize: 15, color: colors.muted, lineHeight: 1.7, marginBottom: 20, maxWidth: 780 }}>
                {exo.intro}
              </p>

              {/* Conditions */}
              <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.indigo, marginBottom: 12 }}>✅ Conditions</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                  {exo.conditions.map((cond, ci) => (
                    <li key={ci} style={{ display: "flex", gap: 10, fontSize: 13, color: colors.indigoLight, lineHeight: 1.6 }}>
                      <span style={{ color: colors.menthe, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exemple */}
              <div style={{ background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: colors.green }}>📊 Exemple : </span>
                <span style={{ fontSize: 13, color: colors.indigoLight, lineHeight: 1.6 }}>{exo.example}</span>
              </div>
            </section>
          ))}

        </div>
      </div>

      {/* ── Tableau récapitulatif ── */}
      <div style={{ background: colors.bg, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: colors.indigo, marginBottom: 8, marginTop: 0 }}>
            Tableau récapitulatif des exonérations
          </h2>
          <p style={{ fontSize: 14, color: colors.muted, marginBottom: 24 }}>
            * Proportionnelle si réemploi partiel — ** IR uniquement, prélèvements sociaux restent dus
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.08)" }}>
              <thead>
                <tr style={{ background: colors.indigo, color: "#FFFFFF" }}>
                  {["Cas d'exonération", "IR", "PS", "Conditions principales", "Article CGI"].map((th, i) => (
                    <th key={i} style={{ padding: "14px 16px", textAlign: i === 0 ? "left" : "center", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : colors.bg, borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: colors.indigo, minWidth: 200 }}>{row.cas}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ background: `${row.irColor}15`, color: row.irColor, borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{row.ir}</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ background: `${row.psColor}15`, color: row.psColor, borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{row.ps}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: colors.muted, maxWidth: 260 }}>{row.conditions}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", fontFamily: "monospace", fontSize: 11, color: colors.mutedLight, whiteSpace: "nowrap" }}>{row.article}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CTA principal ── */}
      <div style={{ background: colors.indigo, padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400, color: "#FFFFFF", marginBottom: 12, marginTop: 0 }}>
            Vérifiez si vous êtes exonéré
          </h2>
          <p style={{ fontSize: 15, color: "#C8C6E0", lineHeight: 1.7, marginBottom: 28 }}>
            Simulez votre plus-value gratuitement. Notre calculateur applique automatiquement les abattements pour durée de détention et vous indique si vous êtes dans un cas d'exonération.
          </p>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.menthe, color: colors.indigo, fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}
          >
            Simuler ma plus-value gratuitement →
          </Link>
        </div>
      </div>

      {/* ── Maillage interne ── */}
      <div style={{ background: colors.bg, borderTop: `1px solid ${colors.border}`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: colors.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {internalLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FFFFFF", border: `1px solid ${colors.border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: colors.indigo }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
