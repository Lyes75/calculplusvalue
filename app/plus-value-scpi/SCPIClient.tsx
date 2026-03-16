"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { computePlusValue, fmt, getAbatIR, getAbatPS } from "@/lib/calcul-engine";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

// ── Couleurs ─────────────────────────────────────────────────────────────────
const C = {
  indigo: "#2D2B55",
  indigoMid: "#3F3D6E",
  menthe: "#56CBAD",
  bg: "#F4F3FA",
  card: "#FFFFFF",
  border: "#E0DEF0",
  muted: "#6E6B8A",
  mutedLight: "#9B97C4",
  green: "#2D8C5F",
  greenBg: "#E8F7F0",
  greenBorder: "#B5DECA",
  amber: "#D4923A",
  amberBg: "#FFF8EC",
  amberBorder: "#F4D99A",
  red: "#C0392B",
  redLight: "#E05656",
  redBg: "#FDF0EE",
};

// ── Bandeau d'actualité SCPI ─────────────────────────────────────────────────
function SCPIAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        📈 <strong>Astuce SCPI :</strong> les frais de souscription réels (8-12%) sont presque toujours supérieurs au forfait 7,5%. Optez systématiquement pour les frais réels pour réduire votre plus-value imposable.
      </div>
    </div>
  );
}

// ── Social proof SCPI ────────────────────────────────────────────────────────
function SCPISocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { emoji: "📊", before: "+3 000 ", bold: "simulations réalisées", after: "" },
          { emoji: "✅", before: "Barèmes CGI 2026 ", bold: "vérifiés", after: "" },
          { emoji: "🔒", before: "Gratuit, ", bold: "sans inscription", after: "" },
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{item.emoji}</span>
            <span>
              {item.before}
              <strong style={{ fontWeight: 600, color: C.indigo }}>{item.bold}</strong>
              {item.after}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section "Comment calculer" en 3 étapes — adaptée SCPI ───────────────────
