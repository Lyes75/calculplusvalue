import Link from "next/link";

const C = {
  indigo: "#2D2B55",
  indigoLight: "#3F3D6E",
  menthe: "#56CBAD",
  bg: "#F4F3FA",
  border: "#D8D6E8",
  muted: "#6E6B8A",
  mutedLight: "#9B97C4",
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Je vends mon LMNP en 2026 : combien vais-je payer après la réforme ?",
  description:
    "Calcul détaillé de la plus-value LMNP après la réforme 2025. Impact des amortissements réintégrés, stratégies d'optimisation.",
  datePublished: "2026-03-17",
  dateModified: "2026-03-17",
  author: {
    "@type": "Organization",
    name: "calculplusvalue.fr",
    url: "https://www.calculplusvalue.fr",
  },
  publisher: {
    "@type": "Organization",
    name: "calculplusvalue.fr",
  },
  mainEntityOfPage: "https://www.calculplusvalue.fr/blog/vendre-lmnp-2026",
};

// ── Styles réutilisés ────────────────────────────────────────────────────────
const h2Style: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 24,
  fontWeight: 700,
  color: C.indigo,
  lineHeight: 1.3,
  marginTop: 48,
  marginBottom: 16,
};
const h3Style: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  color: C.indigoLight,
  lineHeight: 1.35,
  marginTop: 32,
  marginBottom: 12,
};
const pStyle: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.75,
  color: "#1E1C3A",
  marginBottom: 20,
};

