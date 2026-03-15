"use client";
import { useState, useMemo, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { computePlusValue, computeRPResult, computeScenarios, fmt, fmtPct, getFractionDemembrement } from "@/lib/calcul-engine";
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
  defaultSituation,
  defaultMode,
  showTypeResidence = true,
  showSituationVendeur = false,
  showModeAcquisition = false,
  showAmortissementsLMNP = false,
  showQuotePart = false,
  showDemembrement = false,
  showSCI_IS_Options = false,
  showNonResidentOptions = false,
  disableForfaitFrais = false,
  disableForfaitTravaux = false,
  labelPrixAchat,
  labelFraisAcquisition,
  caseBadge,
}: SimulateurBaseProps) {
  // ── State ──
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [situation, setSituation] = useState(defaultType);
  const [situationVendeur, setSituationVendeur] = useState<"resident" | "non-resident-ue" | "non-resident-hors-ue" | "sci-ir" | "sci-is">(
    (defaultSituation as "resident" | "non-resident-ue" | "non-resident-hors-ue" | "sci-ir" | "sci-is") ?? "sci-ir"
  );
  const [modeAcquisition, setModeAcquisition] = useState<"achat" | "donation" | "succession">(
    (defaultMode as "achat" | "donation" | "succession") ?? "achat"
  );
  const [fraisMode, setFraisMode] = useState<"forfait" | "reel">(
    disableForfaitFrais ? "reel" : "forfait"
  );
  const [fraisReels, setFraisReels] = useState("");
  const [travauxMode, setTravauxMode] = useState<"forfait" | "reel" | "aucun">("forfait");
  const [travauxReels, setTravauxReels] = useState("");
  const [fraisCession, setFraisCession] = useState("");
  const [amortissementsLMNP, setAmortissementsLMNP] = useState("");
  // Options non-résident
  const [affilieSecuEEE, setAffilieSecuEEE] = useState(true);
  const [paysNonCooperatif, setPaysNonCooperatif] = useState(false);
  const [resideFrance2ans, setResideFrance2ans] = useState(false);
  const [anneesNonResident, setAnneesNonResident] = useState("");
  // Options SCI
  const [quotePart, setQuotePart] = useState("100");
  const [amortissementsSCI_IS, setAmortissementsSCI_IS] = useState("");
  const [beneficeAvantPV, setBeneficeAvantPV] = useState("");
  // Options Indivision / Démembrement
  const [modeIndivision, setModeIndivision] = useState<"plein" | "indivision" | "demembrement">("plein");
  const [typeDemembrement, setTypeDemembrement] = useState<"usufruit" | "nue-propriete">("nue-propriete");
  const [ageUsufruitier, setAgeUsufruitier] = useState("60");
  const [activeTab, setActiveTab] = useState("result");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  // ── Valeurs dérivées ──
  const pa = parseFloat(prixAchat) || 0;
  const pv = parseFloat(prixVente) || 0;
  const fc = parseFloat(fraisCession) || 0;
  const amort = parseFloat(amortissementsLMNP) || 0;
  const isDonationSuccession = modeAcquisition === "donation" || modeAcquisition === "succession";
  const isSciIR = situationVendeur === "sci-ir";
  const isSciIS = situationVendeur === "sci-is";
  const isSci = isSciIR || isSciIS;
  // Pour donation/succession, le forfait 7,5% n'est pas applicable
  const effectiveFraisMode = (disableForfaitFrais || isDonationSuccession) ? "reel" : fraisMode;
  const fraisAcqui = effectiveFraisMode === "forfait" ? pa * FORFAIT_FRAIS_ACQUISITION : (parseFloat(fraisReels) || 0);
  const da = dateAchat ? new Date(dateAchat) : null;
  const years = da ? Math.floor((new Date().getTime() - da.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
  // Pour terrain/SCPI, le forfait 15% travaux ne s'applique pas
  const effectiveTravauxMode = disableForfaitTravaux && travauxMode === "forfait" ? "aucun" : travauxMode;
  const travauxVal = effectiveTravauxMode === "forfait" && years >= 5
    ? pa * FORFAIT_TRAVAUX
    : (effectiveTravauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0);
  const isRP = situation === "principale" && !isSci;
  const isLMNP = situation === "lmnp" || defaultType === "lmnp";
  const isNonResident = situationVendeur === "non-resident-ue" || situationVendeur === "non-resident-hors-ue";
  const showNROptions = (showNonResidentOptions || isNonResident) && !isRP && !isSci;
  const anneesNR = parseInt(anneesNonResident) || 0;
  const quotePartNum = Math.min(100, Math.max(1, parseFloat(quotePart) || 100));
  const amortIS = parseFloat(amortissementsSCI_IS) || 0;
  const benAvantPV = parseFloat(beneficeAvantPV) || 0;
  // Démembrement
  const ageUsufruitierNum = Math.min(120, Math.max(1, parseInt(ageUsufruitier) || 60));
  const fractionDemem = getFractionDemembrement(ageUsufruitierNum, typeDemembrement);
  const isIndivisionMode = modeIndivision === "indivision";
  const isDemembrementMode = modeIndivision === "demembrement";

  const calcOptions = {
    typeResidence: situation,
    amortissementsLMNP: amort,
    situationVendeur,
    affilieSecuEEE,
    paysNonCooperatif,
    resideFrance2ans,
    anneesNonResident: anneesNR,
    modeAcquisition,
    quotePart: quotePartNum,
    modeIndivision,
    typeDemembrement,
    ageUsufruitier: ageUsufruitierNum,
    amortissementsSCI_IS: amortIS,
    beneficeAvantPV: benAvantPV,
  };

  // ── Calculs ──
  const result = useMemo((): CalculResult | null => {
    if (!pa || !pv || !da) return null;
    if (isRP) return computeRPResult(pa, pv, fraisAcqui, travauxVal, fc, years);
    return computePlusValue(pa, pv, da, new Date(), fraisAcqui, travauxVal, fc, calcOptions);
  }, [pa, pv, da?.getTime(), fraisAcqui, travauxVal, fc, isRP, years, situation, amort,
      situationVendeur, affilieSecuEEE, paysNonCooperatif, resideFrance2ans, anneesNR]);

  const scenarios = useMemo((): ScenarioResult[] => {
    if (!pa || !pv || !da || isRP) return [];
    return computeScenarios(pa, pv, da, fraisAcqui, travauxVal, fc, calcOptions);
  }, [pa, pv, da?.getTime(), fraisAcqui, travauxVal, fc, isRP, situation, amort,
      situationVendeur, affilieSecuEEE, paysNonCooperatif, resideFrance2ans, anneesNR]);

  const recommendations = useMemo((): Recommendation[] => {
    if (!result || isRP) return [];
    // Pour SCPI : on passe les frais réels bruts (avant application du forfait) pour la recommandation
    const fraisAcquiReelsBruts = parseFloat(fraisReels) || 0;
    return getRecommendations(result, {
      prixAchat: pa,
      prixVente: pv,
      travaux: travauxMode === "reel" ? (parseFloat(travauxReels) || 0) : 0,
      travauxMode,
      typeResidence: situation as "principale" | "secondaire" | "locatif" | "lmnp" | "terrain" | "scpi",
      amortissementsLMNP: amort,
      situationVendeur,
      affilieSecuEEE,
      paysNonCooperatif,
    }, da ?? undefined, fraisAcquiReelsBruts);
  }, [result, pa, pv, travauxMode, travauxReels, isRP, situation, amort,
      situationVendeur, affilieSecuEEE, paysNonCooperatif, da?.getTime()]);

  const tauxIRDisplay = result?.tauxIR ? `${(result.tauxIR * 100).toFixed(2).replace(/\.?0+$/, "")}%` : "19%";
  const tauxPSDisplay = result?.tauxPS ? `${(result.tauxPS * 100).toFixed(1).replace(".", ",")}%` : "17,2%";

  const pieData = result && !result.exonere && result.totalImpot > 0 ? [
    { name: "Net vendeur", value: Math.max(0, result.netVendeur), fill: "#3BAF7A" },
    { name: `IR (${tauxIRDisplay})`, value: result.impotIR, fill: "#D4923A" },
    { name: `PS (${tauxPSDisplay})`, value: result.impotPS, fill: "#6E6B8A" },
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

            {/* ── Situation vendeur (non-résident ou SCI) ── */}
            {showSituationVendeur && (
              <div>
                <label style={labelStyle}>Régime fiscal <Tip text="SCI à l'IR : régime des particuliers (abattements pour durée de détention). SCI à l'IS : plus-value professionnelle, calcul sur la VNC, pas d'abattements." /></label>
                <select value={situationVendeur} onChange={e => setSituationVendeur(e.target.value as typeof situationVendeur)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="sci-ir">SCI à l'IR — transparence fiscale</option>
                  <option value="sci-is">SCI à l'IS — plus-value professionnelle</option>
                  <option value="non-resident-ue">Non-résident UE/EEE/Suisse/UK</option>
                  <option value="non-resident-hors-ue">Non-résident hors UE</option>
                </select>
              </div>
            )}

            {/* ── Mode d'acquisition (donation/succession) ── */}
            {showModeAcquisition && (
              <div>
                <label style={labelStyle}>Mode d'acquisition <Tip text="Pour une donation ou une succession, la valeur retenue est celle déclarée dans l'acte. Le forfait 7,5% de frais d'acquisition ne s'applique pas — seuls les droits réellement payés sont déductibles." /></label>
                <select value={modeAcquisition} onChange={e => setModeAcquisition(e.target.value as typeof modeAcquisition)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="donation">Donation</option>
                  <option value="succession">Succession / Héritage</option>
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle}>{labelPrixAchat ?? "Prix d'achat"} <Tip text={isDonationSuccession ? "Valeur vénale déclarée dans l'acte de donation ou la déclaration de succession. C'est cette valeur qui sert de base au calcul de la plus-value." : "Prix dans l'acte d'acquisition. Si donation/succession : valeur déclarée."} /></label>
              <input type="number" placeholder="Ex : 180 000" value={prixAchat} onChange={e => setPrixAchat(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Prix de vente <Tip text="Prix envisagé ou figurant dans le compromis." /></label>
              <input type="number" placeholder="Ex : 280 000" value={prixVente} onChange={e => setPrixVente(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isDonationSuccession ? (modeAcquisition === "succession" ? "Date du décès" : "Date de l'acte de donation") : "Date d'achat"} <Tip text={isDonationSuccession ? "La durée de détention court depuis la date du décès (succession) ou de l'acte notarié de donation." : "Date de l'acte authentique. Détermine la durée de détention et les abattements."} /></label>
              <input type="date" value={dateAchat} onChange={e => setDateAchat(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{labelFraisAcquisition ?? "Frais d'acquisition"} <Tip text={isDonationSuccession || disableForfaitFrais ? "Droits de mutation à titre gratuit (droits de succession ou de donation) effectivement payés par le vendeur + frais de notaire réels. Le forfait 7,5% ne s'applique pas." : "Forfait 7,5% (sans justificatif) ou montant réel des frais de notaire."} /></label>
              {(isDonationSuccession || disableForfaitFrais) ? (
                // Mode don/succession : seulement frais réels
                <div>
                  <input type="number" placeholder="Droits + frais notaire" value={fraisReels} onChange={e => setFraisReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
                  <div style={{ fontSize: 12, color: C.orange, marginTop: 4 }}>Le forfait 7,5% n'est pas applicable — frais réels uniquement</div>
                </div>
              ) : (
                // Mode achat classique : forfait ou réels
                <>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    {(["forfait", "reel"] as const).map(m => (
                      <button key={m} onClick={() => setFraisMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${fraisMode === m ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: fraisMode === m ? C.cardAlt : C.card, color: fraisMode === m ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                        {m === "forfait" ? "Forfait 7,5%" : "Réels"}
                      </button>
                    ))}
                  </div>
                  {fraisMode === "reel" && <input type="number" placeholder="Montant" value={fraisReels} onChange={e => setFraisReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
                  {fraisMode === "forfait" && pa > 0 && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{fmt(pa * FORFAIT_FRAIS_ACQUISITION)}</div>}
                </>
              )}
            </div>
            <div>
              <label style={labelStyle}>Travaux <Tip text={disableForfaitTravaux ? "Le forfait 15% ne s'applique pas à ce type de bien. Seuls les travaux réels avec factures sont déductibles." : "Forfait 15% si détention > 5 ans (sans justificatif) ou réels avec factures d'entreprises."} /></label>
              {disableForfaitTravaux ? (
                // Terrain / SCPI : frais réels uniquement
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    {(["reel", "aucun"] as const).map(m => (
                      <button key={m} onClick={() => setTravauxMode(m)} style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${travauxMode === m || (m === "aucun" && travauxMode === "forfait") ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: travauxMode === m || (m === "aucun" && travauxMode === "forfait") ? C.cardAlt : C.card, color: travauxMode === m || (m === "aucun" && travauxMode === "forfait") ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                        {m === "reel" ? "Réels" : "Aucun"}
                      </button>
                    ))}
                  </div>
                  {travauxMode === "reel" && <input type="number" placeholder="Montant factures" value={travauxReels} onChange={e => setTravauxReels(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />}
                  <div style={{ fontSize: 12, color: C.orange, marginTop: 4 }}>Forfait 15% non applicable — frais réels uniquement</div>
                </div>
              ) : (
                // Mode standard : forfait ou réels
                <>
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
                </>
              )}
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

            {/* ── Quote-part SCI ── */}
            {(showQuotePart || isSci) && (
              <div>
                <label style={labelStyle}>
                  Votre quote-part dans la SCI (%)
                  <Tip text="Pourcentage de vos parts dans la SCI. En SCI à l'IR, la plus-value est répartie entre les associés selon leur quote-part. La surtaxe de 19% s'apprécie par associé, pas sur la SCI entière." />
                </label>
                <input
                  type="number"
                  placeholder="Ex : 50"
                  min={1} max={100}
                  value={quotePart}
                  onChange={e => setQuotePart(e.target.value)}
                  style={inputStyle}
                />
                {quotePartNum < 100 && (
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {isSciIS ? "Votre part de l'IS" : `Votre quote-part de PV calculée`}
                  </div>
                )}
              </div>
            )}

            {/* ── Indivision / Démembrement ── */}
            {showDemembrement && !isSci && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ background: "#EEEDF5", borderLeft: "3px solid #56CBAD", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.primary, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>⚖️</span><span>Mode de détention</span>
                  </div>

                  {/* Toggle plein / indivision / démembrement */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                    {([
                      { v: "plein", label: "Pleine propriété" },
                      { v: "indivision", label: "Indivision" },
                      { v: "demembrement", label: "Démembrement" },
                    ] as const).map(opt => (
                      <button key={opt.v} onClick={() => setModeIndivision(opt.v)}
                        style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: `1.5px solid ${modeIndivision === opt.v ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: modeIndivision === opt.v ? C.cardAlt : C.card, color: modeIndivision === opt.v ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Indivision : quote-part */}
                  {isIndivisionMode && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: 13 }}>
                          Votre quote-part dans l'indivision (%)
                          <Tip text="Votre fraction de propriété dans le bien indivis. La surtaxe s'apprécie par indivisaire — pas sur la totalité du bien. Si vous êtes seul vendeur, indiquez votre quote-part uniquement." />
                        </label>
                        <input
                          type="number"
                          placeholder="Ex : 50"
                          min={1} max={100}
                          value={quotePart}
                          onChange={e => setQuotePart(e.target.value)}
                          style={{ ...inputStyle, fontSize: 13 }}
                        />
                        {quotePartNum < 100 && (
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                            Votre fraction de la PV : {quotePartNum}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Démembrement */}
                  {isDemembrementMode && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: 13 }}>
                          Vous êtes
                          <Tip text="L'usufruitier est imposé sur la fraction usufruit. Le nu-propriétaire est imposé sur la fraction nue-propriété. Les fractions sont déterminées par le barème de l'art. 669 CGI en fonction de l'âge de l'usufruitier." />
                        </label>
                        <div style={{ display: "flex", gap: 6 }}>
                          {([
                            { v: "usufruit", label: "Usufruitier" },
                            { v: "nue-propriete", label: "Nu-propriétaire" },
                          ] as const).map(opt => (
                            <button key={opt.v} onClick={() => setTypeDemembrement(opt.v)}
                              style={{ flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, border: `1.5px solid ${typeDemembrement === opt.v ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: typeDemembrement === opt.v ? C.cardAlt : C.card, color: typeDemembrement === opt.v ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: 13 }}>
                          Âge de l'usufruitier
                          <Tip text="Le barème de l'art. 669 CGI détermine la valeur de l'usufruit selon l'âge de l'usufruitier. Ex : âge ≤ 20 ans → usufruit = 90%, nue-propriété = 10%. Âge 61-70 ans → usufruit = 40%, nue-propriété = 60%." />
                        </label>
                        <input
                          type="number"
                          placeholder="Ex : 65"
                          min={1} max={120}
                          value={ageUsufruitier}
                          onChange={e => setAgeUsufruitier(e.target.value)}
                          style={{ ...inputStyle, fontSize: 13 }}
                        />
                        {ageUsufruitierNum > 0 && (
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>
                            Barème art. 669 CGI : Usufruit <strong>{getFractionDemembrement(ageUsufruitierNum, "usufruit")}%</strong> / Nu-propriété <strong>{getFractionDemembrement(ageUsufruitierNum, "nue-propriete")}%</strong>
                            {" → "}Votre fraction (<strong>{typeDemembrement === "usufruit" ? "usufruit" : "nue-propriété"}</strong>) : <strong style={{ color: C.primary }}>{fractionDemem}%</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Options SCI IS ── */}
            {(showSCI_IS_Options || isSciIS) && isSciIS && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ background: "#EEEDF5", borderLeft: "3px solid #3F3D6E", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.primary, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>🏢</span><span>Paramètres SCI à l'IS</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 13 }}>
                        Amortissements cumulés
                        <Tip text="Total des amortissements comptabilisés depuis l'acquisition du bien. Réduit la valeur nette comptable (VNC). La plus-value IS = Prix de vente - Frais de cession - VNC. Les amortissements augmentent mécaniquement la PV imposable." />
                      </label>
                      <input
                        type="number"
                        placeholder="Ex : 80 000"
                        value={amortissementsSCI_IS}
                        onChange={e => setAmortissementsSCI_IS(e.target.value)}
                        style={{ ...inputStyle, fontSize: 13 }}
                      />
                      {amortIS > 0 && pa > 0 && (
                        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                          VNC estimée : {Math.max(0, pa - amortIS).toLocaleString("fr-FR")} €
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 13 }}>
                        Bénéfice imposable avant cette vente
                        <Tip text="Bénéfice de la SCI sur l'exercice en cours, hors plus-value. Permet de déterminer si le taux réduit IS de 15% (applicable jusqu'à 42 500 €) est déjà consommé. Laissez à 0 si vous ne savez pas." />
                      </label>
                      <input
                        type="number"
                        placeholder="Ex : 5 000"
                        value={beneficeAvantPV}
                        onChange={e => setBeneficeAvantPV(e.target.value)}
                        style={{ ...inputStyle, fontSize: 13 }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: C.orange, marginTop: 12, lineHeight: 1.5 }}>
                    ⚠️ En SCI à l'IS : pas d'abattement pour durée de détention — même après 30 ans, la plus-value est intégralement imposée à l'IS.
                  </div>
                </div>
              </div>
            )}

            {/* ── Options non-résident ── */}
            {showNROptions && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ background: "#EEEDF5", borderLeft: "3px solid #2D2B55", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.primary, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>🌍</span><span>Options non-résident</span>
                  </div>
                  <div style={{ display: "grid", gap: 12 }}>

                    {/* Affilié sécu EEE (UE seulement) */}
                    {situationVendeur === "non-resident-ue" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <label style={{ fontSize: 13, color: C.text, flex: 1 }}>
                          Affilié à la sécurité sociale d'un pays UE/EEE/Suisse/UK ?
                          <Tip text="Si vous êtes affilié à un régime obligatoire de sécurité sociale dans un pays UE, EEE, Suisse ou Royaume-Uni, le taux de prélèvements sociaux est réduit à 7,5% (au lieu de 17,2%). À activer par défaut pour la grande majorité des expatriés UE." />
                        </label>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {([true, false] as const).map(v => (
                            <button key={String(v)} onClick={() => setAffilieSecuEEE(v)}
                              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1.5px solid ${affilieSecuEEE === v ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: affilieSecuEEE === v ? C.cardAlt : C.card, color: affilieSecuEEE === v ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                              {v ? "Oui (7,5%)" : "Non (17,2%)"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pays non coopératif (hors UE seulement) */}
                    {situationVendeur === "non-resident-hors-ue" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <label style={{ fontSize: 13, color: C.text, flex: 1 }}>
                          Pays non coopératif (taux IR 33,33%) ?
                          <Tip text="Les résidents de pays figurant sur la liste des États non coopératifs (art. 238-0 A CGI) sont soumis à un taux majoré d'IR de 33,33% au lieu de 19% (art. 244 bis A CGI). Vérifiez la liste officielle sur impots.gouv.fr." />
                        </label>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {([false, true] as const).map(v => (
                            <button key={String(v)} onClick={() => setPaysNonCooperatif(v)}
                              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1.5px solid ${paysNonCooperatif === v ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: paysNonCooperatif === v ? C.cardAlt : C.card, color: paysNonCooperatif === v ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                              {v ? "Oui (33,33%)" : "Non (19%)"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Résidé en France ≥ 2 ans (UE seulement) */}
                    {situationVendeur === "non-resident-ue" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <label style={{ fontSize: 13, color: C.text, flex: 1 }}>
                          Avez-vous résidé fiscalement en France ≥ 2 ans ?
                          <Tip text="Condition de l'exonération art. 150 U II 2° CGI : avoir été domicilié fiscalement en France pendant au moins 2 ans au cours de votre vie. Permet l'exonération IR jusqu'à 150 000€ de plus-value nette si vous êtes non-résident depuis moins de 10 ans." />
                        </label>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {([false, true] as const).map(v => (
                            <button key={String(v)} onClick={() => setResideFrance2ans(v)}
                              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1.5px solid ${resideFrance2ans === v ? C.primaryMid : C.border}`, borderRadius: 6, cursor: "pointer", background: resideFrance2ans === v ? C.cardAlt : C.card, color: resideFrance2ans === v ? C.primary : C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                              {v ? "Oui" : "Non"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Années de non-résidence (si résidé 2 ans) */}
                    {situationVendeur === "non-resident-ue" && resideFrance2ans && (
                      <div>
                        <label style={{ ...labelStyle, fontSize: 13 }}>
                          Depuis combien d'années êtes-vous non-résident ?
                          <Tip text="L'exonération art. 150 U II 2° ne s'applique que dans les 10 ans suivant le départ de France. Au-delà de 10 ans, l'exonération n'est plus disponible." />
                        </label>
                        <input
                          type="number"
                          placeholder="Ex : 4"
                          min={1} max={30}
                          value={anneesNonResident}
                          onChange={e => setAnneesNonResident(e.target.value)}
                          style={{ ...inputStyle, fontSize: 13 }}
                        />
                        {anneesNR >= 10 && (
                          <div style={{ fontSize: 12, color: C.orange, marginTop: 4 }}>
                            ⚠️ Au-delà de 10 ans, l'exonération 150 000€ n'est plus applicable.
                          </div>
                        )}
                      </div>
                    )}
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
                            [`Impôt sur le revenu (${tauxIRDisplay})`, fmt(result.impotIR), "", true],
                            [null],
                            [`Abattement PS (${fmtPct(result.abatPSPct)})`, `→ PV nette : ${fmt(result.pvNetPS)}`, "Exon. à 30 ans"],
                            [`Prélèvements sociaux (${tauxPSDisplay})`, fmt(result.impotPS), "", true],
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

          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>Questions fréquentes sur la plus-value immobilière</h2>
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px 0" }}>Vous avez une question ? Nos réponses couvrent les cas les plus courants. Pour les situations spécifiques, consultez nos simulateurs dédiés.</p>
          <div style={{ display: "grid", gap: 8, marginBottom: 48 }}>
            {([
              {
                q: "Combien d'impôt vais-je payer sur ma plus-value immobilière ?",
                a: (
                  <>La plus-value immobilière est taxée à 36,2% au taux plein : 19% d&apos;impôt sur le revenu et 17,2% de prélèvements sociaux. Mais grâce aux abattements pour durée de détention, le taux effectif diminue avec le temps. Par exemple, après 15 ans de détention, le taux effectif tombe à environ 17%. Après 22 ans, l&apos;IR est totalement exonéré. Après 30 ans, plus aucun impôt. Utilisez notre simulateur ci-dessus pour calculer votre montant exact en fonction de votre situation.</>
                ),
              },
              {
                q: "Après combien d'années est-on exonéré de plus-value ?",
                a: (
                  <>L&apos;exonération est progressive et se fait en deux temps. L&apos;impôt sur le revenu (19%) est totalement exonéré après 22 ans de détention grâce à un abattement de 6% par an à partir de la 6e année. Les prélèvements sociaux (17,2%) sont exonérés après 30 ans, avec un abattement plus lent. Entre 22 et 30 ans, vous ne payez plus que les prélèvements sociaux sur un montant réduit. Notre onglet &quot;Scénarios&quot; vous montre l&apos;évolution de l&apos;impôt année par année.</>
                ),
              },
              {
                q: "Comment réduire le montant de ma plus-value imposable ?",
                a: (
                  <>Quatre leviers principaux. Premièrement, déduisez vos frais d&apos;acquisition : forfait 7,5% du prix d&apos;achat ou frais de notaire réels si plus élevés. Deuxièmement, déduisez vos travaux : forfait 15% si vous détenez le bien depuis plus de 5 ans, ou montant réel avec factures d&apos;entreprises. Troisièmement, déduisez vos frais de cession : diagnostics, frais d&apos;agence à votre charge, mainlevée d&apos;hypothèque. Quatrièmement, si possible, attendez un seuil d&apos;abattement favorable — notre comparateur de scénarios vous indique l&apos;économie potentielle en décalant la vente de 1 à 5 ans.</>
                ),
              },
              {
                q: "La plus-value est-elle imposée si je vends ma résidence principale ?",
                a: (
                  <>Non. La vente de votre résidence principale est totalement exonérée d&apos;impôt sur la plus-value, quelle que soit la durée de détention et quel que soit le montant du gain. C&apos;est l&apos;exonération la plus courante. Le bien doit être votre résidence principale effective au jour de la vente. Si vous avez déménagé avant la vente, un délai raisonnable est toléré (généralement un an) à condition de ne pas avoir loué le bien entre-temps. Découvrez tous les cas d&apos;exonération sur notre page dédiée. <a href="/exonerations-plus-value" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Voir les exonérations de plus-value →</a></>
                ),
              },
              {
                q: "Que change la réforme LMNP 2025 pour la plus-value ?",
                a: (
                  <>Depuis la loi de finances 2025, les amortissements déduits en LMNP sont réintégrés dans le calcul de la plus-value. Concrètement, votre prix d&apos;acquisition est réduit du montant des amortissements que vous avez déduits de vos revenus locatifs, ce qui augmente mécaniquement votre plus-value imposable. Par exemple, pour un bien acheté 200 000€ avec 50 000€ d&apos;amortissements cumulés, la base de calcul de la plus-value part de 150 000€ au lieu de 200 000€. Simulez l&apos;impact exact avec notre simulateur LMNP dédié. <a href="/plus-value-lmnp" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur plus-value LMNP →</a></>
                ),
              },
              {
                q: "Un non-résident paie-t-il le même impôt sur la plus-value ?",
                a: (
                  <>Pas exactement. Le taux d&apos;IR reste à 19%, mais les prélèvements sociaux sont réduits à 7,5% (au lieu de 17,2%) pour les non-résidents affiliés à un régime de sécurité sociale UE/EEE/Suisse. Le taux total passe donc de 36,2% à 26,5%. De plus, les anciens résidents fiscaux français peuvent bénéficier d&apos;une exonération jusqu&apos;à 150 000€ de plus-value nette sous conditions. Calculez votre impôt avec notre simulateur non-résident. <a href="/plus-value-non-resident" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur plus-value non-résident →</a></>
                ),
              },
              {
                q: "Comment est calculée la plus-value d'un bien reçu en héritage ?",
                a: (
                  <>Pour un bien reçu par succession, le prix d&apos;acquisition retenu est la valeur déclarée dans la déclaration de succession, pas le prix payé par le défunt à l&apos;origine. La durée de détention court depuis la date du décès. Seuls les frais réels sont déductibles (droits de succession payés + frais de notaire) — le forfait 7,5% ne s&apos;applique pas. Si la valeur déclarée était faible, la plus-value sera mécaniquement plus élevée. Utilisez notre simulateur donation/succession pour le calcul exact. <a href="/plus-value-donation-succession" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur donation / succession →</a></>
                ),
              },
              {
                q: "Qu'est-ce que la surtaxe sur les plus-values supérieures à 50 000€ ?",
                a: (
                  <>Lorsque votre plus-value nette imposable (après abattements pour durée de détention) dépasse 50 000€, une surtaxe progressive de 2% à 6% s&apos;ajoute à l&apos;IR et aux PS. Elle est calculée sur le montant total de la plus-value nette, pas sur la fraction au-dessus de 50 000€. En indivision, le seuil s&apos;apprécie par vendeur — à deux propriétaires, vous pouvez y échapper si la part de chacun reste sous 50 000€. Notre simulateur calcule automatiquement cette surtaxe et vous alerte si elle s&apos;applique.</>
                ),
              },
            ] as { q: string; a: React.ReactNode }[]).map((item, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span style={{ fontWeight: 600, fontSize: 16, color: C.text }}>{item.q}</span>
                  <span style={{ fontSize: 20, color: C.accent, flexShrink: 0, lineHeight: 1, transition: "transform 0.3s" }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                <div style={{ maxHeight: openFaq === i ? 500 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                  <div style={{ padding: "0 18px 16px", fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{item.a}</div>
                </div>
              </div>
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

    </div>
  );
}
