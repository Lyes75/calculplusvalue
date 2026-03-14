"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

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

// Barème art. 669 CGI pour affichage
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
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>📊 Exemple : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Bien acheté 200 000 € en 2009, revendu 350 000 € en 2026, détenu à 60%/40% entre deux frères. Frère A (60%) : PV brute = 90 000 €. Frère B (40%) : PV brute = 60 000 €. Chacun bénéficie d'abattements de 17 ans. La surtaxe s'apprécie séparément sur les PV nettes IR de chacun.
            </span>
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
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.amber }}>📊 Exemple : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Bien vendu 300 000 €. L'usufruitier a 68 ans (tranche 61–70 ans → usufruit = 40%). La part de l'usufruitier : 120 000 €. Celle du nu-propriétaire : 180 000 €. Chacun calcule sa plus-value sur sa fraction respective.
            </span>
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

        {/* Maillage interne */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "SCI à l'IR ou à l'IS" },
              { href: "/plus-value-donation-succession", icon: "🎁", title: "Donation / Succession", desc: "Valeur d'acquisition et droits" },
              { href: "/exonerations-plus-value", icon: "✅", title: "Guide exonérations", desc: "Tous les cas d'exonération" },
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

export default function IndivisionClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        showTypeResidence={true}
        showDemembrement={true}
        caseBadge={{ label: "Indivision & Démembrement — calcul par fraction", color: "#2D2B55" }}
      />
      <ContentIndivision />
    </>
  );
}
