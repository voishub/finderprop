import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMessages, useSendMessage, type Message } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";

interface ChatWindowProps {
  conversationId: string;
  otherPartyName: string;
  selectedDates?: string;
}

const ChatWindow = ({ conversationId, otherPartyName, selectedDates }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !user) return;
    sendMessage.mutate({
      conversationId,
      senderId: user.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <h3 className="font-display font-semibold text-sm text-foreground">{otherPartyName}</h3>
        {selectedDates && (
          <p className="text-xs text-accent-foreground bg-accent/15 inline-block px-2 py-0.5 rounded font-tabular mt-1">
            📅 {selectedDates}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Nema poruka</p>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"} font-tabular`}>
                    {new Date(msg.created_at).toLocaleTimeString("sr", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Upišite poruku..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
        />
        <Button
          variant="accent"
          size="icon"
          onClick={handleSend}
          disabled={!newMessage.trim() || sendMessage.isPending}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
