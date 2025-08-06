'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClipboardCheck, Target, Dumbbell, Heart, Trophy } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Valutazione iniziale',
    description: 'Analizziamo il tuo punto di partenza',
    color: 'bg-blue-500'
  },
  {
    icon: Target,
    title: 'Piano personalizzato',
    description: 'Allenamento e nutrizione su misura',
    color: 'bg-green-500'
  },
  {
    icon: Dumbbell,
    title: 'Allenamento guidato',
    description: 'Seguito passo passo da un personal trainer',
    color: 'bg-primary'
  },
  {
    icon: Heart,
    title: 'Recupero e benessere',
    description: 'Massaggi e strategie di recupero',
    color: 'bg-purple-500'
  },
  {
    icon: Trophy,
    title: 'Risultati concreti',
    description: 'Progressi costanti e misurabili',
    color: 'bg-yellow-500'
  }
];

export default function ComeFunziona() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section id="come-funziona" className="section-padding bg-white" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Il tuo percorso con Tribù
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Un metodo collaudato in 5 step per raggiungere i tuoi obiettivi in modo efficace e duraturo.
          </p>
        </motion.div>

        <div className="relative">
          {/* Linea connettiva desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center relative z-10"
                >
                  <div className="bg-white rounded-full p-2 mx-auto mb-4">
                    <div className={`${step.color} rounded-full w-20 h-20 mx-auto flex items-center justify-center text-white hover:scale-110 transition-transform`}>
                      <Icon size={36} />
                    </div>
                  </div>
                  <h3 className="font-montserrat font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray text-sm">{step.description}</p>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Inizia oggi
          </button>
        </motion.div>
      </div>
    </section>
  );
}