function HowItWorksSCPI() {
  const steps = [
    {
      num: "1",
      title: "Renseignez votre souscription",
      desc: "Prix de souscription, date d'achat, frais de souscription réels (demandez le justificatif à votre société de gestion). Le forfait 15% travaux n'est PAS applicable aux parts de SCPI.",
    },
    {
      num: "2",
      title: "Obtenez le détail de l'impôt",
      desc: "Plus-value calculée sur la différence entre prix de cession et prix de souscription majoré des frais. Mêmes abattements que l'immobilier en direct.",
    },
    {
      num: "3",
      title: "Comparez et optimisez",
      desc: "Évaluez l'impact d'attendre avant de céder. Comparez forfait 7,5% vs frais réels. Téléchargez votre rapport PDF.",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 24, marginTop: 0 }}>
        Comment calculer votre plus-value en 3 étapes
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {steps.map((step) => (
          <div key={step.num} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 20px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(86,203,173,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: C.menthe, marginBottom: 12 }}>
              {step.num}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.indigo, marginBottom: 8 }}>{step.title}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scroll helper ────────────────────────────────────────────────────────────
function scrollToSimulator() {
  const el = document.querySelector("[data-simulator-form]");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Exemples chiffrés SCPI ──────────────────────────────────────────────────
function ExamplesSectionSCPI() {
  // Exemple 1 — Souscription directe, détention 16 ans, frais réels 10%
  const rEx1 = useMemo(() => computePlusValue(
    50000, 72000, new Date(2010, 0, 1), new Date(2026, 0, 1),
    5000, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  // Même avec forfait 7,5%
  const rEx1Forfait = useMemo(() => computePlusValue(
    50000, 72000, new Date(2010, 0, 1), new Date(2026, 0, 1),
    3750, 0, 0,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 2 — Achat marché secondaire, 4 ans, frais réels faibles
  const rEx2Reel = useMemo(() => computePlusValue(
    30000, 35000, new Date(2022, 0, 1), new Date(2026, 0, 1),
    200, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  const rEx2Forfait = useMemo(() => computePlusValue(
    30000, 35000, new Date(2022, 0, 1), new Date(2026, 0, 1),
    2250, 0, 0,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 3 — Comparaison forfait vs réel, souscription 100K, frais 11%
  const rEx3Forfait = useMemo(() => computePlusValue(
    100000, 130000, new Date(2016, 0, 1), new Date(2026, 0, 1),
    7500, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  const rEx3Reel = useMemo(() => computePlusValue(
    100000, 130000, new Date(2016, 0, 1), new Date(2026, 0, 1),
    11000, 0, 0,
    { situationVendeur: "resident" }
  ), []);

  const ex1Diff = rEx1Forfait && rEx1 ? rEx1Forfait.totalImpot - rEx1.totalImpot : 0;
  const ex2Diff = rEx2Reel && rEx2Forfait ? rEx2Reel.totalImpot - rEx2Forfait.totalImpot : 0;
  const ex3Diff = rEx3Forfait && rEx3Reel ? rEx3Forfait.totalImpot - rEx3Reel.totalImpot : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value sur parts de SCPI
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations courantes pour comprendre l'impact des frais de souscription, de la durée de détention et du choix forfait vs réel.
      </p>

      <div className="examples-scpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : Souscription directe, 16 ans ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>SCPI de rendement — détention 16 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Parts souscrites pour 50 000€ en 2010 (frais de souscription 10% = 5 000€). Revente sur le marché secondaire à 72 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix de souscription", fmt(50000)],
                      ["+ Frais réels (10%)", fmt(5000)],
                      ["Prix d'achat corrigé", fmt(55000)],
                      ["Prix de cession", fmt(72000)],
                      [null],
                      ["PV brute", fmt(rEx1.pvBrute)],
                      [`Abattement IR (16 ans)`, `${rEx1.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS (16 ans)`, `${rEx1.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (19%)", fmt(rEx1.impotIR)],
                      ["PS (17,2%)", fmt(rEx1.impotPS)],
                      ...(rEx1.surtaxe > 0 ? [["Surtaxe", fmt(rEx1.surtaxe)]] : []),
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: C.muted }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Impôt total</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.redLight }}>{fmt(rEx1.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Net vendeur</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{fmt(rEx1.netVendeur)}</div>
                  </div>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 Avec les frais réels de 5 000€ (10%), le prix d'achat corrigé est de 55 000€ et la PV brute de {rEx1 ? fmt(rEx1.pvBrute) : "—"}. En optant pour le forfait 7,5% (3 750€), la PV brute serait de {rEx1Forfait ? fmt(rEx1Forfait.pvBrute) : "—"} — soit {fmt(ex1Diff)} d'impôt supplémentaire. Le choix frais réels fait toujours gagner quand les frais de souscription dépassent 7,5%.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Achat marché secondaire, 4 ans ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Achat secondaire — revente après 4 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Parts achetées sur le marché secondaire à 30 000€ en 2022 (frais de marché ~200€). Revente à 35 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx2Forfait && rEx2Reel && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d'achat", fmt(30000)],
                      ["Forfait 7,5%", fmt(2250)],
                      ["Prix corrigé (forfait)", fmt(32250)],
                      ["Prix de cession", fmt(35000)],
                      [null],
                      ["PV brute (forfait)", fmt(rEx2Forfait.pvBrute)],
                      ["PV brute (réels 200€)", fmt(rEx2Reel.pvBrute)],
                      [null],
                      ["Impôt (forfait)", fmt(rEx2Forfait.totalImpot)],
                      ["Impôt (réels)", fmt(rEx2Reel.totalImpot)],
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: C.muted }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, ...(String(row[0]).includes("(forfait)") && j >= 7 ? { color: C.green, fontWeight: 700 } : {}), ...(String(row[0]).includes("(réels)") && j >= 7 ? { color: C.redLight, fontWeight: 700 } : {}) }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Économie forfait : {fmt(ex2Diff)}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Le forfait 7,5% est meilleur ici</div>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 Cas particulier : en achat sur le marché secondaire, les frais réels sont très faibles (souvent {"<"} 1%). Le forfait 7,5% est alors bien plus avantageux. Avec le forfait : PV brute = {rEx2Forfait ? fmt(rEx2Forfait.pvBrute) : "—"}. Avec les frais réels : PV brute = {rEx2Reel ? fmt(rEx2Reel.pvBrute) : "—"}. Attention : avec 4 ans de détention, aucun abattement ne s'applique.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Comparaison forfait 7,5% vs frais réels 11% ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Forfait 7,5% vs frais réels — le bon choix</div>
            <div style={{ fontSize: 13, color: C.muted }}>Parts souscrites 100 000€ avec 11% de frais (11 000€), revendues 130 000€ après 10 ans. Comparaison des deux options.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3Forfait && rEx3Reel && (
              <>
                <div className="scpi-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {/* Colonne Forfait */}
                  <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.red, marginBottom: 8, textAlign: "center" }}>Forfait 7,5%</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Souscription", fmt(100000)],
                          ["Frais déduits", fmt(7500)],
                          ["Prix corrigé", fmt(107500)],
                          [null],
                          ["PV brute", fmt(rEx3Forfait.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Forfait.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Impôt total", fmt(rEx3Forfait.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(224,86,86,0.1)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Impôt") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.redLight : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Colonne Frais réels */}
                  <div style={{ background: "rgba(86,203,173,0.04)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.green, marginBottom: 8, textAlign: "center" }}>Frais réels 11%</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Souscription", fmt(100000)],
                          ["Frais déduits", fmt(11000)],
                          ["Prix corrigé", fmt(111000)],
                          [null],
                          ["PV brute", fmt(rEx3Reel.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Reel.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Impôt total", fmt(rEx3Reel.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(86,203,173,0.15)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Impôt") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.green : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                  Économie frais réels : {fmt(ex3Diff)}
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
              💡 Sur une souscription directe de 100 000€ avec 11% de frais, le choix frais réels fait économiser {fmt(ex3Diff)} d'impôt. Règle simple : si vos frais de souscription dépassent 7,5% du prix de souscription, choisissez toujours les frais réels.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-scpi-grid { grid-template-columns: 1fr !important; }
          .scpi-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements — adapté SCPI ────────────────────────────────────

function fmtPctS(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function getImpotColorS(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function AbattementsTableSCPI() {
  const [showDetailed, setShowDetailed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isDesktop) setShowDetailed(true);
  }, [isDesktop]);

  const tableData = useMemo(() => {
    const data: { label: string; abatIR: number; abatPS: number; tauxIR: number; tauxPS: number; total: number; impot100k: number; isYear22: boolean; isYear30: boolean }[] = [];
    const abatIR0 = Math.min(100, getAbatIR(0));
    const abatPS0 = Math.min(100, getAbatPS(0));
    const tauxIR0 = 19 * (1 - abatIR0 / 100);
    const tauxPS0 = 17.2 * (1 - abatPS0 / 100);
    const total0 = tauxIR0 + tauxPS0;
    data.push({ label: "0 à 5 ans", abatIR: abatIR0, abatPS: abatPS0, tauxIR: tauxIR0, tauxPS: tauxPS0, total: total0, impot100k: Math.round(100000 * total0 / 100), isYear22: false, isYear30: false });
    for (let y = 6; y <= 30; y++) {
      const abatIR = Math.min(100, getAbatIR(y));
      const abatPS = Math.min(100, getAbatPS(y));
      const tauxIR = 19 * (1 - abatIR / 100);
      const tauxPS = 17.2 * (1 - abatPS / 100);
      const total = tauxIR + tauxPS;
      data.push({ label: `${y} ans`, abatIR, abatPS, tauxIR, tauxPS, total, impot100k: Math.round(100000 * total / 100), isYear22: y === 22, isYear30: y === 30 });
    }
    return data;
  }, []);

  const syntheticRows = [
    ["Moins de 6 ans", "0%", "0%", "0%", "0%"],
    ["6e à 21e année", "6% / an", "1,65% / an", "6% → 96%", "1,65% → 26,4%"],
    ["22e année", "4%", "1,60%", "100% → exonéré", "28%"],
    ["23e à 30e année", "—", "9% / an", "—", "28% → 100%"],
    ["Au-delà de 30 ans", "—", "—", "Exonéré", "Exonéré"],
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Abattements sur la plus-value de parts SCPI — Barème 2026
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les parts de SCPI détenues en direct bénéficient des mêmes abattements pour durée de détention que les biens immobiliers. La durée court depuis la date de souscription (ou d'achat sur le marché secondaire). Exonération d'IR après 22 ans, exonération totale après 30 ans.
      </p>

      {/* Tableau synthétique */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead>
            <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Durée de détention</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Abattement IR / an</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Abattement PS / an</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Cumul IR</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600 }}>Cumul PS</th>
            </tr>
          </thead>
          <tbody>
            {syntheticRows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#EEEDF5" : C.card, borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "9px 14px", fontWeight: 500 }}>{row[0]}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", color: C.muted }}>{row[1]}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", color: C.muted }}>{row[2]}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, color: C.menthe }}>{row[3]}</td>
                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 600, color: C.muted }}>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note SCPI */}
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.18)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6, marginBottom: 16 }}>
        📈 <strong>Rappel SCPI :</strong> ni le forfait 15% travaux ni les travaux réels ne sont applicables à des parts de SCPI. Les seules déductions possibles sont les frais d'acquisition (forfait 7,5% ou frais de souscription réels) et les frais de cession éventuels. C'est pourquoi le choix entre forfait et frais réels a un impact proportionnellement plus important que pour un bien en direct.
      </div>

      {/* Toggle */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}
      >
        {showDetailed ? "Masquer le détail année par année ▲" : "Voir le détail année par année ▼"}
      </button>

      {/* Tableau détaillé */}
      <div style={{ maxHeight: showDetailed ? 3000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div style={{ overflowX: "auto", position: "relative", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Année</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. IR</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. PS</th>
                <th className="abat-scpi-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-scpi-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux total</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Impôt / 100K€</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                const bg = row.isYear22
                  ? "rgba(86,203,173,0.07)"
                  : row.isYear30
                  ? "rgba(59,175,122,0.07)"
                  : i % 2 === 0
                  ? "#FFFFFF"
                  : "#F6F5FA";
                return (
                  <tr key={i} style={{ background: bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, textAlign: "left" }}>{row.label}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear22 ? { fontWeight: 700, color: C.menthe } : {}) }}>
                      {row.abatIR >= 100 ? "100% ✓" : fmtPctS(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtPctS(row.abatPS)}
                    </td>
                    <td className="abat-scpi-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exonéré</span> : fmtPctS(row.tauxIR)}
                    </td>
                    <td className="abat-scpi-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctS(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctS(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorS(row.impot100k) }}>
                      {row.impot100k <= 0 ? "0 €" : row.impot100k.toLocaleString("fr-FR") + " €"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Source note */}
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>Source :</strong> art. 150 VC du CGI (abattements) &middot; art. 150 U (régime des PV immobilières applicable aux cessions de parts de sociétés à prépondérance immobilière). La durée de détention court depuis la date de souscription ou d'achat des parts.
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-scpi-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Contenu éditorial SCPI (existant, réorganisé) ───────────────────────────
function ContentSCPI() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* H2 : Régime des particuliers */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            La plus-value SCPI suit le régime des particuliers
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            La cession de parts de SCPI (Société Civile de Placement Immobilier) détenues en direct est soumise au même régime fiscal que la plus-value immobilière des particuliers (art. 150 U et suivants du CGI). Les abattements pour durée de détention s'appliquent de la même façon qu'un bien en direct.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Abattements identiques", desc: "6%/an dès la 6e année → exonération IR à 22 ans, PS à 30 ans. La durée court depuis la date de souscription des parts.", ok: true },
              { icon: "✅", title: "Prix d'acquisition = souscription", desc: "Le prix retenu est le prix de souscription initial (ou le prix payé en marché secondaire). Augmenté des frais de souscription.", ok: true },
              { icon: "✅", title: "Prix de cession", desc: "Prix de revente sur le marché secondaire (fixé par l'offre et la demande) ou valeur de retrait fixée par la société de gestion.", ok: true },
              { icon: "❌", title: "Pas de forfait travaux 15%", desc: "Le forfait de 15% pour travaux ne s'applique pas aux parts de SCPI — pas de travaux déductibles sur des parts sociales.", ok: false },
            ].map((item, i) => (
              <div key={i} style={{ background: item.ok ? C.greenBg : C.redBg, border: `1px solid ${item.ok ? C.greenBorder : "#E8B4B0"}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* H2 : Frais de souscription */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Frais de souscription : le forfait ou le réel ?
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Les frais de souscription SCPI sont généralement de <strong>8 à 12% du prix de souscription</strong> — ils couvrent les frais de collecte, de gestion, de garantie et de commercialisation. Cette spécificité rend le forfait de 7,5% presque toujours <strong>moins avantageux que les frais réels</strong>.
          </p>

          {/* Tableau comparaison */}
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.07)" }}>
              <thead>
                <tr style={{ background: C.indigo, color: "#FFFFFF" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700 }}>Scénario</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, color: "#9B97C4" }}>Forfait 7,5%</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, color: "#56CBAD" }}>Frais réels 10%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Souscription", "50 000 €", "50 000 €"],
                  ["Frais déductibles", "3 750 €", "5 000 €"],
                  ["Prix d'achat corrigé", "53 750 €", "55 000 €"],
                  ["Prix de cession (16 ans)", "75 000 €", "75 000 €"],
                  ["Plus-value brute", "21 250 €", "20 000 €"],
                  ["Différence d'impôt", "—", "↓ ~280 € économisés"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 16px", color: C.muted }}>{row[0]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: i === 5 ? C.red : C.indigoMid }}>{row[1]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: i >= 3 ? 600 : 400, color: i === 5 ? C.green : C.indigo }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.amber }}>💡 Conseil pratique : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Demandez à votre société de gestion un justificatif détaillant les frais de souscription effectivement payés. Dans la quasi-totalité des cas, les frais réels SCPI (8 à 12%) sont supérieurs au forfait 7,5% — optez systématiquement pour les frais réels pour maximiser votre déduction.
            </span>
          </div>
        </section>

        {/* H2 : SCPI en assurance-vie */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            SCPI en assurance-vie : un régime différent
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Si vos parts de SCPI sont détenues dans un contrat d'assurance-vie, la fiscalité applicable est celle de l'assurance-vie — pas celle des plus-values immobilières.
          </p>
          <div style={{ background: C.redBg, border: `1px solid #E8B4B0`, borderRadius: 10, padding: "14px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 10 }}>⚠️ Ce simulateur ne s'applique pas aux SCPI en assurance-vie</div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                "En assurance-vie, la taxation est celle du contrat (PFU 30% ou barème IR + PS), avec abattement annuel de 4 600 € (9 200 € pour un couple) sur les gains après 8 ans.",
                "Les retraits partiels sont fiscalisés selon une quote-part gains/capital — pas sur la plus-value nette.",
                "La plus-value immobilière sous-jacente (réalisée par la SCPI elle-même) est imposée au niveau de la SCPI et répercutée dans la valeur de la part, sans imposition directe pour l'assuré.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Ce simulateur concerne uniquement les parts de SCPI détenues <strong>en direct</strong> (hors enveloppe d'assurance-vie ou PER).
          </div>
        </section>

        {/* H2 : Marché secondaire vs rachat */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Marché secondaire vs rachat par la société de gestion
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Il existe deux façons de céder ses parts de SCPI, avec des implications légèrement différentes sur le prix de cession.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              {
                title: "🔄 Marché secondaire (SCPI à capital variable)",
                points: [
                  "Prix fixé librement par l'offre et la demande",
                  "Nécessite un acheteur — délai variable",
                  "Prix de cession = prix de vente effectif",
                  "Frais de cession éventuels à déduire",
                ],
              },
              {
                title: "💰 Rachat par la société de gestion (SCPI à capital fixe)",
                points: [
                  "Prix de retrait fixé par la société = valeur de réalisation moins une décote (souvent 5 à 10%)",
                  "La société rachète selon ses disponibilités — liste d'attente possible",
                  "Prix de cession = prix de retrait net",
                  "Calculer la PV depuis le prix de souscription initial",
                ],
              },
            ].map((item, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 12 }}>{item.title}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {item.points.map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                      <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ── FAQ spécifique SCPI ─────────────────────────────────────────────────────
const FAQ_ITEMS_SCPI = [
  {
    q: "Les parts de SCPI en assurance-vie sont-elles concernées par ce simulateur ?",
    a: "Non. Les parts de SCPI détenues dans un contrat d'assurance-vie ou un PER sont soumises à la fiscalité de l'enveloppe (assurance-vie ou PER), pas au régime des plus-values immobilières. La taxation se fait lors des retraits du contrat, au PFU de 30% ou au barème progressif selon l'option choisie, avec un abattement après 8 ans en assurance-vie. Ce simulateur ne concerne que les parts détenues en direct (achat en pleine propriété ou en démembrement, hors enveloppe fiscale).",
  },
  {
    q: "Faut-il choisir le forfait 7,5% ou les frais réels pour les SCPI ?",
    a: "Dans 90% des cas, les frais réels sont plus avantageux. Les frais de souscription des SCPI sont généralement de 8 à 12% du montant souscrit, bien supérieurs au forfait 7,5%. L'exception concerne les parts achetées sur le marché secondaire, où les frais sont très faibles (quelques dizaines à centaines d'euros). Dans ce cas, le forfait 7,5% est nettement préférable. Demandez toujours le justificatif de frais à votre société de gestion avant de faire le choix.",
  },
  {
    q: "Comment connaître mes frais de souscription exacts ?",
    a: "Contactez votre société de gestion (Corum, Primonial, Amundi, La Française, etc.) et demandez une attestation de frais de souscription. Le montant figure généralement sur votre bulletin de souscription initial. Si vous avez acheté via un conseiller ou une plateforme, les frais peuvent avoir été négociés à la baisse — vérifiez le montant effectivement payé, pas le taux affiché par la SCPI. En cas de doute, votre société de gestion est tenue de vous fournir cette information.",
  },
  {
    q: "La durée de détention court-elle depuis la souscription ou depuis la jouissance des parts ?",
    a: "La durée de détention pour le calcul des abattements court depuis la date d'acquisition des parts, c'est-à-dire la date de souscription effective (date de paiement) ou la date d'achat sur le marché secondaire. Ce n'est PAS la date de jouissance (qui est la date à partir de laquelle vous percevez les dividendes, souvent 3 à 6 mois après la souscription). La date d'acquisition figure sur votre bulletin de souscription.",
  },
  {
    q: "Peut-on déduire des travaux pour réduire la plus-value sur des parts de SCPI ?",
    a: "Non. Le forfait 15% pour travaux et la déduction de travaux réels ne s'appliquent pas aux parts de SCPI. Vous ne pouvez pas déduire les travaux réalisés par la SCPI sur son patrimoine immobilier — ces travaux sont supportés par la société et impactent la valeur de la part, mais ne constituent pas des dépenses engagées par l'associé. Les seules déductions possibles sont les frais d'acquisition (souscription ou forfait 7,5%) et les frais de cession éventuels.",
  },
  {
    q: "Comment est calculée la plus-value si j'ai souscrit en plusieurs fois (DCA) ?",
    a: "Si vous avez souscrit des parts à des dates et prix différents (investissement progressif), chaque lot de parts a son propre prix d'acquisition et sa propre durée de détention. Lors de la revente, vous pouvez choisir la méthode FIFO (First In, First Out — les parts les plus anciennes sont vendues en premier, donc avec les abattements les plus élevés) ou vendre un lot spécifique. En pratique, la méthode FIFO est souvent la plus avantageuse car les parts les plus anciennes bénéficient des abattements les plus importants. Consultez votre société de gestion pour identifier les lots.",
  },
  {
    q: "La surtaxe sur les plus-values > 50 000€ s'applique-t-elle aux SCPI ?",
    a: "Oui. Si votre plus-value nette d'IR dépasse 50 000€, la surtaxe progressive de 2% à 6% s'applique comme pour un bien en direct. En pratique, cette surtaxe est rare sur les SCPI car les montants investis par particulier dépassent rarement le seuil qui génère une PV nette > 50K€. Si vous détenez des parts pour 200 000€ et revendez à 280 000€ après 10 ans, la PV nette après abattement IR (30%) est de 56 000€ — juste au-dessus du seuil. La surtaxe serait alors de 2% × 56 000€ = 1 120€.",
  },
];

function FAQSectionSCPI() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value sur parts de SCPI
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_SCPI.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: C.indigo, lineHeight: 1.4, paddingRight: 16 }}>{item.q}</span>
                <span style={{ fontSize: 22, color: C.menthe, fontWeight: 300, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 600 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Sources légales SCPI ────────────────────────────────────────────────────
function SourcesLegalesSCPI() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.indigoMid }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U du CGI</span> (plus-values immobilières des particuliers, applicable aux cessions de parts de sociétés à prépondérance immobilière) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 UB</span> (cession de parts de sociétés à prépondérance immobilière non cotées) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements durée de détention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VB</span> (détermination du prix d'acquisition) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 1609 nonies G</span> (surtaxe).
          <br />
          <strong style={{ color: C.indigoMid }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ──────────────────────────────────────────────────────
function AutresSimulateursSCPI() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
          { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "SCI à l'IR ou à l'IS" },
          { href: "/plus-value-non-resident", icon: "🌍", title: "Non-résident", desc: "Cession depuis l'étranger" },
          { href: "/exonerations-plus-value", icon: "✅", title: "Exonérations", desc: "Résidence principale, cas spéciaux" },
        ].map((link, i) => (
          <Link key={i} href={link.href} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo }}>{link.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function SCPIClient() {
  return (
    <>
      <SimulateurBase
        defaultType="scpi"
        showTypeResidence={false}
        disableForfaitTravaux={true}
        labelPrixAchat="Prix de souscription (ou prix d'achat secondaire)"
        labelFraisAcquisition="Frais de souscription"
        heroEyebrow="Simulateur cession de parts SCPI"
        heroTitle="Plus-value sur la revente de parts de SCPI"
        heroDescription="Régime des plus-values des particuliers. Les frais de souscription (8-12%) sont souvent plus avantageux que le forfait 7,5%. Pas de forfait travaux applicable. Le simulateur calcule votre impôt en tenant compte de la durée de détention depuis la date de souscription."
        heroBadges={[
          { icon: "📈", label: "Frais de souscription déductibles (réels > forfait 7,5%)" },
          { icon: "❌", label: "Forfait 15% travaux non applicable" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "📄", label: "Export PDF inclus" },
        ]}
        lockedTypeLabel="Parts de SCPI (détention directe) 📈"
        customTitle="Calculez la plus-value sur vos parts de SCPI"
        customSubtitle="Renseignez le prix de souscription, les frais réels et le prix de revente. Le simulateur applique automatiquement les abattements pour durée de détention depuis la date de souscription."
        customBadges={[
          { icon: "📈", text: "Parts de SCPI détenues en direct" },
          { icon: "📋", text: "Frais de souscription réels ou forfait 7,5%" },
          { icon: "❌", text: "Forfait travaux non applicable" },
        ]}
        customAlertBanner={<SCPIAlertBanner />}
        customSocialProof={<SCPISocialProof />}
        customHowItWorks={<HowItWorksSCPI />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
        caseBadge={{ label: "Parts de SCPI — régime des particuliers", color: "#2D2B55" }}
      />
      <ExamplesSectionSCPI />
      <AbattementsTableSCPI />
      <ContentSCPI />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionSCPI />
        <SourcesLegalesSCPI />
      </div>
      <AutresSimulateursSCPI />
    </>
  );
}
