"use client";
import { useState, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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

interface DailyCount { date: string; leads: number }

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(n) + " €";
}

function fmtPct(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n) + " %";
}

const TYPE_LABELS: Record<string, string> = {
  secondaire: "Résidence secondaire",
  locatif: "Bien locatif",
  terrain: "Terrain",
  lmnp: "LMNP",
  scpi: "SCPI",
  principale: "Résidence principale",
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/plus-value-lmnp": "LMNP",
  "/plus-value-sci": "SCI",
  "/plus-value-non-resident": "Non-résident",
  "/plus-value-donation-succession": "Donation/Succession",
  "/plus-value-terrain": "Terrain",
  "/plus-value-scpi": "SCPI",
  "/plus-value-indivision": "Indivision",
};

const COLORS = ["#56CBAD", "#2D2B55", "#E05656", "#F5A623", "#3BAF7A", "#9B97C4", "#E8845C", "#6E6B8A"];

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyData, setDailyData] = useState<DailyCount[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterPage, setFilterPage] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchEmail, setSearchEmail] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads?limit=500", {
        headers: { "x-api-key": key },
      });
      if (!res.ok) {
        if (res.status === 401) { setError("Clé API invalide"); setAuthenticated(false); }
        else setError("Erreur serveur");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setAuthenticated(true);

      // Graphique 30 derniers jours
      const counts: Record<string, number> = {};
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        counts[d.toISOString().slice(0, 10)] = 0;
      }
      for (const lead of data.leads || []) {
        const day = lead.created_at ? new Date(lead.created_at).toISOString().slice(0, 10) : null;
        if (day && counts[day] !== undefined) counts[day]++;
      }
      setDailyData(Object.entries(counts).map(([date, leads]) => ({
        date: date.slice(5),
        leads,
      })));
    } catch {
      setError("Erreur de connexion");
    }
    setLoading(false);
  }, []);

  const handleLogin = () => { if (apiKey.length > 10) fetchLeads(apiKey); };

  const handleDeleteLead = async (email: string) => {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.email !== email));
        setTotal(prev => prev - 1);
        setSelectedLead(null);
        setConfirmDelete(false);
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setDeleting(false);
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/leads", { method: "POST", headers: { "x-api-key": apiKey } });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { setError("Erreur export CSV"); }
  };

  // Filtres
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filterPage !== "all" && (l.page_source || "/") !== filterPage) return false;
      if (filterType !== "all" && (l.type_bien || "") !== filterType) return false;
      if (searchEmail && !l.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
      return true;
    });
  }, [leads, filterPage, filterType, searchEmail]);

  // Stats calculées
  const stats = useMemo(() => {
    const now = new Date();
    const today = leads.filter(l => new Date(l.created_at).toDateString() === now.toDateString());
    const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
    const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
    const week = leads.filter(l => new Date(l.created_at) >= d7);
    const month = leads.filter(l => new Date(l.created_at) >= d30);

    const withImpot = leads.filter(l => l.impot_total !== null && l.impot_total > 0);
    const avgImpot = withImpot.length > 0 ? Math.round(withImpot.reduce((s, l) => s + (l.impot_total || 0), 0) / withImpot.length) : 0;

    const withPV = leads.filter(l => l.prix_achat && l.prix_vente && l.prix_vente > l.prix_achat);
    const avgPV = withPV.length > 0 ? Math.round(withPV.reduce((s, l) => s + ((l.prix_vente || 0) - (l.prix_achat || 0)), 0) / withPV.length) : 0;

    const avgDuree = leads.filter(l => l.duree_detention).length > 0
      ? Math.round(leads.filter(l => l.duree_detention).reduce((s, l) => s + (l.duree_detention || 0), 0) / leads.filter(l => l.duree_detention).length)
      : 0;

    // Répartition par type de bien
    const byType: Record<string, number> = {};
    leads.forEach(l => {
      const t = l.type_bien || "non renseigné";
      byType[t] = (byType[t] || 0) + 1;
    });
    const typeData = Object.entries(byType).map(([name, value]) => ({
      name: TYPE_LABELS[name] || name,
      value,
    })).sort((a, b) => b.value - a.value);

    // Répartition par page source
    const byPage: Record<string, number> = {};
    leads.forEach(l => {
      const p = l.page_source || "/";
      byPage[p] = (byPage[p] || 0) + 1;
    });
    const pageData = Object.entries(byPage).map(([name, value]) => ({
      name: PAGE_LABELS[name] || name,
      value,
    })).sort((a, b) => b.value - a.value);

    return { today: today.length, week: week.length, month: month.length, avgImpot, avgPV, avgDuree, typeData, pageData };
  }, [leads]);

  // Pages et types uniques pour les filtres
  const uniquePages = useMemo(() => [...new Set(leads.map(l => l.page_source || "/"))].sort(), [leads]);
  const uniqueTypes = useMemo(() => [...new Set(leads.map(l => l.type_bien).filter(Boolean))].sort(), [leads]);

  // ─── Login screen ───
  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E0DEF0", padding: "48px 40px", maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2B55", marginBottom: 20 }}>Administration</h1>
          <input type="password" placeholder="Clé API admin" value={apiKey}
            onChange={e => setApiKey(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E0DEF0", borderRadius: 10, fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
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

  // ─── Dashboard ───
  return (
    <div style={{ minHeight: "100vh", background: "#F6F5FA", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D2B55 0%, #3F3D6E 100%)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ color: "#56CBAD", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>← Site</Link>
            <h1 style={{ color: "#E0DEF0", fontSize: 18, fontWeight: 700, margin: 0 }}>📊 Dashboard Leads</h1>
            <span style={{ fontSize: 11, color: "#9B97C4" }}>Dernière synchro : {new Date().toLocaleTimeString("fr-FR")}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleExportCSV}
              style={{ padding: "8px 14px", background: "rgba(86,203,173,0.15)", color: "#56CBAD", border: "1px solid rgba(86,203,173,0.3)", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📥 CSV
            </button>
            <button onClick={() => fetchLeads(apiKey)}
              style={{ padding: "8px 14px", background: "#56CBAD", color: "#1E1C3A", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              🔄 Rafraîchir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 60px" }}>
        {error && <div style={{ color: "#E05656", fontSize: 13, marginBottom: 16, background: "#FFF0F0", border: "1px solid #FFDADA", borderRadius: 8, padding: "8px 14px" }}>{error}</div>}

        {/* ── KPI Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total", value: total, icon: "📧", color: "#2D2B55" },
            { label: "30 jours", value: stats.month, icon: "📅", color: "#3F3D6E" },
            { label: "7 jours", value: stats.week, icon: "📆", color: "#56CBAD" },
            { label: "Aujourd'hui", value: stats.today, icon: "🔥", color: "#E05656" },
            { label: "Impôt moyen", value: stats.avgImpot ? fmt(stats.avgImpot) : "—", icon: "💰", color: "#F5A623" },
            { label: "Plus-value moy.", value: stats.avgPV ? fmt(stats.avgPV) : "—", icon: "📈", color: "#3BAF7A" },
            { label: "Détention moy.", value: stats.avgDuree ? `${stats.avgDuree} ans` : "—", icon: "⏱️", color: "#9B97C4" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DEF0", padding: "16px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: typeof stat.value === "number" ? 24 : 16, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#6E6B8A", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* Bar chart - 30 jours */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "16px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2D2B55", margin: "0 0 12px" }}>Leads / jour (30 jours)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0DEF0" />
                <XAxis dataKey="date" fontSize={9} interval={4} />
                <YAxis fontSize={10} allowDecimals={false} width={25} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="leads" fill="#56CBAD" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart - Par type de bien */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "16px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2D2B55", margin: "0 0 8px" }}>Par type de bien</h3>
            {stats.typeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={stats.typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={28}>
                      {stats.typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: "#6E6B8A", lineHeight: 1.6 }}>
                  {stats.typeData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={{ color: "#6E6B8A", fontSize: 12, textAlign: "center", paddingTop: 40 }}>Aucune donnée</div>}
          </div>

          {/* Pie chart - Par page source */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "16px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#2D2B55", margin: "0 0 8px" }}>Par page source</h3>
            {stats.pageData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={stats.pageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={28}>
                      {stats.pageData.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: "#6E6B8A", lineHeight: 1.6 }}>
                  {stats.pageData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[(i + 3) % COLORS.length], flexShrink: 0 }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={{ color: "#6E6B8A", fontSize: 12, textAlign: "center", paddingTop: 40 }}>Aucune donnée</div>}
          </div>
        </div>

        {/* ── Filtres ── */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E0DEF0", padding: "12px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2D2B55" }}>🔍 Filtres :</span>
          <input type="text" placeholder="Rechercher un email..." value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
            style={{ padding: "6px 12px", border: "1px solid #E0DEF0", borderRadius: 6, fontSize: 12, outline: "none", width: 200, fontFamily: "'DM Sans', sans-serif" }} />
          <select value={filterPage} onChange={e => setFilterPage(e.target.value)}
            style={{ padding: "6px 10px", border: "1px solid #E0DEF0", borderRadius: 6, fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#3F3D6E" }}>
            <option value="all">Toutes les pages</option>
            {uniquePages.map(p => <option key={p} value={p}>{PAGE_LABELS[p] || p}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ padding: "6px 10px", border: "1px solid #E0DEF0", borderRadius: 6, fontSize: 12, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#3F3D6E" }}>
            <option value="all">Tous les types</option>
            {uniqueTypes.map(t => <option key={t} value={t!}>{TYPE_LABELS[t!] || t}</option>)}
          </select>
          <span style={{ fontSize: 11, color: "#6E6B8A" }}>{filteredLeads.length} résultat{filteredLeads.length > 1 ? "s" : ""}</span>
        </div>

        {/* ── Table + Detail panel ── */}
        <div style={{ display: "grid", gridTemplateColumns: selectedLead ? "1fr 360px" : "1fr", gap: 16 }}>
          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F6F5FA" }}>
                    {["Email", "Date / Heure", "Page", "Type", "Achat", "Vente", "Détention", "Impôt", "Net vendeur"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: "#3F3D6E", borderBottom: "1px solid #E0DEF0", whiteSpace: "nowrap", fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: "32px 14px", textAlign: "center", color: "#6E6B8A" }}>Aucun lead trouvé</td></tr>
                  ) : (
                    filteredLeads.map((lead, i) => {
                      const isSelected = selectedLead?.email === lead.email && selectedLead?.created_at === lead.created_at;
                      const pv = lead.prix_achat && lead.prix_vente ? lead.prix_vente - lead.prix_achat : null;
                      return (
                        <tr key={i}
                          onClick={() => { setSelectedLead(isSelected ? null : lead); setConfirmDelete(false); }}
                          style={{
                            borderBottom: "1px solid #F0EEF5",
                            cursor: "pointer",
                            background: isSelected ? "rgba(86,203,173,0.08)" : i % 2 === 0 ? "#fff" : "#FAFAFE",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#F6F5FA"; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFE"; }}
                        >
                          <td style={{ padding: "8px 10px", color: "#2D2B55", fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email}</td>
                          <td style={{ padding: "8px 10px", color: "#6E6B8A", whiteSpace: "nowrap" }}>
                            {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                            <br />
                            <span style={{ fontSize: 10, color: "#9B97C4" }}>{new Date(lead.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ fontSize: 10, background: "#EEEDF5", color: "#3F3D6E", padding: "2px 6px", borderRadius: 4 }}>
                              {PAGE_LABELS[lead.page_source || "/"] || lead.page_source}
                            </span>
                          </td>
                          <td style={{ padding: "8px 10px", color: "#6E6B8A" }}>{TYPE_LABELS[lead.type_bien || ""] || lead.type_bien || "—"}</td>
                          <td style={{ padding: "8px 10px", color: "#6E6B8A" }}>{fmt(lead.prix_achat)}</td>
                          <td style={{ padding: "8px 10px", color: "#6E6B8A" }}>{fmt(lead.prix_vente)}</td>
                          <td style={{ padding: "8px 10px", color: "#6E6B8A", textAlign: "center" }}>{lead.duree_detention ? `${lead.duree_detention} ans` : "—"}</td>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: lead.impot_total && lead.impot_total > 10000 ? "#E05656" : "#2D2B55" }}>{fmt(lead.impot_total)}</td>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "#3BAF7A" }}>{fmt(lead.net_vendeur)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          {selectedLead && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DEF0", padding: "20px", position: "sticky", top: 20, alignSelf: "start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2D2B55", margin: 0 }}>📋 Détail du lead</h3>
                <button onClick={() => setSelectedLead(null)}
                  style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#6E6B8A", padding: 0 }}>✕</button>
              </div>

              {/* Email */}
              <div style={{ background: "#F6F5FA", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#6E6B8A", marginBottom: 2 }}>Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2D2B55", wordBreak: "break-all" }}>{selectedLead.email}</div>
              </div>

              {/* Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#F6F5FA", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6E6B8A" }}>Date</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2D2B55" }}>{new Date(selectedLead.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
                <div style={{ background: "#F6F5FA", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6E6B8A" }}>Heure</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2D2B55" }}>{new Date(selectedLead.created_at).toLocaleTimeString("fr-FR")}</div>
                </div>
              </div>

              {/* Source */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <div style={{ background: "#F6F5FA", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6E6B8A" }}>Page source</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2D2B55" }}>{PAGE_LABELS[selectedLead.page_source || "/"] || selectedLead.page_source}</div>
                </div>
                <div style={{ background: "#F6F5FA", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6E6B8A" }}>Type de bien</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2D2B55" }}>{TYPE_LABELS[selectedLead.type_bien || ""] || selectedLead.type_bien || "—"}</div>
                </div>
              </div>

              {/* Séparateur */}
              <div style={{ borderTop: "1px solid #E0DEF0", margin: "0 0 16px" }} />

              {/* Simulation */}
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#3F3D6E", margin: "0 0 10px" }}>🏠 Simulation réalisée</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {[
                  { label: "Prix d'achat", value: fmt(selectedLead.prix_achat) },
                  { label: "Prix de vente", value: fmt(selectedLead.prix_vente) },
                  { label: "Plus-value brute", value: selectedLead.prix_achat && selectedLead.prix_vente ? fmt(selectedLead.prix_vente - selectedLead.prix_achat) : "—", bold: true },
                  { label: "Durée de détention", value: selectedLead.duree_detention ? `${selectedLead.duree_detention} ans` : "—" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px solid #F0EEF5" }}>
                    <span style={{ color: "#6E6B8A" }}>{row.label}</span>
                    <span style={{ fontWeight: row.bold ? 700 : 500, color: "#2D2B55" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Résultats fiscaux */}
              <div style={{ background: "linear-gradient(135deg, #2D2B55, #3F3D6E)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#9B97C4" }}>Impôt total</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#E05656" }}>{fmt(selectedLead.impot_total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#9B97C4" }}>Net vendeur</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#56CBAD" }}>{fmt(selectedLead.net_vendeur)}</span>
                </div>
                {selectedLead.impot_total && selectedLead.prix_vente && selectedLead.prix_achat && selectedLead.prix_vente > selectedLead.prix_achat ? (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#9B97C4" }}>Taux effectif</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#E0DEF0" }}>
                      {fmtPct((selectedLead.impot_total / (selectedLead.prix_vente - selectedLead.prix_achat)) * 100)}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Source technique */}
              <div style={{ fontSize: 10, color: "#9B97C4", marginBottom: 16 }}>
                Source : {selectedLead.source || "—"}
              </div>

              {/* Suppression */}
              <div style={{ borderTop: "1px solid #E0DEF0", paddingTop: 14 }}>
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)}
                    style={{ width: "100%", padding: "8px 0", background: "none", border: "1px solid #E0DEF0", borderRadius: 8, fontSize: 12, color: "#6E6B8A", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#E05656"; e.currentTarget.style.color = "#E05656"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DEF0"; e.currentTarget.style.color = "#6E6B8A"; }}>
                    🗑️ Supprimer ce lead
                  </button>
                ) : (
                  <div style={{ background: "#FFF5F5", border: "1px solid #FFDADA", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#E05656", marginBottom: 8 }}>
                      Supprimer définitivement ce lead ?
                    </div>
                    <div style={{ fontSize: 11, color: "#6E6B8A", marginBottom: 10 }}>
                      {selectedLead.email}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleDeleteLead(selectedLead.email)}
                        disabled={deleting}
                        style={{ flex: 1, padding: "7px 0", background: "#E05656", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: deleting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: deleting ? 0.6 : 1 }}>
                        {deleting ? "Suppression..." : "Confirmer"}
                      </button>
                      <button onClick={() => setConfirmDelete(false)}
                        style={{ flex: 1, padding: "7px 0", background: "#fff", color: "#6E6B8A", border: "1px solid #E0DEF0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
