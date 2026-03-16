import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, calculData, page_source } = body;

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Normalisation
    const emailNormalized = email.toLowerCase().trim();

    // Anonymisation IP (garde seulement les 3 premiers octets)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipAnonymisee = ip !== "unknown"
      ? ip.split(".").slice(0, 3).join(".") + ".0"
      : "unknown";

    // User-Agent
    const userAgent = request.headers.get("user-agent") || "";

    // Stockage en base
    const sql = getDb();

    await sql`
      INSERT INTO email_leads (
        email, source, page_source,
        prix_achat, prix_vente, duree_detention,
        impot_total, net_vendeur, type_bien,
        rapport_envoye, user_agent, ip_anonymisee
      ) VALUES (
        ${emailNormalized},
        ${source || "homepage"},
        ${page_source || "/"},
        ${calculData?.prix_achat || null},
        ${calculData?.prix_vente || null},
        ${calculData?.duree_detention || null},
        ${calculData?.impot_total || null},
        ${calculData?.net_vendeur || null},
        ${calculData?.type_bien || null},
        TRUE,
        ${userAgent.substring(0, 500)},
        ${ipAnonymisee}
      )
      ON CONFLICT (email) DO UPDATE SET
        created_at = NOW(),
        source = EXCLUDED.source,
        page_source = EXCLUDED.page_source,
        prix_achat = COALESCE(EXCLUDED.prix_achat, email_leads.prix_achat),
        prix_vente = COALESCE(EXCLUDED.prix_vente, email_leads.prix_vente),
        duree_detention = COALESCE(EXCLUDED.duree_detention, email_leads.duree_detention),
        impot_total = COALESCE(EXCLUDED.impot_total, email_leads.impot_total),
        net_vendeur = COALESCE(EXCLUDED.net_vendeur, email_leads.net_vendeur),
        type_bien = COALESCE(EXCLUDED.type_bien, email_leads.type_bien),
        rapport_envoye = TRUE
    `;

    // Webhook n8n (optionnel — phase 2)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailNormalized,
          impot_total: calculData?.impot_total,
          net_vendeur: calculData?.net_vendeur,
          type_bien: calculData?.type_bien,
          page_source: page_source || "/",
        }),
      }).catch(err => console.error("[N8N WEBHOOK ERROR]", err));
    }

    console.log(`[LEAD] ${emailNormalized} from ${source || "homepage"}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EMAIL CAPTURE ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
