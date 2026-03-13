// app/private-gym/booking/success/page.tsx
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 text-center text-white">
      <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">Prenotazione confermata!</h1>

        <p className="mx-auto mt-4 max-w-sm text-white/70">
          La tua sessione è stata prenotata con successo. Riceverai una email di conferma con i dettagli
          e l&apos;accesso smart allo studio.
        </p>

        {bookingId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <div className="text-xs text-white/50 uppercase tracking-wider">ID Prenotazione</div>
            <div className="mt-1 font-mono text-sm text-orange-400">{bookingId}</div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/private-gym"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Torna alla Private Gym
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Tribù Studio
          </Link>
        </div>
      </div>
    </main>
  );
}
