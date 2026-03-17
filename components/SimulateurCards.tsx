"use client";
import Link from "next/link";
import { C } from "@/lib/constants";

const cards = [
  { icon: "🛏️", title: "Location meublée (LMNP)", desc: "Impact des amortissements réintégrés — réforme 2025", href: "/plus-value-lmnp" },
  { icon: "🌍", title: "Expatrié / Non-résident", desc: "PS réduits à 7,5% (UE), exonération 150K€", href: "/plus-value-non-resident" },
  { icon: "🎁", title: "Bien hérité ou donné", desc: "Valeur déclarée, frais réels, durée de détention", href: "/plus-value-donation-succession" },
  { icon: "🏢", title: "SCI (IR ou IS)", desc: "Quote-part, comparaison IR vs IS, amortissements", href: "/plus-value-sci" },
  { icon: "🌱", title: "Terrain constructible", desc: "Pas de forfait travaux, taxe communale", href: "/plus-value-terrain" },
  { icon: "📈", title: "Parts de SCPI", desc: "Frais de souscription, régime des particuliers", href: "/plus-value-scpi" },
  { icon: "⚖️", title: "Indivision & Démembrement", desc: "Quote-part, surtaxe par indivisaire, barème art. 669 CGI", href: "/plus-value-indivision" },
];

export default function SimulateurCards() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Quel simulateur pour votre situation ?
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px 0", maxWidth: 720 }}>
        Chaque situation fiscale a ses spécificités. Nos simulateurs dédiés prennent en compte les règles exactes de votre cas.
      </p>

      <div className="sim-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="sim-card"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20,
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.2s, transform 0.2s",
              display: "block",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{card.desc}</div>
          </Link>
        ))}
      </div>

      <Link
        href="/exonerations-plus-value"
        className="sim-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: C.accentBg,
          border: "1px solid rgba(86,203,173,0.25)",
          borderRadius: 12,
          padding: 20,
          textDecoration: "none",
          color: "inherit",
          transition: "border-color 0.2s, transform 0.2s",
        }}
      >
        <div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>Vérifiez si vous êtes exonéré</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Résidence principale, durée de détention, retraité, primo-accédant… consultez le guide complet.</div>
        </div>
        <span style={{ fontSize: 20, color: C.accent, flexShrink: 0 }}>→</span>
      </Link>

      <style>{`
        .sim-card:hover {
          border-color: #56CBAD !important;
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .sim-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .sim-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
