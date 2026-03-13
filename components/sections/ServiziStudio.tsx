// components/sections/ServiziStudio.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ShowerHead,
  Accessibility,
  Car,
  Phone,
  Droplets,
  Coffee,
  DoorOpen
} from 'lucide-react';

const SERVIZI_STUDIO = [
  {
    icon: ShowerHead,
    titolo: 'Docce',
    descrizione: 'Spogliatoi con docce calde disponibili'
  },
  {
    icon: DoorOpen,
    titolo: 'Spogliatoi',
    descrizione: 'Spogliatoi privati e attrezzati'
  },
  {
    icon: Accessibility,
    titolo: 'Accesso Disabili',
    descrizione: 'Struttura accessibile a tutti'
  },
  {
    icon: Car,
    titolo: 'Parcheggio',
    descrizione: 'Ampio parcheggio gratuito'
  },
  {
    icon: Phone,
    titolo: 'Wi-Fi Gratuito',
    descrizione: 'Connessione Wi-Fi disponibile'
  },
  {
    icon: Droplets,
    titolo: 'Acqua Ionizzata',
    descrizione: 'Distributore acqua ionizzata'
  },
  {
    icon: Coffee,
    titolo: 'Area Caffè',
    descrizione: 'Zona relax con caffè disponibile'
  }
];

export default function ServiziStudio() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 bg-white" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-4 md:mb-6">
            Lo Studio
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 md:mb-8"></div>
          <p className="text-base md:text-lg text-gray max-w-2xl mx-auto px-4">
            Tutto quello che ti serve per allenarti in comfort e tranquillità, in un ambiente professionale e curato.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {SERVIZI_STUDIO.map((servizio, index) => {
            const Icon = servizio.icon;
            return (
              <motion.div
                key={servizio.titolo}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-gray-light hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary/10 rounded-full w-14 h-14 md:w-16 md:h-16 mb-3 flex items-center justify-center">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{servizio.titolo}</h3>
                <p className="text-xs md:text-sm text-gray leading-tight">{servizio.descrizione}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
