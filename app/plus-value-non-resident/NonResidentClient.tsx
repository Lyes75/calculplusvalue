"use client";
import dynamic from "next/dynamic";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

// ── Contenu éditorial Non-Résident ───────────────────────────────────────────
function ContentNonResident() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", borderTop: "1px solid #E0DEF0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Taux d'imposition */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "#2D2B55", marginBottom: 8, marginTop: 0 }}>
          Quel impôt sur la plus-value pour un non-résident ?
        </h2>
        <p style={{ fontSize: 15, color: "#6E6B8A", lineHeight: 1.7, marginBottom: 20, maxWidth: 760 }}>
          Les non-résidents qui vendent un bien immobilier situé en France sont soumis à l'impôt sur la plus-value immobilière, mais avec des <strong>taux et règles spécifiques</strong> selon leur pays de résidence.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { flag: "🇪🇺", label: "Non-résident UE/EEE/Suisse/UK", ir: "19%", ps: "7,5%*", total: "26,5%*", color: "#2D8C5F", bg: "#E8F7F0", note: "* Si affilié à un régime de sécu UE/EEE. Sinon 17,2% → total 36,2%" },
            { flag: "🌍", label: "Non-résident hors UE", ir: "19%", ps: "17,2%", total: "36,2%", color: "#3F3D6E", bg: "#EEEDF5", note: "Même taux que les résidents français" },
            { flag: "⚠️", label: "Pays non coopératif", ir: "33,33%", ps: "17,2%", total: "50,5%", color: "#C0392B", bg: "#FDF0EE", note: "Liste art. 238-0 A CGI — taux majoré" },
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, borderRadius: 12, padding: "18px 16px", border: `1px solid ${item.color}20` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.flag}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.color, marginBottom: 12, lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3F3D6E", marginBottom: 4 }}>
                <span>IR :</span><strong>{item.ir}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#3F3D6E", marginBottom: 4 }}>
                <span>PS :</span><strong>{item.ps}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: item.color, borderTop: "1px solid currentColor", borderTopColor: `${item.color}30`, paddingTop: 8, marginTop: 8 }}>
                <span style={{ fontWeight: 700 }}>Total :</span><strong>{item.total}</strong>
              </div>
              <div style={{ fontSize: 11, color: "#9B97C4", marginTop: 8, lineHeight: 1.4 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#EEEDF5", borderLeft: "4px solid #56CBAD", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#3F3D6E", lineHeight: 1.6 }}>
          <strong>💡 Le cas UE :</strong> Un expatrié français résidant en Allemagne, qui reste affilié à la sécurité sociale allemande, paie seulement <strong>26,5%</strong> (19% IR + 7,5% PS) au lieu de 36,2% pour un résident français. Une économie de 9,7 points sur la plus-value.
        </div>

        {/* Section 2 — Exonération 150K€ */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          L'exonération de 150 000 € pour les anciens résidents
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          L'article 150 U II 2° du CGI prévoit une <strong>exonération d'IR</strong> pour les non-résidents qui vendent leur bien en France, sous réserve de trois conditions cumulatives :
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {[
            { num: "1", title: "Avoir été domicilié en France ≥ 2 ans", desc: "À n'importe quel moment de votre vie, vous avez résidé fiscalement en France pendant au moins 2 ans consécutifs ou non." },
            { num: "2", title: "Céder dans les 10 ans suivant le départ", desc: "La vente doit intervenir au plus tard le 31 décembre de la 10e année suivant celle du transfert de domicile hors de France." },
            { num: "3", title: "Plus-value nette ≤ 150 000 €", desc: "L'exonération s'applique à la fraction de plus-value nette (après abattements) qui ne dépasse pas 150 000 €. Au-delà, l'IR est dû sur le surplus. Cette exonération n'est utilisable qu'une seule fois." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 14 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#56CBAD", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.num}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#2D2B55", marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Exemple chiffré exonération */}
        <div style={{ background: "#E8F7F0", border: "1px solid #B5DECA", borderRadius: 10, padding: "16px 18px", marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#2D8C5F", marginBottom: 10 }}>📊 Exemple : PV nette de 120 000 €, expatrié depuis 4 ans</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "IR (exonéré)", value: "0 €", note: "Art. 150 U II 2°", color: "#2D8C5F" },
              { label: "PS (7,5%)", value: "9 000 €", note: "120 000 × 7,5%", color: "#3F3D6E" },
              { label: "Total impôt", value: "9 000 €", note: "vs 43 440 € pour un résident", color: "#2D8C5F" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#6E6B8A", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color, fontFamily: "'DM Serif Display', serif" }}>{item.value}</div>
                <div style={{ fontSize: 11, color: "#9B97C4", marginTop: 2 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — Représentant fiscal */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Le représentant fiscal : quand est-il obligatoire ?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#FDF0EE", border: "1px solid #E8B4B0", borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#C0392B", marginBottom: 10 }}>⚠️ Obligatoire pour</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: "#3F3D6E", lineHeight: 2 }}>
              <li>Non-résidents <strong>hors UE/EEE</strong> si prix de vente {">"} 150 000 €</li>
              <li>Ou si la plus-value est positive (quelque soit le montant)</li>
              <li>Art. 244 bis A CGI</li>
            </ul>
          </div>
          <div style={{ background: "#E8F7F0", border: "1px solid #B5DECA", borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#2D8C5F", marginBottom: 10 }}>✅ Non obligatoire pour</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: "#3F3D6E", lineHeight: 2 }}>
              <li>Résidents <strong>UE/EEE/Suisse/UK</strong> depuis 2015</li>
              <li>Le notaire peut jouer ce rôle pour les non-résidents UE dans certains cas</li>
            </ul>
          </div>
        </div>
        <div style={{ background: "#EEEDF5", borderRadius: 10, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#3F3D6E", lineHeight: 1.7 }}>
          <strong>Rôle :</strong> Le représentant fiscal (société agréée par le fisc) vérifie le calcul de la plus-value, signe la déclaration 2048-IMM, et est garant auprès de l'administration fiscale. <strong>Coût moyen :</strong> 0,5% à 1% du prix de vente, soit entre 1 500 € et 3 000 € pour un bien vendu 300 000 €.
        </div>

        {/* Section 4 — Ancienne RP */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Cas de l'ancienne résidence principale
        </h2>
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {[
            { icon: "✅", title: "Exonération totale si vendue dans l'année du départ", desc: "Si vous vendez votre ancienne résidence principale dans l'année civile de votre départ à l'étranger, l'exonération résidence principale (art. 150 U II 1° CGI) s'applique. Le bien ne doit pas avoir été mis en location, ni occupé par un tiers, entre votre départ et la vente.", color: "#2D8C5F" },
            { icon: "⏰", title: "Délai dépassé : règles non-résident s'appliquent", desc: "Au-delà d'un an après votre départ, la vente est traitée comme celle de n'importe quel bien pour un non-résident. L'exonération RP ne s'applique plus. En revanche, l'exonération 150 000 € (art. 150 U II 2°) peut prendre le relais si vous remplissez les conditions.", color: "#D4923A" },
            { icon: "💡", title: "Stratégie : combiner les deux exonérations", desc: "Si vous n'avez pas pu vendre dans l'année du départ, vérifiez votre éligibilité à l'exonération 150 000 €. Si votre plus-value nette est inférieure à ce plafond et que vous êtes non-résident depuis moins de 10 ans, vous pouvez être totalement exonéré d'IR.", color: "#2D2B55" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, borderLeft: `4px solid ${item.color}` }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#6E6B8A", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bloc de liens internes */}
        <div style={{ background: "#EEEDF5", borderRadius: 12, padding: "24px 20px", border: "1px solid #D6D4EC" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 14 }}>🔗 Autres simulateurs sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-lmnp", icon: "🛋️", title: "Plus-value LMNP", desc: "Réintégration amortissements 2025" },
              { href: "/exonerations-plus-value", icon: "✅", title: "Exonérations", desc: "Résidence principale, cas spéciaux" },
            ].map((link, i) => (
              <a key={i} href={link.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 10, padding: "14px 16px", textDecoration: "none", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,43,85,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#2D2B55" }}>{link.title}</div>
                  <div style={{ fontSize: 12, color: "#6E6B8A", marginTop: 2 }}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Composant client principal ────────────────────────────────────────────────
export default function NonResidentClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        defaultSituation="non-resident-ue"
        showTypeResidence={true}
        showSituationVendeur={true}
        showNonResidentOptions={true}
        caseBadge={{
          label: "Non-résident — taux PS adaptés",
          color: "indigo",
        }}
      />
      <ContentNonResident />
    </>
  );
}
