'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface QuizCTAProps {
  variant?: 'hero' | 'section' | 'floating' | 'banner'
  className?: string
}

export default function QuizCTA({ variant = 'section', className = '' }: QuizCTAProps) {
  const [isHovered, setIsHovered] = useState(false)

  // VARIANT: Hero - Grande, prominente
  if (variant === 'hero') {
    return (
      <motion.div
        className={`text-center space-y-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Novità: Quiz Personalizzato
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Non sai da dove iniziare?
        </h2>
        
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Rispondi a 10 domande veloci e scopri quale percorso è perfetto per te.
        </p>

        <Link
          href="/quiz"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-lg font-semibold text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/25"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Fai il Quiz Gratuito
          <motion.span
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </Link>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            2 minuti
          </span>
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            100% gratuito
          </span>
        </div>
      </motion.div>
    )
  }

  // VARIANT: Section - Card per sezione dedicata
  if (variant === 'section') {
    return (
      <section className={`py-16 px-4 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Trova il tuo percorso in 2 minuti
                </h2>
                <p className="text-gray-300 text-lg">
                  Non tutti i programmi sono uguali. Scopri quale fa per te con il nostro quiz personalizzato.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    10 domande semplici
                  </li>
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Risultato personalizzato
                  </li>
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Consulenza gratuita inclusa
                  </li>
                </ul>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href="/quiz"
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-lg font-semibold text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/25"
                >
                  Inizia il Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // VARIANT: Floating - Bottone fisso bottom-right
  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        <Link
          href="/quiz"
          className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-semibold text-white shadow-lg hover:shadow-orange-500/40 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline">Fai il Quiz</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    )
  }

  // VARIANT: Banner - Striscia top/bottom
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-orange-600 to-red-600 py-3 px-4 ${className}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-sm">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <strong>Nuovo:</strong> Scopri il tuo percorso ideale con il nostro quiz gratuito
          </span>
          <Link
            href="/quiz"
            className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline"
          >
            Fai il quiz ora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return null
}
