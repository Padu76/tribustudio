// lib/private-gym/slots.ts
import { addDays, set } from "date-fns";
import { env } from "./config";
import { getSupabaseAdmin } from "./supabase-admin";
import type { SlotRecord } from "./types";
import { buildAccessFrom, buildEndTraining } from "./utils";

type RawSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: "available" | "booked" | "blocked";
  price_eur: number;
  capacity: number;
};

function mapSlot(slot: RawSlot): SlotRecord {
  return {
    ...slot,
    access_from_local: buildAccessFrom(slot.starts_at),
    end_training_local: buildEndTraining(slot.ends_at),
  };
}

function buildSeedSlots(): SlotRecord[] {
  const base = addDays(new Date(), 1);
  const slotAStart = set(base, { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 });
  const slotAEnd = set(base, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 });
  const slotBStart = set(base, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
  const slotBEnd = set(base, { hours: 19, minutes: 0, seconds: 0, milliseconds: 0 });

  const fallback = [
    {
      id: "seed-slot-1",
      starts_at: slotAStart.toISOString(),
      ends_at: slotAEnd.toISOString(),
      status: "available" as const,
      price_eur: Number(env.NEXT_PUBLIC_DEFAULT_PRICE_EUR),
      capacity: 1,
    },
    {
      id: "seed-slot-2",
      starts_at: slotBStart.toISOString(),
      ends_at: slotBEnd.toISOString(),
      status: "available" as const,
      price_eur: Number(env.NEXT_PUBLIC_DEFAULT_PRICE_EUR),
      capacity: 1,
    },
  ];

  return fallback.map(mapSlot);
}

export async function getSlotsForPublicPage(): Promise<SlotRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return buildSeedSlots();

  const { data, error } = await supabase
    .from("tribu_private_gym_slots")
    .select("id, starts_at, ends_at, status, price_eur, capacity")
    .gte("starts_at", new Date().toISOString())
    .eq("status", "available")
    .order("starts_at", { ascending: true })
    .limit(12);

  if (error || !data?.length) return buildSeedSlots();
  return (data as RawSlot[]).map(mapSlot);
}

export async function getSlotsForAdmin(): Promise<SlotRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return buildSeedSlots();

  const { data, error } = await supabase
    .from("tribu_private_gym_slots")
    .select("id, starts_at, ends_at, status, price_eur, capacity")
    .order("starts_at", { ascending: true })
    .limit(50);

  if (error || !data?.length) return buildSeedSlots();
  return (data as RawSlot[]).map(mapSlot);
}
