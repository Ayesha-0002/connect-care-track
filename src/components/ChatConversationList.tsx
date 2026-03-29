import { MessageCircle } from "lucide-react";
import { Conversation } from "@/hooks/useDirectMessages";
import { formatDistanceToNow } from "date-fns";

type Props = {
  conversations: Conversation[];
  loading: boolean;
  onSelect: (conv: Conversation) => void;
  emptyMessage?: string;
};

const ChatConversationList = ({ conversations, loading, onSelect, emptyMessage }: Props) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MessageCircle size={28} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No conversations yet</h3>
        <p className="text-sm text-muted-foreground font-body">
          {emptyMessage || "Messages will appear here when someone contacts you about a donation."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.user_id}
          onClick={() => onSelect(conv)}
          className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors border-b border-border text-left"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">
              {(conv.full_name || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-sm truncate">{conv.full_name || "User"}</span>
              {conv.last_time && (
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {formatDistanceToNow(new Date(conv.last_time), { addSuffix: true })}
                </span>
              )}
            </div>
            {conv.donation_title && (
              <p className="text-xs text-primary font-medium truncate">📦 {conv.donation_title}</p>
            )}
            <p className="text-xs text-muted-foreground truncate font-body">{conv.last_message}</p>
          </div>
          {conv.unread > 0 && (
            <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-[10px] font-bold">{conv.unread}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ChatConversationList;
