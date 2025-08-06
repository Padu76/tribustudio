'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const CONTACT_INFO = {
  phone: '3478881515',
  phoneDisplay: '347 888 1515',
  email: 'info@tribustudio.it',
  address: 'Via Albere 27/B – Verona',
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

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula invio form (sostituisci con la tua logica di invio)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form dopo 5 secondi
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ nome: '', email: '', telefono: '', messaggio: '' });
    }, 5000);
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
            Scrivici o passa a trovarci in studio!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form di contatto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-montserrat font-bold mb-6">
              Invia un messaggio
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Messaggio inviato con successo!
                </h4>
                <p className="text-green-600">
                  Ti risponderemo il prima possibile.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray mb-2">
                    Nome e Cognome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mario Rossi"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="mario.rossi@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="333 1234567"
                  />
                </div>

                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-gray mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    value={formData.messaggio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Vorrei informazioni su..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Invia messaggio
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info di contatto e mappa */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-montserrat font-bold mb-6">
                Vieni a trovarci
              </h3>
              
              <div className="space-y-4 mb-6">
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
                    <p className="text-gray">{CONTACT_INFO.phoneDisplay}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray">{CONTACT_INFO.email}</p>
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
            </div>

            {/* Mappa Google con coordinate corrette */}
            <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
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

            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-center text-primary font-semibold">
                Parcheggio gratuito disponibile
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}