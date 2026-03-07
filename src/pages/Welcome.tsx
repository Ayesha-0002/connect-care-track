import { useNavigate } from "react-router-dom";
import logo from "@/assets/rizq-logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary/5 translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in px-6 text-center">
        <img src={logo} alt="SafeBite Logo" className="w-32 h-32 object-contain" />
        
        <div>
          <p className="text-lg text-muted-foreground font-body mb-1">Welcome to</p>
          <h1 className="text-5xl font-extrabold text-primary tracking-tight">
            SafeBite
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-xs">
            AI-Powered Smart Food Redistribution & Quality Verification Platform
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground gradient-primary transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3.5 rounded-xl font-semibold text-primary border-2 border-primary/20 bg-primary/5 transition-all hover:bg-primary/10 active:scale-[0.98]"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
