"use client";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LucideCalendar } from "lucide-react";
import { useImperativeHandle, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
};

const DatePicker = ({ id, name, defaultValue }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date(),
  );

  const [open, setOpen] = useState(false);

  const formattedStringDate = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild id={id} className="w-full">
          <Button
            variant="outline"
            data-empty={!date}
            className="justify-start text-left font-normal text-xs"
          >
            <LucideCalendar />
            {formattedStringDate}
            <input name={name} type="hidden" value={formattedStringDate} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default DatePicker;
