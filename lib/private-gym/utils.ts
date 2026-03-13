// lib/private-gym/utils.ts
import { addMinutes, format } from "date-fns";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function euro(value: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
}

export function formatDateTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  return `${format(start, "EEEE d MMMM · HH:mm")} - ${format(end, "HH:mm")}`;
}

export function buildAccessFrom(startsAt: string) {
  return format(addMinutes(new Date(startsAt), -10), "HH:mm");
}

export function buildEndTraining(endsAt: string) {
  return format(addMinutes(new Date(endsAt), -5), "HH:mm");
}

export function envBool(name: string, fallback = false) {
  const value = process.env[name];
  if (!value) return fallback;
  return value === "true" || value === "1";
}
