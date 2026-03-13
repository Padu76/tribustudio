// app/api/private-gym/bookings/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { confirmBookingAfterPayment } from "@/lib/private-gym/bookings";
import { capturePayPalOrder } from "@/lib/private-gym/paypal";

const schema = z.object({
  orderId: z.string().min(1),
  slotId: z.string().min(1),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    notes: z.string().optional().default(""),
    acceptedRules: z.boolean().refine((value) => value === true),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const capture = await capturePayPalOrder(body.orderId);

    const purchaseUnit = Array.isArray(capture.purchase_units) ? capture.purchase_units[0] : null;
    const captureId = purchaseUnit?.payments?.captures?.[0]?.id ?? null;
    const result = await confirmBookingAfterPayment({
      slotId: body.slotId,
      customer: body.customer,
      paypalOrderId: body.orderId,
      paypalCaptureId: captureId,
      paypalPayload: capture,
    });

    return NextResponse.json({ ok: true, bookingId: result.bookingId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore imprevisto nel capture.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
