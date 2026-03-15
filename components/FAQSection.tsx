"use client";
import { useState } from "react";
import Link from "next/link";
import { C } from "@/lib/constants";

const faqData: { q: string; a: React.ReactNode }[] = [
  {
    q: "Combien d'impôt vais-je payer sur ma plus-value immobilière ?",
    a: (
      <>La plus-value est taxée à 36,2% au taux plein (19% d&apos;IR + 17,2% de PS). Mais les abattements pour durée de détention réduisent ce taux progressivement. Après 15 ans, le taux effectif tombe à environ 17%. Après 22 ans, l&apos;IR est exonéré. Après 30 ans, plus aucun impôt. Utilisez le simulateur ci-dessus pour votre montant exact.</>
    ),
  },
  {
    q: "Après combien d'années est-on exonéré de plus-value ?",
    a: (
      <>L&apos;exonération est progressive : l&apos;IR (19%) est totalement exonéré après 22 ans, les PS (17,2%) après 30 ans. Entre 22 et 30 ans, seuls les PS restent dus sur un montant réduit. L&apos;onglet &quot;Scénarios&quot; du simulateur montre l&apos;évolution année par année.</>
    ),
  },
  {
    q: "Comment réduire le montant de ma plus-value imposable ?",
    a: (
      <>Quatre leviers : déduisez vos frais d&apos;acquisition (forfait 7,5% ou réels), déduisez vos travaux (forfait 15% après 5 ans ou factures réelles), déduisez vos frais de cession (diagnostics, agence), et si possible attendez un seuil d&apos;abattement favorable. Notre comparateur de scénarios indique l&apos;économie potentielle en décalant la vente.</>
    ),
  },
  {
    q: "La plus-value est-elle imposée si je vends ma résidence principale ?",
    a: (
      <>Non. La vente de votre résidence principale est totalement exonérée, quelle que soit la durée de détention et le montant du gain. Le bien doit être votre RP effective au jour de la vente. Si vous avez déménagé, un délai d&apos;environ un an est toléré sans location entre-temps. <Link href="/exonerations-plus-value" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Tous les cas d&apos;exonération →</Link></>
    ),
  },
  {
    q: "Que change la réforme LMNP 2025 pour la plus-value ?",
    a: (
      <>Les amortissements déduits en LMNP sont désormais réintégrés dans le calcul de la plus-value. Votre prix d&apos;acquisition est réduit des amortissements, ce qui augmente la plus-value imposable. Par exemple, pour un bien acheté 200 000€ avec 50 000€ d&apos;amortissements, la base de calcul part de 150 000€. <Link href="/plus-value-lmnp" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur LMNP dédié →</Link></>
    ),
  },
  {
    q: "Un non-résident paie-t-il le même impôt sur la plus-value ?",
    a: (
      <>Pas exactement. L&apos;IR reste à 19%, mais les PS sont réduits à 7,5% pour les non-résidents affiliés à la sécurité sociale UE/EEE. Le taux total passe de 36,2% à 26,5%. De plus, une exonération jusqu&apos;à 150 000€ de PV nette est possible pour les anciens résidents fiscaux. <Link href="/plus-value-non-resident" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur non-résident →</Link></>
    ),
  },
  {
    q: "Comment est calculée la plus-value d'un bien hérité ?",
    a: (
      <>Le prix d&apos;acquisition retenu est la valeur déclarée dans la déclaration de succession. La durée de détention court depuis la date du décès. Seuls les frais réels sont déductibles (droits de succession + notaire) — le forfait 7,5% ne s&apos;applique pas. <Link href="/plus-value-donation-succession" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Simulateur donation/succession →</Link></>
    ),
  },
  {
    q: "Qu'est-ce que la surtaxe sur les plus-values supérieures à 50 000€ ?",
    a: (
      <>Quand la PV nette (après abattements) dépasse 50 000€, une surtaxe de 2% à 6% s&apos;ajoute. Elle est calculée sur le montant total, pas sur la fraction au-dessus de 50 000€. En indivision, le seuil s&apos;apprécie par vendeur — à deux, vous pouvez y échapper si chaque part reste sous 50 000€.</>
    ),
  },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 8, marginTop: 0 }}>
        Questions fréquentes sur la plus-value immobilière
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 24px 0" }}>
        Vous avez une question ? Nos réponses couvrent les cas les plus courants. Pour les situations spécifiques, consultez nos simulateurs dédiés.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {faqData.map((item, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text }}>{item.q}</span>
              <span style={{ fontSize: 20, color: C.accent, flexShrink: 0, lineHeight: 1, transition: "transform 0.3s" }}>
                {openFaq === i ? "−" : "+"}
              </span>
            </button>
            <div style={{ maxHeight: openFaq === i ? 500 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
              <div style={{ padding: "0 20px 16px", fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
                {item.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
