import { ArrowLeft, Navigation, MapPin, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveTracking = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Live Tracking</h1>
      </div>

      {/* Map placeholder */}
      <div className="mx-4 h-72 rounded-2xl bg-accent/50 border border-border relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2 animate-pulse-dot">
              <Navigation size={20} className="text-primary-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Live Map View</p>
            <p className="text-xs text-muted-foreground font-body">GPS tracking active</p>
          </div>
        </div>
        
        {/* Route line simulation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          <path d="M 80 250 C 120 200, 150 150, 200 130 S 300 80, 340 60" stroke="hsl(160, 84%, 39%)" strokeWidth="3" fill="none" strokeDasharray="8 4" />
          <circle cx="80" cy="250" r="8" fill="hsl(160, 84%, 39%)" />
          <circle cx="340" cy="60" r="8" fill="hsl(0, 72%, 51%)" />
          <circle cx="200" cy="130" r="6" fill="hsl(38, 92%, 50%)" className="animate-pulse-dot" />
        </svg>
      </div>

      {/* Distance info */}
      <div className="mx-4 mt-4 glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-body">Distance</p>
          <p className="text-lg font-bold text-foreground">10.3 Km</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground font-body">ETA</p>
          <p className="text-lg font-bold text-foreground">20 min</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground font-body">Status</p>
          <p className="text-sm font-bold text-primary">En Route</p>
        </div>
      </div>

      {/* Pickup details */}
      <div className="mx-4 mt-4 glass-card-elevated p-4">
        <h3 className="font-semibold text-foreground mb-3">Pickup Details</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-primary mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Laziz Swaad Restaurant</p>
            <p className="text-xs text-muted-foreground font-body">Green Park, New Delhi</p>
          </div>
        </div>
        <div className="ml-1.5 w-px h-6 bg-border" />
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Shelter Home</p>
            <p className="text-xs text-muted-foreground font-body">Saket Metro Station</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-4 mb-6 flex gap-3">
        <button className="flex-1 py-3 rounded-xl font-semibold text-primary-foreground gradient-primary flex items-center justify-center gap-2 text-sm">
          <Phone size={16} /> Call Donor
        </button>
        <button className="flex-1 py-3 rounded-xl font-semibold text-foreground bg-muted flex items-center justify-center gap-2 text-sm">
          <MessageCircle size={16} /> Message
        </button>
      </div>

      {/* Confirm delivery */}
      <div className="mx-4 mb-8">
        <button className="w-full py-3.5 rounded-xl font-semibold text-secondary-foreground gradient-warm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2">
          <MapPin size={18} /> Confirm Delivery with GPS Photo
        </button>
      </div>
    </div>
  );
};

export default LiveTracking;
