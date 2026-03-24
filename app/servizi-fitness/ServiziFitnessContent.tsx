// app/servizi-fitness/ServiziFitnessContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Users, UsersRound, Dumbbell, Monitor, Calendar, Clock, ExternalLink, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

// Galleria immagini Strafit con auto-slide
const STRAFIT_IMAGES = [
  { src: '/images/servizi/strafit-1.jpg', alt: 'Miniclass Strafit plank su cuscini instabili - Tribù Studio Verona' },
  { src: '/images/servizi/strafit-2.jpg', alt: 'Miniclass Strafit allenamento in piedi su cuscini - Tribù Studio Verona' },
  { src: '/images/servizi/strafit-3.jpg', alt: 'Miniclass Strafit gruppo allenamento - Unici a Verona' },
];

function StrafitGallery() {
  const [currentImg, setCurrentImg] = useState(0);

  // Auto-slide ogni 3 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % STRAFIT_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 overflow-hidden group">
      {STRAFIT_IMAGES.map((img, idx) => (
        <Image
          key={idx}
          src={img.src}
          alt={img.alt}
          fill
          className={`object-cover transition-opacity duration-700 ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {/* Indicatori */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {STRAFIT_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImg(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentImg ? 'bg-white w-4' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

// Orari miniclass
const ORARI_MINICLASS = {
  functional: [
    { giorno: 'Lunedì', ora: '17:30' },
    { giorno: 'Martedì', ora: '10:00' },
    { giorno: 'Giovedì', ora: '17:30' },
    { giorno: 'Sabato', ora: '10:00' },
  ],
  posturale: [
    { giorno: 'Mercoledì', ora: '18:30' },
    { giorno: 'Sabato', ora: '09:00' },
  ],
  terzaeta: [
    { giorno: 'Martedì', ora: '10:00' },
    { giorno: 'Giovedì', ora: '10:00' },
    { giorno: 'Sabato', ora: '11:00' },
  ],
};

const WHATSAPP_URL = 'https://wa.me/393478881515?text=Ciao!%20Vorrei%20informazioni%20sui%20servizi%20fitness.';

export default function ServiziFitnessContent() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-dark to-gray-900 text-white py-16 md:py-24 px-4">
          <div className="container-custom mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 text-sm">
              <ArrowLeft size={16} />
              Torna alla home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                {t("serviziFitness", "title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
                {t("serviziFitness", "subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Personal Training 1-to-1 */}
        <section className="py-16 px-4" ref={ref}>
          <div className="container-custom mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image src="/images/servizi/personal.jpg" alt="Personal Training Individuale Verona" fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-montserrat font-bold">{t("servizi", "individualeTitle")}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t("servizi", "individualeDetails")}</p>
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <p className="font-semibold mb-3 text-sm">{t("servizi", "listinoPrezzi")}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>10 lezioni</span><strong>55€/lez</strong></div>
                    <div className="flex justify-between text-sm"><span>20 lezioni</span><strong>50€/lez</strong></div>
                    <div className="flex justify-between text-sm"><span>30 lezioni</span><strong>45€/lez</strong></div>
                  </div>
                </div>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                  {t("serviziFitness", "prenotaWhatsapp")}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Lezioni di Coppia */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container-custom mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-montserrat font-bold">{t("servizi", "coppiaTitle")}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t("servizi", "coppiaDetails")}</p>
                <div className="bg-white rounded-xl p-5 mb-6">
                  <p className="font-semibold mb-3 text-sm">{t("servizi", "listinoPrezzi")}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>10 lezioni</span><strong>35€/lez/pers</strong></div>
                    <div className="flex justify-between text-sm"><span>20 lezioni</span><strong>30€/lez/pers</strong></div>
                    <div className="flex justify-between text-sm"><span>30 lezioni</span><strong>25€/lez/pers</strong></div>
                  </div>
                </div>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                  {t("serviziFitness", "prenotaWhatsapp")}
                </a>
              </div>
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden order-1 md:order-2">
                <Image src="/images/servizi/coppia.jpg" alt="Lezioni di Coppia Personal Training Verona" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Miniclass */}
        <section className="py-16 px-4">
          <div className="container-custom mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UsersRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold">{t("servizi", "miniclassTitle")}</h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("servizi", "miniclassDetails")}</p>
              <div className="bg-primary/5 rounded-xl p-4 mt-4 inline-block">
                <p className="text-sm font-semibold">{t("servizi", "aPartireDa")} <span className="text-2xl text-primary">15€</span>{t("servizi", "perLezione")}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Functional Training */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image src="/images/servizi/miniclass-functional.jpg" alt="Miniclass Functional Training Verona" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{t("servizi", "miniclassFunctional")}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t("servizi", "miniclassFunctionalDesc")}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-semibold text-sm">{t("serviziFitness", "orariMiniclass")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ORARI_MINICLASS.functional.map((o, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock size={12} /> {o.giorno}: <strong>{o.ora}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Posturale */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image src="/images/servizi/miniclass-postural.jpg" alt="Miniclass Posturale Verona" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{t("servizi", "miniclassPosturale")}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t("servizi", "miniclassPosturaleDesc")}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-semibold text-sm">{t("serviziFitness", "orariMiniclass")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ORARI_MINICLASS.posturale.map((o, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock size={12} /> {o.giorno}: <strong>{o.ora}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STRAFIT - NUOVO! */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} />
                    {t("servizi", "miniclassStrafitBadge")}
                  </span>
                </div>
                <StrafitGallery />
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{t("servizi", "miniclassStrafit")}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t("servizi", "miniclassStrafitDesc")}</p>
                  <a
                    href="https://www.strafit.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
                  >
                    Scopri Strafit <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Terza Età */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image src="/images/servizi/miniclass-aged.jpg" alt="Ginnastica Terza Età Verona" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{t("servizi", "miniclassDolceTerzaEta")}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t("servizi", "miniclassTerzaEtaDesc")}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-semibold text-sm">{t("serviziFitness", "orariMiniclass")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ORARI_MINICLASS.terzaeta.map((o, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock size={12} /> {o.giorno}: <strong>{o.ora}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Gym */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container-custom mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-montserrat font-bold">Private Gym</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Prenota lo studio tutto per te e allenati in totale privacy con le nostre attrezzature professionali.
            </p>
            <Link href="/private-gym" className="btn-primary inline-block">
              {t("serviziFitness", "scopriPrivateGym")}
            </Link>
          </div>
        </section>

        {/* Coaching Online */}
        <section className="py-16 px-4">
          <div className="container-custom mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <Image src="/images/servizi/online.jpg" alt="Coaching Online Fitness" fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-montserrat font-bold">{t("servizi", "onlineTitle")}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t("servizi", "onlineDetails")}</p>
                <a
                  href="https://www.tornoinforma.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {t("serviziFitness", "vaiCoachingOnline")} <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Finale */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark text-white text-center">
          <div className="container-custom mx-auto">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
              Pronto a iniziare il tuo percorso fitness?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Contattaci su WhatsApp per informazioni, disponibilità e per prenotare la tua prima lezione.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block"
            >
              {t("serviziFitness", "prenotaWhatsapp")}
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
