// app/buono-regalo/[templateId]/PurchaseForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Gift, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Props {
  templateId: string;
  templateName: string;
  amount: number;
}

export default function PurchaseForm({ templateId, templateName, amount }: Props) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError('Devi accettare l\'informativa privacy per procedere.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_GIFTLY_API_URL;
    if (!apiUrl) {
      setError('Configurazione non disponibile. Riprova più tardi.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/vouchers/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          amount,
          buyerEmail,
          buyerName,
          buyerPhone: buyerPhone || undefined,
          recipientEmail: isGift ? recipientEmail || undefined : undefined,
          recipientName: isGift ? recipientName || undefined : undefined,
          giftMessage: isGift ? giftMessage || undefined : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.error || 'Errore durante la creazione del buono.');
        setLoading(false);
        return;
      }

      window.location.href = `/buono-regalo/success?code=${data.code}`;
    } catch {
      setError('Impossibile contattare il servizio. Riprova tra qualche istante.');
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-montserrat text-xl md:text-2xl font-bold text-dark">
            Acquista il buono
          </h2>
          <p className="text-sm text-gray-500">{templateName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* DATI ACQUIRENTE */}
        <div>
          <h3 className="font-montserrat text-sm font-bold text-dark uppercase tracking-wider mb-3">
            I tuoi dati
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="buyerName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nome e cognome <span className="text-primary">*</span>
              </label>
              <input
                id="buyerName"
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="Mario Rossi"
              />
            </div>
            <div>
              <label htmlFor="buyerEmail" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email <span className="text-primary">*</span>
              </label>
              <input
                id="buyerEmail"
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="mario.rossi@email.it"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ti invieremo qui il codice del buono e le istruzioni di pagamento.
              </p>
            </div>
            <div>
              <label htmlFor="buyerPhone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Telefono <span className="text-gray-400 font-normal">(opzionale)</span>
              </label>
              <input
                id="buyerPhone"
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                placeholder="+39 347 888 1515"
              />
            </div>
          </div>
        </div>

        {/* CHECKBOX REGALO */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
            />
            <div>
              <span className="font-semibold text-dark group-hover:text-primary transition-colors">
                È un regalo per qualcuno
              </span>
              <p className="text-sm text-gray-500">
                Personalizza il messaggio per il destinatario.
              </p>
            </div>
          </label>
        </div>

        {/* DATI DESTINATARIO */}
        {isGift && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 space-y-4">
            <h3 className="font-montserrat text-sm font-bold text-dark uppercase tracking-wider">
              Dati destinatario
            </h3>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nome destinatario
              </label>
              <input
                id="recipientName"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
                placeholder="Giulia Bianchi"
              />
            </div>
            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email destinatario
              </label>
              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white"
                placeholder="giulia.bianchi@email.it"
              />
            </div>
            <div>
              <label htmlFor="giftMessage" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Messaggio personalizzato
              </label>
              <textarea
                id="giftMessage"
                rows={3}
                maxLength={500}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white resize-none"
                placeholder="Un pensiero per te, per iniziare a prenderti cura del tuo corpo..."
              />
              <p className="mt-1 text-xs text-gray-500">
                {giftMessage.length}/500 caratteri
              </p>
            </div>
          </div>
        )}

        {/* INFO PAGAMENTO OFFLINE */}
        <div className="bg-gray-light border border-gray-200 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-dark mb-1">
              Pagamento offline in studio o bonifico
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dopo aver confermato, riceverai via email il codice del buono e
              le istruzioni di pagamento (IBAN o pagamento in studio). Il
              buono si attiva appena registriamo il pagamento.
            </p>
          </div>
        </div>

        {/* PRIVACY */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            Ho letto e accetto l&apos;
            <a href="/privacy-policy" target="_blank" className="text-primary font-semibold hover:underline">
              informativa privacy
            </a>
            . <span className="text-primary">*</span>
          </span>
        </label>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold px-6 py-4 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creazione buono...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Conferma richiesta buono
            </>
          )}
        </button>
      </form>
    </div>
  );
}
