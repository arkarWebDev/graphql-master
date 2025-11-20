import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

export const updateSearchParams = (
  searchParams: URLSearchParams,
  key: string,
  value: string
) => {
  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }
  return searchParams;
};

export const formatDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(parseInt(date));
  }

  return format(date, "yyyy-MM-dd");
};

export const calculateAmount = (rentPerDay: number, daysOfRent: number) => {
  const rent = rentPerDay * daysOfRent;
  const tax = rent * 0.1;
  const discount = 0;
  const total = rent + tax - discount;

  return {
    tax,
    rent,
    discount,
    total,
  };
};

export const getDaysOfRent = (range?: DateRange | undefined) => {
  if (!range?.from || !range?.to) return 0;

  const from = new Date(range.from);
  const to = new Date(range.to);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  return differenceInDays(to, from);
};
