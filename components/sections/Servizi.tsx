// components/sections/Servizi.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Activity, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function Servizi() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const { t } = useLanguage();

  return (
    <section id="servizi" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 bg-gray-light" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-4 md:mb-6">
            {t("serviziHub", "title")}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 md:mb-8"></div>
          <p className="text-base md:text-lg text-gray max-w-2xl mx-auto px-4">
            {t("serviziHub", "subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Card Servizi Fitness */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              href="/servizi-fitness"
              className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-10">
                <div className="bg-primary/10 rounded-full w-16 h-16 mb-6 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Activity size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl md:text-3xl mb-3">
                  {t("serviziHub", "fitnessTitle")}
                </h3>
                <p className="text-gray mb-6 text-sm md:text-base">
                  {t("serviziHub", "fitnessDesc")}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Personal Training 1-to-1 e di Coppia</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Miniclass: Functional, Posturale, Strafit, Terza Età</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Private Gym e Coaching Online</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  {t("serviziHub", "scopri")} <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card Servizi Benessere */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/servizi-benessere"
              className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 md:p-10">
                <div className="bg-emerald-100 rounded-full w-16 h-16 mb-6 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                  <Heart size={28} className="text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-2xl md:text-3xl mb-3">
                  {t("serviziHub", "benessereTitle")}
                </h3>
                <p className="text-gray mb-6 text-sm md:text-base">
                  {t("serviziHub", "benessereDesc")}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Nutrizionista — Piano alimentare personalizzato</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Massaggi professionali e recupero muscolare</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
                  {t("serviziHub", "scopri")} <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
