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

// Barème art. 669 CGI
const BAREME_669 = [
  { age: "Moins de 21 ans révolus", usufruit: 90, nuePropriete: 10 },
  { age: "De 21 à 30 ans révolus",  usufruit: 80, nuePropriete: 20 },
  { age: "De 31 à 40 ans révolus",  usufruit: 70, nuePropriete: 30 },
  { age: "De 41 à 50 ans révolus",  usufruit: 60, nuePropriete: 40 },
  { age: "De 51 à 60 ans révolus",  usufruit: 50, nuePropriete: 50 },
  { age: "De 61 à 70 ans révolus",  usufruit: 40, nuePropriete: 60 },
  { age: "De 71 à 80 ans révolus",  usufruit: 30, nuePropriete: 70 },
  { age: "De 81 à 90 ans révolus",  usufruit: 20, nuePropriete: 80 },
  { age: "Plus de 90 ans révolus",  usufruit: 10, nuePropriete: 90 },
];

// ── Bandeau d'actualité indivision ───────────────────────────────────────────
function IndivisionAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        👥 <strong>En indivision,</strong> le seuil de surtaxe (50 000€) s'apprécie par cédant. Vendre à deux au lieu d'un peut vous éviter la surtaxe — jusqu'à 6% d'impôt en moins sur la plus-value.
      </div>
    </div>
  );
}

