'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIANZE } from '../../lib/constants';

export default function Testimonianze() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonianza = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIANZE.length);
  };

  const prevTestimonianza = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIANZE.length) % TESTIMONIANZE.length);
  };

  return (
    <section id="testimonianze" className="section-padding bg-gray-light" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Cosa dicono di noi
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Le storie di successo dei nostri clienti parlano da sole
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < TESTIMONIANZE[currentIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>

              {/* Testimonianza */}
              <p className="text-xl md:text-2xl text-center text-gray italic mb-6">
                "{TESTIMONIANZE[currentIndex].testo}"
              </p>

              {/* Nome */}
              <p className="text-center font-montserrat font-semibold text-lg text-primary">
                — {TESTIMONIANZE[currentIndex].nome}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonianza}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Testimonianza precedente"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>
          
          <button
            onClick={nextTestimonianza}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Testimonianza successiva"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIANZE.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
              }`}
              aria-label={`Vai alla testimonianza ${index + 1}`}
            />
          ))}
        </div>

        {/* Google Reviews Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray mb-2">Leggi tutte le nostre recensioni su</p>
          <a
            href="https://www.google.com/search?q=tribu+personal+training+verona+recensioni"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google Reviews
          </a>
        </motion.div>
      </div>
    </section>
  );
}