import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-food-donation.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({ title: "Welcome back! 🎉", description: "Login successful." });
      navigate("/select-role");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-background">
      <div className="relative">
        <img src={heroImg} alt="Food Donation" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="page-padding -mt-6 relative z-10">
        <h2 className="text-2xl font-bold text-foreground mb-1">Log In</h2>
        <p className="text-muted-foreground font-body text-sm mb-6">Welcome back! Sign in to continue.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email / Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Link to="#" className="text-primary text-sm font-medium self-end -mt-1">Forgot password?</Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground gradient-primary transition-all hover:opacity-90 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Log In
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link
            to="/register"
            className="w-full py-3.5 rounded-xl font-semibold text-primary border-2 border-primary/20 text-center transition-all hover:bg-primary/5 active:scale-[0.98]"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
