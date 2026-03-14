// app/api/private-gym/bookings/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPendingBooking, reserveOrValidateSlot } from "@/lib/private-gym/bookings";
import { createPayPalOrder } from "@/lib/private-gym/paypal";
import { validateDiscountCode } from "@/lib/private-gym/discount";

const schema = z.object({
  slotId: z.string().min(1),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    notes: z.string().optional().default(""),
    acceptedRules: z.boolean().refine((value) => value === true, "Devi accettare il regolamento."),
    discountCode: z.string().optional().default(""),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const slot = await reserveOrValidateSlot(body.slotId);

    // Calcola prezzo finale con eventuale sconto
    let finalPrice = slot.price_eur;
    let isTribuMember = false;

    if (body.customer.discountCode) {
      const discountResult = validateDiscountCode(body.customer.discountCode, slot.price_eur);
      if (discountResult.valid) {
        finalPrice = discountResult.finalPrice;
        isTribuMember = discountResult.isTribuMember;
      }
    }

    const customId = `tribu-${body.slotId}-${Date.now()}`;
    const order = await createPayPalOrder(finalPrice, customId);

    await createPendingBooking({
      slotId: body.slotId,
      customer: body.customer,
      paypalOrderId: order.id ?? null,
      finalPrice,
      isTribuMember,
      discountCode: body.customer.discountCode || null,
    });

    return NextResponse.json({ orderId: order.id, finalPrice, isTribuMember });
  } catch (error) {
    console.error("[create-order] Error:", error);
    const message = error instanceof Error ? error.message : "Errore imprevisto nella creazione ordine.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
