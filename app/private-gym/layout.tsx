// app/private-gym/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Gym - Tribù Studio | Prenota il tuo allenamento autonomo',
  description:
    'Prenota uno slot orario nello studio Tribù e allenati in autonomia. Spazio professionale con 3 postazioni, accesso smart e pagamento online. 25€/ora a Verona.',
  keywords:
    'private gym verona, palestra privata verona, allenamento autonomo, studio fitness prenotazione, tribù studio, spazio allenamento',
  openGraph: {
    title: 'Tribù Private Gym — Prenota lo studio, allenati in autonomia',
    description:
      'Uno spazio professionale con 3 postazioni di lavoro, accesso smart tramite smartphone, pagamento online e slot orari prenotabili.',
    url: 'https://www.tribustudio.it/private-gym',
    siteName: 'Tribù Personal Training Studio',
    images: [
      {
        url: '/images/private-gym/studio/studio1.jpg',
        width: 1200,
        height: 630,
        alt: 'Tribù Private Gym — Studio professionale a Verona',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
};

export default function PrivateGymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
