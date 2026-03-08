import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-food-donation.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, phone: form.phone },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Check your email! 📧",
      description: "We sent you a verification link. Please verify your email to continue.",
    });
    navigate("/login");
  };

  return (
    <div className="mobile-container min-h-screen bg-background">
      <div className="relative">
        <img src={heroImg} alt="Food Donation" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="page-padding -mt-6 relative z-10">
        <h2 className="text-2xl font-bold text-foreground mb-1">Register</h2>
        <p className="text-muted-foreground font-body text-sm mb-6">Create your account to get started.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: "Name", key: "name", type: "text", placeholder: "Your full name" },
            { label: "Phone No.", key: "phone", type: "tel", placeholder: "+92 300 1234567" },
            { label: "Email ID", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Create a password (min 6 chars)" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground gradient-primary transition-all hover:opacity-90 active:scale-[0.98] mt-2 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Submit"}
          </button>

          <p className="text-center text-sm text-muted-foreground font-body">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">Log in instead</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
