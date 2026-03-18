import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const featured = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Izdvojene nekretnine
            </h2>
            <p className="text-muted-foreground font-body">
              Najtraženiji objekti na našoj platformi
            </p>
          </div>
          <Link to="/nekretnine">
            <Button variant="ghost" className="gap-2">
              Sve nekretnine <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-xs">T</span>
            </div>
            <span className="font-display font-semibold text-foreground">Tedefy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tedefy. Sva prava zadržana.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
