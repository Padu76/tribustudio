import TribuQuiz from '@/components/TribuQuiz'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scopri il Tuo Percorso | Tribù Studio Verona',
  description: 'Rispondi a 10 domande e scopri quale programma di allenamento è perfetto per te. Quiz gratuito e personalizzato.',
  openGraph: {
    title: 'Scopri il Tuo Percorso Ideale | Tribù Studio',
    description: 'Quiz interattivo per trovare il programma di allenamento perfetto per te.',
    type: 'website',
  },
}

export default function QuizPage() {
  return <TribuQuiz />
}