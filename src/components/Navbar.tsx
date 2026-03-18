import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Building, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Početna", icon: Home },
    { to: "/nekretnine", label: "Nekretnine", icon: Building },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">T</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">Tedefy</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-brand ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Prijava
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogIn className="w-4 h-4" />
              Prijava
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
