import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos articles — Plus-value immobilière | calculplusvalue.fr",
  description:
    "Analyses, cas pratiques et stratégies fiscales pour optimiser votre plus-value immobilière. LMNP, SCI, expatriés, succession.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
