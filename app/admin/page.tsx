"use client";
import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface Lead {
  email: string;
  created_at: string;
  source: string;
  page_source: string;
  type_bien: string | null;
  prix_achat: number | null;
  prix_vente: number | null;
  duree_detention: number | null;
  impot_total: number | null;
  net_vendeur: number | null;
}

interface DailyCount {
  date: string;
  leads: number;
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(n) + " €";
}

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyData, setDailyData] = useState<DailyCount[]>([]);

  const fetchLeads = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads?limit=200", {
        headers: { "x-api-key": key },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError("Clé API invalide");
          setAuthenticated(false);
        } else {
          setError("Erreur serveur");
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setAuthenticated(true);

      // Calcul du graphique par jour (7 derniers jours)
      const counts: Record<string, number> = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        counts[d.toISOString().slice(0, 10)] = 0;
      }
      for (const lead of data.leads || []) {
        const day = lead.created_at ? new Date(lead.created_at).toISOString().slice(0, 10) : null;
        if (day && counts[day] !== undefined) {
          counts[day]++;
        }
      }
      setDailyData(Object.entries(counts).map(([date, leads]) => ({
        date: date.slice(5), // MM-DD
        leads,
      })));
    } catch {
      setError("Erreur de connexion");
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (apiKey.length > 10) {
      fetchLeads(apiKey);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "x-api-key": apiKey },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erreur export CSV");
    }
  };

  // Leads des 7 derniers jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLeads = leads.filter(l => new Date(l.created_at) >= sevenDaysAgo);

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E0DEF0", padding: "48px 40px", maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2B55", marginBottom: 20 }}>
            Administration
          </h1>
          <input
            type="password"
            placeholder="Clé API admin"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E0DEF0", borderRadius: 10, fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
          />
          <button onClick={handleLogin}
            style={{ width: "100%", padding: "12px 0", background: "#2D2B55", color: "#E0DEF0", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Chargement..." : "Accéder"}
          </button>
          {error && <div style={{ color: "#E05656", fontSize: 13, marginTop: 12 }}>{error}</div>}
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{ fontSize: 12, color: "#6E6B8A", textDecoration: "none" }}>← Retour au site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ color: "#56CBAD", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>← Site</Link>
            <h1 style={{ color: "#E0DEF0", fontSize: 18, fontWeight: 700, margin: 0 }}>📊 Dashboard Leads</h1>
          </div>
          <button onClick={() => fetchLeads(apiKey)}
            style={{ padding: "8px 16px", background: "#56CBAD", color: "#1E1C3A", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            🔄 Rafraîchir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" }}>
        {error && <div style={{ color: "#E05656", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total leads", value: total, icon: "📧" },
            { label: "7 derniers jours", value: recentLeads.length, icon: "📅" },
            { label: "Aujourd'hui", value: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, icon: "🔥" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#2D2B55" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#6E6B8A", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {dailyData.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "20px 18px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#2D2B55", marginBottom: 16, margin: "0 0 16px" }}>Leads par jour (7 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0DEF0" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="#56CBAD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <button onClick={handleExportCSV}
            style={{ padding: "10px 20px", background: "#2D2B55", color: "#E0DEF0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            📥 Exporter CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #E0DEF0" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#2D2B55", margin: 0 }}>
              Derniers leads ({recentLeads.length} sur 7 jours)
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F6F5FA" }}>
                  {["Email", "Date", "Source", "Type bien", "Impôt", "Net vendeur"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#3F3D6E", borderBottom: "1px solid #E0DEF0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "24px 14px", textAlign: "center", color: "#6E6B8A" }}>
                      Aucun lead sur les 7 derniers jours
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F0EEF5" }}>
                      <td style={{ padding: "10px 14px", color: "#2D2B55", fontWeight: 500 }}>{lead.email}</td>
                      <td style={{ padding: "10px 14px", color: "#6E6B8A", whiteSpace: "nowrap" }}>
                        {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#6E6B8A" }}>{lead.source || "—"}</td>
                      <td style={{ padding: "10px 14px", color: "#6E6B8A" }}>{lead.type_bien || "—"}</td>
                      <td style={{ padding: "10px 14px", color: "#2D2B55", fontWeight: 500 }}>{fmt(lead.impot_total)}</td>
                      <td style={{ padding: "10px 14px", color: "#2D2B55", fontWeight: 500 }}>{fmt(lead.net_vendeur)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
