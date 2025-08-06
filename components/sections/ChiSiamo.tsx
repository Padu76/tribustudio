'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Heart, Users, Sparkles, Award, Clock, Shield, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Personal Training su misura',
    description: 'Ogni allenamento è personalizzato sui tuoi obiettivi'
  },
  {
    icon: Heart,
    title: 'Nutrizione e benessere',
    description: 'Approccio completo per risultati duraturi'
  },
  {
    icon: Users,
    title: 'Recupero e massaggi',
    description: 'Tecniche professionali per il tuo recupero'
  },
  {
    icon: Sparkles,
    title: 'Coaching online',
    description: 'Supporto costante ovunque tu sia'
  }
];

const features = [
  {
    icon: Award,
    title: 'Trainer Certificati',
    description: 'Solo professionisti qualificati e in continuo aggiornamento'
  },
  {
    icon: Clock,
    title: 'Flessibilità Oraria',
    description: 'Prenota quando vuoi, dalle 7:00 alle 21:00'
  },
  {
    icon: Shield,
    title: 'Risultati Garantiti',
    description: 'Metodo testato su oltre 1200 clienti soddisfatti'
  },
  {
    icon: Zap,
    title: 'Approccio Innovativo',
    description: 'Tecniche all\'avanguardia e attrezzature moderne'
  }
];

export default function ChiSiamo() {
  const { ref: ref1, inView: inView1 } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: ref2, inView: inView2 } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: ref3, inView: inView3 } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <>
      {/* Sezione 1 - Intro con testo grande */}
      <section id="chi-siamo" className="py-20 md:py-32 relative overflow-hidden bg-white" ref={ref1}>
        <div className="container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Chi Siamo</span>
            <h2 className="text-4xl md:text-6xl font-montserrat font-bold mt-4 mb-8">
              La tua <span className="text-primary">trasformazione</span> inizia qui
            </h2>
            <p className="text-xl md:text-2xl text-gray leading-relaxed mb-8">
              Crediamo in un mondo in cui aiutiamo le persone ad essere la migliore versione di sé stesse.
              Affrontiamo con loro la battaglia più difficile: credere in sé stessi e sentirsi bene nel proprio corpo.
            </p>
            <p className="text-lg md:text-xl text-gray/80">
              Allenarsi con noi non è solo allenamento: è <span className="font-semibold text-primary">motivazione</span>, 
              <span className="font-semibold text-primary"> supporto</span> e 
              <span className="font-semibold text-primary"> risultati concreti</span>.
            </p>
          </motion.div>

          {/* Valori con icone */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Icon size={36} className="text-white" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray text-sm">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sezione 2 - Immagine parallax con testo overlay */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center" ref={ref2}>
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/images/studio/studio-1.jpg")',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        
        <div className="relative z-10 container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-white mb-6">
              Non una semplice palestra, ma il tuo <span className="text-primary">studio personale</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Uno spazio esclusivo dove ogni dettaglio è pensato per il tuo benessere. 
              Attrezzature di ultima generazione, ambiente climatizzato e la privacy che meriti.
            </p>
            <button 
              onClick={() => document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all hover:scale-105"
            >
              Scopri i nostri servizi
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sezione 3 - Features con background colorato */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-white" ref={ref3}>
        <div className="container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
              Perché scegliere <span className="text-primary">Tribù</span>
            </h2>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Quattro ragioni che fanno la differenza nel tuo percorso di trasformazione
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView3 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-xl mb-2">{feature.title}</h3>
                      <p className="text-gray">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}