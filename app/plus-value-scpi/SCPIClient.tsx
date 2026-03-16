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

function ContentSCPI() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* H2 : Régime des particuliers */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            La plus-value SCPI suit le régime des particuliers
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            La cession de parts de SCPI (Société Civile de Placement Immobilier) détenues en direct est soumise au même régime fiscal que la plus-value immobilière des particuliers (art. 150 U et suivants du CGI). Les abattements pour durée de détention s'appliquent de la même façon qu'un bien en direct.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Abattements identiques", desc: "6%/an dès la 6e année → exonération IR à 22 ans, PS à 30 ans. La durée court depuis la date de souscription des parts." },
              { icon: "✅", title: "Prix d'acquisition = souscription", desc: "Le prix retenu est le prix de souscription initial (ou le prix payé en marché secondaire). Augmenté des frais de souscription." },
              { icon: "✅", title: "Prix de cession", desc: "Prix de revente sur le marché secondaire (fixé par l'offre et la demande) ou valeur de retrait fixée par la société de gestion." },
              { icon: "❌", title: "Pas de forfait travaux 15%", desc: "Le forfait de 15% pour travaux ne s'applique pas aux parts de SCPI — pas de travaux déductibles sur des parts sociales." },
            ].map((item, i) => (
              <div key={i} style={{ background: item.icon === "✅" ? C.greenBg : C.redBg, border: `1px solid ${item.icon === "✅" ? C.greenBorder : "#E8B4B0"}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>📊 Exemple : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Parts souscrites 50 000 € en 2010, revendues 75 000 € en 2026. Frais de souscription réels : 5 000 €. Prix d'achat corrigé : 55 000 €. PV brute : 20 000 €. Détention 16 ans → abattement IR 66%, abattement PS 26,4%. Impôt total ≈ 2 100 €.
            </span>
          </div>
        </section>

        {/* H2 : Frais de souscription */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Frais de souscription : le forfait ou le réel ?
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Les frais de souscription SCPI sont généralement de <strong>8 à 12% du prix de souscription</strong> — ils couvrent les frais de collecte, de gestion, de garantie et de commercialisation. Cette spécificité rend le forfait de 7,5% presque toujours <strong>moins avantageux que les frais réels</strong>.
          </p>

          {/* Tableau comparaison */}
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#FFFFFF", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(45,43,85,0.07)" }}>
              <thead>
                <tr style={{ background: C.indigo, color: "#FFFFFF" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700 }}>Scénario</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, color: "#9B97C4" }}>Forfait 7,5%</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, color: "#56CBAD" }}>Frais réels 10%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Souscription", "50 000 €", "50 000 €"],
                  ["Frais déductibles", "3 750 €", "5 000 €"],
                  ["Prix d'achat corrigé", "53 750 €", "55 000 €"],
                  ["Prix de cession (16 ans)", "75 000 €", "75 000 €"],
                  ["Plus-value brute", "21 250 €", "20 000 €"],
                  ["Différence d'impôt", "—", "↓ ~280 € économisés"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#FFFFFF" : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 16px", color: C.muted }}>{row[0]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", color: i === 5 ? C.red : C.indigoMid }}>{row[1]}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: i >= 3 ? 600 : 400, color: i === 5 ? C.green : C.indigo }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.amber }}>💡 Conseil pratique : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Demandez à votre société de gestion un justificatif détaillant les frais de souscription effectivement payés. Dans la quasi-totalité des cas, les frais réels SCPI (8 à 12%) sont supérieurs au forfait 7,5% — optez systématiquement pour les frais réels pour maximiser votre déduction.
            </span>
          </div>
        </section>

        {/* H2 : SCPI en assurance-vie */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            SCPI en assurance-vie : un régime différent
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Si vos parts de SCPI sont détenues dans un contrat d'assurance-vie, la fiscalité applicable est celle de l'assurance-vie — pas celle des plus-values immobilières.
          </p>
          <div style={{ background: C.redBg, border: `1px solid #E8B4B0`, borderRadius: 10, padding: "14px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 10 }}>⚠️ Ce simulateur ne s'applique pas aux SCPI en assurance-vie</div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                "En assurance-vie, la taxation est celle du contrat (PFU 30% ou barème IR + PS), avec abattement annuel de 4 600 € (9 200 € pour un couple) sur les gains après 8 ans.",
                "Les retraits partiels sont fiscalisés selon une quote-part gains/capital — pas sur la plus-value nette.",
                "La plus-value immobilière sous-jacente (réalisée par la SCPI elle-même) est imposée au niveau de la SCPI et répercutée dans la valeur de la part, sans imposition directe pour l'assuré.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Ce simulateur concerne uniquement les parts de SCPI détenues <strong>en direct</strong> (hors enveloppe d'assurance-vie ou PER).
          </div>
        </section>

        {/* H2 : Marché secondaire vs rachat */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Marché secondaire vs rachat par la société de gestion
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Il existe deux façons de céder ses parts de SCPI, avec des implications légèrement différentes sur le prix de cession.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              {
                title: "🔄 Marché secondaire (SCPI à capital variable)",
                points: [
                  "Prix fixé librement par l'offre et la demande",
                  "Nécessite un acheteur — délai variable",
                  "Prix de cession = prix de vente effectif",
                  "Frais de cession éventuels à déduire",
                ],
              },
              {
                title: "💰 Rachat par la société de gestion (SCPI à capital fixe)",
                points: [
                  "Prix de retrait fixé par la société = valeur de réalisation moins une décote (souvent 5 à 10%)",
                  "La société rachète selon ses disponibilités — liste d'attente possible",
                  "Prix de cession = prix de retrait net",
                  "Calculer la PV depuis le prix de souscription initial",
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
        </section>

        {/* Maillage interne */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.indigo, marginBottom: 16 }}>🔗 Simulateurs spécialisés sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-sci", icon: "🏢", title: "Plus-value SCI", desc: "SCI à l'IR ou à l'IS" },
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

export default function SCPIClient() {
  return (
    <>
      <SimulateurBase
        defaultType="scpi"
        showTypeResidence={false}
        disableForfaitTravaux={true}
        labelPrixAchat="Prix d'acquisition des parts"
        labelFraisAcquisition="Frais de souscription"
        heroEyebrow="Simulateur cession de parts SCPI"
        heroTitle="Plus-value sur la revente de parts de SCPI"
        heroDescription="Régime des plus-values des particuliers. Les frais de souscription (8-12%) sont souvent plus avantageux que le forfait 7,5%. Pas de forfait travaux applicable."
        heroBadges={[
          { icon: "📈", label: "Frais de souscription déductibles" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "🔒", label: "Gratuit, sans inscription" },
          { icon: "📄", label: "Export PDF inclus" },
        ]}
        caseBadge={{ label: "Parts de SCPI — régime des particuliers", color: "#2D2B55" }}
      />
      <ContentSCPI />
    </>
  );
}
