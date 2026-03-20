import { useState, useRef } from "react";
import { Plus, Save, Trash2, MessageSquare, Building, ImagePlus, X, Calendar, Lock, Unlock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWindow from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { propertyTypes, cities } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { useConversations, type Conversation } from "@/hooks/useConversations";
import { useQueryClient } from "@tanstack/react-query";

const MAX_IMAGES = 10;

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"properties" | "inbox" | "calendar">("properties");
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Property form
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [sizeM2, setSizeM2] = useState("");
  const [airportDist, setAirportDist] = useState("");
  const [beds, setBeds] = useState("");
  const [bedType, setBedType] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Calendar management
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [blockingDate, setBlockingDate] = useState(false);

  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const { data: conversations = [], isLoading: convosLoading } = useConversations(user?.id, true);

  if (loading) return null;
  if (!isAdmin) {
    navigate("/", { replace: true });
    return null;
  }

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const newFiles = Array.from(files).slice(0, remaining);
    if (newFiles.length === 0) { toast.error(`Maksimalno ${MAX_IMAGES} slika.`); return; }
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, propertyId: string, position: number): Promise<string> => {
    // Convert to base64 data URL since storage isn't available
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !type) {
      toast.error("Popunite obavezna polja (naslov, grad, tip).");
      return;
    }

    setSaving(true);
    try {
      const amenityList = amenities.split(",").map(a => a.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from("properties")
        .insert({
          title,
          city,
          type,
          size_m2: sizeM2 ? parseFloat(sizeM2) : 0,
          airport_distance_km: airportDist ? parseFloat(airportDist) : 0,
          beds: beds ? parseInt(beds) : 1,
          bed_type: bedType,
          max_guests: maxGuests ? parseInt(maxGuests) : 2,
          price_per_night: pricePerNight ? parseFloat(pricePerNight) : 0,
          description,
          amenities: amenityList,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const url = await uploadImage(images[i], data.id, i);
        await supabase.from("property_images").insert({
          property_id: data.id,
          url,
          position: i,
        });
      }

      toast.success("Nekretnina uspješno dodana!");
      setTitle(""); setCity(""); setType(""); setSizeM2(""); setAirportDist("");
      setBeds(""); setBedType(""); setMaxGuests(""); setPricePerNight(""); setDescription("");
      setAmenities("");
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]); setImagePreviews([]);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (err: any) {
      toast.error(err.message || "Greška pri dodavanju nekretnine.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDate = async (dateStr: string, isBlocked: boolean) => {
    if (!selectedProperty) return;
    setBlockingDate(true);
    try {
      if (isBlocked) {
        await supabase.from("blocked_dates").delete()
          .eq("property_id", selectedProperty)
          .eq("date", dateStr);
        toast.success(`Datum ${dateStr} otključan.`);
      } else {
        await supabase.from("blocked_dates").insert({
          property_id: selectedProperty,
          date: dateStr,
        });
        toast.success(`Datum ${dateStr} zaključan.`);
      }
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    } catch {
      toast.error("Greška pri promjeni datuma.");
    } finally {
      setBlockingDate(false);
    }
  };

  const selectedProp = properties.find(p => p.id === selectedProperty);
  const calYear = calendarMonth.getFullYear();
  const calMonth = calendarMonth.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const monthNames = ["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"];
  const dayNames = ["Pon","Uto","Sri","Čet","Pet","Sub","Ned"];

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand";

  const unreadCount = conversations.filter(c => (c.unread_count || 0) > 0).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Upravljajte nekretninama i porukama</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-secondary rounded-xl p-1 w-fit">
            {[
              { key: "properties" as const, label: "Nekretnine", icon: Building },
              { key: "inbox" as const, label: "Sanduče", icon: MessageSquare, badge: unreadCount },
              { key: "calendar" as const, label: "Kalendar", icon: Calendar },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedConvo(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-brand relative ${
                  activeTab === tab.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {activeTab === "properties" && (
            <div className="bg-card rounded-2xl shadow-card p-8 max-w-2xl">
              <h2 className="font-display font-semibold text-xl text-foreground mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Nova nekretnina
              </h2>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Naslov *</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Naziv nekretnine" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Grad *</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
                      <option value="">Odaberite grad</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Tip *</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                      <option value="">Odaberite tip</option>
                      {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Površina (m²)</label>
                    <input type="number" value={sizeM2} onChange={(e) => setSizeM2(e.target.value)} className={`${inputClass} font-tabular`} placeholder="npr. 72.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Udaljenost od aerodroma (km)</label>
                    <input type="number" value={airportDist} onChange={(e) => setAirportDist(e.target.value)} className={`${inputClass} font-tabular`} placeholder="npr. 22" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Broj kreveta</label>
                    <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} className={`${inputClass} font-tabular`} placeholder="npr. 2" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Vrsta kreveta</label>
                    <input value={bedType} onChange={(e) => setBedType(e.target.value)} className={inputClass} placeholder="npr. Bračni krevet" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Maks. gostiju</label>
                    <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} className={`${inputClass} font-tabular`} placeholder="npr. 4" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Cijena po noći (€)</label>
                    <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} className={`${inputClass} font-tabular`} placeholder="npr. 120" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Sadržaji (odvojeni zarezom)</label>
                    <input value={amenities} onChange={(e) => setAmenities(e.target.value)} className={inputClass} placeholder="WiFi, Klima, Parking" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Opis</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Opišite nekretninu..." maxLength={2000} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Slike ({images.length}/{MAX_IMAGES})</label>
                  <div className="grid grid-cols-5 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                        <img src={src} alt={`Slika ${i + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-foreground/70 text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-brand">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-brand">
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
                </div>

                <Button variant="accent" type="submit" className="gap-2" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Čuvanje..." : "Objavi nekretninu"}
                </Button>
              </form>

              {/* Existing properties list */}
              {properties.length > 0 && (
                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Postojeće nekretnine ({properties.length})</h3>
                  <div className="space-y-3">
                    {properties.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.city} · {p.type} · €{p.price_per_night}/noć</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "inbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
              <div className="space-y-2">
                {convosLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : conversations.length === 0 ? (
                  <div className="bg-card rounded-xl shadow-card p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nema poruka</p>
                  </div>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvo(c)}
                      className={`w-full text-left bg-card rounded-xl shadow-card p-4 transition-brand hover:shadow-md ${
                        selectedConvo?.id === c.id ? "ring-2 ring-primary" : ""
                      } ${(c.unread_count || 0) > 0 ? "border-l-4 border-accent" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display font-semibold text-sm text-foreground">{c.user_name}</p>
                          <p className="text-xs text-muted-foreground">{c.user_email}</p>
                          {c.user_phone && <p className="text-xs text-muted-foreground">{c.user_phone}</p>}
                        </div>
                        {(c.unread_count || 0) > 0 && (
                          <span className="w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-primary mt-1">{c.property_title}</p>
                      {c.selected_dates && (
                        <p className="text-xs text-accent-foreground bg-accent/15 inline-block px-1.5 py-0.5 rounded font-tabular mt-1">
                          📅 {c.selected_dates}
                        </p>
                      )}
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
                      otherPartyName={`${selectedConvo.user_name} — ${selectedConvo.property_title}`}
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

          {activeTab === "calendar" && (
            <div className="max-w-lg">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">Upravljanje datumima</h2>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className={`${inputClass} mb-4`}
                >
                  <option value="">Odaberite nekretninu</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} — {p.city}</option>
                  ))}
                </select>

                {selectedProperty && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <button onClick={() => setCalendarMonth(new Date(calYear, calMonth - 1, 1))} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">←</button>
                      <h3 className="font-display font-semibold text-sm">{monthNames[calMonth]} {calYear}</h3>
                      <button onClick={() => setCalendarMonth(new Date(calYear, calMonth + 1, 1))} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">→</button>
                    </div>
                    <div className="grid grid-cols-7 gap-0">
                      {dayNames.map(d => (
                        <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                      ))}
                      {Array.from({ length: startOffset }).map((_, i) => <div key={`e-${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isBlocked = selectedProp?.blockedDates.includes(dateStr) || false;
                        const past = new Date(calYear, calMonth, day) < new Date(new Date().toDateString());

                        return (
                          <button
                            key={day}
                            disabled={past || blockingDate}
                            onClick={() => handleToggleDate(dateStr, isBlocked)}
                            className={`aspect-square flex items-center justify-center text-sm font-tabular relative transition-brand ${
                              isBlocked
                                ? "bg-destructive/20 text-destructive font-semibold"
                                : past
                                  ? "text-muted-foreground/40 cursor-not-allowed"
                                  : "hover:bg-primary/10 text-foreground cursor-pointer"
                            }`}
                          >
                            {day}
                            {isBlocked && <Lock className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-destructive" /> Zaključano</span>
                      <span className="flex items-center gap-1"><Unlock className="w-3 h-3 text-green-600" /> Slobodno</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Kliknite na datum da zaključate/otključate.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
