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
    // Sostituisci con il link reale della brochure PDF
    const pdfUrl = '/brochure-tribu.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Tribu-Personal-Training-Brochure.pdf';
    link.click();
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

          {/* Right side - Visual preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              {/* Mockup brochure preview */}
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  
                  <div className="pt-4">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded"></div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
                
                {/* Logo placeholder */}
                <div className="mt-6 flex items-center justify-center">
                  <span className="text-2xl font-montserrat font-bold text-primary">TRIBÙ</span>
                </div>
              </div>
              
              {/* Second page preview */}
              <div className="bg-white rounded-lg shadow-xl p-6 -mt-20 ml-12 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-2 bg-gray-100 rounded w-full"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>
            </div>
            
            {/* Download icon overlay */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-primary text-white rounded-full p-4 shadow-xl">
                <Download size={32} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}