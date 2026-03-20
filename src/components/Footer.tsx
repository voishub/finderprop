import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">FYS</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Vaš pouzdan partner za pronalaženje idealnog smještaja u Crnoj Gori.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Brzi linkovi</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-brand">
                  Početna
                </Link>
              </li>
              <li>
                <Link to="/nekretnine" className="text-sm text-muted-foreground hover:text-primary transition-brand">
                  Nekretnine
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-brand">
                  Prijava / Registracija
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Crna Gora
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +382 XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                info@tedefy.me
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tedefy. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>);
};

export default Footer;