'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, User, UsersRound, Apple, Heart, Monitor, X, ExternalLink, Calendar, Clock } from 'lucide-react';

const SERVIZI = [
  {
    id: 'individuale',
    titolo: 'Lezioni Individuali',
    descrizione: 'Allenamenti 1-to-1 per risultati massimi',
    prezzi: [
      { lezioni: 10, prezzo: 55, label: '10 lezioni → 55€/lez' },
      { lezioni: 20, prezzo: 50, label: '20 lezioni → 50€/lez' },
      { lezioni: 30, prezzo: 45, label: '30 lezioni → 45€/lez' }
    ],
    dettagli: 'Allenamento completamente personalizzato con un personal trainer dedicato esclusivamente a te. Massima attenzione, correzione immediata della tecnica e progressi rapidi.'
  },
  {
    id: 'coppia',
    titolo: 'Lezioni di Coppia',
    descrizione: 'Allenati con un amico/a e condividi motivazione',
    prezzi: [
      { lezioni: 10, prezzo: 35, label: '10 lezioni → 35€/lez/pers' },
      { lezioni: 20, prezzo: 30, label: '20 lezioni → 30€/lez/pers' },
      { lezioni: 30, prezzo: 25, label: '30 lezioni → 25€/lez/pers' }
    ],
    dettagli: 'Perfetto per chi vuole allenarsi con un partner. Motivazione reciproca, divertimento e risparmio, mantenendo sempre la supervisione professionale.'
  },
  {
    id: 'miniclass',
    titolo: 'Miniclass (3-5 persone)',
    descrizione: 'Functional, Posturale e Terza Età - Gruppi ristretti con orari fissi',
    prezzi: [
      { lezioni: 10, prezzo: 15, label: '10 lezioni → 15€/lez' }
    ],
    dettagli: 'Il giusto equilibrio tra personalizzazione e dinamica di gruppo. Ideale per chi cerca motivazione e socialità senza rinunciare alla qualità.',
    orari: {
      functional: [
        { giorno: 'Lunedì', ora: '17:30' },
        { giorno: 'Martedì', ora: '10:00' },
        { giorno: 'Giovedì', ora: '17:30' },
        { giorno: 'Sabato', ora: '10:00' }
      ],
      posturale: [
        { giorno: 'Mercoledì', ora: '18:30' },
        { giorno: 'Sabato', ora: '09:00' }
      ],
      terzaeta: [
        { giorno: 'Martedì', ora: '10:00' },
        { giorno: 'Giovedì', ora: '10:00' },
        { giorno: 'Sabato', ora: '11:00' }
      ]
    }
  },
  {
    id: 'nutrizionista',
    titolo: 'Nutrizionista',
    descrizione: 'Consulenza nutrizionale integrata all\'allenamento',
    prezzi: null,
    dettagli: 'Piano alimentare personalizzato che si integra perfettamente con il tuo programma di allenamento per risultati ottimali.'
  },
  {
    id: 'massaggi',
    titolo: 'Massaggi',
    descrizione: 'Recupero muscolare e benessere',
    prezzi: null,
    dettagli: 'Massaggi professionali per il recupero post-allenamento, riduzione delle tensioni muscolari e miglioramento del benessere generale.'
  },
  {
    id: 'online',
    titolo: 'Coaching Online',
    descrizione: 'Allenati ovunque con il nostro supporto',
    link: 'https://www.tornoinforma.it',
    prezzi: null,
    dettagli: 'Programmi di allenamento online personalizzati con supporto costante del tuo personal trainer, ovunque tu sia.'
  }
];

const serviceIcons: { [key: string]: React.ElementType } = {
  individuale: User,
  coppia: Users,
  miniclass: UsersRound,
  nutrizionista: Apple,
  massaggi: Heart,
  online: Monitor
};

