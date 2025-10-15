import type { Metadata } from 'next';
import './globals.css';
import WebsiteTracker from '@/components/WebsiteTracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tribustudio.it'),
  title: 'Tribù Personal Training Studio - Allenati, mangia bene e vivi meglio',
  description:
    'Studio di Personal Training a Verona. Lezioni individuali, di coppia e miniclass con personal trainer qualificati. Prenota la tua prima lezione con massaggio gratuito.',
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
    <html lang="it">
      <body>
        <WebsiteTracker websiteId="tribu-studio" />
        {children}
      </body>
    </html>
  );
}
