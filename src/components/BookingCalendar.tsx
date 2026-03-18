import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  bookedDates: string[];
  onDateSelect?: (start: string, end: string) => void;
}

const BookingCalendar = ({ bookedDates, onDateSelect }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const monthNames = [
    "Januar", "Februar", "Mart", "April", "Maj", "Juni",
    "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];

  const dayNames = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
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
        // Check if any booked date is in range
        const hasBookedInRange = bookedDates.some(
          (d) => d > selectedStart && d <= dateStr
        );
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

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-card rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-display font-semibold text-sm">
          {monthNames[month]} {year}
        </h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-secondary transition-brand">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

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
              className={`
                aspect-square flex items-center justify-center text-sm font-tabular relative
                transition-brand rounded-none border border-transparent
                ${selected
                  ? "bg-accent text-accent-foreground font-semibold"
                  : booked
                    ? "bg-secondary/60 text-muted-foreground cursor-not-allowed line-through"
                    : past
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "hover:bg-primary/10 text-foreground cursor-pointer"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedStart && selectedEnd && (
        <div className="mt-4 p-3 bg-accent/10 rounded-lg text-sm text-foreground">
          <span className="font-medium">Odabrani period:</span>{" "}
          <span className="font-tabular">{selectedStart}</span> → <span className="font-tabular">{selectedEnd}</span>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
