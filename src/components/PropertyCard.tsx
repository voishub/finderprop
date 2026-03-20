import { Link } from "react-router-dom";
import { MapPin, Maximize2, BedDouble, Plane, Users } from "lucide-react";
import type { DbProperty } from "@/hooks/useProperties";

interface PropertyCardProps {
  property: DbProperty;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/nekretnine/${property.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:-translate-y-1 transition-brand"
    >
      <div className="aspect-video bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent z-10" />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-lg text-sm font-bold font-tabular">
            €{property.price_per_night}/noć
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-card/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs font-medium">
            {property.type}
          </span>
        </div>
        {property.images[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BedDouble className="w-12 h-12 text-primary/30" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />{property.city}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
            <Maximize2 className="w-3 h-3" /><span className="font-tabular">{property.size_m2} m²</span>
          </span>
          <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
            <BedDouble className="w-3 h-3" />{property.beds}
          </span>
          <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
            <Users className="w-3 h-3" />{property.max_guests}
          </span>
          <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
            <Plane className="w-3 h-3" /><span className="font-tabular">{property.airport_distance_km}km</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
