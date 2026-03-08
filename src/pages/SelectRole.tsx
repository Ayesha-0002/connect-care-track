import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Truck, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roles = [
  {
    id: "donor" as AppRole,
    title: "Donor",
    description: "You will donate food to the needy",
    icon: Heart,
    path: "/donor",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "volunteer" as AppRole,
    title: "Volunteer / NGO",
    description: "You will pickup and deliver food",
    icon: Truck,
    path: "/volunteer",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "admin" as AppRole,
    title: "Admin",
    description: "Manage platform & oversee operations",
    icon: Shield,
    path: "/admin",
    color: "bg-accent text-accent-foreground",
  },
];

const SelectRole = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = async (role: typeof roles[0]) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    // Submit registration request for approval
    const { error } = await supabase.from("registration_requests").insert({
      user_id: user.id,
      full_name: user.user_metadata?.full_name || "Unknown",
      phone: user.user_metadata?.phone || "",
      cnic: "Pending",
      requested_role: role.id,
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already submitted", description: "Your request is pending admin approval.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return;
    }

    toast({
      title: "Request Submitted! ✅",
      description: "Your registration is pending admin approval. You'll be notified once approved.",
    });
    navigate("/");
  };

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
            onClick={() => handleRoleSelect(role)}
            disabled={submitting}
            className="glass-card-elevated p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] animate-slide-up disabled:opacity-50"
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
