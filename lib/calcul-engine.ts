import {
  TAUX_IR, TAUX_IR_PAYS_NON_COOPERATIF, TAUX_PS_RESIDENT, TAUX_PS_NON_RESIDENT_EEE,
  ABAT_IR_PAR_AN, ABAT_PS_PAR_AN_6_21, ABAT_PS_22E, ABAT_PS_PAR_AN_23_30,
  SEUIL_SURTAXE, SEUIL_EXONERATION_NR_PV, BAREME_DEMEMBREMENT,
} from "./constants";
import type { CalculResult, ScenarioResult } from "./types";

// ── Formatage ──────────────────────────────────────────────────────────────
export function fmt(n: number): string {
  return (n === undefined || n === null || isNaN(n))
    ? "0 €"
    : Math.round(n).toLocaleString("fr-FR") + " €";
}

export function fmtPct(n: number): string {
  return (n === undefined || n === null || isNaN(n))
    ? "0%"
    : n.toFixed(1).replace(".", ",") + "%";
}

// ── Abattements ────────────────────────────────────────────────────────────
export function getAbatIR(years: number): number {
  if (years < 6) return 0;
  if (years <= 21) return (years - 5) * ABAT_IR_PAR_AN;
  return 100;
}

export function getAbatPS(years: number): number {
  if (years < 6) return 0;
  if (years <= 21) return (years - 5) * ABAT_PS_PAR_AN_6_21;
  if (years === 22) return ((21 - 5) * ABAT_PS_PAR_AN_6_21) + ABAT_PS_22E;
  if (years <= 30) return ((21 - 5) * ABAT_PS_PAR_AN_6_21) + ABAT_PS_22E + ((years - 22) * ABAT_PS_PAR_AN_23_30);
  return 100;
}

// ── Surtaxe ────────────────────────────────────────────────────────────────
export function getSurtaxe(pvNetIR: number): number {
  if (pvNetIR <= SEUIL_SURTAXE) return 0;
  if (pvNetIR <= 100000)  return pvNetIR * 0.02;
  if (pvNetIR <= 150000)  return pvNetIR * 0.03;
  if (pvNetIR <= 200000)  return pvNetIR * 0.04;
  if (pvNetIR <= 250000)  return pvNetIR * 0.05;
  return pvNetIR * 0.06;
}

// ── Helper : résultat vide (fallback) ─────────────────────────────────────
function createEmptyResult(prixVenteCorrige: number, prixAchatCorrige: number, years: number): CalculResult {
  return {
    pvBrute: 0, years, abatIRPct: 0, abatPSPct: 0,
    pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0,
    surtaxe: 0, totalImpot: 0,
    netVendeur: prixVenteCorrige,
    tauxEffectif: 0, prixAchatCorrige, prixVenteCorrige, exonere: false,
    lignesSpecifiques: [], warnings: [],
  };
}

// ── Barème démembrement art. 669 CGI ──────────────────────────────────────
export function getFractionDemembrement(age: number, type: "usufruit" | "nue-propriete"): number {
  const tranche = BAREME_DEMEMBREMENT.find(t => age <= t.ageMax);
  if (!tranche) return type === "usufruit" ? 10 : 90;
  return type === "usufruit" ? tranche.usufruit : tranche.nuePropriete;
}

// ── Options du moteur de calcul ────────────────────────────────────────────
export interface ComputeOptions {
  typeResidence?: string;
  amortissementsLMNP?: number;
  // Non-résident
  situationVendeur?: string;
  affilieSecuEEE?: boolean;
  paysNonCooperatif?: boolean;
  resideFrance2ans?: boolean;
  anneesNonResident?: number;
  // Donation / Succession
  modeAcquisition?: "achat" | "donation" | "succession";
  // Indivision / Démembrement
  quotePart?: number;             // pourcentage 0–100, défaut 100 (SCI IR + indivision)
  modeIndivision?: "plein" | "indivision" | "demembrement";  // mode de détention
  typeDemembrement?: "usufruit" | "nue-propriete";           // rôle du cédant
  ageUsufruitier?: number;        // âge de l'usufruitier (barème art. 669 CGI)
  // SCI
  amortissementsSCI_IS?: number;  // amortissements cumulés (SCI IS seulement)
  beneficeAvantPV?: number;       // bénéfice imposable avant la vente (SCI IS)
}

