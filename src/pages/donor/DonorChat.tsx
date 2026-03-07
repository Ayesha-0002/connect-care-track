import { useState } from "react";
import { Home, PlusCircle, Clock, MessageCircle, User, Send, Bot } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const donorNav = [
  { icon: Home, label: "Home", path: "/donor" },
  { icon: PlusCircle, label: "Donate", path: "/donor/post" },
  { icon: Clock, label: "History", path: "/donor/history" },
  { icon: MessageCircle, label: "Chat", path: "/donor/chat" },
  { icon: User, label: "Profile", path: "/donor/profile" },
];

type Message = { id: number; text: string; sender: "user" | "bot" };

const initialMessages: Message[] = [
  { id: 1, text: "Assalam-o-Alaikum! I'm your Rizq-Connect AI assistant. How can I help you today? 🤝", sender: "bot" },
];

const DonorChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        text: "Thank you for your message! I can help you with posting food, tracking donations, or finding nearby volunteers. What would you like to do?",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
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
            <h1 className="text-lg font-bold text-foreground">AI Chatbot</h1>
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
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <BottomNav items={donorNav} />
    </div>
  );
};

export default DonorChat;
