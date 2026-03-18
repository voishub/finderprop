export interface Property {
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
  images: string[];
  amenities: string[];
  bookedDates: string[];
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Luksuzni apartman uz more",
    city: "Dubrovnik",
    type: "Apartman",
    size_m2: 72.5,
    airport_distance_km: 22,
    beds: 2,
    bed_type: "Bračni krevet",
    max_guests: 4,
    price_per_night: 120,
    description: "Prostrani apartman sa pogledom na Jadransko more. Potpuno opremljen sa modernom kuhinjom, klimatizacijom i privatnim parkingom. Idealno za parove i manje porodice.",
    images: [],
    amenities: ["WiFi", "Klima", "Parking", "Balkon", "Kuhinja", "TV"],
    bookedDates: ["2026-03-20", "2026-03-21", "2026-03-22", "2026-04-05", "2026-04-06"],
  },
  {
    id: "2",
    title: "Studio u centru grada",
    city: "Zagreb",
    type: "Studio",
    size_m2: 35.0,
    airport_distance_km: 15,
    beds: 1,
    bed_type: "Krevet za jednu osobu",
    max_guests: 2,
    price_per_night: 65,
    description: "Kompaktan studio u samom srcu Zagreba. Savršen za poslovne putnike ili solo avanturiste koji žele istražiti grad.",
    images: [],
    amenities: ["WiFi", "Klima", "TV", "Perilica rublja"],
    bookedDates: ["2026-03-25", "2026-03-26", "2026-03-27"],
  },
  {
    id: "3",
    title: "Vila sa bazenom",
    city: "Split",
    type: "Vila",
    size_m2: 180.0,
    airport_distance_km: 8,
    beds: 4,
    bed_type: "Bračni krevet",
    max_guests: 8,
    price_per_night: 280,
    description: "Prekrasna vila sa privatnim bazenom i vrtom. Blizina aerodroma i plaže čini ovu nekretninu idealnom za porodične odmore.",
    images: [],
    amenities: ["WiFi", "Klima", "Parking", "Bazen", "Vrt", "Roštilj", "Kuhinja", "TV"],
    bookedDates: ["2026-04-10", "2026-04-11", "2026-04-12", "2026-04-13"],
  },
  {
    id: "4",
    title: "Penthouse sa panoramskim pogledom",
    city: "Sarajevo",
    type: "Apartman",
    size_m2: 95.0,
    airport_distance_km: 12,
    beds: 3,
    bed_type: "Bračni krevet",
    max_guests: 6,
    price_per_night: 150,
    description: "Luksuzni penthouse na vrhu zgrade sa panoramskim pogledom na grad. Moderno opremljen sa svim sadržajima za ugodan boravak.",
    images: [],
    amenities: ["WiFi", "Klima", "Parking", "Terasa", "Kuhinja", "TV", "Perilica rublja"],
    bookedDates: [],
  },
  {
    id: "5",
    title: "Kuća na selu",
    city: "Mostar",
    type: "Kuća",
    size_m2: 120.0,
    airport_distance_km: 35,
    beds: 3,
    bed_type: "Mješovito",
    max_guests: 6,
    price_per_night: 90,
    description: "Autentična kamena kuća u mirnom seoskom okruženju. Idealno za one koji traže bijeg od gradske buke i uživanje u prirodi.",
    images: [],
    amenities: ["WiFi", "Parking", "Vrt", "Roštilj", "Kuhinja"],
    bookedDates: ["2026-03-28", "2026-03-29"],
  },
  {
    id: "6",
    title: "Moderni loft",
    city: "Dubrovnik",
    type: "Studio",
    size_m2: 48.0,
    airport_distance_km: 20,
    beds: 1,
    bed_type: "Bračni krevet",
    max_guests: 2,
    price_per_night: 95,
    description: "Stilski uređen loft u industrijskom stilu. Visoki stropovi i otvoreni prostor stvaraju osjećaj slobode.",
    images: [],
    amenities: ["WiFi", "Klima", "TV", "Kuhinja"],
    bookedDates: [],
  },
];

export const propertyTypes = ["Apartman", "Studio", "Vila", "Kuća"];
export const cities = ["Dubrovnik", "Zagreb", "Split", "Sarajevo", "Mostar"];
