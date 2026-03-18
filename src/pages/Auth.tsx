import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

type AuthMode = "login" | "register" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      toast.info("Prijava još nije povezana sa backendom.");
    } else if (mode === "register") {
      toast.info("Registracija još nije povezana sa backendom.");
    } else {
      toast.info("Link za resetovanje lozinke će biti poslan kada se poveže backend.");
    }
  };

  const titles: Record<AuthMode, string> = {
    login: "Prijava",
    register: "Registracija",
    reset: "Resetuj lozinku",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-bold text-primary-foreground text-lg">T</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="font-display font-bold text-2xl text-foreground"
              >
                {titles[mode]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-8 space-y-4">
                {mode === "register" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ime i prezime"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email adresa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
                  />
                </div>

                {mode !== "reset" && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="Lozinka"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand"
                    />
                  </div>
                )}

                <Button variant="accent" type="submit" className="w-full gap-2 rounded-xl">
                  {mode === "login" && "Prijavi se"}
                  {mode === "register" && "Registruj se"}
                  {mode === "reset" && "Pošalji link za reset"}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="text-center space-y-2 pt-2">
                  {mode === "login" && (
                    <>
                      <button type="button" onClick={() => setMode("reset")} className="text-sm text-primary hover:underline block mx-auto">
                        Zaboravili ste lozinku?
                      </button>
                      <p className="text-sm text-muted-foreground">
                        Nemate račun?{" "}
                        <button type="button" onClick={() => setMode("register")} className="text-primary hover:underline font-medium">
                          Registrujte se
                        </button>
                      </p>
                    </>
                  )}
                  {mode === "register" && (
                    <p className="text-sm text-muted-foreground">
                      Već imate račun?{" "}
                      <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                        Prijavite se
                      </button>
                    </p>
                  )}
                  {mode === "reset" && (
                    <button type="button" onClick={() => setMode("login")} className="text-sm text-primary hover:underline">
                      Nazad na prijavu
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
