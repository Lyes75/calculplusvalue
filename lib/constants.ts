// ── Taux d'imposition ──────────────────────────────────────────────────────
export const TAUX_IR = 0.19;
export const TAUX_IR_PAYS_NON_COOPERATIF = 0.3333;
export const TAUX_PS_RESIDENT = 0.172;
export const TAUX_PS_NON_RESIDENT_EEE = 0.075;

// ── Taux IS (SCI) ──────────────────────────────────────────────────────────
export const TAUX_IS_REDUIT = 0.15;
export const SEUIL_IS_REDUIT = 42500;
export const TAUX_IS_NORMAL = 0.25;

// ── Forfaits ───────────────────────────────────────────────────────────────
export const FORFAIT_FRAIS_ACQUISITION = 0.075;
export const FORFAIT_TRAVAUX = 0.15;
export const SEUIL_ANNEES_FORFAIT_TRAVAUX = 5;

// ── Seuils ─────────────────────────────────────────────────────────────────
export const SEUIL_SURTAXE = 50000;
export const SEUIL_EXONERATION_PRIX_VENTE = 15000;
export const SEUIL_EXONERATION_NR_PV = 150000;

// ── Abattements IR ─────────────────────────────────────────────────────────
export const ABAT_IR_PAR_AN = 6;       // % par an de la 6e à la 21e année
export const ABAT_IR_22E = 4;          // % la 22e année
export const ANNEES_EXONERATION_IR = 22;

// ── Abattements PS ─────────────────────────────────────────────────────────
export const ABAT_PS_PAR_AN_6_21 = 1.65;
export const ABAT_PS_22E = 1.60;
export const ABAT_PS_PAR_AN_23_30 = 9;
export const ANNEES_EXONERATION_PS = 30;

// ── Barème démembrement art. 669 CGI ───────────────────────────────────────
export const BAREME_DEMEMBREMENT = [
  { ageMax: 20,       usufruit: 90, nuePropriete: 10 },
  { ageMax: 30,       usufruit: 80, nuePropriete: 20 },
  { ageMax: 40,       usufruit: 70, nuePropriete: 30 },
  { ageMax: 50,       usufruit: 60, nuePropriete: 40 },
  { ageMax: 60,       usufruit: 50, nuePropriete: 50 },
  { ageMax: 70,       usufruit: 40, nuePropriete: 60 },
  { ageMax: 80,       usufruit: 30, nuePropriete: 70 },
  { ageMax: 90,       usufruit: 20, nuePropriete: 80 },
  { ageMax: Infinity, usufruit: 10, nuePropriete: 90 },
];

// ── Barème surtaxe ─────────────────────────────────────────────────────────
export const BAREME_SURTAXE = [
  { seuil: 50000,   plafond: 100000,   taux: 0.02 },
  { seuil: 100000,  plafond: 150000,   taux: 0.03 },
  { seuil: 150000,  plafond: 200000,   taux: 0.04 },
  { seuil: 200000,  plafond: 250000,   taux: 0.05 },
  { seuil: 250000,  plafond: Infinity, taux: 0.06 },
];

// ── Palette couleurs Indigo + Menthe ───────────────────────────────────────
export const C = {
  bg: "#F6F5FA", card: "#FFFFFF", cardAlt: "#EEEDF5",
  border: "#D8D6E8", borderFocus: "#3F3D6E",
  text: "#1E1C3A", textMuted: "#6E6B8A", textLight: "#A09DB8",
  accent: "#56CBAD", accentLight: "#A8E8D6", accentBg: "#EEEDF5",
  green: "#3BAF7A", greenBg: "#EDF7F1", greenBorder: "#B5DECA",
  red: "#E05656", redBg: "#FDECEC",
  orange: "#D4923A", orangeBg: "#FDF3E8",
  blue: "#3F3D6E", blueBg: "#EEEDF5", blueBorder: "#9B97C4",
  primary: "#2D2B55", primaryMid: "#3F3D6E", primaryLight: "#9B97C4",
  accentDark: "#3A9480",
} as const;
