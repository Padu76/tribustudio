'use client';

import { motion } from 'framer-motion';

type Card = {
  tag: string;
  title: string;
  text: string;
  img: string;
  alt: string;
};

const cards: Card[] = [
  {
    tag: 'Qualifica',
    title: 'Trainer Certificati',
    text: 'Solo professionisti qualificati e in continuo aggiornamento.',
    img: 'https://images.unsplash.com/photo-1599050751795-5cda8b7b6357?q=80&w=1480&auto=format&fit=crop',
    alt: 'Personal trainer certificato in studio',
  },
  {
    tag: 'Flessibilità',
    title: 'Flessibilità Oraria',
    text: 'Prenota quando vuoi, dalle 7:00 alle 21:00, senza liste d’attesa.',
    img: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1480&auto=format&fit=crop',
    alt: 'Orologio e attrezzi fitness per flessibilità oraria',
  },
  {
    tag: 'Risultati',
    title: 'Risultati Garantiti',
    text: 'Metodo testato su oltre 1200 clienti: progressi concreti e misurabili.',
    img: 'https://images.unsplash.com/photo-1551292831-023188e78222?q=80&w=1480&auto=format&fit=crop',
    alt: 'Grafici risultati e misurazioni fitness',
  },
  {
    tag: 'Innovazione',
    title: 'Approccio Innovativo',
    text: 'Tecniche all’avanguardia e attrezzature moderne per ogni obiettivo.',
    img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1480&auto=format&fit=crop',
    alt: 'Sala pesi moderna e attrezzature innovative',
  },
];

export default function PercheTributu() {
  return (
    <section
      id="perche-tribu"
      className="relative section-padding"
    >
      {/* Background che non passa inosservato (texture + gradient) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.05)),
             radial-gradient(800px 300px at 50% 0%, rgba(243,112,33,0.25), transparent 60%),
             url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2zm0-30V0H4v4H0v2h4v4h2V6h4V4zm30 0V0h-2v4h-4v2h4v4h2V6h4V4z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
        }}
      />

      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Perché scegliere <span className="gradient-text">Tribù</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Quattro ragioni che fanno la differenza nel tuo percorso di trasformazione
          </p>
        </div>

        {/* Grid 2x2 su desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl hover-lift"
            >
              {/* media */}
              <div className="absolute inset-y-0 left-0 w-28 hidden sm:block">
                <img
                  src={card.img}
                  alt={card.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>

              {/* body */}
              <div className="p-6 sm:pl-36">
                <span className="inline-block text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {card.tag}
                </span>
                <h3 className="mt-3 text-2xl font-bold">{card.title}</h3>
                <p className="mt-2 text-gray-600">
                  {card.text}
                </p>
              </div>

              {/* glow leggero al passaggio */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-transparent blur-xl" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#contatti"
            className="btn-primary inline-flex items-center gap-2"
          >
            Prenota una prova gratuita
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
