import { fmt, fmtPct } from "./calcul-engine";
import type { CalculResult, SimulationData, Recommendation, ScenarioResult } from "./types";

export function generatePDFContent(
  result: CalculResult,
  data: SimulationData,
  recommendations: Recommendation[],
  scenarios: ScenarioResult[]
): string {
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const scenarioRows = scenarios.slice(0, 4).map(s => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #E8E0D8">${s.label} (${s.year})</td>
      <td style="padding:6px 10px;border-bottom:1px solid #E8E0D8;text-align:right;font-weight:600;color:#E05656">${fmt(s.totalImpot)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #E8E0D8;text-align:right;font-weight:600;color:#3BAF7A">${fmt(s.netVendeur)}</td>
    </tr>`).join("");

  const recoRows = recommendations.map(r => `
    <div style="margin-bottom:10px;padding:10px 14px;background:#F5EFE3;border-radius:8px;border-left:3px solid #56CBAD">
      <strong>${r.icon} ${r.title}</strong><br/>
      <span style="font-size:12px;color:#6E6B8A">${r.text}</span>
    </div>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#1E1C3A;font-size:13px;line-height:1.5}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head>
<body style="padding:40px">

<div style="border-bottom:3px solid #2D2B55;padding-bottom:20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end">
  <div>
    <div style="font-family:'DM Serif Display',serif;font-size:24px;color:#2D2B55">Rapport de plus-value immobilière</div>
    <div style="font-size:12px;color:#6E6B8A;margin-top:4px">Simulation générée le ${date}</div>
  </div>
  <div style="font-size:11px;color:#6E6B8A;text-align:right">calculplusvalue.fr<br/>Simulateur gratuit 2026</div>
</div>

<div style="display:flex;gap:16px;margin-bottom:24px">
  <div style="flex:1;background:#FDECEC;border-radius:10px;padding:16px;text-align:center">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#E05656;font-weight:700">Impôt total</div>
    <div style="font-family:'DM Serif Display',serif;font-size:28px;color:#E05656;margin-top:4px">${fmt(result.totalImpot)}</div>
    <div style="font-size:11px;color:#6E6B8A">Taux effectif : ${fmtPct(result.tauxEffectif)}</div>
  </div>
  <div style="flex:1;background:#EDF7F1;border-radius:10px;padding:16px;text-align:center">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#3BAF7A;font-weight:700">Net vendeur</div>
    <div style="font-family:'DM Serif Display',serif;font-size:28px;color:#3BAF7A;margin-top:4px">${fmt(result.netVendeur)}</div>
    <div style="font-size:11px;color:#6E6B8A">Après déduction de l'impôt</div>
  </div>
</div>

<div style="font-weight:700;font-size:14px;margin-bottom:10px;color:#2D2B55">Détail du calcul</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px">
  <tr style="background:#E0DEF0"><td style="padding:6px 10px;font-weight:600">Prix de vente</td><td style="padding:6px 10px;text-align:right">${fmt(data.prixVente)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A"></td></tr>
  <tr><td style="padding:6px 10px">− Frais de cession</td><td style="padding:6px 10px;text-align:right">− ${fmt(data.fraisCession)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A"></td></tr>
  <tr style="background:#E0DEF0;font-weight:700"><td style="padding:6px 10px">= Prix de vente corrigé</td><td style="padding:6px 10px;text-align:right">${fmt(result.prixVenteCorrige)}</td><td></td></tr>
  <tr><td style="padding:6px 10px">Prix d'achat</td><td style="padding:6px 10px;text-align:right">${fmt(data.prixAchat)}</td><td></td></tr>
  <tr style="background:#E0DEF0"><td style="padding:6px 10px">+ Frais d'acquisition</td><td style="padding:6px 10px;text-align:right">+ ${fmt(data.fraisAcqui)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A">${data.fraisMode === "forfait" ? "Forfait 7,5%" : "Réels"}</td></tr>
  <tr><td style="padding:6px 10px">+ Travaux</td><td style="padding:6px 10px;text-align:right">+ ${fmt(data.travaux)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A">${data.travauxMode === "forfait" ? "Forfait 15%" : data.travauxMode === "reel" ? "Factures" : "Aucun"}</td></tr>
  <tr style="background:#E0DEF0;font-weight:700"><td style="padding:6px 10px">= Prix d'achat corrigé</td><td style="padding:6px 10px;text-align:right">${fmt(result.prixAchatCorrige)}</td><td></td></tr>
  <tr style="border-top:2px solid #2D2B55;font-weight:700"><td style="padding:10px 10px">Plus-value brute</td><td style="padding:10px 10px;text-align:right">${fmt(result.pvBrute)}</td><td style="padding:10px 10px;font-size:11px;color:#6E6B8A">Détention : ${result.years} ans</td></tr>
  <tr style="background:#E0DEF0"><td style="padding:6px 10px">Abattement IR (${fmtPct(result.abatIRPct)})</td><td style="padding:6px 10px;text-align:right">→ PV nette IR : ${fmt(result.pvNetIR)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A">Exonération à 22 ans</td></tr>
  <tr><td style="padding:6px 10px;font-weight:600">Impôt sur le revenu (19%)</td><td style="padding:6px 10px;text-align:right;font-weight:600;color:#E05656">${fmt(result.impotIR)}</td><td></td></tr>
  <tr style="background:#E0DEF0"><td style="padding:6px 10px">Abattement PS (${fmtPct(result.abatPSPct)})</td><td style="padding:6px 10px;text-align:right">→ PV nette PS : ${fmt(result.pvNetPS)}</td><td style="padding:6px 10px;font-size:11px;color:#6E6B8A">Exonération à 30 ans</td></tr>
  <tr><td style="padding:6px 10px;font-weight:600">Prélèvements sociaux (17,2%)</td><td style="padding:6px 10px;text-align:right;font-weight:600;color:#E05656">${fmt(result.impotPS)}</td><td></td></tr>
  ${result.surtaxe > 0 ? `<tr style="background:#FDECEC"><td style="padding:6px 10px;font-weight:600">Surtaxe (PV nette > 50K€)</td><td style="padding:6px 10px;text-align:right;font-weight:600;color:#E05656">${fmt(result.surtaxe)}</td><td></td></tr>` : ""}
  <tr style="border-top:2px solid #2D2B55;font-weight:700;font-size:15px"><td style="padding:10px">TOTAL IMPÔT</td><td style="padding:10px;text-align:right;color:#E05656">${fmt(result.totalImpot)}</td><td></td></tr>
</table>

${scenarios.length > 0 ? `
<div style="font-weight:700;font-size:14px;margin-bottom:10px;color:#2D2B55">Comparaison temporelle</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px">
  <tr style="background:#2D2B55;color:#E0DEF0">
    <th style="padding:8px 10px;text-align:left;font-weight:600">Scénario</th>
    <th style="padding:8px 10px;text-align:right">Impôt</th>
    <th style="padding:8px 10px;text-align:right">Net vendeur</th>
  </tr>
  ${scenarioRows}
</table>` : ""}

${recommendations.length > 0 ? `
<div style="font-weight:700;font-size:14px;margin-bottom:10px;color:#2D2B55">Pistes d'optimisation</div>
${recoRows}` : ""}

<div style="margin-top:30px;padding:14px;background:#E0DEF0;border-radius:8px;font-size:11px;color:#6E6B8A;line-height:1.6">
  <strong>Sources légales :</strong> Art. 150 U à 150 VH du CGI • Abattements : art. 150 VC • Surtaxe : art. 1609 nonies G • Taux IR : 19% (art. 200 B) • PS : 17,2%<br/>
  <strong>Avertissement :</strong> Simulation indicative à but pédagogique. Ne constitue pas un conseil fiscal. Consultez votre notaire pour un calcul définitif.
</div>

</body></html>`;
}
