"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

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
        caseBadge={{ label: "SCI — choisissez IR ou IS", color: "#2D2B55" }}
      />
      <ContentSCI />
    </>
  );
}
