// app/api/private-gym/admin/slots/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_ACCESS_KEY;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("tribu_private_gym_slots")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ slot: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    }

    // Elimina prima gli accessi collegati ai booking di questo slot
    const { data: bookings } = await supabase
      .from("tribu_private_gym_bookings")
      .select("id")
      .eq("slot_id", id);

    if (bookings && bookings.length > 0) {
      const bookingIds = bookings.map((b: { id: string }) => b.id);

      // Elimina accessi collegati ai booking
      await supabase
        .from("tribu_private_gym_accesses")
        .delete()
        .in("booking_id", bookingIds);

      // Elimina i booking collegati allo slot
      await supabase
        .from("tribu_private_gym_bookings")
        .delete()
        .eq("slot_id", id);
    }

    // Ora elimina lo slot
    const { error } = await supabase.from("tribu_private_gym_slots").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
