import { Home, MapPin, Package, MessageCircle, User, Navigation } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/rizq-logo.png";
import biryani from "@/assets/food-biryani.jpg";
import cake from "@/assets/food-cake.jpg";
import dal from "@/assets/food-dal.jpg";
import { useNavigate } from "react-router-dom";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

const availablePickups = [
  { id: 1, title: "Biryani for 25", donor: "Laziz Swaad Restaurant", distance: "1.2 km", time: "30 min left", img: biryani, verified: true },
  { id: 2, title: "Fresh Cake - 10 pcs", donor: "Sweet Corner Bakery", distance: "2.5 km", time: "1 hr left", img: cake, verified: true },
  { id: 3, title: "Dal Chawal for 15", donor: "Mama's Kitchen", distance: "0.8 km", time: "45 min left", img: dal, verified: true },
];

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="gradient-primary px-5 pt-6 pb-10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Rizq-Connect</h1>
              <p className="text-xs text-primary-foreground/70">Volunteer Dashboard</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-sm font-bold">
            VK
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "26", label: "Pickups Done" },
            { value: "4.9", label: "Rating" },
            { value: "3", label: "Active" },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-[10px] text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-padding -mt-4 relative z-10">
        {/* Live Tracking Button */}
        <button
          onClick={() => navigate("/volunteer/tracking")}
          className="w-full glass-card-elevated p-4 flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center relative">
            <Navigation size={24} className="text-secondary" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse-dot" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Live Tracking</h3>
            <p className="text-xs text-muted-foreground font-body">Active pickup: Biryani → Shelter Home</p>
          </div>
        </button>

        <h2 className="text-lg font-bold text-foreground mb-3">Available Pickups</h2>
        <div className="flex flex-col gap-3">
          {availablePickups.map((p) => (
            <div key={p.id} className="food-card p-3">
              <div className="flex items-center gap-3">
                <img src={p.img} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground text-sm truncate">{p.title}</h4>
                    {p.verified && <span className="badge-verified text-[10px]">AI ✓</span>}
                  </div>
                  <p className="text-xs text-muted-foreground font-body">{p.donor}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">📍 {p.distance}</span>
                    <span className="text-xs text-warning font-medium">⏱ {p.time}</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-3 py-2.5 rounded-xl font-semibold text-primary-foreground gradient-primary text-sm transition-all hover:opacity-90 active:scale-[0.98]">
                Accept Pickup
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerDashboard;
