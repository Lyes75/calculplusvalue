import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(new URL("/?error=params", request.url));
  }

  // Vérifie le token
  const valid = await verifyUnsubscribeToken(email, token);
  if (!valid) {
    return NextResponse.redirect(new URL("/?error=token", request.url));
  }

  try {
    const sql = getDb();

    await sql`
      UPDATE email_leads
      SET desabonne = TRUE
      WHERE email = ${email.toLowerCase().trim()}
    `;

    return NextResponse.redirect(new URL("/desabonnement-confirme", request.url));
  } catch (error) {
    console.error("[UNSUBSCRIBE ERROR]", error);
    return NextResponse.redirect(new URL("/?error=server", request.url));
  }
}
