import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "register" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Unesite email adresu.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        if (!firstName.trim() || !lastName.trim()) {
          toast.error("Unesite ime i prezime.");
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          toast.error("Unesite broj telefona.");
          setLoading(false);
          return;
        }
        if (!password || password.length < 6) {
          toast.error("Lozinka mora imati najmanje 6 karaktera.");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`,
              phone: phone.trim(),
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Registracija uspješna! Provjerite email za potvrdu.");
      } else if (mode === "login") {
        if (!password) {
          toast.error("Unesite lozinku.");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Uspješna prijava!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Link za resetovanje lozinke je poslan na vaš email.");
      }
    } catch (error: any) {
      const msg = error?.message || "Došlo je do greške.";
      if (msg.includes("Invalid login")) {
        toast.error("Pogrešan email ili lozinka.");
      } else if (msg.includes("already registered")) {
        toast.error("Korisnik sa ovim emailom već postoji.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<AuthMode, string> = {
    login: "Prijava",
    register: "Registracija",
    reset: "Resetuj lozinku",
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-brand";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-20 flex items-center justify-center px-4">
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
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Ime"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Prezime"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="Broj telefona"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email adresa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                )}

                <Button variant="accent" type="submit" className="w-full gap-2 rounded-xl" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" && "Prijavi se"}
                      {mode === "register" && "Registruj se"}
                      {mode === "reset" && "Pošalji link za reset"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
      <Footer />
    </div>
  );
};

export default Auth;
