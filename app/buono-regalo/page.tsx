// app/buono-regalo/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Buono Regalo Tribù Studio | Regala un\'esperienza di benessere',
  description:
    'Regala un buono Tribù Studio: MiniClass Functional, Posturale o pacchetti Personal Training. Consegna digitale immediata, validità fino a 12 mesi.',
  alternates: { canonical: '/buono-regalo' },
  openGraph: {
    title: 'Buono Regalo Tribù Studio',
    description:
      'Regala un\'esperienza di allenamento o benessere con un buono Tribù Studio.',
    url: 'https://www.tribustudio.it/buono-regalo',
    type: 'website',
  },
};

interface Template {
  id: string;
  name: string;
  description: string | null;
  price: string | number | null;
  image_url: string | null;
  validity_days: number | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
}

interface TemplatesResponse {
  business: Business;
  templates: Template[];
}

async function getData(): Promise<TemplatesResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_GIFTLY_API_URL;
  const slug = process.env.NEXT_PUBLIC_GIFTLY_BUSINESS_SLUG;
  if (!apiUrl || !slug) return null;

  try {
    const res = await fetch(
      `${apiUrl}/api/public/business/${slug}/templates`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatPrice(price: string | number | null): string {
  if (price === null || price === undefined) return '—';
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(n)) return '—';
  return `€${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

const FALLBACK_IMAGES: Record<string, string> = {
  functional: '/images/servizi/miniclass-functional.jpg',
  posturale: '/images/servizi/miniclass-postural.jpg',
  personal: '/images/servizi/personal.jpg',
};

function pickFallbackImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('functional')) return FALLBACK_IMAGES.functional;
  if (lower.includes('posturale') || lower.includes('postural')) return FALLBACK_IMAGES.posturale;
  if (lower.includes('personal')) return FALLBACK_IMAGES.personal;
  return '/images/studio/studio-1.jpg';
}

export default async function BuonoRegaloPage() {
  const data = await getData();

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24">
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src="/images/studio/studio-1.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                Buono Regalo Tribù
              </span>
              <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark leading-tight mb-6">
                Regala un&apos;esperienza{' '}
                <span className="text-primary">Tribù</span>
              </h1>
              <p className="font-open-sans text-lg md:text-xl text-gray-600 leading-relaxed">
                MiniClass, Personal Training o benessere: scegli il buono
                perfetto e fai un regalo che conta davvero. Consegna digitale
                immediata, da stampare o inoltrare via email.
              </p>
            </div>
          </div>
        </section>

        {/* VOUCHER GRID */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            {!data || data.templates.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center bg-gray-light rounded-2xl p-10">
                <h2 className="font-montserrat text-2xl font-bold text-dark mb-3">
                  Buoni temporaneamente non disponibili
                </h2>
                <p className="text-gray-600 mb-6">
                  Stiamo aggiornando la nostra selezione. Contattaci su
                  WhatsApp e ti aiutiamo a scegliere il regalo giusto.
                </p>
                <a
                  href="https://wa.me/393478881515?text=Ciao!%20Vorrei%20informazioni%20sul%20buono%20regalo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors"
                >
                  Scrivici su WhatsApp
                </a>
              </div>
            ) : (
              <>
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-dark mb-4">
                    Scegli il tuo buono
                  </h2>
                  <p className="text-gray-600 font-open-sans">
                    Tutti i buoni sono validi nello studio Tribù di Verona.
                    Pagamento offline: bonifico o in studio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                  {data.templates.map((tpl) => {
                    const isBestValue = /10\s*lezioni\s*personal/i.test(tpl.name);
                    const imageSrc = tpl.image_url || pickFallbackImage(tpl.name);
                    return (
                      <article
                        key={tpl.id}
                        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl-orange transition-all duration-300 flex flex-col"
                      >
                        {isBestValue && (
                          <span className="absolute top-4 right-4 z-10 bg-primary text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-lg">
                            MIGLIOR VALORE
                          </span>
                        )}
                        <div className="relative aspect-[4/3] bg-gray-light overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={tpl.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col flex-1">
                          <h3 className="font-montserrat text-xl md:text-2xl font-bold text-dark mb-2">
                            {tpl.name}
                          </h3>
                          {tpl.description && (
                            <p className="text-gray-600 font-open-sans text-sm mb-4 flex-1">
                              {tpl.description}
                            </p>
                          )}
                          <div className="flex items-end justify-between mb-6 pt-2">
                            <div>
                              <div className="text-4xl md:text-5xl font-montserrat font-extrabold text-primary leading-none">
                                {formatPrice(tpl.price)}
                              </div>
                              {tpl.validity_days && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Validità {tpl.validity_days} giorni
                                </div>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/buono-regalo/${tpl.id}`}
                            className="block text-center bg-gradient-to-r from-primary to-primary-dark text-white font-bold px-6 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Regala questo buono
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="py-16 md:py-20 bg-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-dark mb-4">
                Come funziona
              </h2>
              <p className="text-gray-600 font-open-sans">
                Tre passaggi semplici per regalare benessere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  n: '1',
                  title: 'Scegli il buono',
                  text: 'Seleziona il pacchetto più adatto tra MiniClass, Personal Training o benessere.',
                },
                {
                  n: '2',
                  title: 'Compila e conferma',
                  text: 'Inserisci i tuoi dati e, se vuoi, quelli del destinatario con un messaggio personalizzato.',
                },
                {
                  n: '3',
                  title: 'Paga e regala',
                  text: 'Ricevi il codice con QR via email. Il pagamento si conferma con bonifico o in studio.',
                },
              ].map((step) => (
                <div key={step.n} className="relative bg-white rounded-2xl p-8 shadow-sm">
                  <div className="absolute -top-5 left-8 bg-gradient-to-br from-primary to-primary-dark text-white w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-extrabold text-xl shadow-lg">
                    {step.n}
                  </div>
                  <h3 className="font-montserrat text-xl font-bold text-dark mt-4 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 font-open-sans text-sm leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
