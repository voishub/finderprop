import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, MessageSquare, Building, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, type Conversation } from "@/hooks/useConversations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "messages">("messages");
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

  const { data: conversations = [], isLoading: convosLoading } = useConversations(user?.id, false);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const propIds = [...new Set((data || []).map((b: any) => b.property_id))];
      const { data: props } = await supabase
        .from("properties")
        .select("id, title, city")
        .in("id", propIds.length ? propIds : ["none"]);

      return (data || []).map((b: any) => ({
        ...b,
        property: (props || []).find((p: any) => p.id === b.property_id),
      }));
    },
  });

  if (loading) return null;
  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">{userName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-secondary rounded-xl p-1 w-fit">
            <button
              onClick={() => { setActiveTab("messages"); setSelectedConvo(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-brand ${
                activeTab === "messages" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Poruke
              {conversations.filter(c => (c.unread_count || 0) > 0).length > 0 && (
                <span className="w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {conversations.filter(c => (c.unread_count || 0) > 0).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-brand ${
                activeTab === "bookings" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Rezervacije
            </button>
          </div>

          {activeTab === "messages" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
              <div className="space-y-2">
                {convosLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : conversations.length === 0 ? (
                  <div className="bg-card rounded-xl shadow-card p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nemate poruka</p>
                  </div>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvo(c)}
                      className={`w-full text-left bg-card rounded-xl shadow-card p-4 transition-brand hover:shadow-md ${
                        selectedConvo?.id === c.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display font-semibold text-sm text-foreground">{c.property_title}</p>
                          {c.selected_dates && (
                            <p className="text-xs text-accent-foreground bg-accent/15 inline-block px-1.5 py-0.5 rounded font-tabular mt-1">
                              📅 {c.selected_dates}
                            </p>
                          )}
                        </div>
                        {(c.unread_count || 0) > 0 && (
                          <span className="w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      {c.last_message && (
                        <p className="text-xs text-muted-foreground mt-2 truncate">{c.last_message}</p>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="lg:col-span-2">
                {selectedConvo ? (
                  <div className="bg-card rounded-xl shadow-card overflow-hidden h-[500px] flex flex-col">
                    <ChatWindow
                      conversationId={selectedConvo.id}
                      otherPartyName={selectedConvo.property_title || ""}
                      selectedDates={selectedConvo.selected_dates}
                    />
                  </div>
                ) : (
                  <div className="bg-card rounded-xl shadow-card p-8 text-center h-[500px] flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Odaberite konverzaciju</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-4 max-w-2xl">
              {bookingsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : bookings.length === 0 ? (
                <div className="bg-card rounded-xl shadow-card p-8 text-center">
                  <Building className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Nemate rezervacija</p>
                </div>
              ) : (
                bookings.map((b: any) => (
                  <div key={b.id} className="bg-card rounded-xl shadow-card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{b.property?.title || "Nekretnina"}</h3>
                        <p className="text-xs text-muted-foreground">{b.property?.city}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        b.status === "confirmed" ? "bg-green-100 text-green-800" :
                        b.status === "pending" ? "bg-accent/20 text-accent-foreground" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {b.status === "confirmed" ? "Potvrđeno" : b.status === "pending" ? "Na čekanju" : "Odbijeno"}
                      </span>
                    </div>
                    <p className="text-sm font-tabular text-muted-foreground mt-2">
                      {b.start_date} → {b.end_date}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
