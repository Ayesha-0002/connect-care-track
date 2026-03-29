import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useChatMessages } from "@/hooks/useDirectMessages";

type Props = {
  currentUserId: string;
  otherUserId: string;
  otherName: string;
  donationId?: string | null;
  donationTitle?: string | null;
  onBack: () => void;
};

const ChatThread = ({ currentUserId, otherUserId, otherName, donationId, donationTitle, onBack }: Props) => {
  const { messages, loading, sendMessage } = useChatMessages(currentUserId, otherUserId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, donationId || undefined);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-border flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">{(otherName || "U").charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-foreground truncate">{otherName}</h2>
          {donationTitle && <p className="text-xs text-primary font-body truncate">📦 {donationTitle}</p>}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm font-body mt-8">
            Start a conversation! 👋
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] p-3 rounded-2xl text-sm font-body ${
                msg.sender_id === currentUserId
                  ? "ml-auto gradient-primary text-primary-foreground rounded-br-md"
                  : "mr-auto bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body text-sm"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
