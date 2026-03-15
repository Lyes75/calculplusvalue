"use client";
import { useState } from "react";
import Link from "next/link";
import { C } from "@/lib/constants";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, sujet, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setNom("");
        setEmail("");
        setSujet("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 15,
    color: C.text,
    background: C.card,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: C.text,
    marginBottom: 4,
    display: "block",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "28px 24px 40px", color: "#E0DEF0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/logo.svg" alt="calculplusvalue.fr" style={{ height: 36, width: "auto", marginBottom: 16 }} />
          </Link>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, margin: 0, lineHeight: 1.2, color: "#E0DEF0" }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: 15, color: "#9B97C4", marginTop: 10, marginBottom: 0, lineHeight: 1.6 }}>
            Une question, une suggestion ou un partenariat ? Nous vous répondons sous 48h.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px 60px" }}>

        {/* Contenu informatif */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "💬", title: "Question fiscale", desc: "Notre simulateur couvre la plupart des cas. Pour les situations complexes, consultez un notaire ou un conseiller fiscal." },
            { icon: "🐛", title: "Signaler un bug", desc: "Vous avez repéré une erreur de calcul ou un problème d'affichage ? Décrivez-le, nous corrigerons rapidement." },
            { icon: "🤝", title: "Partenariat", desc: "Vous êtes CGP, notaire ou courtier ? Discutons d'un partenariat ou d'une intégration de nos outils." },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {status === "sent" ? (
          <div style={{ background: C.card, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Message envoyé</div>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: "0 0 20px 0" }}>
              Merci pour votre message. Nous vous répondrons à l&apos;adresse indiquée dans les meilleurs délais.
            </p>
            <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: C.accent, textDecoration: "none" }}>
              ← Retour au simulateur
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 20px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Envoyez-nous un message</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Votre nom"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email <span style={{ color: C.accent }}>*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Sujet</label>
              <select
                value={sujet}
                onChange={e => setSujet(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="Question sur le simulateur">Question sur le simulateur</option>
                <option value="Signaler une erreur">Signaler une erreur</option>
                <option value="Suggestion d'amélioration">Suggestion d&apos;amélioration</option>
                <option value="Partenariat / Intégration">Partenariat / Intégration</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Message <span style={{ color: C.accent }}>*</span></label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Décrivez votre demande..."
                style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
              />
            </div>

            {status === "error" && (
              <div style={{ background: C.redBg, border: `1px solid #E05656`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#E05656" }}>
                Une erreur est survenue. Veuillez réessayer ou nous écrire directement par email.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: status === "sending" ? C.textLight : C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: status === "sending" ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s",
              }}
            >
              {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
            </button>

            <p style={{ fontSize: 11, color: C.textLight, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Vos données ne sont utilisées que pour répondre à votre message. Aucun usage commercial.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
