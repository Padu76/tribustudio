// components/sections/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sfondo ottimizzato con next/image — WebP/AVIF automatico, priority per LCP */}
      <Image
        src="/images/hero/hero-bg.jpg"
        alt="Tribù Personal Training Studio"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={75}
      />

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-[1]" />

      {/* Pattern overlay per texture */}
      <div className="absolute inset-0 opacity-10 z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 container-custom mx-auto px-4 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <span className="inline-block text-primary bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 md:mb-6 border border-primary/30">
            TRASFORMA IL TUO CORPO
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-4 md:mb-6 text-white leading-tight"
        >
          Allenati, mangia bene
          <span className="block text-primary mt-2">e vivi meglio</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto text-gray-200 font-light px-4 sm:px-0"
        >
          Allenarsi con un personal trainer significa trovare la giusta motivazione
          ed ottimizzare il tuo tempo. Inizia oggi il tuo percorso su misura
          con un professionista al tuo fianco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-0"
        >
          <button
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-full font-bold text-base sm:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl w-full sm:w-auto max-w-xs"
          >
            <span className="relative z-10">Prenota la tua prima lezione</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </motion.div>

        {/* Stats mini */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 md:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
        >
          <div className="text-white">
            <div className="text-2xl sm:text-3xl font-bold text-primary">1200+</div>
            <div className="text-xs sm:text-sm opacity-80">Clienti Soddisfatti</div>
          </div>
          <div className="text-white">
            <div className="text-2xl sm:text-3xl font-bold text-primary">10+</div>
            <div className="text-xs sm:text-sm opacity-80">Anni Esperienza</div>
          </div>
          <div className="text-white">
            <div className="text-2xl sm:text-3xl font-bold text-primary">25k+</div>
            <div className="text-xs sm:text-sm opacity-80">Sessioni Complete</div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:flex"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-xs sm:text-sm">Scorri per scoprire</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
