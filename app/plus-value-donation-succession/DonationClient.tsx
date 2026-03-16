"use client";
import dynamic from "next/dynamic";

const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });

// ── Contenu éditorial Donation / Succession ──────────────────────────────────
function ContentDonation() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F4F3FA", borderTop: "1px solid #E0DEF0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Section 1 — Valeur d'acquisition */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "#2D2B55", marginBottom: 8, marginTop: 0 }}>
          Quelle valeur retenir comme prix d'acquisition ?
        </h2>
        <p style={{ fontSize: 15, color: "#6E6B8A", lineHeight: 1.7, marginBottom: 20, maxWidth: 760 }}>
          Contrairement à une acquisition classique, il n'y a pas de prix d'achat à proprement parler. La base de calcul de la plus-value repose sur la <strong>valeur vénale déclarée</strong> dans l'acte.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            {
              icon: "🎁",
              title: "Donation",
              items: [
                "Valeur vénale déclarée dans l'acte notarié de donation",
                "Cette valeur est fixée par le donateur et le donataire d'un commun accord",
                "Elle doit correspondre à la valeur du marché au jour de la donation",
                "En cas de donation-partage, c'est la valeur fixée par le notaire qui prévaut",
              ],
              color: "#56CBAD",
              bg: "#EEEDF5",
            },
            {
              icon: "⚖️",
              title: "Succession",
              items: [
                "Valeur vénale déclarée dans la déclaration de succession",
                "Elle doit refléter la valeur du bien au jour du décès",
                "Fixée par les héritiers, sous contrôle de l'administration fiscale",
                "Le fisc peut contester une valeur manifestement sous-évaluée",
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
          ⚠️ <strong>Risque de sous-évaluation :</strong> Si le bien a été déclaré à une valeur inférieure à sa valeur réelle dans l'acte (parfois pour réduire les droits de mutation), la plus-value sera mécaniquement plus élevée lors de la vente. Le fisc peut également remettre en cause la valeur déclarée et rehausser la base imposable.
        </div>

        {/* Section 2 — Frais déductibles */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Les frais déductibles en cas de donation ou succession
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          Le régime est plus strict qu'en cas d'achat : <strong>le forfait de 7,5% ne s'applique pas</strong>. Seuls les frais réellement engagés et effectivement payés par le vendeur (héritier ou donataire) sont déductibles.
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
          {[
            { ok: true, label: "✅ Droits de mutation à titre gratuit (droits de succession ou de donation)", desc: "À condition qu'ils aient été effectivement payés par le vendeur et non pris en charge par le donateur." },
            { ok: true, label: "✅ Frais de notaire réels de l'acte de donation ou de la déclaration de succession", desc: "Émoluments du notaire, droits d'enregistrement, frais divers liés à l'acte." },
            { ok: true, label: "✅ Forfait 15% travaux (si détention > 5 ans)", desc: "Ce forfait reste applicable, calculé sur la valeur déclarée dans l'acte. Vous pouvez aussi déduire les travaux réels sur factures d'entreprises." },
            { ok: false, label: "❌ Droits payés par le donateur à sa charge", desc: "Si le donateur a pris les frais à sa charge lors de la donation, ces droits ne sont pas déductibles par le donataire." },
            { ok: false, label: "❌ Forfait de frais d'acquisition de 7,5%", desc: "Ce forfait est réservé aux acquisitions à titre onéreux (achat). Il ne s'applique pas aux transmissions gratuites (donation et succession)." },
          ].map((item, i) => (
            <div key={i} style={{ background: item.ok ? "#F0FAF5" : "#FDF0EE", border: `1px solid ${item.ok ? "#B5DECA" : "#E8B4B0"}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.ok ? "#2D8C5F" : "#C0392B", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6E6B8A", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Section 3 — Durée de détention */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Durée de détention : depuis quand ça court ?
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          La durée de détention détermine les abattements applicables. Elle ne court pas depuis la date d'acquisition initiale par le donateur, mais depuis la transmission gratuite.
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "📅", title: "Donation classique", desc: "Depuis la date de l'acte notarié de donation. Si le donateur avait lui-même acquis le bien il y a 20 ans, les abattements repartent à zéro à compter de la date de donation." },
            { icon: "⚰️", title: "Succession / Héritage", desc: "Depuis la date du décès, quelle que soit la date de publication de la déclaration de succession ou du partage entre héritiers." },
            { icon: "🌳", title: "Donation avec réserve d'usufruit", desc: "Depuis la date de la donation initiale (pas la date de réunion de l'usufruit lors du décès du donateur). La nue-propriété transmise à cette date fait courir le délai." },
            { icon: "📋", title: "Donation-partage", desc: "Depuis la date de la donation-partage, même si elle a été consentie en avancement d'hoirie. La date de l'acte de donation-partage prévaut sur celle d'un acte antérieur." },
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

        {/* Section 4 — Exemple chiffré */}
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: "#2D2B55", marginBottom: 16, marginTop: 0 }}>
          Exemple chiffré : bien hérité en 2015, vendu en 2026
        </h2>
        <p style={{ fontSize: 14, color: "#6E6B8A", lineHeight: 1.6, marginBottom: 16 }}>
          Valeur déclarée dans la déclaration de succession : <strong>150 000 €</strong>. Droits de succession payés : <strong>8 000 €</strong>. Prix de vente en 2026 : <strong>230 000 €</strong>. Durée de détention : 11 ans.
        </p>

        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 420 }}>
            <thead>
              <tr style={{ background: "#2D2B55", color: "#E0DEF0" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Élément</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>Montant</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Prix de vente", "230 000 €", ""],
                ["− Frais de cession", "0 €", "Aucun frais d'agence ici"],
                ["= Prix de vente corrigé", "230 000 €", "", true],
                [null],
                ["Valeur déclarée (succession)", "150 000 €", "Déclaration de succession"],
                ["+ Droits de succession (frais réels)", "+ 8 000 €", "Effectivement payés par l'héritier"],
                ["+ Forfait travaux 15%", "+ 22 500 €", "150 000 × 15% — détention > 5 ans"],
                ["= Prix d'achat corrigé", "180 500 €", "", true],
                [null],
                ["Plus-value brute", "49 500 €", "230 000 − 180 500", true],
                [null],
                ["Abattement IR (11 ans = 36%)", "17 820 €", "6% × 6 ans"],
                ["PV nette IR", "31 680 €", "49 500 × 64%", true],
                ["Impôt IR (19%)", "6 019 €", "", true],
                [null],
                ["Abattement PS (11 ans = 9,9%)", "4 901 €", "1,65% × 6 ans"],
                ["PV nette PS", "44 599 €", "49 500 × 90,1%", true],
                ["PS (17,2%)", "7 671 €", "", true],
                [null],
                ["TOTAL IMPÔT", "13 690 €", "Taux effectif : 27,7%", true],
                ["NET VENDEUR", "216 310 €", "Après impôt", true],
              ].map((row, i) => row[0] === null ? (
                <tr key={i}><td colSpan={3} style={{ height: 6 }}></td></tr>
              ) : (
                <tr key={i} style={{ background: i % 2 === 0 ? "#F4F3FA" : "#FAFAFE", borderBottom: "1px solid #E0DEF0" }}>
                  <td style={{ padding: "9px 14px", fontWeight: row[3] ? 700 : 400, color: "#2D2B55" }}>{row[0]}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: row[3] ? 700 : 500, color: row[3] ? "#2D2B55" : "#6E6B8A" }}>{row[1]}</td>
                  <td style={{ padding: "9px 14px", fontSize: 12, color: "#9B97C4" }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: "#EEEDF5", borderLeft: "4px solid #56CBAD", borderRadius: 8, padding: "14px 18px", marginBottom: 32, fontSize: 13, color: "#3F3D6E", lineHeight: 1.6 }}>
          💡 <strong>Point clé :</strong> Grâce au forfait travaux de 15% (22 500 €), la plus-value brute passe de 72 000 € à 49 500 €. Si la détention avait dépassé 22 ans, l'IR serait nul (exonération totale).
        </div>

        {/* Liens internes */}
        <div style={{ background: "#EEEDF5", borderRadius: 12, padding: "24px 20px", border: "1px solid #D6D4EC" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2B55", marginBottom: 14 }}>🔗 Autres simulateurs sur calculplusvalue.fr</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { href: "/", icon: "🏠", title: "Simulateur général", desc: "Résidence secondaire, locatif, terrain" },
              { href: "/plus-value-indivision", icon: "👥", title: "Indivision & démembrement", desc: "Quote-part, usufruit, nue-propriété" },
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
export default function DonationClient() {
  return (
    <>
      <SimulateurBase
        defaultType="secondaire"
        defaultMode="succession"
        showTypeResidence={true}
        showModeAcquisition={true}
        disableForfaitFrais={true}
        labelPrixAchat="Valeur déclarée dans l'acte"
        labelFraisAcquisition="Frais réels (droits de mutation + notaire)"
        heroEyebrow="Simulateur donation & succession"
        heroTitle="Plus-value sur un bien hérité ou reçu en donation"
        heroDescription="Le prix d'acquisition retenu est la valeur déclarée dans l'acte. Frais réels uniquement (pas de forfait 7,5%). Durée de détention depuis la date du décès ou de la donation."
        heroBadges={[
          { icon: "🎁", label: "Valeur déclarée dans l'acte" },
          { icon: "📋", label: "Frais réels uniquement" },
          { icon: "📐", label: "Barèmes CGI 2026" },
          { icon: "📄", label: "Export PDF" },
        ]}
        caseBadge={{
          label: "Bien reçu par donation ou succession",
          color: "menthe",
        }}
      />
      <ContentDonation />
    </>
  );
}
