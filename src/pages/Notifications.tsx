import { useEffect, useState } from "react";
import { ArrowLeft, Bell, MapPin, CheckCircle, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, { icon: any; color: string; bg: string }> = {
  "new-food": { icon: MapPin, color: "text-primary", bg: "bg-primary/10" },
  "ai-verified": { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  "pickup-assigned": { icon: Bell, color: "text-secondary", bg: "bg-secondary/10" },
  "delivered": { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  "fraud-alert": { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  "approval": { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  "rejection": { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifications();

    // Realtime subscription
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mobile-container min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && <span className="ml-auto text-xs font-medium text-primary">{unreadCount} new</span>}
      </div>

      <div className="page-padding flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground font-body">Koi notification nahi hai abhi</p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = iconMap[n.type] || iconMap["new-food"];
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`glass-card p-4 flex items-start gap-3 transition-all cursor-pointer ${!n.read ? "border-l-4 border-l-primary" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">{n.title}</h4>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
