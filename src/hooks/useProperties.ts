import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProperty {
  id: string;
  title: string;
  city: string;
  type: string;
  size_m2: number;
  airport_distance_km: number;
  beds: number;
  bed_type: string;
  max_guests: number;
  price_per_night: number;
  description: string;
  amenities: string[];
  created_at: string;
  images: string[];
  blockedDates: string[];
}

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async (): Promise<DbProperty[]> => {
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: images } = await supabase
        .from("property_images")
        .select("*")
        .order("position");

      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("*");

      return (properties || []).map((p: any) => ({
        ...p,
        size_m2: Number(p.size_m2),
        airport_distance_km: Number(p.airport_distance_km),
        price_per_night: Number(p.price_per_night),
        images: (images || [])
          .filter((img: any) => img.property_id === p.id)
          .map((img: any) => img.url),
        blockedDates: (blocked || [])
          .filter((b: any) => b.property_id === p.id)
          .map((b: any) => b.date),
      }));
    },
  });
};

export const useProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ["property", id],
    enabled: !!id,
    queryFn: async (): Promise<DbProperty | null> => {
      if (!id) return null;

      const { data: p, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!p) return null;

      const { data: images } = await supabase
        .from("property_images")
        .select("*")
        .eq("property_id", id)
        .order("position");

      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("*")
        .eq("property_id", id);

      return {
        ...p,
        size_m2: Number(p.size_m2),
        airport_distance_km: Number(p.airport_distance_km),
        price_per_night: Number(p.price_per_night),
        images: (images || []).map((img: any) => img.url),
        blockedDates: (blocked || []).map((b: any) => b.date),
      };
    },
  });
};
