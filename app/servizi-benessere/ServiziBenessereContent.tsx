// app/servizi-benessere/ServiziBenessereContent.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Apple, Heart, ArrowLeft, ExternalLink, GraduationCap, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const WHATSAPP_URL = 'https://wa.me/393478881515?text=Ciao!%20Vorrei%20informazioni%20sui%20servizi%20benessere.';

export default function ServiziBenessereContent() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white py-16 md:py-24 px-4">
          <div className="container-custom mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm">
              <ArrowLeft size={16} />
              Torna alla home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                {t("serviziBenessere", "title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                {t("serviziBenessere", "subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Nutrizionista */}
        <section className="py-16 px-4" ref={ref}>
          <div className="container-custom mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image src="/images/servizi/nutrizionista.jpg" alt="Nutrizionista Verona - Filippo Mensi Biologo Nutrizionista" fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Apple className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-montserrat font-bold">{t("servizi", "nutrizionTitle")}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t("servizi", "nutrizionDetails")}</p>

                {/* Scheda Filippo Mensi */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-6">
                  <h3 className="font-montserrat font-bold text-lg mb-1">Dott. Filippo Mensi</h3>
                  <p className="text-emerald-700 text-sm font-medium mb-3">Biologo Nutrizionista, Chinesiologo e Personal Trainer</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <GraduationCap size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Iscritto all&apos;Ordine dei Biologi del Triveneto (Tri_A3557)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Award size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Approccio basato su evidenze scientifiche, sostenibilità e consapevolezza</span>
                    </div>
                  </div>
                  <a
                    href="https://filippomensi.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 text-sm font-semibold hover:text-emerald-900 hover:gap-2.5 transition-all"
                  >
                    Scopri di più su filippomensi.it <ExternalLink size={14} />
                  </a>
                </div>

                <h4 className="font-semibold text-sm text-gray-800 mb-3">I nostri servizi nutrizionali:</h4>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Piano alimentare personalizzato per dimagrimento, sport e benessere
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Nutrizione sportiva e ottimizzazione della composizione corporea
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Consulenze per intolleranze, allergie e patologie alimentari
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Integrazione perfetta con il programma di allenamento Tribù
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Follow-up e aggiustamenti periodici del piano nutrizionale
                  </li>
                </ul>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                  {t("serviziBenessere", "prenotaWhatsapp")}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Massaggi */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container-custom mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-rose-100 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-rose-500" />
                  </div>
                  <h2 className="text-3xl font-montserrat font-bold">{t("servizi", "massaggiTitle")}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t("servizi", "massaggiDetails")}</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                    Massaggio decontratturante e sportivo
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                    Recupero post-allenamento professionale
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                    Riduzione tensioni muscolari e stress
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                    Miglioramento del benessere generale
                  </li>
                </ul>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                  {t("serviziBenessere", "prenotaWhatsapp")}
                </a>
              </div>
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden order-1 md:order-2">
                <Image src="/images/servizi/massaggi.jpg" alt="Massaggi Professionali Verona" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Finale */}
        <section className="py-16 px-4 bg-gradient-to-br from-emerald-700 to-teal-600 text-white text-center">
          <div className="container-custom mx-auto">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
              Completa il tuo percorso di benessere
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Nutrizione e recupero muscolare sono il complemento perfetto per il tuo allenamento. Contattaci per una consulenza.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block"
            >
              {t("serviziBenessere", "prenotaWhatsapp")}
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
