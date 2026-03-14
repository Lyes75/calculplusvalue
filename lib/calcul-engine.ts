import {
  TAUX_IR, TAUX_PS_RESIDENT,
  ABAT_IR_PAR_AN, ABAT_PS_PAR_AN_6_21, ABAT_PS_22E, ABAT_PS_PAR_AN_23_30,
  SEUIL_SURTAXE,
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

// ── Calcul principal (cas standard + LMNP) ────────────────────────────────
export function computePlusValue(
  prixAchat: number,
  prixVente: number,
  dateAchat: Date,
  dateVente: Date,
  fraisAcqui: number,
  travaux: number,
  fraisCession: number,
  options?: { typeResidence?: string; amortissementsLMNP?: number }
): CalculResult | null {
  if (!prixAchat || !prixVente || !dateAchat) return null;

  const dVente: Date = dateVente || new Date();
  const dAchat: Date = new Date(dateAchat);
  const years = Math.floor(
    (dVente.getTime() - dAchat.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  const isLMNP = options?.typeResidence === "lmnp";
  const amortissements = isLMNP ? (options?.amortissementsLMNP ?? 0) : 0;

  // LMNP : réforme LF 2025 — amortissements réintégrés (réduisent le prix d'achat corrigé)
  const prixAchatCorrige = Math.max(0, prixAchat + fraisAcqui + travaux - amortissements);
  const prixVenteCorrige = prixVente - fraisCession;
  const pvBrute = Math.max(0, prixVenteCorrige - prixAchatCorrige);

  const lignesSpecifiques = isLMNP && amortissements > 0 ? [
    {
      label: "− Amortissements réintégrés",
      montant: fmt(amortissements),
      note: "Réforme LF 2025 — art. 150 VB II",
      bold: true,
    },
  ] : [];

  const warnings = isLMNP && amortissements > 0
    ? ["Les amortissements déduits sont réintégrés dans le calcul de la plus-value depuis la loi de finances 2025."]
    : [];

  const regime = isLMNP ? "LMNP — amortissements réintégrés (réforme 2025)" : undefined;

  if (pvBrute === 0) {
    return {
      pvBrute: 0, years, abatIRPct: 0, abatPSPct: 0,
      pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0,
      surtaxe: 0, totalImpot: 0,
      netVendeur: prixVente - fraisCession,
      tauxEffectif: 0, prixAchatCorrige, prixVenteCorrige, exonere: false,
      regime, lignesSpecifiques, warnings,
    };
  }

  const abatIRPct = Math.min(100, getAbatIR(years));
  const abatPSPct = Math.min(100, getAbatPS(years));
  const pvNetIR = pvBrute * (1 - abatIRPct / 100);
  const pvNetPS = pvBrute * (1 - abatPSPct / 100);
  const impotIR = pvNetIR * TAUX_IR;
  const impotPS = pvNetPS * TAUX_PS_RESIDENT;
  const surtaxe = getSurtaxe(pvNetIR);
  const totalImpot = impotIR + impotPS + surtaxe;

  return {
    pvBrute, years, abatIRPct, abatPSPct,
    pvNetIR, pvNetPS, impotIR, impotPS, surtaxe, totalImpot,
    netVendeur: prixVenteCorrige - totalImpot,
    tauxEffectif: pvBrute > 0 ? (totalImpot / pvBrute * 100) : 0,
    prixAchatCorrige, prixVenteCorrige, exonere: false,
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
  options?: { typeResidence?: string; amortissementsLMNP?: number }
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
