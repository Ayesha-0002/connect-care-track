import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Bell, LayoutDashboard, Sparkles, UserCog, LogOut } from "lucide-react";
import biryani from "@/assets/food-biryani.jpg";
import cake from "@/assets/food-cake.jpg";
import dal from "@/assets/food-dal.jpg";
import logo from "@/assets/rizq-logo.png";
import { useNavigate } from "react-router-dom";

const chartData = [
  { day: "Mon", approved: 12, rejected: 3 },
  { day: "Tue", approved: 15, rejected: 4 },
  { day: "Wed", approved: 10, rejected: 2 },
  { day: "Thu", approved: 18, rejected: 1 },
  { day: "Fri", approved: 14, rejected: 3 },
  { day: "Sat", approved: 20, rejected: 2 },
];

const fraudAlerts = [
  { id: 1, title: "Biryani", detail: "Actually detected: Old food, 2 days", img: biryani, status: "fraud" as const },
  { id: 2, title: "Fresh Cake", detail: "Verified: Fresh, same day", img: cake, status: "verified" as const },
  { id: 3, title: "Dal Chawal", detail: "AI detected: Mold visible", img: dal, status: "fraud" as const },
];

const tabs = ["Statistics", "AI Fraud Detection", "User Management"] as const;

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
            <span className="text-lg font-bold text-primary-foreground">Rizq-Connect</span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {[
              { icon: LayoutDashboard, label: "Statistics", tab: "Statistics" as const },
              { icon: Sparkles, label: "AI Fraud Detection", tab: "AI Fraud Detection" as const },
              { icon: UserCog, label: "User Management", tab: "User Management" as const },
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
                <h1 className="text-lg font-bold text-primary-foreground">Admin Panel</h1>
                <p className="text-xs text-primary-foreground/70">Control Room</p>
              </div>
            </div>
            <Bell size={22} className="text-primary-foreground/80" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
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
  if (activeTab === "Statistics") {
    return (
      <div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "47", label: "Approved Today", icon: CheckCircle, color: "text-primary" },
            { value: "8", label: "Rejected Today", icon: XCircle, color: "text-destructive" },
            { value: "3", label: "Fraud Caught", icon: AlertTriangle, color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <s.icon size={20} className={s.color} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground text-center">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            📊 Daily Approval vs Rejection
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="approved" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm bg-primary" /> Approved
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-sm bg-destructive" /> Rejected
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "AI Fraud Detection") {
    return (
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield size={18} className="text-primary" /> AI Fraud Detection
        </h3>
        <div className="flex flex-col gap-3">
          {fraudAlerts.map((a) => (
            <div key={a.id} className="food-card flex items-center gap-3 p-3">
              <img src={a.img} alt={a.title} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm">Uploaded: {a.title}</h4>
                <p className="text-xs text-muted-foreground font-body">{a.detail}</p>
              </div>
              <span className={a.status === "verified" ? "badge-verified" : "badge-fraud"}>
                {a.status === "verified" ? "Verified ✓" : "Fraud ✗"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // User Management
  const users = [
    { name: "Sushil Kumar", role: "Donor", status: "Active", donations: 12 },
    { name: "Vikas Rajshri", role: "Volunteer", status: "Active", donations: 26 },
    { name: "Mama's Kitchen", role: "Donor", status: "Active", donations: 8 },
    { name: "Ali Ahmed", role: "Volunteer", status: "Suspended", donations: 3 },
  ];

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Users size={18} className="text-primary" /> User Management
      </h3>
      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div key={u.name} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {u.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{u.name}</h4>
                <p className="text-xs text-muted-foreground font-body">{u.role} · {u.donations} contributions</p>
              </div>
            </div>
            <span className={u.status === "Active" ? "badge-verified" : "badge-fraud"}>
              {u.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
