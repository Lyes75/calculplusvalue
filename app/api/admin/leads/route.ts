import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET — Consultation des leads (JSON)
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");
    const since = searchParams.get("since");

    const sql = getDb();

    let leads;
    let total;

    if (since) {
      leads = await sql`
        SELECT email, created_at, source, page_source, type_bien,
               prix_achat, prix_vente, duree_detention, impot_total, net_vendeur,
               rapport_envoye, desabonne
        FROM email_leads
        WHERE desabonne = FALSE AND created_at >= ${since}::timestamptz
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      total = await sql`
        SELECT COUNT(*)::int as count FROM email_leads
        WHERE desabonne = FALSE AND created_at >= ${since}::timestamptz
      `;
    } else {
      leads = await sql`
        SELECT email, created_at, source, page_source, type_bien,
               prix_achat, prix_vente, duree_detention, impot_total, net_vendeur,
               rapport_envoye, desabonne
        FROM email_leads
        WHERE desabonne = FALSE
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      total = await sql`
        SELECT COUNT(*)::int as count FROM email_leads WHERE desabonne = FALSE
      `;
    }

    return NextResponse.json({
      leads,
      total: total[0]?.count ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[ADMIN LEADS ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur", details: String(error) }, { status: 500 });
  }
}

// POST — Export CSV
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const sql = getDb();

    const leads = await sql`
      SELECT email, created_at, source, page_source, type_bien,
             prix_achat, prix_vente, duree_detention, impot_total, net_vendeur
      FROM email_leads
      WHERE desabonne = FALSE
      ORDER BY created_at DESC
    `;

    let csv = "email,date,source,page_source,type_bien,prix_achat,prix_vente,duree_detention,impot_total,net_vendeur\n";
    for (const lead of leads) {
      const date = lead.created_at ? new Date(lead.created_at as string).toISOString().slice(0, 10) : "";
      csv += [
        lead.email,
        date,
        lead.source || "",
        lead.page_source || "",
        lead.type_bien || "",
        lead.prix_achat ?? "",
        lead.prix_vente ?? "",
        lead.duree_detention ?? "",
        lead.impot_total ?? "",
        lead.net_vendeur ?? "",
      ].join(",") + "\n";
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=leads-${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch (error) {
    console.error("[ADMIN CSV ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
