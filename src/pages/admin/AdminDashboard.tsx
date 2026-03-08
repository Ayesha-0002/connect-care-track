import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Bell, LayoutDashboard, Sparkles, UserCog, LogOut, Loader2, Package } from "lucide-react";
import logo from "@/assets/rizq-logo.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tabs = ["Statistics", "Registration Requests", "AI Fraud Detection", "User Management"] as const;

const COLORS = ["hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(220, 70%, 50%)"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Statistics");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <aside className="w-64 gradient-dark min-h-screen p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-lg font-bold text-primary-foreground">SafeBite Admin</span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {[
              { icon: LayoutDashboard, label: "Statistics", tab: "Statistics" as const },
              { icon: UserCog, label: "Registrations", tab: "Registration Requests" as const },
              { icon: Sparkles, label: "AI Fraud Detection", tab: "AI Fraud Detection" as const },
              { icon: Users, label: "User Management", tab: "User Management" as const },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.tab
                    ? "gradient-primary text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground">
            <LogOut size={18} /> Log Out
          </button>
        </aside>
        <main className="flex-1 p-8">
          <AdminContent activeTab={activeTab} />
        </main>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        <div className="gradient-primary px-5 pt-6 pb-4 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-primary-foreground" />
              <div>
                <h1 className="text-lg font-bold text-primary-foreground">SafeBite Admin</h1>
                <p className="text-xs text-primary-foreground/70">Control Room</p>
              </div>
            </div>
            <Bell size={22} className="text-primary-foreground/80" />
          </div>
        </div>
        <div className="flex gap-1 px-4 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="page-padding">
          <AdminContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

const AdminContent = ({ activeTab }: { activeTab: string }) => {
  if (activeTab === "Statistics") return <StatisticsTab />;
  if (activeTab === "Registration Requests") return <RegistrationRequestsTab />;
  if (activeTab === "AI Fraud Detection") return <FraudDetectionTab />;
  return <UserManagementTab />;
};

// ============ STATISTICS TAB ============
const StatisticsTab = () => {
  const [stats, setStats] = useState({ total: 0, delivered: 0, posted: 0, rejected: 0 });
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("food_donations").select("*");
      if (error) { setLoading(false); return; }
      const d = data || [];
      setDonations(d);
      setStats({
        total: d.length,
        delivered: d.filter(x => x.status === "delivered").length,
        posted: d.filter(x => x.status === "posted").length,
        rejected: d.filter(x => !x.ai_safe).length,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Prepare chart data
  const statusPieData = [
    { name: "Delivered", value: stats.delivered },
    { name: "Posted", value: stats.posted },
    { name: "Rejected", value: stats.rejected },
    { name: "Other", value: Math.max(0, stats.total - stats.delivered - stats.posted - stats.rejected) },
  ].filter(d => d.value > 0);

  // Weekly data from donations
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = days.map((day, i) => {
    const dayDonations = donations.filter(d => new Date(d.created_at).getDay() === i);
    return {
      day,
      donations: dayDonations.length,
      delivered: dayDonations.filter(d => d.status === "delivered").length,
    };
  });

  // Quality score distribution
  const qualityData = [
    { range: "90-100", count: donations.filter(d => d.ai_quality_score && d.ai_quality_score >= 90).length },
    { range: "80-89", count: donations.filter(d => d.ai_quality_score && d.ai_quality_score >= 80 && d.ai_quality_score < 90).length },
    { range: "70-79", count: donations.filter(d => d.ai_quality_score && d.ai_quality_score >= 70 && d.ai_quality_score < 80).length },
    { range: "<70", count: donations.filter(d => d.ai_quality_score && d.ai_quality_score < 70).length },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { value: stats.total, label: "Total Donations", icon: Package, color: "text-primary" },
          { value: stats.delivered, label: "Delivered", icon: CheckCircle, color: "text-primary" },
          { value: stats.posted, label: "Active / Posted", icon: Bell, color: "text-secondary" },
          { value: stats.rejected, label: "AI Rejected", icon: AlertTriangle, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon size={20} className={s.color} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground text-center">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Donation Status Pie */}
        <div className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-3">📊 Donation Status</h3>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No donation data yet</p>
          )}
        </div>

        {/* Weekly Trend */}
        <div className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-3">📈 Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="donations" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="delivered" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quality Score Distribution */}
      <div className="glass-card p-4">
        <h3 className="font-semibold text-foreground mb-3">🤖 AI Quality Score Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={qualityData}>
            <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============ REGISTRATION REQUESTS TAB ============
const RegistrationRequestsTab = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("registration_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    const { error } = await supabase
      .from("registration_requests")
      .update({ status: action, reviewed_by: (await supabase.auth.getUser()).data.user?.id })
      .eq("id", id);

    if (error) { toast.error("Failed to update"); return; }
    toast.success(action === "approved" ? "User approved! Role assigned automatically." : "Request rejected.");
    fetchRequests();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <UserCog size={18} className="text-primary" /> Registration Requests
      </h3>
      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No registration requests</p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => (
            <div key={r.id} className="glass-card-elevated p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{r.full_name}</h4>
                  <p className="text-xs text-muted-foreground font-body">
                    {r.requested_role.toUpperCase()} · CNIC: {r.cnic}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">📞 {r.phone}</p>
                  {r.address && <p className="text-xs text-muted-foreground font-body">📍 {r.address}</p>}
                  {r.organization && <p className="text-xs text-muted-foreground font-body">🏢 {r.organization}</p>}
                  {r.reason && <p className="text-xs text-muted-foreground font-body mt-1">"{r.reason}"</p>}
                </div>
                <span className={
                  r.status === "approved" ? "badge-verified" :
                  r.status === "rejected" ? "badge-fraud" :
                  "px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary"
                }>
                  {r.status}
                </span>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAction(r.id, "approved")}
                    className="flex-1 py-2 rounded-xl font-semibold text-primary-foreground gradient-primary text-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(r.id, "rejected")}
                    className="flex-1 py-2 rounded-xl font-semibold text-destructive-foreground bg-destructive text-sm flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============ FRAUD DETECTION TAB ============
const FraudDetectionTab = () => {
  const [flagged, setFlagged] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("food_donations")
        .select("*")
        .order("created_at", { ascending: false });
      setFlagged(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/food-images/${url}`;
  };

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Shield size={18} className="text-primary" /> AI Food Quality Monitor
      </h3>
      <div className="flex flex-col gap-3">
        {flagged.map((a) => (
          <div key={a.id} className="food-card flex items-center gap-3 p-3">
            {getImageUrl(a.image_url) ? (
              <img src={getImageUrl(a.image_url)!} alt={a.title} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Package size={20} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm">{a.title}</h4>
              <p className="text-xs text-muted-foreground font-body">
                Score: {a.ai_quality_score ?? "N/A"}/100 · {a.ai_quality_label ?? "Pending"}
              </p>
              <p className="text-xs text-muted-foreground font-body">{a.ai_freshness ?? ""}</p>
            </div>
            <span className={a.ai_safe ? "badge-verified" : "badge-fraud"}>
              {a.ai_safe ? "Safe ✓" : "Unsafe ✗"}
            </span>
          </div>
        ))}
        {flagged.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No donations to review</p>}
      </div>
    </div>
  );
};

// ============ USER MANAGEMENT TAB ============
const UserManagementTab = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*");
      
      const merged = (roles || []).map(r => {
        const profile = (profiles || []).find(p => p.id === r.user_id);
        return { ...r, full_name: profile?.full_name || "Unknown", email: profile?.email || "" };
      });
      setUsers(merged);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Users size={18} className="text-primary" /> Active Users ({users.length})
      </h3>
      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div key={u.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {(u.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{u.full_name}</h4>
                <p className="text-xs text-muted-foreground font-body">{u.role} · {u.email}</p>
              </div>
            </div>
            <span className="badge-verified">{u.role}</span>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No users with roles yet</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
