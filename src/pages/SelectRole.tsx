import { useNavigate } from "react-router-dom";
import { Heart, Truck, Shield } from "lucide-react";

const roles = [
  {
    id: "donor",
    title: "Donor",
    description: "You will donate food to the needy",
    icon: Heart,
    path: "/donor",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "volunteer",
    title: "Volunteer / NGO",
    description: "You will pickup and deliver food",
    icon: Truck,
    path: "/volunteer",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage platform & oversee operations",
    icon: Shield,
    path: "/admin",
    color: "bg-accent text-accent-foreground",
  },
];

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background flex flex-col items-center justify-center page-padding">
      <div className="text-center mb-10 animate-fade-in">
        <p className="text-sm text-muted-foreground font-body mb-2">Choose one</p>
        <h1 className="text-3xl font-bold text-foreground">Welcome, you are a?</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {roles.map((role, i) => (
          <button
            key={role.id}
            onClick={() => navigate(role.path)}
            className="glass-card-elevated p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role.color}`}>
              <role.icon size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{role.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectRole;
