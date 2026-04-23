// app/api/private-gym/admin/slot-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/private-gym/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function isAuthorized(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_ACCESS_KEY;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    let query = supabase
      .from("tribu_slot_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: data ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
