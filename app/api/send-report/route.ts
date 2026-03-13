import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, htmlContent } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    if (!htmlContent) {
      return NextResponse.json({ error: "Contenu manquant" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Calculplusvalue.fr <rapport@calculplusvalue.fr>",
      to: [email],
      subject: "Votre rapport de simulation plus-value immobilière",
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send report error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
