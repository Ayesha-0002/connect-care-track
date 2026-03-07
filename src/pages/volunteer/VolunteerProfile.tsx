import { Home, MapPin, Package, MessageCircle, User, LogOut, Settings, Award } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

const VolunteerProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="gradient-primary px-5 pt-8 pb-12 rounded-b-3xl text-center">
        <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-primary-foreground">
          VK
        </div>
        <h2 className="text-xl font-bold text-primary-foreground">Vikas Rajshri</h2>
        <p className="text-sm text-primary-foreground/70 font-body">26 Successful Pickups</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-warning text-sm">★</span>
          ))}
        </div>
      </div>

      <div className="page-padding -mt-6 relative z-10">
        <div className="glass-card-elevated p-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center">
            <Award size={24} className="text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Top Volunteer</h3>
            <p className="text-xs text-muted-foreground font-body">Most pickups this week</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "26", label: "Pickups" },
            { value: "4.9", label: "Rating" },
            { value: "98%", label: "On-time" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button className="glass-card p-4 flex items-center gap-3 text-left">
            <Settings size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Settings</span>
          </button>
          <button onClick={() => navigate("/")} className="glass-card p-4 flex items-center gap-3 text-left">
            <LogOut size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Log Out</span>
          </button>
        </div>
      </div>

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerProfile;
