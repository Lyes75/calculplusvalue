// ── Options d'entrée du calcul ─────────────────────────────────────────────
export interface CalculOptions {
  prixAchat: number;
  prixVente: number;
  dateAchat: Date;
  dateVente?: Date;
  fraisAcquisition: number;
  travaux: number;
  fraisCession: number;

  typeResidence: "principale" | "secondaire" | "locatif" | "lmnp" | "terrain" | "scpi";
  situationVendeur: "resident" | "non-resident-ue" | "non-resident-hors-ue" | "sci-ir" | "sci-is";
  modeAcquisition: "achat" | "donation" | "succession";

  // Options cas spéciaux (ignorées dans l'implémentation standard)
  amortissementsLMNP?: number;
  quotePart?: number;
  affilieSecuEEE?: boolean;
  paysNonCooperatif?: boolean;
  resideFrance2ans?: boolean;
  anneesNonResident?: number;
  beneficeAvantPV?: number;
  amortissementsSCI_IS?: number;
  demembrement?: {
    type: "nu-proprietaire" | "usufruitier";
    ageUsufruitier: number;
  };
}

// ── Résultat principal du calcul ───────────────────────────────────────────
export interface CalculResult {
  pvBrute: number;
  years: number;
  abatIRPct: number;
  abatPSPct: number;
  pvNetIR: number;
  pvNetPS: number;
  impotIR: number;
  impotPS: number;
  surtaxe: number;
  totalImpot: number;
  netVendeur: number;
  tauxEffectif: number;
  prixAchatCorrige: number;
  prixVenteCorrige: number;
  exonere: boolean;
  motifExoneration?: string;
  regime?: string;
  tauxIR?: number;
  tauxPS?: number;
  lignesSpecifiques?: LigneDetail[];
  warnings?: string[];
}

// ── Ligne du tableau détail calcul ────────────────────────────────────────
export interface LigneDetail {
  label: string;
  montant: string;
  note: string;
  bold?: boolean;
}

// ── Scénario temporel ─────────────────────────────────────────────────────
export interface ScenarioResult extends CalculResult {
  label: string;
  year: number;
}

// ── Recommandation ────────────────────────────────────────────────────────
export type RecommendationType = "timing" | "optim" | "alert";

export interface Recommendation {
  type: RecommendationType;
  icon: string;
  title: string;
  text: string;
  impact: number;
}

// ── Données contextuelles pour PDF et recommandations ─────────────────────
export interface SimulationData {
  prixAchat: number;
  prixVente: number;
  fraisAcqui: number;
  travaux: number;
  fraisCession: number;
  fraisMode: "forfait" | "reel";
  travauxMode: "forfait" | "reel" | "aucun";
}

// ── Contexte pour les recommandations ────────────────────────────────────
export interface RecoContext {
  prixAchat: number;
  travaux: number;      // montant réel uniquement (0 si forfait ou aucun)
  travauxMode: "forfait" | "reel" | "aucun";
  typeResidence?: "principale" | "secondaire" | "locatif" | "lmnp" | "terrain" | "scpi";
  amortissementsLMNP?: number;
}
