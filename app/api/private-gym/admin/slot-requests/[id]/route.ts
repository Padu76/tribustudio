// app/api/private-gym/admin/slot-requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_ACCESS_KEY;
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

    const { error } = await supabase
      .from("tribu_slot_requests")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    const body = await req.json();

    const allowedStatus = ["pending", "authorized", "rejected", "expired"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json({ error: "Status non valido" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    }

    const updateFields: Record<string, unknown> = {};
    if (body.status) updateFields.status = body.status;
    if (body.notes !== undefined) updateFields.notes = body.notes;

    const { data, error } = await supabase
      .from("tribu_slot_requests")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ request: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
