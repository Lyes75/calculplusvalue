"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { C } from "@/lib/constants";
import { computePlusValue, fmt, getAbatIR, getAbatPS } from "@/lib/calcul-engine";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

// ── Bloc alerte réforme 2025 ────────────────────────────────────────────────
function LMNPAlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 12px", padding: "0 16px" }}>
      <div style={{ background: "rgba(224,86,86,0.06)", border: "1px solid rgba(224,86,86,0.2)", borderRadius: 10, padding: "12px 20px", fontSize: 14, color: "#1E1C3A", lineHeight: 1.6 }}>
        ⚠️ <strong>Réforme 2025 en vigueur</strong> — Les amortissements déduits sont désormais réintégrés dans le calcul de la plus-value LMNP. Ce simulateur prend en compte cette réforme.
      </div>
    </div>
  );
}

// ── Social proof LMNP ───────────────────────────────────────────────────────
function LMNPSocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { emoji: "📊", before: "Simulateur mis à jour avec la ", bold: "réforme LF 2025", after: "" },
          { emoji: "✅", before: "Barèmes CGI au ", bold: "1er janvier 2026", after: "" },
          { emoji: "🔒", before: "Gratuit, ", bold: "sans inscription", after: "" },
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{item.emoji}</span>
            <span>
              {item.before}
              <strong style={{ fontWeight: 600, color: C.text }}>{item.bold}</strong>
              {item.after}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CTA Expert-comptable LMNP ───────────────────────────────────────────────
