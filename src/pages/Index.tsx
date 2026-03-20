import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: properties = [], isLoading } = useProperties();
  const featured = properties.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <HeroSection />

      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Izdvojene nekretnine
            </h2>
            <p className="text-muted-foreground font-body">
              Najtraženiji objekti na našoj platformiyyyyyyyyyyyyyyyyyyyyyyyyyy
            </p>
          </div>
          <Link to="/nekretnine">
            <Button variant="ghost" className="gap-2">
              Sve nekretnine <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nema nekretnina za prikaz.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
