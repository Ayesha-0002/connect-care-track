import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Clock, Upload, Sparkles } from "lucide-react";

const PostFood = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "ai-check" | "done">("form");
  const [form, setForm] = useState({
    title: "",
    quantity: "",
    location: "",
    pickupDay: "today",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("ai-check");
    setTimeout(() => setStep("done"), 2500);
  };

  if (step === "ai-check") {
    return (
      <div className="mobile-container min-h-screen bg-background flex flex-col items-center justify-center page-padding">
        <div className="glass-card-elevated p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse-dot">
            <Sparkles size={28} className="text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">AI Quality Check</h2>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Our AI is analyzing the food quality and freshness...
          </p>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full gradient-primary rounded-full animate-[slide-up_2s_ease-in-out]" style={{ width: "80%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="mobile-container min-h-screen bg-background flex flex-col items-center justify-center page-padding">
        <div className="glass-card-elevated p-8 text-center max-w-sm w-full animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Food Verified & Posted!</h2>
          <p className="text-sm text-muted-foreground font-body mb-6">
            AI has verified the quality. Nearby volunteers have been notified.
          </p>
          <button
            onClick={() => navigate("/donor")}
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
        <h1 className="text-xl font-bold text-foreground">Post Donation</h1>
      </div>

      <form onSubmit={handleSubmit} className="page-padding flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Food Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Biryani for 20"
            className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Quantity (servings)</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="e.g. 25"
            className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5">
            <MapPin size={14} /> Pickup Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Enter address or use GPS"
            className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5">
            <Clock size={14} /> Pickup Day
          </label>
          <div className="flex gap-2">
            {["today", "tomorrow", "day after"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setForm({ ...form, pickupDay: day })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  form.pickupDay === day
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block flex items-center gap-1.5">
            <Camera size={14} /> Add Photo
          </label>
          <div className="flex gap-2">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
              <Upload size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Additional Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any special instructions..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground gradient-primary transition-all hover:opacity-90 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Post & Verify with AI
        </button>
      </form>
    </div>
  );
};

export default PostFood;
