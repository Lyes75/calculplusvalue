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

// ── Bandeau d'actualité donation/succession ──────────────────────────────────
function DonationAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        🎁 <strong>Rappel :</strong> pour un bien h&eacute;rit&eacute; ou donn&eacute;, le forfait 7,5% de frais d&rsquo;acquisition ne s&rsquo;applique pas. Seuls les droits de mutation r&eacute;ellement pay&eacute;s par l&rsquo;h&eacute;ritier/donataire sont d&eacute;ductibles.
      </div>
    </div>
  );
}

// ── Social proof donation ────────────────────────────────────────────────────
function DonationSocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { emoji: "🎁", before: "Valeur d\u00e9clar\u00e9e dans l\u2019acte = ", bold: "prix d\u2019acquisition", after: "" },
          { emoji: "✅", before: "Bar\u00e8mes CGI au ", bold: "1er janvier 2026", after: "" },
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

// ── Section "Comment calculer" en 3 étapes — adaptée donation ────────────────
function HowItWorksDonation() {
  const steps = [
    {
      num: "1",
      title: "Renseignez la transmission",
      desc: "Valeur d\u00e9clar\u00e9e dans l\u2019acte de donation ou la d\u00e9claration de succession, date du d\u00e9c\u00e8s ou de la donation, droits de mutation r\u00e9ellement pay\u00e9s. Le forfait 7,5% ne s\u2019applique pas.",
    },
    {
      num: "2",
      title: "Obtenez le d\u00e9tail de l\u2019imp\u00f4t",
      desc: "Plus-value calcul\u00e9e sur la base de la valeur d\u00e9clar\u00e9e. Abattements \u00e0 partir de la date de transmission (pas la date d\u2019achat initial par le donateur). Surtaxe si applicable.",
    },
    {
      num: "3",
      title: "Comparez et optimisez",
      desc: "\u00c9valuez l\u2019impact d\u2019une valeur d\u00e9clar\u00e9e plus ou moins \u00e9lev\u00e9e. V\u00e9rifiez si l\u2019attente de quelques ann\u00e9es r\u00e9duit significativement l\u2019imp\u00f4t. T\u00e9l\u00e9chargez votre rapport PDF.",
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

// ── Exemples chiffrés donation/succession ────────────────────────────────────
function ExamplesSectionDonation() {
  // Exemple 1 — Bien hérité, détention 8 ans
  const rEx1 = useMemo(() => computePlusValue(
    170000, 245000, new Date(2018, 0, 1), new Date(2026, 0, 1),
    12000, 25500, 2000,
    { situationVendeur: "resident" }
  ), []);

  // Calcul sans déductions (droits + forfait travaux) pour comparaison
  const rEx1SansDeductions = useMemo(() => computePlusValue(
    170000, 245000, new Date(2018, 0, 1), new Date(2026, 0, 1),
    0, 0, 2000,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 2 — Donation récente, vente rapide (3 ans)
  const rEx2 = useMemo(() => computePlusValue(
    280000, 320000, new Date(2023, 0, 1), new Date(2026, 0, 1),
    5000, 0, 3000,
    { situationVendeur: "resident" }
  ), []);

  // Exemple 3 — Comparaison valeur déclarée 180K vs 220K
  const rEx3Low = useMemo(() => computePlusValue(
    180000, 300000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    10000, 27000, 0,
    { situationVendeur: "resident" }
  ), []);
  const rEx3High = useMemo(() => computePlusValue(
    220000, 300000, new Date(2014, 0, 1), new Date(2026, 0, 1),
    14000, 33000, 0,
    { situationVendeur: "resident" }
  ), []);

  const ex3Diff = rEx3Low && rEx3High ? rEx3Low.totalImpot - rEx3High.totalImpot : 0;
  const droitsSupp = 14000 - 10000; // 4000€ de droits supplémentaires
  const gainNet = ex3Diff - droitsSupp;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value apr\u00e8s donation ou succession
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations courantes pour comprendre l&rsquo;impact de la valeur d&eacute;clar&eacute;e, des frais r&eacute;els et de la dur&eacute;e de d&eacute;tention depuis la transmission.
      </p>

      <div className="examples-donation-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : Bien hérité 8 ans ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Appartement h\u00e9rit\u00e9 — succession il y a 8 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Appartement \u00e0 Toulouse h\u00e9rit\u00e9 en 2018, valeur d\u00e9clar\u00e9e 170 000\u20ac, droits de succession pay\u00e9s 12 000\u20ac. Vendu 245 000\u20ac en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1 && rEx1SansDeductions && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Valeur d\u00e9clar\u00e9e (succession)", fmt(170000)],
                      ["+ Droits de succession", fmt(12000)],
                      ["+ Forfait travaux 15%", fmt(25500)],
                      ["= Prix d\u2019achat corrig\u00e9", fmt(170000 + 12000 + 25500)],
                      [null],
                      ["PV brute", fmt(rEx1.pvBrute)],
                      [`Abattement IR (8 ans)`, `${rEx1.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS (8 ans)`, `${rEx1.abatPSPct.toFixed(1)}%`],
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
              {rEx1 && rEx1SansDeductions && (
                <>
                  \ud83d\udca1 Les droits de succession de 12 000\u20ac sont int\u00e9gralement d\u00e9ductibles car pay\u00e9s par l&rsquo;h\u00e9ritier. Le forfait travaux de 15% (25 500\u20ac) r\u00e9duit significativement la PV brute. Sans ces d\u00e9ductions, l&rsquo;imp\u00f4t serait de {fmt(rEx1SansDeductions.totalImpot)} au lieu de {fmt(rEx1.totalImpot)}.
                </>
              )}
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : Donation récente, vente rapide ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Maison re\u00e7ue en donation — vente apr\u00e8s 3 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Maison re\u00e7ue en donation en 2023, valeur d\u00e9clar\u00e9e 280 000\u20ac, droits de donation pay\u00e9s par le donataire 5 000\u20ac. Vendue 320 000\u20ac en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx2 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Valeur d\u00e9clar\u00e9e (donation)", fmt(280000)],
                      ["+ Droits de donation", fmt(5000)],
                      ["+ Forfait travaux 15%", "Non applicable (< 5 ans)"],
                      ["= Prix d\u2019achat corrig\u00e9", fmt(280000 + 5000)],
                      [null],
                      ["PV brute", fmt(rEx2.pvBrute)],
                      [`Abattement IR (3 ans)`, `${rEx2.abatIRPct.toFixed(0)}%`],
                      [`Abattement PS (3 ans)`, `${rEx2.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (19%)", fmt(rEx2.impotIR)],
                      ["PS (17,2%)", fmt(rEx2.impotPS)],
                      ...(rEx2.surtaxe > 0 ? [["Surtaxe", fmt(rEx2.surtaxe)]] : []),
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
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.redLight }}>{fmt(rEx2.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Net vendeur</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{fmt(rEx2.netVendeur)}</div>
                  </div>
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginTop: 12, marginBottom: 8 }}>
              \ud83d\udca1 Attention : avec seulement 3 ans de d\u00e9tention, aucun abattement ne s&rsquo;applique (les abattements commencent \u00e0 la 6e ann\u00e9e). Le forfait travaux 15% n&rsquo;est pas applicable non plus (r\u00e9serv\u00e9 aux d\u00e9tentions {"> "}5 ans). L&rsquo;int\u00e9gralit\u00e9 de la PV est tax\u00e9e \u00e0 36,2%. Si la vente peut attendre 2 ans de plus, le forfait travaux deviendra applicable et les abattements commenceront \u00e0 s&rsquo;appliquer.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Comparaison valeur déclarée ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>M\u00eame bien, deux valeurs d\u00e9clar\u00e9es — l&rsquo;impact fiscal</div>
            <div style={{ fontSize: 13, color: C.muted }}>Appartement h\u00e9rit\u00e9 il y a 12 ans, vendu 300 000\u20ac en 2026. Comparaison entre une valeur d\u00e9clar\u00e9e \u00e0 180 000\u20ac et 220 000\u20ac.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx3Low && rEx3High && (
              <>
                <div className="donation-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {/* Colonne 180K */}
                  <div style={{ background: "rgba(224,86,86,0.03)", border: "1px solid rgba(224,86,86,0.15)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.red, marginBottom: 8, textAlign: "center" }}>Valeur d\u00e9clar\u00e9e 180 000\u20ac</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Frais r\u00e9els", fmt(10000)],
                          ["Forfait travaux 15%", fmt(27000)],
                          ["Prix corrig\u00e9", fmt(180000 + 10000 + 27000)],
                          [null],
                          ["PV brute", fmt(rEx3Low.pvBrute)],
                          [`Abat. IR (12 ans)`, `${rEx3Low.abatIRPct.toFixed(0)}%`],
                          [`Abat. PS (12 ans)`, `${rEx3Low.abatPSPct.toFixed(1)}%`],
                          [null],
                          ["Imp\u00f4t total", fmt(rEx3Low.totalImpot)],
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
                  {/* Colonne 220K */}
                  <div style={{ background: "rgba(86,203,173,0.04)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.green, marginBottom: 8, textAlign: "center" }}>Valeur d\u00e9clar\u00e9e 220 000\u20ac</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <tbody>
                        {[
                          ["Frais r\u00e9els", fmt(14000)],
                          ["Forfait travaux 15%", fmt(33000)],
                          ["Prix corrig\u00e9", fmt(220000 + 14000 + 33000)],
                          [null],
                          ["PV brute", fmt(rEx3High.pvBrute)],
                          [`Abat. IR (12 ans)`, `${rEx3High.abatIRPct.toFixed(0)}%`],
                          [`Abat. PS (12 ans)`, `${rEx3High.abatPSPct.toFixed(1)}%`],
                          [null],
                          ["Imp\u00f4t total", fmt(rEx3High.totalImpot)],
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
                <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#3BAF7A", marginBottom: 8 }}>
                  \u00c9conomie : {fmt(ex3Diff)} d&rsquo;imp\u00f4t en moins
                </div>
              </>
            )}
            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
              \ud83d\udca1 Une valeur d\u00e9clar\u00e9e plus \u00e9lev\u00e9e dans l&rsquo;acte de succession augmente les droits de mutation, mais r\u00e9duit m\u00e9caniquement la plus-value imposable \u00e0 la revente. Dans cet exemple, 40 000\u20ac de valeur d\u00e9clar\u00e9e en plus g\u00e9n\u00e8rent {fmt(droitsSupp)} de droits suppl\u00e9mentaires mais \u00e9conomisent {fmt(ex3Diff)} de PV — soit un gain net de {fmt(gainNet)}. C&rsquo;est pourquoi il est crucial de d\u00e9clarer une valeur fid\u00e8le au march\u00e9.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation \u2191
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-donation-grid { grid-template-columns: 1fr !important; }
          .donation-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements — adapté donation/succession ─────────────────────

function fmtPctD(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function getImpotColorD(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function AbattementsTableDonation() {
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
        Abattements par dur\u00e9e de d\u00e9tention — \u00c0 partir de la date de transmission
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        En cas de donation ou succession, la dur\u00e9e de d\u00e9tention court \u00e0 partir de la date de la donation ou du d\u00e9c\u00e8s — pas de la date d&rsquo;achat initial par le donateur ou le d\u00e9funt. Les abattements recommencent donc \u00e0 z\u00e9ro. Le tableau ci-dessous montre l&rsquo;imp\u00f4t effectif en fonction du nombre d&rsquo;ann\u00e9es \u00e9coul\u00e9es depuis la transmission.
      </p>

      {/* Tableau synthétique */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead>
            <tr style={{ background: C.indigo, color: "#E0DEF0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Dur\u00e9e depuis la transmission</th>
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

      {/* Note rappel durée */}
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.18)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6, marginBottom: 16 }}>
        \ud83d\udcc5 <strong>Rappel :</strong> si le d\u00e9funt avait achet\u00e9 le bien il y a 25 ans et que le d\u00e9c\u00e8s a eu lieu il y a 3 ans, la dur\u00e9e de d\u00e9tention pour le calcul de la PV est de 3 ans (pas 25 ans). Les abattements repartent de z\u00e9ro au jour de la transmission. <em>Exception : en donation avec r\u00e9serve d&rsquo;usufruit, le d\u00e9lai court depuis la date de la donation initiale (pas la r\u00e9union de l&rsquo;usufruit).</em>
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
                <th className="abat-don-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-don-hide" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
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
                      {row.abatIR >= 100 ? "100% \u2713" : fmtPctD(row.abatIR)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% \u2713" : fmtPctD(row.abatPS)}
                    </td>
                    <td className="abat-don-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.menthe }}>Exon\u00e9r\u00e9</span> : fmtPctD(row.tauxIR)}
                    </td>
                    <td className="abat-don-hide" style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exon\u00e9r\u00e9</span> : fmtPctD(row.tauxPS)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exon\u00e9r\u00e9</span> : fmtPctD(row.total)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorD(row.impot100k) }}>
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
          <strong>Source :</strong> art. 150 VC du CGI (abattements) &middot; art. 150 VB (prix d&rsquo;acquisition en cas de transmission \u00e0 titre gratuit). La dur\u00e9e de d\u00e9tention court \u00e0 partir de la date du d\u00e9c\u00e8s (succession) ou de l&rsquo;acte de donation (donation), conform\u00e9ment \u00e0 l&rsquo;art. 150 VC II du CGI.
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-don-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── FAQ spécifique donation/succession ────────────────────────────────────────
const FAQ_ITEMS_DONATION = [
  {
    q: "Peut-on utiliser le forfait de 7,5% pour les frais d\u2019acquisition d\u2019un bien h\u00e9rit\u00e9 ?",
    a: "Non. Le forfait de 7,5% est r\u00e9serv\u00e9 aux acquisitions \u00e0 titre on\u00e9reux (achat). Pour un bien re\u00e7u par donation ou succession, seuls les frais r\u00e9ellement engag\u00e9s et pay\u00e9s par le vendeur (h\u00e9ritier ou donataire) sont d\u00e9ductibles. Il s\u2019agit principalement des droits de mutation \u00e0 titre gratuit (droits de succession ou de donation) et des frais de notaire li\u00e9s \u00e0 l\u2019acte. Si le donateur a pris les droits \u00e0 sa charge, le donataire ne peut pas les d\u00e9duire.",
  },
  {
    q: "La dur\u00e9e de d\u00e9tention repart-elle \u00e0 z\u00e9ro apr\u00e8s une donation ?",
    a: "Oui. En cas de donation, la dur\u00e9e de d\u00e9tention pour le calcul des abattements court \u00e0 partir de la date de l\u2019acte notari\u00e9 de donation, pas de la date d\u2019acquisition initiale par le donateur. Si votre parent avait achet\u00e9 le bien il y a 30 ans et vous l\u2019a donn\u00e9 il y a 2 ans, votre dur\u00e9e de d\u00e9tention est de 2 ans et vous n\u2019avez aucun abattement. Exception notable : en donation avec r\u00e9serve d\u2019usufruit, le d\u00e9lai court depuis la date de la donation initiale de la nue-propri\u00e9t\u00e9, ce qui est beaucoup plus favorable.",
  },
  {
    q: "Quelle diff\u00e9rence entre la valeur d\u00e9clar\u00e9e basse et une valeur juste ?",
    a: "Une valeur d\u00e9clar\u00e9e basse r\u00e9duit les droits de mutation au moment de la succession ou donation, mais augmente la plus-value imposable lors de la revente. Inversement, une valeur d\u00e9clar\u00e9e fid\u00e8le au march\u00e9 augmente les droits de mutation mais r\u00e9duit la PV \u00e0 la revente. Dans la plupart des cas, le gain sur la PV est sup\u00e9rieur au surco\u00fbt en droits de mutation, car la PV est tax\u00e9e \u00e0 36,2% (sans abattement \u00e0 court terme) tandis que les droits b\u00e9n\u00e9ficient d\u2019abattements sp\u00e9cifiques (100 000\u20ac par enfant en ligne directe). De plus, le fisc peut contester une valeur manifestement sous-\u00e9valu\u00e9e et proc\u00e9der \u00e0 un rehaussement.",
  },
  {
    q: "Un bien h\u00e9rit\u00e9 en indivision : comment calculer la PV ?",
    a: "En cas de succession avec plusieurs h\u00e9ritiers, le bien est en indivision. Chaque h\u00e9ritier est impos\u00e9 sur sa quote-part de plus-value. Le seuil de surtaxe (50 000\u20ac de PV nette) s\u2019appr\u00e9cie par h\u00e9ritier, pas sur la totalit\u00e9. Si la PV totale est de 80 000\u20ac et que vous \u00eates 2 h\u00e9ritiers \u00e0 50%, votre quote-part est de 40 000\u20ac \u2014 en dessous du seuil de surtaxe. Utilisez notre simulateur indivision pour le calcul par quote-part.",
  },
  {
    q: "La r\u00e9sidence principale du d\u00e9funt est-elle exon\u00e9r\u00e9e de plus-value ?",
    a: "Pas automatiquement. L\u2019exon\u00e9ration r\u00e9sidence principale b\u00e9n\u00e9ficie au vendeur, pas au d\u00e9funt. Si le bien \u00e9tait la r\u00e9sidence principale du d\u00e9funt mais pas la v\u00f4tre, l\u2019exon\u00e9ration ne s\u2019applique pas. En revanche, si vous avez occup\u00e9 le bien comme votre propre r\u00e9sidence principale apr\u00e8s la succession et jusqu\u2019au jour de la vente, l\u2019exon\u00e9ration peut s\u2019appliquer. Le point cl\u00e9 est que le bien doit \u00eatre VOTRE r\u00e9sidence principale au jour de la cession, pas celle du d\u00e9funt.",
  },
  {
    q: "Donation-partage ou donation simple : quelles cons\u00e9quences sur la PV ?",
    a: "Fiscalement, le calcul de la PV est identique dans les deux cas : la valeur d\u2019acquisition est celle d\u00e9clar\u00e9e dans l\u2019acte, et la dur\u00e9e de d\u00e9tention court \u00e0 partir de la date de la donation. La diff\u00e9rence est juridique : la donation-partage a un effet de partage qui \u201cfige\u201d les valeurs, tandis que la donation simple peut \u00eatre rapport\u00e9e \u00e0 la succession (les valeurs sont alors r\u00e9\u00e9valu\u00e9es au jour du d\u00e9c\u00e8s). Pour la PV, c\u2019est toujours la valeur figurant dans l\u2019acte de donation qui sert de base de calcul, quelle que soit la forme de donation.",
  },
  {
    q: "Faut-il d\u00e9clarer la plus-value si le bien est vendu moins cher que la valeur d\u00e9clar\u00e9e ?",
    a: "Non. Si le prix de vente est inf\u00e9rieur \u00e0 la valeur d\u00e9clar\u00e9e dans l\u2019acte de succession ou de donation (major\u00e9e des frais d\u00e9ductibles), la plus-value est n\u00e9gative \u2014 il y a une moins-value. Aucun imp\u00f4t n\u2019est d\u00fb. En revanche, cette moins-value n\u2019est pas imputable sur d\u2019autres plus-values immobili\u00e8res ni sur votre revenu global. Elle est tout simplement perdue. C\u2019est un cas fr\u00e9quent quand le bien a \u00e9t\u00e9 sur\u00e9valu\u00e9 dans l\u2019acte ou quand le march\u00e9 a baiss\u00e9 depuis la transmission.",
  },
];

function FAQSectionDonation() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 20, marginTop: 0 }}>
        Questions fr\u00e9quentes — Plus-value apr\u00e8s donation ou succession
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_DONATION.map((item, i) => {
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

// ── Sources légales donation/succession ──────────────────────────────────────
function SourcesLegalesDonation() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <strong style={{ color: C.indigoMid }}>Sources l\u00e9gales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VB du CGI</span> (prix d&rsquo;acquisition en cas de transmission \u00e0 titre gratuit) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements pour dur\u00e9e de d\u00e9tention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC II</span> (point de d\u00e9part de la dur\u00e9e de d\u00e9tention) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 776 A</span> (donation-partage) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 764 bis</span> (\u00e9valuation des biens en succession) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>art. 1609 nonies G</span> (surtaxe sur les PV \u00e9lev\u00e9es) &middot;{" "}
          <span style={{ fontFamily: "monospace" }}>BOI-RFPI-PVI-20-10-20</span> (prix d&rsquo;acquisition en cas de donation ou succession).
          <br />
          <strong style={{ color: C.indigoMid }}>Derni\u00e8re mise \u00e0 jour des bar\u00e8mes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs ──────────────────────────────────────────────────────
function AutresSimulateursDonation() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>\ud83d\udd17 Simulateurs sp\u00e9cialis\u00e9s sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "\ud83c\udfe0", title: "Simulateur g\u00e9n\u00e9ral", desc: "R\u00e9sidence secondaire, locatif, terrain" },
          { href: "/plus-value-indivision", icon: "\ud83d\udc65", title: "Indivision & d\u00e9membrement", desc: "Quote-part, usufruit, nue-propri\u00e9t\u00e9" },
          { href: "/plus-value-non-resident", icon: "\ud83c\udf0d", title: "Non-r\u00e9sident / Expatri\u00e9", desc: "Taux PS r\u00e9duit UE, exon\u00e9ration 150K\u20ac" },
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

// ── Contenu éditorial Donation / Succession ──────────────────────────────────
function ContentDonation() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", borderTop: "1px solid #E0DEF0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Valeur d'acquisition */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "#2D2B55", marginBottom: 8, marginTop: 0 }}>
          Quelle valeur retenir comme prix d&rsquo;acquisition ?
        </h2>
        <p style={{ fontSize: 15, color: "#6E6B8A", lineHeight: 1.7, marginBottom: 20, maxWidth: 760 }}>
          Contrairement \u00e0 une acquisition classique, il n&rsquo;y a pas de prix d&rsquo;achat \u00e0 proprement parler. La base de calcul de la plus-value repose sur la <strong>valeur v\u00e9nale d\u00e9clar\u00e9e</strong> dans l&rsquo;acte.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            {
              icon: "\ud83c\udf81",
              title: "Donation",
              items: [
                "Valeur v\u00e9nale d\u00e9clar\u00e9e dans l\u2019acte notari\u00e9 de donation",
                "Cette valeur est fix\u00e9e par le donateur et le donataire d\u2019un commun accord",
                "Elle doit correspondre \u00e0 la valeur du march\u00e9 au jour de la donation",
                "En cas de donation-partage, c\u2019est la valeur fix\u00e9e par le notaire qui pr\u00e9vaut",
              ],
              color: "#56CBAD",
              bg: "#EEEDF5",
            },
            {
              icon: "\u2696\ufe0f",
              title: "Succession",
              items: [
                "Valeur v\u00e9nale d\u00e9clar\u00e9e dans la d\u00e9claration de succession",
                "Elle doit refl\u00e9ter la valeur du bien au jour du d\u00e9c\u00e8s",
                "Fix\u00e9e par les h\u00e9ritiers, sous contr\u00f4le de l\u2019administration fiscale",
                "Le fisc peut contester une valeur manifestement sous-\u00e9valu\u00e9e",
              ],
              color: "#3F3D6E",
              bg: "#EEEDF5",
            },
          ].map((col, i) => (
            <div key={i} style={{ background: col.bg, borderRadius: 12, padding: "18px 16px", border: `1px solid ${col.color}30` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{col.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: col.color, marginBottom: 12 }}>{col.title}</div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: "#3F3D6E", lineHeight: 1.9 }}>
                {col.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ background: "#FDF3E8", border: "1px solid #D4923A", borderRadius: 10, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#7A4F1A", lineHeight: 1.6 }}>
          \u26a0\ufe0f <strong>Risque de sous-\u00e9valuation :</strong> Si le bien a \u00e9t\u00e9 d\u00e9clar\u00e9 \u00e0 une valeur inf\u00e9rieure \u00e0 sa valeur r\u00e9elle dans l&rsquo;acte (parfois pour r\u00e9duire les droits de mutation), la plus-value sera m\u00e9caniquement plus \u00e9lev\u00e9e lors de la vente. Le fisc peut \u00e9galement remettre en cause la valeur d\u00e9clar\u00e9e et rehausser la base imposable.
        </div>

        {/* Section 2 — Frais déductibles */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Les frais d\u00e9ductibles en cas de donation ou succession
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          Le r\u00e9gime est plus strict qu&rsquo;en cas d&rsquo;achat : <strong>le forfait de 7,5% ne s&rsquo;applique pas</strong>. Seuls les frais r\u00e9ellement engag\u00e9s et effectivement pay\u00e9s par le vendeur (h\u00e9ritier ou donataire) sont d\u00e9ductibles.
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
          {[
            { ok: true, label: "\u2705 Droits de mutation \u00e0 titre gratuit (droits de succession ou de donation)", desc: "\u00c0 condition qu\u2019ils aient \u00e9t\u00e9 effectivement pay\u00e9s par le vendeur et non pris en charge par le donateur." },
            { ok: true, label: "\u2705 Frais de notaire r\u00e9els de l\u2019acte de donation ou de la d\u00e9claration de succession", desc: "\u00c9moluments du notaire, droits d\u2019enregistrement, frais divers li\u00e9s \u00e0 l\u2019acte." },
            { ok: true, label: "\u2705 Forfait 15% travaux (si d\u00e9tention > 5 ans)", desc: "Ce forfait reste applicable, calcul\u00e9 sur la valeur d\u00e9clar\u00e9e dans l\u2019acte. Vous pouvez aussi d\u00e9duire les travaux r\u00e9els sur factures d\u2019entreprises." },
            { ok: false, label: "\u274c Droits pay\u00e9s par le donateur \u00e0 sa charge", desc: "Si le donateur a pris les frais \u00e0 sa charge lors de la donation, ces droits ne sont pas d\u00e9ductibles par le donataire." },
            { ok: false, label: "\u274c Forfait de frais d\u2019acquisition de 7,5%", desc: "Ce forfait est r\u00e9serv\u00e9 aux acquisitions \u00e0 titre on\u00e9reux (achat). Il ne s\u2019applique pas aux transmissions gratuites (donation et succession)." },
          ].map((item, i) => (
            <div key={i} style={{ background: item.ok ? "#F0FAF5" : "#FDF0EE", border: `1px solid ${item.ok ? "#B5DECA" : "#E8B4B0"}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.ok ? "#2D8C5F" : "#C0392B", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6E6B8A", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Section 3 — Durée de détention */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Dur\u00e9e de d\u00e9tention : depuis quand \u00e7a court ?
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          La dur\u00e9e de d\u00e9tention d\u00e9termine les abattements applicables. Elle ne court pas depuis la date d&rsquo;acquisition initiale par le donateur, mais depuis la transmission gratuite.
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "\ud83d\udcc5", title: "Donation classique", desc: "Depuis la date de l\u2019acte notari\u00e9 de donation. Si le donateur avait lui-m\u00eame acquis le bien il y a 20 ans, les abattements repartent \u00e0 z\u00e9ro \u00e0 compter de la date de donation." },
            { icon: "\u26b0\ufe0f", title: "Succession / H\u00e9ritage", desc: "Depuis la date du d\u00e9c\u00e8s, quelle que soit la date de publication de la d\u00e9claration de succession ou du partage entre h\u00e9ritiers." },
            { icon: "\ud83c\udf33", title: "Donation avec r\u00e9serve d\u2019usufruit", desc: "Depuis la date de la donation initiale (pas la date de r\u00e9union de l\u2019usufruit lors du d\u00e9c\u00e8s du donateur). La nue-propri\u00e9t\u00e9 transmise \u00e0 cette date fait courir le d\u00e9lai." },
            { icon: "\ud83d\udccb", title: "Donation-partage", desc: "Depuis la date de la donation-partage, m\u00eame si elle a \u00e9t\u00e9 consentie en avancement d\u2019hoirie. La date de l\u2019acte de donation-partage pr\u00e9vaut sur celle d\u2019un acte ant\u00e9rieur." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function DonationClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        defaultMode="succession"
        showTypeResidence={true}
        showModeAcquisition={true}
        disableForfaitFrais={true}
        labelPrixAchat="Valeur d\u00e9clar\u00e9e dans l\u2019acte"
        labelFraisAcquisition="Frais r\u00e9els (droits de mutation + notaire)"
        heroEyebrow="Simulateur donation & succession"
        heroTitle="Plus-value sur un bien h\u00e9rit\u00e9 ou re\u00e7u en donation"
        heroDescription="Le prix d\u2019acquisition retenu est la valeur d\u00e9clar\u00e9e dans l\u2019acte. Frais r\u00e9els uniquement (pas de forfait 7,5%). Dur\u00e9e de d\u00e9tention depuis la date du d\u00e9c\u00e8s ou de la donation."
        heroBadges={[
          { icon: "\ud83c\udf81", label: "Valeur d\u00e9clar\u00e9e dans l\u2019acte" },
          { icon: "\ud83d\udccb", label: "Frais r\u00e9els uniquement" },
          { icon: "\ud83d\udcc5", label: "Dur\u00e9e depuis le d\u00e9c\u00e8s/donation" },
          { icon: "\ud83d\udcc4", label: "Export PDF" },
        ]}
        lockedTypeLabel="Donation ou Succession \ud83c\udf81"
        customTitle="Calculez la plus-value sur un bien h\u00e9rit\u00e9 ou re\u00e7u en donation"
        customSubtitle="Le prix d\u2019acquisition retenu est la valeur d\u00e9clar\u00e9e dans l\u2019acte de succession ou de donation. Le simulateur applique automatiquement les frais r\u00e9els (pas de forfait 7,5%), le forfait travaux si applicable, et les abattements \u00e0 partir de la date de transmission."
        customBadges={[
          { icon: "\ud83c\udf81", text: "Valeur d\u00e9clar\u00e9e dans l\u2019acte comme base de calcul" },
          { icon: "\ud83d\udccb", text: "Frais r\u00e9els uniquement (forfait 7,5% non applicable)" },
          { icon: "\ud83d\udcc5", text: "Dur\u00e9e de d\u00e9tention depuis le d\u00e9c\u00e8s ou la donation" },
        ]}
        customAlertBanner={<DonationAlertBanner />}
        customSocialProof={<DonationSocialProof />}
        customHowItWorks={<HowItWorksDonation />}
        customExamplesSection={<></>}
        customAbattementsSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
        caseBadge={{
          label: "Bien re\u00e7u par donation ou succession",
          color: "menthe",
        }}
      />
      <ExamplesSectionDonation />
      <AbattementsTableDonation />
      <ContentDonation />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionDonation />
        <SourcesLegalesDonation />
      </div>
      <AutresSimulateursDonation />
    </>
  );
}
