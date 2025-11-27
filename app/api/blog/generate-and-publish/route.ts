// app/api/blog/generate-and-publish/route.ts
// STUB TEMPORANEO PER SBLOCCARE LA BUILD

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    message: 'Stub temporaneo: la route blog/generate-and-publish è attiva ma non genera ancora articoli.',
  });
}
