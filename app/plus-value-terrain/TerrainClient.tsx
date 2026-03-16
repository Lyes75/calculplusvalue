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
        \ud83c\udf31 <strong>Rappel :</strong> le forfait 15% pour travaux ne s&rsquo;applique pas aux terrains non b\u00e2tis. Seuls les frais r\u00e9els (viabilisation, bornage, cl\u00f4ture, drainage) sont d\u00e9ductibles sur factures.
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
          { emoji: "\ud83c\udf31", before: "Forfait 15% travaux ", bold: "non applicable", after: "" },
          { emoji: "\u2705", before: "Bar\u00e8mes CGI au ", bold: "1er janvier 2026", after: "" },
          { emoji: "\ud83d\udd12", before: "Gratuit, ", bold: "sans inscription", after: "" },
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
      title: "Renseignez l\u2019achat du terrain",
      desc: "Prix d\u2019achat, date d\u2019acquisition, frais de notaire (forfait 7,5% applicable). Le forfait travaux 15% n\u2019est PAS applicable \u2014 indiquez uniquement les frais r\u00e9els de viabilisation, bornage, g\u00e9om\u00e8tre ou cl\u00f4ture sur factures.",
    },
    {
      num: "2",
      title: "Obtenez le d\u00e9tail de l\u2019imp\u00f4t",
      desc: "Plus-value brute, abattements pour dur\u00e9e de d\u00e9tention (identiques aux biens b\u00e2tis), surtaxe si applicable. Attention\u00a0: la taxe communale sur terrains devenus constructibles (art. 1529) n\u2019est pas incluse \u2014 v\u00e9rifiez aupr\u00e8s de votre mairie.",
    },
    {
      num: "3",
      title: "Comparez et optimisez",
      desc: "\u00c9valuez l\u2019impact d\u2019attendre quelques ann\u00e9es. Le terrain b\u00e9n\u00e9ficie des m\u00eames abattements que les biens b\u00e2tis\u00a0: exon\u00e9ration IR totale apr\u00e8s 22 ans, PS apr\u00e8s 30 ans.",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 24, marginTop: 0 }}>
        Comment calculer votre plus-value en 3 \u00e9tapes
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
        Trois situations courantes\u00a0: vente d&rsquo;un terrain nu, division parcellaire, et l&rsquo;impact du forfait travaux non applicable.
      </p>

      <div className="examples-terrain-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : Terrain constructible 16 ans ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Terrain constructible — d\u00e9tention 16 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Terrain achet\u00e9 45 000\u20ac en 2010 en zone pavillonnaire, vendu 110 000\u20ac en 2026 apr\u00e8s classement constructible au PLU.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d\u2019achat", fmt(45000)],
                      ["+ Forfait 7,5%", fmt(3375)],
                      ["+ Viabilisation r\u00e9elle", fmt(6000)],
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
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Imp\u00f4t total</div>
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
              \ud83d\udca1 Sans le forfait 15% travaux (non applicable aux terrains), seuls les 6 000\u20ac de viabilisation r\u00e9els sont d\u00e9duits. Sur un bien b\u00e2ti de m\u00eame valeur, le forfait 15% aurait permis de d\u00e9duire 6 750\u20ac. La diff\u00e9rence est modeste ici, mais elle se creuse sur des terrains achet\u00e9s cher avec peu de travaux r\u00e9els.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Division parcellaire ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Division parcellaire — vente du jardin</div>
            <div style={{ fontSize: 13, color: C.muted }}>Maison achet\u00e9e 280 000\u20ac sur 1 000 m\u00b2 en 2012. Vente de 350 m\u00b2 de jardin pour 75 000\u20ac en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {[
                  ["Prix d\u2019achat total", fmt(280000)],
                  ["Surface c\u00e9d\u00e9e / totale", "350 / 1 000 m\u00b2"],
                  ["Prix proratisé", fmt(98000)],
                  ["+ Forfait 7,5%", fmt(7350)],
                  ["+ Travaux", "0 \u20ac"],
                  ["Frais de cession", fmt(2000)],
                  [null],
                  ["Prix d\u2019achat corrig\u00e9", fmt(98000 + 7350 + 2000)],
                  ["Prix de vente", fmt(75000)],
                  [null],
                  ["R\u00e9sultat", "Moins-value"],
                ].map((row, j) =>
                  row === null || row[0] === null ? (
                    <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                  ) : (
                    <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                      <td style={{ padding: "5px 0", color: C.muted, ...(String(row[0]).includes("R\u00e9sultat") ? { fontWeight: 700, color: C.green } : {}) }}>{row[0]}</td>
                      <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, ...(String(row[1]).includes("Moins") ? { fontWeight: 700, color: C.green } : {}) }}>{row[1]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div style={{ marginTop: 16, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Aucun imp\u00f4t d\u00fb \u2014 moins-value</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>75 000\u20ac {"<"} 107 350\u20ac (prix corrig\u00e9)</div>
            </div>
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              \ud83d\udca1 La vente d&rsquo;une partie du jardin g\u00e9n\u00e8re souvent une moins-value car le prix d&rsquo;achat proratisé inclut la valeur du terrain dans le prix global de la maison. Ici, le terrain d\u00e9tach\u00e9 se vend 75 000\u20ac mais le prix d&rsquo;achat proratisé est de 98 000\u20ac \u2014 aucun imp\u00f4t n&rsquo;est d\u00fb.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Comparaison terrain vs bien bâti ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Terrain vs bien b\u00e2ti — l&rsquo;impact du forfait travaux</div>
            <div style={{ fontSize: 13, color: C.muted }}>M\u00eame valeur d&rsquo;achat (80 000\u20ac), m\u00eame prix de vente (150 000\u20ac), m\u00eame dur\u00e9e (10 ans). Seule diff\u00e9rence\u00a0: le forfait 15%.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3Terrain && rEx3Bati && (
              <>
                <div className="terrain-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {/* Colonne Terrain */}
                  <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.red, marginBottom: 8, textAlign: "center" }}>Terrain nu \ud83c\udf31</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Prix d\u2019achat", fmt(80000)],
                          ["Forfait 7,5%", fmt(6000)],
                          ["Travaux", "0 \u20ac"],
                          ["Prix corrig\u00e9", fmt(86000)],
                          [null],
                          ["PV brute", fmt(rEx3Terrain.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Terrain.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Imp\u00f4t total", fmt(rEx3Terrain.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(224,86,86,0.1)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Imp\u00f4t") ? 700 : 500, color: String(row[0]).includes("Imp\u00f4t") ? C.redLight : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Colonne Bien bâti */}
                  <div style={{ background: "rgba(86,203,173,0.04)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.green, marginBottom: 8, textAlign: "center" }}>Bien b\u00e2ti \ud83c\udfe0</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Prix d\u2019achat", fmt(80000)],
                          ["Forfait 7,5%", fmt(6000)],
                          ["Forfait 15%", fmt(12000)],
                          ["Prix corrig\u00e9", fmt(98000)],
                          [null],
                          ["PV brute", fmt(rEx3Bati.pvBrute)],
                          [`Abat. IR (10 ans)`, `${rEx3Bati.abatIRPct.toFixed(0)}%`],
                          [null],
                          ["Imp\u00f4t total", fmt(rEx3Bati.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(86,203,173,0.15)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Imp\u00f4t") ? 700 : 500, color: String(row[0]).includes("Imp\u00f4t") ? C.green : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ background: C.redBg, border: "1px solid #E8B4B0", borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.redLight, marginBottom: 8 }}>
                  Surco\u00fbt terrain : +{fmt(ex3Diff)}
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
              \ud83d\udca1 L&rsquo;absence du forfait 15% augmente la PV brute de 12 000\u20ac sur un terrain \u00e0 80 000\u20ac, soit environ {fmt(ex3Diff)} d&rsquo;imp\u00f4t suppl\u00e9mentaire. Les seuls leviers pour le compenser\u00a0: d\u00e9duire les frais r\u00e9els de viabilisation, bornage, cl\u00f4ture ou drainage sur factures.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
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
    data.push({ label: "0 \u00e0 5 ans", abatIR: abatIR0, abatPS: abatPS0, tauxIR: tauxIR0, tauxPS: tauxPS0, total: total0, impot100k: Math.round(100000 * total0 / 100), isYear22: false, isYear30: false });
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
    ["6e \u00e0 21e ann\u00e9e", "6% / an", "1,65% / an", "6% \u2192 96%", "1,65% \u2192 26,4%"],
    ["22e ann\u00e9e", "4%", "1,60%", "100% \u2192 exon\u00e9r\u00e9", "28%"],
    ["23e \u00e0 30e ann\u00e9e", "\u2014", "9% / an", "\u2014", "28% \u2192 100%"],
    ["Au-del\u00e0 de 30 ans", "\u2014", "\u2014", "Exon\u00e9r\u00e9", "Exon\u00e9r\u00e9"],
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Abattements sur la plus-value d&rsquo;un terrain — Bar\u00e8me 2026
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les terrains b\u00e9n\u00e9ficient exactement des m\u00eames abattements pour dur\u00e9e de d\u00e9tention que les biens b\u00e2tis. Exon\u00e9ration d&rsquo;IR apr\u00e8s 22 ans, exon\u00e9ration totale (IR + PS) apr\u00e8s 30 ans. Le seul d\u00e9savantage fiscal du terrain est l&rsquo;absence du forfait 15% pour travaux.
      </p>

      {/* Tableau synthétique */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead>
            <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Dur\u00e9e de d\u00e9tention</th>
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
        \ud83c\udf31 <strong>Rappel terrain :</strong> le forfait 15% travaux est r\u00e9serv\u00e9 aux biens b\u00e2tis d\u00e9tenus depuis plus de 5 ans (art. 150 VB II 4\u00b0 du CGI). Sur un terrain nu, seuls les frais r\u00e9els factur\u00e9s par des entreprises sont d\u00e9ductibles\u00a0: viabilisation, bornage, g\u00e9om\u00e8tre-expert, cl\u00f4ture, drainage, d\u00e9frichage.
      </div>

      {/* Toggle */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}
      >
        {showDetailed ? "Masquer le d\u00e9tail ann\u00e9e par ann\u00e9e \u25b2" : "Voir le d\u00e9tail ann\u00e9e par ann\u00e9e \u25bc"}
      </button>

      {/* Tableau détaillé */}
      <div style={{ maxHeight: showDetailed ? 3000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div style={{ overflowX: "auto", position: "relative", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Ann\u00e9e</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. IR</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. PS</th>
                <th className="abat-terrain-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-terrain-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux total</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Imp\u00f4t / 100K\u20ac</th>
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
                      {row.abatIR >= 100 ? "100% \u2713" : fmtPctT(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% \u2713" : fmtPctT(row.abatPS)}
                    </td>
                    <td className="abat-terrain-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exon\u00e9r\u00e9</span> : fmtPctT(row.tauxIR)}
                    </td>
                    <td className="abat-terrain-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exon\u00e9r\u00e9</span> : fmtPctT(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exon\u00e9r\u00e9</span> : fmtPctT(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorT(row.impot100k) }}>
                      {row.impot100k <= 0 ? "0 \u20ac" : row.impot100k.toLocaleString("fr-FR") + " \u20ac"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Source note */}
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>Source :</strong> art. 150 VC du CGI (abattements) &middot; art. 150 VB II 4\u00b0 (forfait travaux r\u00e9serv\u00e9 aux biens b\u00e2tis) &middot; art. 1529 (taxe communale sur terrains devenus constructibles, non incluse dans ce simulateur).
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
    q: "Pourquoi le forfait 15% travaux ne s\u2019applique-t-il pas aux terrains ?",
    a: "Le forfait de 15% est pr\u00e9vu par l\u2019article 150 VB II 4\u00b0 du CGI pour couvrir les travaux de construction, reconstruction, agrandissement ou am\u00e9lioration r\u00e9alis\u00e9s sur un bien b\u00e2ti. Un terrain nu n\u2019\u00e9tant pas un bien b\u00e2ti, ce forfait n\u2019est pas applicable. En revanche, si vous avez r\u00e9alis\u00e9 des travaux sur le terrain (viabilisation, raccordement aux r\u00e9seaux, bornage, cl\u00f4ture, drainage), vous pouvez les d\u00e9duire pour leur montant r\u00e9el sur pr\u00e9sentation de factures d\u2019entreprises. Les travaux r\u00e9alis\u00e9s par vous-m\u00eame ne sont pas d\u00e9ductibles.",
  },
  {
    q: "Comment calcule-t-on la plus-value lors d\u2019une division parcellaire ?",
    a: "Le prix d\u2019acquisition du terrain vendu est calcul\u00e9 au prorata de la surface c\u00e9d\u00e9e par rapport \u00e0 la surface totale du bien au moment de l\u2019achat. Par exemple, si vous avez achet\u00e9 une maison sur 1 000 m\u00b2 pour 300 000\u20ac et que vous vendez 300 m\u00b2 de jardin, le prix d\u2019acquisition retenu est 300 000 \u00d7 (300/1000) = 90 000\u20ac. La dur\u00e9e de d\u00e9tention court depuis la date d\u2019achat initiale du bien (pas depuis la date du permis d\u2019am\u00e9nager ou du bornage).",
  },
  {
    q: "La vente d\u2019une partie de mon jardin est-elle exon\u00e9r\u00e9e comme ma r\u00e9sidence principale ?",
    a: "Pas automatiquement. L\u2019exon\u00e9ration r\u00e9sidence principale peut s\u2019appliquer au terrain attenant SI deux conditions sont r\u00e9unies\u00a0: le terrain doit constituer une d\u00e9pendance imm\u00e9diate et n\u00e9cessaire de la r\u00e9sidence principale, ET la cession du terrain doit \u00eatre simultan\u00e9e \u00e0 la vente de la maison. Si vous vendez uniquement le terrain sans vendre la maison, l\u2019exon\u00e9ration RP ne s\u2019applique pas. Vous pouvez toutefois b\u00e9n\u00e9ficier de l\u2019exon\u00e9ration si le prix de cession est \u2264 15 000\u20ac (art. 150 U II 6\u00b0 CGI).",
  },
  {
    q: "Qu\u2019est-ce que la taxe communale sur les terrains devenus constructibles ?",
    a: "C\u2019est une taxe facultative de 10% institu\u00e9e par l\u2019article 1529 du CGI. Elle frappe la plus-value brute (diff\u00e9rence entre prix de vente et prix d\u2019acquisition actualis\u00e9 de l\u2019inflation) des terrains nus rendus constructibles par une modification du PLU. Elle ne s\u2019applique que dans les communes qui ont d\u00e9lib\u00e9r\u00e9 en ce sens. Elle s\u2019ajoute \u00e0 l\u2019imp\u00f4t sur la PV classique (IR + PS). Exon\u00e9rations\u00a0: d\u00e9tention > 18 ans depuis le classement constructible, prix de cession \u2264 15 000\u20ac, ou classement intervenu avant le 13 janvier 2010. V\u00e9rifiez aupr\u00e8s de votre mairie. Notre simulateur ne calcule pas cette taxe.",
  },
  {
    q: "La viabilisation d\u2019un terrain est-elle d\u00e9ductible de la plus-value ?",
    a: "Oui, si elle a \u00e9t\u00e9 r\u00e9alis\u00e9e par une entreprise et que vous disposez des factures. Les travaux de viabilisation d\u00e9ductibles comprennent\u00a0: le raccordement au r\u00e9seau d\u2019eau potable, au r\u00e9seau d\u2019assainissement (ou installation d\u2019un assainissement individuel), au r\u00e9seau \u00e9lectrique, au r\u00e9seau de gaz, et au r\u00e9seau de t\u00e9l\u00e9communications. Les frais de g\u00e9om\u00e8tre-expert pour le bornage, les frais de cl\u00f4ture et les travaux de drainage sont \u00e9galement d\u00e9ductibles. Conservez toutes vos factures \u2014 le notaire les demandera au moment de la vente.",
  },
  {
    q: "Un terrain agricole est-il soumis \u00e0 la plus-value immobili\u00e8re ?",
    a: "Oui, la vente d\u2019un terrain agricole par un particulier (non exploitant agricole) est soumise au r\u00e9gime des plus-values immobili\u00e8res des particuliers, comme tout autre terrain. Les m\u00eames abattements pour dur\u00e9e de d\u00e9tention s\u2019appliquent. Si le terrain est exploit\u00e9 dans le cadre d\u2019une activit\u00e9 agricole professionnelle, le r\u00e9gime des plus-values professionnelles peut s\u2019appliquer (avec des exon\u00e9rations sp\u00e9cifiques). Pour les petits terrains agricoles vendus \u2264 15 000\u20ac, l\u2019exon\u00e9ration totale s\u2019applique.",
  },
  {
    q: "Comment est impos\u00e9e la vente d\u2019un terrain re\u00e7u en donation ou succession ?",
    a: "Le calcul combine les r\u00e8gles du terrain (pas de forfait 15%) et celles de la donation/succession (valeur d\u00e9clar\u00e9e dans l\u2019acte, frais r\u00e9els uniquement, dur\u00e9e de d\u00e9tention depuis la transmission). Concr\u00e8tement, le forfait 7,5% ne s\u2019applique pas non plus (car c\u2019est une transmission gratuite) et le forfait 15% travaux non plus (car c\u2019est un terrain). Seuls les droits de mutation r\u00e9ellement pay\u00e9s et les travaux r\u00e9els factur\u00e9s sont d\u00e9ductibles. C\u2019est le cas le plus d\u00e9favorable en termes de d\u00e9ductions. Utilisez notre simulateur donation/succession pour ce cas.",
  },
];

function FAQSectionTerrain() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fr\u00e9quentes — Plus-value sur la vente d&rsquo;un terrain
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
          <strong style={{ color: C.indigoMid }}>Sources l\u00e9gales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U \u00e0 150 VH du CGI</span> (r\u00e9gime des plus-values immobili\u00e8res) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VB II 4\u00b0</span> (forfait travaux r\u00e9serv\u00e9 aux biens b\u00e2tis) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements dur\u00e9e de d\u00e9tention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 1529</span> (taxe communale sur terrains devenus constructibles) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U II 6\u00b0</span> (exon\u00e9ration cessions \u2264 15 000\u20ac) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U II 1\u00b0</span> (exon\u00e9ration r\u00e9sidence principale et d\u00e9pendances).
          <br />
          <strong style={{ color: C.indigoMid }}>Derni\u00e8re mise \u00e0 jour des bar\u00e8mes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ──────────────────────────────────────────────────────
function AutresSimulateursTerrain() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>\ud83d\udd17 Simulateurs sp\u00e9cialis\u00e9s sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "\ud83c\udfe0", title: "Simulateur g\u00e9n\u00e9ral", desc: "R\u00e9sidence secondaire, locatif, terrain" },
          { href: "/plus-value-indivision", icon: "\ud83d\udc65", title: "Indivision", desc: "Quote-part et abattements" },
          { href: "/plus-value-donation-succession", icon: "\ud83c\udf81", title: "Donation / Succession", desc: "Bien h\u00e9rit\u00e9 ou donn\u00e9" },
          { href: "/exonerations-plus-value", icon: "\u2705", title: "Exon\u00e9rations", desc: "R\u00e9sidence principale, cas sp\u00e9ciaux" },
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
            Plus-value terrain : les m\u00eames r\u00e8gles, une exception
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            La cession d&rsquo;un terrain est soumise au r\u00e9gime g\u00e9n\u00e9ral de la plus-value immobili\u00e8re des particuliers\u00a0: taux d&rsquo;IR de 19%, pr\u00e9l\u00e8vements sociaux de 17,2%, abattements progressifs pour dur\u00e9e de d\u00e9tention d\u00e8s la 6e ann\u00e9e, surtaxe au-del\u00e0 de 50 000\u20ac de plus-value nette. Une seule diff\u00e9rence notable\u00a0: le <strong>forfait de 15% pour travaux ne s&rsquo;applique pas</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "\u2705", title: "Abattements identiques", desc: "6%/an d\u00e8s la 6e ann\u00e9e \u2192 exon\u00e9ration IR \u00e0 22 ans, PS \u00e0 30 ans.", ok: true },
              { icon: "\u2705", title: "Forfait 7,5% frais d\u2019achat", desc: "Le forfait frais d\u2019acquisition reste applicable au terrain.", ok: true },
              { icon: "\u274c", title: "Pas de forfait travaux 15%", desc: "Le forfait de 15% est r\u00e9serv\u00e9 aux biens b\u00e2tis. Seuls les travaux r\u00e9els factur\u00e9s sont d\u00e9ductibles.", ok: false },
              { icon: "\u2705", title: "Frais r\u00e9els d\u00e9ductibles", desc: "Viabilisation, g\u00e9om\u00e8tre, bornage, cl\u00f4ture, drainage\u2026 d\u00e9ductibles sur factures.", ok: true },
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
            Vendre une partie de son jardin ou diviser une grande parcelle est de plus en plus courant. La plus-value se calcule au prorata de la surface c\u00e9d\u00e9e.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 12 }}>\u2699\ufe0f Formule pour une division parcellaire</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Prix d\u2019acquisition du terrain c\u00e9d\u00e9 = Prix d\u2019achat total \u00d7 (Surface c\u00e9d\u00e9e \u00f7 Surface totale)",
                "La dur\u00e9e de d\u00e9tention court depuis l\u2019achat initial du bien (pas depuis le bornage)",
                "L\u2019exon\u00e9ration RP peut s\u2019appliquer si le terrain est une d\u00e9pendance n\u00e9cessaire et vendu simultan\u00e9ment avec la maison",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>\u2192</span>
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
            En sus de l&rsquo;imp\u00f4t classique, certaines communes ont institu\u00e9 une taxe forfaitaire de 10% sur la cession de terrains rendus constructibles par modification du PLU.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "Taux", val: "10% de la plus-value brute (prix de vente \u2212 prix d\u2019acquisition actualis\u00e9 de l\u2019inflation)" },
                { label: "Qui l\u2019applique ?", val: "Uniquement les communes ayant d\u00e9lib\u00e9r\u00e9 en ce sens. V\u00e9rifiez aupr\u00e8s de votre mairie." },
                { label: "Exon\u00e9rations", val: "D\u00e9tention > 18 ans depuis le classement, prix \u2264 15 000\u20ac, ou classement avant le 13/01/2010" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: C.indigo, minWidth: 120, flexShrink: 0 }}>{item.label}\u00a0:</span>
                  <span>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
            \u26a0\ufe0f <strong>Note :</strong> Notre simulateur ne calcule pas cette taxe communale facultative. V\u00e9rifiez aupr\u00e8s de votre mairie si elle s&rsquo;applique dans votre commune avant la vente.
          </div>
        </section>

        {/* Section 4 — Exonération ≤ 15 000€ */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Exon\u00e9ration des cessions de terrain \u2264 15 000\u20ac
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Lorsque le prix de cession est inf\u00e9rieur ou \u00e9gal \u00e0 15 000\u20ac, la plus-value est totalement exon\u00e9r\u00e9e d&rsquo;IR et de PS (art. 150 U II 6\u00b0 CGI). Le seuil s&rsquo;appr\u00e9cie par c\u00e9dant.
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
        heroTitle="Plus-value sur la vente d\u2019un terrain"
        heroDescription="M\u00eame r\u00e9gime que les biens b\u00e2tis, avec une exception\u00a0: le forfait 15% travaux ne s\u2019applique pas aux terrains non b\u00e2tis. Frais de viabilisation et bornage d\u00e9ductibles sur factures."
        heroBadges={[
          { icon: "\ud83c\udf31", label: "Forfait 15% travaux non applicable" },
          { icon: "\ud83d\udd27", label: "Viabilisation et bornage d\u00e9ductibles" },
          { icon: "\ud83d\udcd0", label: "Abattements identiques aux biens b\u00e2tis" },
          { icon: "\ud83d\udcc4", label: "Export PDF" },
        ]}
        lockedTypeLabel="Terrain nu / Terrain constructible \ud83c\udf31"
        customTitle="Calculez la plus-value sur la vente de votre terrain"
        customSubtitle="M\u00eame r\u00e9gime que les biens b\u00e2tis, sauf le forfait 15% travaux qui ne s\u2019applique pas. Le simulateur int\u00e8gre les frais de viabilisation, bornage et g\u00e9om\u00e8tre sur factures r\u00e9elles."
        customBadges={[
          { icon: "\ud83c\udf31", text: "Forfait 15% travaux non applicable" },
          { icon: "\ud83d\udd27", text: "Viabilisation et bornage d\u00e9ductibles sur factures" },
          { icon: "\ud83d\udcd0", text: "Abattements identiques aux biens b\u00e2tis" },
        ]}
        customAlertBanner={<TerrainAlertBanner />}
        customSocialProof={<TerrainSocialProof />}
        customHowItWorks={<HowItWorksTerrain />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
        caseBadge={{ label: "Terrain \u2014 forfait travaux non applicable", color: "#2D2B55" }}
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
