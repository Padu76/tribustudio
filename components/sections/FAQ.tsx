'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function FAQ() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const FAQ_DATA = [
    { domanda: t("faq", "q1"), risposta: t("faq", "a1") },
    { domanda: t("faq", "q2"), risposta: t("faq", "a2") },
    { domanda: t("faq", "q3"), risposta: t("faq", "a3") },
    { domanda: t("faq", "q4"), risposta: t("faq", "a4") },
    { domanda: t("faq", "q5"), risposta: t("faq", "a5") },
    { domanda: t("faq", "q6"), risposta: t("faq", "a6") },
    { domanda: t("faq", "q7"), risposta: t("faq", "a7") },
    { domanda: t("faq", "q8"), risposta: t("faq", "a8") },
    { domanda: t("faq", "q9"), risposta: t("faq", "a9") },
    { domanda: t("faq", "q10"), risposta: t("faq", "a10") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-gray-light" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            {t("faq", "title")}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            {t("faq", "subtitle")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-lg text-dark pr-4">
                  {faq.domanda}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="text-primary" size={20} />
                  ) : (
                    <Plus className="text-primary" size={20} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-gray leading-relaxed">
                        {faq.risposta}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray mb-4">
            {t("faq", "bottomText")}
          </p>
          <button
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            {t("faq", "bottomCta")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}