import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Phone, MessageCircle, Camera, CheckCircle, Locate, Loader2, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LeafletMap from "@/components/LeafletMap";

const LiveTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get("donation");

  const [status, setStatus] = useState<"en-route" | "arrived" | "delivered">("en-route");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [eta, setEta] = useState(20);
  const [distance, setDistance] = useState(5.2);

  // Simulated pickup & dropoff (in production, fetch from donation)
  const pickupLat = 31.5204;
  const pickupLng = 74.3587;
  const dropoffLat = 31.4804;
  const dropoffLng = 74.3187;

  // Calculate distance between two points
  const calcDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  // Update location to database
  const updateLocationInDb = useCallback(async (lat: number, lng: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !donationId) return;

    const { data: existing } = await supabase
      .from("volunteer_tracking")
      .select("id")
      .eq("volunteer_id", user.id)
      .eq("donation_id", donationId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("volunteer_tracking")
        .update({ latitude: lat, longitude: lng, status, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("volunteer_tracking")
        .insert({ volunteer_id: user.id, donation_id: donationId, latitude: lat, longitude: lng, status });
    }
  }, [donationId, status]);

  // Watch GPS position
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setGpsError(null);

        // Calculate distance to dropoff
        const dist = calcDistance(latitude, longitude, dropoffLat, dropoffLng);
        setDistance(+dist.toFixed(1));
        // Estimate ETA at ~30km/h avg speed
        setEta(Math.ceil((dist / 30) * 60));

        // Auto-detect arrival
        if (dist < 0.1) setStatus("arrived");

        // Update DB every position change
        updateLocationInDb(latitude, longitude);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError("Location permission denied. Please enable GPS.");
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError("Location unavailable. Check your GPS.");
            break;
          default:
            setGpsError("Unable to get location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [calcDistance, updateLocationInDb]);

  const handleConfirmDelivery = async () => {
    setStatus("delivered");
    if (donationId) {
      await supabase.from("food_donations").update({ status: "delivered" }).eq("id", donationId);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("volunteer_tracking").update({ status: "delivered" }).eq("volunteer_id", user.id).eq("donation_id", donationId);
      }
    }
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
      <div className="mx-4 rounded-2xl overflow-hidden border border-border">
        {gpsError ? (
          <div className="h-72 flex flex-col items-center justify-center bg-muted/50 gap-3 p-6">
            <AlertTriangle size={32} className="text-destructive" />
            <p className="text-sm text-foreground font-medium text-center">{gpsError}</p>
            <p className="text-xs text-muted-foreground font-body text-center">
              Please enable location services and refresh
            </p>
          </div>
        ) : !location ? (
          <div className="h-72 flex flex-col items-center justify-center bg-muted/50 gap-3">
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-sm text-foreground font-medium">Getting GPS location...</p>
            <p className="text-xs text-muted-foreground font-body">Please allow location access</p>
          </div>
        ) : (
          <LeafletMap
            latitude={location.lat}
            longitude={location.lng}
            pickupLat={pickupLat}
            pickupLng={pickupLng}
            dropoffLat={dropoffLat}
            dropoffLng={dropoffLng}
            className="h-72"
          />
        )}
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
          <p className="text-lg font-bold text-foreground">{eta} min</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground font-body">Status</p>
          <p className="text-sm font-bold text-primary">
            {status === "arrived" ? "Arrived 📍" : "En Route 🚗"}
          </p>
        </div>
      </div>

      {/* Pickup details */}
      <div className="mx-4 mt-4 glass-card-elevated p-4">
        <h3 className="font-semibold text-foreground mb-3">Pickup Details</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-primary mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Pickup Point</p>
            <p className="text-xs text-muted-foreground font-body">Gulberg III, Lahore</p>
          </div>
        </div>
        <div className="ml-1.5 w-px h-6 bg-border" />
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Drop-off Point</p>
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