// ── Social proof indivision ──────────────────────────────────────────────────
function IndivisionSocialProof() {
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

// ── Section "Comment calculer" en 3 étapes — adaptée indivision ──────────────
function HowItWorksIndivision() {
  const steps = [
    {
      num: "1",
      title: "Renseignez le bien et votre quote-part",
      desc: "Prix global du bien, votre pourcentage (indivision) ou l'âge de l'usufruitier (démembrement). Le simulateur calcule automatiquement votre fraction.",
    },
    {
      num: "2",
      title: "Obtenez l'impôt sur VOTRE part",
      desc: "Plus-value calculée sur votre quote-part uniquement. Le seuil de surtaxe (50 000€) s'apprécie sur votre part — pas sur la PV totale du bien.",
    },
    {
      num: "3",
      title: "Comparez et optimisez",
      desc: "Vérifiez si la vente en indivision vous évite la surtaxe. Comparez différentes répartitions. Téléchargez votre rapport PDF.",
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

// ── Exemples chiffrés indivision / démembrement ─────────────────────────────
function ExamplesSectionIndivision() {
  // Exemple 1 — Indivision 50/50, effet sur la surtaxe
  // Bien acheté 200 000€ en 2014, vendu 380 000€ en 2026 = 12 ans de détention
  // Forfait 7,5% = 15 000€, forfait travaux 15% = 30 000€ (>5 ans)
  // PV brute totale = 380 000 - 200 000 - 15 000 - 30 000 = 135 000€
  const rEx1Full = useMemo(() => computePlusValue(
    200000, 380000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    15000, 30000, 0,
    { situationVendeur: "resident" }
  ), []);
  // Quote-part 50% : prix achat 100K, vente 190K, frais 7500, travaux 15000
  const rEx1Half = useMemo(() => computePlusValue(
    100000, 190000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    7500, 15000, 0,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 2 — Démembrement parent 72 ans / enfant NP
  // Bien reçu en donation NP en 2016, parent 62 ans → NP 50% à l'époque
  // Valeur du bien à la donation : 250 000€ → valeur NP = 125 000€
  // Vente en 2026, parent 72 ans → barème art. 669 : usufruit 30%, NP 70%
  // Prix de vente total 320 000€ → part NP = 224 000€
  // Frais NP : droits réels estimés ~4000€, travaux 0
  const rEx2NP = useMemo(() => computePlusValue(
    125000, 224000, new Date(2016, 0, 1), new Date(2026, 0, 1),
    4000, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  // Part usufruitier : prix de vente 96 000€, prix acquisition de l'usufruit estimé 100 000€ (50% de 200K original)
  // Parent détient usufruit depuis longtemps (disons 2000) → 26 ans → exo IR, presque exo PS
  const rEx2US = useMemo(() => computePlusValue(
    100000, 96000, new Date(2000, 0, 1), new Date(2026, 0, 1),
    7500, 0, 0,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 3 — Indivision successorale, 3 héritiers
  // Père achète en 2000 pour 150 000€, décède en 2020, bien vaut 280 000€ au décès
  // 3 enfants héritent à 33,3%
  // Vente en 2026 pour 350 000€
  // Enfant A et B : héritiers depuis 2020 = 6 ans, quote-part 33,3%
  // Prix d'achat QP = 280 000 × 0.333 = 93 240€
  // Prix de vente QP = 350 000 × 0.333 = 116 550€
  const rEx3AB = useMemo(() => computePlusValue(
    93240, 116550, new Date(2020, 0, 1), new Date(2026, 0, 1),
    6993, 0, 0,
    { situationVendeur: "resident" }
  ), []);
  // Enfant C : a racheté la part d'un frère en 2023 pour 100 000€ → 3 ans, aucun abattement
  // Prix de vente QP = 116 550€
  const rEx3C = useMemo(() => computePlusValue(
    100000, 116550, new Date(2023, 0, 1), new Date(2026, 0, 1),
    7500, 0, 0,
    { situationVendeur: "resident" }
  ), []);

  const ex1Surtaxe = rEx1Full ? rEx1Full.surtaxe : 0;
  const ex1EconomieTotal = rEx1Full && rEx1Half ? rEx1Full.totalImpot - (rEx1Half.totalImpot * 2) : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value en indivision et démembrement
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations pour comprendre l'impact de la quote-part sur l'impôt et la surtaxe.
      </p>

      <div className="examples-indiv-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : Indivision 50/50, surtaxe ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Indivision 50/50 — Éviter la surtaxe</div>
            <div style={{ fontSize: 13, color: C.muted }}>Maison achetée 200 000€ en 2014 par un couple non marié (50/50), vendue 380 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1Full && rEx1Half && (
              <>
                <div className="indiv-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {/* Colonne propriétaire unique */}
                  <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: C.red, marginBottom: 6, textAlign: "center" }}>Propriétaire unique</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["PV brute", fmt(rEx1Full.pvBrute)],
                          [`Abat. IR (12 ans)`, `${rEx1Full.abatIRPct.toFixed(0)}%`],
                          ["PV nette IR", fmt(rEx1Full.pvNetIR)],
                          [null],
                          ["Surtaxe", fmt(rEx1Full.surtaxe)],
                          ["Impôt total", fmt(rEx1Full.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(224,86,86,0.1)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Impôt") || String(row[0]).includes("Surtaxe") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.redLight : String(row[0]).includes("Surtaxe") ? C.red : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Colonne indivision 50% */}
                  <div style={{ background: "rgba(86,203,173,0.04)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: C.green, marginBottom: 6, textAlign: "center" }}>Indivision 50%</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["PV brute (50%)", fmt(rEx1Half.pvBrute)],
                          [`Abat. IR (12 ans)`, `${rEx1Half.abatIRPct.toFixed(0)}%`],
                          ["PV nette IR", fmt(rEx1Half.pvNetIR)],
                          [null],
                          ["Surtaxe", rEx1Half.surtaxe > 0 ? fmt(rEx1Half.surtaxe) : "0 €"],
                          ["Impôt (×1)", fmt(rEx1Half.totalImpot)],
                        ].map((row, j) =>
                          row === null || row[0] === null ? (
                            <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                          ) : (
                            <tr key={j} style={{ borderBottom: "1px solid rgba(86,203,173,0.15)" }}>
                              <td style={{ padding: "3px 0", color: C.muted }}>{row[0]}</td>
                              <td style={{ padding: "3px 0", textAlign: "right", fontWeight: String(row[0]).includes("Impôt") || String(row[0]).includes("Surtaxe") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.green : String(row[0]).includes("Surtaxe") && rEx1Half.surtaxe === 0 ? C.green : undefined }}>{row[1]}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {ex1EconomieTotal > 0 && (
                  <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                    Économie grâce à l'indivision : {fmt(ex1EconomieTotal)}
                  </div>
                )}
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 4, marginBottom: 8 }}>
              💡 Grâce à l'indivision, chaque indivisaire a une PV nette de {rEx1Half ? fmt(rEx1Half.pvNetIR) : "—"}, {rEx1Half && rEx1Half.pvNetIR < 50000 ? "en dessous du seuil de surtaxe de 50 000€" : "proche du seuil"}. Un propriétaire unique aurait payé {fmt(ex1Surtaxe)} de surtaxe en plus.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Démembrement parent 72 ans / enfant NP ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Démembrement — Parent usufruitier (72 ans)</div>
            <div style={{ fontSize: 13, color: C.muted }}>Appartement donné en nue-propriété en 2016 (parent 62 ans). Vente conjointe à 320 000€ en 2026. Parent a 72 ans → barème 669 : usufruit 30%, NP 70%.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx2NP && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix de vente total", fmt(320000)],
                      ["Usufruit (30%)", fmt(96000)],
                      ["Nue-propriété (70%)", fmt(224000)],
                      [null],
                      ["— Nu-propriétaire —", ""],
                      ["Valeur NP reçue (2016)", fmt(125000)],
                      ["+ Frais réels", fmt(4000)],
                      ["PV brute NP", fmt(rEx2NP.pvBrute)],
                      [`Abat. IR (10 ans)`, `${rEx2NP.abatIRPct.toFixed(0)}%`],
                      ["Impôt NP", fmt(rEx2NP.totalImpot)],
                      [null],
                      ["— Usufruitier —", ""],
                      ["Part usufruit", fmt(96000)],
                      ["Résultat", rEx2US && rEx2US.pvBrute <= 0 ? "Moins-value → 0€" : rEx2US ? fmt(rEx2US.totalImpot) : "—"],
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: String(row[0]).startsWith("—") ? C.indigo : C.muted, fontWeight: String(row[0]).startsWith("—") ? 700 : 400, fontSize: String(row[0]).startsWith("—") ? 12 : 13 }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: String(row[0]).includes("Impôt") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.redLight : String(row[0]).includes("Moins") || String(row[0]).includes("Résultat") ? C.green : undefined }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 Le barème art. 669 attribue 70% au nu-propriétaire et 30% à l'usufruitier car le parent a 72 ans. Plus l'usufruitier est âgé, plus la part du nu-propriétaire est élevée — et donc plus sa PV potentielle est importante.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : 3 héritiers, durées différentes ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>3 héritiers — Durées de détention différentes</div>
            <div style={{ fontSize: 13, color: C.muted }}>Père achète un bien en 2000 et décède en 2020. 3 enfants héritent (33,3%). L'un rachète les parts d'un frère en 2023. Vente 350 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3AB && rEx3C && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Valeur au décès (2020)", fmt(280000)],
                      ["Prix de vente (2026)", fmt(350000)],
                      ["Quote-part chacun", "33,3%"],
                      [null],
                      ["— Enfants A et B (héritiers 2020) —", ""],
                      ["Détention", "6 ans"],
                      [`Abat. IR`, `${rEx3AB.abatIRPct.toFixed(0)}%`],
                      ["Impôt / héritier", fmt(rEx3AB.totalImpot)],
                      [null],
                      ["— Enfant C (rachat 2023) —", ""],
                      ["Détention", "3 ans"],
                      ["Abat. IR", "0% (< 6 ans)"],
                      ["Impôt", fmt(rEx3C.totalImpot)],
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                          <td style={{ padding: "5px 0", color: String(row[0]).startsWith("—") ? C.indigo : C.muted, fontWeight: String(row[0]).startsWith("—") ? 700 : 400, fontSize: String(row[0]).startsWith("—") ? 12 : 13 }}>{row[0]}</td>
                          <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: String(row[0]).includes("Impôt") ? 700 : 500, color: String(row[0]).includes("Impôt") ? C.redLight : undefined }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 12, background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 12, color: C.amber, fontWeight: 600 }}>
                  Enfant C paie {fmt(rEx3C.totalImpot)} vs {fmt(rEx3AB.totalImpot)} pour A et B — pas d'abattement sur la part rachetée
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              💡 En indivision, chaque indivisaire peut avoir une durée de détention différente. L'enfant C qui a racheté les parts en 2023 n'a que 3 ans de détention — aucun abattement ne s'applique. Les enfants A et B bénéficient de 6 ans (début des abattements).
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-indiv-grid { grid-template-columns: 1fr !important; }
          .indiv-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements — adapté indivision/démembrement ─────────────────

function fmtPctI(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function getImpotColorI(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function AbattementsTableIndivision() {
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
        Abattements par durée de détention — Calcul par quote-part
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les abattements pour durée de détention s'appliquent identiquement à chaque indivisaire ou à chaque titulaire de droit (usufruitier, nu-propriétaire). La durée est propre à chaque cédant — elle peut différer si les parts ont été acquises à des dates différentes. Le seuil de surtaxe (50 000€ de PV nette IR) s'apprécie par cédant.
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

      {/* Note indivision + démembrement */}
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.18)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6, marginBottom: 16 }}>
        👥 <strong>En indivision :</strong> le seuil de surtaxe de 50 000€ s'apprécie sur la quote-part de PV nette de CHAQUE indivisaire. Vendre à 2 indivisaires à 50% peut faire passer chaque part sous le seuil et supprimer la surtaxe.
        <br />
        ⚖️ <strong>En démembrement :</strong> le barème art. 669 CGI détermine quelle fraction du prix de vente revient à l'usufruitier et au nu-propriétaire. Chacun calcule ensuite sa PV et ses abattements indépendamment.
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
                <th className="abat-indiv-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-indiv-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
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
                      {row.abatIR >= 100 ? "100% ✓" : fmtPctI(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtPctI(row.abatPS)}
                    </td>
                    <td className="abat-indiv-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exonéré</span> : fmtPctI(row.tauxIR)}
                    </td>
                    <td className="abat-indiv-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctI(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctI(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorI(row.impot100k) }}>
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
          <strong>Source :</strong> art. 150 VC du CGI (abattements) &middot; art. 669 (barème fiscal du démembrement) &middot; art. 150 U II (exonérations) &middot; art. 1609 nonies G (surtaxe appréciée par cédant).
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-indiv-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Contenu éditorial existant (réorganisé) ─────────────────────────────────
function ContentIndivision() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* H2 : Indivision — calcul par quote-part */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Plus-value en indivision : la quote-part de chaque indivisaire
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Lorsqu'un bien immobilier est détenu en indivision (par plusieurs personnes, chacune propriétaire d'une quote-part), la plus-value n'est pas calculée globalement sur le bien : chaque indivisaire est imposé personnellement sur sa fraction de plus-value. Cette règle a une conséquence essentielle : la surtaxe progressive (applicable au-delà de 50 000 € de plus-value nette) s'apprécie par indivisaire, pas sur le total.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Imposition personnelle", desc: "Chaque indivisaire est imposé sur sa quote-part de plus-value. Les abattements pour durée de détention s'appliquent de la même façon.", ok: true },
              { icon: "✅", title: "Surtaxe par indivisaire", desc: "Le seuil de 50 000 € de surtaxe s'apprécie par cédant. Un bien avec 200 000 € de PV vendu à 2 indivisaires à 50/50 : chacun a 100 000 € de PV nette IR.", ok: true },
              { icon: "✅", title: "Abattements identiques", desc: "Les abattements pour durée de détention sont les mêmes qu'en pleine propriété. La durée court depuis l'acquisition par le cédant.", ok: true },
              { icon: "⚠️", title: "Durée propre à chaque indivisaire", desc: "Si les indivisaires ont acquis leur quote-part à des dates différentes (ex : succession), la durée de détention peut différer selon les parts.", ok: true },
            ].map((item, i) => (
              <div key={i} style={{ background: item.ok ? C.greenBg : C.redBg, border: `1px solid ${item.ok ? C.greenBorder : "#E8B4B0"}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* H2 : Démembrement */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Plus-value en cas de démembrement de propriété
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Lorsqu'un bien est démembré, l'usufruit et la nue-propriété appartiennent à des personnes différentes. En cas de cession du bien en pleine propriété (reconstitution préalable ou cession conjointe), la plus-value est répartie entre usufruitier et nu-propriétaire selon le <strong>barème de l'article 669 du CGI</strong>, en fonction de l'âge de l'usufruitier à la date de la cession.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Si l'usufruitier et le nu-propriétaire vendent le bien ensemble, le prix est réparti selon le barème art. 669 CGI. Chacun calcule sa propre plus-value sur sa fraction.",
                "La réunion de l'usufruit et de la nue-propriété lors du décès de l'usufruitier n'est pas une cession : aucune plus-value n'est imposée au nu-propriétaire à ce moment.",
                "Si seul le nu-propriétaire cède sa nue-propriété, la plus-value est calculée sur la valeur de la nue-propriété à la date de cession et le prix de revient de la nue-propriété (valeur lors de son acquisition).",
                "La durée de détention court depuis la date d'acquisition de chaque droit (usufruit ou nue-propriété) par le cédant.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* H2 : Barème art. 669 CGI */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Barème art. 669 CGI — Valeur de l'usufruit selon l'âge
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Ce barème fiscal légal s'applique à toutes les transmissions à titre gratuit (donations, successions) ainsi qu'aux cessions de biens démembrés. Il détermine la répartition entre usufruit et nue-propriété en fonction de l'âge de l'usufruitier à la date de l'acte.
          </p>
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.07)" }}>
              <thead>
                <tr style={{ background: C.indigo, color: "#FFFFFF" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700 }}>Âge de l'usufruitier</th>
                  <th style={{ padding: "11px 16px", textAlign: "center", fontWeight: 700, color: "#56CBAD" }}>Valeur usufruit</th>
                  <th style={{ padding: "11px 16px", textAlign: "center", fontWeight: 700, color: "#9B97C4" }}>Valeur nue-propriété</th>
                </tr>
              </thead>
              <tbody>
                {BAREME_669.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 16px", color: C.muted }}>{row.age}</td>
                    <td style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: C.green }}>{row.usufruit}%</td>
                    <td style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: C.indigoMid }}>{row.nuePropriete}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
            💡 <strong>Remarque :</strong> Ce barème s'applique aux droits viagers (usufruit dont la durée dépend de la vie d'une personne). Un usufruit temporaire (ex : 10 ans) est évalué à 23% par période de 10 ans, avec un maximum de 23% × nombre de périodes.
          </div>
        </section>

        {/* H2 : Cas pratiques */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Cas pratiques : indivision successorale et donation avec réserve d'usufruit
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              {
                title: "👨‍👩‍👦 Indivision successorale",
                points: [
                  "Lors d'une succession, les héritiers reçoivent le bien en indivision si aucun partage n'est effectué.",
                  "La valeur du bien à la date du décès est le prix d'acquisition pour les indivisaires héritiers.",
                  "Chaque héritier est imposé sur sa quote-part de plus-value (PV = prix de vente × quote-part − valeur décès × quote-part).",
                  "La durée de détention court depuis la date du décès, pas depuis l'achat initial par le défunt.",
                ],
              },
              {
                title: "🏠 Donation avec réserve d'usufruit",
                points: [
                  "Les parents donnent la nue-propriété à leurs enfants en conservant l'usufruit (ils restent usufruitiers).",
                  "Si le bien est vendu avant le décès des parents, le prix est réparti selon le barème art. 669 CGI.",
                  "Le nu-propriétaire calcule sa PV depuis la date de la donation, sur la valeur de la nue-propriété reçue.",
                  "L'usufruitier calcule sa PV depuis la date de la donation ou d'acquisition originelle de l'usufruit.",
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

          <div style={{ background: C.redBg, border: `1px solid #E8B4B0`, borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 8 }}>⚠️ Attention : cas complexes à soumettre à un notaire</div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                "Si le bien a été acquis en partie avant et en partie après le démembrement, le calcul est fractionné.",
                "En cas de donation-partage, des règles spécifiques s'appliquent sur la base de calcul de la plus-value.",
                "La soulte versée lors d'un partage d'indivision peut générer une plus-value imposable pour le bénéficiaire.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── FAQ spécifique indivision / démembrement ─────────────────────────────────
const FAQ_ITEMS_INDIVISION = [
  {
    q: "La surtaxe sur les PV > 50 000€ s'applique-t-elle sur la PV totale du bien ou sur ma quote-part ?",
    a: "Sur votre quote-part uniquement. Le seuil de 50 000€ s'apprécie par cédant (art. 1609 nonies G du CGI). Si le bien génère une PV totale de 90 000€ et que vous détenez 50%, votre PV nette est de 45 000€ — en dessous du seuil, pas de surtaxe. Un propriétaire unique aurait payé la surtaxe sur les 90 000€. C'est l'un des avantages fiscaux de l'indivision pour les biens à forte plus-value.",
  },
  {
    q: "En démembrement, qui paie l'impôt sur la plus-value : l'usufruitier ou le nu-propriétaire ?",
    a: "Les deux. Si le bien est vendu en pleine propriété (vente conjointe usufruit + nue-propriété), le prix de vente est réparti entre l'usufruitier et le nu-propriétaire selon le barème de l'article 669 du CGI, en fonction de l'âge de l'usufruitier au jour de la cession. Chacun calcule sa propre plus-value sur sa fraction et paie son propre impôt. Si seul le nu-propriétaire vend sa nue-propriété (sans l'usufruit), il est seul imposé sur la plus-value de la nue-propriété.",
  },
  {
    q: "Que se passe-t-il quand l'usufruitier décède ? Le nu-propriétaire paie-t-il une plus-value ?",
    a: "Non. La réunion de l'usufruit et de la nue-propriété au décès de l'usufruitier n'est pas une cession — elle ne génère aucune plus-value imposable pour le nu-propriétaire. Celui-ci récupère la pleine propriété en franchise d'impôt. C'est tout l'intérêt patrimonial de la donation avec réserve d'usufruit : les parents donnent la nue-propriété, conservent les revenus (usufruit), et au décès, les enfants récupèrent la pleine propriété sans droits de succession ni plus-value.",
  },
  {
    q: "Un indivisaire peut-il avoir une durée de détention différente des autres ?",
    a: "Oui. Chaque indivisaire calcule sa durée de détention depuis la date d'acquisition de SA quote-part. Cas classique : trois héritiers reçoivent un bien en 2018 par succession. L'un d'eux rachète les parts d'un autre en 2023. En 2026, les deux héritiers d'origine ont 8 ans de détention (abattements), mais celui qui a racheté n'a que 3 ans sur la part rachetée (aucun abattement). Le calcul se fait par fraction.",
  },
  {
    q: "Lors d'un partage d'indivision (rachat de parts), y a-t-il une plus-value à payer ?",
    a: "En principe, le partage pur et simple (un indivisaire reçoit sa quote-part du bien) n'est pas une cession et ne génère pas de plus-value. En revanche, si un indivisaire reçoit plus que sa quote-part (avec versement d'une soulte aux autres), la soulte reçue par les indivisaires qui cèdent leur part peut générer une plus-value imposable. La soulte est traitée comme un prix de vente. Un droit de partage de 2,5% est également dû sur la valeur nette de l'actif partagé.",
  },
  {
    q: "Comment choisir entre vendre le bien ou sortir de l'indivision par rachat de parts ?",
    a: "Fiscalement, la vente du bien entier à un tiers génère une plus-value immobilière (IR 19% + PS 17,2% − abattements). Le rachat de parts par un indivisaire génère un droit de partage de 2,5% sur la valeur nette du bien (pas de plus-value pour le racheteur, mais plus-value possible pour le vendeur de parts via la soulte). Sur un bien avec forte PV et longue détention, la vente au tiers avec abattements peut être plus avantageuse. Sur un bien avec faible PV, le rachat de parts avec le droit de partage de 2,5% est souvent moins cher. Simulez les deux scénarios.",
  },
  {
    q: "En indivision successorale, le forfait 7,5% s'applique-t-il ?",
    a: "Non. En indivision successorale, le bien a été transmis par succession — c'est une acquisition à titre gratuit. Le forfait 7,5% n'est pas applicable (il est réservé aux acquisitions à titre onéreux). Seuls les frais réellement payés (droits de succession, frais de notaire) sont déductibles, au prorata de la quote-part de chaque héritier. Le forfait 15% travaux reste applicable si la détention dépasse 5 ans. Consultez notre simulateur donation/succession pour les détails.",
  },
];

function FAQSectionIndivision() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value en indivision et démembrement
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_INDIVISION.map((item, i) => {
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

// ── Sources légales indivision / démembrement ────────────────────────────────
function SourcesLegalesIndivision() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.indigoMid }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U à 150 VH du CGI</span> (régime des plus-values immobilières) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements durée de détention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 669</span> (barème fiscal du démembrement — valeur usufruit/nue-propriété) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 1609 nonies G</span> (surtaxe appréciée par cédant) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 746 et 747</span> (droits de partage 2,5%) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>BOI-RFPI-PVI-10-40-10</span> (plus-value en cas de démembrement).
          <br />
          <strong style={{ color: C.indigoMid }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ──────────────────────────────────────────────────────
function AutresSimulateursIndivision() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
          { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "SCI à l'IR ou à l'IS" },
          { href: "/plus-value-donation-succession", icon: "🎁", title: "Donation / Succession", desc: "Valeur d'acquisition et droits" },
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
export default function IndivisionClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        showTypeResidence={true}
        showDemembrement={true}
        heroEyebrow="Simulateur indivision & démembrement"
        heroTitle="Plus-value en indivision ou en démembrement"
        heroDescription="Le seuil de surtaxe s'apprécie par quote-part en indivision. En démembrement, le barème fiscal de l'art. 669 CGI détermine la répartition entre nu-propriétaire et usufruitier. Le simulateur calcule l'impôt sur votre quote-part."
        heroBadges={[
          { icon: "👥", label: "Surtaxe calculée par indivisaire" },
          { icon: "⚖️", label: "Barème art. 669 CGI intégré" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "📄", label: "Export PDF inclus" },
        ]}
        lockedTypeLabel="Indivision ou Démembrement ⚖️"
        customTitle="Calculez la plus-value sur votre quote-part"
        customSubtitle="Renseignez les informations du bien et votre quote-part. Le simulateur calcule l'impôt sur VOTRE fraction de plus-value, avec les abattements selon votre durée de détention personnelle."
        customBadges={[
          { icon: "👥", text: "Calcul par quote-part d'indivisaire" },
          { icon: "⚖️", text: "Répartition démembrement selon barème art. 669" },
          { icon: "📅", text: "Durée de détention propre à chaque cédant" },
        ]}
        customAlertBanner={<IndivisionAlertBanner />}
        customSocialProof={<IndivisionSocialProof />}
        customHowItWorks={<HowItWorksIndivision />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
        caseBadge={{ label: "Indivision & Démembrement — calcul par fraction", color: "#2D2B55" }}
      />
      <ExamplesSectionIndivision />
      <AbattementsTableIndivision />
      <ContentIndivision />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionIndivision />
        <SourcesLegalesIndivision />
      </div>
      <AutresSimulateursIndivision />
    </>
  );
}
