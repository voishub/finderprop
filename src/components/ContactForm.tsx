import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateConversation } from "@/hooks/useConversations";

interface ContactFormProps {
  propertyTitle: string;
  propertyId: string;
}

const ContactForm = ({ propertyTitle, propertyId }: ContactFormProps) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const createConversation = useCreateConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Morate biti prijavljeni da biste poslali poruku.");
      return;
    }
    if (!message.trim()) {
      toast.error("Unesite poruku.");
      return;
    }

    createConversation.mutate({
      propertyId,
      userId: user.id,
      selectedDates: "",
      initialMessage: message.trim(),
    }, {
      onSuccess: () => {
        toast.success("Poruka je uspješno poslana!");
        setMessage("");
      },
      onError: () => {
        toast.error("Greška pri slanju poruke.");
      },
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-5">
      <h3 className="font-display font-semibold text-foreground mb-4">Pošalji upit vlasniku</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Imate pitanje o "{propertyTitle}"? Pošaljite nam poruku.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {user ? (
          <p className="text-xs text-muted-foreground">
            Šaljete kao: <span className="font-medium text-foreground">{user.user_metadata?.full_name || user.email}</span>
          </p>
        ) : (
          <p className="text-xs text-accent-foreground bg-accent/15 px-3 py-2 rounded-lg">
            Prijavite se da biste poslali poruku.
          </p>
        )}
        <textarea
          placeholder="Vaša poruka..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand resize-none"
          maxLength={1000}
        />
        <Button variant="accent" type="submit" className="w-full gap-2" disabled={createConversation.isPending || !user}>
          <Send className="w-4 h-4" />
          {createConversation.isPending ? "Slanje..." : "Pošalji upit vlasniku"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
