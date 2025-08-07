import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tribù Personal Training Studio Verona - Allenamento Personalizzato',
  description: 'Studio di Personal Training a Verona. Lezioni individuali, di coppia e miniclass con personal trainer qualificati. Prima lezione + massaggio GRATIS. Via Albere 27/B.',
  keywords: 'personal trainer verona, palestra verona, allenamento personalizzato verona, tribù studio, fitness verona, personal training verona, miniclass verona, ginnastica posturale verona, functional training verona, ginnastica terza età verona, nutrizionista verona, massaggi sportivi verona',
  authors: [{ name: 'Tribù Personal Training Studio' }],
  creator: 'Tribù Personal Training Studio',
  publisher: 'Tribù Personal Training Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tribustudio.it'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tribù Personal Training Studio - Il Tuo Studio Personale a Verona',
    description: 'Non una semplice palestra ma il tuo studio personale. Allenamenti personalizzati, miniclass e nutrizione. Prima lezione + massaggio gratuito.',
    url: 'https://tribustudio.it',
    siteName: 'Tribù Personal Training Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tribù Personal Training Studio Verona',
      }
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tribù Personal Training Studio Verona',
    description: 'Studio di Personal Training a Verona. Prima lezione + massaggio GRATIS.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'IL_TUO_CODICE_GOOGLE', // Da aggiungere dopo verifica
  },
};

// Schema.org JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  '@id': 'https://tribustudio.it',
  name: 'Tribù Personal Training Studio',
  description: 'Studio di Personal Training a Verona specializzato in allenamenti personalizzati, miniclass e nutrizione',
  url: 'https://tribustudio.it',
  telephone: '+393478881515',
  email: 'info@tribustudio.it',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Albere 27/B',
    addressLocality: 'Verona',
    addressRegion: 'VR',
    postalCode: '37138',
    addressCountry: 'IT'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.43253383632741,
    longitude: 10.975025538647104
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '21:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '13:00'
    }
  ],
  priceRange: '€€',
  image: 'https://tribustudio.it/images/logo/logo-tribu.png',
  sameAs: [
    'https://www.facebook.com/tribupersonaltrainingstudio',
    'https://www.instagram.com/tribu_personal_trainer/'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi Personal Training',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Lezioni Individuali',
          description: 'Allenamenti 1-to-1 con personal trainer'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Miniclass',
          description: 'Functional, Posturale e Ginnastica Terza Età in piccoli gruppi'
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#F37021" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        
        {/* Google Analytics - Sostituisci GA_MEASUREMENT_ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}