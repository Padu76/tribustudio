'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gift, CheckCircle, Clock, Sparkles } from 'lucide-react';

const benefits = [
  'Valutazione fisica completa',
  'Lezione personalizzata di 55 minuti',
  'Massaggio localizzato post-allenamento',
  'Consulenza nutrizionale di base',
  'Piano di allenamento personalizzato'
];

export default function OffertaSpeciale() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container-custom mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Gift size={20} />
            <span className="font-semibold">OFFERTA LIMITATA</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Prenota la tua prima lezione<br />
            e ricevi un massaggio localizzato gratuito
          </h2>
          
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-95">
            Prova l&apos;esperienza completa di Tribù: allenamento personalizzato + massaggio localizzato post-lezione.
            Il modo migliore per cominciare a trasformare il tuo corpo, senza rischi e con un beneficio immediato.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-montserrat font-bold mb-6">
              Cosa include l&apos;offerta:
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="text-white flex-shrink-0" size={24} />
                  <span className="text-lg">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right side - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white text-dark rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Sparkles className="text-primary" size={32} />
                </div>
                
                <h3 className="text-2xl font-montserrat font-bold mb-2">
                  Valore totale: <span className="line-through text-gray">90€</span>
                </h3>
                
                <div className="text-5xl font-bold text-primary mb-4">
                  GRATIS
                </div>
                
                <p className="text-gray mb-6">
                  Solo per i nuovi clienti • Offerta limitata
                </p>
                
                <button 
                  onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary w-full mb-4"
                >
                  Prenota ora
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray">
                  <Clock size={16} />
                  <span>Disponibilità limitata questa settimana</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 lg:hidden"
        >
          <button 
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
          >
            Prenota la tua prima lezione gratuita
          </button>
        </motion.div>
      </div>
    </section>
  );
}