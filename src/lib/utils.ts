import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface dateFormat {
  date: Date;
  timeZone: string;
  formatOptions: Object;
}

export function formatDateInTimeZone({
  date,
  timeZone,
  formatOptions,
}: dateFormat) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    ...formatOptions,
  });
  return formatter.format(date);
}
