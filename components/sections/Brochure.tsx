'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download, FileText, Calendar, Euro, Clock } from 'lucide-react';

const brochureContent = [
  { icon: FileText, label: 'Programmi dettagliati' },
  { icon: Euro, label: 'Listino prezzi completo' },
  { icon: Calendar, label: 'Orari miniclass' },
  { icon: Clock, label: 'Info e contatti' }
];

export default function Brochure() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleDownload = () => {
    // Link alla brochure PDF
    window.open('/brochure-tribu.pdf', '_blank');
  };

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Vuoi scoprire tutti i dettagli?
            </h2>
            <div className="w-24 h-1 bg-primary mb-8"></div>
            
            <p className="text-lg text-gray mb-8 leading-relaxed">
              Scarica la nostra brochure completa con programmi, prezzi e orari delle nostre miniclass.
              Tutto quello che ti serve per iniziare subito il tuo percorso con Tribù.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {brochureContent.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Icon className="text-primary" size={20} />
                    <span className="text-gray">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-3"
            >
              <Download size={20} />
              Scarica la brochure PDF
            </motion.button>
          </motion.div>

          {/* Right side - Brochure preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Anteprima reale della brochure */}
            <div className="relative group cursor-pointer" onClick={handleDownload}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                <div className="bg-white/90 text-primary rounded-full p-4">
                  <Download size={32} />
                </div>
              </div>
              
              {/* Immagine anteprima brochure */}
              <img
                src="/images/brochure/brochure-preview.jpg"
                alt="Anteprima Brochure Tribù"
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  // Se l'immagine non si carica, mostra un placeholder
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              
              {/* Placeholder se l'immagine non c'è */}
              <div className="hidden bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText size={64} className="text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray mb-2">Brochure Tribù</h4>
                  <p className="text-gray mb-4">Personal Training Studio</p>
                  <button className="btn-primary inline-flex items-center gap-2">
                    <Download size={20} />
                    Scarica PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Testo sotto l'anteprima */}
            <p className="text-center text-gray mt-4 text-sm">
              Clicca sull&apos;anteprima per scaricare la brochure completa
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}