// app/buono-regalo/success/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { CheckCircle2, Printer, AlertCircle, Copy, ArrowLeft } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface Voucher {
  id: string;
  code: string;
  amount: number | string;
  expires_at: string | null;
  buyer_name: string | null;
  status: string;
  template: {
    name: string;
    description: string | null;
    image_url: string | null;
  } | null;
  business: {
    name: string;
    slug: string;
    logo_url: string | null;
    primary_color: string | null;
    email: string | null;
    phone: string | null;
    payment_instructions: string | null;
    bank_iban: string | null;
    bank_account_holder: string | null;
  } | null;
}

function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined) return '—';
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(n)) return '—';
  return `€${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Codice buono mancante nell\'URL.');
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_GIFTLY_API_URL;
    if (!apiUrl) {
      setError('Configurazione servizio non disponibile.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${apiUrl}/api/public/voucher/${code}`);
        if (!res.ok) {
          setError('Buono non trovato. Controlla il link ricevuto.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setVoucher(data.voucher);

        const qr = await QRCode.toDataURL(`${apiUrl}/v/${code}`, {
          width: 320,
          margin: 1,
          color: { dark: '#1A1A1A', light: '#FFFFFF' },
        });
        setQrDataUrl(qr);
      } catch {
        setError('Impossibile caricare il buono. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-open-sans">Caricamento del tuo buono...</p>
        </div>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="pt-32 pb-20 min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 md:px-6 max-w-xl text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 mb-8 flex gap-3 text-left">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Buono non disponibile</p>
              <p className="text-sm">{error || 'Impossibile recuperare il buono.'}</p>
            </div>
          </div>
          <Link
            href="/buono-regalo"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna ai buoni
          </Link>
        </div>
      </div>
    );
  }

  const business = voucher.business;
  const template = voucher.template;
  const causale = `Buono ${voucher.code} - ${voucher.buyer_name || ''}`.trim();

  return (
    <div className="pt-20 md:pt-24 pb-16 bg-gray-light min-h-screen print:pt-0 print:bg-white">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        {/* HEADER SUCCESS */}
        <div className="text-center mb-10 print:mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold text-dark mb-3">
            Richiesta ricevuta!
          </h1>
          <p className="text-gray-600 font-open-sans max-w-xl mx-auto">
            Il tuo buono è stato registrato. Completa il pagamento seguendo le
            istruzioni qui sotto: il buono si attiverà automaticamente una volta
            registrato.
          </p>
        </div>

        {/* VOUCHER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 print:shadow-none">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 md:p-8 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-widest uppercase opacity-90">
                Buono Regalo
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                In attesa di pagamento
              </span>
            </div>
            <h2 className="font-montserrat text-2xl md:text-3xl font-extrabold mb-2">
              {template?.name || 'Buono Tribù'}
            </h2>
            <div className="font-montserrat text-4xl md:text-5xl font-extrabold">
              {formatPrice(voucher.amount)}
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Codice buono
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-light px-4 py-3 rounded-xl font-mono font-bold text-lg md:text-xl text-dark select-all">
                {voucher.code}
                <button
                  type="button"
                  onClick={() => copyToClipboard(voucher.code, 'code')}
                  className="ml-2 text-gray-500 hover:text-primary transition-colors print:hidden"
                  aria-label="Copia codice"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied === 'code' && (
                <p className="text-xs text-green-600 mt-1 print:hidden">Codice copiato!</p>
              )}

              {voucher.expires_at && (
                <div className="mt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Scadenza
                  </div>
                  <div className="font-semibold text-dark">
                    {formatDate(voucher.expires_at)}
                  </div>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <div className="flex flex-col items-center md:items-end">
                <img
                  src={qrDataUrl}
                  alt={`QR Code buono ${voucher.code}`}
                  className="w-40 h-40 md:w-44 md:h-44 rounded-xl border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-2 text-center md:text-right">
                  Presenta il QR in studio<br />per riscattare il buono
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COME PAGARE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="font-montserrat text-xl md:text-2xl font-bold text-dark mb-5">
            Come completare il pagamento
          </h2>

          {business?.payment_instructions && (
            <div className="mb-6 text-gray-700 font-open-sans leading-relaxed whitespace-pre-line">
              {business.payment_instructions}
            </div>
          )}

          {(business?.bank_iban || business?.bank_account_holder) && (
            <div className="bg-gray-light rounded-xl p-5 mb-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Dati per bonifico
              </div>
              {business.bank_account_holder && (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Intestatario</div>
                    <div className="font-semibold text-dark">{business.bank_account_holder}</div>
                  </div>
                </div>
              )}
              {business.bank_iban && (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500">IBAN</div>
                    <div className="font-mono font-bold text-dark break-all">{business.bank_iban}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(business.bank_iban || '', 'iban')}
                    className="text-gray-500 hover:text-primary transition-colors print:hidden flex-shrink-0"
                    aria-label="Copia IBAN"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
              {copied === 'iban' && (
                <p className="text-xs text-green-600 print:hidden">IBAN copiato!</p>
              )}
              <div className="flex items-start justify-between gap-3 border-t border-gray-200 pt-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500">Causale suggerita</div>
                  <div className="font-semibold text-dark break-words">{causale}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(causale, 'causale')}
                  className="text-gray-500 hover:text-primary transition-colors print:hidden flex-shrink-0"
                  aria-label="Copia causale"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied === 'causale' && (
                <p className="text-xs text-green-600 print:hidden">Causale copiata!</p>
              )}
            </div>
          )}

          {(business?.email || business?.phone) && (
            <p className="text-sm text-gray-600">
              Dubbi o pagamento già effettuato? Contattaci
              {business.email && (
                <>
                  {' '}su <a href={`mailto:${business.email}`} className="text-primary font-semibold hover:underline">{business.email}</a>
                </>
              )}
              {business.phone && (
                <>
                  {' '}o al <a href={`tel:${business.phone}`} className="text-primary font-semibold hover:underline">{business.phone}</a>
                </>
              )}
              .
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-dark text-white font-bold px-6 py-3.5 rounded-full hover:bg-black transition-colors"
          >
            <Printer className="w-5 h-5" />
            Stampa buono
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-dark font-bold px-6 py-3.5 rounded-full hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="pt-32 pb-20 min-h-[60vh] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
