'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const CONTACT_INFO = {
  phone: '3478881515',
  phoneDisplay: '347 888 1515',
  email: 'info@tribustudio.it',
  address: 'Via Albere 27/B – Verona',
  whatsappMessage: 'Ciao Tribù, vorrei informazioni!'
};

const ORARI = {
  weekdays: 'Lun–Ven: 7:00 – 21:00',
  saturday: 'Sabato: mattina'
};

export default function Contatti() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/39${CONTACT_INFO.phone}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contatti" className="section-padding bg-white" ref={ref}>
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Contattaci
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Siamo qui per aiutarti a iniziare il tuo percorso di trasformazione. 
            Scrivici su WhatsApp per una risposta immediata o passa a trovarci in studio!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info di contatto con CTA WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-montserrat font-bold mb-6">
              Vieni a trovarci
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Indirizzo</p>
                  <p className="text-gray">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Telefono</p>
                  <a href={`tel:+39${CONTACT_INFO.phone}`} className="text-gray hover:text-primary transition-colors">
                    {CONTACT_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray hover:text-primary transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Orari</p>
                  <p className="text-gray">{ORARI.weekdays}</p>
                  <p className="text-gray">{ORARI.saturday}</p>
                </div>
              </div>
            </div>

            {/* Grande CTA WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle size={32} />
                <div>
                  <h4 className="text-xl font-bold">Contattaci su WhatsApp</h4>
                  <p className="text-green-100">Risposta immediata garantita!</p>
                </div>
              </div>
              
              <button
                onClick={openWhatsApp}
                className="w-full bg-white text-green-600 py-4 px-6 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                Scrivici ora su WhatsApp
              </button>
              
              <p className="text-sm text-green-100 mt-3 text-center">
                Online dalle 7:00 alle 21:00
              </p>
            </motion.div>

            {/* Box parcheggio */}
            <div className="bg-primary/10 rounded-lg p-4 mt-6">
              <p className="text-center text-primary font-semibold">
                🚗 Parcheggio gratuito disponibile
              </p>
            </div>
          </motion.div>

          {/* Mappa Google */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-montserrat font-bold mb-6">
              Dove siamo
            </h3>
            
            {/* Mappa */}
            <div className="rounded-lg overflow-hidden shadow-lg h-[500px]">
              <iframe
                src={`https://maps.google.com/maps?q=45.43253383632741,10.975025538647104&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tribù Personal Training Studio Location"
              />
            </div>

            {/* Box "Come raggiungerci" */}
            <div className="bg-gray-light rounded-lg p-6">
              <h4 className="font-semibold mb-3">Come raggiungerci:</h4>
              <ul className="space-y-2 text-gray text-sm">
                <li>• A 2 minuti dalla tangenziale Nord</li>
                <li>• A 5 minuti dal centro</li>
                <li>• Fermata autobus linea 11 e 12 a 30 metri</li>
                <li>• Ampio parcheggio gratuito</li>
                <li>• Accessibile ai disabili</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Box finale con orari e CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-montserrat font-bold mb-4">
            Pronto a iniziare il tuo percorso?
          </h3>
          <p className="text-lg mb-6 opacity-95">
            Non aspettare domani per iniziare a cambiare la tua vita. 
            Contattaci ora e prenota la tua prima lezione gratuita con massaggio incluso!
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-3"
          >
            <MessageCircle size={24} />
            Prenota su WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
}