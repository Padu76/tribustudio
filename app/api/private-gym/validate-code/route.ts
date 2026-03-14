// app/api/private-gym/validate-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateDiscountCode } from "@/lib/private-gym/discount";

export async function POST(request: NextRequest) {
  try {
    const { code, slotPrice } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({
        valid: false,
        finalPrice: slotPrice || 25,
        discount: 0,
        message: "",
      });
    }

    const result = validateDiscountCode(code, slotPrice || 25);

    return NextResponse.json({
      valid: result.valid,
      finalPrice: result.finalPrice,
      discount: result.discount,
      isTribuMember: result.isTribuMember,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      { valid: false, finalPrice: 25, discount: 0, message: "Errore validazione." },
      { status: 400 }
    );
  }
}
