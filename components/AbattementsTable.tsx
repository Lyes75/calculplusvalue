"use client";
import { useState, useMemo, useEffect } from "react";
import { C } from "@/lib/constants";
import { getAbatIR, getAbatPS } from "@/lib/calcul-engine";

function getImpotColor(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function fmtNum(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

export default function AbattementsTable() {
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
    // Group 0-5
    const abatIR0 = Math.min(100, getAbatIR(0));
    const abatPS0 = Math.min(100, getAbatPS(0));
    const tauxIR0 = 19 * (1 - abatIR0 / 100);
    const tauxPS0 = 17.2 * (1 - abatPS0 / 100);
    const total0 = tauxIR0 + tauxPS0;
    data.push({ label: "0 à 5 ans", abatIR: abatIR0, abatPS: abatPS0, tauxIR: tauxIR0, tauxPS: tauxPS0, total: total0, impot100k: Math.round(100000 * total0 / 100), isYear22: false, isYear30: false });
    // Years 6-30
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

  // Synthétique table (existing one preserved as-is)
  const syntheticRows = [
    ["Moins de 6 ans", "0%", "0%", "0%", "0%"],
    ["6e à 21e année", "6% / an", "1,65% / an", "6% → 96%", "1,65% → 26,4%"],
    ["22e année", "4%", "1,60%", "100% → exonéré", "28%"],
    ["23e à 30e année", "—", "9% / an", "—", "28% → 100%"],
    ["Au-delà de 30 ans", "—", "—", "Exonéré", "Exonéré"],
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Tableau des abattements plus-value immobilière 2026
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.6, maxWidth: 720 }}>
        Les abattements pour durée de détention réduisent progressivement votre impôt. L&apos;exonération d&apos;IR est totale après 22 ans. L&apos;exonération de PS est totale après 30 ans. Voici le barème officiel et le détail année par année.
      </p>

      {/* Tableau synthétique */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
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
            {syntheticRows.map((row, i) => (
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

      {/* Toggle button */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          background: "none",
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          color: C.accent,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 16,
        }}
      >
        {showDetailed ? "Masquer le détail année par année ▲" : "Voir le détail année par année ▼"}
      </button>

      {/* Tableau détaillé */}
      <div style={{ maxHeight: showDetailed ? 2000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div className="abat-detail-wrapper" style={{ overflowX: "auto", position: "relative", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#2D2B55", color: "#E0DEF0" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Année</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. IR</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. PS</th>
                <th className="abat-hide-mobile" style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-hide-mobile" style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux total</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, paddingRight: 16 }}>Impôt / 100K€</th>
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
                    <td style={{ padding: "9px 14px", fontWeight: 600, textAlign: "left" }}>{row.label}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums", ...(row.isYear22 ? { fontWeight: 700, color: C.accent } : {}) }}>
                      {row.abatIR >= 100 ? "100% ✓" : fmtNum(row.abatIR)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtNum(row.abatPS)}
                    </td>
                    <td className="abat-hide-mobile" style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.accent }}>Exonéré</span> : fmtNum(row.tauxIR)}
                    </td>
                    <td className="abat-hide-mobile" style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtNum(row.tauxPS)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtNum(row.total)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColor(row.impot100k) }}>
                      {row.impot100k <= 0 ? "0 €" : row.impot100k.toLocaleString("fr-FR") + " €"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>Source :</strong> art. 150 VC du Code général des impôts — barèmes en vigueur au 1er janvier 2026. La colonne « Impôt pour 100K€ » illustre l&apos;imposition sur une plus-value brute de 100 000€, hors surtaxe (applicable au-delà de 50 000€ de PV nette). Votre montant réel dépend de votre prix d&apos;achat corrigé, de vos frais déductibles et de votre prix de vente — utilisez le simulateur ci-dessus pour un calcul personnalisé.
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-hide-mobile { display: none !important; }
          .abat-detail-wrapper {
            box-shadow: inset -12px 0 8px -8px rgba(0,0,0,0.08);
          }
        }
      `}</style>
    </div>
  );
}
