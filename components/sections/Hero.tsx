'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark/90 z-10" />
        {/* Sostituisci con l'immagine dello studio quando disponibile */}
        <div className="w-full h-full bg-gray-dark">
          {/* Per usare l'immagine reale, sostituisci con:
          <Image 
            src="/images/hero/hero-bg.jpg" 
            alt="Tribù Personal Training Studio"
            fill
            className="object-cover"
            priority
          />
          */}
          <div className="w-full h-full bg-gray-600"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom mx-auto px-4 text-center text-white pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4"
        >
          Allenati, mangia bene<br />e vivi meglio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto font-light"
        >
          Allenarsi con un personal trainer significa trovare la giusta motivazione 
          ed ottimizzare il tuo tempo. Inizia oggi il tuo percorso su misura 
          con un professionista al tuo fianco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-base md:text-lg px-8 py-4 shadow-xl-orange"
          >
            Prenota la tua prima lezione + massaggio gratuito
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="animate-bounce-slow" size={28} />
        </motion.div>
      </div>
    </section>
  );
}