"use client";
import { C } from "@/lib/constants";

export default function SocialProof() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {[
          { emoji: "📊", before: "+", bold: "15 000", after: " simulations réalisées" },
          { emoji: "✅", before: "Barèmes CGI ", bold: "2026 vérifiés", after: "" },
          { emoji: "🔒", before: "Gratuit, ", bold: "sans inscription", after: "" },
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{item.emoji}</span>
            <span>
              {item.before}
              <strong style={{ fontWeight: 600, color: C.text }}>{item.bold}</strong>
              {item.after}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          div[style*="justify-content: center"] {
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
