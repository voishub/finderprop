import { useState, useRef } from "react";
import { Plus, Save, Trash2, MessageSquare, Building, ImagePlus, X, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { propertyTypes, cities } from "@/lib/mockData";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyTitle: string;
  date: string;
  read: boolean;
  dates?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    name: "Marko Petrović",
    email: "marko@email.com",
    phone: "+382 67 123 456",
    message: "Da li je apartman dostupan u junu? Dolazimo sa djecom.",
    propertyTitle: "Luksuzni apartman uz more",
    date: "2026-03-15",
    read: false,
    dates: "2026-06-10 → 2026-06-17",
  },
  {
    id: "2",
    name: "Ana Kovač",
    email: "ana@email.com",
    phone: "+382 69 987 654",
    message: "Koji je najraniji check-in? Stižemo avionom u 10h.",
    propertyTitle: "Vila sa bazenom",
    date: "2026-03-14",
    read: true,
  },
];

const MAX_IMAGES = 10;

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"properties" | "inbox">("properties");
  const [messages] = useState<Message[]>(mockMessages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New property form state
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const newFiles = Array.from(files).slice(0, remaining);
    if (newFiles.length === 0) {
      toast.error(`Maksimalno ${MAX_IMAGES} slika.`);
      return;
    }
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

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !type) {
      toast.error("Popunite obavezna polja (naslov, grad, tip).");
      return;
    }
    toast.success("Nekretnina dodana! (Backend će biti povezan sa Lovable Cloud)");
    setTitle(""); setCity(""); setType(""); setSizeM2(""); setAirportDist("");
    setBeds(""); setBedType(""); setMaxGuests(""); setPricePerNight(""); setDescription("");
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]); setImagePreviews([]);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand";

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

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-secondary rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-brand ${
                activeTab === "properties" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building className="w-4 h-4" />
              Nekretnine
            </button>
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-brand relative ${
                activeTab === "inbox" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Sanduče
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
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
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Opis</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Opišite nekretninu..." maxLength={2000} />
                </div>

                {/* Image upload */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Slike ({images.length}/{MAX_IMAGES})
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                        <img src={src} alt={`Slika ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-foreground/70 text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-brand"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-brand"
                      >
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageAdd}
                    className="hidden"
                  />
                </div>

                <Button variant="accent" type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  Objavi nekretninu
                </Button>
              </form>
            </div>
          )}

          {activeTab === "inbox" && (
            <div className="space-y-4 max-w-2xl">
              {messages.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-card p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nema poruka</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-card rounded-xl shadow-card p-5 border-l-4 transition-brand ${
                      msg.read ? "border-border" : "border-accent"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-sm">{msg.name}</h3>
                        <p className="text-xs text-muted-foreground">{msg.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {msg.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-tabular">{msg.date}</p>
                        <p className="text-xs text-primary">{msg.propertyTitle}</p>
                      </div>
                    </div>
                    {msg.dates && (
                      <p className="text-xs text-accent-foreground bg-accent/15 inline-block px-2 py-0.5 rounded font-tabular mb-2">
                        📅 {msg.dates}
                      </p>
                    )}
                    <p className="text-sm text-foreground font-body">{msg.message}</p>
                    {!msg.read && (
                      <span className="inline-block mt-2 bg-accent/20 text-accent-foreground text-xs px-2 py-0.5 rounded font-medium">
                        Novo
                      </span>
                    )}
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

export default Admin;
