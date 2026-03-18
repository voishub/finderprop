import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContactFormProps {
  propertyTitle: string;
}

const ContactForm = ({ propertyTitle }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Molimo popunite sva polja.");
      return;
    }
    setLoading(true);
    // Mock send
    setTimeout(() => {
      toast.success("Upit je uspješno poslan vlasniku!");
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-5">
      <h3 className="font-display font-semibold text-foreground mb-4">Pošalji upit vlasniku</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Imate pitanje o "{propertyTitle}"? Pošaljite nam poruku.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Vaše ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
          maxLength={100}
        />
        <input
          type="email"
          placeholder="Email adresa"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
          maxLength={255}
        />
        <textarea
          placeholder="Vaša poruka..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand resize-none"
          maxLength={1000}
        />
        <Button variant="accent" type="submit" className="w-full gap-2" disabled={loading}>
          <Send className="w-4 h-4" />
          {loading ? "Slanje..." : "Pošalji upit vlasniku"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
