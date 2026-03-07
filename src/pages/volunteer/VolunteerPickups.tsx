import { Home, MapPin, Package, MessageCircle, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import biryani from "@/assets/food-biryani.jpg";
import cake from "@/assets/food-cake.jpg";
import dal from "@/assets/food-dal.jpg";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

const pickups = [
  { id: 1, title: "1 kg Tomato Pasta for 10", location: "Green Park", time: "01:30 - 3:30 PM", img: biryani, status: "1 day left", urgent: true },
  { id: 2, title: "100+ macros of Flavours", location: "Malviya Nagar", time: "12:30 - 3:30 PM", img: cake, status: "Flexible", urgent: false },
  { id: 3, title: "25 Donuts with strawberry", location: "Green Park", time: "01:30 - 3:30 PM", img: dal, status: "1 day left", urgent: true },
];

const VolunteerPickups = () => {
  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pickups</h1>
          <p className="text-sm text-muted-foreground font-body">Unpickuped Orders: <span className="text-primary font-semibold">25</span></p>
        </div>
      </div>

      <div className="page-padding flex flex-col gap-3">
        {pickups.map((p) => (
          <div key={p.id} className="food-card p-3">
            <div className="flex items-start gap-3">
              <img src={p.img} alt={p.title} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm">{p.title}</h4>
                <p className="text-xs text-muted-foreground font-body mt-0.5">📍 {p.location}</p>
                <p className="text-xs text-muted-foreground font-body">🕐 {p.time}</p>
                <span className={p.urgent ? "badge-fraud mt-1 inline-block" : "badge-verified mt-1 inline-block"}>
                  {p.status}
                </span>
              </div>
            </div>
            <button className="w-full mt-3 py-2.5 rounded-xl font-semibold text-primary-foreground gradient-primary text-sm">
              PICKUP
            </button>
          </div>
        ))}
      </div>

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerPickups;
