import { Home, PlusCircle, Clock, MessageCircle, User, Bell } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/rizq-logo.png";
import biryani from "@/assets/food-biryani.jpg";
import cake from "@/assets/food-cake.jpg";
import dal from "@/assets/food-dal.jpg";
import { useNavigate } from "react-router-dom";

const donorNav = [
  { icon: Home, label: "Home", path: "/donor" },
  { icon: PlusCircle, label: "Donate", path: "/donor/post" },
  { icon: Clock, label: "History", path: "/donor/history" },
  { icon: MessageCircle, label: "Chat", path: "/donor/chat" },
  { icon: User, label: "Profile", path: "/donor/profile" },
];

const recentDonations = [
  { id: 1, title: "Biryani for 25", location: "Gulberg, Lahore", time: "2 hours ago", img: biryani, status: "Picked Up" },
  { id: 2, title: "Fresh Cake - 5 slices", location: "DHA Phase 5", time: "5 hours ago", img: cake, status: "Delivered" },
  { id: 3, title: "Dal Chawal for 15", location: "Model Town, Lahore", time: "1 day ago", img: dal, status: "Delivered" },
];

const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="gradient-primary px-5 pt-6 pb-10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">SafeBite</h1>
              <p className="text-xs text-primary-foreground/70">Donor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/notifications")} className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground relative">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-destructive border-2 border-primary" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-sm font-bold">
              SA
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "12", label: "Total Donations" },
            { value: "156", label: "Meals Served" },
            { value: "4.8", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-[10px] text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-padding -mt-4 relative z-10">
        <button
          onClick={() => navigate("/donor/post")}
          className="w-full glass-card-elevated p-4 flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-12 rounded-2xl gradient-warm flex items-center justify-center">
            <PlusCircle size={24} className="text-secondary-foreground" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Post Surplus Food</h3>
            <p className="text-xs text-muted-foreground font-body">AI will verify quality before posting</p>
          </div>
        </button>

        <h2 className="text-lg font-bold text-foreground mb-3">Recent Donations</h2>
        <div className="flex flex-col gap-3">
          {recentDonations.map((d) => (
            <div key={d.id} className="food-card flex items-center gap-3 p-3">
              <img src={d.img} alt={d.title} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">{d.title}</h4>
                <p className="text-xs text-muted-foreground font-body">📍 {d.location}</p>
                <p className="text-xs text-muted-foreground font-body">{d.time}</p>
              </div>
              <span className={d.status === "Delivered" ? "badge-verified" : "badge-pending"}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav items={donorNav} />
    </div>
  );
};

export default DonorDashboard;
