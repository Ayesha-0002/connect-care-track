import { useState, useEffect } from "react";
import { ArrowLeft, Navigation, MapPin, Phone, MessageCircle, Camera, CheckCircle, Locate } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveTracking = () => {
  const navigate = useNavigate();
  const [eta, setEta] = useState(20);
  const [distance, setDistance] = useState(10.3);
  const [status, setStatus] = useState<"en-route" | "arrived" | "delivered">("en-route");
  const [dotPosition, setDotPosition] = useState(0);

  // Simulate live GPS movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDotPosition((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
      setEta((prev) => Math.max(0, prev - 0.1));
      setDistance((prev) => Math.max(0, +(prev - 0.02).toFixed(1)));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelivery = () => {
    setStatus("delivered");
  };

  if (status === "delivered") {
    return (
      <div className="mobile-container min-h-screen bg-background flex flex-col items-center justify-center page-padding">
        <div className="glass-card-elevated p-8 text-center max-w-sm w-full animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Delivery Confirmed!</h2>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Thank you for serving the community. Your stats have been updated.
          </p>
          <button
            onClick={() => navigate("/volunteer")}
            className="w-full py-3 rounded-xl font-semibold text-primary-foreground gradient-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate animated dot position along path
  const pathProgress = dotPosition / 100;
  const animX = 80 + (340 - 80) * pathProgress;
  const animY = 250 - 190 * pathProgress + Math.sin(pathProgress * Math.PI) * -40;

  return (
    <div className="mobile-container min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Live GPS Tracking</h1>
        <div className="ml-auto flex items-center gap-1.5">
          <Locate size={14} className="text-primary animate-pulse-dot" />
          <span className="text-xs font-medium text-primary">LIVE</span>
        </div>
      </div>

      {/* Map */}
      <div className="mx-4 h-72 rounded-2xl bg-accent/50 border border-border relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2 animate-pulse-dot">
              <Navigation size={20} className="text-primary-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Real-Time GPS Active</p>
            <p className="text-xs text-muted-foreground font-body">Lahore, Pakistan</p>
          </div>
        </div>
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          {/* Route path */}
          <path d="M 80 250 C 120 200, 150 150, 200 130 S 300 80, 340 60" stroke="hsl(160, 84%, 39%)" strokeWidth="3" fill="none" strokeDasharray="8 4" />
          {/* Start point */}
          <circle cx="80" cy="250" r="8" fill="hsl(160, 84%, 39%)" />
          <text x="80" y="270" textAnchor="middle" fontSize="8" fill="hsl(160, 84%, 39%)">Pickup</text>
          {/* End point */}
          <circle cx="340" cy="60" r="8" fill="hsl(0, 72%, 51%)" />
          <text x="340" y="50" textAnchor="middle" fontSize="8" fill="hsl(0, 72%, 51%)">Drop-off</text>
          {/* Moving dot */}
          <circle cx={animX} cy={animY} r="7" fill="hsl(38, 92%, 50%)" className="drop-shadow-lg">
            <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx={animX} cy={animY} r="14" fill="hsl(38, 92%, 50%)" opacity="0.2">
            <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Distance info */}
      <div className="mx-4 mt-4 glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-body">Distance</p>
          <p className="text-lg font-bold text-foreground">{distance} Km</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground font-body">ETA</p>
          <p className="text-lg font-bold text-foreground">{Math.ceil(eta)} min</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground font-body">Status</p>
          <p className="text-sm font-bold text-primary">En Route 🚗</p>
        </div>
      </div>

      {/* Pickup details */}
      <div className="mx-4 mt-4 glass-card-elevated p-4">
        <h3 className="font-semibold text-foreground mb-3">Pickup Details</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-primary mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Royal Restaurant</p>
            <p className="text-xs text-muted-foreground font-body">Gulberg III, Lahore</p>
          </div>
        </div>
        <div className="ml-1.5 w-px h-6 bg-border" />
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Edhi Foundation Shelter</p>
            <p className="text-xs text-muted-foreground font-body">Model Town, Lahore</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-4 flex gap-3">
        <button className="flex-1 py-3 rounded-xl font-semibold text-primary-foreground gradient-primary flex items-center justify-center gap-2 text-sm">
          <Phone size={16} /> Call Donor
        </button>
        <button className="flex-1 py-3 rounded-xl font-semibold text-foreground bg-muted flex items-center justify-center gap-2 text-sm">
          <MessageCircle size={16} /> Message
        </button>
      </div>

      {/* Confirm delivery */}
      <div className="mx-4 mt-4 mb-8">
        <button
          onClick={handleConfirmDelivery}
          className="w-full py-3.5 rounded-xl font-semibold text-secondary-foreground gradient-warm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Camera size={18} /> Confirm Delivery with GPS Photo
        </button>
      </div>
    </div>
  );
};

export default LiveTracking;
