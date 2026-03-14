import { fmt, computePlusValue } from "./calcul-engine";
import { TAUX_IR, TAUX_PS_RESIDENT, TAUX_PS_NON_RESIDENT_EEE, ANNEES_EXONERATION_IR, ANNEES_EXONERATION_PS, FORFAIT_TRAVAUX, SEUIL_SURTAXE, SEUIL_EXONERATION_NR_PV } from "./constants";
import type { CalculResult, Recommendation, RecoContext } from "./types";

export function getRecommendations(
  result: CalculResult,
  context: RecoContext,
  dateAchat?: Date,
  fraisAcquiReels?: number
): Recommendation[] {
  if (!result || result.pvBrute === 0) return [];

  const recs: Recommendation[] = [];
  const isLMNP = context.typeResidence === "lmnp";
  const isSCPI = context.typeResidence === "scpi";
  const isTerrain = context.typeResidence === "terrain";
  const isNonResidentUE = context.situationVendeur === "non-resident-ue";
  const isNonResidentHorsUE = context.situationVendeur === "non-resident-hors-ue";

  // ── Recommandations spécifiques SCPI ────────────────────────────────────
  if (isSCPI && fraisAcquiReels !== undefined && context.prixAchat > 0) {
    const forfait75 = context.prixAchat * 0.075;
    if (fraisAcquiReels > forfait75) {
      const gainFraisReels = (fraisAcquiReels - forfait75)
        * (1 - result.abatIRPct / 100) * TAUX_IR
        + (fraisAcquiReels - forfait75)
        * (1 - result.abatPSPct / 100) * TAUX_PS_RESIDENT;
      recs.push({
        type: "optim",
        icon: "💡",
        title: "Frais de souscription réels > forfait 7,5%",
        text: `Vos frais réels (${fmt(fraisAcquiReels)}) sont supérieurs au forfait 7,5% (${fmt(forfait75)}). Optez pour les frais réels — économie estimée : ~${fmt(gainFraisReels)}.`,
        impact: gainFraisReels,
      });
    }
  }

  // ── Recommandations spécifiques LMNP ────────────────────────────────────
  if (isLMNP && context.amortissementsLMNP && context.amortissementsLMNP > 0 && dateAchat) {
    // Calcul sans réintégration pour mesurer l'impact
    const resultSansAmort = computePlusValue(
      context.prixAchat,
      result.prixVenteCorrige + 0, // prixVente approché
      dateAchat,
      new Date(),
      0, // fraisAcqui non disponible ici, approximation
      context.travaux,
      0,
      { typeResidence: "secondaire" } // sans réintégration
    );
    const impotSansAmort = resultSansAmort?.totalImpot ?? 0;
    const surimpot = result.totalImpot - impotSansAmort;
    if (surimpot > 100) {
      recs.push({
        type: "alert",
        icon: "📊",
        title: "Impact de la réintégration des amortissements",
        text: `La réforme 2025 augmente votre impôt de ${fmt(surimpot)}. Sans réintégration, votre impôt aurait été de ~${fmt(impotSansAmort)}.`,
        impact: surimpot,
      });
    }
  }

  if (isLMNP && result.years < 5) {
    recs.push({
      type: "alert",
      icon: "⚠️",
      title: "Vérifiez votre statut LMP avant de vendre",
      text: "Si vos recettes locatives dépassent 23 000 €/an, vous êtes peut-être LMP (et non LMNP). Le régime de plus-value change radicalement en LMP. Consultez un expert.",
      impact: result.totalImpot * 0.5,
    });
  }

  // ── Recommandations spécifiques Non-Résident ────────────────────────────

  // UE : PS réduit à 7,5% — économie vs taux plein
  if (isNonResidentUE && (context.affilieSecuEEE !== false)) {
    const economiPS = result.pvNetPS * (TAUX_PS_RESIDENT - TAUX_PS_NON_RESIDENT_EEE);
    if (economiPS > 100) {
      recs.push({
        type: "optim",
        icon: "🇪🇺",
        title: "Taux PS réduit à 7,5% (UE/EEE)",
        text: `Vous économisez ${fmt(economiPS)} grâce au taux réduit de prélèvements sociaux (7,5% au lieu de 17,2%) réservé aux affiliés à un régime de sécurité sociale UE/EEE/Suisse/UK.`,
        impact: economiPS,
      });
    }
  }

  // UE : PV nette entre 100K et 150K → près du seuil d'exonération
  if (isNonResidentUE && result.pvNetIR > 100000 && result.pvNetIR < SEUIL_EXONERATION_NR_PV) {
    recs.push({
      type: "optim",
      icon: "✅",
      title: "Proche du seuil d'exonération 150 000 €",
      text: `Votre plus-value nette est de ${fmt(result.pvNetIR)} — en dessous du plafond de ${fmt(SEUIL_EXONERATION_NR_PV)} pour les anciens résidents fiscaux (art. 150 U II 2° CGI). Vérifiez votre éligibilité : 2 ans de domicile fiscal en France + départ depuis moins de 10 ans.`,
      impact: result.impotIR,
    });
  }

  // UE : PV nette > 150K → pas d'exonération possible
  if (isNonResidentUE && result.pvNetIR > SEUIL_EXONERATION_NR_PV) {
    recs.push({
      type: "alert",
      icon: "⚠️",
      title: "Exonération 150 000 € non applicable",
      text: `Votre plus-value nette (${fmt(result.pvNetIR)}) dépasse le plafond de ${fmt(SEUIL_EXONERATION_NR_PV)}. L'exonération pour anciens résidents (art. 150 U II 2° CGI) ne peut pas s'appliquer.`,
      impact: result.impotIR * 0.3,
    });
  }

  // Hors UE : représentant fiscal obligatoire
  if (isNonResidentHorsUE && context.prixVente && context.prixVente > 150000) {
    const coutRepresentant = context.prixVente * 0.0075; // estimation 0,75%
    recs.push({
      type: "alert",
      icon: "📋",
      title: "Représentant fiscal obligatoire",
      text: `Prix de vente > 150 000 € : un représentant fiscal accrédité est obligatoire (art. 244 bis A CGI). Budget à prévoir : ~${fmt(coutRepresentant)} (0,5% à 1% du prix de vente).`,
      impact: coutRepresentant,
    });
  }

  // ── Timing : proche exonération IR ──────────────────────────────────────
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

  // Optimisation : forfait travaux disponible mais non utilisé (pas pour terrain/SCPI)
  if (result.years >= 5 && context.travaux === 0 && context.travauxMode !== "forfait" && !isTerrain && !isSCPI) {
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

  // Optimisation : forfait plus avantageux que les réels (pas pour terrain/SCPI)
  if (context.travaux > 0 && result.years >= 5 && !isTerrain && !isSCPI) {
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
