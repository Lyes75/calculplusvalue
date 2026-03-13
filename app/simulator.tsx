"use client";
import { useState, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
// ── Tax Logic ──
const IR_RATE = 0.19;
const PS_RATE = 0.172;
function getAbatIR(years: number) {
  if (years < 6) return 0;
  if (years <= 21) return (years - 5) * 6;
  return 100;
}
function getAbatPS(years: number) {
  if (years < 6) return 0;
  if (years <= 21) return (years - 5) * 1.65;
  if (years === 22) return ((21 - 5) * 1.65) + 1.60;
  if (years <= 30) return ((21 - 5) * 1.65) + 1.60 + ((years - 22) * 9);
  return 100;
}
function getSurtax(pvNetIR: number) {
  if (pvNetIR <= 50000) return 0;
  if (pvNetIR <= 100000) return pvNetIR * 0.02;
  if (pvNetIR <= 150000) return pvNetIR * 0.03;
  if (pvNetIR <= 200000) return pvNetIR * 0.04;
  if (pvNetIR <= 250000) return pvNetIR * 0.05;
  return pvNetIR * 0.06;
}
function computePV(prixAchat: number, prixVente: number, dateAchat: Date, dateVente: Date, fraisAcqui: number, travaux: number, fraisCession: number) {
  if (!prixAchat || !prixVente || !dateAchat) return null;
  const dVente: Date = dateVente || new Date();
  const dAchat: Date = new Date(dateAchat);
  const years = Math.floor((dVente.getTime() - dAchat.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const prixAchatCorrige = prixAchat + fraisAcqui + travaux;
  const prixVenteCorrige = prixVente - fraisCession;
  const pvBrute = Math.max(0, prixVenteCorrige - prixAchatCorrige);
  if (pvBrute === 0) return { pvBrute: 0, years, abatIRPct: 0, abatPSPct: 0, pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0, surtaxe: 0, totalImpot: 0, netVendeur: prixVente - fraisCession, tauxEffectif: 0, prixAchatCorrige, prixVenteCorrige, exonere: false };
  const abatIRPct = Math.min(100, getAbatIR(years));
  const abatPSPct = Math.min(100, getAbatPS(years));
  const pvNetIR = pvBrute * (1 - abatIRPct / 100);
  const pvNetPS = pvBrute * (1 - abatPSPct / 100);
  const impotIR = pvNetIR * IR_RATE;
  const impotPS = pvNetPS * PS_RATE;
  const surtaxe = getSurtax(pvNetIR);
  const totalImpot = impotIR + impotPS + surtaxe;
  return { pvBrute, years, abatIRPct, abatPSPct, pvNetIR, pvNetPS, impotIR, impotPS, surtaxe, totalImpot, netVendeur: prixVenteCorrige - totalImpot, tauxEffectif: pvBrute > 0 ? (totalImpot / pvBrute * 100) : 0, prixAchatCorrige, prixVenteCorrige, exonere: false };
}
function fmt(n: number) { return (n === undefined || n === null || isNaN(n)) ? "0 €" : Math.round(n).toLocaleString("fr-FR") + " €"; }
function fmtPct(n: number) { return (n === undefined || n === null || isNaN(n)) ? "0%" : n.toFixed(1).replace(".", ",") + "%"; }
// ── Colors ──
const C = {
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
};
// ── Tooltip ──
function Tip({ text }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLSpanElement>(null);
  function open() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.top + window.scrollY - 8, left: r.left + r.width / 2 });
    }
  }
  return (
    <span className="inline-block ml-3 cursor-help" ref={btnRef} onMouseEnter={open} onMouseLeave={() => setPos(null)} onClick={() => pos ? setPos(null) : open()}>
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full" style={{ background: "#EEEDF5", color: "#3F3D6E", fontSize: 10, fontWeight: 800 }}>?</span>
      {pos && (
        <span style={{ position: "fixed", top: pos.top, left: pos.left, transform: "translate(-50%, -100%)", zIndex: 9999, width: 260, padding: "10px 14px", borderRadius: 10, fontSize: 12, lineHeight: 1.55, background: "#2D2B55", color: "#E0DEF0", boxShadow: "0 6px 24px rgba(45,43,85,0.35)", pointerEvents: "none" }}>
          {text}
        </span>
      )}
    </span>
  );
}
// ── Recommendation Engine ──
function getRecommendations(result, data) {
  if (!result || result.pvBrute === 0) return [];
  const recs: { type: string; icon: string; title: string; text: string; impact: number }[] = [];
  if (result.years >= 18 && result.years < 22) {
    const yl = 22 - result.years;
    recs.push({ type: "timing", icon: "⏳", title: `${yl} an${yl > 1 ? "s" : ""} avant l'exonération IR`, text: `En attendant ${new Date().getFullYear() + yl} pour vendre, vous économiseriez ${fmt(result.impotIR)} d'impôt sur le revenu.`, impact: result.impotIR });
  }
  if (result.years >= 25 && result.years < 30) {
    const yl = 30 - result.years;
    recs.push({ type: "timing", icon: "⏳", title: `${yl} ans avant l'exonération PS`, text: `En patientant ${yl} ans, exonération totale de prélèvements sociaux.`, impact: result.impotPS });
  }
  if (result.years >= 5 && data.travaux === 0) {
    const f = data.prixAchat * 0.15;
    const eco = f * (1 - result.abatIRPct / 100) * IR_RATE + f * (1 - result.abatPSPct / 100) * PS_RATE;
    if (eco > 100) recs.push({ type: "optim", icon: "🔧", title: "Forfait travaux 15% applicable", text: `Sans factures, déduisez un forfait de ${fmt(f)}. Économie : ~${fmt(eco)}.`, impact: eco });
  }
  if (data.travaux > 0 && result.years >= 5) {
    const f = data.prixAchat * 0.15;
    if (f > data.travaux) recs.push({ type: "optim", icon: "📋", title: "Le forfait 15% est plus avantageux", text: `Forfait (${fmt(f)}) > travaux réels (${fmt(data.travaux)}). Optez pour le forfait.`, impact: (f - data.travaux) * 0.362 });
  }
  if (result.surtaxe > 0) recs.push({ type: "alert", icon: "⚠️", title: "Surtaxe applicable", text: `Plus-value nette > 50 000 €. Surtaxe : ${fmt(result.surtaxe)}.`, impact: result.surtaxe });
  if (result.pvNetIR > 50000) recs.push({ type: "optim", icon: "👥", title: "Vendez en couple ?", text: `En indivision, le seuil de 50 000 € s'apprécie par quote-part. À deux, vous pourriez éviter la surtaxe.`, impact: result.surtaxe });
  return recs.sort((a, b) => b.impact - a.impact).slice(0, 4);
}
// ── PDF Generation ──
function generatePDFContent(result, data, recommendations, scenarios) {
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const scenarioRows = scenarios.slice(0, 4).map(s => `
    <tr><td style="padding:6px 10px;border-bottom:1px solid #E8E0D8">${s.label} (${s.year})</td>
    <td style="padding:6px 10px;border-bottom:1px solid #E8E0D8;text-align:right;font-weight:600;color:#E05656">${fmt(s.totalImpot)}</td>
    <td style="padding:6px 10px;border-bottom:1px solid #E8E0D8;text-align:right;font-weight:600;color:#3BAF7A">${fmt(s.netVendeur)}</td></tr>`).join("");

  const recoRows = recommendations.map(r => `
    <div style="margin-bottom:10px;padding:10px 14px;background:#F5EFE3;border-radius:8px;border-left:3px solid #56CBAD">
      <strong>${r.icon} ${r.title}</strong><br/><span style="font-size:12px;color:#6E6B8A">${r.text}</span>
    </div>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;color:#1E1C3A;font-size:13px;line-height:1.5}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head>
<body style="padding:40px">
<div style="border-bottom:3px solid #2D2B55;padding-bottom:20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end">
  <div><div style="font-family:'DM Serif Display',serif;font-size:24px;color:#2D2B55">Rapport de plus-value immobilière</div>
  <div style="font-size:12px;color:#6E6B8A;margin-top:4px">Simulation générée le ${date}</div></div>
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
<tr style="background:#2D2B55;color:#E0DEF0"><th style="padding:8px 10px;text-align:left;font-weight:600">Scénario</th><th style="padding:8px 10px;text-align:right">Impôt</th><th style="padding:8px 10px;text-align:right">Net vendeur</th></tr>
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
// ── CTA Block Component ──
function CTABlock({ icon, title, desc, cta, color, bgColor, borderColor }) {
  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.15s", }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{ background: color, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{cta}</div>
    </div>
  );
}
// ── Email Capture Modal ──
function EmailModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = () => { if (email.includes("@")) { setSent(true); onSubmit(email); } };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,36,24,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: 16, padding: 32, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        {!sent ? (
          <>
            <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>📄</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, textAlign: "center", marginBottom: 8 }}>Votre rapport détaillé</div>
            <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 20, lineHeight: 1.5 }}>
              Recevez votre rapport complet en PDF avec le détail du calcul, les scénarios temporels, et les pistes d'optimisation personnalisées.
            </div>
            <input type="email" placeholder="votre@email.fr" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: 12, boxSizing: "border-box" }} />
            <button onClick={handleSubmit}
              style={{ width: "100%", padding: "12px 0", background: "#2D2B55", color: "#E0DEF0", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Recevoir mon rapport gratuit
            </button>
            <div style={{ fontSize: 11, color: C.textLight, textAlign: "center", marginTop: 10 }}>Pas de spam. Données non partagées. Désabonnement en 1 clic.</div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 8 }}>Rapport envoyé !</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Vérifiez votre boîte mail. Le PDF arrive dans les 30 secondes.</div>
            <button onClick={onClose} style={{ padding: "10px 24px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}
// ── Main ──
export default function PlusValueSimulator() {
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [situation, setSituation] = useState("secondaire");
  const [fraisMode, setFraisMode] = useState("forfait");
  const [fraisReels, setFraisReels] = useState("");
  const [travauxMode, setTravauxMode] = useState("forfait");
  const [travauxReels, setTravauxReels] = useState("");
  const [fraisCession, setFraisCession] = useState("");
  const [activeTab, setActiveTab] = useState("result");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const pa = parseFloat(prixAchat) || 0;
  const pv = parseFloat(prixVente) || 0;
  const fc = parseFloat(fraisCession) || 0;
  const fraisAcqui = fraisMode === "forfait" ? pa * 0.075 : (parseFloat(fraisReels) || 0);
  const da = dateAchat ? new Date(dateAchat) : null;
  const years = da ? Math.floor((new Date().getTime() - da.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  const travauxVal = travauxMode === "forfait" && years >= 5 ? pa * 0.15 : (travauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0);
  const isRP = situation === "principale";
  const result = useMemo(() => {
    if (!pa || !pv || !da) return null;
    if (isRP) return { pvBrute: Math.max(0, pv - fc - pa - fraisAcqui - travauxVal), years, exonere: true, totalImpot: 0, netVendeur: pv - fc, tauxEffectif: 0, prixAchatCorrige: pa + fraisAcqui + travauxVal, prixVenteCorrige: pv - fc, abatIRPct: 0, abatPSPct: 0, pvNetIR: 0, pvNetPS: 0, impotIR: 0, impotPS: 0, surtaxe: 0 };
    return computePV(pa, pv, da, new Date(), fraisAcqui, travauxVal, fc);
  }, [pa, pv, da, fraisAcqui, travauxVal, fc, isRP, years]);
  const scenarios = useMemo(() => {
    if (!pa || !pv || !da || isRP) return [];
    return [0, 1, 2, 3, 5].map(extra => {
      const fd = new Date(); fd.setFullYear(fd.getFullYear() + extra);
      const r = computePV(pa, pv, da, fd, fraisAcqui, travauxVal, fc);
      return { label: extra === 0 ? "Aujourd'hui" : `+${extra} an${extra > 1 ? "s" : ""}`, year: new Date().getFullYear() + extra, ...r };
    });
  }, [pa, pv, da, fraisAcqui, travauxVal, fc, isRP]);
  const recommendations = useMemo(() => {
    if (!result || isRP) return [];
    return getRecommendations(result, { prixAchat: pa, travaux: travauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0 });
  }, [result, pa, travauxMode, travauxReels, isRP]);
  const pieData = result && !result.exonere && result.totalImpot > 0 ? [
    { name: "Net vendeur", value: Math.max(0, result.netVendeur), fill: "#3BAF7A" },
    { name: "IR (19%)", value: result.impotIR, fill: "#D4923A" },
    { name: "PS (17,2%)", value: result.impotPS, fill: "#6E6B8A" },
    ...(result.surtaxe > 0 ? [{ name: "Surtaxe", value: result.surtaxe, fill: "#E05656" }] : []),
  ] : [];
  const barData = scenarios.map(s => ({ name: s.label, impot: Math.round(s.totalImpot ?? 0), net: Math.round(s.netVendeur ?? 0) }));
  // PDF Export
  const handleExportPDF = useCallback(() => {
    if (!result || result.exonere) return;
    const dataObj = { prixAchat: pa, prixVente: pv, fraisAcqui, travaux: travauxVal, fraisCession: fc, fraisMode, travauxMode };
    const html = generatePDFContent(result, dataObj, recommendations, scenarios);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
  }, [result, pa, pv, fraisAcqui, travauxVal, fc, fraisMode, travauxMode, recommendations, scenarios]);
  // Email capture
  const handleEmailSubmit = useCallback((email) => {
    setEmailCaptured(true);
    // In production: POST to your backend/n8n webhook
    console.log("Email captured:", email);
  }, []);
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 15, color: C.text, background: C.card, outline: "none", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, display: "flex", alignItems: "center" };
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      {showEmailModal && <EmailModal onClose={() => setShowEmailModal(false)} onSubmit={handleEmailSubmit} />}
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "28px 24px 40px", color: "#E0DEF0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <img src="/logo.svg" alt="calculplusvalue.fr — Simulateur de plus-value immobilière" style={{ height: 52, width: "auto", display: "block" }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9B97C4", marginBottom: 12 }}>Simulation plus-value immobilière — Gratuit 2026</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, margin: 0, lineHeight: 1.15, color: "#E0DEF0" }}>Simulation de plus-value immobilière</h1>
          <p style={{ fontSize: 16, color: "#9B97C4", marginTop: 12, marginBottom: 24, maxWidth: 560, lineHeight: 1.6 }}>
            Estimez votre impôt sur la plus-value en quelques secondes. Abattements pour durée de détention, surtaxe, résidence principale : toutes les règles fiscales 2026 appliquées automatiquement.
          </p>
          {/* Réassurance badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { icon: "⚡", label: "Résultat instantané" },
              { icon: "📐", label: "Barèmes CGI 2026" },
              { icon: "🔒", label: "100% gratuit, sans inscription" },
              { icon: "📄", label: "Export PDF inclus" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 500, color: "#E0DEF0" }}>
                <span>{b.icon}</span><span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* ── Intro avant simulateur ── */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, color: C.text, margin: "0 0 12px 0" }}>
            Calculez votre impôt sur la plus-value en 30 secondes
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0, maxWidth: 720 }}>
            Renseignez les informations de votre bien ci-dessous. Le simulateur applique automatiquement les <strong>abattements pour durée de détention</strong>, le forfait travaux, les frais de notaire et la surtaxe si applicable. Le résultat s'affiche en temps réel.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
            {[
              { icon: "🏠", text: "Résidence secondaire, locatif ou terrain" },
              { icon: "📅", text: "Exonération IR à 22 ans, PS à 30 ans" },
              { icon: "💡", text: "Pistes d'optimisation personnalisées" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMuted }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "24px 20px", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Situation du bien <Tip text="La résidence principale est totalement exonérée. Pour une résidence secondaire, un locatif ou un terrain, l'impôt sur la plus-value s'applique." /></label>
              <select value={situation} onChange={e => setSituation(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="principale">Résidence principale</option>
                <option value="secondaire">Résidence secondaire</option>
                <option value="locatif">Investissement locatif</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prix d'achat <Tip text="Prix dans l'acte d'acquisition. Si donation/succession : valeur déclarée." /></label>
              <input type="number" placeholder="Ex : 180 000" value={prixAchat} onChange={e => setPrixAchat(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Prix de vente <Tip text="Prix envisagé ou figurant dans le compromis." /></label>
              <input type="number" placeholder="Ex : 280 000" value={prixVente} onChange={e => setPrixVente(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date d'achat <Tip text="Date de l'acte authentique. Détermine la durée de détention et les abattements." /></label>
              <input type="date" value={dateAchat} onChange={e => setDateAchat(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Frais d'acquisition <Tip text="Forfait 7,5% (sans justificatif) ou montant réel des frais de notaire." /></label>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {["forfait", "reel"].map(m => (
                  <button key={m} onClick={() => setFraisMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${fraisMode === m ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: fraisMode === m ? C.cardAlt : C.card, color: fraisMode === m ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {m === "forfait" ? "Forfait 7,5%" : "Réels"}
                  </button>
                ))}
              </div>
              {fraisMode === "reel" && <input type="number" placeholder="Montant" value={fraisReels} onChange={e => setFraisReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
              {fraisMode === "forfait" && pa > 0 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{fmt(pa * 0.075)}</div>}
            </div>
            <div>
              <label style={labelStyle}>Travaux <Tip text="Forfait 15% si détention > 5 ans (sans justificatif) ou réels avec factures d'entreprises." /></label>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {["forfait", "reel", "aucun"].map(m => (
                  <button key={m} onClick={() => setTravauxMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${travauxMode === m ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: travauxMode === m ? C.cardAlt : C.card, color: travauxMode === m ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {m === "forfait" ? "Forfait 15%" : m === "reel" ? "Réels" : "Aucun"}
                  </button>
                ))}
              </div>
              {travauxMode === "reel" && <input type="number" placeholder="Montant factures" value={travauxReels} onChange={e => setTravauxReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
              {travauxMode === "forfait" && pa > 0 && years >= 5 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{fmt(pa * 0.15)}</div>}
              {travauxMode === "forfait" && years < 5 && years > 0 && <div style={{ fontSize: 12, color: C.orange, marginTop: 2 }}>Disponible après 5 ans de détention</div>}
            </div>
            <div>
              <label style={labelStyle}>Frais de cession <Tip text="Diagnostics, frais d'agence à votre charge, mainlevée d'hypothèque. Déduits du prix de vente." /></label>
              <input type="number" placeholder="Diagnostics, agence..." value={fraisCession} onChange={e => setFraisCession(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
        {/* ═══ RESULTS ═══ */}
        {result && (
          <>
            {/* RP Exonération */}
            {isRP && (
              <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: "28px 20px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.green, marginBottom: 8 }}>Exonération totale</div>
                <div style={{ fontSize: 14, color: C.textMuted, maxWidth: 420, margin: "0 auto" }}>La vente de votre résidence principale est totalement exonérée d'impôt sur la plus-value.</div>
                {result.pvBrute > 0 && <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: C.green }}>Économie réalisée : {fmt(result.pvBrute * 0.362)}</div>}
              </div>
            )}
            {/* Non-RP Results */}
            {!isRP && result.pvBrute !== undefined && (
              <>
                {/* Tabs + Export buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8, marginBottom: 2 }}>
                  <div style={{ display: "flex", gap: 4, paddingLeft: 8 }}>
                    {[{ id: "result", label: "Résultat" }, { id: "scenarios", label: "Scénarios" }, { id: "detail", label: "Détail calcul" }].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: "10px 10px 0 0", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: activeTab === tab.id ? C.card : "transparent", color: activeTab === tab.id ? C.text : C.textMuted, borderBottom: activeTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent" }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {result.pvBrute > 0 && (
                    <div style={{ display: "flex", gap: 8, paddingRight: 4, paddingBottom: 4 }}>
                      <button onClick={handleExportPDF} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: `1.5px solid ${C.border}`, borderRadius: 8, cursor: "pointer", background: C.card, color: C.text, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                        📄 Imprimer / PDF
                      </button>
                      <button onClick={() => setShowEmailModal(true)} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 700, border: "none", borderRadius: 8, cursor: "pointer", background: "#2D2B55", color: "#E0DEF0", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                        ✉️ Recevoir par email
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ background: C.card, borderRadius: "0 14px 14px 14px", border: `1px solid ${C.border}`, padding: "24px 20px", marginBottom: 20 }}>
                  {/* TAB: Result */}
                  {activeTab === "result" && (
                    <div>
                      {result.pvBrute === 0 ? (
                        <div style={{ textAlign: "center", padding: 24 }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>📉</div>
                          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>Pas de plus-value</div>
                          <div style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>Le prix de vente corrigé est inférieur ou égal au prix d'achat corrigé.</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 24 }}>
                            <div style={{ background: C.redBg, borderRadius: 12, padding: 16, textAlign: "center" }}>
                              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.red, fontWeight: 700, marginBottom: 4 }}>Impôt total</div>
                              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: C.red }}>{fmt(result.totalImpot)}</div>
                              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Taux effectif : {fmtPct(result.tauxEffectif)}</div>
                            </div>
                            <div style={{ background: C.greenBg, borderRadius: 12, padding: 16, textAlign: "center" }}>
                              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.green, fontWeight: 700, marginBottom: 4 }}>Net vendeur</div>
                              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: C.green }}>{fmt(result.netVendeur)}</div>
                              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Après impôt</div>
                            </div>
                            <div style={{ background: C.accentBg, borderRadius: 12, padding: 16, textAlign: "center" }}>
                              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: C.accent, fontWeight: 700, marginBottom: 4 }}>Plus-value brute</div>
                              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: C.accent }}>{fmt(result.pvBrute)}</div>
                              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Détention : {result.years} ans</div>
                            </div>
                          </div>
                          {pieData.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 20 }}>
                              <div style={{ width: 170, height: 170 }}>
                                <ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={75} paddingAngle={2} strokeWidth={0}>{pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie></PieChart></ResponsiveContainer>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {pieData.map((d, i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, display: "inline-block" }} />
                                    <span style={{ fontSize: 13, color: C.textMuted, minWidth: 90 }}>{d.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(d.value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Abattement bars */}
                          <div>
                            {[
                              { label: "Abattement IR", pct: result.abatIRPct, target: 22, color: "#56CBAD" },
                              { label: "Abattement PS", pct: result.abatPSPct, target: 30, color: "#3F3D6E" },
                            ].map((b, i) => (
                              <div key={i} style={{ marginBottom: i === 0 ? 14 : 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                                  <span>{b.label} : {fmtPct(b.pct)}</span>
                                  <span style={{ color: b.pct >= 100 ? C.green : C.textMuted }}>{b.pct >= 100 ? "Exonéré ✓" : `Exonération dans ${Math.max(0, b.target - result.years)} ans`}</span>
                                </div>
                                <div style={{ height: 8, background: "#EEEDF5", borderRadius: 4, overflow: "hidden" }}>
                                  <div style={{ width: `${Math.min(100, b.pct)}%`, height: "100%", background: b.pct >= 100 ? C.green : b.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {/* TAB: Scenarios */}
                  {activeTab === "scenarios" && scenarios.length > 0 && (
                    <div>
                      <p style={{ fontSize: 14, color: C.textMuted, marginTop: 0, marginBottom: 16 }}>Comparez l'impôt selon la date de vente — à prix de vente constant.</p>
                      <div style={{ height: 250 }}>
                        <ResponsiveContainer>
                          <BarChart data={barData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: C.textMuted }} />
                            <YAxis tick={{ fontSize: 11, fill: C.textMuted }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <RTooltip formatter={v => fmt(v)} contentStyle={{ fontSize: 13, borderRadius: 8, border: `1px solid ${C.border}` }} />
                            <Bar dataKey="impot" name="Impôt" fill={C.red} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="net" name="Net vendeur" fill={C.green} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginTop: 16 }}>
                        {scenarios.map((s, i) => (
                          <div key={i} style={{ background: i === 0 ? C.accentBg : C.cardAlt, borderRadius: 10, padding: 12, textAlign: "center", border: i === 0 ? `1.5px solid ${C.accentLight}` : `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>Impôt</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>{fmt(s.totalImpot ?? 0)}</div>
                            {i > 0 && (s.totalImpot ?? 0) < (scenarios[0].totalImpot ?? 0) && (
                              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 2 }}>−{fmt((scenarios[0].totalImpot ?? 0) - (s.totalImpot ?? 0))}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* TAB: Detail */}
                  {activeTab === "detail" && result.pvBrute > 0 && (
                    <div style={{ fontSize: 14 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {[
                            ["Prix de vente", fmt(pv), ""],
                            ["− Frais de cession", `− ${fmt(fc)}`, ""],
                            ["= Prix de vente corrigé", fmt(pv - fc), "", true],
                            [null],
                            ["Prix d'achat", fmt(pa), ""],
                            ["+ Frais d'acquisition", `+ ${fmt(fraisAcqui)}`, fraisMode === "forfait" ? "Forfait 7,5%" : "Réels"],
                            ["+ Travaux", `+ ${fmt(travauxVal)}`, travauxMode === "forfait" ? "Forfait 15%" : travauxMode === "reel" ? "Factures" : "—"],
                            ["= Prix d'achat corrigé", fmt(pa + fraisAcqui + travauxVal), "", true],
                            [null],
                            ["Plus-value brute", fmt(result.pvBrute), `Détention : ${result.years} ans`, true],
                            [null],
                            [`Abattement IR (${fmtPct(result.abatIRPct)})`, `→ PV nette : ${fmt(result.pvNetIR)}`, "Exon. à 22 ans"],
                            ["Impôt sur le revenu (19%)", fmt(result.impotIR), "", true],
                            [null],
                            [`Abattement PS (${fmtPct(result.abatPSPct)})`, `→ PV nette : ${fmt(result.pvNetPS)}`, "Exon. à 30 ans"],
                            ["Prélèvements sociaux (17,2%)", fmt(result.impotPS), "", true],
                            ...(result.surtaxe > 0 ? [[null], ["Surtaxe (PV > 50K€)", fmt(result.surtaxe), "", true]] : []),
                            [null],
                            ["TOTAL IMPÔT", fmt(result.totalImpot), `Taux effectif : ${fmtPct(result.tauxEffectif)}`, true],
                            ["NET VENDEUR", fmt(result.netVendeur), "", true],
                          ].map((row, i) => row[0] === null ? (
                            <tr key={i}><td colSpan={3} style={{ height: 6 }}></td></tr>
                          ) : (
                            <tr key={i} style={{ borderBottom: `1px solid ${C.cardAlt}` }}>
                              <td style={{ padding: "7px 4px", fontWeight: row[3] ? 700 : 400, color: row[3] ? C.text : C.textMuted }}>{row[0]}</td>
                              <td style={{ padding: "7px 4px", textAlign: "right", fontWeight: row[3] ? 700 : 500, fontVariantNumeric: "tabular-nums" }}>{row[1]}</td>
                              <td style={{ padding: "7px 4px", fontSize: 12, color: C.textMuted }}>{row[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop: 16, padding: 12, background: C.cardAlt, borderRadius: 8, fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
                        <strong>Sources :</strong> Art. 150 U à 150 VH du CGI • Abattements : art. 150 VC • Surtaxe : art. 1609 nonies G • IR : 19% (art. 200 B) • PS : 17,2%
                      </div>
                    </div>
                  )}
                </div>
                {/* ═══ RECOMMENDATIONS ═══ */}
                {recommendations.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.accent, marginBottom: 12, paddingLeft: 4 }}>Pistes d'optimisation</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {recommendations.map((rec, i) => (
                        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", borderLeft: `4px solid ${rec.type === "alert" ? "#E05656" : rec.type === "timing" ? "#56CBAD" : "#3BAF7A"}` }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{rec.icon}</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{rec.title}</div>
                              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{rec.text}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* ═══ CTA AFFILIATION BLOCKS ═══ */}
                {result.pvBrute > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 12, paddingLeft: 4 }}>Pour aller plus loin</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {result.totalImpot > 2000 && (
                        <CTABlock
                          icon="🎯" title="Optimisez votre fiscalité immobilière"
                          desc={`Vous payez ${fmt(result.totalImpot)} d'impôt. Un conseiller patrimonial peut vous aider à réduire ce montant via des stratégies légales.`}
                          cta="Bilan gratuit" color="#3F3D6E" bgColor="rgba(45,43,85,0.06)" borderColor="#3F3D6E"
                        />
                      )}
                      <CTABlock
                        icon="🏠" title="Estimez la valeur réelle de votre bien"
                        desc="Obtenez une estimation gratuite basée sur les transactions récentes dans votre quartier."
                        cta="Estimer" color="#56CBAD" bgColor="rgba(86,203,173,0.06)" borderColor="#56CBAD"
                      />
                      {result.netVendeur > 50000 && (
                        <CTABlock
                          icon="📈" title="Réinvestissez intelligemment"
                          desc={`${fmt(result.netVendeur)} à placer ? Comparez les SCPI, l'assurance-vie et les placements immobiliers pour faire fructifier votre capital.`}
                          cta="Comparer" color="#3BAF7A" bgColor="rgba(59,175,122,0.06)" borderColor="#3BAF7A"
                        />
                      )}
                    </div>
                  </div>
                )}
                {/* ═══ EMAIL CAPTURE BANNER ═══ */}
                {result.pvBrute > 0 && !emailCaptured && (
                  <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", borderRadius: 14, padding: "24px 20px", marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}
                    onClick={() => setShowEmailModal(true)} role="button" tabIndex={0}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#E0DEF0", marginBottom: 6 }}>Recevez votre rapport complet</div>
                      <div style={{ fontSize: 13, color: "#9B97C4", lineHeight: 1.5 }}>PDF détaillé avec calcul ligne par ligne, comparaison temporelle, pistes d'optimisation et références légales. À montrer à votre notaire.</div>
                    </div>
                    <button style={{ padding: "12px 24px", background: "#56CBAD", color: "#1E1C3A", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                      ✉️ Recevoir gratuitement
                    </button>
                  </div>
                )}
                {emailCaptured && result.pvBrute > 0 && (
                  <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Rapport envoyé</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>Vérifiez votre boîte mail. Vous pouvez aussi <button onClick={handleExportPDF} style={{ background: "none", border: "none", color: C.accent, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: 0 }}>imprimer directement</button>.</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {/* Empty state */}
        {!result && (
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "48px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🏠</div>
            <div style={{ fontSize: 15, color: C.textMuted }}>Renseignez vos informations pour calculer votre plus-value en temps réel.</div>
          </div>
        )}
        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 0", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, textAlign: "center", lineHeight: 1.7 }}>
          Simulation indicative basée sur les barèmes en vigueur au 1er janvier 2026 (art. 150 U à 150 VH du CGI).
          <br/>Ne constitue pas un conseil fiscal. Consultez votre notaire pour un calcul définitif.
        </div>
      </div>

      {/* ═══ SEO CONTENT SECTION ═══ */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Comment ça marche */}
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>Comment fonctionne cette simulation de plus-value immobilière ?</h2>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 720 }}>
            Notre outil de <strong>simulation plus-value immobilière</strong> calcule en temps réel l'impôt dû lors de la vente d'un bien. La plus-value immobilière est la différence entre le <strong>prix de cession corrigé</strong> (prix de vente diminué des frais) et le <strong>prix d'acquisition corrigé</strong> (prix d'achat augmenté des frais de notaire et des travaux). Elle est soumise à l'impôt sur le revenu (19%) et aux prélèvements sociaux (17,2%), soit un taux global de 36,2% avant abattements.
          </p>

          {/* 3 colonnes : comment fonctionne le calcul */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[
              {
                step: "1",
                title: "Prix de cession corrigé",
                desc: "Partez du prix de vente, puis déduisez les frais à votre charge : diagnostics, frais d'agence vendeur, mainlevée d'hypothèque. C'est votre base de départ.",
              },
              {
                step: "2",
                title: "Prix d'acquisition corrigé",
                desc: "Ajoutez au prix d'achat les frais de notaire (forfait 7,5% ou réels) et les travaux (forfait 15% après 5 ans de détention, ou montant réel sur factures d'entreprises).",
              },
              {
                step: "3",
                title: "Abattements pour durée",
                desc: "La plus-value brute est réduite selon la durée de détention. L'exonération totale intervient à 22 ans pour l'IR et 30 ans pour les prélèvements sociaux.",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: C.cardAlt, borderRadius: 12, padding: "20px 18px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: C.text }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Tableau abattements */}
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>Tableau des abattements 2026</h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
            Les abattements pour durée de détention s'appliquent différemment selon qu'il s'agit de l'impôt sur le revenu (IR) ou des prélèvements sociaux (PS).
          </p>
          <div style={{ overflowX: "auto", marginBottom: 48 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
              <thead>
                <tr style={{ background: "#2D2B55", color: "#E0DEF0" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Durée de détention</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Abattement IR / an</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Abattement PS / an</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Cumul IR</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Cumul PS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Moins de 6 ans", "0%", "0%", "0%", "0%"],
                  ["6e à 21e année", "6% / an", "1,65% / an", "6% → 96%", "1,65% → 26,4%"],
                  ["22e année", "4%", "1,60%", "100% → exonéré", "28%"],
                  ["23e à 30e année", "—", "9% / an", "—", "28% → 100%"],
                  ["Au-delà de 30 ans", "—", "—", "Exonéré", "Exonéré"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.cardAlt : C.card, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "9px 14px", fontWeight: 500 }}>{row[0]}</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", color: C.textMuted }}>{row[1]}</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", color: C.textMuted }}>{row[2]}</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, color: C.accent }}>{row[3]}</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, color: "#6E6B8A" }}>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 24, marginTop: 0 }}>Questions fréquentes</h2>
          <div style={{ display: "grid", gap: 14, marginBottom: 48 }}>
            {[
              {
                q: "La résidence principale est-elle exonérée de plus-value ?",
                a: "Oui, totalement. La vente de votre résidence principale bénéficie d'une exonération totale d'impôt sur la plus-value, quelle que soit la durée de détention et le montant de la plus-value réalisée (art. 150 U II 1° du CGI). Il faut que le bien soit votre résidence habituelle et effective au moment de la cession.",
              },
              {
                q: "Peut-on déduire les travaux pour réduire la plus-value ?",
                a: "Oui. Vous pouvez déduire les dépenses de travaux de construction, reconstruction, agrandissement ou amélioration réalisés par une entreprise (sur factures). Si vous détenez le bien depuis plus de 5 ans, vous pouvez opter pour le forfait de 15% du prix d'achat sans justificatif, si ce montant est plus avantageux.",
              },
              {
                q: "Qu'est-ce que la surtaxe sur les plus-values élevées ?",
                a: "Une surtaxe progressive s'applique lorsque la plus-value nette imposable à l'IR dépasse 50 000 €. Elle va de 2% (entre 50 001 et 100 000 €) à 6% (au-delà de 250 000 €). Elle est calculée sur la totalité de la plus-value nette IR dès le premier euro dès lors que le seuil est franchi.",
              },
              {
                q: "Comment sont calculés les frais de notaire forfaitaires ?",
                a: "Le forfait de frais d'acquisition est fixé à 7,5% du prix d'achat. Il comprend les droits de mutation, les émoluments du notaire et les frais divers. Vous pouvez utiliser ce forfait même sans justificatifs, ou opter pour les frais réels s'ils sont supérieurs (cas rare pour les biens anciens).",
              },
              {
                q: "Quand la plus-value est-elle totalement exonérée ?",
                a: "L'exonération totale d'impôt sur le revenu (19%) intervient après 22 ans de détention. Pour les prélèvements sociaux (17,2%), il faut attendre 30 ans. Au-delà de ces durées, aucun impôt n'est dû sur la plus-value, quelle que soit son montant.",
              },
            ].map((item, i) => (
              <details key={i} style={{ background: C.cardAlt, borderRadius: 10, padding: "16px 18px", border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <summary style={{ fontWeight: 600, fontSize: 14, color: C.text, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  {item.q}
                  <span style={{ fontSize: 18, color: C.accent, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>{item.a}</p>
              </details>
            ))}
          </div>

          {/* Références légales */}
          <div style={{ background: C.cardAlt, borderRadius: 12, padding: "20px 18px", border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 8 }}>📚 Références légales et sources</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.8 }}>
              <strong>Code général des impôts :</strong> Art. 150 U à 150 VH (plus-values immobilières des particuliers) • Art. 150 VC (abattements pour durée de détention) • Art. 200 B (taux d'imposition de 19%) • Art. 1609 nonies G (surtaxe progressive)<br/>
              <strong>Prélèvements sociaux :</strong> CSG 9,2% + CRDS 0,5% + prélèvement de solidarité 7,5% = 17,2% (art. L136-7 CSS)<br/>
              <strong>Barème :</strong> En vigueur au 1er janvier 2026 — <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>impots.gouv.fr</a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#2D2B55", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#9B97C4", fontFamily: "'DM Serif Display', serif" }}>calculplusvalue.fr</div>
          <div style={{ fontSize: 11, color: "#6E6B8A" }}>© 2026 — Simulateur gratuit de plus-value immobilière — Simulation indicative, non contractuelle</div>
          <div style={{ fontSize: 11 }}>
            <a href="/mentions-legales" style={{ color: "#9B97C4", textDecoration: "none", borderBottom: "1px solid #4A4870" }}>
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
