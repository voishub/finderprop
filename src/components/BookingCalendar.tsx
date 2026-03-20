import { useState } from "react";
import { ChevronLeft, ChevronRight, Send, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateConversation } from "@/hooks/useConversations";
import { toast } from "sonner";

interface BookingCalendarProps {
  bookedDates: string[];
  propertyTitle: string;
  propertyId: string;
  onDateSelect?: (start: string, end: string) => void;
}

const BookingCalendar = ({ bookedDates, propertyTitle, propertyId, onDateSelect }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const { user } = useAuth();
  const createConversation = useCreateConversation();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const monthNames = ["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"];
  const dayNames = ["Pon","Uto","Sri","Čet","Pet","Sub","Ned"];

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isBooked = (day: number) => bookedDates.includes(formatDate(day));
  const isPast = (day: number) => new Date(year, month, day) < new Date(new Date().toDateString());

  const isSelected = (day: number) => {
    const dateStr = formatDate(day);
    if (!selectedStart) return false;
    if (!selectedEnd) return dateStr === selectedStart;
    return dateStr >= selectedStart && dateStr <= selectedEnd;
  };

  const handleDayClick = (day: number) => {
    if (isBooked(day) || isPast(day)) return;
    const dateStr = formatDate(day);

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateStr);
      setSelectedEnd(null);
    } else {
      if (dateStr < selectedStart) {
        setSelectedStart(dateStr);
      } else {
        const hasBookedInRange = bookedDates.some((d) => d > selectedStart && d <= dateStr);
        if (hasBookedInRange) {
          setSelectedStart(dateStr);
          setSelectedEnd(null);
        } else {
          setSelectedEnd(dateStr);
          onDateSelect?.(selectedStart, dateStr);
        }
      }
    }
  };

  const handleSendInquiry = () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste poslali upit.");
      return;
    }
    if (!selectedStart || !selectedEnd) {
      toast.error("Odaberite period boravka.");
      return;
    }

    const dates = `${selectedStart} → ${selectedEnd}`;
    const message = `Upit za bukiranje: ${propertyTitle}\nPeriod: ${dates}`;

    createConversation.mutate({
      propertyId,
      userId: user.id,
      selectedDates: dates,
      initialMessage: message,
    }, {
      onSuccess: () => {
        toast.success("Upit za bukiranje je uspješno poslan!");
        setSelectedStart(null);
        setSelectedEnd(null);
      },
      onError: () => {
        toast.error("Greška pri slanju upita.");
      },
    });
  };

  const userName = user?.user_metadata?.full_name || "";
  const userEmail = user?.email || "";
  const userPhone = user?.user_metadata?.phone || "";

  return (
    <div className="bg-card rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-display font-semibold text-sm">{monthNames[month]} {year}</h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const booked = isBooked(day);
          const past = isPast(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={booked || past}
              className={`aspect-square flex items-center justify-center text-sm font-tabular relative transition-brand rounded-none border border-transparent ${
                selected ? "bg-accent text-accent-foreground font-semibold"
                : booked ? "bg-secondary/60 text-muted-foreground cursor-not-allowed line-through"
                : past ? "text-muted-foreground/40 cursor-not-allowed"
                : "hover:bg-primary/10 text-foreground cursor-pointer"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedStart && selectedEnd && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-accent/10 rounded-lg text-sm text-foreground">
            <span className="font-medium">Odabrani period:</span>{" "}
            <span className="font-tabular">{selectedStart}</span> → <span className="font-tabular">{selectedEnd}</span>
          </div>

          {user && (
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /><span>{userName}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /><span>{userEmail}</span></div>
              {userPhone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /><span>{userPhone}</span></div>}
            </div>
          )}

          <Button
            variant="accent"
            className="w-full gap-2"
            onClick={handleSendInquiry}
            disabled={createConversation.isPending}
          >
            <Send className="w-4 h-4" />
            {createConversation.isPending ? "Slanje..." : "Pošalji upit za ove datume"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
