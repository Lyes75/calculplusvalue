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

function ContentTerrain() {
  return (
    <div style={{ background: "#FFFFFF", borderTop: `1px solid ${C.border}`, padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* H2 : Mêmes règles, une exception */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Plus-value terrain : les mêmes règles, une exception
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            La cession d'un terrain est soumise au régime général de la plus-value immobilière des particuliers : taux d'IR de 19%, prélèvements sociaux de 17,2%, abattements progressifs pour durée de détention dès la 6e année, surtaxe au-delà de 50 000 € de plus-value nette. Une seule différence notable : le <strong>forfait de 15% pour travaux ne s'applique pas</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "✅", title: "Abattements identiques", desc: "6%/an dès la 6e année → exonération IR à 22 ans, PS à 30 ans. Les mêmes barèmes qu'un appartement.", ok: true },
              { icon: "✅", title: "Forfait 7,5% frais d'achat", desc: "Le forfait frais d'acquisition reste applicable au terrain.", ok: true },
              { icon: "❌", title: "Pas de forfait travaux 15%", desc: "Le forfait de 15% est réservé aux biens bâtis. Sur un terrain non bâti, seuls les travaux réels facturés sont déductibles.", ok: false },
              { icon: "✅", title: "Frais réels déductibles", desc: "Viabilisation, géomètre-expert, bornage, clôture, drainage… déductibles sur factures d'une entreprise.", ok: true },
            ].map((item, i) => (
              <div key={i} style={{ background: item.ok ? C.greenBg : C.redBg, border: `1px solid ${item.ok ? C.greenBorder : "#E8B4B0"}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.amber }}>📊 Exemple : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Terrain acheté 40 000 € en 2010, vendu 90 000 € en 2026. Durée : 16 ans. Frais notaire forfait 3 000 €. Viabilisation réelle : 5 000 €. Prix d'achat corrigé : 48 000 €. PV brute : 42 000 €. Après abattements (66% IR, 26,4% PS) → Impôt total ≈ 5 500 €.
            </span>
          </div>
        </section>

        {/* H2 : Division parcellaire */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Cas de la division parcellaire
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            Vendre une partie de son jardin ou diviser une grande parcelle est de plus en plus courant dans les zones de densification urbaine. La plus-value se calcule au prorata de la surface cédée.
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 12 }}>⚙️ Formule de calcul pour une division parcellaire</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Prix d'acquisition du terrain cédé = Prix d'achat total × (Surface cédée ÷ Surface totale du bien)",
                "La durée de détention court depuis l'achat initial du bien (pas depuis la date du permis de diviser)",
                "Si le terrain est attenant à la résidence principale et constitue une dépendance immédiate et nécessaire, l'exonération résidence principale peut s'appliquer — condition : vente simultanée avec la maison",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "14px 18px" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: C.green }}>📊 Exemple : </span>
            <span style={{ fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
              Maison achetée 300 000 € sur 1 200 m² en 2008. Vous vendez 400 m² de jardin en 2026 pour 80 000 €. Prix d'acquisition retenu : 300 000 × (400/1 200) = 100 000 €. Moins-value : aucune plus-value imposable.
            </span>
          </div>
        </section>

        {/* H2 : Taxe art. 1529 */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Taxe forfaitaire sur les terrains devenus constructibles (art. 1529 CGI)
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20, maxWidth: 780 }}>
            En sus de l'impôt classique sur la plus-value, certaines communes ont institué une taxe forfaitaire sur la cession de terrains nus ayant été rendus constructibles par une modification du plan local d'urbanisme (PLU).
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { label: "Taux", val: "10% de la plus-value brute — calculée comme différence entre le prix de cession et le prix d'acquisition majoré de l'inflation" },
                { label: "Qui l'applique ?", val: "Uniquement les communes qui ont délibéré en ce sens. Vérifiez auprès de votre mairie ou dans l'acte de vente." },
                { label: "Exonérations", val: "Détention > 18 ans depuis le classement constructible, ou prix de cession ≤ 15 000 €, ou premier reclassement avant le 13/01/2010" },
                { label: "Cumul", val: "Cette taxe s'ajoute à l'impôt sur la plus-value classique (IR + PS). Elle est due indépendamment des abattements pour durée de détention" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: C.indigo, minWidth: 120, flexShrink: 0 }}>{item.label} :</span>
                  <span>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
            ⚠️ <strong>Note :</strong> Notre simulateur ne calcule pas cette taxe communale facultative. Vérifiez auprès de votre mairie si elle s'applique dans votre commune avant la vente.
          </div>
        </section>

        {/* H2 : Exonération ≤ 15 000 € */}
        <section style={{ marginBottom: 52 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400, color: C.indigo, marginTop: 0, marginBottom: 12 }}>
            Exonération des cessions de terrain ≤ 15 000 €
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 16, maxWidth: 780 }}>
            Lorsque le prix de cession d'un terrain est inférieur ou égal à 15 000 €, la plus-value est totalement exonérée d'IR et de prélèvements sociaux (art. 150 U II 6° CGI).
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                "Le seuil de 15 000 € s'apprécie par cédant — pas par bien.",
                "En cas d'indivision, la limite s'apprécie sur la quote-part du cédant (ex : si le terrain vaut 25 000 € et que vous en détenez 50%, votre quote-part est 12 500 € → exonération).",
                "Concerne surtout les petits terrains agricoles, jardins, chemins… cédés à faible prix.",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: C.indigoMid, lineHeight: 1.6 }}>
                  <span style={{ color: C.menthe, fontWeight: 700, flexShrink: 0 }}>→</span>
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
              { href: "/plus-value-indivision", icon: "👥", title: "Indivision", desc: "Quote-part et abattements" },
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

export default function TerrainClient() {
  return (
    <>
      <SimulateurBase
        defaultType="terrain"
        showTypeResidence={false}
        disableForfaitTravaux={true}
        caseBadge={{ label: "Terrain — forfait travaux non applicable", color: "#2D2B55" }}
      />
      <ContentTerrain />
    </>
  );
}
