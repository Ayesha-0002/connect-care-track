import { useState } from "react";
import { Home, MapPin, Package, MessageCircle, User, Send, Bot } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

type Message = { id: number; text: string; sender: "user" | "bot" };

const VolunteerChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Assalam-o-Alaikum! I'm your SafeBite AI assistant. I can help you with pickups and deliveries. 🚗", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "I can help you find the best route, contact donors, or resolve pickup issues. What do you need?", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="mobile-container min-h-screen bg-background pb-20 flex flex-col">
      <div className="px-5 pt-6 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Bot size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SafeBite AI</h1>
            <p className="text-xs text-primary font-body">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto page-padding flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-3 rounded-2xl text-sm font-body ${
              msg.sender === "user"
                ? "ml-auto gradient-primary text-primary-foreground rounded-br-md"
                : "mr-auto bg-muted text-foreground rounded-bl-md"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border bg-card mb-16">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
          <button onClick={sendMessage} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
            <Send size={18} />
          </button>
        </div>
      </div>

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerChat;
