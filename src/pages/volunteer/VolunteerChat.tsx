import { useEffect, useRef } from "react";
import { Home, MapPin, Package, MessageCircle, User, Send, Bot, Square, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useStreamChat } from "@/hooks/useStreamChat";

const volunteerNav = [
  { icon: Home, label: "Home", path: "/volunteer" },
  { icon: MapPin, label: "Track", path: "/volunteer/tracking" },
  { icon: Package, label: "Pickups", path: "/volunteer/pickups" },
  { icon: MessageCircle, label: "Chat", path: "/volunteer/chat" },
  { icon: User, label: "Profile", path: "/volunteer/profile" },
];

const VolunteerChat = () => {
  const { messages, isLoading, sendMessage, stopStreaming } = useStreamChat("volunteer");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const val = inputRef.current?.value.trim();
    if (!val || isLoading) return;
    sendMessage(val);
    if (inputRef.current) inputRef.current.value = "";
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
            <p className="text-xs text-primary font-body">{isLoading ? "Typing..." : "Online"}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto page-padding flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="mr-auto max-w-[80%] p-3 rounded-2xl rounded-bl-md text-sm font-body bg-muted text-foreground">
            Assalam-o-Alaikum! 🚗 Main SafeBite AI assistant hoon. Pickups, routes, deliveries, ya kisi bhi masle mein madad ke liye puchein!
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-2xl text-sm font-body whitespace-pre-wrap ${
              msg.role === "user"
                ? "ml-auto gradient-primary text-primary-foreground rounded-br-md"
                : "mr-auto bg-muted text-foreground rounded-bl-md"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="mr-auto flex items-center gap-2 p-3 rounded-2xl rounded-bl-md bg-muted text-foreground">
            <Loader2 size={14} className="animate-spin text-primary" />
            <span className="text-sm font-body">Thinking...</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border bg-card mb-16">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Apna sawal likhein..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
          {isLoading ? (
            <button onClick={stopStreaming} className="w-10 h-10 rounded-xl bg-destructive flex items-center justify-center text-destructive-foreground">
              <Square size={16} />
            </button>
          ) : (
            <button onClick={handleSend} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
              <Send size={18} />
            </button>
          )}
        </div>
      </div>

      <BottomNav items={volunteerNav} />
    </div>
  );
};

export default VolunteerChat;
