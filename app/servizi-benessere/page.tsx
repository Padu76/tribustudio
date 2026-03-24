// app/servizi-benessere/page.tsx
import type { Metadata } from 'next';
import ServiziBenessereContent from './ServiziBenessereContent';

export const metadata: Metadata = {
  title: 'Servizi Benessere Verona | Nutrizionista, Massaggi Professionali - Tribù Studio',
  description: 'Servizi benessere integrati all\'allenamento: consulenza nutrizionale personalizzata e massaggi professionali per il recupero muscolare. Tribù Studio Verona.',
  keywords: 'nutrizionista verona, massaggi verona, massaggio sportivo verona, consulenza nutrizionale, piano alimentare personalizzato, recupero muscolare, benessere verona',
  openGraph: {
    title: 'Servizi Benessere Verona | Tribù Personal Training Studio',
    description: 'Nutrizionista e massaggi professionali integrati al tuo percorso di allenamento. Tribù Studio Verona.',
    url: 'https://www.tribustudio.it/servizi-benessere',
    type: 'website',
  },
  alternates: {
    canonical: '/servizi-benessere',
  },
};

export default function ServiziBenessere() {
  return <ServiziBenessereContent />;
}
