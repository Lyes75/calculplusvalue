"use client";
import { C } from "@/lib/constants";

const steps = [
  {
    num: "1",
    title: "Renseignez votre achat",
    desc: "Prix d'achat, date d'acquisition, travaux réalisés, frais de cession. Le simulateur accepte les forfaits ou les montants réels.",
  },
  {
    num: "2",
    title: "Obtenez le détail de l'impôt",
    desc: "Plus-value brute, abattements IR et PS, surtaxe éventuelle, montant net vendeur. Tout est calculé en temps réel.",
  },
  {
    num: "3",
    title: "Comparez et optimisez",
    desc: "Comparez les scénarios de vente dans le temps. Découvrez les pistes d'optimisation. Téléchargez votre rapport PDF.",
  },
];

export default function HowItWorks() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 24,
          fontWeight: 400,
          color: C.text,
          marginBottom: 24,
          marginTop: 0,
        }}
      >
        Comment calculer votre plus-value en 3 étapes
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {steps.map((step) => (
          <div
            key={step.num}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "24px 20px",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: C.accentBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                color: C.accent,
                marginBottom: 12,
              }}
            >
              {step.num}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>
              {step.title}
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
