import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  // Protection par clé API
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS email_leads (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        source VARCHAR(100) DEFAULT 'homepage',
        prix_achat INTEGER,
        prix_vente INTEGER,
        duree_detention INTEGER,
        impot_total INTEGER,
        net_vendeur INTEGER,
        type_bien VARCHAR(50),
        rapport_envoye BOOLEAN DEFAULT FALSE,
        desabonne BOOLEAN DEFAULT FALSE,
        page_source VARCHAR(255),
        user_agent TEXT,
        ip_anonymisee VARCHAR(50)
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_leads_desabonne ON email_leads(desabonne)`;

    return NextResponse.json({ success: true, message: "Table email_leads créée avec succès" });
  } catch (error) {
    console.error("[SETUP ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la table", details: String(error) },
      { status: 500 }
    );
  }
}
