// app/buono-regalo/[templateId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import PurchaseForm from './PurchaseForm';

interface Template {
  id: string;
  name: string;
  description: string | null;
  price: string | number | null;
  image_url: string | null;
  validity_days: number | null;
  type?: string | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  payment_instructions: string | null;
  bank_iban: string | null;
  bank_account_holder: string | null;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const data = await getData();
  const tpl = data?.templates.find((t) => t.id === templateId);
  if (!tpl) {
    return { title: 'Buono non disponibile | Tribù Studio' };
  }
  return {
    title: `${tpl.name} | Buono Regalo Tribù Studio`,
    description: tpl.description || `Regala un buono ${tpl.name} di Tribù Studio.`,
    alternates: { canonical: `/buono-regalo/${tpl.id}` },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const data = await getData();

  if (!data) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 md:px-6 max-w-xl text-center">
            <h1 className="font-montserrat text-3xl font-bold text-dark mb-4">
              Servizio temporaneamente non disponibile
            </h1>
            <p className="text-gray-600 mb-8">
              Non riusciamo a caricare i buoni in questo momento. Riprova più
              tardi o contattaci su WhatsApp.
            </p>
            <Link
              href="/buono-regalo"
              className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              Torna ai buoni
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const template = data.templates.find((t) => t.id === templateId);
  if (!template) notFound();

  const price = typeof template.price === 'string'
    ? parseFloat(template.price)
    : (template.price || 0);

  const imageSrc = template.image_url || pickFallbackImage(template.name);

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 pb-16 bg-gray-light min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/buono-regalo" className="hover:text-primary">Buono Regalo</Link>
            <span className="mx-2">/</span>
            <span className="text-dark">{template.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* ANTEPRIMA VOUCHER */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <div className="relative aspect-[4/3] bg-gray-light">
                  <Image
                    src={imageSrc}
                    alt={template.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h1 className="font-montserrat text-2xl md:text-3xl font-extrabold text-dark mb-3">
                    {template.name}
                  </h1>
                  {template.description && (
                    <p className="font-open-sans text-gray-600 mb-6 leading-relaxed">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-end justify-between border-t border-gray-100 pt-6">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                        Prezzo
                      </div>
                      <div className="text-4xl md:text-5xl font-montserrat font-extrabold text-primary leading-none">
                        {formatPrice(template.price)}
                      </div>
                    </div>
                    {template.validity_days && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                          Validità
                        </div>
                        <div className="font-montserrat font-bold text-dark">
                          {template.validity_days} giorni
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FORM ACQUISTO */}
            <div>
              <PurchaseForm
                templateId={template.id}
                templateName={template.name}
                amount={price}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
