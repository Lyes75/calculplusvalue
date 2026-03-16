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
  redBg: "#FDF0EE",
};

// ── Bandeau d'actualité non-résident ─────────────────────────────────────────
function NRAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        🌍 <strong>Rappel :</strong> les non-résidents UE/EEE affiliés à la sécurité sociale de leur pays de résidence bénéficient d&rsquo;un taux de PS réduit à <strong>7,5%</strong> au lieu de 17,2%. Économie de 9,7 points sur la plus-value.
      </div>
    </div>
  );
}

// ── Social proof non-résident ────────────────────────────────────────────────
function NRSocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { emoji: "🌍", before: "Taux PS adaptés selon ", bold: "votre pays de résidence", after: "" },
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

// ── Exemples chiffrés non-résident ───────────────────────────────────────────

function scrollToSimulator() {
  const el = document.querySelector("[data-simulator-form]");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ExamplesSectionNR() {
  // Exemple 1 : Expatrié UE — comparaison résident vs NR-UE
  const rEx1Resident = useMemo(() => computePlusValue(
    220000, 310000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    16500, 33000, 3000,
    { situationVendeur: "resident" }
  ), []);
  const rEx1NR = useMemo(() => computePlusValue(
    220000, 310000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    16500, 33000, 3000,
    { situationVendeur: "non-resident-ue", affilieSecuEEE: true }
  ), []);

  // Exemple 2 : Exonération 150K€
  const rEx2 = useMemo(() => computePlusValue(
    180000, 280000, new Date(2010, 0, 1), new Date(2026, 0, 1),
    13500, 27000, 2500,
    { situationVendeur: "non-resident-hors-ue", resideFrance2ans: true, anneesNonResident: 6 }
  ), []);

  // Exemple 3 : Hors UE, représentant fiscal
  const rEx3 = useMemo(() => computePlusValue(
    350000, 430000, new Date(2019, 0, 1), new Date(2026, 0, 1),
    26250, 52500, 4000,
    { situationVendeur: "non-resident-hors-ue" }
  ), []);

  const ex1Economie = rEx1Resident && rEx1NR ? rEx1Resident.totalImpot - rEx1NR.totalImpot : 0;
  const ex3RepresentantFiscal = Math.round(430000 * 0.007);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value pour non-résidents
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations d&rsquo;expatriés pour comprendre l&rsquo;impact du pays de résidence, de l&rsquo;exonération 150K€ et du représentant fiscal.
      </p>

      <div className="examples-nr-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : UE PS réduit ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Expatrié en Allemagne — PS réduit à 7,5%</div>
            <div style={{ fontSize: 13, color: C.muted }}>Français à Berlin, affilié sécu allemande. Appartement Bordeaux acheté 220K€ en 2014, vendu 310K€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1Resident && rEx1NR && (
              <>
                <div className="nr-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div style={{ background: "rgba(224,86,86,0.04)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: C.red, marginBottom: 6, textAlign: "center" }}>Si résident 🇫🇷</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["IR (19%)", fmt(rEx1Resident.impotIR)],
                          ["PS (17,2%)", fmt(rEx1Resident.impotPS)],
                          ...(rEx1Resident.surtaxe > 0 ? [["Surtaxe", fmt(rEx1Resident.surtaxe)]] : []),
                        ].map((row, j) => (
                          <tr key={j} style={{ borderBottom: "1px solid rgba(224,86,86,0.1)" }}>
                            <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                            <td style={{ padding: "3px 0", textAlign: "right", fontWeight: 500 }}>{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 6, textAlign: "center", fontSize: 15, fontWeight: 700, color: "#E05656" }}>{fmt(rEx1Resident.totalImpot)}</div>
                  </div>
                  <div style={{ background: "rgba(86,203,173,0.05)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: C.green, marginBottom: 6, textAlign: "center" }}>NR-UE 🇪🇺</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["IR (19%)", fmt(rEx1NR.impotIR)],
                          ["PS (7,5%)", fmt(rEx1NR.impotPS)],
                          ...(rEx1NR.surtaxe > 0 ? [["Surtaxe", fmt(rEx1NR.surtaxe)]] : []),
                        ].map((row, j) => (
                          <tr key={j} style={{ borderBottom: "1px solid rgba(86,203,173,0.15)" }}>
                            <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                            <td style={{ padding: "3px 0", textAlign: "right", fontWeight: 500 }}>{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 6, textAlign: "center", fontSize: 15, fontWeight: 700, color: C.green }}>{fmt(rEx1NR.totalImpot)}</div>
                  </div>
                </div>
                <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                  Économie NR-UE : {fmt(ex1Economie)}
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
              💡 En tant que non-résident UE affilié à la sécu allemande, vous économisez {fmt(ex1Economie)} de prélèvements sociaux. Le taux de PS passe de 17,2% à 7,5%.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Exonération 150K€ ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Ancienne résidente — Exonération 150K€</div>
            <div style={{ fontSize: 13, color: C.muted }}>Française expatriée à Singapour depuis 2020, 15 ans en France. Studio parisien acheté 180K€ en 2010, vendu 280K€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx2 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["PV brute", fmt(rEx2.pvBrute)],
                      [`Abattement IR (16 ans)`, `${rEx2.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS (16 ans)`, `${rEx2.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (exonéré art. 150 U II 2°)", "0 €"],
                      ["PS (17,2%)", fmt(rEx2.impotPS)],
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: C.muted }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, ...(String(row[0]).includes("exonéré") ? { color: C.green, fontWeight: 700 } : {}) }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Impôt total</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(rEx2.impotPS)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Net vendeur</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{fmt(280000 - 2500 - rEx2.impotPS)}</div>
                  </div>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 Grâce à l&rsquo;exonération de l&rsquo;art. 150 U II 2° du CGI, l&rsquo;IR est totalement exonéré. Seuls les PS à 17,2% sont dus. Attention : cette exonération n&rsquo;est utilisable qu&rsquo;une seule fois.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Hors UE + représentant fiscal ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Expatrié aux USA — Représentant fiscal</div>
            <div style={{ fontSize: 13, color: C.muted }}>Français à New York. Maison en Provence achetée 350K€ en 2019, vendue 430K€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d'achat", fmt(350000)],
                      ["+ Frais acquisition 7,5%", fmt(26250)],
                      ["+ Travaux forfait 15%", fmt(52500)],
                      ["Frais de cession", fmt(4000)],
                      [null],
                      ["PV brute", fmt(rEx3.pvBrute)],
                      [`Abattement IR (7 ans)`, `${rEx3.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS (7 ans)`, `${rEx3.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (19%)", fmt(rEx3.impotIR)],
                      ["PS (17,2%)", fmt(rEx3.impotPS)],
                      ...(rEx3.surtaxe > 0 ? [["Surtaxe", fmt(rEx3.surtaxe)]] : []),
                      [null],
                      ["Représentant fiscal (~0,7%)", fmt(ex3RepresentantFiscal)],
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: C.muted, ...(String(row[0]).includes("Représentant") ? { color: C.amber, fontWeight: 600 } : {}) }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Impôt total</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(rEx3.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Net (− repr. fiscal)</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{fmt(rEx3.netVendeur - ex3RepresentantFiscal)}</div>
                  </div>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 Non-résident hors UE avec prix {">"} 150K€ : représentant fiscal obligatoire (art. 244 bis A CGI). Coût estimé : 0,5% à 1% du prix, soit ~{fmt(ex3RepresentantFiscal)} ici.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-nr-grid { grid-template-columns: 1fr !important; }
          .nr-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements non-résident ──────────────────────────────────────

function fmtPctNR(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function getImpotColorNR(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function AbattementsTableNR() {
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
    const data: { label: string; abatIR: number; abatPS: number; tauxIR: number; tauxPS: number; total: number; impot100k: number; totalNR: number; impot100kNR: number; isYear22: boolean; isYear30: boolean }[] = [];
    // Group 0-5
    const abatIR0 = Math.min(100, getAbatIR(0));
    const abatPS0 = Math.min(100, getAbatPS(0));
    const tauxIR0 = 19 * (1 - abatIR0 / 100);
    const tauxPS0 = 17.2 * (1 - abatPS0 / 100);
    const tauxPSNR0 = 7.5 * (1 - abatPS0 / 100);
    const total0 = tauxIR0 + tauxPS0;
    const totalNR0 = tauxIR0 + tauxPSNR0;
    data.push({ label: "0 à 5 ans", abatIR: abatIR0, abatPS: abatPS0, tauxIR: tauxIR0, tauxPS: tauxPS0, total: total0, impot100k: Math.round(100000 * total0 / 100), totalNR: totalNR0, impot100kNR: Math.round(100000 * totalNR0 / 100), isYear22: false, isYear30: false });
    // Years 6-30
    for (let y = 6; y <= 30; y++) {
      const abatIR = Math.min(100, getAbatIR(y));
      const abatPS = Math.min(100, getAbatPS(y));
      const tauxIR = 19 * (1 - abatIR / 100);
      const tauxPS = 17.2 * (1 - abatPS / 100);
      const tauxPSNR = 7.5 * (1 - abatPS / 100);
      const total = tauxIR + tauxPS;
      const totalNR = tauxIR + tauxPSNR;
      data.push({ label: `${y} ans`, abatIR, abatPS, tauxIR, tauxPS, total, impot100k: Math.round(100000 * total / 100), totalNR, impot100kNR: Math.round(100000 * totalNR / 100), isYear22: y === 22, isYear30: y === 30 });
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
        Abattements et taux effectifs pour non-résidents — Barème 2026
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les abattements pour durée de détention s&rsquo;appliquent de la même manière aux résidents et non-résidents. La différence réside dans le taux de PS : 7,5% pour les non-résidents UE/EEE affiliés à la sécurité sociale de leur pays, au lieu de 17,2% pour les résidents. Le tableau ci-dessous montre les taux effectifs dans les deux cas.
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

      {/* Toggle */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}
      >
        {showDetailed ? "Masquer le détail année par année ▲" : "Voir le détail année par année ▼"}
      </button>

      {/* Tableau détaillé avec colonnes NR-UE */}
      <div style={{ maxHeight: showDetailed ? 3000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div className="abat-nr-wrapper" style={{ overflowX: "auto", position: "relative", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 800 }}>
            <thead>
              <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Année</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. IR</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. PS</th>
                <th className="abat-nr-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-nr-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux total</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Impôt / 100K€</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(86,203,173,0.15)", color: "#FFFFFF" }}>Taux NR-UE</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(86,203,173,0.15)", color: "#FFFFFF" }}>Impôt NR-UE</th>
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
                      {row.abatIR >= 100 ? "100% ✓" : fmtPctNR(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtPctNR(row.abatPS)}
                    </td>
                    <td className="abat-nr-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exonéré</span> : fmtPctNR(row.tauxIR)}
                    </td>
                    <td className="abat-nr-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctNR(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctNR(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorNR(row.impot100k) }}>
                      {row.impot100k <= 0 ? "0 €" : row.impot100k.toLocaleString("fr-FR") + " €"}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", background: "rgba(86,203,173,0.04)" }}>
                      {row.totalNR <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctNR(row.totalNR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", background: "rgba(86,203,173,0.04)", color: row.impot100kNR <= 0 ? "#3BAF7A" : C.green }}>
                      {row.impot100kNR <= 0 ? "0 €" : row.impot100kNR.toLocaleString("fr-FR") + " €"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>Source :</strong> art. 150 VC du Code général des impôts — barèmes en vigueur au 1er janvier 2026. La colonne « Impôt pour 100K€ » illustre l&rsquo;imposition sur une plus-value brute de 100 000€, hors surtaxe (applicable au-delà de 50 000€ de PV nette).
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>NR-UE</strong> = Non-résident UE/EEE/Suisse/UK affilié à la sécurité sociale de son pays de résidence (taux PS 7,5%). Les non-résidents hors UE ou non affiliés à un régime de sécu UE sont soumis au taux PS de 17,2% (mêmes montants que la colonne « résident »).
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-nr-hide { display: none !important; }
          .abat-nr-wrapper { box-shadow: inset -12px 0 8px -8px rgba(0,0,0,0.08); }
        }
      `}</style>
    </div>
  );
}

// ── FAQ spécifique non-résident ───────────────────────────────────────────────
const FAQ_ITEMS_NR = [
  {
    q: "Comment bénéficier du taux de PS réduit à 7,5% ?",
    a: "Pour bénéficier du taux de prélèvements sociaux réduit à 7,5% (au lieu de 17,2%), vous devez être résident fiscal d\u2019un pays de l\u2019UE, de l\u2019EEE, de la Suisse ou du Royaume-Uni, ET être affilié au régime de sécurité sociale de ce pays. C\u2019est ce second critère qui est déterminant : un Français résidant à Londres mais non affilié au NHS ne bénéficie pas du taux réduit. La preuve d\u2019affiliation est le formulaire A1 ou S1 délivré par l\u2019organisme de sécurité sociale de votre pays de résidence. Votre notaire vous demandera ce justificatif lors de la vente.",
  },
  {
    q: "L\u2019exonération de 150 000€ s\u2019applique-t-elle sur la PV brute ou nette ?",
    a: "L\u2019exonération de l\u2019article 150 U II 2° du CGI s\u2019applique sur la plus-value nette d\u2019IR, c\u2019est-à-dire après application des abattements pour durée de détention. Si votre PV nette d\u2019IR est inférieure ou égale à 150 000€, vous êtes totalement exonéré d\u2019IR (19%). Si elle dépasse 150 000€, seul le surplus est imposé à 19%. Attention : cette exonération ne concerne que l\u2019IR, pas les prélèvements sociaux. Les PS restent dus sur la totalité de la PV nette de PS.",
  },
  {
    q: "Dois-je nommer un représentant fiscal pour vendre depuis l\u2019étranger ?",
    a: "Si vous résidez hors UE/EEE/Suisse/UK et que le prix de vente dépasse 150 000€ ou que la plus-value est positive, oui. Le représentant fiscal accrédité vérifie le calcul de la plus-value, cosigne la déclaration 2048-IMM, et se porte garant auprès du fisc. Le coût est généralement de 0,5% à 1% du prix de vente. Si vous résidez dans l\u2019UE/EEE/Suisse/UK, vous êtes dispensé de représentant fiscal depuis 2015.",
  },
  {
    q: "Peut-on cumuler l\u2019exonération résidence principale et l\u2019exonération 150K€ ?",
    a: "Pas sur le même bien en même temps, mais vous pouvez utiliser les deux sur des biens différents. Si vous vendez votre résidence principale dans l\u2019année civile du départ, l\u2019exonération RP totale s\u2019applique (art. 150 U II 1°). Si vous vendez un autre bien plus tard (dans les 10 ans), l\u2019exonération 150K€ peut s\u2019appliquer à ce second bien. Les deux dispositifs sont indépendants.",
  },
  {
    q: "Comment déclarer la plus-value quand on vit à l\u2019étranger ?",
    a: "C\u2019est le notaire qui gère tout. Il calcule la plus-value, prélève l\u2019impôt sur le prix de vente, et verse directement au Trésor Public via la déclaration 2048-IMM. Vous n\u2019avez pas de déclaration complémentaire à faire en France. En revanche, selon la convention fiscale entre la France et votre pays de résidence, vous devrez peut-être déclarer cette plus-value dans votre pays (avec un crédit d\u2019impôt pour éviter la double imposition dans la plupart des cas).",
  },
  {
    q: "Les conventions fiscales peuvent-elles réduire l\u2019impôt français ?",
    a: "En général, non pour l\u2019immobilier. La quasi-totalité des conventions fiscales bilatérales attribuent le droit d\u2019imposer les plus-values immobilières au pays où le bien est situé (la France). La convention empêche uniquement la double imposition : votre pays de résidence doit vous accorder un crédit d\u2019impôt ou exonérer la plus-value déjà taxée en France. Il n\u2019y a pas de taux réduit négocié par convention pour les PV immobilières.",
  },
  {
    q: "Je suis parti depuis plus de 10 ans, ai-je droit à l\u2019exonération 150K€ ?",
    a: "Non. L\u2019exonération de l\u2019article 150 U II 2° exige que la cession intervienne au plus tard le 31 décembre de la 10e année suivant votre départ de France. Si vous êtes parti en 2014, la limite est le 31/12/2024. Au-delà, seuls les abattements pour durée de détention réduisent l\u2019impôt. Si vous détenez le bien depuis plus de 22 ans, l\u2019IR est de toute façon exonéré. Au-delà de 30 ans, plus aucun impôt.",
  },
];

function FAQSectionNR() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value non-résident
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_NR.map((item, i) => {
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

// ── Sources légales non-résident ──────────────────────────────────────────────
function SourcesLegalesNR() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.indigoMid }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U II 2° du CGI</span> (exonération 150 000€ pour non-résidents) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 244 bis A</span> (représentant fiscal et retenue à la source) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements durée de détention) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 164 B</span> (revenus de source française des non-résidents) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 238-0 A</span> (liste des pays non coopératifs) ·{" "}
          Prélèvements sociaux non-résidents UE : 7,5% (prélèvement de solidarité uniquement, <span style={{ fontFamily: "monospace" }}>art. L136-7 CSS</span>).
          <br />
          <strong style={{ color: C.indigoMid }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ───────────────────────────────────────────────────────
function AutresSimulateursNR() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
          { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Vous louiez en meublé ? Impact des amortissements réintégrés" },
          { href: "/plus-value-donation-succession", icon: "🎁", title: "Donation / Succession", desc: "Transmettre un bien depuis l'étranger" },
          { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "Comparaison IR vs IS par quote-part" },
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

// ── Contenu éditorial Non-Résident ───────────────────────────────────────────
function ContentNonResident() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", borderTop: "1px solid #E0DEF0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Taux d'imposition */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
          Quel impôt sur la plus-value pour un non-résident ?
        </h2>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 20, maxWidth: 760 }}>
          Les non-résidents qui vendent un bien immobilier situé en France sont soumis à l&rsquo;impôt sur la plus-value immobilière, mais avec des <strong>taux et règles spécifiques</strong> selon leur pays de résidence.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { flag: "🇪🇺", label: "Non-résident UE/EEE/Suisse/UK", ir: "19%", ps: "7,5%*", total: "26,5%*", color: "#2D8C5F", bg: "#E8F7F0", note: "* Si affilié à un régime de sécu UE/EEE. Sinon 17,2% → total 36,2%" },
            { flag: "🌍", label: "Non-résident hors UE", ir: "19%", ps: "17,2%", total: "36,2%", color: "#3F3D6E", bg: "#EEEDF5", note: "Même taux que les résidents français" },
            { flag: "⚠️", label: "Pays non coopératif", ir: "33,33%", ps: "17,2%", total: "50,5%", color: "#C0392B", bg: "#FDF0EE", note: "Liste art. 238-0 A CGI — taux majoré" },
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, borderRadius: 12, padding: "18px 16px", border: `1px solid ${item.color}20` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.flag}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.color, marginBottom: 12, lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.indigoMid, marginBottom: 4 }}>
                <span>IR :</span><strong>{item.ir}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.indigoMid, marginBottom: 4 }}>
                <span>PS :</span><strong>{item.ps}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: item.color, borderTop: "1px solid currentColor", borderTopColor: `${item.color}30`, paddingTop: 8, marginTop: 8 }}>
                <span style={{ fontWeight: 700 }}>Total :</span><strong>{item.total}</strong>
              </div>
              <div style={{ fontSize: 11, color: C.mutedLight, marginTop: 8, lineHeight: 1.4 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#EEEDF5", borderLeft: `4px solid ${C.menthe}`, borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
          <strong>💡 Le cas UE :</strong> Un expatrié français résidant en Allemagne, qui reste affilié à la sécurité sociale allemande, paie seulement <strong>26,5%</strong> (19% IR + 7,5% PS) au lieu de 36,2% pour un résident français. Une économie de 9,7 points sur la plus-value.
        </div>

        {/* Section 2 — Exonération 150K€ */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 16, marginTop: 0 }}>
          L&rsquo;exonération de 150 000 € pour les anciens résidents
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
          L&rsquo;article 150 U II 2° du CGI prévoit une <strong>exonération d&rsquo;IR</strong> pour les non-résidents qui vendent leur bien en France, sous réserve de trois conditions cumulatives :
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {[
            { num: "1", title: "Avoir été domicilié en France ≥ 2 ans", desc: "À n'importe quel moment de votre vie, vous avez résidé fiscalement en France pendant au moins 2 ans consécutifs ou non." },
            { num: "2", title: "Céder dans les 10 ans suivant le départ", desc: "La vente doit intervenir au plus tard le 31 décembre de la 10e année suivant celle du transfert de domicile hors de France." },
            { num: "3", title: "Plus-value nette ≤ 150 000 €", desc: "L'exonération s'applique à la fraction de plus-value nette (après abattements) qui ne dépasse pas 150 000 €. Au-delà, l'IR est dû sur le surplus. Cette exonération n'est utilisable qu'une seule fois." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", gap: 14 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: C.menthe, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.num}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3 — Représentant fiscal */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 16, marginTop: 0 }}>
          Le représentant fiscal : quand est-il obligatoire ?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ background: C.redBg, border: "1px solid #E8B4B0", borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 10 }}>⚠️ Obligatoire pour</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: C.indigoMid, lineHeight: 2 }}>
              <li>Non-résidents <strong>hors UE/EEE</strong> si prix de vente {">"} 150 000 €</li>
              <li>Ou si la plus-value est positive</li>
              <li>Art. 244 bis A CGI</li>
            </ul>
          </div>
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.green, marginBottom: 10 }}>✅ Non obligatoire pour</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: C.indigoMid, lineHeight: 2 }}>
              <li>Résidents <strong>UE/EEE/Suisse/UK</strong> depuis 2015</li>
              <li>Le notaire peut gérer la procédure directement</li>
            </ul>
          </div>
        </div>
        <div style={{ background: "#EEEDF5", borderRadius: 10, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: C.indigoMid, lineHeight: 1.7 }}>
          <strong>Rôle :</strong> Le représentant fiscal (société agréée par le fisc) vérifie le calcul de la plus-value, signe la déclaration 2048-IMM, et est garant auprès de l&rsquo;administration fiscale. <strong>Coût moyen :</strong> 0,5% à 1% du prix de vente.
        </div>

        {/* Section 4 — Ancienne RP */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 16, marginTop: 0 }}>
          Cas de l&rsquo;ancienne résidence principale
        </h2>
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {[
            { icon: "✅", title: "Exonération totale si vendue dans l'année du départ", desc: "Si vous vendez votre ancienne résidence principale dans l'année civile de votre départ à l'étranger, l'exonération résidence principale (art. 150 U II 1° CGI) s'applique. Le bien ne doit pas avoir été mis en location entre votre départ et la vente.", color: C.green },
            { icon: "⏰", title: "Délai dépassé : règles non-résident s'appliquent", desc: "Au-delà d'un an après votre départ, la vente est traitée comme celle de n'importe quel bien pour un non-résident. L'exonération RP ne s'applique plus. En revanche, l'exonération 150 000 € peut prendre le relais si vous remplissez les conditions.", color: C.amber },
            { icon: "💡", title: "Stratégie : combiner les deux exonérations", desc: "Si vous n'avez pas pu vendre dans l'année du départ, vérifiez votre éligibilité à l'exonération 150 000 €. Si votre PV nette est inférieure à ce plafond et que vous êtes non-résident depuis moins de 10 ans, vous pouvez être totalement exonéré d'IR.", color: C.indigo },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, borderLeft: `4px solid ${item.color}` }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function NonResidentClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        defaultSituation="non-resident-ue"
        showTypeResidence={true}
        showSituationVendeur={true}
        showNonResidentOptions={true}
        heroEyebrow="Simulateur non-résident — Taux adaptés"
        heroTitle="Plus-value immobilière pour non-résidents et expatriés"
        heroDescription="Taux de PS réduit à 7,5% pour les résidents UE/EEE, exonération jusqu'à 150 000€ pour les anciens résidents fiscaux, obligations de représentant fiscal."
        heroBadges={[
          { icon: "🌍", label: "Taux PS réduit UE/EEE" },
          { icon: "💶", label: "Exonération 150K€" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "📄", label: "Export PDF" },
        ]}
        caseBadge={{
          label: "Non-résident — taux PS adaptés",
          color: "indigo",
        }}
        lockedTypeLabel="Non-résident / Expatrié 🌍"
        customTitle="Calculez votre plus-value en tant que non-résident ou expatrié"
        customSubtitle="Le simulateur applique automatiquement le taux de PS réduit (7,5% UE/EEE), l'exonération 150 000€ pour les anciens résidents fiscaux, et les abattements pour durée de détention."
        customBadges={[
          { icon: "🌍", text: "Taux PS adaptés selon le pays de résidence" },
          { icon: "💶", text: "Exonération 150K€ calculée automatiquement" },
          { icon: "📋", text: "Obligations du représentant fiscal rappelées" },
        ]}
        customAlertBanner={<NRAlertBanner />}
        customSocialProof={<NRSocialProof />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
      />
      <ExamplesSectionNR />
      <AbattementsTableNR />
      <ContentNonResident />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionNR />
        <SourcesLegalesNR />
      </div>
      <AutresSimulateursNR />
    </>
  );
}
