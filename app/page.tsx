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