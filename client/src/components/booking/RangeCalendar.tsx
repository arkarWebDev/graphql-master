"use client";

import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRightLeft, CalendarDays, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/helpers";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dates?: DateRange | undefined;
  disabledDates?: string[];
  onDateChange: (date: DateRange | undefined) => void;
}

export function RangeCalendar({ dates, disabledDates, onDateChange }: Props) {
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const isControlled = dates !== undefined;

  // handle internal state
  const [internalDate, setInternalDate] = useState<DateRange | undefined>(
    () => {
      if (dates) return dates;

      if (startDate || endDate) {
        return {
          from: startDate ? new Date(startDate) : undefined,
          to: endDate ? new Date(endDate) : undefined,
        };
      }

      return undefined;
    }
  );

  useEffect(() => {
    if (isControlled) {
      setInternalDate(dates);
    }
  }, [dates, isControlled]);

  const currentDate = isControlled ? dates : internalDate;

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!isControlled) {
      setInternalDate(newDate);
    }

    onDateChange(newDate);
  };

  const parsedDisabledDates = [];

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2 border p-2 rounded-md text-sm justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays />
            <span className="flex items-center gap-2">
              {currentDate?.from ? (
                currentDate.to ? (
                  <>
                    {formatDate(currentDate.from)}{" "}
                    <ArrowRightLeft className="w-4 h-4" />
                    {formatDate(currentDate.to)}
                  </>
                ) : (
                  <>{formatDate(currentDate.from)}</>
                )
              ) : (
                <span>Select booking dates</span>
              )}
            </span>
          </div>

          <ChevronDown className="w-4 h-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={currentDate?.from}
          selected={currentDate}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
