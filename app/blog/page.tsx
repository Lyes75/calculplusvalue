import Link from "next/link";

const C = {
  indigo: "#2D2B55",
  indigoLight: "#3F3D6E",
  menthe: "#56CBAD",
  bg: "#F4F3FA",
  border: "#D8D6E8",
  muted: "#6E6B8A",
};

const articles = [
  {
    slug: "vendre-lmnp-2026",
    title: "Je vends mon LMNP en 2026 : combien vais-je payer après la réforme ?",
    description:
      "Cas concret avec calcul étape par étape : impact de la réintégration des amortissements, comparaison avant/après réforme, et leviers pour réduire l'impôt.",
    date: "17 mars 2026",
    tag: "LMNP",
  },
];

export default function BlogIndex() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: C.indigo, padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.2,
              marginBottom: 16,
              marginTop: 0,
            }}
          >
            Nos articles
          </h1>
          <p style={{ fontSize: 16, color: "#C8C6E0", lineHeight: 1.7, marginBottom: 0, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Analyses, cas pratiques et stratégies fiscales pour la plus-value immobilière.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div style={{ background: "#FFFFFF", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{
                display: "block",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 24,
                textDecoration: "none",
                transition: "border-color 0.2s",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: C.menthe,
                    color: "#FFFFFF",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {article.tag}
                </span>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>{article.date}</span>
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: C.indigo,
                  lineHeight: 1.35,
                  margin: "0 0 10px 0",
                }}
              >
                {article.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.65,
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
