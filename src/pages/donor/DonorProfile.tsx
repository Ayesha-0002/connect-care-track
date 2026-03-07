import { Home, PlusCircle, Clock, MessageCircle, User, LogOut, Settings, Award } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const donorNav = [
  { icon: Home, label: "Home", path: "/donor" },
  { icon: PlusCircle, label: "Donate", path: "/donor/post" },
  { icon: Clock, label: "History", path: "/donor/history" },
  { icon: MessageCircle, label: "Chat", path: "/donor/chat" },
  { icon: User, label: "Profile", path: "/donor/profile" },
];

const DonorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="gradient-primary px-5 pt-8 pb-12 rounded-b-3xl text-center">
        <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-primary-foreground">
          SK
        </div>
        <h2 className="text-xl font-bold text-primary-foreground">Sushil Kumar</h2>
        <p className="text-sm text-primary-foreground/70 font-body">Laziz Swaad Restaurant</p>
      </div>

      <div className="page-padding -mt-6 relative z-10">
        <div className="glass-card-elevated p-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Award size={24} className="text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Golden Trophy</h3>
            <p className="text-xs text-muted-foreground font-body">Top donor this month</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "12", label: "Donations" },
            { value: "156", label: "Meals" },
            { value: "4.8", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {[
            { icon: Settings, label: "Settings", action: () => {} },
            { icon: LogOut, label: "Log Out", action: () => navigate("/") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="glass-card p-4 flex items-center gap-3 text-left"
            >
              <item.icon size={20} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav items={donorNav} />
    </div>
  );
};

export default DonorProfile;
