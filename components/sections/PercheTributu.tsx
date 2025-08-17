'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Nessun abbonamento vincolante',
  'Ogni sessione su appuntamento',
  'Personal Trainer sempre presente',
  'Massima personalizzazione',
  'Ambiente esclusivo e riservato',
  'Risultati concreti e misurabili'
];

export default function PercheTributu() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden" ref={ref}>
      {/* Sfondo fisso con parallax dello studio */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/studio/studio-2.jpg")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {/* Overlay gradiente per leggibilità */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        
        {/* Pattern decorativo sottile */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Contenuto sopra lo sfondo */}
      <div className="relative z-10 container-custom mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Colonna sinistra - Testo principale */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
              No, non è una <span className="text-primary">classica palestra</span>
            </h2>
            
            <div className="w-24 h-1 bg-primary mb-8"></div>
            
            <p className="text-lg md:text-xl mb-6 text-gray-200 leading-relaxed">
              <span className="font-semibold text-white">Tribù</span> è uno studio di Personal Training dove facciamo solo lezioni individuali, di coppia e miniclass.
            </p>
            
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Nessun abbonamento, niente accesso libero: ogni sessione è su appuntamento e supervisionata da un Personal Trainer.
            </p>
            
            <p className="text-xl md:text-2xl font-bold text-primary bg-white/10 backdrop-blur-sm p-4 rounded-lg inline-block">
              Questo significa più personalizzazione, motivazione e risultati concreti.
            </p>
          </motion.div>

          {/* Colonna destra - Lista benefici */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <span className="text-white font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}