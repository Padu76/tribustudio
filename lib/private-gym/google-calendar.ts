// lib/private-gym/google-calendar.ts
import { google } from "googleapis";
import { env, isGoogleCalendarEnabled } from "./config";

export async function createCalendarEvent(input: {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startsAt: string;
  endsAt: string;
}) {
  if (!isGoogleCalendarEnabled || !env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return { provider: "disabled", eventId: null };
  }

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const descriptionLines = [
    `Email: ${input.customerEmail}`,
    input.customerPhone ? `Tel: ${input.customerPhone}` : "",
    `Booking ID: ${input.bookingId}`,
  ].filter(Boolean);

  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.insert({
    calendarId: env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: `PRIVATE GYM · ${input.customerName}`,
      description: descriptionLines.join("\n"),
      start: { dateTime: input.startsAt, timeZone: env.NEXT_PUBLIC_DEFAULT_TIMEZONE },
      end: { dateTime: input.endsAt, timeZone: env.NEXT_PUBLIC_DEFAULT_TIMEZONE },
      colorId: "5",
    },
  });

  return {
    provider: "google-calendar",
    eventId: response.data.id ?? null,
  };
}
