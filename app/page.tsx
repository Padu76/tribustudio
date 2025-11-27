import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import Hero from '../components/sections/Hero';
import ChiSiamo from '../components/sections/ChiSiamo';
import PercheTributu from '../components/sections/PercheTributu';
import Servizi from '../components/sections/Servizi';
import ComeFunziona from '../components/sections/ComeFunziona';
import Contatore from '../components/sections/Contatore';
import Testimonianze from '../components/sections/Testimonianze';
import OffertaSpeciale from '../components/sections/OffertaSpeciale';
import Brochure from '../components/sections/Brochure';
import FAQ from '../components/sections/FAQ';
import Contatti from '../components/sections/Contatti';
import QuizCTA from '../components/QuizCTA';
import CalcolatoreTraformazione from '../components/CalcolatoreTraformazione';

export default function Home() {
  return (
    <>
      {/* Banner Quiz in alto */}
      <QuizCTA variant="banner" />

      <Header />
      <main>
        <Hero />
        <ChiSiamo />
        <PercheTributu />

        {/* Sezione Quiz dopo PercheTributu */}
        <QuizCTA variant="section" />

        <Servizi />
        <ComeFunziona />

        {/* Calcolatore Trasformazione */}
        <CalcolatoreTraformazione />

        {/* Sezione Blog Tribù Studio */}
        <section className="bg-slate-50 py-12 mt-8">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Blog Tribù Studio
            </h2>
            <p className="text-gray-600 mb-4 max-w-2xl">
              Articoli pratici su allenamento, alimentazione e motivazione,
              pensati per chi ha poco tempo ma vuole risultati reali. Nessuna
              fuffa, solo consigli applicabili da subito nella vita di tutti i
              giorni.
            </p>
            <Link
              href="/blog"
              className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            >
              Vai al blog →
            </Link>
          </div>
        </section>

        <Contatore />
        <Testimonianze />
        <OffertaSpeciale />
        <Brochure />
        <FAQ />
        <Contatti />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Bottone floating Quiz */}
      <QuizCTA variant="floating" />
    </>
  );
}
