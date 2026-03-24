// lib/i18n/translations.ts
// Sistema traduzioni IT/EN per tribustudio.it

export type Locale = "it" | "en";

export const translations = {
  // ===== HEADER & NAV =====
  nav: {
    studio: { it: "Studio", en: "Studio" },
    chiSiamo: { it: "Chi siamo", en: "About Us" },
    servizi: { it: "Servizi", en: "Services" },
    galleria: { it: "Galleria", en: "Gallery" },
    comeFunziona: { it: "Come funziona", en: "How It Works" },
    serviziFitness: { it: "Servizi Fitness", en: "Fitness Services" },
    serviziBenessere: { it: "Servizi Benessere", en: "Wellness Services" },
    privateGym: { it: "Private Gym", en: "Private Gym" },
    testimonianze: { it: "Testimonianze", en: "Testimonials" },
    faq: { it: "FAQ", en: "FAQ" },
    quiz: { it: "Quiz Percorso", en: "Path Quiz" },
    blog: { it: "Blog", en: "Blog" },
    contatti: { it: "Contatti", en: "Contact" },
    prenota: { it: "PRENOTA ORA", en: "BOOK NOW" },
    nuovo: { it: "NUOVO", en: "NEW" },
    apriMenu: { it: "Apri menu", en: "Open menu" },
    chiudiMenu: { it: "Chiudi menu", en: "Close menu" },
  },

  // ===== HERO =====
  hero: {
    eyebrow: { it: "TRASFORMA IL TUO CORPO", en: "TRANSFORM YOUR BODY" },
    title1: { it: "Allenati, mangia bene", en: "Train, eat well" },
    titleHighlight: { it: "e vivi meglio", en: "and live better" },
    subtitle: {
      it: "Allenarsi con un personal trainer significa trovare la giusta motivazione ed ottimizzare il tuo tempo. Inizia oggi il tuo percorso su misura con un professionista al tuo fianco.",
      en: "Training with a personal trainer means finding the right motivation and making the most of your time. Start your tailored journey today with a professional by your side.",
    },
    cta: { it: "Prenota la tua prima lezione", en: "Book your first session" },
    stat1: { it: "Clienti Soddisfatti", en: "Satisfied Clients" },
    stat2: { it: "Anni Esperienza", en: "Years of Experience" },
    stat3: { it: "Sessioni Complete", en: "Sessions Completed" },
    scrollText: { it: "Scorri per scoprire", en: "Scroll to discover" },
  },

  // ===== CHI SIAMO =====
  chiSiamo: {
    eyebrow: { it: "Chi Siamo", en: "About Us" },
    title: { it: "La tua trasformazione inizia qui", en: "Your transformation starts here" },
    titleHighlight: { it: "trasformazione", en: "transformation" },
    text1: {
      it: "Crediamo in un mondo in cui aiutiamo le persone ad essere la migliore versione di sé stesse. Affrontiamo con loro la battaglia più difficile: credere in sé stessi e sentirsi bene nel proprio corpo.",
      en: "We believe in a world where we help people become the best version of themselves. We face the toughest challenge alongside them: believing in yourself and feeling great in your own body.",
    },
    text2: {
      it: "Allenarsi con noi non è solo allenamento: è motivazione, supporto e risultati concreti.",
      en: "Training with us is not just a workout: it's motivation, support, and real results.",
    },
    // Valori (4 items)
    value1Title: { it: "Personal Training su misura", en: "Tailored Personal Training" },
    value1Desc: { it: "Ogni allenamento è personalizzato sui tuoi obiettivi", en: "Every workout is customized to your goals" },
    value2Title: { it: "Nutrizione e benessere", en: "Nutrition & Wellness" },
    value2Desc: { it: "Approccio completo per risultati duraturi", en: "A comprehensive approach for lasting results" },
    value3Title: { it: "Recupero e massaggi", en: "Recovery & Massage" },
    value3Desc: { it: "Tecniche professionali per il tuo recupero", en: "Professional techniques for your recovery" },
    value4Title: { it: "Coaching online", en: "Online Coaching" },
    value4Desc: { it: "Supporto costante ovunque tu sia", en: "Constant support wherever you are" },
    // Parallax section
    parallaxTitle: {
      it: "Non una semplice palestra, ma il tuo studio personale",
      en: "Not just a gym, but your personal studio",
    },
    parallaxText: {
      it: "Uno spazio esclusivo dove ogni dettaglio è pensato per il tuo benessere. Attrezzature di ultima generazione, ambiente climatizzato e la privacy che meriti.",
      en: "An exclusive space where every detail is designed for your well-being. State-of-the-art equipment, climate-controlled environment, and the privacy you deserve.",
    },
    parallaxCta: { it: "Scopri i nostri servizi", en: "Discover our services" },
    // Features section
    featuresTitle: { it: "Perché scegliere Tribù", en: "Why choose Tribu" },
    featuresSubtitle: {
      it: "Quattro ragioni che fanno la differenza nel tuo percorso di trasformazione",
      en: "Four reasons that make the difference in your transformation journey",
    },
    feature1Title: { it: "Trainer Certificati", en: "Certified Trainers" },
    feature1Desc: {
      it: "Solo professionisti qualificati e in continuo aggiornamento",
      en: "Only qualified professionals with ongoing training",
    },
    feature2Title: { it: "Flessibilità Oraria", en: "Flexible Scheduling" },
    feature2Desc: {
      it: "Prenota quando vuoi, dalle 7:00 alle 21:00",
      en: "Book whenever you want, from 7:00 AM to 9:00 PM",
    },
    feature3Title: { it: "Risultati Garantiti", en: "Guaranteed Results" },
    feature3Desc: {
      it: "Metodo testato su oltre 1200 clienti soddisfatti",
      en: "A method tested on over 1,200 satisfied clients",
    },
    feature4Title: { it: "Approccio Innovativo", en: "Innovative Approach" },
    feature4Desc: {
      it: "Tecniche all'avanguardia e attrezzature moderne",
      en: "Cutting-edge techniques and modern equipment",
    },
  },

  // ===== SERVIZI =====
  servizi: {
    title: { it: "I Nostri Servizi", en: "Our Services" },
    subtitle: {
      it: "Scegli il percorso più adatto a te. Ogni servizio è pensato per offrirti il massimo supporto nel raggiungimento dei tuoi obiettivi.",
      en: "Choose the path that suits you best. Every service is designed to give you the greatest support in reaching your goals.",
    },
    // Servizio 1 - Lezioni Individuali
    individualeTitle: { it: "Lezioni Individuali", en: "Private Sessions" },
    individualeDesc: { it: "Allenamenti 1-to-1 per risultati massimi", en: "One-on-one training for maximum results" },
    individualeDetails: {
      it: "Allenamento completamente personalizzato con un personal trainer dedicato esclusivamente a te. Massima attenzione, correzione immediata della tecnica e progressi rapidi.",
      en: "Fully personalized training with a personal trainer dedicated exclusively to you. Maximum attention, immediate technique correction, and rapid progress.",
    },
    // Servizio 2 - Lezioni di Coppia
    coppiaTitle: { it: "Lezioni di Coppia", en: "Partner Sessions" },
    coppiaDesc: { it: "Allenati con un amico/a e condividi motivazione", en: "Train with a friend and share the motivation" },
    coppiaDetails: {
      it: "Perfetto per chi vuole allenarsi con un partner. Motivazione reciproca, divertimento e risparmio, mantenendo sempre la supervisione professionale.",
      en: "Perfect for those who want to train with a partner. Mutual motivation, fun, and savings, while always maintaining professional supervision.",
    },
    // Servizio 3 - Miniclass
    miniclassTitle: { it: "Miniclass (3-5 persone)", en: "Miniclass (3-5 people)" },
    miniclassDesc: {
      it: "Functional, Posturale e Terza Età - Gruppi ristretti con orari fissi",
      en: "Functional, Postural & Senior Fitness - Small groups with fixed schedules",
    },
    miniclassDetails: {
      it: "Il giusto equilibrio tra personalizzazione e dinamica di gruppo. Ideale per chi cerca motivazione e socialità senza rinunciare alla qualità.",
      en: "The perfect balance between personalization and group dynamics. Ideal for those seeking motivation and social interaction without sacrificing quality.",
    },
    miniclassFunctional: { it: "Functional Training", en: "Functional Training" },
    miniclassPosturale: { it: "Posturale", en: "Postural Training" },
    miniclassTerzaEta: { it: "Ginnastica Terza Età", en: "Senior Fitness" },
    miniclassDolceTerzaEta: { it: "Ginnastica Dolce Terza Età", en: "Gentle Senior Fitness" },
    miniclassFunctionalDesc: {
      it: "Allenamento funzionale ad alta intensità per migliorare forza, resistenza e coordinazione.",
      en: "High-intensity functional training to improve strength, endurance, and coordination.",
    },
    miniclassPosturaleDesc: {
      it: "Esercizi mirati per migliorare la postura, ridurre tensioni e prevenire dolori.",
      en: "Targeted exercises to improve posture, reduce tension, and prevent pain.",
    },
    miniclassTerzaEtaDesc: {
      it: "Ginnastica leggera con obiettivo di recuperare e mantenere la muscolatura. Fai il primo passo verso una nuova vita piena di energia ed indipendente!",
      en: "Gentle exercise aimed at recovering and maintaining muscle tone. Take the first step toward a new life full of energy and independence!",
    },
    // Miniclass Strafit
    miniclassStrafit: { it: "Strafit", en: "Strafit" },
    miniclassStrafitDesc: {
      it: "Allenamento su cuscini instabili Strafit: migliora equilibrio, propriocezione e tonificazione profonda. Unici a Verona ad offrire questa disciplina innovativa!",
      en: "Training on unstable Strafit cushions: improves balance, proprioception, and deep toning. The only studio in Verona offering this innovative discipline!",
    },
    miniclassStrafitBadge: { it: "Solo a Verona!", en: "Only in Verona!" },
    leNostreMiniclass: { it: "Le nostre Miniclass", en: "Our Miniclasses" },
    // Servizio 4 - Nutrizionista
    nutrizionTitle: { it: "Nutrizionista", en: "Nutritionist" },
    nutrizionDesc: {
      it: "Consulenza nutrizionale integrata all'allenamento",
      en: "Nutritional counseling integrated with training",
    },
    nutrizionDetails: {
      it: "Piano alimentare personalizzato che si integra perfettamente con il tuo programma di allenamento per risultati ottimali.",
      en: "A personalized meal plan that integrates seamlessly with your training program for optimal results.",
    },
    // Servizio 5 - Massaggi
    massaggiTitle: { it: "Massaggi", en: "Massage Therapy" },
    massaggiDesc: { it: "Recupero muscolare e benessere", en: "Muscle recovery and wellness" },
    massaggiDetails: {
      it: "Massaggi professionali per il recupero post-allenamento, riduzione delle tensioni muscolari e miglioramento del benessere generale.",
      en: "Professional massages for post-workout recovery, muscle tension relief, and overall well-being improvement.",
    },
    // Servizio 6 - Coaching Online
    onlineTitle: { it: "Coaching Online", en: "Online Coaching" },
    onlineDesc: { it: "Allenati ovunque con il nostro supporto", en: "Train anywhere with our support" },
    onlineDetails: {
      it: "Programmi di allenamento online personalizzati con supporto costante del tuo personal trainer, ovunque tu sia.",
      en: "Personalized online training programs with constant support from your personal trainer, wherever you are.",
    },
    // Labels
    aPartireDa: { it: "A partire da:", en: "Starting from:" },
    listinoPrezzi: { it: "Listino prezzi:", en: "Price list:" },
    perLezione: { it: "/lezione", en: "/session" },
    vaiAlSito: { it: "Vai al sito", en: "Visit website" },
    scopriDiPiu: { it: "Scopri di più", en: "Learn more" },
    prenotaOra: { it: "Prenota ora", en: "Book now" },
  },

  // ===== PAGINA SERVIZI FITNESS =====
  serviziFitness: {
    metaTitle: { it: "Servizi Fitness Verona | Personal Training, Miniclass, Private Gym - Tribù Studio", en: "Fitness Services Verona | Personal Training, Miniclass, Private Gym - Tribù Studio" },
    metaDesc: {
      it: "Scopri i servizi fitness di Tribù Studio a Verona: personal training individuale e di coppia, miniclass Functional, Posturale, Strafit e Terza Età, Private Gym e Coaching Online.",
      en: "Discover the fitness services at Tribù Studio in Verona: individual and partner personal training, Functional, Postural, Strafit and Senior miniclasses, Private Gym and Online Coaching.",
    },
    title: { it: "Servizi Fitness", en: "Fitness Services" },
    subtitle: {
      it: "Allenamento personalizzato per ogni obiettivo. Scegli il percorso fitness più adatto a te.",
      en: "Personalized training for every goal. Choose the fitness path that suits you best.",
    },
    scopriMiniclass: { it: "Scopri le Miniclass", en: "Discover Miniclasses" },
    scopriPrivateGym: { it: "Scopri Private Gym", en: "Discover Private Gym" },
    vaiCoachingOnline: { it: "Vai al Coaching Online", en: "Go to Online Coaching" },
    prenotaWhatsapp: { it: "Prenota su WhatsApp", en: "Book on WhatsApp" },
    orariMiniclass: { it: "Orari Miniclass", en: "Miniclass Schedules" },
  },

  // ===== PAGINA SERVIZI BENESSERE =====
  serviziBenessere: {
    metaTitle: { it: "Servizi Benessere Verona | Nutrizionista, Massaggi Professionali - Tribù Studio", en: "Wellness Services Verona | Nutritionist, Professional Massage - Tribù Studio" },
    metaDesc: {
      it: "Servizi benessere integrati all'allenamento: consulenza nutrizionale personalizzata e massaggi professionali per il recupero muscolare. Tribù Studio Verona.",
      en: "Wellness services integrated with training: personalized nutritional counseling and professional massages for muscle recovery. Tribù Studio Verona.",
    },
    title: { it: "Servizi Benessere", en: "Wellness Services" },
    subtitle: {
      it: "Completiamo il tuo percorso di trasformazione con nutrizione e recupero professionale.",
      en: "We complete your transformation journey with nutrition and professional recovery.",
    },
    prenotaWhatsapp: { it: "Prenota su WhatsApp", en: "Book on WhatsApp" },
  },

  // ===== HUB SERVIZI HOMEPAGE =====
  serviziHub: {
    title: { it: "I Nostri Servizi", en: "Our Services" },
    subtitle: {
      it: "Scegli il percorso più adatto a te. Ogni servizio è pensato per offrirti il massimo supporto nel raggiungimento dei tuoi obiettivi.",
      en: "Choose the path that suits you best. Every service is designed to give you the greatest support in reaching your goals.",
    },
    fitnessTitle: { it: "Servizi Fitness", en: "Fitness Services" },
    fitnessDesc: {
      it: "Personal training, miniclass, private gym e coaching online. Allenamento su misura per ogni obiettivo.",
      en: "Personal training, miniclasses, private gym and online coaching. Tailored training for every goal.",
    },
    benessereTitle: { it: "Servizi Benessere", en: "Wellness Services" },
    benessereDesc: {
      it: "Nutrizionista e massaggi professionali. Il complemento perfetto al tuo percorso fitness.",
      en: "Nutritionist and professional massages. The perfect complement to your fitness journey.",
    },
    scopri: { it: "Scopri tutti i servizi", en: "Discover all services" },
  },

  // ===== SERVIZI STUDIO (amenities) =====
  serviziStudio: {
    title: { it: "Lo Studio", en: "The Studio" },
    subtitle: {
      it: "Tutto quello che ti serve per allenarti in comfort e tranquillità, in un ambiente professionale e curato.",
      en: "Everything you need to train in comfort and peace, in a professional and well-maintained environment.",
    },
    docceTitle: { it: "Docce", en: "Showers" },
    docceDesc: { it: "Spogliatoi con docce calde disponibili", en: "Changing rooms with hot showers available" },
    spogliatoiTitle: { it: "Spogliatoi", en: "Changing Rooms" },
    spogliatoiDesc: { it: "Spogliatoi privati e attrezzati", en: "Private and fully equipped changing rooms" },
    accessoDisabiliTitle: { it: "Accesso Disabili", en: "Wheelchair Access" },
    accessoDisabiliDesc: { it: "Struttura accessibile a tutti", en: "Facility accessible to everyone" },
    parcheggioTitle: { it: "Parcheggio", en: "Parking" },
    parcheggioDesc: { it: "Ampio parcheggio gratuito", en: "Ample free parking" },
    wifiTitle: { it: "Wi-Fi Gratuito", en: "Free Wi-Fi" },
    wifiDesc: { it: "Connessione Wi-Fi disponibile", en: "Wi-Fi connection available" },
    acquaTitle: { it: "Acqua Ionizzata", en: "Ionized Water" },
    acquaDesc: { it: "Distributore acqua ionizzata", en: "Ionized water dispenser" },
    caffeTitle: { it: "Area Caffè", en: "Coffee Area" },
    caffeDesc: { it: "Zona relax con caffè disponibile", en: "Relaxation area with coffee available" },
  },

  // ===== COME FUNZIONA =====
  comeFunziona: {
    title: { it: "Il tuo percorso con Tribù", en: "Your journey with Tribu" },
    subtitle: {
      it: "Un metodo collaudato in 5 step per raggiungere i tuoi obiettivi in modo efficace e duraturo.",
      en: "A proven 5-step method to reach your goals effectively and for the long term.",
    },
    step1Title: { it: "Valutazione iniziale", en: "Initial assessment" },
    step1Desc: { it: "Analizziamo il tuo punto di partenza", en: "We analyze your starting point" },
    step2Title: { it: "Piano personalizzato", en: "Personalized plan" },
    step2Desc: { it: "Allenamento e nutrizione su misura", en: "Tailored training and nutrition" },
    step3Title: { it: "Allenamento guidato", en: "Guided training" },
    step3Desc: { it: "Seguito passo passo da un personal trainer", en: "Step by step guidance from a personal trainer" },
    step4Title: { it: "Recupero e benessere", en: "Recovery and wellness" },
    step4Desc: { it: "Massaggi e strategie di recupero", en: "Massages and recovery strategies" },
    step5Title: { it: "Risultati concreti", en: "Real results" },
    step5Desc: { it: "Progressi costanti e misurabili", en: "Consistent and measurable progress" },
    cta: { it: "Inizia oggi", en: "Start today" },
  },

  // ===== GALLERIA =====
  galleria: {
    eyebrow: { it: "Il Nostro Studio", en: "Our Studio" },
    title: { it: "Galleria Foto", en: "Photo Gallery" },
    titleHighlight: { it: "Foto", en: "Gallery" },
    subtitle: {
      it: "Uno spazio professionale progettato per il tuo allenamento. Attrezzature moderne, ambiente curato e tutto ciò che serve per i tuoi risultati.",
      en: "A professional space designed for your training. Modern equipment, a well-maintained environment, and everything you need for your results.",
    },
  },

  // ===== CONTATORE =====
  contatore: {
    clienti: { it: "Clienti seguiti", en: "Clients trained" },
    esperienza: { it: "Anni di esperienza", en: "Years of experience" },
    sessioni: { it: "Sessioni completate", en: "Sessions completed" },
    recensioni: { it: "Recensioni 5 stelle", en: "5-star reviews" },
  },

  // ===== TESTIMONIANZE =====
  testimonianze: {
    title: { it: "Cosa dicono di noi", en: "What our clients say" },
    subtitle: {
      it: "Le storie di successo dei nostri clienti parlano da sole",
      en: "Our clients' success stories speak for themselves",
    },
    bottomText: { it: "Leggi tutte le nostre recensioni su", en: "Read all our reviews on" },
  },

  // ===== FAQ =====
  faq: {
    title: { it: "Domande Frequenti", en: "Frequently Asked Questions" },
    subtitle: {
      it: "Trova le risposte alle domande più comuni sul nostro studio e i nostri servizi",
      en: "Find answers to the most common questions about our studio and services",
    },
    // FAQ 1
    q1: { it: "Serve esperienza per allenarmi con voi?", en: "Do I need prior experience to train with you?" },
    a1: {
      it: "No, gli allenamenti sono accessibili a tutti e personalizzati sul tuo livello. I nostri personal trainer adatteranno ogni esercizio alle tue capacità attuali, accompagnandoti in un percorso di miglioramento graduale e sicuro.",
      en: "No, our workouts are accessible to everyone and tailored to your fitness level. Our personal trainers will adapt every exercise to your current abilities, guiding you through a gradual and safe improvement journey.",
    },
    // FAQ 2
    q2: { it: "Quanto dura una lezione?", en: "How long is a session?" },
    a2: {
      it: "Circa 55 minuti. Questo tempo include riscaldamento, allenamento principale e defaticamento/stretching finale.",
      en: "About 55 minutes. This includes warm-up, the main workout, and cool-down/stretching at the end.",
    },
    // FAQ 3
    q3: {
      it: "Che differenza c'è tra Miniclass Functional e Posturale?",
      en: "What is the difference between Functional and Postural Miniclass?",
    },
    a3: {
      it: "Le Miniclass Functional sono allenamenti ad alta intensità focalizzati su forza, resistenza e coordinazione con esercizi funzionali. Le Miniclass Posturali invece si concentrano sul miglioramento della postura, riduzione delle tensioni muscolari e prevenzione dei dolori attraverso esercizi mirati e controllati. Entrambe sono in gruppi di massimo 5 persone.",
      en: "Functional Miniclasses are high-intensity workouts focused on strength, endurance, and coordination through functional exercises. Postural Miniclasses focus on improving posture, reducing muscle tension, and preventing pain through targeted and controlled exercises. Both are held in groups of up to 5 people.",
    },
    // FAQ 4
    q4: { it: "Quali sono gli orari delle Miniclass?", en: "What are the Miniclass schedules?" },
    a4: {
      it: "Miniclass Functional: Lunedì e Giovedì alle 17:30, Martedì e Sabato alle 10:00. Miniclass Posturale: Mercoledì alle 18:30 e Sabato alle 9:00. Tutti gli orari sono fissi per garantire continuità al gruppo.",
      en: "Functional Miniclass: Monday and Thursday at 5:30 PM, Tuesday and Saturday at 10:00 AM. Postural Miniclass: Wednesday at 6:30 PM and Saturday at 9:00 AM. All schedules are fixed to ensure group continuity.",
    },
    // FAQ 5
    q5: { it: "Posso fare solo miniclass?", en: "Can I attend miniclasses only?" },
    a5: {
      it: "Certo! Puoi scegliere tra lezioni individuali, di coppia o miniclass. Puoi anche combinare diversi tipi di allenamento in base alle tue esigenze.",
      en: "Of course! You can choose between private sessions, partner sessions, or miniclasses. You can also combine different types of training based on your needs.",
    },
    // FAQ 6
    q6: { it: "Come funzionano i pacchetti di lezioni?", en: "How do session packages work?" },
    a6: {
      it: "Offriamo pacchetti da 10, 20 o 30 lezioni con prezzi decrescenti. Non ci sono abbonamenti mensili vincolanti: acquisti un pacchetto e lo utilizzi secondo i tuoi tempi, prenotando le lezioni quando preferisci.",
      en: "We offer packages of 10, 20, or 30 sessions at decreasing rates. There are no binding monthly subscriptions: you purchase a package and use it at your own pace, booking sessions whenever you prefer.",
    },
    // FAQ 7
    q7: { it: "Avete consulenza nutrizionale?", en: "Do you offer nutritional counseling?" },
    a7: {
      it: "Sì, offriamo piani nutrizionali personalizzati integrati con il tuo programma di allenamento. Il nostro nutrizionista lavora in sinergia con i personal trainer per ottimizzare i tuoi risultati.",
      en: "Yes, we offer personalized nutrition plans integrated with your training program. Our nutritionist works in synergy with the personal trainers to optimize your results.",
    },
    // FAQ 8
    q8: { it: "Devo portare qualcosa per allenarmi?", en: "Do I need to bring anything to train?" },
    a8: {
      it: "Ti consigliamo di portare abbigliamento comodo, scarpe da ginnastica pulite, un asciugamano e una borraccia d'acqua. Tutta l'attrezzatura necessaria per l'allenamento è disponibile in studio.",
      en: "We recommend bringing comfortable clothing, clean trainers, a towel, and a water bottle. All the equipment needed for training is available at the studio.",
    },
    // FAQ 9
    q9: { it: "C'è il parcheggio?", en: "Is there parking?" },
    a9: {
      it: "Sì, abbiamo parcheggio gratuito disponibile per tutti i nostri clienti direttamente davanti allo studio.",
      en: "Yes, we have free parking available for all our clients right in front of the studio.",
    },
    // FAQ 10
    q10: { it: "Posso recuperare le lezioni perse?", en: "Can I make up missed sessions?" },
    a10: {
      it: "Per le lezioni individuali e di coppia, puoi disdire fino a 24 ore prima senza perdere la lezione. Per le miniclass, essendo a orari fissi con gruppi stabili, le lezioni perse non sono recuperabili per garantire la continuità del gruppo.",
      en: "For private and partner sessions, you can cancel up to 24 hours in advance without losing the session. For miniclasses, since they have fixed schedules with stable groups, missed sessions cannot be made up to ensure group continuity.",
    },
    bottomText: { it: "Non hai trovato la risposta che cercavi?", en: "Didn't find the answer you were looking for?" },
    bottomCta: { it: "Contattaci direttamente", en: "Contact us directly" },
  },

  // ===== CONTATTI =====
  contatti: {
    title: { it: "Contattaci", en: "Contact Us" },
    subtitle: {
      it: "Siamo qui per aiutarti a iniziare il tuo percorso di trasformazione. Scrivici su WhatsApp per una risposta immediata o passa a trovarci in studio!",
      en: "We are here to help you start your transformation journey. Message us on WhatsApp for an instant reply or come visit us at the studio!",
    },
    indirizzo: { it: "Indirizzo", en: "Address" },
    telefono: { it: "Telefono", en: "Phone" },
    email: { it: "Email", en: "Email" },
    orari: { it: "Orari", en: "Hours" },
    vieniATrovarci: { it: "Vieni a trovarci", en: "Come visit us" },
    doveSiamo: { it: "Dove siamo", en: "Where we are" },
    // WhatsApp CTA
    whatsappTitle: { it: "Contattaci su WhatsApp", en: "Contact us on WhatsApp" },
    whatsappSubtitle: { it: "Risposta immediata garantita!", en: "Instant reply guaranteed!" },
    whatsappCta: { it: "Scrivici ora su WhatsApp", en: "Message us on WhatsApp now" },
    whatsappOnline: { it: "Online dalle 7:00 alle 21:00", en: "Online from 7:00 AM to 9:00 PM" },
    // Parcheggio
    parcheggio: { it: "Parcheggio gratuito disponibile", en: "Free parking available" },
    // Direzioni
    direzioniTitle: { it: "Come raggiungerci:", en: "How to reach us:" },
    direzione1: { it: "A 2 minuti dalla tangenziale Nord", en: "2 minutes from the North ring road" },
    direzione2: { it: "A 5 minuti dal centro", en: "5 minutes from the city center" },
    direzione3: { it: "Fermata autobus linea 11 e 12 a 30 metri", en: "Bus stop lines 11 and 12 just 30 meters away" },
    direzione4: { it: "Ampio parcheggio gratuito", en: "Ample free parking" },
    direzione5: { it: "Accessibile ai disabili", en: "Wheelchair accessible" },
    // CTA finale
    finalCtaTitle: { it: "Pronto a iniziare il tuo percorso?", en: "Ready to start your journey?" },
    finalCtaText: {
      it: "Non aspettare domani per iniziare a cambiare la tua vita. Contattaci ora e prenota la tua prima lezione gratuita!",
      en: "Don't wait until tomorrow to start changing your life. Contact us now and book your first free session with a complimentary massage!",
    },
    finalCtaButton: { it: "Prenota su WhatsApp", en: "Book on WhatsApp" },
  },

  // ===== PERCHE TRIBU =====
  percheTributu: {
    title: { it: "No, non è una classica palestra", en: "No, this is not a typical gym" },
    titleHighlight: { it: "classica palestra", en: "typical gym" },
    text1: {
      it: "Tribù è uno studio di Personal Training dove facciamo solo lezioni individuali, di coppia e miniclass.",
      en: "Tribu is a Personal Training studio where we only offer private sessions, partner sessions, and miniclasses.",
    },
    text2: {
      it: "Nessun abbonamento, niente accesso libero: ogni sessione è su appuntamento e supervisionata da un Personal Trainer.",
      en: "No subscriptions, no open access: every session is by appointment and supervised by a Personal Trainer.",
    },
    highlight: {
      it: "Questo significa più personalizzazione, motivazione e risultati concreti.",
      en: "This means more personalization, motivation, and real results.",
    },
    benefit1: { it: "Nessun abbonamento vincolante", en: "No binding memberships" },
    benefit2: { it: "Ogni sessione su appuntamento", en: "Every session by appointment" },
    benefit3: { it: "Personal Trainer sempre presente", en: "Personal Trainer always present" },
    benefit4: { it: "Massima personalizzazione", en: "Maximum personalization" },
    benefit5: { it: "Ambiente esclusivo e riservato", en: "Exclusive and private environment" },
    benefit6: { it: "Risultati concreti e misurabili", en: "Real and measurable results" },
  },

  // ===== BROCHURE =====
  brochure: {
    title: { it: "Vuoi scoprire tutti i dettagli?", en: "Want to discover all the details?" },
    subtitle: {
      it: "Scarica la nostra brochure completa con programmi, prezzi e orari delle nostre miniclass. Tutto quello che ti serve per iniziare subito il tuo percorso con Tribù.",
      en: "Download our complete brochure with programs, pricing, and miniclass schedules. Everything you need to start your journey with Tribu right away.",
    },
    content1: { it: "Programmi dettagliati", en: "Detailed programs" },
    content2: { it: "Listino prezzi completo", en: "Full price list" },
    content3: { it: "Orari miniclass", en: "Miniclass schedules" },
    content4: { it: "Info e contatti", en: "Info & contacts" },
    cta: { it: "Scarica la brochure PDF", en: "Download the PDF brochure" },
    previewText: {
      it: "Clicca sull'anteprima per scaricare la brochure completa",
      en: "Click the preview to download the full brochure",
    },
  },

  // ===== FOOTER =====
  footer: {
    rights: { it: "Tutti i diritti riservati", en: "All rights reserved" },
    privacy: { it: "Privacy Policy", en: "Privacy Policy" },
    cookie: { it: "Cookie Policy", en: "Cookie Policy" },
  },

  // ===== COOKIE CONSENT =====
  cookie: {
    text: {
      it: "Questo sito utilizza cookie per migliorare la tua esperienza.",
      en: "This site uses cookies to improve your experience.",
    },
    accept: { it: "Accetta", en: "Accept" },
    reject: { it: "Rifiuta", en: "Reject" },
  },
} as const;

// Tipo helper per accedere alle traduzioni
export type TranslationKey = keyof typeof translations;
