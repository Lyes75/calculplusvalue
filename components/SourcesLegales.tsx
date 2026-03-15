"use client";
import { C } from "@/lib/constants";

export default function SourcesLegales() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", marginTop: 48, marginBottom: 40 }}>
      <div
        style={{
          background: C.accentBg,
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 12 }}>
          Sources légales et méthodologie
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: "0 0 12px 0" }}>
          Ce simulateur est basé sur les barèmes officiels du Code général des impôts, mis à jour au 1er janvier 2026.
        </p>
        <p
          style={{
            fontSize: 13,
            color: C.text,
            lineHeight: 1.8,
            margin: "0 0 12px 0",
            fontFamily: "monospace",
          }}
        >
          Art. 150 U à 150 VH du CGI (régime des plus-values immobilières des particuliers) · Art. 150 VC (abattements pour durée de détention) · Art. 1609 nonies G (surtaxe sur les plus-values élevées) · Art. 200 B (taux d&apos;imposition forfaitaire à 19%) · Art. 669 (barème fiscal du démembrement) · Art. 150 VB II (majoration du prix d&apos;acquisition) · Prélèvements sociaux : 17,2% (CSG 9,2% + CRDS 0,5% + prélèvement de solidarité 7,5%)
        </p>
        <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: "0 0 12px 0" }}>
          Dernière mise à jour des barèmes : 1er janvier 2026. Prochaine vérification prévue : loi de finances 2027 (octobre 2026).
        </p>
        <a
          href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006191598/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13, color: C.accent, fontWeight: 600, textDecoration: "none" }}
        >
          Consulter les textes sur Légifrance →
        </a>
      </div>
    </div>
  );
}
