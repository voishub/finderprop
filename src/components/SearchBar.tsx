import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { propertyTypes, cities } from "@/lib/mockData";

interface SearchBarProps {
  keyword: string;
  type: string;
  city: string;
  onKeywordChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onSearch: () => void;
}

const SearchBar = ({
  keyword, type, city,
  onKeywordChange, onTypeChange, onCityChange, onSearch,
}: SearchBarProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 bg-card shadow-card rounded-2xl overflow-hidden">
      <input
        type="text"
        placeholder="Ključna riječ..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        className="px-5 py-4 bg-transparent border-b md:border-b-0 md:border-r border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-body"
      />
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-5 py-4 bg-transparent border-b md:border-b-0 md:border-r border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-body text-foreground"
      >
        <option value="">Vrsta apartmana</option>
        {propertyTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        className="px-5 py-4 bg-transparent border-b md:border-b-0 md:border-r border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-body text-foreground"
      >
        <option value="">Svi gradovi</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <Button
        variant="accent"
        onClick={onSearch}
        className="m-2 rounded-xl gap-2"
      >
        <Search className="w-4 h-4" />
        Pretraži
      </Button>
    </div>
  );
};

export default SearchBar;
