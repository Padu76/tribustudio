// app/api/private-gym/availability/route.ts
import { NextResponse } from "next/server";
import { getSlotsForPublicPage } from "@/lib/private-gym/slots";

export async function GET() {
  const slots = await getSlotsForPublicPage();
  return NextResponse.json({ slots });
}