export default function ArticleLMNP2026() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div style={{ background: "#FFFFFF", padding: "32px 20px 80px" }}>
        <article style={{ maxWidth: 720, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
          {/* Fil d'Ariane */}
          <nav style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>
            <Link href="/" style={{ color: C.menthe, textDecoration: "none" }}>Accueil</Link>
            <span style={{ margin: "0 6px" }}>&gt;</span>
            <Link href="/blog" style={{ color: C.menthe, textDecoration: "none" }}>Nos articles</Link>
            <span style={{ margin: "0 6px" }}>&gt;</span>
            <span>Je vends mon LMNP en 2026…</span>
          </nav>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 5vw, 36px)",
              fontWeight: 400,
              color: C.indigo,
              lineHeight: 1.25,
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            Je vends mon LMNP en 2026 : combien vais-je payer après la réforme ?
          </h1>

          <p style={{ fontSize: 14, color: C.muted, fontStyle: "italic", marginBottom: 40 }}>
            17 mars 2026
          </p>

          {/* ── Intro ── */}
          <p style={pStyle}>
            Si vous êtes propriétaire d'un meublé en LMNP au régime réel et vous pensez revendre celui-ci. Vous avez probablement entendu parler de la réforme LMNP de 2025.
          </p>
          <p style={pStyle}>
            Vous avez peut-être été alerté par votre expert-comptable qui vous a indiqué que les amortissements étaient désormais réintégrés dans la plus-value.
          </p>
          <p style={pStyle}>
            Le véritable problème est que personne ne vous explique concrètement ce que cela représente. On vous cite l'article 150 VB II du CGI, on vous indique que l'impact est « significatif », et l'on vous laisse ensuite avec toutes vos interrogations.
          </p>
          <p style={pStyle}>
            Nous allons donc réaliser le calcul de manière précise, à partir d'un cas concret représentatif.
          </p>

          {/* ── H2: Cas concret ── */}
          <h2 style={h2Style}>Cas concret : studio à Nantes, 8 ans de location, 38 500 € d'amortissements</h2>
          <p style={pStyle}>
            Prenons Sophie propriétaire d'un studio de 25 m² à Nantes, acheté 135 000 € en 2018. Depuis l'achat, le studio est loué meublé à des étudiants au régime réel.
          </p>
          <p style={pStyle}>
            L'expert-comptable de Sophie a effectué les amortissements conformément aux règles, sur le bâti, le mobilier et les petits travaux de rafraîchissement.
          </p>
          <p style={pStyle}>
            Le total cumulé après huit ans s'élève ainsi à <strong style={{ color: C.indigo }}>38 500 € d'amortissements déduits</strong>.
          </p>
          <p style={pStyle}>
            Sophie vend le studio en 2026 à 178 000 €. Les frais de cession s'élèvent à 800 € (diagnostics).
          </p>
          <p style={pStyle}>
            Avant la réforme, ces 38 500 € d'amortissements n'étaient pas intégrés au calcul de la plus-value. Ils avaient simplement permis d'alléger l'impôt sur les revenus locatifs pendant huit ans, sans incidence ultérieure.
          </p>
          <p style={pStyle}>
            Le prix d'acquisition de référence restait donc fixé à 135 000 €.
          </p>
          <p style={pStyle}>
            Cette approche appartient désormais au passé. Depuis la loi de finances pour 2025, l'administration fiscale considère que ces amortissements ont constitué un enrichissement qu'elle entend récupérer à la cession.
          </p>
          <p style={pStyle}>
            Le prix d'achat corrigé n'est plus de 135 000 €, mais de <strong style={{ color: C.indigo }}>135 000 € − 38 500 € = 96 500 €</strong>.
          </p>
          <p style={pStyle}>
            La plus-value brute s'en trouve dès lors fortement majorée.
          </p>

          {/* ── H2: Les chiffres ── */}
          <h2 style={h2Style}>Les chiffres</h2>
          <p style={pStyle}>
            Sophie vend son appartement 177 200 € et opte pour les forfaits (7,5 % pour les frais d'acquisition, 15 % pour les travaux). Elle détient l'appartement depuis plus de 5 ans. Ce sont les forfaits standard, calculés sur le prix d'achat d'origine de 135 000 €, pas sur le prix réduit.
          </p>

          <h3 style={h3Style}>Avant la réforme 2025</h3>
          <p style={pStyle}>
            Prix d'achat corrigé : 135 000 + 10 125 (forfait 7,5 %) + 20 250 (forfait 15 %) = <strong style={{ color: C.indigo }}>165 375 €</strong>. Plus-value brute : 177 200 − 165 375 = <strong style={{ color: C.indigo }}>11 825 €</strong>.
          </p>
          <p style={pStyle}>
            Avec les abattements de 8 ans (18 % en IR, 4,95 % en PS), cela donne environ 1 842 € d'IR et 1 933 € de PS.
          </p>
          <p style={pStyle}>
            <strong style={{ color: C.indigo }}>Imposition totale : 3 775 €.</strong>
          </p>

          <h3 style={h3Style}>Avec la réforme 2025</h3>
          <p style={pStyle}>
            Prix d'achat corrigé : 135 000 − 38 500 + 10 125 + 20 250 = <strong style={{ color: C.indigo }}>126 875 €</strong>. Plus-value brute : 177 200 − 126 875 = <strong style={{ color: C.indigo }}>50 325 €</strong>.
          </p>
          <p style={pStyle}>
            Mêmes abattements (18 % IR, 4,95 % PS), mais sur une base 4 fois plus grosse. Cela donne 7 841 € d'IR et 8 227 € de PS.
          </p>
          <p style={pStyle}>
            <strong style={{ color: C.indigo }}>Imposition totale : 16 068 €.</strong>
          </p>
          <p style={pStyle}>
            La facture a quadruplé. Sophie paie <strong style={{ color: C.indigo }}>12 293 € de plus</strong> qu'avant la réforme. Pour un studio vendu 177 200 €, ce montant est relativement élevé.
          </p>

          {/* ── H2: Le LMNP reste intéressant ? ── */}
          <h2 style={h2Style}>Est-ce que le LMNP reste une option intéressante ?</h2>
          <p style={pStyle}>
            Oui, et voici pourquoi :
          </p>
          <p style={pStyle}>
            Pendant 8 ans, Sophie a quasiment payé zéro d'impôt sur ses loyers grâce aux amortissements.
          </p>
          <p style={pStyle}>
            Sans le régime réel, elle aurait payé entre 2 500 € et 3 500 € par an d'impôt sur ses revenus locatifs (selon sa TMI).
          </p>
          <p style={pStyle}>
            Sur une période de 8 ans, cela correspond à <strong style={{ color: C.indigo }}>20 000 à 28 000 € d'économies</strong>.
          </p>
          <p style={pStyle}>
            La réforme lui reprend 12 293 € à la sortie. Le solde reste positif de 8 000 à 16 000 €.
          </p>
          <p style={pStyle}>
            Le LMNP au réel n'est plus un cadeau fiscal gratuit. C'est devenu un <strong style={{ color: C.indigo }}>différé d'imposition</strong>. Vous payez moins pendant la détention et un peu plus à la sortie. Cela reste avantageux, surtout sur de longues détentions où les abattements absorbent le surplus.
          </p>

          {/* ── H2: Détention courte ── */}
          <h2 style={h2Style}>Le cas de la détention courte avec de gros amortissements</h2>
          <p style={pStyle}>
            Le cas de Sophie est encore assez modéré : huit ans de détention, 38 500 € d'amortissements cumulés et une plus-value qui reste raisonnable.
          </p>
          <p style={pStyle}>
            En revanche, pour l'investisseur offensif qui a acheté il y a quatre ou cinq ans, qui a énormément amorti (bâti + mobilier haut de gamme + rénovation complète) et qui revend aujourd'hui, c'est beaucoup plus compliqué.
          </p>
          <p style={pStyle}>
            Sur 5 ans de détention : zéro abattement (ils commencent à la 6e année) avec 60 000 € ou 80 000 € d'amortissements cumulés qui se réintègrent intégralement dans la base imposable, taxés à 36,2 % sans aucun amortisseur. Là, on parle de <strong style={{ color: C.indigo }}>20 000 à 30 000 € d'impôt supplémentaire</strong>.
          </p>
          <p style={pStyle}>
            Si vous êtes dans ce cas, la question n'est pas "combien je vais payer" mais <strong style={{ color: C.indigo }}>n'ai-je pas plutôt intérêt à attendre 1 ou 2 années de plus</strong> (voir beaucoup plus) afin de déclencher les premiers abattements ?
          </p>

          {/* ── H2: Trois leviers ── */}
          <h2 style={h2Style}>Trois leviers à connaître avant de signer</h2>

          <h3 style={h3Style}>Attendre.</h3>
          <p style={pStyle}>
            Les abattements pour durée de détention fonctionnent toujours, y compris sur la part liée aux amortissements réintégrés. À 22 ans, l'IR est exonéré. À 30 ans, plus rien.
          </p>
          <p style={pStyle}>
            Si Sophie attendait 22 ans au total, son impôt tomberait à environ 6 200 € (PS seuls). Évidemment, attendre 14 ans pour économiser 10 000 € n'a de sens que si le rendement locatif reste correct et que vous n'avez pas besoin du capital.
          </p>

          <h3 style={h3Style}>Vérifiez bien votre statut de LMP.</h3>
          <p style={pStyle}>
            La règle est simple : si vos recettes locatives meublées dépassent 23 000 € par an et qu'elles sont supérieures à vos autres revenus professionnels, vous êtes automatiquement considéré comme LMP.
          </p>
          <p style={pStyle}>
            Et dans ce cas, bonne nouvelle : l'exonération de plus-value est totale après 5 ans d'activité, tant que vos recettes restent inférieures à 90 000 € (article 151 septies du CGI).
          </p>
          <p style={pStyle}>
            Sophie est à seulement 7 200 € de loyer par an, elle est donc très loin de ce seuil. Mais si vous avez 3 ou 4 biens meublés, il vaut mieux vérifier cela de près.
          </p>

          <h3 style={h3Style}>Optimiser les frais de cession.</h3>
          <p style={pStyle}>
            Diagnostics, frais d'agence à votre charge, mainlevée d'hypothèque, tout cela se déduit du prix de vente. Sophie n'a que 800 € de frais (diagnostics), la marge est faible. Mais sur un bien avec 15 000 € de frais d'agence, le calcul change.
          </p>

          {/* ── H2: Micro-BIC ── */}
          <h2 style={h2Style}>Le micro-BIC, grand gagnant surprise de la réforme</h2>
          <p style={pStyle}>
            Un dispositif sous-estimé dans le débat : le micro-BIC.
          </p>
          <p style={pStyle}>
            L'abattement forfaitaire de 50 % sur les loyers ne génère aucun amortissement comptable. Pas d'amortissement déduit, rien à réintégrer.
          </p>
          <p style={pStyle}>
            La plus-value se calcule exactement comme avant.
          </p>
          <p style={pStyle}>
            Le micro-BIC est moins rentable pendant la détention (pas de déduction de charges réelles, pas d'amortissement). Mais à la revente, la sortie est intéressante.
          </p>
          <p style={pStyle}>
            Pour quelqu'un qui achète un meublé aujourd'hui avec l'intention de revendre dans 7-10 ans et dont les charges sont faibles, le micro-BIC mérite d'être comparé au régime réel sur l'ensemble du cycle.
          </p>
          <p style={pStyle}>
            Faites le calcul global : économie d'impôt annuelle × nombre d'années au réel, moins le surcoût à la revente.
          </p>
          <p style={pStyle}>
            Parfois, le micro-BIC est la meilleure option.
          </p>

          {/* ── H2: Retrouver amortissements ── */}
          <h2 style={h2Style}>Comment retrouver votre total d'amortissements cumulés</h2>
          <p style={pStyle}>
            C'est la question pratique. Le chiffre se trouve sur vos liasses fiscales (formulaire 2033-B, colonne "Amortissements déduits au titre de l'exercice"), à additionner sur toutes les années. Si vous avez un expert-comptable, n'hésitez pas à le lui demander.
          </p>
          <p style={pStyle}>
            Si vous n'avez plus vos liasses, votre centre des impôts peut fournir les copies de vos déclarations BIC. Comptez pour cela quelques semaines de délai.
          </p>

          {/* ── H2: Chiffrez ── */}
          <h2 style={h2Style}>Chiffrez avant de décider</h2>
          <p style={pStyle}>
            Chaque situation LMNP est différente.
          </p>
          <p style={pStyle}>
            Le montant des amortissements, la durée de détention, le prix de revente, tout ça change le résultat du simple au quintuple.
          </p>
          <p style={pStyle}>
            Sophie paie 16 068 €. Un investisseur qui a 5 ans de détention et 70 000 € d'amortissements paiera le double.
          </p>
          <p style={pStyle}>
            Le seul moyen d'y voir clair, c'est de poser vos propres chiffres dans un simulateur qui intègre la réforme.
          </p>

          {/* ── CTA ── */}
          <div style={{ textAlign: "center", marginTop: 32, marginBottom: 48 }}>
            <Link
              href="/plus-value-lmnp"
              style={{
                display: "inline-block",
                background: C.menthe,
                color: "#FFFFFF",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              → Simuler ma plus-value LMNP — réforme 2025 prise en compte
            </Link>
          </div>

          {/* ── Sources ── */}
          <div
            style={{
              background: "#EEEDF5",
              borderRadius: 12,
              padding: 20,
              fontSize: 12,
              color: C.muted,
              fontStyle: "italic",
              lineHeight: 1.8,
            }}
          >
            <strong style={{ fontStyle: "normal" }}>Sources :</strong> art. 150 VB II du CGI (réintégration des amortissements LMNP) · art. 150 VC (abattements pour durée de détention) · art. 39 C (amortissements admis en déduction) · art. 151 septies (exonération LMP) · Loi n° 2025-127 du 14 février 2025 de finances pour 2025.
          </div>
        </article>
      </div>
    </>
  );
}
