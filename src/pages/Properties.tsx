import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/lib/mockData";

const Properties = () => {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(() => {
    return mockProperties.filter((p) => {
      const matchKeyword = !keyword || 
        p.title.toLowerCase().includes(keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(keyword.toLowerCase());
      const matchType = !type || p.type === type;
      const matchCity = !city || p.city === city;
      return matchKeyword && matchType && matchCity;
    });
  }, [keyword, type, city]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Nekretnine</h1>
            <p className="text-muted-foreground font-body">
              Pretražite i pronađite savršen smještaj
            </p>
          </div>

          <div className="mb-10">
            <SearchBar
              keyword={keyword} type={type} city={city}
              onKeywordChange={setKeyword} onTypeChange={setType} onCityChange={setCity}
              onSearch={() => {}}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nema rezultata za vašu pretragu.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6 font-tabular">
                {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultata"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
