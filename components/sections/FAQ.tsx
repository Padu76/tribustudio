'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
  {
    domanda: 'Serve esperienza per allenarmi con voi?',
    risposta: 'No, gli allenamenti sono accessibili a tutti e personalizzati sul tuo livello. I nostri personal trainer adatteranno ogni esercizio alle tue capacità attuali, accompagnandoti in un percorso di miglioramento graduale e sicuro.'
  },
  {
    domanda: 'Quanto dura una lezione?',
    risposta: 'Circa 55 minuti. Questo tempo include riscaldamento, allenamento principale e defaticamento/stretching finale.'
  },
  {
    domanda: 'Che differenza c\'è tra Miniclass Functional e Posturale?',
    risposta: 'Le Miniclass Functional sono allenamenti ad alta intensità focalizzati su forza, resistenza e coordinazione con esercizi funzionali. Le Miniclass Posturali invece si concentrano sul miglioramento della postura, riduzione delle tensioni muscolari e prevenzione dei dolori attraverso esercizi mirati e controllati. Entrambe sono in gruppi di massimo 5 persone.'
  },
  {
    domanda: 'Quali sono gli orari delle Miniclass?',
    risposta: 'Miniclass Functional: Lunedì e Giovedì alle 17:30, Martedì e Sabato alle 10:00. Miniclass Posturale: Mercoledì alle 18:30 e Sabato alle 9:00. Tutti gli orari sono fissi per garantire continuità al gruppo.'
  },
  {
    domanda: 'Posso fare solo miniclass?',
    risposta: 'Certo! Puoi scegliere tra lezioni individuali, di coppia o miniclass. Puoi anche combinare diversi tipi di allenamento in base alle tue esigenze.'
  },
  {
    domanda: 'Come funzionano i pacchetti di lezioni?',
    risposta: 'Offriamo pacchetti da 10, 20 o 30 lezioni con prezzi decrescenti. Non ci sono abbonamenti mensili vincolanti: acquisti un pacchetto e lo utilizzi secondo i tuoi tempi, prenotando le lezioni quando preferisci.'
  },
  {
    domanda: 'Avete consulenza nutrizionale?',
    risposta: 'Sì, offriamo piani nutrizionali personalizzati integrati con il tuo programma di allenamento. Il nostro nutrizionista lavora in sinergia con i personal trainer per ottimizzare i tuoi risultati.'
  },
  {
    domanda: 'Devo portare qualcosa per allenarmi?',
    risposta: 'Ti consigliamo di portare abbigliamento comodo, scarpe da ginnastica pulite, un asciugamano e una borraccia d\'acqua. Tutta l\'attrezzatura necessaria per l\'allenamento è disponibile in studio.'
  },
  {
    domanda: 'C\'è il parcheggio?',
    risposta: 'Sì, abbiamo parcheggio gratuito disponibile per tutti i nostri clienti direttamente davanti allo studio.'
  },
  {
    domanda: 'Posso recuperare le lezioni perse?',
    risposta: 'Per le lezioni individuali e di coppia, puoi disdire fino a 24 ore prima senza perdere la lezione. Per le miniclass, essendo a orari fissi con gruppi stabili, le lezioni perse non sono recuperabili per garantire la continuità del gruppo.'
  }
];

export default function FAQ() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Domande Frequenti
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Trova le risposte alle domande più comuni sul nostro studio e i nostri servizi
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
            Non hai trovato la risposta che cercavi?
          </p>
          <button 
            onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            Contattaci direttamente
          </button>
        </motion.div>
      </div>
    </section>
  );
}