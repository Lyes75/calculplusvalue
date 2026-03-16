"use client";
import { useState } from "react";
import Link from "next/link";
import { getAbatIR, getAbatPS } from "@/lib/calcul-engine";

// ── Couleurs ─────────────────────────────────────────────────────────────────
const C = {
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

// ══════════════════════════════════════════════════════════════════════════════
// 1) OUTIL INTERACTIF "ÊTES-VOUS EXONÉRÉ ?"
// ══════════════════════════════════════════════════════════════════════════════

type DiagStep = "q1" | "q2" | "q3" | "q4" | "result";
type DiagResultType = "exonere" | "partiel" | "non";

interface DiagResult {
  type: DiagResultType;
  icon: string;
  title: string;
  text: string;
  cta?: { label: string; href: string };
}

function DiagnosticTool() {
  const [step, setStep] = useState<DiagStep>("q1");
  const [result, setResult] = useState<DiagResult | null>(null);

  const reset = () => { setStep("q1"); setResult(null); };

  const showResult = (r: DiagResult) => { setResult(r); setStep("result"); };

  // ── Question 1 : Résidence principale ? ──
  const handleQ1 = (isRP: boolean) => {
    if (isRP) {
      showResult({
        type: "exonere",
        icon: "✅",
        title: "Exonération totale (IR + PS)",
        text: "La vente de votre résidence principale est exonérée sans condition de montant ni de durée de détention. Aucun impôt sur la plus-value n'est dû.",
        cta: { label: "Simuler quand même pour vérifier →", href: "/" },
      });
    } else {
      setStep("q2");
    }
  };

  // ── Question 2 : Durée de détention ──
  const handleQ2 = (range: "lt6" | "6to21" | "22to29" | "gte30") => {
    if (range === "gte30") {
      showResult({
        type: "exonere",
        icon: "✅",
        title: "Exonération totale (IR + PS)",
        text: "Après 30 ans de détention, vous êtes totalement exonéré d'impôt sur le revenu ET de prélèvements sociaux. Aucun impôt à payer.",
        cta: { label: "Simuler pour confirmer →", href: "/" },
      });
    } else if (range === "22to29") {
      // Calculer l'abattement PS pour une durée moyenne (25 ans par ex.)
      showResult({
        type: "partiel",
        icon: "⏳",
        title: "IR totalement exonéré — PS partiellement dus",
        text: "Après 22 ans, l'impôt sur le revenu (19%) est totalement exonéré. Seuls les prélèvements sociaux restent dus, avec un abattement progressif jusqu'à 30 ans. Simulez le montant exact des PS restants.",
        cta: { label: "Simuler le montant exact des PS →", href: "/" },
      });
    } else if (range === "6to21") {
      showResult({
        type: "partiel",
        icon: "⏳",
        title: "Exonération partielle — abattements progressifs",
        text: "Vous bénéficiez d'abattements progressifs pour durée de détention. L'abattement augmente chaque année dès la 6e année. Simulez votre montant exact pour connaître l'impôt restant.",
        cta: { label: "Calculer mon impôt exact →", href: "/" },
      });
    } else {
      setStep("q3");
    }
  };

  // ── Question 3 : Prix ≤ 15 000€ ? ──
  const handleQ3 = (under15k: boolean) => {
    if (under15k) {
      showResult({
        type: "exonere",
        icon: "✅",
        title: "Exonération totale (IR + PS)",
        text: "Les cessions dont le prix est inférieur ou égal à 15 000 € sont totalement exonérées (art. 150 U II 6° CGI). En indivision, le seuil s'apprécie sur la quote-part de chaque vendeur.",
      });
    } else {
      setStep("q4");
    }
  };

  // ── Question 4 : Situations spéciales ──
  const handleQ4 = (situation: string) => {
    switch (situation) {
      case "retraite":
        showResult({
          type: "exonere",
          icon: "✅",
          title: "Exonération retraité / invalide possible",
          text: "Si votre revenu fiscal de référence (N-2) est inférieur au seuil légal et que vous n'êtes pas soumis à l'IFI, vous êtes totalement exonéré (IR + PS). Vérifiez les seuils de RFR ci-dessous dans notre guide.",
          cta: { label: "Vérifier mon éligibilité →", href: "#retraite" },
        });
        break;
      case "non-resident":
        showResult({
          type: "partiel",
          icon: "⏳",
          title: "Exonération non-résident possible (IR uniquement, jusqu'à 150 000€)",
          text: "Si vous avez résidé en France au moins 2 ans et que vous vendez dans les 10 ans suivant votre départ, votre plus-value nette IR est exonérée jusqu'à 150 000€. Les prélèvements sociaux restent dus.",
          cta: { label: "Simuler avec les taux expatrié →", href: "/plus-value-non-resident" },
        });
        break;
      case "primo":
        showResult({
          type: "exonere",
          icon: "✅",
          title: "Exonération primo-accédant possible",
          text: "Si vous n'avez pas été propriétaire de votre résidence principale depuis 4 ans et réemployez le prix dans l'achat de votre RP dans les 24 mois, l'exonération est totale (ou proportionnelle si réemploi partiel).",
          cta: { label: "En savoir plus →", href: "#primo" },
        });
        break;
      case "expropriation":
        showResult({
          type: "exonere",
          icon: "✅",
          title: "Exonération possible si réemploi de l'indemnité",
          text: "L'expropriation pour utilité publique ouvre droit à une exonération totale si l'indemnité est réemployée dans un autre bien immobilier dans les 12 mois.",
          cta: { label: "Consulter les conditions →", href: "#expropriation" },
        });
        break;
      default:
        showResult({
          type: "non",
          icon: "❌",
          title: "Pas d'exonération applicable",
          text: "Votre situation ne correspond à aucun cas d'exonération totale. Cependant, les abattements pour durée de détention réduisent progressivement l'impôt dès la 6e année. Simulez votre montant exact.",
          cta: { label: "Calculer mon impôt exact →", href: "/" },
        });
    }
  };

  const resultColors = {
    exonere: { bg: "rgba(86,203,173,0.06)", border: "rgba(86,203,173,0.25)" },
    partiel: { bg: "rgba(212,146,58,0.06)", border: "rgba(212,146,58,0.25)" },
    non: { bg: "rgba(224,86,86,0.06)", border: "rgba(224,86,86,0.2)" },
  };

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    padding: "14px 18px",
    background: active ? `${C.menthe}10` : "#fff",
    border: `1px solid ${active ? C.menthe : C.border}`,
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: 14,
    color: C.indigo,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
    lineHeight: 1.5,
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 40px" }}>
      <div style={{ background: "#fff", border: `1px solid #D8D6E8`, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(45,43,85,0.06)" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 6 }}>
          Vérifiez en 30 secondes si vous êtes exonéré
        </h2>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24, marginTop: 0 }}>
          Répondez à quelques questions pour savoir si vous êtes dans un cas d'exonération.
        </p>

        {/* ── Q1 ── */}
        {step === "q1" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.indigo, marginBottom: 16 }}>
              Le bien que vous vendez est-il votre résidence principale ?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => handleQ1(true)} style={btnStyle()}>
                🏠 Oui, c'est ma résidence principale
              </button>
              <button onClick={() => handleQ1(false)} style={btnStyle()}>
                🏢 Non (résidence secondaire, locatif, terrain, SCPI…)
              </button>
            </div>
          </div>
        )}

        {/* ── Q2 ── */}
        {step === "q2" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.indigo, marginBottom: 16 }}>
              Depuis combien d'années détenez-vous le bien ?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => handleQ2("lt6")} style={btnStyle()}>
                📅 Moins de 6 ans
              </button>
              <button onClick={() => handleQ2("6to21")} style={btnStyle()}>
                📅 6 à 21 ans
              </button>
              <button onClick={() => handleQ2("22to29")} style={btnStyle()}>
                📅 22 à 29 ans
              </button>
              <button onClick={() => handleQ2("gte30")} style={btnStyle()}>
                📅 30 ans ou plus
              </button>
            </div>
          </div>
        )}

        {/* ── Q3 ── */}
        {step === "q3" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.indigo, marginBottom: 16 }}>
              Le prix de vente est-il inférieur ou égal à 15 000 € ?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => handleQ3(true)} style={btnStyle()}>
                💶 Oui, ≤ 15 000 €
              </button>
              <button onClick={() => handleQ3(false)} style={btnStyle()}>
                💰 Non, supérieur à 15 000 €
              </button>
            </div>
          </div>
        )}

        {/* ── Q4 ── */}
        {step === "q4" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.indigo, marginBottom: 16 }}>
              Êtes-vous dans l'une de ces situations ?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => handleQ4("retraite")} style={btnStyle()}>
                👴 Retraité ou invalide (carte ≥ 80%) avec revenus modestes
              </button>
              <button onClick={() => handleQ4("non-resident")} style={btnStyle()}>
                ✈️ Non-résident ayant résidé en France ≥ 2 ans
              </button>
              <button onClick={() => handleQ4("primo")} style={btnStyle()}>
                🔑 Locataire depuis &gt; 4 ans, premier achat de RP prévu
              </button>
              <button onClick={() => handleQ4("expropriation")} style={btnStyle()}>
                🏗️ Expropriation / vente à un organisme HLM
              </button>
              <button onClick={() => handleQ4("none")} style={btnStyle()}>
                ❌ Aucune de ces situations
              </button>
            </div>
          </div>
        )}

        {/* ── Résultat ── */}
        {step === "result" && result && (
          <div>
            <div style={{ background: resultColors[result.type].bg, border: `1px solid ${resultColors[result.type].border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{result.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: C.indigo, marginBottom: 8 }}>{result.title}</div>
              <p style={{ fontSize: 14, color: C.indigoLight, lineHeight: 1.7, margin: 0 }}>{result.text}</p>
              {result.cta && (
                <Link href={result.cta.href} style={{ display: "inline-block", marginTop: 16, padding: "10px 20px", background: C.menthe, color: C.indigo, fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none" }}>
                  {result.cta.label}
                </Link>
              )}
            </div>
            <button onClick={reset} style={{ ...btnStyle(), textAlign: "center", fontWeight: 600, color: C.muted, fontSize: 13 }}>
              ↺ Recommencer le diagnostic
            </button>
          </div>
        )}

        {/* Indicateur de progression */}
        {step !== "result" && (
          <div style={{ display: "flex", gap: 6, marginTop: 20, justifyContent: "center" }}>
            {["q1", "q2", "q3", "q4"].map((s, i) => (
              <div key={s} style={{ width: step === s ? 24 : 8, height: 8, borderRadius: 4, background: step === s ? C.menthe : `${C.menthe}30`, transition: "all 0.2s" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2) DONNÉES EXONÉRATIONS (enrichies)
// ══════════════════════════════════════════════════════════════════════════════

const exonerations = [
  {
    id: "rp",
    icon: "🏠",
    h2: "Résidence principale — exonération totale",
    article: "Art. 150 U II 1° CGI",
    badge: "Totale — IR + PS",
    badgeColor: C.green,
    badgeBg: C.greenBg,
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
    ctaLabel: "Simulez votre vente avec le simulateur général →",
    ctaHref: "/",
    // Pièges courants (section 4a)
    traps: [
      "Résidence secondaire déguisée : si vous déclarez un bien comme RP mais n'y vivez pas réellement, le fisc peut requalifier et appliquer la PV + pénalités de 40% à 80%.",
      "Logement vacant depuis longtemps : au-delà d'un délai raisonnable (~1 an), l'exonération est perdue. Ne tardez pas à mettre en vente.",
      "Séparation/divorce : le conjoint qui quitte le logement perd l'exonération RP sur sa quote-part s'il ne vit plus dans le bien au jour de la cession. Le conjoint restant en conserve le bénéfice.",
      "Terrain détaché : la vente d'une partie du jardin n'est PAS couverte par l'exonération RP, sauf vente simultanée avec la maison.",
    ],
  },
  {
    id: "duree",
    icon: "📅",
    h2: "Durée de détention — exonération progressive",
    article: "Art. 150 VC CGI",
    badge: "Progressive dès 6 ans",
    badgeColor: C.indigoLight,
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
    ctaLabel: "Consultez le tableau détaillé des abattements année par année →",
    ctaHref: "/#abattements",
  },
  {
    id: "primo",
    icon: "🔑",
    h2: "Première cession — réemploi dans la résidence principale",
    article: "Art. 150 U II 1° bis CGI",
    badge: "Totale* si réemploi total",
    badgeColor: C.amber,
    badgeBg: C.amberBg,
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
    ctaLabel: "Simulez la plus-value sur votre bien locatif →",
    ctaHref: "/",
    // Note SCPI (section 4b)
    scpiNote: "L'exonération primo-accédant ne s'applique pas à la cession de parts de SCPI. Elle concerne uniquement les biens immobiliers détenus en direct ou les parts de sociétés non cotées (type SCI). Si vous vendez des parts de SCPI pour acheter votre RP, la PV sur les parts reste imposable.",
  },
  {
    id: "seuil15k",
    icon: "💶",
    h2: "Cession d'un bien inférieur à 15 000 €",
    article: "Art. 150 U II 6° CGI",
    badge: "Totale — IR + PS",
    badgeColor: C.green,
    badgeBg: C.greenBg,
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
    badgeColor: C.green,
    badgeBg: C.greenBg,
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
    ctaLabel: "Vérifiez votre éligibilité et simulez →",
    ctaHref: "/",
    // Tableau RFR (section 4c)
    rfrTable: [
      { parts: "1 part", seuil: "~11 885 €" },
      { parts: "1,5 parts", seuil: "~15 059 €" },
      { parts: "2 parts", seuil: "~18 233 €" },
      { parts: "2,5 parts", seuil: "~21 407 €" },
      { parts: "3 parts", seuil: "~24 581 €" },
    ],
  },
  {
    id: "expropriation",
    icon: "🏗️",
    h2: "Expropriation pour utilité publique — avec réemploi",
    article: "Art. 150 U II 4° CGI",
    badge: "Totale si réemploi",
    badgeColor: C.indigoLight,
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
    badgeColor: C.amber,
    badgeBg: C.amberBg,
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
    ctaLabel: "Simulez avec les taux adaptés aux expatriés →",
    ctaHref: "/plus-value-non-resident",
  },
  {
    id: "logement-social",
    icon: "🏢",
    h2: "Cession à un organisme de logement social",
    article: "Art. 150 U II 7° et 8° CGI",
    badge: "Totale — IR + PS",
    badgeColor: C.green,
    badgeBg: C.greenBg,
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

// ── Données tableau récapitulatif (enrichi avec Usage) ────────────────────────
const tableData = [
  { cas: "Résidence principale", ir: "Totale", ps: "Totale", conditions: "RP au jour de la vente", article: "150 U II 1°", irColor: C.green, psColor: C.green, usage: "★★★★★", usageLabel: "Très courant" },
  { cas: "Détention ≥ 22 ans", ir: "Totale", ps: "Partielle", conditions: "—", article: "150 VC", irColor: C.green, psColor: C.amber, usage: "★★★★", usageLabel: "Courant" },
  { cas: "Détention ≥ 30 ans", ir: "Totale", ps: "Totale", conditions: "—", article: "150 VC", irColor: C.green, psColor: C.green, usage: "★★★★", usageLabel: "Courant" },
  { cas: "Primo-accédant — réemploi RP", ir: "Totale *", ps: "Totale *", conditions: "Réemploi dans les 24 mois", article: "150 U II 1° bis", irColor: C.green, psColor: C.green, usage: "★★★", usageLabel: "Modéré" },
  { cas: "Prix de vente ≤ 15 000 €", ir: "Totale", ps: "Totale", conditions: "Par bien (quote-part si indivision)", article: "150 U II 6°", irColor: C.green, psColor: C.green, usage: "★★", usageLabel: "Rare" },
  { cas: "Retraité / invalide", ir: "Totale", ps: "Totale", conditions: "RFR < seuil + pas d'IFI", article: "150 U III", irColor: C.green, psColor: C.green, usage: "★★", usageLabel: "Rare" },
  { cas: "Expropriation", ir: "Totale", ps: "Totale", conditions: "Réemploi dans les 12 mois", article: "150 U II 4°", irColor: C.green, psColor: C.green, usage: "★", usageLabel: "Très rare" },
  { cas: "Non-résident UE — anciens résidents", ir: "Totale **", ps: "Non", conditions: "≥ 2 ans résidence + < 10 ans départ + PV ≤ 150 000 €", article: "150 U II 2°", irColor: C.green, psColor: C.red, usage: "★★", usageLabel: "Rare" },
  { cas: "Cession à logement social", ir: "Totale", ps: "Totale", conditions: "Cession à HLM / SEM / opérateur agréé", article: "150 U II 7°-8°", irColor: C.green, psColor: C.green, usage: "★", usageLabel: "Très rare" },
];

// ── Liens internes ────────────────────────────────────────────────────────────
const internalLinks = [
  { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
  { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Réintégration amortissements 2025" },
  { href: "/plus-value-non-resident", icon: "✈️", title: "Non-résident", desc: "UE 7,5% PS, exonération 150K€" },
  { href: "/plus-value-donation-succession", icon: "📜", title: "Donation / Succession", desc: "Valeur vénale, frais réels déductibles" },
  { href: "/plus-value-sci", icon: "🏛️", title: "Plus-value SCI", desc: "SCI IR, quote-part, surtaxe par associé" },
  { href: "/plus-value-indivision", icon: "⚖️", title: "Indivision / Démembrement", desc: "Quote-part, barème art. 669" },
];

// ══════════════════════════════════════════════════════════════════════════════
// 3) FAQ — 7 questions spécifiques exonérations
// ══════════════════════════════════════════════════════════════════════════════

const FAQ_ITEMS = [
  {
    q: "Peut-on être exonéré si on a quitté sa résidence principale avant la vente ?",
    a: "Oui, sous conditions. L'administration fiscale admet un délai raisonnable entre le départ du logement et la vente, généralement jusqu'à 1 an, à condition que le bien ait été mis en vente dès le départ et qu'il n'ait pas été loué ni occupé par un tiers entre-temps. Au-delà d'un an, l'exonération peut être contestée. Le délai est apprécié au cas par cas selon les circonstances (marché immobilier local, diligences du vendeur). Si le délai est trop long, le bien est requalifié en résidence secondaire et l'exonération RP est perdue.",
  },
  {
    q: "L'exonération résidence principale s'applique-t-elle si je loue une chambre de mon logement ?",
    a: "Oui. L'exonération s'applique à l'ensemble du logement dès lors qu'il constitue votre résidence principale habituelle et effective, même si une partie est louée (chambre meublée, colocation). En revanche, si une partie significative du bien est affectée à un usage professionnel exclusif (cabinet, atelier), cette partie peut être exclue de l'exonération et la PV sur cette fraction sera imposée au prorata.",
  },
  {
    q: "Je suis primo-accédant : comment fonctionne l'exonération avec réemploi partiel ?",
    a: "Si vous ne réemployez qu'une partie du prix de vente dans l'achat de votre résidence principale, l'exonération est proportionnelle au montant réemployé. Par exemple, si vous vendez un bien 200 000 € et n'en réemployez que 150 000 € dans votre RP, l'exonération porte sur 75% de la plus-value (150/200). Les 25% restants sont imposés normalement. Le réemploi doit intervenir dans les 24 mois suivant la cession.",
  },
  {
    q: "Le seuil de 15 000 € s'apprécie-t-il par bien ou par vendeur ?",
    a: "Par cédant pour chaque bien. Si vous vendez seul un bien à 15 000 €, vous êtes exonéré. Si vous vendez à deux (indivision 50/50) un bien à 25 000 €, chaque cédant a une quote-part de 12 500 € — les deux sont exonérés. En revanche, si vous vendez deux biens distincts à 10 000 € chacun le même jour, chaque vente est appréciée séparément — les deux sont exonérées. Le seuil s'apprécie par cession et par cédant.",
  },
  {
    q: "Quelles sont les conditions de revenus pour l'exonération retraité ?",
    a: "Votre revenu fiscal de référence (RFR) de l'avant-dernière année (N-2, soit celui figurant sur l'avis d'imposition de l'année précédente) doit être inférieur au seuil légal, revalorisé chaque année. Pour 2026 (revenus 2024), le seuil est d'environ 11 885 € pour 1 part, majoré d'environ 3 174 € par demi-part supplémentaire. Vous ne devez pas non plus être assujetti à l'IFI au titre de l'une des deux années précédant la cession. Ces deux conditions (RFR + absence d'IFI) sont cumulatives.",
  },
  {
    q: "Peut-on cumuler plusieurs exonérations sur le même bien ?",
    a: "En pratique, non — une seule exonération s'applique par cession. Si vous êtes dans plusieurs cas d'exonération (par exemple, retraité ET détention > 30 ans), la plus favorable s'applique automatiquement. En revanche, certaines exonérations sont utilisables sur des biens différents : l'exonération RP s'applique à chaque vente de RP (pas de limite dans le temps), tandis que l'exonération non-résident 150K€ n'est utilisable qu'une seule fois.",
  },
  {
    q: "Ma résidence secondaire peut-elle être requalifiée en résidence principale pour bénéficier de l'exonération ?",
    a: "C'est risqué. L'administration fiscale vérifie que le bien est votre résidence habituelle et effective — pas simplement un lieu de villégiature. Les indices retenus sont : l'adresse sur vos déclarations fiscales, les factures d'énergie (consommation normale), l'inscription sur les listes électorales, la scolarisation des enfants, la proximité avec votre lieu de travail. Une requalification artificielle (déménager 6 mois avant la vente) peut être considérée comme un abus de droit. Le risque de redressement est réel et les pénalités peuvent atteindre 80% de l'impôt éludé.",
  },
];

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Exonérations de plus-value immobilière
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
              >
                <span style={{ fontWeight: 600, fontSize: 14, color: C.indigo, lineHeight: 1.4, flex: 1 }}>{item.q}</span>
                <span style={{ fontSize: 20, color: C.menthe, fontWeight: 300, flexShrink: 0, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div style={{ padding: "0 18px 16px", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4) SOURCES LÉGALES
// ══════════════════════════════════════════════════════════════════════════════

function SourcesLegales() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 8 }}>📚 Sources légales</div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, margin: 0 }}>
          Art. 150 U II du CGI (cas d'exonération : résidence principale 1°, non-résidents 2°, expropriation 4°, prix ≤ 15 000 € 6°, cession à logement social 7° et 8°) · art. 150 U II 1° bis (primo-accédant réemploi RP) · art. 150 U III (retraités et invalides) · art. 150 VC (abattements durée de détention) · BOI-RFPI-PVI-10-40 (exonérations). Dernière mise à jour : 1er janvier 2026.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — ExonerationsClient
// ══════════════════════════════════════════════════════════════════════════════

export default function ExonerationsClient() {
  return (
    <>
      {/* ── Header ── */}
      <div style={{ background: C.indigo, padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: `${C.menthe}20`, border: `1px solid ${C.menthe}40`, borderRadius: 20, padding: "4px 16px", fontSize: 12, color: C.menthe, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 20 }}>
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
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.menthe, color: C.indigo, fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}
          >
            Calculer ma plus-value →
          </Link>
        </div>
      </div>

      {/* ── Intro rapide ── */}
      <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { num: "8", label: "cas d'exonération", icon: "✅" },
              { num: "0 €", label: "d'impôt sur la RP", icon: "🏠" },
              { num: "22 ans", label: "pour exonération IR totale", icon: "📅" },
              { num: "30 ans", label: "pour exonération PS totale", icon: "⏳" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "16px 12px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.indigo, fontWeight: 400 }}>{item.num}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Outil interactif "Êtes-vous exonéré ?" ── */}
      <div style={{ background: "#FFFFFF", padding: "48px 0 0" }}>
        <DiagnosticTool />
      </div>

      {/* ── Contenu éditorial (8 cas détaillés) ── */}
      <div style={{ background: "#FFFFFF" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

          {exonerations.map((exo) => (
            <section key={exo.id} id={exo.id} style={{ marginBottom: 56, borderBottom: `1px solid ${C.border}`, paddingBottom: 48 }}>
              {/* En-tête section */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{exo.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, margin: 0 }}>
                      {exo.h2}
                    </h2>
                    <span style={{ background: exo.badgeBg, color: exo.badgeColor, border: `1px solid ${exo.badgeColor}30`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {exo.badge}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: C.mutedLight, fontFamily: "monospace" }}>{exo.article}</span>
                </div>
              </div>

              {/* Intro */}
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 20, maxWidth: 780 }}>
                {exo.intro}
              </p>

              {/* Conditions */}
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 12 }}>✅ Conditions</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                  {exo.conditions.map((cond, ci) => (
                    <li key={ci} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoLight, lineHeight: 1.6 }}>
                      <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exemple */}
              <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>📊 Exemple : </span>
                <span style={{ fontSize: 13, color: C.indigoLight, lineHeight: 1.6 }}>{exo.example}</span>
              </div>

              {/* ── Bloc Pièges courants (RP uniquement) ── */}
              {"traps" in exo && exo.traps && (
                <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.12)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 10 }}>⚠️ Pièges courants avec l'exonération RP</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {exo.traps.map((trap, ti) => (
                      <li key={ti} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoLight, lineHeight: 1.6 }}>
                        <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>•</span>
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Note SCPI (primo-accédant uniquement) ── */}
              {"scpiNote" in exo && exo.scpiNote && (
                <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.amber }}>💡 Saviez-vous ? </span>
                  <span style={{ fontSize: 13, color: C.indigoLight, lineHeight: 1.6 }}>{exo.scpiNote}</span>
                </div>
              )}

              {/* ── Tableau RFR retraité ── */}
              {"rfrTable" in exo && exo.rfrTable && (
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 10 }}>📋 Seuils de RFR pour l'exonération retraité/invalide (revenus 2024)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 10 }}>
                    {exo.rfrTable.map((row, ri) => (
                      <div key={ri} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{row.parts}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.indigo }}>{row.seuil}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                    Ces seuils sont revalorisés chaque année. Vérifiez votre RFR sur votre dernier avis d'imposition (page 1, cadre « Vos références »).
                  </p>
                </div>
              )}

              {/* ── Lien contextuel maillage interne ── */}
              {"ctaLabel" in exo && exo.ctaLabel && exo.ctaHref && (
                <Link
                  href={exo.ctaHref}
                  style={{ display: "inline-block", fontSize: 14, color: C.menthe, fontWeight: 600, textDecoration: "none", padding: "6px 0" }}
                >
                  {exo.ctaLabel}
                </Link>
              )}
            </section>
          ))}

        </div>
      </div>

      {/* ── Tableau récapitulatif (avec colonne Usage) ── */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
            Tableau récapitulatif des exonérations
          </h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
            * Proportionnelle si réemploi partiel — ** IR uniquement, prélèvements sociaux restent dus
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.08)" }}>
              <thead>
                <tr style={{ background: C.indigo, color: "#FFFFFF" }}>
                  {["Cas d'exonération", "IR", "PS", "Conditions principales", "Article CGI", "Usage"].map((th, i) => (
                    <th key={i} style={{ padding: "14px 14px", textAlign: i === 0 ? "left" : "center", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: C.indigo, minWidth: 180 }}>{row.cas}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ background: `${row.irColor}15`, color: row.irColor, borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{row.ir}</span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ background: `${row.psColor}15`, color: row.psColor, borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{row.ps}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: C.muted, maxWidth: 240 }}>{row.conditions}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontSize: 11, color: C.mutedLight, whiteSpace: "nowrap" }}>{row.article}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12, color: C.amber }}>{row.usage}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{row.usageLabel}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: "#FFFFFF", paddingTop: 48 }}>
        <FAQSection />
      </div>

      {/* ── Sources légales ── */}
      <div style={{ background: "#FFFFFF" }}>
        <SourcesLegales />
      </div>

      {/* ── CTA principal ── */}
      <div style={{ background: C.indigo, padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400, color: "#FFFFFF", marginBottom: 12, marginTop: 0 }}>
            Vérifiez si vous êtes exonéré
          </h2>
          <p style={{ fontSize: 15, color: "#C8C6E0", lineHeight: 1.7, marginBottom: 28 }}>
            Simulez votre plus-value gratuitement. Notre calculateur applique automatiquement les abattements pour durée de détention et vous indique si vous êtes dans un cas d'exonération.
          </p>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.menthe, color: C.indigo, fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}
          >
            Simuler ma plus-value gratuitement →
          </Link>
        </div>
      </div>

      {/* ── Maillage interne ── */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {internalLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
