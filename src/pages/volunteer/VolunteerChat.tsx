import { useState, useEffect } from "react";
import { Home, MapPin, Package, MessageCircle, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ChatConversationList from "@/components/ChatConversationList";
import ChatThread from "@/components/ChatThread";
import { useConversations, Conversation } from "@/hooks/useDirectMessages";
import { supabase } from "@/integrations/supabase/client";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

const VolunteerChat = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  const { conversations, loading } = useConversations(userId);

  if (activeConv && userId) {
    return (
      <div className="mobile-container min-h-screen bg-background pb-20 flex flex-col">
        <ChatThread
          currentUserId={userId}
          otherUserId={activeConv.user_id}
          otherName={activeConv.full_name || "User"}
          donationId={activeConv.donation_id}
          donationTitle={activeConv.donation_title}
          onBack={() => setActiveConv(null)}
        />
        <BottomNav items={volunteerNav} />
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-background pb-20 flex flex-col">
      <div className="px-5 pt-6 pb-3 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
        <p className="text-xs text-muted-foreground font-body">Chat with donors about food pickups</p>
      </div>

      <ChatConversationList
        conversations={conversations}
        loading={loading}
        onSelect={setActiveConv}
        emptyMessage="Jab aap kisi donor ko message karein ge ya koi aap ko message karega, wo yahan dikhai dega."
      />

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerChat;
