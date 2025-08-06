'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] md:h-[70vh] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark/90 z-10" />
        {/* Immagine di sfondo */}
        <img 
          src="/images/hero/hero-bg.jpg" 
          alt="Tribù Personal Training Studio"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Se l'immagine non si carica, usa un colore di sfondo
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback background se l'immagine non c'è */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom mx-auto px-4 text-center text-white pt-20 md:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 leading-tight"
        >
          Allenati, mangia bene<br className="md:hidden" />
          <span className="hidden md:inline"> </span>e vivi meglio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto font-light px-4"
        >
          Allenarsi con un personal trainer significa trovare la giusta motivazione 
          ed ottimizzare il tuo tempo. Inizia oggi il tuo percorso su misura 
          con un professionista al tuo fianco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-4 justify-center items-center px-4"
        >
          <button 
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-xl-orange w-full sm:w-auto max-w-sm"
          >
            Prenota la tua prima lezione + massaggio gratuito
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 md:bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="animate-bounce-slow" size={24} />
        </motion.div>
      </div>
    </section>
  );
}