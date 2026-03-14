"use client";
import dynamic from "next/dynamic";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

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
            Avant 2025, le LMNP bénéficiait d'un double avantage : amortir le bien pour réduire ses revenus imposables <em>et</em> vendre au régime des plus-values particulières (avec abattements). La réforme met fin à ce double avantage en diminuant le prix d'acquisition corrigé du montant des amortissements déduits, ce qui augmente la plus-value brute imposable.
          </p>
        </div>

        {/* Section 2 — Exemple chiffré */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Exemple concret : l'impact chiffré
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          Prenons un appartement acheté 200 000 € il y a 10 ans, vendu 300 000 €, avec 15 000 € de frais de notaire (forfait 7,5%) et 40 000 € d'amortissements cumulés déduits sur 10 ans.
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
          ⚠️ <strong>Surcoût fiscal dans cet exemple :</strong> +11 625 € d'impôt supplémentaire dû à la réintégration des 40 000 € d'amortissements, soit un impact de 29% de la plus-value additionnelle.
        </div>

        {/* Section 3 — Réduire l'impact */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Comment réduire l'impact de la réforme ?
        </h2>
        <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
          {[
            {
              icon: "⏳",
              title: "Attendre l'exonération IR (22 ans)",
              desc: "Plus la durée de détention est longue, plus les abattements réduisent la plus-value imposable. À 22 ans de détention, vous êtes totalement exonéré d'IR (19%), et à 30 ans, exonéré aussi des prélèvements sociaux (17,2%) — y compris sur la partie liée aux amortissements réintégrés.",
            },
            {
              icon: "🔧",
              title: "Maximiser les charges déductibles à la vente",
              desc: "Les frais d'agence à votre charge, les diagnostics obligatoires, la mainlevée d'hypothèque et les travaux de remise en état réalisés par des entreprises réduisent le prix de vente corrigé ou augmentent le prix d'acquisition corrigé, diminuant ainsi la plus-value brute.",
            },
            {
              icon: "👥",
              title: "Vente en indivision pour éviter la surtaxe",
              desc: "Si votre plus-value nette dépasse 50 000 €, une surtaxe progressive s'applique. En cas de bien détenu en indivision, le seuil de 50 000 € s'apprécie par quote-part. Vendre à deux peut permettre d'éviter cette surtaxe additionnelle.",
            },
            {
              icon: "📋",
              title: "Vérifier votre statut LMP",
              desc: "Si vos recettes locatives dépassent 23 000 € par an et sont supérieures à vos autres revenus professionnels, vous êtes LMP (Loueur Meublé Professionnel). Ce régime offre des exonérations totales après 5 ans d'activité si les recettes sont < 90 000 € (art. 151 septies CGI). Consultez un expert-comptable pour évaluer cette option.",
            },
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
            {
              label: "LMNP",
              color: "#3F3D6E",
              bg: "#EEEDF5",
              items: [
                "Recettes < 23 000 € OU < revenus professionnels",
                "Plus-value : régime des particuliers",
                "IR 19% + PS 17,2%",
                "Abattements pour durée de détention",
                "Réintégration des amortissements depuis 2025",
                "Surtaxe si PV nette > 50 000 €",
              ],
            },
            {
              label: "LMP",
              color: "#2D8C5F",
              bg: "#E8F7F0",
              items: [
                "Recettes > 23 000 € ET > revenus professionnels",
                "Plus-value : régime des professionnels",
                "Exonération totale si recettes < 90K€ après 5 ans",
                "Exonération partielle si recettes 90K€ - 126K€",
                "Pas de réintégration des amortissements (art. 151 septies)",
                "Imposition sur les plus-values à court terme = revenus",
              ],
            },
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

        {/* Bloc de liens internes */}
        <div style={{ background: "#EEEDF5", borderRadius: 12, padding: "24px 20px", border: "1px solid #D6D4EC" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 14 }}>🔗 Autres simulateurs sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              {
                href: "/",
                icon: "🏠",
                title: "Simulateur général",
                desc: "Résidence secondaire, locatif, terrain",
              },
              {
                href: "/plus-value-sci",
                icon: "🏢",
                title: "Plus-value SCI",
                desc: "SCI à l'IR et SCI à l'IS",
              },
              {
                href: "/exonerations-plus-value",
                icon: "✅",
                title: "Exonérations",
                desc: "Résidence principale, cas spéciaux",
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#FAFAFE", border: "1px solid #E0DEF0", borderRadius: 10, padding: "14px 16px", textDecoration: "none", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,43,85,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
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
export default function LMNPClient() {
  return (
    <>
      <SimulateurBase
        defaultType="lmnp"
        showTypeResidence={false}
        showAmortissementsLMNP={true}
        caseBadge={{
          label: "Régime LMNP — amortissements réintégrés (réforme 2025)",
          color: "menthe",
        }}
      />
      <ContentLMNP />
    </>
  );
}
