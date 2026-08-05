import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { formatDate } from "#/lib/format-date";
import { useAppStore } from "@lavaz/store";
import { store } from "#/store/store";
import { useEffect, useState } from "react";

export function DatePicker() {
  const [isMounted, setIsMounted] = useState(false);
  const [date, { setDate }] = useAppStore(store.date, (s) => s.date);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !date) {
    return (
      <Button
        variant="outline"
        className="justify-start text-left font-normal text-muted-foreground"
      >
        <CalendarIcon />
        <span className="max-md:hidden">Chọn ngày</span>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          <span className="max-md:hidden">{formatDate(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar required mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
