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

// ── Bandeau d'actualité terrain ──────────────────────────────────────────────
function TerrainAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        🌱 <strong>Rappel :</strong> le forfait 15% pour travaux ne s'applique pas aux terrains non bâtis. Seuls les frais réels (viabilisation, bornage, clôture, drainage) sont déductibles sur factures.
      </div>
    </div>
  );
}

// ── Social proof terrain ─────────────────────────────────────────────────────
function TerrainSocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { emoji: "🌱", before: "Forfait 15% travaux ", bold: "non applicable", after: "" },
          { emoji: "✅", before: "Barèmes CGI au ", bold: "1er janvier 2026", after: "" },
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

// ── Section "Comment calculer" en 3 étapes — adaptée terrain ─────────────────
function HowItWorksTerrain() {
  const steps = [
    {
      num: "1",
      title: "Renseignez l'achat du terrain",
      desc: "Prix d'achat, date d'acquisition, frais de notaire (forfait 7,5% applicable). Le forfait travaux 15% n'est PAS applicable — indiquez uniquement les frais réels de viabilisation, bornage, géomètre ou clôture sur factures.",
    },
    {
      num: "2",
      title: "Obtenez le détail de l'impôt",
      desc: "Plus-value brute, abattements pour durée de détention (identiques aux biens bâtis), surtaxe si applicable. Attention\u00a0: la taxe communale sur terrains devenus constructibles (art. 1529) n'est pas incluse — vérifiez auprès de votre mairie.",
    },
    {
      num: "3",
      title: "Comparez et optimisez",
      desc: "Évaluez l'impact d'attendre quelques années. Le terrain bénéficie des mêmes abattements que les biens bâtis\u00a0: exonération IR totale après 22 ans, PS après 30 ans.",
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

// ── Exemples chiffrés terrain ────────────────────────────────────────────────
function ExamplesSectionTerrain() {
  // Exemple 1 — Terrain constructible, 16 ans
  const rEx1 = useMemo(() => computePlusValue(
    45000, 110000, new Date(2010, 0, 1), new Date(2026, 0, 1),
    3375, 6000, 1500,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 2 — Division parcellaire (moins-value)
  // Prix proratisé = 280000 * (350/1000) = 98000
  // Frais 7.5% sur 98000 = 7350
  // Travaux = 0, frais cession = 2000
  // Prix corrigé = 98000 + 7350 + 2000 = 107350
  // PV = 75000 - 107350 < 0 → moins-value
  const rEx2 = useMemo(() => computePlusValue(
    98000, 75000, new Date(2012, 0, 1), new Date(2026, 0, 1),
    7350, 0, 2000,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 3 — Comparaison terrain vs bien bâti
  const rEx3Terrain = useMemo(() => computePlusValue(
    80000, 150000, new Date(2016, 0, 1), new Date(2026, 0, 1),
    6000, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  const rEx3Bati = useMemo(() => computePlusValue(
    80000, 150000, new Date(2016, 0, 1), new Date(2026, 0, 1),
    6000, 12000, 0,
    { situationVendeur: "resident" }
  ), []);

  const ex3Diff = rEx3Terrain && rEx3Bati ? rEx3Terrain.totalImpot - rEx3Bati.totalImpot : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value sur un terrain
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations courantes&nbsp;: vente d'un terrain nu, division parcellaire, et l'impact du forfait travaux non applicable.
      </p>

      <div className="examples-terrain-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : Terrain constructible 16 ans ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Terrain constructible — détention 16 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Terrain acheté 45 000€ en 2010 en zone pavillonnaire, vendu 110 000€ en 2026 après classement constructible au PLU.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d'achat", fmt(45000)],
                      ["+ Forfait 7,5%", fmt(3375)],
                      ["+ Viabilisation réelle", fmt(6000)],
                      ["Frais de cession", fmt(1500)],
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
              💡 Sans le forfait 15% travaux (non applicable aux terrains), seuls les 6 000€ de viabilisation réels sont déduits. Sur un bien bâti de même valeur, le forfait 15% aurait permis de déduire 6 750€. La différence est modeste ici, mais elle se creuse sur des terrains achetés cher avec peu de travaux réels.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Division parcellaire ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Division parcellaire — vente du jardin</div>
            <div style={{ fontSize: 13, color: C.muted }}>Maison achetée 280 000€ sur 1 000 m² en 2012. Vente de 350 m² de jardin pour 75 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {[
                  ["Prix d'achat total", fmt(280000)],
                  ["Surface cédée / totale", "350 / 1 000 m²"],
                  ["Prix proratisé", fmt(98000)],
                  ["+ Forfait 7,5%", fmt(7350)],
                  ["+ Travaux", "0 €"],
                  ["Frais de cession", fmt(2000)],
                  [null],
                  ["Prix d'achat corrigé", fmt(98000 + 7350 + 2000)],
                  ["Prix de vente", fmt(75000)],
                  [null],
                  ["Résultat", "Moins-value"],
                ].map((row, j) =>
                  row === null || row[0] === null ? (
                    <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                  ) : (
                    <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                      <td style={{ padding: "5px 0", color: C.muted, ...(String(row[0]).includes("Résultat") ? { fontWeight: 700, color: C.green } : {}) }}>{row[0]}</td>
                      <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, ...(String(row[1]).includes("Moins") ? { fontWeight: 700, color: C.green } : {}) }}>{row[1]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div style={{ marginTop: 16, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Aucun impôt dû — moins-value</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>75 000€ {"<"} 107 350€ (prix corrigé)</div>
            </div>
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 La vente d'une partie du jardin génère souvent une moins-value car le prix d'achat proratisé inclut la valeur du terrain dans le prix global de la maison. Ici, le terrain détaché se vend 75 000€ mais le prix d'achat proratisé est de 98 000€ — aucun impôt n'est dû.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Comparaison terrain vs bien bâti ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Terrain vs bien bâti — l'impact du forfait travaux</div>
            <div style={{ fontSize: 13, color: C.muted }}>Même valeur d'achat (80 000€), même prix de vente (150 000€), même durée (10 ans). Seule différence&nbsp;: le forfait 15%.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3Terrain && rEx3Bati && (
              <>
                <div className="terrain-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {/* Colonne Terrain */}
                  <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.red, marginBottom: 8, textAlign: "center" }}>Terrain nu 🌱</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Prix d'achat", fmt(80000)],
                          ["Forfait 7,5%", fmt(6000)],
                          ["Travaux", "0 €"],
                          ["Prix corrigé", fmt(86000)],
                          [null],
                          ["PV brute", fmt(rEx3Terrain.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Terrain.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Impôt total", fmt(rEx3Terrain.totalImpot)],
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
                  {/* Colonne Bien bâti */}
                  <div style={{ background: "rgba(86,203,173,0.04)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.green, marginBottom: 8, textAlign: "center" }}>Bien bâti 🏠</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Prix d'achat", fmt(80000)],
                          ["Forfait 7,5%", fmt(6000)],
                          ["Forfait 15%", fmt(12000)],
                          ["Prix corrigé", fmt(98000)],
                          [null],
                          ["PV brute", fmt(rEx3Bati.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Bati.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Impôt total", fmt(rEx3Bati.totalImpot)],
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
                <div style={{ background: C.redBg, border: "1px solid #E8B4B0", borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.redLight, marginBottom: 8 }}>
                  Surcoût terrain : +{fmt(ex3Diff)}
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
              💡 L'absence du forfait 15% augmente la PV brute de 12 000€ sur un terrain à 80 000€, soit environ {fmt(ex3Diff)} d'impôt supplémentaire. Les seuls leviers pour le compenser&nbsp;: déduire les frais réels de viabilisation, bornage, clôture ou drainage sur factures.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-terrain-grid { grid-template-columns: 1fr !important; }
          .terrain-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements — adapté terrain ─────────────────────────────────

function fmtPctT(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function getImpotColorT(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function AbattementsTableTerrain() {
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
        Abattements sur la plus-value d'un terrain — Barème 2026
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les terrains bénéficient exactement des mêmes abattements pour durée de détention que les biens bâtis. Exonération d'IR après 22 ans, exonération totale (IR + PS) après 30 ans. Le seul désavantage fiscal du terrain est l'absence du forfait 15% pour travaux.
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

      {/* Note terrain */}
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.18)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6, marginBottom: 16 }}>
        🌱 <strong>Rappel terrain :</strong> le forfait 15% travaux est réservé aux biens bâtis détenus depuis plus de 5 ans (art. 150 VB II 4° du CGI). Sur un terrain nu, seuls les frais réels facturés par des entreprises sont déductibles&nbsp;: viabilisation, bornage, géomètre-expert, clôture, drainage, défrichage.
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
                <th className="abat-terrain-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-terrain-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
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
                      {row.abatIR >= 100 ? "100% ✓" : fmtPctT(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtPctT(row.abatPS)}
                    </td>
                    <td className="abat-terrain-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exonéré</span> : fmtPctT(row.tauxIR)}
                    </td>
                    <td className="abat-terrain-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctT(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctT(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorT(row.impot100k) }}>
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
          <strong>Source :</strong> art. 150 VC du CGI (abattements) &middot; art. 150 VB II 4° (forfait travaux réservé aux biens bâtis) &middot; art. 1529 (taxe communale sur terrains devenus constructibles, non incluse dans ce simulateur).
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-terrain-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── FAQ spécifique terrain ───────────────────────────────────────────────────
const FAQ_ITEMS_TERRAIN = [
  {
    q: "Pourquoi le forfait 15% travaux ne s'applique-t-il pas aux terrains ?",
    a: "Le forfait de 15% est prévu par l'article 150 VB II 4° du CGI pour couvrir les travaux de construction, reconstruction, agrandissement ou amélioration réalisés sur un bien bâti. Un terrain nu n'étant pas un bien bâti, ce forfait n'est pas applicable. En revanche, si vous avez réalisé des travaux sur le terrain (viabilisation, raccordement aux réseaux, bornage, clôture, drainage), vous pouvez les déduire pour leur montant réel sur présentation de factures d'entreprises. Les travaux réalisés par vous-même ne sont pas déductibles.",
  },
  {
    q: "Comment calcule-t-on la plus-value lors d'une division parcellaire ?",
    a: "Le prix d'acquisition du terrain vendu est calculé au prorata de la surface cédée par rapport à la surface totale du bien au moment de l'achat. Par exemple, si vous avez acheté une maison sur 1 000 m² pour 300 000€ et que vous vendez 300 m² de jardin, le prix d'acquisition retenu est 300 000 × (300/1000) = 90 000€. La durée de détention court depuis la date d'achat initiale du bien (pas depuis la date du permis d'aménager ou du bornage).",
  },
  {
    q: "La vente d'une partie de mon jardin est-elle exonérée comme ma résidence principale ?",
    a: "Pas automatiquement. L'exonération résidence principale peut s'appliquer au terrain attenant SI deux conditions sont réunies\u00a0: le terrain doit constituer une dépendance immédiate et nécessaire de la résidence principale, ET la cession du terrain doit être simultanée à la vente de la maison. Si vous vendez uniquement le terrain sans vendre la maison, l'exonération RP ne s'applique pas. Vous pouvez toutefois bénéficier de l'exonération si le prix de cession est ≤ 15 000€ (art. 150 U II 6° CGI).",
  },
  {
    q: "Qu'est-ce que la taxe communale sur les terrains devenus constructibles ?",
    a: "C'est une taxe facultative de 10% instituée par l'article 1529 du CGI. Elle frappe la plus-value brute (différence entre prix de vente et prix d'acquisition actualisé de l'inflation) des terrains nus rendus constructibles par une modification du PLU. Elle ne s'applique que dans les communes qui ont délibéré en ce sens. Elle s'ajoute à l'impôt sur la PV classique (IR + PS). Exonérations\u00a0: détention > 18 ans depuis le classement constructible, prix de cession ≤ 15 000€, ou classement intervenu avant le 13 janvier 2010. Vérifiez auprès de votre mairie. Notre simulateur ne calcule pas cette taxe.",
  },
  {
    q: "La viabilisation d'un terrain est-elle déductible de la plus-value ?",
    a: "Oui, si elle a été réalisée par une entreprise et que vous disposez des factures. Les travaux de viabilisation déductibles comprennent\u00a0: le raccordement au réseau d'eau potable, au réseau d'assainissement (ou installation d'un assainissement individuel), au réseau électrique, au réseau de gaz, et au réseau de télécommunications. Les frais de géomètre-expert pour le bornage, les frais de clôture et les travaux de drainage sont également déductibles. Conservez toutes vos factures — le notaire les demandera au moment de la vente.",
  },
  {
    q: "Un terrain agricole est-il soumis à la plus-value immobilière ?",
    a: "Oui, la vente d'un terrain agricole par un particulier (non exploitant agricole) est soumise au régime des plus-values immobilières des particuliers, comme tout autre terrain. Les mêmes abattements pour durée de détention s'appliquent. Si le terrain est exploité dans le cadre d'une activité agricole professionnelle, le régime des plus-values professionnelles peut s'appliquer (avec des exonérations spécifiques). Pour les petits terrains agricoles vendus ≤ 15 000€, l'exonération totale s'applique.",
  },
  {
    q: "Comment est imposée la vente d'un terrain reçu en donation ou succession ?",
    a: "Le calcul combine les règles du terrain (pas de forfait 15%) et celles de la donation/succession (valeur déclarée dans l'acte, frais réels uniquement, durée de détention depuis la transmission). Concrètement, le forfait 7,5% ne s'applique pas non plus (car c'est une transmission gratuite) et le forfait 15% travaux non plus (car c'est un terrain). Seuls les droits de mutation réellement payés et les travaux réels facturés sont déductibles. C'est le cas le plus défavorable en termes de déductions. Utilisez notre simulateur donation/succession pour ce cas.",
  },
];

function FAQSectionTerrain() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value sur la vente d'un terrain
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_TERRAIN.map((item, i) => {
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

// ── Sources légales terrain ──────────────────────────────────────────────────
function SourcesLegalesTerrain() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.indigoMid }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U à 150 VH du CGI</span> (régime des plus-values immobilières) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VB II 4°</span> (forfait travaux réservé aux biens bâtis) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements durée de détention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 1529</span> (taxe communale sur terrains devenus constructibles) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U II 6°</span> (exonération cessions ≤ 15 000€) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U II 1°</span> (exonération résidence principale et dépendances).
          <br />
          <strong style={{ color: C.indigoMid }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ──────────────────────────────────────────────────────
function AutresSimulateursTerrain() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
          { href: "/plus-value-indivision", icon: "👥", title: "Indivision", desc: "Quote-part et abattements" },
          { href: "/plus-value-donation-succession", icon: "🎁", title: "Donation / Succession", desc: "Bien hérité ou donné" },
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

// ── Contenu éditorial Terrain ────────────────────────────────────────────────
function ContentTerrain() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Mêmes règles, une exception */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Plus-value terrain : les mêmes règles, une exception
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            La cession d'un terrain est soumise au régime général de la plus-value immobilière des particuliers&nbsp;: taux d'IR de 19%, prélèvements sociaux de 17,2%, abattements progressifs pour durée de détention dès la 6e année, surtaxe au-delà de 50 000€ de plus-value nette. Une seule différence notable&nbsp;: le <strong>forfait de 15% pour travaux ne s'applique pas</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Abattements identiques", desc: "6%/an dès la 6e année → exonération IR à 22 ans, PS à 30 ans.", ok: true },
              { icon: "✅", title: "Forfait 7,5% frais d'achat", desc: "Le forfait frais d'acquisition reste applicable au terrain.", ok: true },
              { icon: "❌", title: "Pas de forfait travaux 15%", desc: "Le forfait de 15% est réservé aux biens bâtis. Seuls les travaux réels facturés sont déductibles.", ok: false },
              { icon: "✅", title: "Frais réels déductibles", desc: "Viabilisation, géomètre, bornage, clôture, drainage… déductibles sur factures.", ok: true },
            ].map((item, i) => (
              <div key={i} style={{ background: item.ok ? C.greenBg : C.redBg, border: `1px solid ${item.ok ? C.greenBorder : "#E8B4B0"}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Division parcellaire */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Cas de la division parcellaire
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Vendre une partie de son jardin ou diviser une grande parcelle est de plus en plus courant. La plus-value se calcule au prorata de la surface cédée.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 12 }}>⚙️ Formule pour une division parcellaire</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Prix d'acquisition du terrain cédé = Prix d'achat total × (Surface cédée ÷ Surface totale)",
                "La durée de détention court depuis l'achat initial du bien (pas depuis le bornage)",
                "L'exonération RP peut s'appliquer si le terrain est une dépendance nécessaire et vendu simultanément avec la maison",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Taxe art. 1529 */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Taxe forfaitaire sur les terrains devenus constructibles (art. 1529)
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            En sus de l'impôt classique, certaines communes ont institué une taxe forfaitaire de 10% sur la cession de terrains rendus constructibles par modification du PLU.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "Taux", val: "10% de la plus-value brute (prix de vente − prix d'acquisition actualisé de l'inflation)" },
                { label: "Qui l'applique ?", val: "Uniquement les communes ayant délibéré en ce sens. Vérifiez auprès de votre mairie." },
                { label: "Exonérations", val: "Détention > 18 ans depuis le classement, prix ≤ 15 000€, ou classement avant le 13/01/2010" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: C.indigo, minWidth: 120, flexShrink: 0 }}>{item.label}&nbsp;:</span>
                  <span>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
            ⚠️ <strong>Note :</strong> Notre simulateur ne calcule pas cette taxe communale facultative. Vérifiez auprès de votre mairie si elle s'applique dans votre commune avant la vente.
          </div>
        </section>

        {/* Section 4 — Exonération ≤ 15 000€ */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Exonération des cessions de terrain ≤ 15 000€
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Lorsque le prix de cession est inférieur ou égal à 15 000€, la plus-value est totalement exonérée d'IR et de PS (art. 150 U II 6° CGI). Le seuil s'apprécie par cédant.
          </p>
        </section>

      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function TerrainClient() {
  return (
    <>
      <SimulateurBase
        defaultType="terrain"
        showTypeResidence={false}
        disableForfaitTravaux={true}
        heroEyebrow="Simulateur terrain constructible"
        heroTitle="Plus-value sur la vente d'un terrain"
        heroDescription="Même régime que les biens bâtis, avec une exception&nbsp;: le forfait 15% travaux ne s'applique pas aux terrains non bâtis. Frais de viabilisation et bornage déductibles sur factures."
        heroBadges={[
          { icon: "🌱", label: "Forfait 15% travaux non applicable" },
          { icon: "🔧", label: "Viabilisation et bornage déductibles" },
          { icon: "📐", label: "Abattements identiques aux biens bâtis" },
          { icon: "📄", label: "Export PDF" },
        ]}
        lockedTypeLabel="Terrain nu / Terrain constructible 🌱"
        customTitle="Calculez la plus-value sur la vente de votre terrain"
        customSubtitle="Même régime que les biens bâtis, sauf le forfait 15% travaux qui ne s'applique pas. Le simulateur intègre les frais de viabilisation, bornage et géomètre sur factures réelles."
        customBadges={[
          { icon: "🌱", text: "Forfait 15% travaux non applicable" },
          { icon: "🔧", text: "Viabilisation et bornage déductibles sur factures" },
          { icon: "📐", text: "Abattements identiques aux biens bâtis" },
        ]}
        customAlertBanner={<TerrainAlertBanner />}
        customSocialProof={<TerrainSocialProof />}
        customHowItWorks={<HowItWorksTerrain />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
        caseBadge={{ label: "Terrain — forfait travaux non applicable", color: "#2D2B55" }}
      />
      <ExamplesSectionTerrain />
      <AbattementsTableTerrain />
      <ContentTerrain />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionTerrain />
        <SourcesLegalesTerrain />
      </div>
      <AutresSimulateursTerrain />
    </>
  );
}
