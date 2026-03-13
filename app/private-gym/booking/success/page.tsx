// app/private-gym/booking/success/page.tsx
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  // Messaggio WhatsApp pre-compilato
  const whatsappMsg = encodeURIComponent(
    `Ciao! Ho appena prenotato una sessione alla Tribù Private Gym.${bookingId ? `\nID prenotazione: ${bookingId}` : ""}\nVorrei conferma dei dettagli. Grazie!`
  );
  const whatsappUrl = `https://wa.me/393478881515?text=${whatsappMsg}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 text-center text-white">
      <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">Prenotazione confermata!</h1>

        <p className="mx-auto mt-4 max-w-sm text-white/70">
          La tua sessione è stata prenotata con successo. Conferma la prenotazione su WhatsApp per ricevere tutti i dettagli.
        </p>

        {bookingId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <div className="text-xs text-white/50 uppercase tracking-wider">ID Prenotazione</div>
            <div className="mt-1 font-mono text-sm text-orange-400">{bookingId}</div>
          </div>
        )}

        {/* Pulsante WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Conferma su WhatsApp
        </a>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
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
