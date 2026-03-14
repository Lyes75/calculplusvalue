import {
  TAUX_IR, TAUX_IR_PAYS_NON_COOPERATIF, TAUX_PS_RESIDENT, TAUX_PS_NON_RESIDENT_EEE,
  ABAT_IR_PAR_AN, ABAT_PS_PAR_AN_6_21, ABAT_PS_22E, ABAT_PS_PAR_AN_23_30,
  SEUIL_SURTAXE, SEUIL_EXONERATION_NR_PV,
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
}

// ── Calcul principal (cas standard + LMNP + Non-résident) ─────────────────
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
  const situationVendeur = options?.situationVendeur ?? "resident";
  const isNonResidentUE = situationVendeur === "non-resident-ue";
  const isNonResidentHorsUE = situationVendeur === "non-resident-hors-ue";
  const isNonResident = isNonResidentUE || isNonResidentHorsUE;

  // Taux IR
  const tauxIR = (isNonResidentHorsUE && options?.paysNonCooperatif)
    ? TAUX_IR_PAYS_NON_COOPERATIF
    : TAUX_IR;

  // Taux PS
  const tauxPS = isNonResidentUE && (options?.affilieSecuEEE !== false)
    ? TAUX_PS_NON_RESIDENT_EEE   // 7,5%
    : TAUX_PS_RESIDENT;           // 17,2%

  // ── Lignes spécifiques LMNP + donation/succession ──
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

  // ── Régime ──
  let regime: string | undefined;
  if (isLMNP) {
    regime = "LMNP — amortissements réintégrés (réforme 2025)";
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
  const pvNetIR = pvBrute * (1 - abatIRPct / 100);
  const pvNetPS = pvBrute * (1 - abatPSPct / 100);

  // ── Exonération 150K€ art. 150 U II 2° CGI (non-résidents UE anciens résidents) ──
  const resideFrance2ans = options?.resideFrance2ans === true;
  const anneesNR = options?.anneesNonResident ?? 999;
  const exoNonResident = isNonResidentUE && resideFrance2ans && anneesNR < 10 && pvNetIR <= SEUIL_EXONERATION_NR_PV;

  const impotIR = exoNonResident ? 0 : pvNetIR * tauxIR;
  const impotPS = pvNetPS * tauxPS;
  const surtaxe = exoNonResident ? 0 : getSurtaxe(pvNetIR);
  const totalImpot = impotIR + impotPS + surtaxe;

  if (exoNonResident) {
    regime = "Non-résident UE — exonération 150K€ applicable (art. 150 U II 2°)";
    warnings.push("Exonération d'IR applicable : ancien résident fiscal français, non-résident depuis moins de 10 ans, plus-value nette ≤ 150 000 €. Les prélèvements sociaux restent dus.");
  }

  return {
    pvBrute, years, abatIRPct, abatPSPct,
    pvNetIR, pvNetPS, impotIR, impotPS, surtaxe, totalImpot,
    netVendeur: prixVenteCorrige - totalImpot,
    tauxEffectif: pvBrute > 0 ? (totalImpot / pvBrute * 100) : 0,
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
