import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Maximize2, BedDouble, Plane, Users, Wifi, Car, Waves, Tv, Wind, UtensilsCrossed, Shirt, Fence } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/lib/mockData";
import { toast } from "sonner";

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi, Parking: Car, Bazen: Waves, TV: Tv, Klima: Wind,
  Kuhinja: UtensilsCrossed, "Perilica rublja": Shirt, Vrt: Fence,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Nekretnina nije pronađena</h1>
          <Link to="/nekretnine">
            <Button variant="outline">Nazad na nekretnine</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        {/* Hero image */}
        <div className="relative h-[50vh] bg-secondary overflow-hidden">
          {property.images[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <BedDouble className="w-24 h-24 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
          <div className="absolute bottom-6 left-6 z-10">
            <span className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xl font-bold font-tabular">
              €{property.price_per_night}/noć
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Link to="/nekretnine" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-brand">
            <ArrowLeft className="w-4 h-4" />
            Nazad na nekretnine
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="font-display font-bold text-3xl text-foreground mb-2">{property.title}</h1>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {property.city}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Maximize2, label: "Površina", value: `${property.size_m2} m²` },
                  { icon: BedDouble, label: "Kreveti", value: `${property.beds} (${property.bed_type})` },
                  { icon: Users, label: "Maks. gostiju", value: String(property.max_guests) },
                  { icon: Plane, label: "Aerodrom", value: `${property.airport_distance_km} km` },
                ].map((spec) => (
                  <div key={spec.label} className="bg-card rounded-xl p-4 shadow-card text-center">
                    <spec.icon className="w-5 h-5 text-primary mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-xs text-muted-foreground mb-1">{spec.label}</p>
                    <p className="font-display font-semibold text-sm text-foreground font-tabular">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-display font-semibold text-xl text-foreground mb-3">Opis</h2>
                <p className="text-muted-foreground font-body leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-xl text-foreground mb-3">Sadržaji</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => {
                    const Icon = amenityIcons[a];
                    return (
                      <span key={a} className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg text-sm text-foreground">
                        {Icon && <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />}
                        {a}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-lg text-foreground mb-3">Dostupnost</h2>
                <BookingCalendar bookedDates={property.bookedDates} propertyTitle={property.title} />
              </div>
              <ContactForm propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
