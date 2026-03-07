import { Home, PlusCircle, Clock, MessageCircle, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import biryani from "@/assets/food-biryani.jpg";
import cake from "@/assets/food-cake.jpg";
import dal from "@/assets/food-dal.jpg";

const donorNav = [
  { icon: Home, label: "Home", path: "/donor" },
  { icon: PlusCircle, label: "Donate", path: "/donor/post" },
  { icon: Clock, label: "History", path: "/donor/history" },
  { icon: MessageCircle, label: "Chat", path: "/donor/chat" },
  { icon: User, label: "Profile", path: "/donor/profile" },
];

const history = [
  { id: 1, title: "Biryani for 25", location: "Green Park", date: "12 Jan 2025", img: biryani, status: "Delivered" },
  { id: 2, title: "Fresh Cake", location: "Malviya Nagar", date: "10 Jan 2025", img: cake, status: "Delivered" },
  { id: 3, title: "Dal Chawal for 15", location: "Saket", date: "8 Jan 2025", img: dal, status: "Delivered" },
  { id: 4, title: "Noodle Soup for 10", location: "Green Park", date: "5 Jan 2025", img: biryani, status: "Expired" },
];

const DonorHistory = () => {
  return (
    <div className="mobile-container min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Your Donations</h1>
        <p className="text-sm text-muted-foreground font-body">Total: {history.length} donations</p>
      </div>

      <div className="page-padding flex flex-col gap-3">
        {history.map((d) => (
          <div key={d.id} className="food-card flex items-center gap-3 p-3">
            <img src={d.img} alt={d.title} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm truncate">{d.title}</h4>
              <p className="text-xs text-muted-foreground font-body">📍 {d.location}</p>
              <p className="text-xs text-muted-foreground font-body">🗓 {d.date}</p>
            </div>
            <span className={d.status === "Delivered" ? "badge-verified" : "badge-fraud"}>
              {d.status}
            </span>
          </div>
        ))}
      </div>

      <BottomNav items={donorNav} />
    </div>
  );
};

export default DonorHistory;
