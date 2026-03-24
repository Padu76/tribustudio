// app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import '@/styles/cookieconsent-custom.css';
import WebsiteTracker from '@/components/WebsiteTracker';
import CookieConsent from '@/components/CookieConsent';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';

// Font ottimizzati con next/font — eliminano render-blocking CSS
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-opensans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tribustudio.it'),
  title: 'Tribù Personal Training Studio - Allenati, mangia bene e vivi meglio',
  description:
    'Studio di Personal Training a Verona. Lezioni individuali, di coppia e miniclass con personal trainer qualificati. Prenota la tua prima lezione gratuita.',
  keywords:
    'personal trainer verona, palestra verona, allenamento personalizzato, tribù studio, fitness verona, allenamento su misura, nutrizione, benessere',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tribù Personal Training Studio - Allenati, mangia bene e vivi meglio',
    description:
      'Il tuo percorso di trasformazione inizia qui. Allenamenti personalizzati a Verona con il team di Tribù Studio.',
    url: 'https://www.tribustudio.it',
    siteName: 'Tribù Personal Training Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tribù Studio Verona - Personal Trainer e Fitness',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tribù Personal Training Studio',
    description:
      'Allenamenti personalizzati a Verona. Scopri il metodo Tribù e trasforma il tuo corpo e la tua energia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${montserrat.variable} ${openSans.variable}`}>
      <head />
      <body>
        <LanguageProvider>
          <WebsiteTracker websiteId="tribu-studio" />
          {children}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
