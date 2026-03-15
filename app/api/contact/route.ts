import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { nom, email, sujet, message } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Message trop court" }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2D2B55;">Nouveau message depuis calculplusvalue.fr</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px; font-weight: bold; color: #6E6B8A;">Nom</td><td style="padding: 8px;">${nom || "Non renseigné"}</td></tr>
          <tr style="background: #F6F5FA;"><td style="padding: 8px; font-weight: bold; color: #6E6B8A;">Email</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #6E6B8A;">Sujet</td><td style="padding: 8px;">${sujet || "Aucun sujet"}</td></tr>
        </table>
        <div style="padding: 16px; background: #F6F5FA; border-radius: 8px; white-space: pre-wrap;">${message}</div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Calculplusvalue.fr <rapport@calculplusvalue.fr>",
      to: ["contact@calculplusvalue.fr"],
      replyTo: email,
      subject: `[Contact] ${sujet || "Message depuis calculplusvalue.fr"}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
