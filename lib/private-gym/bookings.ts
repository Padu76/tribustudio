// lib/private-gym/bookings.ts
import { format } from "date-fns";
import { createCalendarEvent } from "./google-calendar";
import { createNukiAccess } from "./nuki";
import { getSupabaseAdmin } from "./supabase-admin";
import type { BookingCustomerInput } from "./types";
import { buildAccessFrom, buildEndTraining } from "./utils";
import { sendBookingEmail } from "./email";

export async function reserveOrValidateSlot(slotId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      id: slotId,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      price_eur: 25,
      status: "available",
    };
  }

  const { data, error } = await supabase
    .from("tribu_private_gym_slots")
    .select("id, starts_at, ends_at, status, price_eur")
    .eq("id", slotId)
    .single();

  if (error || !data) {
    throw new Error("Slot non trovato.");
  }

  if (data.status !== "available") {
    throw new Error("Questo slot non è più disponibile.");
  }

  return {
    id: data.id,
    starts_at: data.starts_at,
    ends_at: data.ends_at,
    price_eur: data.price_eur,
    status: data.status,
  };
}

export async function createPendingBooking(input: {
  slotId: string;
  customer: BookingCustomerInput;
  paypalOrderId: string | null;
  finalPrice?: number;
  isTribuMember?: boolean;
  discountCode?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { id: `local-${Date.now()}` };
  }

  const slot = await reserveOrValidateSlot(input.slotId);

  const { data, error } = await supabase
    .from("tribu_private_gym_bookings")
    .insert({
      slot_id: input.slotId,
      full_name: input.customer.fullName,
      email: input.customer.email,
      phone: input.customer.phone,
      notes: input.customer.notes || null,
      accepted_rules_at: input.customer.acceptedRules ? new Date().toISOString() : null,
      booking_status: "pending_payment",
      payment_status: "pending",
      paypal_order_id: input.paypalOrderId,
      price_eur: input.finalPrice ?? slot.price_eur,
      is_tribu_member: input.isTribuMember ?? false,
      discount_code: input.discountCode || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createPendingBooking] Supabase error:", JSON.stringify(error));
    throw new Error(`Errore salvataggio booking: ${error?.message || "nessun dato"}`);
  }
  return data;
}

export async function confirmBookingAfterPayment(input: { slotId: string; customer: BookingCustomerInput; paypalOrderId: string; paypalCaptureId: string | null; paypalPayload?: unknown; }) {
  const supabase = getSupabaseAdmin();
  const slot = await reserveOrValidateSlot(input.slotId);

  let bookingId = `local-${Date.now()}`;

  if (supabase) {
    const pending = await supabase
      .from("tribu_private_gym_bookings")
      .select("id")
      .eq("paypal_order_id", input.paypalOrderId)
      .maybeSingle();

    if (pending.data?.id) {
      bookingId = pending.data.id as string;
      const { error: updateBookingError } = await supabase
        .from("tribu_private_gym_bookings")
        .update({
          payment_status: "paid",
          booking_status: "confirmed",
          paypal_capture_id: input.paypalCaptureId,
          paypal_payload: input.paypalPayload ?? null,
        })
        .eq("id", bookingId);

      if (updateBookingError) {
        throw new Error("Errore aggiornamento booking dopo pagamento.");
      }
    } else {
      const { data, error } = await supabase
        .from("tribu_private_gym_bookings")
        .insert({
          slot_id: input.slotId,
          full_name: input.customer.fullName,
          email: input.customer.email,
          phone: input.customer.phone,
          notes: input.customer.notes || null,
          accepted_rules_at: input.customer.acceptedRules ? new Date().toISOString() : null,
          booking_status: "confirmed",
          payment_status: "paid",
          paypal_order_id: input.paypalOrderId,
          paypal_capture_id: input.paypalCaptureId,
          paypal_payload: input.paypalPayload ?? null,
          price_eur: slot.price_eur,
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error("Errore inserimento booking confermato.");
      }
      bookingId = data.id as string;
    }

    const { error: updateSlotError } = await supabase
      .from("tribu_private_gym_slots")
      .update({ status: "booked" })
      .eq("id", input.slotId);

    if (updateSlotError) throw new Error("Errore aggiornamento slot booked.");
  }

  const nukiAccess = await createNukiAccess({
    bookingId,
    slotStartIso: slot.starts_at,
    slotEndIso: slot.ends_at,
    fullName: input.customer.fullName,
    email: input.customer.email,
  });

  const calendarEvent = await createCalendarEvent({
    bookingId,
    customerName: input.customer.fullName,
    customerEmail: input.customer.email,
    customerPhone: input.customer.phone,
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
  });

  if (supabase) {
    await supabase.from("tribu_private_gym_accesses").insert({
      booking_id: bookingId,
      provider: nukiAccess.provider,
      external_id: nukiAccess.externalId,
      valid_from: slot.starts_at,
      valid_until: slot.ends_at,
      access_payload: nukiAccess.raw ?? null,
    });

    await supabase
      .from("tribu_private_gym_bookings")
      .update({
        nuki_access_external_id: nukiAccess.externalId,
        google_calendar_event_id: calendarEvent.eventId,
      })
      .eq("id", bookingId);
  }

  await sendBookingEmail({
    to: input.customer.email,
    fullName: input.customer.fullName,
    startsAtLabel: format(new Date(slot.starts_at), "EEEE d MMMM · HH:mm") + " - " + format(new Date(slot.ends_at), "HH:mm"),
    accessFromLabel: buildAccessFrom(slot.starts_at),
    endTrainingLabel: buildEndTraining(slot.ends_at),
    bookingId,
    accessInstruction: nukiAccess.accessInstruction,
  });

  return { bookingId };
}
