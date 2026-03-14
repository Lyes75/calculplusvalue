"use client";
import { useState, useMemo, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { computePlusValue, computeRPResult, computeScenarios, fmt, fmtPct } from "@/lib/calcul-engine";
import { getRecommendations } from "@/lib/recommendations";
import { generatePDFContent } from "@/lib/pdf-generator";
import { C, FORFAIT_FRAIS_ACQUISITION, FORFAIT_TRAVAUX } from "@/lib/constants";
import type { CalculResult, ScenarioResult, Recommendation } from "@/lib/types";

// ── Props ──────────────────────────────────────────────────────────────────
export interface SimulateurBaseProps {
  defaultType?: "principale" | "secondaire" | "locatif" | "lmnp" | "terrain" | "scpi";
  defaultSituation?: string;
  defaultMode?: string;
  showTypeResidence?: boolean;
  showSituationVendeur?: boolean;
  showModeAcquisition?: boolean;
  showAmortissementsLMNP?: boolean;
  showQuotePart?: boolean;
  showDemembrement?: boolean;
  showNonResidentOptions?: boolean;
  showSCI_IS_Options?: boolean;
  labelPrixAchat?: string;
  labelPrixVente?: string;
  labelFraisAcquisition?: string;
  disableForfaitTravaux?: boolean;
  disableForfaitFrais?: boolean;
  caseBadge?: { label: string; color: string };
  children?: React.ReactNode;
}

// ── Sous-composant Tooltip ─────────────────────────────────────────────────
function Tip({ text }: { text: string }) {
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

// ── Sous-composant CTABlock ────────────────────────────────────────────────
interface CTABlockProps {
  icon: string; title: string; desc: string; cta: string;
  color: string; bgColor: string; borderColor: string;
}
function CTABlock({ icon, title, desc, cta, color, bgColor, borderColor }: CTABlockProps) {
  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{ background: color, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{cta}</div>
    </div>
  );
}

// ── Sous-composant EmailModal ──────────────────────────────────────────────
interface EmailModalProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
}
function EmailModal({ onClose, onSubmit }: EmailModalProps) {
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

// ── Composant principal ────────────────────────────────────────────────────
export default function SimulateurBase({
  defaultType = "secondaire",
  showTypeResidence = true,
  showAmortissementsLMNP = false,
  caseBadge,
}: SimulateurBaseProps) {
  // ── State ──
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [situation, setSituation] = useState(defaultType);
  const [fraisMode, setFraisMode] = useState<"forfait" | "reel">("forfait");
  const [fraisReels, setFraisReels] = useState("");
  const [travauxMode, setTravauxMode] = useState<"forfait" | "reel" | "aucun">("forfait");
  const [travauxReels, setTravauxReels] = useState("");
  const [fraisCession, setFraisCession] = useState("");
  const [amortissementsLMNP, setAmortissementsLMNP] = useState("");
  const [activeTab, setActiveTab] = useState("result");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  // ── Valeurs dérivées ──
  const pa = parseFloat(prixAchat) || 0;
  const pv = parseFloat(prixVente) || 0;
  const fc = parseFloat(fraisCession) || 0;
  const amort = parseFloat(amortissementsLMNP) || 0;
  const fraisAcqui = fraisMode === "forfait" ? pa * FORFAIT_FRAIS_ACQUISITION : (parseFloat(fraisReels) || 0);
  const da = dateAchat ? new Date(dateAchat) : null;
  const years = da ? Math.floor((new Date().getTime() - da.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  const travauxVal = travauxMode === "forfait" && years >= 5
    ? pa * FORFAIT_TRAVAUX
    : (travauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0);
  const isRP = situation === "principale";
  const isLMNP = situation === "lmnp" || defaultType === "lmnp";
  const calcOptions = { typeResidence: situation, amortissementsLMNP: amort };

  // ── Calculs ──
  const result = useMemo((): CalculResult | null => {
    if (!pa || !pv || !da) return null;
    if (isRP) return computeRPResult(pa, pv, fraisAcqui, travauxVal, fc, years);
    return computePlusValue(pa, pv, da, new Date(), fraisAcqui, travauxVal, fc, calcOptions);
  }, [pa, pv, da?.getTime(), fraisAcqui, travauxVal, fc, isRP, years, situation, amort]);

  const scenarios = useMemo((): ScenarioResult[] => {
    if (!pa || !pv || !da || isRP) return [];
    return computeScenarios(pa, pv, da, fraisAcqui, travauxVal, fc, calcOptions);
  }, [pa, pv, da?.getTime(), fraisAcqui, travauxVal, fc, isRP, situation, amort]);

  const recommendations = useMemo((): Recommendation[] => {
    if (!result || isRP) return [];
    return getRecommendations(result, {
      prixAchat: pa,
      travaux: travauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0,
      travauxMode,
      typeResidence: situation as "principale" | "secondaire" | "locatif" | "lmnp" | "terrain" | "scpi",
      amortissementsLMNP: amort,
    }, da ?? undefined);
  }, [result, pa, travauxMode, travauxReels, isRP, situation, amort, da?.getTime()]);

  const pieData = result && !result.exonere && result.totalImpot > 0 ? [
    { name: "Net vendeur", value: Math.max(0, result.netVendeur), fill: "#3BAF7A" },
    { name: "IR (19%)", value: result.impotIR, fill: "#D4923A" },
    { name: "PS (17,2%)", value: result.impotPS, fill: "#6E6B8A" },
    ...(result.surtaxe > 0 ? [{ name: "Surtaxe", value: result.surtaxe, fill: "#E05656" }] : []),
  ] : [];

  const barData = scenarios.map(s => ({
    name: s.label,
    impot: Math.round(s.totalImpot ?? 0),
    net: Math.round(s.netVendeur ?? 0),
  }));

  // ── Handlers ──
  const handleExportPDF = useCallback(() => {
    if (!result || result.exonere) return;
    const dataObj = { prixAchat: pa, prixVente: pv, fraisAcqui, travaux: travauxVal, fraisCession: fc, fraisMode, travauxMode };
    const html = generatePDFContent(result, dataObj, recommendations, scenarios);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
  }, [result, pa, pv, fraisAcqui, travauxVal, fc, fraisMode, travauxMode, recommendations, scenarios]);

  const handleEmailSubmit = useCallback(async (email: string) => {
    setEmailCaptured(true);
    if (!result) return;
    const data = { prixAchat: pa, prixVente: pv, fraisAcqui, travaux: travauxVal, fraisCession: fc, fraisMode, travauxMode };
    const htmlContent = generatePDFContent(result, data, recommendations, scenarios);
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, htmlContent }),
      });
    } catch (err) {
      console.error("Erreur envoi email:", err);
    }
  }, [result, pa, pv, fraisAcqui, travauxVal, fc, fraisMode, travauxMode, recommendations, scenarios]);

  // ── Styles ──
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 15, color: C.text, background: C.card, outline: "none", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, display: "flex", alignItems: "center" };

  // ── Render ──
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      {showEmailModal && <EmailModal onClose={() => setShowEmailModal(false)} onSubmit={handleEmailSubmit} />}

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "28px 24px 40px", color: "#E0DEF0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <img src="/logo.svg" alt="calculplusvalue.fr — Simulateur de plus-value immobilière" style={{ height: 52, width: "auto", display: "block" }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9B97C4", marginBottom: 12 }}>Simulation plus-value immobilière — Gratuit 2026</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, margin: 0, lineHeight: 1.15, color: "#E0DEF0" }}>Simulation de plus-value immobilière</h1>
          <p style={{ fontSize: 16, color: "#9B97C4", marginTop: 12, marginBottom: 24, maxWidth: 560, lineHeight: 1.6 }}>
            Estimez votre impôt sur la plus-value en quelques secondes. Abattements pour durée de détention, surtaxe, résidence principale : toutes les règles fiscales 2026 appliquées automatiquement.
          </p>
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

        {/* ── Intro ── */}
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

        {/* ── Formulaire ── */}
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "24px 20px", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {showTypeResidence && (
              <div>
                <label style={labelStyle}>Situation du bien <Tip text="La résidence principale est totalement exonérée. Pour une résidence secondaire, un locatif ou un terrain, l'impôt sur la plus-value s'applique." /></label>
                <select value={situation} onChange={e => setSituation(e.target.value as typeof situation)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="principale">Résidence principale</option>
                  <option value="secondaire">Résidence secondaire</option>
                  <option value="locatif">Investissement locatif</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>
            )}
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
                {(["forfait", "reel"] as const).map(m => (
                  <button key={m} onClick={() => setFraisMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${fraisMode === m ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: fraisMode === m ? C.cardAlt : C.card, color: fraisMode === m ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {m === "forfait" ? "Forfait 7,5%" : "Réels"}
                  </button>
                ))}
              </div>
              {fraisMode === "reel" && <input type="number" placeholder="Montant" value={fraisReels} onChange={e => setFraisReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
              {fraisMode === "forfait" && pa > 0 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{fmt(pa * FORFAIT_FRAIS_ACQUISITION)}</div>}
            </div>
            <div>
              <label style={labelStyle}>Travaux <Tip text="Forfait 15% si détention > 5 ans (sans justificatif) ou réels avec factures d'entreprises." /></label>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {(["forfait", "reel", "aucun"] as const).map(m => (
                  <button key={m} onClick={() => setTravauxMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${travauxMode === m ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: travauxMode === m ? C.cardAlt : C.card, color: travauxMode === m ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {m === "forfait" ? "Forfait 15%" : m === "reel" ? "Réels" : "Aucun"}
                  </button>
                ))}
              </div>
              {travauxMode === "reel" && <input type="number" placeholder="Montant factures" value={travauxReels} onChange={e => setTravauxReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
              {travauxMode === "forfait" && pa > 0 && years >= 5 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{fmt(pa * FORFAIT_TRAVAUX)}</div>}
              {travauxMode === "forfait" && years < 5 && years > 0 && <div style={{ fontSize: 12, color: C.orange, marginTop: 2 }}>Disponible après 5 ans de détention</div>}
            </div>
            <div>
              <label style={labelStyle}>Frais de cession <Tip text="Diagnostics, frais d'agence à votre charge, mainlevée d'hypothèque. Déduits du prix de vente." /></label>
              <input type="number" placeholder="Diagnostics, agence..." value={fraisCession} onChange={e => setFraisCession(e.target.value)} style={inputStyle} />
            </div>

            {/* ── Champ amortissements LMNP ── */}
            {(showAmortissementsLMNP || isLMNP) && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ background: "#EEEDF5", borderLeft: "3px solid #56CBAD", borderRadius: 8, padding: 16 }}>
                  <label style={{ ...labelStyle, color: C.primary, fontWeight: 700 }}>
                    Amortissements cumulés déduits
                    <Tip text="Depuis la loi de finances 2025, les amortissements admis en déduction (sur le bien, les meubles, les travaux) réduisent le prix d'acquisition corrigé. Cela augmente mécaniquement la plus-value imposable. Indiquez le total des amortissements déduits depuis la mise en location." />
                  </label>
                  <input
                    type="number"
                    placeholder="Ex : 30 000"
                    value={amortissementsLMNP}
                    onChange={e => setAmortissementsLMNP(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>
                    ⚠️ <strong>Réforme LF 2025 — art. 150 VB II du CGI :</strong> les amortissements déduits sont réintégrés dans le calcul de la plus-value.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Badge cas spécial ── */}
        {caseBadge && (
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: caseBadge.color === "menthe" ? "rgba(86,203,173,0.12)" : caseBadge.color, border: `1.5px solid ${caseBadge.color === "menthe" ? "#56CBAD" : caseBadge.color}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: caseBadge.color === "menthe" ? "#2D2B55" : "#fff" }}>
              <span>🏷️</span>
              <span>{caseBadge.label}</span>
            </span>
          </div>
        )}

        {/* ── Warnings moteur de calcul ── */}
        {result?.warnings && result.warnings.length > 0 && (
          <div style={{ background: "#FDF3E8", border: "1px solid #D4923A", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 13, color: "#7A4F1A", lineHeight: 1.6 }}>
              {result.warnings.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          </div>
        )}

        {/* ── Résultats ── */}
        {result && (
          <>
            {/* Résidence principale */}
            {isRP && (
              <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: "28px 20px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.green, marginBottom: 8 }}>Exonération totale</div>
                <div style={{ fontSize: 14, color: C.textMuted, maxWidth: 420, margin: "0 auto" }}>La vente de votre résidence principale est totalement exonérée d'impôt sur la plus-value.</div>
                {result.pvBrute > 0 && <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: C.green }}>Économie réalisée : {fmt(result.pvBrute * 0.362)}</div>}
              </div>
            )}

            {/* Non-RP */}
            {!isRP && result.pvBrute !== undefined && (
              <>
                {/* Tabs + Export */}
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
                  {/* Tab: Résultat */}
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

                  {/* Tab: Scénarios */}
                  {activeTab === "scenarios" && scenarios.length > 0 && (
                    <div>
                      <p style={{ fontSize: 14, color: C.textMuted, marginTop: 0, marginBottom: 16 }}>Comparez l'impôt selon la date de vente — à prix de vente constant.</p>
                      <div style={{ height: 250 }}>
                        <ResponsiveContainer>
                          <BarChart data={barData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: C.textMuted }} />
                            <YAxis tick={{ fontSize: 11, fill: C.textMuted }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                            <RTooltip formatter={(v) => fmt(Number(v))} contentStyle={{ fontSize: 13, borderRadius: 8, border: `1px solid ${C.border}` }} />
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

                  {/* Tab: Détail */}
                  {activeTab === "detail" && result.pvBrute > 0 && (
                    <div style={{ fontSize: 14 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {([
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
                            ...(result.surtaxe > 0 ? [[null], ["Surtaxe (PV > 50K€)", fmt(result.surtaxe), "", true]] as (string | boolean | null)[][] : []),
                            [null],
                            ["TOTAL IMPÔT", fmt(result.totalImpot), `Taux effectif : ${fmtPct(result.tauxEffectif)}`, true],
                            ["NET VENDEUR", fmt(result.netVendeur), "", true],
                          ] as (string | boolean | null)[][]).map((row, i) => row[0] === null ? (
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

                {/* Recommandations */}
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

                {/* CTAs */}
                {result.pvBrute > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 12, paddingLeft: 4 }}>Pour aller plus loin</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {result.totalImpot > 2000 && (
                        <CTABlock icon="🎯" title="Optimisez votre fiscalité immobilière"
                          desc={`Vous payez ${fmt(result.totalImpot)} d'impôt. Un conseiller patrimonial peut vous aider à réduire ce montant via des stratégies légales.`}
                          cta="Bilan gratuit" color="#3F3D6E" bgColor="rgba(45,43,85,0.06)" borderColor="#3F3D6E" />
                      )}
                      <CTABlock icon="🏠" title="Estimez la valeur réelle de votre bien"
                        desc="Obtenez une estimation gratuite basée sur les transactions récentes dans votre quartier."
                        cta="Estimer" color="#56CBAD" bgColor="rgba(86,203,173,0.06)" borderColor="#56CBAD" />
                      {result.netVendeur > 50000 && (
                        <CTABlock icon="📈" title="Réinvestissez intelligemment"
                          desc={`${fmt(result.netVendeur)} à placer ? Comparez les SCPI, l'assurance-vie et les placements immobiliers pour faire fructifier votre capital.`}
                          cta="Comparer" color="#3BAF7A" bgColor="rgba(59,175,122,0.06)" borderColor="#3BAF7A" />
                      )}
                    </div>
                  </div>
                )}

                {/* Email capture */}
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

        {/* Footer disclaimer */}
        <div style={{ marginTop: 32, padding: "16px 0", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, textAlign: "center", lineHeight: 1.7 }}>
          Simulation indicative basée sur les barèmes en vigueur au 1er janvier 2026 (art. 150 U à 150 VH du CGI).
          <br />Ne constitue pas un conseil fiscal. Consultez votre notaire pour un calcul définitif.
        </div>
      </div>

      {/* ── SEO Content ── */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>Comment fonctionne cette simulation de plus-value immobilière ?</h2>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 720 }}>
            Notre outil de <strong>simulation plus-value immobilière</strong> calcule en temps réel l'impôt dû lors de la vente d'un bien. La plus-value immobilière est la différence entre le <strong>prix de cession corrigé</strong> (prix de vente diminué des frais) et le <strong>prix d'acquisition corrigé</strong> (prix d'achat augmenté des frais de notaire et des travaux). Elle est soumise à l'impôt sur le revenu (19%) et aux prélèvements sociaux (17,2%), soit un taux global de 36,2% avant abattements.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 48 }}>
            {[
              { step: "1", title: "Prix de cession corrigé", desc: "Partez du prix de vente, puis déduisez les frais à votre charge : diagnostics, frais d'agence vendeur, mainlevée d'hypothèque. C'est votre base de départ." },
              { step: "2", title: "Prix d'acquisition corrigé", desc: "Ajoutez au prix d'achat les frais de notaire (forfait 7,5% ou réels) et les travaux (forfait 15% après 5 ans de détention, ou montant réel sur factures d'entreprises)." },
              { step: "3", title: "Abattements pour durée", desc: "La plus-value brute est réduite selon la durée de détention. L'exonération totale intervient à 22 ans pour l'IR et 30 ans pour les prélèvements sociaux." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.cardAlt, borderRadius: 12, padding: "20px 18px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{item.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: C.text }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

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

          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 24, marginTop: 0 }}>Questions fréquentes</h2>
          <div style={{ display: "grid", gap: 14, marginBottom: 48 }}>
            {[
              { q: "La résidence principale est-elle exonérée de plus-value ?", a: "Oui, totalement. La vente de votre résidence principale bénéficie d'une exonération totale d'impôt sur la plus-value, quelle que soit la durée de détention et le montant de la plus-value réalisée (art. 150 U II 1° du CGI). Il faut que le bien soit votre résidence habituelle et effective au moment de la cession." },
              { q: "Peut-on déduire les travaux pour réduire la plus-value ?", a: "Oui. Vous pouvez déduire les dépenses de travaux de construction, reconstruction, agrandissement ou amélioration réalisés par une entreprise (sur factures). Si vous détenez le bien depuis plus de 5 ans, vous pouvez opter pour le forfait de 15% du prix d'achat sans justificatif, si ce montant est plus avantageux." },
              { q: "Qu'est-ce que la surtaxe sur les plus-values élevées ?", a: "Une surtaxe progressive s'applique lorsque la plus-value nette imposable à l'IR dépasse 50 000 €. Elle va de 2% (entre 50 001 et 100 000 €) à 6% (au-delà de 250 000 €). Elle est calculée sur la totalité de la plus-value nette IR dès le premier euro dès lors que le seuil est franchi." },
              { q: "Comment sont calculés les frais de notaire forfaitaires ?", a: "Le forfait de frais d'acquisition est fixé à 7,5% du prix d'achat. Il comprend les droits de mutation, les émoluments du notaire et les frais divers. Vous pouvez utiliser ce forfait même sans justificatifs, ou opter pour les frais réels s'ils sont supérieurs (cas rare pour les biens anciens)." },
              { q: "Quand la plus-value est-elle totalement exonérée ?", a: "L'exonération totale d'impôt sur le revenu (19%) intervient après 22 ans de détention. Pour les prélèvements sociaux (17,2%), il faut attendre 30 ans. Au-delà de ces durées, aucun impôt n'est dû sur la plus-value, quelle que soit son montant." },
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

          <div style={{ background: C.cardAlt, borderRadius: 12, padding: "20px 18px", border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 8 }}>📚 Références légales et sources</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.8 }}>
              <strong>Code général des impôts :</strong> Art. 150 U à 150 VH (plus-values immobilières des particuliers) • Art. 150 VC (abattements pour durée de détention) • Art. 200 B (taux d'imposition de 19%) • Art. 1609 nonies G (surtaxe progressive)<br />
              <strong>Prélèvements sociaux :</strong> CSG 9,2% + CRDS 0,5% + prélèvement de solidarité 7,5% = 17,2% (art. L136-7 CSS)<br />
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
            <a href="/mentions-legales" style={{ color: "#9B97C4", textDecoration: "none", borderBottom: "1px solid #4A4870" }}>Mentions légales</a>
          </div>
        </div>
      </div>
    </div>
  );
}