function CTAExpertComptable() {
  return (
    <a href="/contact" style={{ textDecoration: "none", display: "block" }}>
      {/* TODO: remplacer href par lien partenaire (Indy, Declonou, etc.) */}
      <div style={{
        background: "#EEEDF5", border: "1px solid #D8D6E8", borderLeft: "3px solid #56CBAD",
        borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "transform 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <div style={{ fontSize: 28, flexShrink: 0 }}>🧮</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 2 }}>Besoin d&rsquo;un expert-comptable LMNP ?</div>
          <div style={{ fontSize: 12, color: "#6E6B8A", lineHeight: 1.4 }}>
            La comptabilité en LMNP au réel est complexe (amortissements, liasses fiscales, déclarations BIC). Un expert-comptable spécialisé peut optimiser votre fiscalité et anticiper l&rsquo;impact de la revente.
          </div>
        </div>
        <div style={{ background: "#56CBAD", color: "#1E1C3A", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
          Nous contacter →
        </div>
      </div>
    </a>
  );
}

// ── FAQ Accordéon LMNP ──────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Les amortissements LMNP sont-ils toujours réintégrés dans la plus-value en 2026 ?",
    a: "Oui. Depuis la loi de finances 2025, les amortissements admis en déduction au titre de l\u2019article 39C du CGI sont réintégrés dans le calcul du prix d\u2019acquisition corrigé lors de la revente. Cela concerne les amortissements du bien immobilier comme du mobilier. Le prix d\u2019achat corrigé est diminué du montant total des amortissements déduits, ce qui augmente mécaniquement la plus-value imposable.",
  },
  {
    q: "Quels amortissements sont concernés par la réintégration ?",
    a: "Tous les amortissements admis en déduction des revenus BIC au titre du régime réel LMNP. Cela inclut l\u2019amortissement du bâti, du mobilier, des travaux d\u2019amélioration et des frais d\u2019acquisition amortis. Les amortissements correspondant à des travaux de construction, reconstruction ou agrandissement déjà pris en compte dans le prix d\u2019acquisition ne sont pas réintégrés une seconde fois. En micro-BIC, la question ne se pose pas puisqu\u2019aucun amortissement n\u2019est déduit.",
  },
  {
    q: "Comment calculer la plus-value d\u2019un LMNP en 2026 ?",
    a: "Le calcul suit le régime des plus-values des particuliers, avec une modification : PV brute = Prix de vente corrigé \u2212 (Prix d\u2019achat + frais d\u2019acquisition + travaux \u2212 amortissements déduits). Ensuite, appliquez les abattements pour durée de détention (6% par an en IR de la 6e à la 21e année, exonération à 22 ans). Le taux reste de 19% d\u2019IR + 17,2% de PS. Notre simulateur en haut de page calcule tout automatiquement.",
  },
  {
    q: "Le micro-BIC est-il concerné par la réintégration des amortissements ?",
    a: "Non. Le régime micro-BIC applique un abattement forfaitaire de 50% sur les recettes sans amortissement comptable. Il n\u2019y a donc rien à réintégrer. La réforme ne concerne que les LMNP au régime réel qui ont effectivement déduit des amortissements.",
  },
  {
    q: "Peut-on encore éviter l\u2019impôt sur la plus-value en LMNP ?",
    a: "Oui, plusieurs voies restent ouvertes. L\u2019exonération par durée de détention reste applicable : exonération totale d\u2019IR après 22 ans et de PS après 30 ans, y compris sur la fraction liée aux amortissements réintégrés. Le passage en LMP peut aussi permettre une exonération totale si les conditions sont réunies (activité > 5 ans, recettes < 90 000 \u20ac). Enfin, la vente de la résidence principale reste toujours exonérée si le bien est requalifié en RP avant la vente.",
  },
  {
    q: "Quelle différence entre LMNP et LMP pour la plus-value ?",
    a: "En LMNP, la plus-value suit le régime des particuliers avec abattements pour durée de détention et réintégration des amortissements depuis 2025. En LMP, la plus-value relève du régime des plus-values professionnelles, avec une exonération totale possible après 5 ans d\u2019activité si les recettes sont inférieures à 90 000 \u20ac (art. 151 septies CGI). Le statut LMP s\u2019applique automatiquement si vos recettes dépassent 23 000 \u20ac/an ET vos autres revenus professionnels.",
  },
];

function FAQSectionLMNP() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 20, marginTop: 0 }}>
        Questions fréquentes — Plus-value LMNP
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ_ITEMS.map((item, i) => {
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

// ── Exemples chiffrés LMNP (avec comparaison avant/après réforme) ──────────
interface LMNPExampleDef {
  title: string;
  subtitle: string;
  prixAchat: number;
  prixVente: number;
  dateAchat: Date;
  fraisAcqui: number;
  travaux: number;
  fraisCession: number;
  amortissements: number;
  optimMsg: string;
}

const LMNP_EXAMPLES: LMNPExampleDef[] = [
  {
    title: "LMNP classique — détention 10 ans",
    subtitle: "Studio meublé à Bordeaux acheté 150 000\u202F€ en 2016, vendu 210 000\u202F€ en 2026. Amortissements cumulés : 35 000\u202F€.",
    prixAchat: 150000,
    prixVente: 210000,
    dateAchat: new Date(2016, 0, 1),
    fraisAcqui: 11250,   // forfait 7,5%
    travaux: 22500,       // forfait 15%
    fraisCession: 2000,
    amortissements: 35000,
    optimMsg: "Si vous attendez 12 ans de plus, l\u2019IR sera totalement exonéré (22 ans de détention).",
  },
  {
    title: "LMNP forte rentabilité — détention 5 ans",
    subtitle: "T2 meublé à Lyon acheté 200 000\u202F€ en 2021, vendu 240 000\u202F€ en 2026. Amortissements cumulés : 55 000\u202F€ (bâti + mobilier + travaux).",
    prixAchat: 200000,
    prixVente: 240000,
    dateAchat: new Date(2021, 0, 1),
    fraisAcqui: 15000,   // forfait 7,5%
    travaux: 30000,       // forfait 15%
    fraisCession: 3000,
    amortissements: 55000,
    optimMsg: "Avec 55 000\u202F€ d\u2019amortissements réintégrés, l\u2019impact fiscal est massif. Vérifiez si le passage en LMP est avantageux — si vos recettes dépassent 23 000\u202F€/an, l\u2019exonération LMP après 5 ans d\u2019activité pourrait supprimer l\u2019impôt.",
  },
  {
    title: "LMNP longue détention — 20 ans",
    subtitle: "Appartement meublé à Nantes acheté 130 000\u202F€ en 2006, vendu 195 000\u202F€ en 2026. Amortissements cumulés : 60 000\u202F€.",
    prixAchat: 130000,
    prixVente: 195000,
    dateAchat: new Date(2006, 0, 1),
    fraisAcqui: 9750,    // forfait 7,5%
    travaux: 19500,       // forfait 15%
    fraisCession: 2500,
    amortissements: 60000,
    optimMsg: "Malgré 60 000\u202F€ d\u2019amortissements réintégrés, l\u2019abattement IR de 90\u202F% après 20 ans réduit fortement l\u2019impact. En attendant 2 ans de plus, l\u2019IR sera totalement exonéré — seuls les PS resteront dus.",
  },
];

function scrollToSimulator() {
  const el = document.querySelector("[data-simulator-form]");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ExamplesSectionLMNP() {
  const results = useMemo(() => {
    const dateVente = new Date(2026, 0, 1);
    return LMNP_EXAMPLES.map((ex) => {
      // Sans réforme (amortissements = 0)
      const sans = computePlusValue(
        ex.prixAchat, ex.prixVente, ex.dateAchat, dateVente,
        ex.fraisAcqui, ex.travaux, ex.fraisCession,
        { typeResidence: "lmnp", amortissementsLMNP: 0 }
      );
      // Avec réforme (amortissements réintégrés)
      const avec = computePlusValue(
        ex.prixAchat, ex.prixVente, ex.dateAchat, dateVente,
        ex.fraisAcqui, ex.travaux, ex.fraisCession,
        { typeResidence: "lmnp", amortissementsLMNP: ex.amortissements }
      );
      return { sans, avec };
    });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Exemples de calcul de plus-value LMNP — Impact des amortissements
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 760 }}>
        Trois situations courantes pour comprendre l&apos;impact de la réforme 2025 sur votre plus-value en location meublée.
      </p>

      <div className="lmnp-examples-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {LMNP_EXAMPLES.map((ex, i) => {
          const { sans, avec } = results[i];
          if (!sans || !avec) return null;
          const surcout = avec.totalImpot - sans.totalImpot;

          const rows: { label: string; valSans: string; valAvec: string; bold?: boolean; red?: boolean }[] = [
            { label: "Prix d\u2019achat corrigé", valSans: fmt(sans.prixAchatCorrige), valAvec: `${fmt(avec.prixAchatCorrige)} (\u2212${fmt(ex.amortissements).replace(" €", "")} amort.)` },
            { label: "PV brute", valSans: fmt(sans.pvBrute), valAvec: fmt(avec.pvBrute) },
            { label: `Abattement IR (${sans.abatIRPct.toFixed(0)}%)`, valSans: fmt(sans.pvBrute * sans.abatIRPct / 100), valAvec: fmt(avec.pvBrute * avec.abatIRPct / 100) },
            { label: `Abattement PS (${sans.abatPSPct.toFixed(1)}%)`, valSans: fmt(sans.pvBrute * sans.abatPSPct / 100), valAvec: fmt(avec.pvBrute * avec.abatPSPct / 100) },
            { label: "IR (19%)", valSans: fmt(sans.impotIR), valAvec: fmt(avec.impotIR) },
            { label: "PS (17,2%)", valSans: fmt(sans.impotPS), valAvec: fmt(avec.impotPS) },
            ...(sans.surtaxe > 0 || avec.surtaxe > 0 ? [{ label: "Surtaxe", valSans: fmt(sans.surtaxe), valAvec: fmt(avec.surtaxe) }] : []),
            { label: "Total impôt", valSans: fmt(sans.totalImpot), valAvec: fmt(avec.totalImpot), bold: true },
            { label: "Surcoût réforme", valSans: "—", valAvec: `+${fmt(surcout)}`, bold: true, red: true },
          ];

          return (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ background: C.accentBg, padding: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{ex.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{ex.subtitle}</div>
              </div>

              {/* Tableau comparatif */}
              <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "6px 0", textAlign: "left", fontSize: 10, color: C.textMuted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}></th>
                      <th style={{ padding: "6px 4px", textAlign: "right", fontSize: 10, color: C.textMuted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>Sans réforme</th>
                      <th style={{ padding: "6px 4px", textAlign: "right", fontSize: 10, color: "#E05656", fontWeight: 700, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap", background: "rgba(224,86,86,0.03)" }}>Avec réforme</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, j) => (
                      <tr key={j} style={{ borderBottom: `1px solid ${C.accentBg}` }}>
                        <td style={{ padding: "5px 0", color: row.red ? "#E05656" : C.textMuted, fontWeight: row.bold ? 700 : 400, fontSize: 12 }}>{row.label}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: row.bold ? 700 : 500, color: row.red ? C.textMuted : C.text, fontSize: 12 }}>{row.valSans}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: row.bold ? 700 : 500, color: row.red ? "#E05656" : "#3F3D6E", background: "rgba(224,86,86,0.03)", fontSize: 12 }}>{row.valAvec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Résultats finaux */}
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Impôt total (réforme)</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#E05656" }}>{fmt(avec.totalImpot)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Net vendeur (réforme)</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#3BAF7A" }}>{fmt(avec.netVendeur)}</div>
                  </div>
                </div>

                {/* Message d'optimisation */}
                <div style={{ marginTop: 12, fontSize: 12, color: C.accent, fontStyle: "italic", lineHeight: 1.5 }}>
                  💡 La réintégration des {fmt(ex.amortissements)} d&apos;amortissements augmente votre impôt de <strong style={{ color: "#E05656" }}>+{fmt(surcout)}</strong>. {ex.optimMsg}
                </div>

                {/* CTA */}
                <button
                  onClick={scrollToSimulator}
                  style={{
                    marginTop: "auto", width: "100%", padding: "10px 16px", background: "none",
                    border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600,
                    color: C.accent, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
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
          .lmnp-examples-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Tableau des abattements LMNP ────────────────────────────────────────────
function getImpotColorLMNP(impot: number): string {
  const ratio = impot / 36200;
  const r = Math.round(59 + ratio * (224 - 59));
  const g = Math.round(175 - ratio * (175 - 86));
  const b = Math.round(122 - ratio * (122 - 86));
  return `rgb(${r}, ${g}, ${b})`;
}

function fmtPctLMNP(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

function AbattementsTableLMNP() {
  const [showDetailed, setShowDetailed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
      if (desktop) setShowDetailed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const tableData = useMemo(() => {
    const data: {
      label: string; abatIR: number; abatPS: number; tauxIR: number; tauxPS: number;
      total: number; impot100k: number; surcout40k: number; isYear22: boolean; isYear30: boolean;
    }[] = [];

    const PV_SANS = 100000;
    const PV_AVEC = 140000; // 100K + 40K amortissements

    // Group 0-5
    const abatIR0 = Math.min(100, getAbatIR(0));
    const abatPS0 = Math.min(100, getAbatPS(0));
    const tauxIR0 = 19 * (1 - abatIR0 / 100);
    const tauxPS0 = 17.2 * (1 - abatPS0 / 100);
    const total0 = tauxIR0 + tauxPS0;
    const impotSans0 = PV_SANS * (1 - abatIR0 / 100) * 0.19 + PV_SANS * (1 - abatPS0 / 100) * 0.172;
    const impotAvec0 = PV_AVEC * (1 - abatIR0 / 100) * 0.19 + PV_AVEC * (1 - abatPS0 / 100) * 0.172;
    data.push({
      label: "0 à 5 ans", abatIR: abatIR0, abatPS: abatPS0, tauxIR: tauxIR0, tauxPS: tauxPS0,
      total: total0, impot100k: Math.round(PV_SANS * total0 / 100),
      surcout40k: Math.round(impotAvec0 - impotSans0),
      isYear22: false, isYear30: false,
    });

    // Years 6-30
    for (let y = 6; y <= 30; y++) {
      const abatIR = Math.min(100, getAbatIR(y));
      const abatPS = Math.min(100, getAbatPS(y));
      const tauxIR = 19 * (1 - abatIR / 100);
      const tauxPS = 17.2 * (1 - abatPS / 100);
      const total = tauxIR + tauxPS;
      const impotSans = PV_SANS * (1 - abatIR / 100) * 0.19 + PV_SANS * (1 - abatPS / 100) * 0.172;
      const impotAvec = PV_AVEC * (1 - abatIR / 100) * 0.19 + PV_AVEC * (1 - abatPS / 100) * 0.172;
      data.push({
        label: `${y} ans`, abatIR, abatPS, tauxIR, tauxPS, total,
        impot100k: Math.round(PV_SANS * total / 100),
        surcout40k: Math.round(impotAvec - impotSans),
        isYear22: y === 22, isYear30: y === 30,
      });
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
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Abattements et impact des amortissements LMNP par année de détention
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.6, maxWidth: 760 }}>
        Les abattements pour durée de détention s&apos;appliquent normalement en LMNP, y compris sur la fraction de plus-value liée aux amortissements réintégrés. Plus vous détenez longtemps, plus l&apos;impact de la réforme 2025 est absorbé par les abattements. Le tableau ci-dessous illustre cette mécanique.
      </p>

      {/* Tableau synthétique */}
      <div style={{ overflowX: "auto", marginBottom: 12 }}>
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

      {/* Note menthe LMNP */}
      <div style={{ background: "rgba(86,203,173,0.06)", border: "1px solid rgba(86,203,173,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#1E1C3A", lineHeight: 1.6, marginBottom: 16 }}>
        💡 En LMNP, ces abattements s&apos;appliquent sur la totalité de la plus-value brute, y compris la part liée aux amortissements réintégrés. C&apos;est pourquoi la détention longue reste la meilleure stratégie pour neutraliser l&apos;impact de la réforme 2025.
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 16px",
          background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 14, fontWeight: 600, color: C.accent, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
        }}
      >
        {showDetailed ? "Masquer le détail année par année ▲" : "Voir le détail année par année ▼"}
      </button>

      {/* Tableau détaillé */}
      <div style={{ maxHeight: showDetailed ? 2000 : 0, overflow: "hidden", transition: "max-height 0.5s ease" }}>
        <div className="abat-lmnp-wrapper" style={{ overflowX: "auto", position: "relative", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#2D2B55", color: "#E0DEF0" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Année</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. IR</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Abat. PS</th>
                <th className="abat-lmnp-hide" style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux IR eff.</th>
                <th className="abat-lmnp-hide" style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux PS eff.</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Taux total</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Impôt / 100K€</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, paddingRight: 16, color: "#FFA8A8" }}>Surcoût 40K€ amort.</th>
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
                      {row.abatIR >= 100 ? "100% ✓" : fmtPctLMNP(row.abatIR)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums", ...(row.isYear30 ? { fontWeight: 700, color: "#3BAF7A" } : {}) }}>
                      {row.abatPS >= 100 ? "100% ✓" : fmtPctLMNP(row.abatPS)}
                    </td>
                    <td className="abat-lmnp-hide" style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxIR <= 0 ? <span style={{ fontWeight: 700, color: C.accent }}>Exonéré</span> : fmtPctLMNP(row.tauxIR)}
                    </td>
                    <td className="abat-lmnp-hide" style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.tauxPS <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctLMNP(row.tauxPS)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontVariantNumeric: "tabular-nums" }}>
                      {row.total <= 0 ? <span style={{ fontWeight: 700, color: "#3BAF7A" }}>Exonéré</span> : fmtPctLMNP(row.total)}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.impot100k <= 0 ? "#3BAF7A" : getImpotColorLMNP(row.impot100k) }}>
                      {row.impot100k <= 0 ? "0 €" : row.impot100k.toLocaleString("fr-FR") + " €"}
                    </td>
                    <td style={{ padding: "9px 14px", textAlign: "right", paddingRight: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: row.surcout40k <= 0 ? "#3BAF7A" : "#E05656" }}>
                      {row.surcout40k <= 0 ? "0 €" : `+${row.surcout40k.toLocaleString("fr-FR")} €`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Note LMNP */}
        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.7, marginBottom: 8 }}>
          <strong>Source :</strong> art. 150 VC du CGI (abattements) · art. 150 VB II (réintégration des amortissements LMNP) · Loi n°2025-127 du 14 février 2025 de finances pour 2025. La colonne « Impôt / 100K€ » illustre l&apos;imposition sur une PV brute de 100 000€ hors surtaxe. La colonne « Surcoût 40K€ amort. » montre l&apos;impôt supplémentaire dû à la réintégration de 40 000€ d&apos;amortissements. Votre montant réel dépend de vos amortissements cumulés — utilisez le simulateur ci-dessus pour un calcul personnalisé.
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .abat-lmnp-hide { display: none !important; }
          .abat-lmnp-wrapper {
            box-shadow: inset -12px 0 8px -8px rgba(0,0,0,0.08);
          }
        }
      `}</style>
    </div>
  );
}

// ── Sources légales ─────────────────────────────────────────────────────────
function SourcesLegalesLMNP() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ background: "#EEEDF5", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#6E6B8A", lineHeight: 1.8 }}>
          <strong style={{ color: "#3F3D6E" }}>Sources légales :</strong>{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VB II du CGI</span> (réintégration des amortissements) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 150 VC</span> (abattements durée de détention) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 39C</span> (amortissements admis en déduction) ·{" "}
          <span style={{ fontFamily: "monospace" }}>art. 151 septies</span> (exonération LMP) ·{" "}
          Loi n°2025-127 du 14 février 2025 de finances pour 2025.
          <br />
          <strong style={{ color: "#3F3D6E" }}>Dernière mise à jour des barèmes :</strong> 1er janvier 2026.
        </div>
      </div>
    </div>
  );
}

// ── Contenu éditorial LMNP ───────────────────────────────────────────────────
function ContentLMNP() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", borderTop: "1px solid #E0DEF0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Réforme 2025 */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "#2D2B55", marginBottom: 8, marginTop: 0 }}>
          Ce qui change avec la réforme LMNP 2025
        </h2>
        <p style={{ fontSize: 15, color: "#6E6B8A", lineHeight: 1.7, marginBottom: 20, maxWidth: 760 }}>
          La <strong>loi de finances pour 2025</strong> a introduit une modification majeure pour les loueurs meublés non professionnels : les amortissements admis en déduction des revenus BIC sont désormais <strong>réintégrés dans le calcul de la plus-value immobilière</strong> lors de la revente (art. 150 VB II du CGI).
        </p>
        <div style={{ background: "#EEEDF5", borderLeft: "4px solid #56CBAD", borderRadius: 8, padding: "16px 20px", marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 6 }}>📌 Principe de la réforme</div>
          <p style={{ fontSize: 14, color: "#3F3D6E", lineHeight: 1.7, margin: 0 }}>
            Avant 2025, le LMNP bénéficiait d&rsquo;un double avantage : amortir le bien pour réduire ses revenus imposables <em>et</em> vendre au régime des plus-values particulières (avec abattements). La réforme met fin à ce double avantage en diminuant le prix d&rsquo;acquisition corrigé du montant des amortissements déduits, ce qui augmente la plus-value brute imposable.
          </p>
        </div>

        {/* Section 2 — Exemple chiffré */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Exemple concret : l&rsquo;impact chiffré
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          Prenons un appartement acheté 200 000 € il y a 10 ans, vendu 300 000 €, avec 15 000 € de frais de notaire (forfait 7,5%) et 40 000 € d&rsquo;amortissements cumulés déduits sur 10 ans.
        </p>
        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr style={{ background: "#2D2B55", color: "#E0DEF0" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Élément</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>Avant réforme</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>Après réforme 2025</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Prix de vente corrigé", "300 000 €", "300 000 €"],
                ["Prix d'achat corrigé", "215 000 €", "175 000 € (−40K amort.)"],
                ["Plus-value brute", "85 000 €", "125 000 €"],
                ["Abattement IR (10 ans = 30%)", "25 500 €", "37 500 €"],
                ["Abattement PS (10 ans = 8,25%)", "7 012 €", "10 312 €"],
                ["Impôt sur le revenu (19%)", "11 305 €", "16 625 €"],
                ["Prélèvements sociaux (17,2%)", "13 407 €", "19 712 €"],
                ["Total impôt", "24 712 €", "36 337 €"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#F4F3FA" : "#FAFAFE", borderBottom: "1px solid #E0DEF0" }}>
                  <td style={{ padding: "9px 14px", fontWeight: i === 7 ? 700 : 400, color: "#2D2B55" }}>{row[0]}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: "#6E6B8A", fontWeight: i === 7 ? 700 : 400 }}>{row[1]}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: i === 7 ? "#C0392B" : "#3F3D6E", fontWeight: i === 7 ? 700 : 500 }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: "#FDF3E8", border: "1px solid #D4923A", borderRadius: 10, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#7A4F1A", lineHeight: 1.6 }}>
          ⚠️ <strong>Surcoût fiscal dans cet exemple :</strong> +11 625 € d&rsquo;impôt supplémentaire dû à la réintégration des 40 000 € d&rsquo;amortissements, soit un impact de 29% de la plus-value additionnelle.
        </div>

        {/* Section 3 — Réduire l'impact */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Comment réduire l&rsquo;impact de la réforme ?
        </h2>
        <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
          {[
            { icon: "⏳", title: "Attendre l\u2019exonération IR (22 ans)", desc: "Plus la durée de détention est longue, plus les abattements réduisent la plus-value imposable. À 22 ans de détention, vous êtes totalement exonéré d\u2019IR (19%), et à 30 ans, exonéré aussi des prélèvements sociaux (17,2%) — y compris sur la partie liée aux amortissements réintégrés." },
            { icon: "🔧", title: "Maximiser les charges déductibles à la vente", desc: "Les frais d\u2019agence à votre charge, les diagnostics obligatoires, la mainlevée d\u2019hypothèque et les travaux de remise en état réalisés par des entreprises réduisent le prix de vente corrigé ou augmentent le prix d\u2019acquisition corrigé, diminuant ainsi la plus-value brute." },
            { icon: "👥", title: "Vente en indivision pour éviter la surtaxe", desc: "Si votre plus-value nette dépasse 50 000 €, une surtaxe progressive s\u2019applique. En cas de bien détenu en indivision, le seuil de 50 000 € s\u2019apprécie par quote-part. Vendre à deux peut permettre d\u2019éviter cette surtaxe additionnelle." },
            { icon: "📋", title: "Vérifier votre statut LMP", desc: "Si vos recettes locatives dépassent 23 000 € par an et sont supérieures à vos autres revenus professionnels, vous êtes LMP (Loueur Meublé Professionnel). Ce régime offre des exonérations totales après 5 ans d\u2019activité si les recettes sont < 90 000 € (art. 151 septies CGI). Consultez un expert-comptable pour évaluer cette option." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 4 — LMNP vs LMP */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          LMNP vs LMP : quelle différence pour la plus-value ?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "LMNP", color: "#3F3D6E", bg: "#EEEDF5", items: ["Recettes < 23 000 € OU < revenus professionnels", "Plus-value : régime des particuliers", "IR 19% + PS 17,2%", "Abattements pour durée de détention", "Réintégration des amortissements depuis 2025", "Surtaxe si PV nette > 50 000 €"] },
            { label: "LMP", color: "#2D8C5F", bg: "#E8F7F0", items: ["Recettes > 23 000 € ET > revenus professionnels", "Plus-value : régime des professionnels", "Exonération totale si recettes < 90K€ après 5 ans", "Exonération partielle si recettes 90K€ - 126K€", "Pas de réintégration des amortissements (art. 151 septies)", "Imposition sur les plus-values à court terme = revenus"] },
          ].map((col, i) => (
            <div key={i} style={{ background: col.bg, borderRadius: 12, padding: "20px 18px", border: `1px solid ${col.color}20` }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: col.color, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: col.color, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>{col.label}</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: "#3F3D6E", lineHeight: 2 }}>
                {col.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Bloc de liens internes ──────────────────────────────────────────────────
function AutresSimulateurs() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", padding: "0 24px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#EEEDF5", borderRadius: 12, padding: "24px 20px", border: "1px solid #D6D4EC" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 14 }}>🔗 Autres simulateurs sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "SCI à l\u2019IR et SCI à l\u2019IS" },
              { href: "/exonerations-plus-value", icon: "✅", title: "Exonérations", desc: "Résidence principale, cas spéciaux" },
            ].map((link, i) => (
              <Link key={i} href={link.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 10, padding: "14px 16px", textDecoration: "none", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,43,85,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#2D2B55" }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: "#6E6B8A", marginTop: 2 }}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function LMNPClient() {
  return (
    <>
      <SimulateurBase
        defaultType="lmnp"
        showTypeResidence={false}
        showAmortissementsLMNP={true}
        heroEyebrow="Simulateur LMNP — Réforme 2025 prise en compte"
        heroTitle="Plus-value LMNP : calculez l'impact des amortissements"
        heroDescription="Depuis la loi de finances 2025, les amortissements déduits en location meublée sont réintégrés dans le calcul de la plus-value. Ce simulateur calcule l'impact exact sur votre impôt, avec comparaison avant/après réforme."
        heroBadges={[
          { icon: "⚠️", label: "Réforme 2025 intégrée" },
          { icon: "📊", label: "Comparaison avant/après" },
          { icon: "🧮", label: "Amortissements réintégrés" },
          { icon: "📄", label: "Export PDF inclus" },
        ]}
        caseBadge={{
          label: "Régime LMNP — amortissements réintégrés (réforme 2025)",
          color: "menthe",
        }}
        customTitle="Calculez votre plus-value LMNP avec la réintégration des amortissements"
        customSubtitle="Renseignez les informations de votre bien meublé. Le simulateur applique automatiquement la réforme 2025 (réintégration des amortissements), les abattements pour durée de détention et la surtaxe si applicable."
        customBadges={[
          { icon: "⚠️", text: "Réforme 2025 prise en compte" },
          { icon: "📊", text: "Comparaison avant/après réforme" },
          { icon: "💡", text: "Pistes d\u2019optimisation LMNP" },
        ]}
        customAlertBanner={<LMNPAlertBanner />}
        customSocialProof={<LMNPSocialProof />}
        customCTA={<CTAExpertComptable />}
        customExamplesSection={<ExamplesSectionLMNP />}
        customAbattementsSection={<AbattementsTableLMNP />}
        customSimulateurCards={<></>}
        customFAQSection={<></>}
        customSourcesSection={<></>}
        lockedTypeLabel="Location meublée (LMNP)"
        tooltipAmortissements="Indiquez le total de tous les amortissements que vous avez déduits de vos revenus BIC depuis l'acquisition. Ce chiffre se trouve sur vos liasses fiscales (formulaire 2033-B, colonne « Amortissements déduits au titre de l'exercice », cumulé sur toutes les années). Si vous avez un expert-comptable, demandez-lui le total cumulé des amortissements : bâti + mobilier + travaux amortis."
      />
      <ContentLMNP />
      <div style={{ background: "#F4F3FA" }}>
        <FAQSectionLMNP />
        <SourcesLegalesLMNP />
      </div>
      {/* Bloc "À lire aussi" — article LMNP */}
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", padding: "0 24px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "#EEEDF5", borderLeft: "3px solid #56CBAD", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 6 }}>
              📰 À lire aussi
            </div>
            <div style={{ fontSize: 14, color: "#2D2B55", lineHeight: 1.6, marginBottom: 4 }}>
              <strong>« Je vends mon LMNP en 2026 : combien vais-je payer après la réforme ? »</strong>
            </div>
            <div style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.5, marginBottom: 10 }}>
              Cas concret avec calcul étape par étape, comparaison avant/après réforme, et leviers pour réduire l'impôt.
            </div>
            <Link href="/blog/vendre-lmnp-2026" style={{ fontSize: 14, color: "#56CBAD", fontWeight: 600, textDecoration: "none" }}>
              → Lire l'article
            </Link>
          </div>
        </div>
      </div>
      <AutresSimulateurs />
    </>
  );
}
