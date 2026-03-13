// lib/private-gym/config.ts
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_DEFAULT_PRICE_EUR: z.coerce.number().default(25),
  NEXT_PUBLIC_TEST_MODE: z.string().default("true"),
  NEXT_PUBLIC_DEFAULT_TIMEZONE: z.string().default("Europe/Rome"),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_ENV: z.enum(["sandbox", "live"]).default("sandbox"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NUKI_API_BASE_URL: z.string().default("https://api.nuki.io"),
  NUKI_API_TOKEN: z.string().optional(),
  NUKI_SMARTLOCK_ID: z.string().optional(),
  NUKI_ALLOW_MOCK: z.string().default("true"),
  GOOGLE_CALENDAR_ID: z.string().default("primary"),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CALENDAR_ENABLED: z.string().default("false"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_ENABLED: z.string().default("false"),
  EMAIL_TO_DEBUG: z.string().optional(),
});

export const env = schema.parse(process.env);

export const isTestMode = env.NEXT_PUBLIC_TEST_MODE === "true";
export const isEmailEnabled = env.EMAIL_ENABLED === "true";
export const isGoogleCalendarEnabled = env.GOOGLE_CALENDAR_ENABLED === "true";
export const isNukiMockAllowed = env.NUKI_ALLOW_MOCK === "true";
