"use client";
import Link from "next/link";
import { C } from "@/lib/constants";

export default function AlertBanner() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto 16px", padding: "0 16px" }}>
      <div
        style={{
          background: "rgba(86,203,173,0.08)",
          border: "1px solid rgba(86,203,173,0.25)",
          borderRadius: 10,
          padding: "12px 20px",
          fontSize: 14,
          color: C.text,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>🔥 Nouveauté 2026 : les amortissements LMNP sont désormais réintégrés dans le calcul de la plus-value</span>
        <Link
          href="/plus-value-lmnp"
          style={{ color: C.accent, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Simuler l&apos;impact →
        </Link>
      </div>
    </div>
  );
}
