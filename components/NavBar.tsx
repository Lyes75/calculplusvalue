"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "🏠 Général" },
  { href: "/plus-value-lmnp", label: "🛏️ LMNP" },
  { href: "/plus-value-sci", label: "🏢 SCI" },
  { href: "/plus-value-non-resident", label: "🌍 Non-résident" },
  { href: "/plus-value-donation-succession", label: "🎁 Donation / Succession" },
  { href: "/plus-value-terrain", label: "🌱 Terrain" },
  { href: "/plus-value-scpi", label: "📈 SCPI" },
  { href: "/plus-value-indivision", label: "⚖️ Indivision" },
  { href: "/exonerations-plus-value", label: "✅ Exonérations" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation des simulateurs"
      style={{
        background: "#3F3D6E",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 16px",
          maxWidth: 960,
          margin: "0 auto",
          minWidth: "max-content",
        }}
      >
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
                background: isActive
                  ? "#56CBAD"
                  : "rgba(255,255,255,0.07)",
                color: isActive ? "#1E1C3A" : "#C5C3DE",
                border: isActive
                  ? "1px solid #56CBAD"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
