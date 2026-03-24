// app/servizi-fitness/page.tsx
import type { Metadata } from 'next';
import ServiziFitnessContent from './ServiziFitnessContent';

export const metadata: Metadata = {
  title: 'Servizi Fitness Verona | Personal Training, Miniclass, Private Gym - Tribù Studio',
  description: 'Scopri i servizi fitness di Tribù Studio a Verona: personal training individuale e di coppia, miniclass Functional, Posturale, Strafit e Terza Età, Private Gym e Coaching Online.',
  keywords: 'personal trainer verona, miniclass verona, strafit verona, functional training verona, private gym verona, coaching online fitness, lezioni individuali verona, allenamento personalizzato',
  openGraph: {
    title: 'Servizi Fitness Verona | Tribù Personal Training Studio',
    description: 'Personal training, miniclass, private gym e coaching online. Allenamento su misura per ogni obiettivo a Verona.',
    url: 'https://www.tribustudio.it/servizi-fitness',
    type: 'website',
  },
  alternates: {
    canonical: '/servizi-fitness',
  },
};

export default function ServiziFitnessPage() {
  return <ServiziFitnessContent />;
}
