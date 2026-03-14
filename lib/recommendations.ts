import { fmt } from "./calcul-engine";
import { TAUX_IR, TAUX_PS_RESIDENT, ANNEES_EXONERATION_IR, ANNEES_EXONERATION_PS, FORFAIT_TRAVAUX, SEUIL_SURTAXE } from "./constants";
import type { CalculResult, Recommendation, RecoContext } from "./types";

export function getRecommendations(
  result: CalculResult,
  context: RecoContext
): Recommendation[] {
  if (!result || result.pvBrute === 0) return [];

  const recs: Recommendation[] = [];

  // Timing : proche exonération IR
  if (result.years >= 18 && result.years < ANNEES_EXONERATION_IR) {
    const yl = ANNEES_EXONERATION_IR - result.years;
    recs.push({
      type: "timing",
      icon: "⏳",
      title: `${yl} an${yl > 1 ? "s" : ""} avant l'exonération IR`,
      text: `En attendant ${new Date().getFullYear() + yl} pour vendre, vous économiseriez ${fmt(result.impotIR)} d'impôt sur le revenu.`,
      impact: result.impotIR,
    });
  }

  // Timing : proche exonération PS
  if (result.years >= 25 && result.years < ANNEES_EXONERATION_PS) {
    const yl = ANNEES_EXONERATION_PS - result.years;
    recs.push({
      type: "timing",
      icon: "⏳",
      title: `${yl} ans avant l'exonération PS`,
      text: `En patientant ${yl} ans, exonération totale de prélèvements sociaux.`,
      impact: result.impotPS,
    });
  }

  // Optimisation : forfait travaux disponible mais non utilisé
  if (result.years >= 5 && context.travaux === 0) {
    const f = context.prixAchat * FORFAIT_TRAVAUX;
    const eco = f * (1 - result.abatIRPct / 100) * TAUX_IR
              + f * (1 - result.abatPSPct / 100) * TAUX_PS_RESIDENT;
    if (eco > 100) {
      recs.push({
        type: "optim",
        icon: "🔧",
        title: "Forfait travaux 15% applicable",
        text: `Sans factures, déduisez un forfait de ${fmt(f)}. Économie : ~${fmt(eco)}.`,
        impact: eco,
      });
    }
  }

  // Optimisation : forfait plus avantageux que les réels
  if (context.travaux > 0 && result.years >= 5) {
    const f = context.prixAchat * FORFAIT_TRAVAUX;
    if (f > context.travaux) {
      recs.push({
        type: "optim",
        icon: "📋",
        title: "Le forfait 15% est plus avantageux",
        text: `Forfait (${fmt(f)}) > travaux réels (${fmt(context.travaux)}). Optez pour le forfait.`,
        impact: (f - context.travaux) * (TAUX_IR + TAUX_PS_RESIDENT),
      });
    }
  }

  // Alerte surtaxe
  if (result.surtaxe > 0) {
    recs.push({
      type: "alert",
      icon: "⚠️",
      title: "Surtaxe applicable",
      text: `Plus-value nette > ${SEUIL_SURTAXE.toLocaleString("fr-FR")} €. Surtaxe : ${fmt(result.surtaxe)}.`,
      impact: result.surtaxe,
    });
  }

  // Optimisation : vente en couple pour éviter la surtaxe
  if (result.pvNetIR > SEUIL_SURTAXE) {
    recs.push({
      type: "optim",
      icon: "👥",
      title: "Vendez en couple ?",
      text: `En indivision, le seuil de ${SEUIL_SURTAXE.toLocaleString("fr-FR")} € s'apprécie par quote-part. À deux, vous pourriez éviter la surtaxe.`,
      impact: result.surtaxe,
    });
  }

  return recs.sort((a, b) => b.impact - a.impact).slice(0, 4);
}
