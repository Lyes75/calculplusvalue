"use client";
import { useMemo } from "react";
import { C } from "@/lib/constants";
import { computePlusValue, fmt } from "@/lib/calcul-engine";

interface ExampleDef {
  title: string;
  subtitle: string;
  prixAchat: number;
  prixVente: number;
  dateAchat: Date;
  fraisAcqui: number;
  travaux: number;
  fraisCession: number;
  optimMsg?: string;
}

const examples: ExampleDef[] = [
  {
    title: "Résidence secondaire, détention 10 ans",
    subtitle: "Appartement à Lyon acheté 180 000€ en 2016, vendu 270 000€ en 2026",
    prixAchat: 180000,
    prixVente: 270000,
    dateAchat: new Date(2016, 0, 1),
    fraisAcqui: 13500,  // 7.5% forfait
    travaux: 27000,     // 15% forfait
    fraisCession: 3000,
  },
  {
    title: "Investissement locatif, détention 20 ans",
    subtitle: "Studio à Paris acheté 120 000€ en 2006, vendu 210 000€ en 2026",
    prixAchat: 120000,
    prixVente: 210000,
    dateAchat: new Date(2006, 0, 1),
    fraisAcqui: 9000,   // 7.5% forfait
    travaux: 25000,     // réels
    fraisCession: 0,
    optimMsg: "En attendant 2 ans de plus, l'IR serait totalement exonéré — économie potentielle sur l'impôt sur le revenu.",
  },
  {
    title: "Vente rapide, forte plus-value",
    subtitle: "Maison en banlieue parisienne achetée 350 000€ en 2022, vendue 480 000€ en 2026",
    prixAchat: 350000,
    prixVente: 480000,
    dateAchat: new Date(2022, 0, 1),
    fraisAcqui: 26250,  // 7.5% forfait
    travaux: 0,
    fraisCession: 0,
    optimMsg: "La surtaxe s'applique car la plus-value nette dépasse 50 000€.",
  },
];

function scrollToSimulator() {
  const el = document.querySelector("[data-simulator-form]");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ExamplesSection() {
  const results = useMemo(() => {
    return examples.map((ex) => {
      const dateVente = new Date(2026, 0, 1);
      const r = computePlusValue(
        ex.prixAchat,
        ex.prixVente,
        ex.dateAchat,
        dateVente,
        ex.fraisAcqui,
        ex.travaux,
        ex.fraisCession
      );
      return r;
    });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value immobilière
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations courantes pour comprendre l&apos;impact de la durée de détention et des frais déductibles.
      </p>

      <div className="examples-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {examples.map((ex, i) => {
          const r = results[i];
          if (!r) return null;
          return (
            <div
              key={i}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div style={{ background: C.accentBg, padding: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{ex.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{ex.subtitle}</div>
              </div>

              {/* Calcul details */}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d'achat", fmt(ex.prixAchat)],
                      ["+ Frais acquisition", fmt(ex.fraisAcqui)],
                      ["+ Travaux", fmt(ex.travaux)],
                      ...(ex.fraisCession > 0 ? [["Frais de cession", fmt(ex.fraisCession)]] : []),
                      [null],
                      ["PV brute", fmt(r.pvBrute)],
                      [`Abattement IR`, `${r.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS`, `${r.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (19%)", fmt(r.impotIR)],
                      ["PS (17,2%)", fmt(r.impotPS)],
                      ...(r.surtaxe > 0 ? [["Surtaxe", fmt(r.surtaxe)]] : []),
                    ].map((row, j) =>
                      row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: `1px solid ${C.accentBg}` }}>
                          <td style={{ padding: "5px 0", color: C.textMuted }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Résultats */}
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Impôt total</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(r.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Net vendeur</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#3BAF7A" }}>{fmt(r.netVendeur)}</div>
                  </div>
                </div>

                {/* Optim message */}
                {ex.optimMsg && (
                  <div style={{ marginTop: 12, fontSize: 13, color: C.accent, fontStyle: "italic", lineHeight: 1.5 }}>
                    💡 {ex.optimMsg}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={scrollToSimulator}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.accent,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                >
                  Simulez votre propre situation ↑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
