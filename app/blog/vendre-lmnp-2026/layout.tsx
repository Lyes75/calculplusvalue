import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Je vends mon LMNP en 2026 : combien vais-je payer après la réforme ? | calculplusvalue.fr",
  description:
    "Calcul détaillé de la plus-value LMNP après la réforme 2025. Cas concret avec impact des amortissements réintégrés, abattements, et stratégies pour réduire l'impôt.",
  openGraph: {
    title: "Vendre son LMNP en 2026 : le calcul complet après la réforme",
    description:
      "Cas concret : Sophie vend son studio LMNP après 8 ans. Combien paie-t-elle avec la réintégration des amortissements ?",
    type: "article",
    publishedTime: "2026-03-17T00:00:00Z",
    authors: ["calculplusvalue.fr"],
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