export default function Servizi() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [selectedService, setSelectedService] = useState<typeof SERVIZI[0] | null>(null);

  return (
    <section id="servizi" className="section-padding bg-gray-light" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            I Nostri Servizi
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Scegli il percorso più adatto a te. Ogni servizio è pensato per offrirti il massimo supporto nel raggiungimento dei tuoi obiettivi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVIZI.map((servizio, index) => {
            const Icon = serviceIcons[servizio.id];
            return (
              <motion.div
                key={servizio.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => servizio.id !== 'online' && setSelectedService(servizio)}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 mb-4 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Icon size={32} className="text-primary group-hover:text-white" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-2">{servizio.titolo}</h3>
                <p className="text-gray mb-4 text-sm">{servizio.descrizione}</p>
                
                {/* Speciale per Miniclass - mostra i tipi */}
                {servizio.id === 'miniclass' && (
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-semibold text-primary">Functional Training</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-semibold text-primary">Posturale</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-semibold text-primary">Ginnastica Terza Età</span>
                    </div>
                  </div>
                )}
                
                {servizio.prezzi && servizio.prezzi.length > 0 && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm font-semibold text-primary mb-2">A partire da:</p>
                    <p className="text-2xl font-bold text-dark">
                      {servizio.prezzi[servizio.prezzi.length - 1].prezzo}€<span className="text-sm font-normal">/lezione</span>
                    </p>
                  </div>
                )}
                
                {servizio.id === 'online' ? (
                  <a
                    href={servizio.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Vai al sito <ExternalLink size={16} />
                  </a>
                ) : (
                  <button className="text-primary font-semibold hover:text-primary-dark transition-colors">
                    Scopri di più →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Dettagli */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="font-montserrat font-bold text-2xl mb-4">{selectedService.titolo}</h3>
            <p className="text-gray mb-6">{selectedService.dettagli}</p>
            
            {/* Orari Miniclass con immagini */}
            {selectedService.id === 'miniclass' && selectedService.orari && (
              <div className="space-y-6 mb-6">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  Le nostre Miniclass
                </h4>
                
                {/* Functional Training */}
                <div className="bg-gray-light rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <div className="relative h-32 md:h-full rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src="/images/servizi/miniclass-functional.jpg"
                          alt="Miniclass Functional"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h5 className="font-semibold text-primary mb-2">🏋️ Functional Training</h5>
                      <p className="text-sm text-gray mb-3">Allenamento funzionale ad alta intensità per migliorare forza, resistenza e coordinazione.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedService.orari.functional.map((orario, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-gray" />
                            <span>{orario.giorno}: <strong>{orario.ora}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Posturale */}
                <div className="bg-gray-light rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <div className="relative h-32 md:h-full rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src="/images/servizi/miniclass-postural.jpg"
                          alt="Miniclass Posturale"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h5 className="font-semibold text-primary mb-2">🧘 Posturale</h5>
                      <p className="text-sm text-gray mb-3">Esercizi mirati per migliorare la postura, ridurre tensioni e prevenire dolori.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedService.orari.posturale.map((orario, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-gray" />
                            <span>{orario.giorno}: <strong>{orario.ora}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Terza Età */}
                <div className="bg-gray-light rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <div className="relative h-32 md:h-full rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src="/images/servizi/miniclass-aged.jpg"
                          alt="Ginnastica Terza Età"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h5 className="font-semibold text-primary mb-2">👥 Ginnastica Dolce Terza Età</h5>
                      <p className="text-sm text-gray mb-3">
                        Ginnastica leggera con obiettivo di recuperare e mantenere la muscolatura. 
                        Fai il primo passo verso una nuova vita piena di energia ed indipendente!
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedService.orari.terzaeta.map((orario, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-gray" />
                            <span>{orario.giorno}: <strong>{orario.ora}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Prezzi */}
            {selectedService.prezzi && (
              <div className="bg-gray-light rounded-lg p-4 mb-6">
                <p className="font-semibold mb-3">Listino prezzi:</p>
                {selectedService.prezzi.map((prezzo, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray/10 last:border-0">
                    <span className="text-gray">{prezzo.label}</span>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              className="btn-primary w-full"
              onClick={() => {
                setSelectedService(null);
                document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Prenota ora
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}