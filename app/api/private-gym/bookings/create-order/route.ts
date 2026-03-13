// app/api/private-gym/bookings/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPendingBooking, reserveOrValidateSlot } from "@/lib/private-gym/bookings";
import { createPayPalOrder } from "@/lib/private-gym/paypal";

const schema = z.object({
  slotId: z.string().min(1),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    notes: z.string().optional().default(""),
    acceptedRules: z.boolean().refine((value) => value === true, "Devi accettare il regolamento."),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const slot = await reserveOrValidateSlot(body.slotId);
    const customId = `tribu-${body.slotId}-${Date.now()}`;
    const order = await createPayPalOrder(slot.price_eur, customId);
    await createPendingBooking({
      slotId: body.slotId,
      customer: body.customer,
      paypalOrderId: order.id ?? null,
    });
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("[create-order] Error:", error);
    const message = error instanceof Error ? error.message : "Errore imprevisto nella creazione ordine.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
