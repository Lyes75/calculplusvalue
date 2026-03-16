"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { computePlusValue, fmt, getAbatIR, getAbatPS } from "@/lib/calcul-engine";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  indigo: "#2D2B55",
  indigoMid: "#3F3D6E",
  menthe: "#56CBAD",
  bg: "#F4F3FA",
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

// ── Exemples chiffrés SCI ─────────────────────────────────────────────────────

function scrollToSimulator() {
  const el = document.querySelector("[data-simulator-form]");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ExamplesSectionSCI() {
  // ── Exemple 1 : SCI IR, 2 associés 50/50, 15 ans ──
  const rEx1 = useMemo(() => {
    return computePlusValue(
      125000,   // prix achat quote-part 50%
      190000,   // prix vente quote-part 50%
      new Date(2011, 0, 1),
      new Date(2026, 0, 1),
      9375,     // forfait 7.5% sur 125K
      18750,    // forfait 15% sur 125K (> 5 ans)
      2000,     // frais cession quote-part
      { situationVendeur: "sci-ir", quotePart: 100 } // déjà proratisé
    );
  }, []);

  // ── Exemple 2 : SCI IS avec amortissements ──
  const rEx2 = useMemo(() => {
    return computePlusValue(
      400000,
      520000,
      new Date(2014, 0, 1),
      new Date(2026, 0, 1),
      0,
      0,
      5000,
      { situationVendeur: "sci-is", amortissementsSCI_IS: 120000, beneficeAvantPV: 0 }
    );
  }, []);

  // ── Exemple 3 : Comparaison IR vs IS, 20 ans ──
  const rEx3IR = useMemo(() => {
    return computePlusValue(
      300000,
      450000,
      new Date(2006, 0, 1),
      new Date(2026, 0, 1),
      22500,   // forfait 7.5%
      45000,   // forfait 15%
      0,
      { situationVendeur: "sci-ir", quotePart: 100 }
    );
  }, []);

  const rEx3IS = useMemo(() => {
    return computePlusValue(
      300000,
      450000,
      new Date(2006, 0, 1),
      new Date(2026, 0, 1),
      0,
      0,
      0,
      { situationVendeur: "sci-is", amortissementsSCI_IS: 150000, beneficeAvantPV: 0 }
    );
  }, []);

  // ── Distribution flat tax pour SCI IS ──
  const ex2PV = rEx2 ? rEx2.pvBrute : 235000;
  const ex2IS = rEx2 ? rEx2.totalImpot : 54500;
  const ex2Distribuable = ex2PV - ex2IS;
  const ex2FlatTax = Math.round(ex2Distribuable * 0.30);
  const ex2TotalFiscal = ex2IS + ex2FlatTax;
  const ex2TauxEffTotal = ex2PV > 0 ? (ex2TotalFiscal / ex2PV * 100) : 0;

  const ex3ISPV = rEx3IS ? rEx3IS.pvBrute : 300000;
  const ex3ISIS = rEx3IS ? rEx3IS.totalImpot : 70750;
  const ex3ISDistribuable = ex3ISPV - ex3ISIS;
  const ex3ISFlatTax = Math.round(ex3ISDistribuable * 0.30);
  const ex3ISTotalFiscal = ex3ISIS + ex3ISFlatTax;
  const ex3IRTotal = rEx3IR ? rEx3IR.totalImpot : 12250;
  const differenceIRvsIS = ex3ISTotalFiscal - ex3IRTotal;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.indigo, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value en SCI — IR vs IS
      </h2>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Trois situations courantes pour comprendre l&rsquo;impact du régime fiscal (IR ou IS), des quote-parts entre associés, et de la durée de détention sur l&rsquo;impôt.
      </p>

      <div className="examples-sci-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {/* ── Exemple 1 : SCI IR 50/50 ── */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>SCI à l&rsquo;IR — 2 associés, détention 15 ans</div>
            <div style={{ fontSize: 13, color: C.muted }}>Appartement acheté 250 000€ en 2011 via une SCI à l&rsquo;IR (2 associés à 50%), vendu 380 000€ en 2026.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {rEx1 && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Prix d'achat (QP 50%)", fmt(125000)],
                      ["+ Frais acquisition 7,5%", fmt(9375)],
                      ["+ Travaux forfait 15%", fmt(18750)],
                      ["Frais de cession (QP)", fmt(2000)],
                      [null],
                      ["PV brute", fmt(rEx1.pvBrute)],
                      ["Abattement IR (15 ans)", `${rEx1.abatIRPct.toFixed(0)}%`],
                      ["Abattement PS (15 ans)", `${rEx1.abatPSPct.toFixed(1)}%`],
                      [null],
                      ["IR (19%)", fmt(rEx1.impotIR)],
                      ["PS (17,2%)", fmt(rEx1.impotPS)],
                      ...(rEx1.surtaxe > 0 ? [["Surtaxe", fmt(rEx1.surtaxe)]] : []),
                    ].map((row, j) =>
                      row[0] === null ? (
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
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(rEx1.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Net vendeur (QP)</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#3BAF7A" }}>{fmt(rEx1.netVendeur)}</div>
                  </div>
                </div>
              </>
            )}
            <div style={{ marginTop: 12, fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5 }}>
              💡 Grâce à la détention de 15 ans, l&rsquo;abattement IR atteint 60%. En SCI IR, le seuil de surtaxe (50 000€) s&rsquo;apprécie par associé — ici chaque associé est en dessous. Un propriétaire unique aurait payé la surtaxe sur la PV totale.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 2 : SCI IS ── */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>SCI à l&rsquo;IS — Impact des amortissements</div>
            <div style={{ fontSize: 13, color: C.muted }}>Immeuble acheté 400 000€ en 2014 via une SCI à l&rsquo;IS, vendu 520 000€ en 2026. Amortissements cumulés : 120 000€.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {[
                  ["Prix d'achat", fmt(400000)],
                  ["− Amortissements cumulés", `− ${fmt(120000)}`],
                  ["= VNC", fmt(280000)],
                  [null],
                  ["Prix de vente corrigé", fmt(515000)],
                  ["− VNC", `− ${fmt(280000)}`],
                  ["= PV professionnelle", fmt(ex2PV)],
                  [null],
                  ["IS 15% (≤ 42 500€)", fmt(6375)],
                  ["IS 25% (au-delà)", fmt(Math.round(ex2IS - 6375))],
                  ["= IS total", fmt(ex2IS)],
                  [null],
                  ["Distribuable après IS", fmt(ex2Distribuable)],
                  ["Flat tax 30%", fmt(ex2FlatTax)],
                  ["= Total fiscal (IS+FT)", fmt(ex2TotalFiscal)],
                ].map((row, j) =>
                  row[0] === null ? (
                    <tr key={j}><td colSpan={2} style={{ height: 6 }}></td></tr>
                  ) : (
                    <tr key={j} style={{ borderBottom: "1px solid #EEEDF5" }}>
                      <td style={{ padding: "5px 0", color: C.muted, ...(String(row[0]).startsWith("=") ? { fontWeight: 700, color: C.indigo } : {}) }}>{row[0]}</td>
                      <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, ...(String(row[0]).startsWith("=") ? { fontWeight: 700 } : {}) }}>{row[1]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Taux effectif total</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{ex2TauxEffTotal.toFixed(1)}%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Impôt total</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(ex2TotalFiscal)}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5 }}>
              💡 En SCI IS, l&rsquo;absence d&rsquo;abattements et le calcul sur la VNC (réduite par 120K€ d&rsquo;amortissements) gonflent la PV. Avec la flat tax à la distribution, le taux effectif atteint {ex2TauxEffTotal.toFixed(0)}%. En SCI IR avec 12 ans de détention, l&rsquo;impôt aurait été nettement inférieur.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>

        {/* ── Exemple 3 : Comparaison IR vs IS ── */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#EEEDF5", padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.indigo, marginBottom: 4 }}>Le même bien en SCI IR vs SCI IS</div>
            <div style={{ fontSize: 13, color: C.muted }}>Appartement acheté 300 000€ il y a 20 ans, vendu 450 000€. Comparaison du coût fiscal total.</div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Deux colonnes IR vs IS */}
            <div className="sci-compare-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {/* Colonne IR */}
              <div style={{ background: "rgba(86,203,173,0.05)", border: `1px solid rgba(86,203,173,0.2)`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#2D8C5F", marginBottom: 10, textAlign: "center" }}>⚖️ SCI à l&rsquo;IR</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <tbody>
                    {rEx3IR && [
                      ["Prix d'achat corrigé", fmt(rEx3IR.prixAchatCorrige)],
                      ["PV brute", fmt(rEx3IR.pvBrute)],
                      [`Abat. IR (${rEx3IR.abatIRPct.toFixed(0)}%)`, `−${fmt(rEx3IR.pvBrute * rEx3IR.abatIRPct / 100)}`],
                      [`Abat. PS (${rEx3IR.abatPSPct.toFixed(1)}%)`, `−${fmt(rEx3IR.pvBrute * rEx3IR.abatPSPct / 100)}`],
                      [null],
                      ["IR (19%)", fmt(rEx3IR.impotIR)],
                      ["PS (17,2%)", fmt(rEx3IR.impotPS)],
                      ...(rEx3IR.surtaxe > 0 ? [["Surtaxe", fmt(rEx3IR.surtaxe)]] : []),
                    ].map((row, j) =>
                      row === null || row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid rgba(86,203,173,0.15)" }}>
                          <td style={{ padding: "4px 0", color: C.muted, fontSize: 11 }}>{row[0]}</td>
                          <td style={{ padding: "4px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, fontSize: 11 }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Total impôt</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#2D8C5F" }}>{fmt(ex3IRTotal)}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Net vendeur</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2D8C5F" }}>{fmt(450000 - ex3IRTotal)}</div>
                </div>
              </div>

              {/* Colonne IS */}
              <div style={{ background: "rgba(224,86,86,0.04)", border: `1px solid rgba(224,86,86,0.2)`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#C0392B", marginBottom: 10, textAlign: "center" }}>🏢 SCI à l&rsquo;IS</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <tbody>
                    {[
                      ["VNC (300K−150K amort.)", fmt(150000)],
                      ["PV imposable", fmt(ex3ISPV)],
                      ["Aucun abattement", "—"],
                      [null],
                      ["IS (15%/25%)", fmt(ex3ISIS)],
                      ["Flat tax 30% distrib.", fmt(ex3ISFlatTax)],
                    ].map((row, j) =>
                      row[0] === null ? (
                        <tr key={j}><td colSpan={2} style={{ height: 4 }}></td></tr>
                      ) : (
                        <tr key={j} style={{ borderBottom: "1px solid rgba(224,86,86,0.12)" }}>
                          <td style={{ padding: "4px 0", color: C.muted, fontSize: 11 }}>{row[0]}</td>
                          <td style={{ padding: "4px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, fontSize: 11 }}>{row[1]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: C.muted }}>Total fiscal (IS+FT)</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#E05656" }}>{fmt(ex3ISTotalFiscal)}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Net vendeur</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#E05656" }}>{fmt(450000 - ex3ISTotalFiscal)}</div>
                </div>
              </div>
            </div>

            {/* Ligne différence */}
            <div style={{ background: "rgba(224,86,86,0.06)", border: "1px solid rgba(224,86,86,0.2)", borderRadius: 8, padding: "10px 14px", textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#E05656" }}>
                Différence : −{fmt(differenceIRvsIS)} avec l&rsquo;IR
              </span>
              <span style={{ fontSize: 12, color: C.muted, display: "block", marginTop: 2 }}>
                La SCI IR fait économiser ~{fmt(differenceIRvsIS)} d&rsquo;impôt à la revente après 20 ans
              </span>
            </div>

            <div style={{ fontSize: 13, color: C.menthe, fontStyle: "italic", lineHeight: 1.5, marginBottom: 12 }}>
              💡 Sur 20 ans de détention, la SCI IR est massivement gagnante à la revente grâce aux abattements (90% d&rsquo;IR). L&rsquo;IS a pu être avantageux pendant 20 ans sur l&rsquo;imposition des loyers, mais le surcoût à la revente est considérable. Le choix IR vs IS dépend du bilan global loyers + revente.
            </div>
            <button onClick={scrollToSimulator} style={{ marginTop: "auto", width: "100%", padding: "10px 16px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.menthe, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Simulez votre propre situation ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .examples-sci-grid { grid-template-columns: 1fr !important; }
          .sci-compare-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── FAQ spécifique SCI ────────────────────────────────────────────────────────
const FAQ_ITEMS_SCI = [
  {
    q: "Comment est calculée la plus-value d\u2019une SCI à l\u2019IR ?",
    a: "En SCI soumise à l\u2019IR (transparence fiscale), chaque associé est imposé personnellement sur sa quote-part de plus-value, selon le régime des plus-values des particuliers. Le calcul est identique à celui d\u2019un particulier : prix de vente \u2212 prix d\u2019achat corrigé, puis abattements pour durée de détention (exonération IR après 22 ans, PS après 30 ans). La seule différence est que tous les montants sont proratisés selon votre pourcentage de parts dans la SCI.",
  },
  {
    q: "La plus-value d\u2019une SCI à l\u2019IS bénéficie-t-elle d\u2019abattements pour durée de détention ?",
    a: "Non. C\u2019est la différence fondamentale entre l\u2019IR et l\u2019IS. En SCI à l\u2019IS, la plus-value est une plus-value professionnelle calculée sur la valeur nette comptable (prix d\u2019achat \u2212 amortissements cumulés). Il n\u2019y a aucun abattement pour durée de détention. Même après 30 ans, la totalité de la plus-value est imposée au taux de l\u2019IS (15% jusqu\u2019à 42 500\u00a0\u20ac de bénéfice, 25% au-delà). En revanche, il n\u2019y a pas de prélèvements sociaux au niveau de la société.",
  },
  {
    q: "La surtaxe sur les plus-values élevées s\u2019applique-t-elle par associé ou sur la SCI entière ?",
    a: "En SCI à l\u2019IR, la surtaxe (2% à 6% au-delà de 50 000\u00a0\u20ac de PV nette) s\u2019apprécie par associé, sur sa quote-part de plus-value. Concrètement, si la SCI réalise une plus-value de 80 000\u00a0\u20ac et que vous détenez 50% des parts, votre quote-part est de 40 000\u00a0\u20ac \u2014 en dessous du seuil de 50 000\u00a0\u20ac. Vous échappez à la surtaxe alors qu\u2019un propriétaire unique l\u2019aurait payée. En SCI à l\u2019IS, la surtaxe ne s\u2019applique pas (c\u2019est un impôt sur les sociétés, pas sur les particuliers).",
  },
  {
    q: "Vaut-il mieux être à l\u2019IR ou à l\u2019IS pour la plus-value ?",
    a: "Ça dépend de la durée de détention et du montant des amortissements. À l\u2019IR, les abattements réduisent l\u2019impôt avec le temps et l\u2019exonération est totale après 22-30 ans. À l\u2019IS, pas d\u2019abattement mais un taux potentiellement plus bas (15% vs 36,2%) et pas de PS. Sur une détention courte (< 10 ans) avec peu d\u2019amortissements, l\u2019IS peut être avantageux. Sur une détention longue (> 15 ans), l\u2019IR est presque toujours préférable. Utilisez notre simulateur pour comparer les deux régimes sur votre cas précis.",
  },
  {
    q: "Que se passe-t-il si on passe de l\u2019IR à l\u2019IS ?",
    a: "Le passage de l\u2019IR à l\u2019IS est irrévocable et déclenche des conséquences fiscales immédiates. Les biens détenus par la SCI sont réputés apportés à une société à l\u2019IS, ce qui génère une imposition de la plus-value latente comme si les biens étaient vendus. De plus, les amortissements commencent à courir depuis la date du passage (sur la valeur vénale à cette date), réduisant la valeur nette comptable pour le futur calcul de PV à l\u2019IS. C\u2019est une décision structurante à ne prendre qu\u2019après avis d\u2019un expert-comptable.",
  },
  {
    q: "Les associés d\u2019une SCI à l\u2019IR peuvent-ils avoir des durées de détention différentes ?",
    a: "Oui, si les parts ont été acquises à des dates différentes. Chaque associé calcule sa durée de détention à partir de la date d\u2019acquisition de ses propres parts (achat, donation, succession). Si un associé a acquis ses parts il y a 25 ans et un autre il y a 5 ans, leurs abattements seront très différents. Le premier sera exonéré d\u2019IR, le second n\u2019aura aucun abattement. Notre simulateur calcule la plus-value pour votre quote-part et votre durée de détention.",
  },
  {
    q: "Comment sont imposés les associés lors de la distribution du prix de vente en SCI IS ?",
    a: "En SCI à l\u2019IS, l\u2019impôt sur la plus-value est payé par la société (IS 15%/25%). Mais quand les associés se distribuent le produit de la vente sous forme de dividendes, une seconde imposition s\u2019applique au niveau personnel : flat tax à 30% (12,8% IR + 17,2% PS) ou option pour le barème progressif avec abattement de 40%. C\u2019est la double imposition qui rend le régime IS souvent moins avantageux qu\u2019il n\u2019y paraît à première vue. Le coût fiscal total (IS + imposition des dividendes) peut dépasser le coût en SCI IR sur une détention longue.",
  },
];

function FAQSectionSCI() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value en SCI
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS_SCI.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ border: "1px solid #E0DEF0", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2D2B55", lineHeight: 1.4, paddingRight: 16 }}>{item.q}</span>
                <span style={{ fontSize: 22, color: "#56CBAD", fontWeight: 300, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 500 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#6E6B8A", lineHeight: 1.7 }}>
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

// ── Sources légales spécifiques SCI ──────────────────────────────────────────
function SourcesLegalesSCI() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#6E6B8A", lineHeight: 1.8 }}>
          <strong style={{ color: "#3F3D6E" }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 U à 150 VH du CGI</span> (plus-values des particuliers, applicable en SCI IR) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 39 duodecies et suivants du CGI</span> (plus-values professionnelles, applicable en SCI IS) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 206 du CGI</span> (imposition des sociétés) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 219 du CGI</span> (taux IS 15%/25%) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 200 A du CGI</span> (flat tax 30% sur dividendes).
          <br />
          <strong style={{ color: "#3F3D6E" }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Autres simulateurs (maillage interne) ────────────────────────────────────
function AutresSimulateursSCI() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
          { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Réintégration amortissements 2025" },
          { href: "/plus-value-non-resident", icon: "🌍", title: "Non-résidents", desc: "Taux PS réduit, exonération 150K€" },
          { href: "/plus-value-indivision", icon: "👥", title: "Indivision", desc: "Quote-part et démembrement" },
        ].map((link, i) => (
          <Link key={i} href={link.href} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}>
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

// ── Contenu éditorial ─────────────────────────────────────────────────────────
function ContentSCI() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── H2 : SCI à l'IR ── */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 8 }}>
            SCI à l'IR : le régime des particuliers s'applique
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            En SCI soumise à l'impôt sur le revenu (transparence fiscale), chaque associé est imposé personnellement sur <strong>sa quote-part de plus-value</strong>, exactement comme s'il détenait le bien en direct. Le régime fiscal est celui des plus-values des particuliers (art. 150 U et suivants du CGI).
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Abattements pour durée", desc: "Identiques aux particuliers : 6%/an à partir de la 6e année, exonération IR à 22 ans, PS à 30 ans." },
              { icon: "✅", title: "Surtaxe par associé", desc: "La surtaxe progressive (dès 50 000 € de PV nette) s'apprécie sur la quote-part de chaque associé, pas sur la SCI entière." },
              { icon: "✅", title: "Exonération progressive", desc: "Un associé qui détient ses parts depuis 22 ans est totalement exonéré d'IR, même si la SCI existe depuis moins longtemps." },
              { icon: "⚠️", title: "Durée : depuis l'achat par la SCI", desc: "La durée de détention court depuis la date d'acquisition du bien par la SCI, pas depuis la date d'entrée de l'associé." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>💡 Avantage clé : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Si la SCI détient le bien depuis plus de 22 ans, la plus-value est totalement exonérée d'IR pour chaque associé — sans aucune formalité particulière. Le notaire applique automatiquement les abattements.
            </span>
          </div>
        </section>

        {/* ── H2 : SCI à l'IS ── */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 8 }}>
            SCI à l'IS : un calcul radicalement différent
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            En SCI soumise à l'impôt sur les sociétés, la plus-value n'est pas calculée sur la base du prix d'achat initial mais sur la <strong>valeur nette comptable (VNC)</strong> — c'est-à-dire le prix d'achat diminué de tous les amortissements cumulés depuis l'acquisition.
          </p>

          {/* Étapes IS */}
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 14 }}>⚙️ Formule de calcul IS</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { step: "1", label: "Valeur nette comptable (VNC)", formula: "= Prix d'achat − Amortissements cumulés", color: C.indigoMid },
                { step: "2", label: "Plus-value professionnelle", formula: "= Prix de vente − Frais de cession − VNC", color: C.indigo },
                { step: "3", label: "Bénéfice total imposable", formula: "= Bénéfice avant cession + Plus-value", color: C.indigo },
                { step: "4", label: "IS dû", formula: "= 15% jusqu'à 42 500 € + 25% au-delà", color: "#C0392B" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: C.indigo, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.step}</span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.label} : </span>
                    <span style={{ fontSize: 13, color: C.muted }}>{s.formula}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              { icon: "❌", title: "Pas d'abattement pour durée", desc: "Même après 30 ans de détention, la plus-value IS est intégralement imposée. Le temps ne joue pas en votre faveur à l'IS.", bg: C.redBg, border: C.redBg },
              { icon: "🔄", title: "Effet boomerang des amortissements", desc: "Les amortissements ont réduit l'IS chaque année — mais ils réduisent aussi la VNC, donc augmentent la plus-value à la revente.", bg: C.amberBg, border: C.amberBorder },
              { icon: "📊", title: "IS 15% puis 25%", desc: "Taux réduit de 15% sur les premiers 42 500 € de bénéfice, 25% au-delà. Pas de prélèvements sociaux au niveau de la société.", bg: C.greenBg, border: C.greenBorder },
              { icon: "💸", title: "Double imposition potentielle", desc: "La distribution des bénéfices aux associés est également imposée (dividendes ou salaires). L'IS à la revente n'est donc qu'une première couche.", bg: C.bg, border: C.border },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── H2 : Tableau comparatif IR vs IS ── */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 8 }}>
            Comparaison IR vs IS — exemple chiffré
          </h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.7 }}>
            Bien acheté par la SCI en 2010 (200 000 €), revendu en 2026 (300 000 €). Frais de cession : 3 000 €. Associé A : 50% des parts, associé B : 50%.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.08)" }}>
              <thead>
                <tr style={{ background: C.indigo, color: "#FFFFFF" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>Éléments</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#56CBAD" }}>SCI à l'IR</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#F4D99A" }}>SCI à l'IS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Prix de vente", "300 000 €", "300 000 €"],
                  ["Frais de cession", "3 000 €", "3 000 €"],
                  ["Prix de vente corrigé", "297 000 €", "297 000 €"],
                  ["Base d'acquisition", "200 000 €", "VNC = 120 000 €¹"],
                  ["Frais d'acquisition forfait", "+ 15 000 €", "—"],
                  ["Plus-value brute (totale)", "82 000 €", "177 000 €"],
                  ["Durée de détention", "16 ans", "16 ans"],
                  ["Abattement IR", "66% → PV nette 27 880 €", "0% (pas d'abattement)"],
                  ["Abattement PS", "26,4% → PV nette 60 352 €", "0%"],
                  ["IR (19%) — par associé (50%)", "2 648 €", "—"],
                  ["PS (17,2%) — par associé (50%)", "5 190 €", "—"],
                  ["IS sur la PV (SCI entière)", "—", "~42 000 €²"],
                  ["Impôt total par associé (50%)", "≈ 7 840 €", "≈ 21 000 €"],
                  ["Net vendeur (par associé à 50%)", "≈ 140 660 €", "≈ 127 500 €"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 16px", fontWeight: i >= 11 ? 700 : 400, color: i >= 11 ? C.indigo : C.muted }}>{row[0]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: C.green, fontWeight: i >= 11 ? 700 : 400 }}>{row[1]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: i >= 11 ? C.red : C.muted, fontWeight: i >= 11 ? 700 : 400 }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 12, color: C.mutedLight, marginBottom: 16, lineHeight: 1.6 }}>
            ¹ VNC = 200 000 − 80 000 € d'amortissements cumulés sur 16 ans (environ 5 000 €/an). ² IS calculé sur la PV de 177 000 € : 42 500 × 15% + 134 500 × 25% = 6 375 + 33 625 = 40 000 € (hors bénéfice courant).
          </div>
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>📊 Conclusion : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Sur cet exemple, le régime IR est <strong>2 à 3 fois plus avantageux</strong> que l'IS à la revente grâce aux abattements pour durée de détention. L'IS ne devient intéressant que si les amortissements ont généré une forte réduction d'IS pendant la période de location — et si la SCI n'a pas vocation à revendre.
            </span>
          </div>
        </section>

        {/* ── H2 : Passage IR → IS ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 8 }}>
            Passage de l'IR à l'IS : attention danger
          </h2>
          <div style={{ background: C.redBg, border: `1px solid #E8B4B0`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.red, marginBottom: 10 }}>⚠️ 3 points critiques à connaître avant tout changement de régime</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { icon: "🔒", text: "Le passage de l'IR à l'IS est irrévocable. Une fois la SCI soumise à l'IS, il n'est plus possible de revenir à l'IR." },
                { icon: "💥", text: "Le passage déclenche une imposition immédiate : il est traité fiscalement comme une cessation d'activité, avec imposition des plus-values latentes sur tous les biens de la SCI — comme si ceux-ci étaient vendus à leur valeur vénale du jour." },
                { icon: "🧮", text: "Il faut réaliser une simulation complète sur la durée (économies d'IS pendant la détention vs surcoût à la revente) avec un expert-comptable avant toute décision. Dans la grande majorité des cas immobiliers résidentiels, l'IR reste plus avantageux à terme." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Maillage interne ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Réintégration amortissements 2025" },
              { href: "/plus-value-indivision", icon: "👥", title: "Indivision", desc: "Quote-part et abattements par copropriétaire" },
            ].map((link, i) => (
              <Link key={i} href={link.href} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textDecoration: "none" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function SCIClient() {
  return (
    <>
      <SimulateurBase
        defaultType="locatif"
        defaultSituation="sci-ir"
        showTypeResidence={true}
        showSituationVendeur={true}
        showQuotePart={true}
        showSCI_IS_Options={true}
        heroEyebrow="Simulateur SCI — IR et IS"
        heroTitle="Plus-value en SCI : comparez les régimes IR et IS"
        heroDescription="Calcul par quote-part, comparaison régime des particuliers vs impôt sur les sociétés, impact des amortissements en SCI IS."
        heroBadges={[
          { icon: "⚖️", label: "Comparaison IR vs IS" },
          { icon: "👥", label: "Calcul par quote-part" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "📄", label: "Export PDF" },
        ]}
        caseBadge={{ label: "SCI — choisissez IR ou IS", color: "#2D2B55" }}
        customExamplesSection={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        customSimulateurCards={<></>}
      />
      <ExamplesSectionSCI />
      <ContentSCI />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionSCI />
        <SourcesLegalesSCI />
      </div>
      <AutresSimulateursSCI />
    </>
  );
}
