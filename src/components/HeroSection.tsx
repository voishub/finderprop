import { Link } from "react-router-dom";
import { ArrowRight, Building, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Luksuzna nekretnina" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in">Find your perfect stay & Bookinggggggggg

          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-primary-foreground leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>Odmor znači slobodu, Sloboda nema cijenu!

          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-body leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
            Precizni podaci o nekretninama. Jednostavno bukiranje. Transparentna dostupnost.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link to="/nekretnine">
              <Button variant="hero" size="lg" className="gap-2 rounded-xl">
                Pregledaj nekretnine
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                Registruj se
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            {[
            { icon: Search, label: "Precizna pretraga", desc: "Po gradu, tipu i ključnim riječima" },
            { icon: Calendar, label: "Real-time dostupnost", desc: "Kalendar sa slobodnim terminima" },
            { icon: Building, label: "Detaljni podaci", desc: "m², kreveti, udaljenost od aerodroma" }].
            map((f, i) =>
            <div
              key={f.label}
              className="flex items-start gap-3 bg-card/10 backdrop-blur-md rounded-xl px-4 py-3 border border-primary-foreground/10 animate-fade-in"
              style={{ animationDelay: `${400 + i * 100}ms` }}>
              
                <f.icon className="w-5 h-5 text-accent mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-primary-foreground font-medium text-sm">{f.label}</p>
                  <p className="text-primary-foreground/60 text-xs">{f.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;