// ── Calcul IS (SCI à l'IS) ─────────────────────────────────────────────────
function computeIS(beneficeTotal: number): { impot: number; tranches: { label: string; montant: number }[] } {
  const SEUIL_TAUX_REDUIT = 42500;
  const tranches: { label: string; montant: number }[] = [];
  let impot = 0;

  if (beneficeTotal <= 0) return { impot: 0, tranches };

  const tranche1 = Math.min(beneficeTotal, SEUIL_TAUX_REDUIT);
  const impot1 = tranche1 * 0.15;
  tranches.push({ label: `IS 15% sur ${fmt(tranche1)}`, montant: impot1 });
  impot += impot1;

  if (beneficeTotal > SEUIL_TAUX_REDUIT) {
    const tranche2 = beneficeTotal - SEUIL_TAUX_REDUIT;
    const impot2 = tranche2 * 0.25;
    tranches.push({ label: `IS 25% sur ${fmt(tranche2)}`, montant: impot2 });
    impot += impot2;
  }

  return { impot, tranches };
}

// ── Calcul principal (cas standard + LMNP + Non-résident + SCI) ───────────
export function computePlusValue(
  prixAchat: number,
  prixVente: number,
  dateAchat: Date,
  dateVente: Date,
  fraisAcqui: number,
  travaux: number,
  fraisCession: number,
  options?: ComputeOptions
): CalculResult | null {
  if (!prixAchat || !prixVente || !dateAchat) return null;

  const dVente: Date = dateVente || new Date();
  const dAchat: Date = new Date(dateAchat);
  const years = Math.floor(
    (dVente.getTime() - dAchat.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  // ── SCI ──
  const situationVendeur = options?.situationVendeur ?? "resident";
  const isSciIR = situationVendeur === "sci-ir";
  const isSciIS = situationVendeur === "sci-is";
  const quotePart = Math.min(100, Math.max(0, options?.quotePart ?? 100)) / 100; // ratio 0-1

  // ── Indivision / Démembrement ──
  const modeIndivision = options?.modeIndivision ?? "plein";
  const isIndivision = modeIndivision === "indivision";
  const isDemembrement = modeIndivision === "demembrement";
  const typeDemembrement = options?.typeDemembrement ?? "nue-propriete";
  const ageUsufruitier = options?.ageUsufruitier ?? 60;
  // Fraction démembrement : part cédée selon barème art. 669 CGI
  const fractionDemembrement = isDemembrement
    ? getFractionDemembrement(ageUsufruitier, typeDemembrement) / 100
    : 1;
  // Ratio effectif = quotePart (indivision) ou fractionDemembrement (démembrement)
  const ratioEffectif = isIndivision ? quotePart : (isDemembrement ? fractionDemembrement : quotePart);

  // ── SCI à l'IS : calcul entièrement différent ──
  if (isSciIS) {
    const amortIS = options?.amortissementsSCI_IS ?? 0;
    const beneficeAvantPV = options?.beneficeAvantPV ?? 0;
    const vnc = Math.max(0, prixAchat - amortIS);
    const prixVenteCorrige = prixVente - fraisCession;
    const pvIS = Math.max(0, prixVenteCorrige - vnc);
    const beneficeTotal = beneficeAvantPV + pvIS;
    const { impot: totalIS, tranches } = computeIS(beneficeTotal);
    const impotSurPV = Math.max(0, totalIS - computeIS(beneficeAvantPV).impot);
    const tauxEffectifIS = pvIS > 0 ? (impotSurPV / pvIS * 100) : 0;
    const prixAchatCorrige = vnc;

    const lignesIS = [
      { label: "Prix d'achat initial", montant: fmt(prixAchat), note: "", bold: false },
      { label: "− Amortissements cumulés", montant: `− ${fmt(amortIS)}`, note: "Réduit la VNC", bold: false },
      { label: "= Valeur nette comptable (VNC)", montant: fmt(vnc), note: "Base de calcul IS", bold: true },
      { label: "Prix de vente corrigé", montant: fmt(prixVenteCorrige), note: "", bold: false },
      { label: "− VNC", montant: `− ${fmt(vnc)}`, note: "", bold: false },
      { label: "= Plus-value professionnelle", montant: fmt(pvIS), note: "Soumise à l'IS", bold: true },
      { label: "Bénéfice avant cession", montant: fmt(beneficeAvantPV), note: "Exercice en cours", bold: false },
      { label: "= Bénéfice total imposable", montant: fmt(beneficeTotal), note: "", bold: true },
      ...tranches.map(t => ({ label: t.label, montant: fmt(t.montant), note: "", bold: false })),
      { label: "IS total sur bénéfice", montant: fmt(totalIS), note: "", bold: true },
      { label: "Dont IS imputable à la PV", montant: fmt(impotSurPV), note: "Estimation", bold: true },
    ];

    const warnings = [
      "⚠️ En SCI à l'IS, le calcul est fondamentalement différent : pas d'abattement pour durée de détention. Les amortissements réduisent la VNC et augmentent mécaniquement la plus-value. Consultez votre expert-comptable.",
    ];

    // Quote-part
    const impotQP = impotSurPV * quotePart;
    const netVendeurTotal = prixVenteCorrige - impotSurPV;

    return {
      pvBrute: pvIS,
      years,
      abatIRPct: 0,
      abatPSPct: 0,
      pvNetIR: pvIS,
      pvNetPS: 0,
      impotIR: impotSurPV,
      impotPS: 0,
      surtaxe: 0,
      totalImpot: impotSurPV,
      netVendeur: netVendeurTotal,
      tauxEffectif: tauxEffectifIS,
      prixAchatCorrige,
      prixVenteCorrige,
      exonere: false,
      tauxIR: tauxEffectifIS / 100,
      tauxPS: 0,
      regime: "SCI à l'IS — plus-value professionnelle",
      lignesSpecifiques: lignesIS,
      warnings,
    };
  }

  // ── Donation / Succession ──
  const modeAcquisition = options?.modeAcquisition ?? "achat";
  const isDonationSuccession = modeAcquisition === "donation" || modeAcquisition === "succession";

  // ── LMNP : réintégration des amortissements (LF 2025) ──
  const isLMNP = options?.typeResidence === "lmnp";
  const amortissements = isLMNP ? (options?.amortissementsLMNP ?? 0) : 0;

  const prixAchatCorrige = Math.max(0, prixAchat + fraisAcqui + travaux - amortissements);
  const prixVenteCorrige = prixVente - fraisCession;
  const pvBrute = Math.max(0, prixVenteCorrige - prixAchatCorrige);

  // ── Non-résident : détermination des taux ──
  const isNonResidentUE = situationVendeur === "non-resident-ue";
  const isNonResidentHorsUE = situationVendeur === "non-resident-hors-ue";

  // Taux IR
  const tauxIR = (isNonResidentHorsUE && options?.paysNonCooperatif)
    ? TAUX_IR_PAYS_NON_COOPERATIF
    : TAUX_IR;

  // Taux PS
  const tauxPS = isNonResidentUE && (options?.affilieSecuEEE !== false)
    ? TAUX_PS_NON_RESIDENT_EEE   // 7,5%
    : TAUX_PS_RESIDENT;           // 17,2%

  // ── Lignes spécifiques LMNP + donation/succession + indivision + démembrement ──
  const lignesSpecifiques = [
    ...(isLMNP && amortissements > 0 ? [{
      label: "− Amortissements réintégrés",
      montant: fmt(amortissements),
      note: "Réforme LF 2025 — art. 150 VB II",
      bold: true,
    }] : []),
    ...(isDonationSuccession ? [{
      label: modeAcquisition === "donation" ? "Valeur déclarée dans l'acte de donation" : "Valeur déclarée dans la déclaration de succession",
      montant: fmt(prixAchat),
      note: `Mode d'acquisition : ${modeAcquisition === "donation" ? "Donation" : "Succession"}`,
      bold: false,
    }] : []),
    ...(isSciIR && quotePart < 1 ? [{
      label: `Quote-part SCI (${Math.round(quotePart * 100)}%)`,
      montant: fmt(pvBrute * quotePart),
      note: "Votre part de la plus-value",
      bold: true,
    }] : []),
    ...(isIndivision && quotePart < 1 ? [{
      label: `Quote-part indivision (${Math.round(quotePart * 100)}%)`,
      montant: fmt(pvBrute * quotePart),
      note: "Votre fraction de la plus-value",
      bold: true,
    }] : []),
    ...(isDemembrement ? [{
      label: `Fraction démembrement — ${typeDemembrement === "usufruit" ? "Usufruitier" : "Nu-propriétaire"} (${Math.round(fractionDemembrement * 100)}%)`,
      montant: fmt(pvBrute * fractionDemembrement),
      note: `Âge de l'usufruitier : ${ageUsufruitier} ans — art. 669 CGI`,
      bold: true,
    }] : []),
  ];

  // ── Warnings ──
  const warnings: string[] = [];
  if (isLMNP && amortissements > 0) {
    warnings.push("Les amortissements déduits sont réintégrés dans le calcul de la plus-value depuis la loi de finances 2025.");
  }
  if (isDonationSuccession) {
    warnings.push(`Le forfait de 7,5% n'est pas applicable aux biens reçus par ${modeAcquisition === "donation" ? "donation" : "succession"}. Seuls les frais réellement payés (droits de mutation à titre gratuit + frais de notaire) sont déductibles.`);
  }
  if (isNonResidentUE && (options?.affilieSecuEEE !== false)) {
    warnings.push("En tant que non-résident UE/EEE/Suisse affilié à un régime de sécurité sociale, vous bénéficiez d'un taux réduit de prélèvements sociaux (7,5% au lieu de 17,2%).");
  }
  if (isNonResidentHorsUE && options?.paysNonCooperatif) {
    warnings.push("Le taux majoré de 33,33% s'applique pour les résidents de pays non coopératifs (art. 244 bis A CGI).");
  }
  if (isNonResidentHorsUE && prixVente > 150000) {
    warnings.push("Un représentant fiscal est obligatoire pour cette vente (prix de vente > 150 000 € — art. 244 bis A CGI).");
  }

  // ── Indivision / Démembrement warnings ──
  if (isDemembrement) {
    if (typeDemembrement === "nue-propriete") {
      warnings.push(
        `En cas de cession de nue-propriété, seule la fraction correspondante (${Math.round(fractionDemembrement * 100)}% pour un usufruitier de ${ageUsufruitier} ans selon l'art. 669 CGI) est imposable. La réunion usufruit/nue-propriété (décès de l'usufruitier) est exonérée de plus-value.`
      );
    } else {
      warnings.push(
        `En cas de cession d'usufruit, la plus-value est calculée sur la fraction usufruit (${Math.round(fractionDemembrement * 100)}% pour un usufruitier de ${ageUsufruitier} ans selon l'art. 669 CGI). La durée de détention court depuis la date d'acquisition de l'usufruit.`
      );
    }
  }
  if (isIndivision && quotePart < 1) {
    const pvBruteTotale = pvBrute;
    const pvNetIRTotaleInd = pvBruteTotale * (1 - getAbatIR(years) / 100);
    const pvNetIRQPInd = pvNetIRTotaleInd * quotePart;
    if (pvNetIRTotaleInd > SEUIL_SURTAXE && pvNetIRQPInd <= SEUIL_SURTAXE) {
      warnings.push(
        `En indivision avec ${Math.round(quotePart * 100)}% de quote-part, votre fraction de plus-value nette (${fmt(pvNetIRQPInd)}) est sous le seuil de surtaxe de 50 000 €. La surtaxe est appréciée par indivisaire, pas sur la totalité du bien.`
      );
    }
  }

  // ── Terrain / SCPI warnings ──
  const isTerrain = options?.typeResidence === "terrain";
  const isSCPI = options?.typeResidence === "scpi";

  if (isTerrain) {
    warnings.push("Le forfait de 15% pour travaux ne s'applique pas aux terrains non bâtis. Seuls les travaux réels avec factures (viabilisation, clôture, bornage…) sont déductibles.");
  }
  if (isSCPI) {
    // Recommandation frais réels vs forfait
    const forfait75 = prixAchat * 0.075;
    if (fraisAcqui > forfait75 && fraisAcqui === forfait75) {
      // hint géré dans recommendations.ts
    }
  }

  // ── Régime ──
  let regime: string | undefined;
  if (isSciIR) {
    regime = "SCI à l'IR — régime des particuliers";
  } else if (isIndivision) {
    regime = `Indivision — quote-part ${Math.round(quotePart * 100)}%`;
  } else if (isDemembrement) {
    regime = `Démembrement — ${typeDemembrement === "usufruit" ? "Usufruitier" : "Nu-propriétaire"} (${Math.round(fractionDemembrement * 100)}%)`;
  } else if (isLMNP) {
    regime = "LMNP — amortissements réintégrés (réforme 2025)";
  } else if (isTerrain) {
    regime = "Terrain — forfait travaux non applicable";
  } else if (isSCPI) {
    regime = "Parts de SCPI — régime des particuliers";
  } else if (modeAcquisition === "donation") {
    regime = "Bien reçu par donation";
  } else if (modeAcquisition === "succession") {
    regime = "Bien reçu par succession";
  } else if (isNonResidentUE) {
    regime = "Non-résident UE/EEE — PS à 7,5%";
  } else if (isNonResidentHorsUE) {
    regime = options?.paysNonCooperatif
      ? "Non-résident — pays non coopératif (33,33%)"
      : "Non-résident hors UE";
  }

  if (pvBrute === 0) {
    return {
      pvBrute: 0, years, abatIRPct: 0, abatPSPct: 0,
      pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0,
      surtaxe: 0, totalImpot: 0,
      netVendeur: prixVente - fraisCession,
      tauxEffectif: 0, prixAchatCorrige, prixVenteCorrige, exonere: false,
      tauxIR, tauxPS,
      regime, lignesSpecifiques, warnings,
    };
  }

  const abatIRPct = Math.min(100, getAbatIR(years));
  const abatPSPct = Math.min(100, getAbatPS(years));

  // ── SCI à l'IR / Indivision / Démembrement : calcul par quote-part ou fraction ──
  // La surtaxe s'apprécie par cédant (par associé SCI, par indivisaire, ou sur la fraction démembrée)
  const pvBruteQP = (isSciIR || isIndivision || isDemembrement) ? pvBrute * ratioEffectif : pvBrute;
  const pvNetIR = pvBruteQP * (1 - abatIRPct / 100);
  const pvNetPS = pvBruteQP * (1 - abatPSPct / 100);

  // ── Exonération 150K€ art. 150 U II 2° CGI (non-résidents UE anciens résidents) ──
  const resideFrance2ans = options?.resideFrance2ans === true;
  const anneesNR = options?.anneesNonResident ?? 999;
  const exoNonResident = isNonResidentUE && resideFrance2ans && anneesNR < 10 && pvNetIR <= SEUIL_EXONERATION_NR_PV;

  const impotIR = exoNonResident ? 0 : pvNetIR * tauxIR;
  const impotPS = pvNetPS * tauxPS;
  const surtaxe = exoNonResident ? 0 : getSurtaxe(pvNetIR);
  const totalImpot = impotIR + impotPS + surtaxe;

  // Recommandation SCI IR quote-part < seuil surtaxe
  if (isSciIR && quotePart < 1) {
    const pvBruteTotale = pvBrute;
    const pvNetIRTotale = pvBruteTotale * (1 - abatIRPct / 100);
    const pvNetIRQP = pvNetIR;
    if (pvNetIRTotale > SEUIL_SURTAXE && pvNetIRQP <= SEUIL_SURTAXE) {
      const surtaxeEvitee = getSurtaxe(pvNetIRTotale) * quotePart;
      warnings.push(
        `En SCI à l'IR avec ${Math.round(quotePart * 100)}% de parts, votre quote-part de plus-value nette (${fmt(pvNetIRQP)}) est sous le seuil de surtaxe de 50 000 €. Économie de surtaxe estimée : ${fmt(surtaxeEvitee)}.`
      );
    }
  }

  if (exoNonResident) {
    regime = "Non-résident UE — exonération 150K€ applicable (art. 150 U II 2°)";
    warnings.push("Exonération d'IR applicable : ancien résident fiscal français, non-résident depuis moins de 10 ans, plus-value nette ≤ 150 000 €. Les prélèvements sociaux restent dus.");
  }

  const showPvBruteQP = isSciIR || isIndivision || isDemembrement;
  return {
    pvBrute: showPvBruteQP ? pvBruteQP : pvBrute,
    years, abatIRPct, abatPSPct,
    pvNetIR, pvNetPS, impotIR, impotPS, surtaxe, totalImpot,
    netVendeur: prixVenteCorrige - totalImpot,
    tauxEffectif: pvBruteQP > 0 ? (totalImpot / pvBruteQP * 100) : 0,
    prixAchatCorrige, prixVenteCorrige, exonere: false,
    tauxIR, tauxPS,
    regime, lignesSpecifiques, warnings,
  };
}

// ── Résultat résidence principale (exonération totale) ─────────────────────
export function computeRPResult(
  prixAchat: number,
  prixVente: number,
  fraisAcqui: number,
  travaux: number,
  fraisCession: number,
  years: number
): CalculResult {
  const prixAchatCorrige = prixAchat + fraisAcqui + travaux;
  const prixVenteCorrige = prixVente - fraisCession;
  return {
    pvBrute: Math.max(0, prixVenteCorrige - prixAchatCorrige),
    years, abatIRPct: 0, abatPSPct: 0,
    pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0,
    surtaxe: 0, totalImpot: 0,
    netVendeur: prixVenteCorrige,
    tauxEffectif: 0, prixAchatCorrige, prixVenteCorrige,
    exonere: true, motifExoneration: "Résidence principale",
    lignesSpecifiques: [], warnings: [],
  };
}

// ── Scénarios temporels ────────────────────────────────────────────────────
export function computeScenarios(
  prixAchat: number,
  prixVente: number,
  dateAchat: Date,
  fraisAcqui: number,
  travaux: number,
  fraisCession: number,
  options?: ComputeOptions
): ScenarioResult[] {
  return [0, 1, 2, 3, 5].map(extra => {
    const fd = new Date();
    fd.setFullYear(fd.getFullYear() + extra);

    const r = computePlusValue(prixAchat, prixVente, dateAchat, fd, fraisAcqui, travaux, fraisCession, options);

    const base: CalculResult = r ?? createEmptyResult(
      prixVente - fraisCession,
      Math.max(0, prixAchat + fraisAcqui + travaux - (options?.amortissementsLMNP ?? 0)),
      Math.floor((fd.getTime() - new Date(dateAchat).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    );

    return {
      ...base,
      label: extra === 0 ? "Aujourd'hui" : `+${extra} an${extra > 1 ? "s" : ""}`,
      year: new Date().getFullYear() + extra,
    };
  });
}
