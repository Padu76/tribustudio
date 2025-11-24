'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, Clock, TrendingUp, Home, Building, 
  AlertCircle, Calendar, Dumbbell, Heart, Zap,
  User, Shield, Star, CheckCircle, ArrowRight,
  ChevronLeft, Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface QuizOption {
  id: string
  label: string
  icon: React.ReactNode
  description?: string
}

interface QuizQuestion {
  id: string
  question: string
  subtitle?: string
  options: QuizOption[]
}

interface QuizResults {
  profile: string
  description: string
  recommendations: string[]
  program: string
  cta: string
}

const questions: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'Qual è il tuo obiettivo principale?',
    subtitle: 'Scegli quello che ti motiva di più',
    options: [
      { id: 'dimagrire', label: 'Dimagrire', icon: <TrendingUp className="w-8 h-8" />, description: 'Perdere peso e definire' },
      { id: 'tonificare', label: 'Tonificare', icon: <Zap className="w-8 h-8" />, description: 'Corpo tonico e asciutto' },
      { id: 'forza', label: 'Forza', icon: <Dumbbell className="w-8 h-8" />, description: 'Diventare più forte' },
      { id: 'benessere', label: 'Postura & Benessere', icon: <Heart className="w-8 h-8" />, description: 'Stare meglio ogni giorno' },
    ]
  },
  {
    id: 'time',
    question: 'Quanto tempo puoi dedicare a settimana?',
    subtitle: 'Sii realistico, conta la costanza',
    options: [
      { id: '2h', label: '2 ore', icon: <Clock className="w-8 h-8" />, description: '2 sessioni da 1h' },
      { id: '3h', label: '3 ore', icon: <Clock className="w-8 h-8" />, description: '3 sessioni da 1h' },
      { id: '4h', label: '4 ore', icon: <Clock className="w-8 h-8" />, description: '4 sessioni da 1h' },
      { id: '5h+', label: '5+ ore', icon: <Clock className="w-8 h-8" />, description: 'Massimo impegno' },
    ]
  },
  {
    id: 'level',
    question: 'Qual è il tuo livello attuale?',
    subtitle: 'Non c\'è risposta giusta o sbagliata',
    options: [
      { id: 'zero', label: 'Mai allenato', icon: <User className="w-8 h-8" />, description: 'Parto da zero' },
      { id: 'principiante', label: 'Principiante', icon: <User className="w-8 h-8" />, description: 'Qualche esperienza' },
      { id: 'intermedio', label: 'Intermedio', icon: <User className="w-8 h-8" />, description: 'Mi alleno da tempo' },
      { id: 'avanzato', label: 'Avanzato', icon: <User className="w-8 h-8" />, description: 'Esperienza consolidata' },
    ]
  },
  {
    id: 'place',
    question: 'Dove preferisci allenarti?',
    subtitle: 'Possiamo combinare le opzioni',
    options: [
      { id: 'studio', label: 'Solo in Studio', icon: <Building className="w-8 h-8" />, description: 'Seguo in presenza' },
      { id: 'misto', label: 'Studio + Casa', icon: <Home className="w-8 h-8" />, description: 'Mix flessibile' },
      { id: 'casa', label: 'Principalmente Casa', icon: <Home className="w-8 h-8" />, description: 'Online coaching' },
    ]
  },
  {
    id: 'blocker',
    question: 'Cosa ti ha bloccato in passato?',
    subtitle: 'Capire gli ostacoli ci aiuta a superarli',
    options: [
      { id: 'tempo', label: 'Mancanza di tempo', icon: <Clock className="w-8 h-8" />, description: 'Vita troppo piena' },
      { id: 'motivazione', label: 'Poca motivazione', icon: <AlertCircle className="w-8 h-8" />, description: 'Difficile restare costanti' },
      { id: 'risultati', label: 'Risultati lenti', icon: <TrendingUp className="w-8 h-8" />, description: 'Non vedevo progressi' },
      { id: 'infortuni', label: 'Infortuni/Dolori', icon: <Shield className="w-8 h-8" />, description: 'Problemi fisici' },
    ]
  },
  {
    id: 'age',
    question: 'In che fascia d\'età sei?',
    subtitle: 'Personalizziamo l\'approccio',
    options: [
      { id: '18-30', label: '18-30 anni', icon: <User className="w-8 h-8" /> },
      { id: '31-40', label: '31-40 anni', icon: <User className="w-8 h-8" /> },
      { id: '41-50', label: '41-50 anni', icon: <User className="w-8 h-8" /> },
      { id: '50+', label: 'Oltre 50', icon: <User className="w-8 h-8" /> },
    ]
  },
  {
    id: 'style',
    question: 'Che tipo di allenamento preferisci?',
    subtitle: 'O che vorresti provare',
    options: [
      { id: 'pesi', label: 'Pesi', icon: <Dumbbell className="w-8 h-8" />, description: 'Sala pesi classica' },
      { id: 'funzionale', label: 'Funzionale', icon: <Zap className="w-8 h-8" />, description: 'Movimenti completi' },
      { id: 'cardio', label: 'Cardio', icon: <Heart className="w-8 h-8" />, description: 'Resistenza e fiato' },
      { id: 'mix', label: 'Mix di tutto', icon: <Star className="w-8 h-8" />, description: 'Varietà' },
    ]
  },
  {
    id: 'issues',
    question: 'Hai problemi fisici da considerare?',
    subtitle: 'È importante saperlo per programmare al meglio',
    options: [
      { id: 'no', label: 'Nessuno', icon: <CheckCircle className="w-8 h-8" />, description: 'Tutto ok' },
      { id: 'schiena', label: 'Schiena', icon: <AlertCircle className="w-8 h-8" />, description: 'Lombalgia, ernie, etc' },
      { id: 'ginocchia', label: 'Ginocchia', icon: <AlertCircle className="w-8 h-8" />, description: 'Dolori articolari' },
      { id: 'spalle', label: 'Spalle/Altro', icon: <AlertCircle className="w-8 h-8" />, description: 'Altri problemi' },
    ]
  },
  {
    id: 'need',
    question: 'Cosa cerchi in un trainer?',
    subtitle: 'Cosa ti farebbe sentire seguito al meglio',
    options: [
      { id: 'motivazione', label: 'Motivazione', icon: <Zap className="w-8 h-8" />, description: 'Qualcuno che mi spinga' },
      { id: 'competenza', label: 'Competenza tecnica', icon: <Target className="w-8 h-8" />, description: 'Preparazione seria' },
      { id: 'flessibilita', label: 'Flessibilità', icon: <Clock className="w-8 h-8" />, description: 'Si adatta a me' },
      { id: 'risultati', label: 'Risultati garantiti', icon: <TrendingUp className="w-8 h-8" />, description: 'Metodo che funziona' },
    ]
  },
  {
    id: 'timing',
    question: 'Quando vorresti iniziare?',
    subtitle: 'Non c\'è momento perfetto, ma c\'è il TUO momento',
    options: [
      { id: 'subito', label: 'Subito', icon: <Zap className="w-8 h-8" />, description: 'Sono pronto/a' },
      { id: 'settimana', label: 'Entro una settimana', icon: <Calendar className="w-8 h-8" />, description: 'Quasi pronto/a' },
      { id: 'mese', label: 'Entro un mese', icon: <Calendar className="w-8 h-8" />, description: 'Devo organizzarmi' },
      { id: 'valuto', label: 'Sto valutando', icon: <Target className="w-8 h-8" />, description: 'Voglio info prima' },
    ]
  },
]

function calculateResults(answers: Record<string, string>): QuizResults {
  const goal = answers.goal
  const level = answers.level
  const blocker = answers.blocker
  const issues = answers.issues

  let profile = '', description = '', program = '', cta = ''
  let recommendations: string[] = []

  if (goal === 'dimagrire') {
    profile = 'Il Trasformatore'
    description = 'Sei pronto per un cambiamento reale. Il tuo obiettivo è chiaro: perdere peso e ritrovare la forma. Con il giusto metodo e costanza, i risultati arriveranno.'
    if (level === 'zero' || level === 'principiante') {
      recommendations = ['Programma progressivo che parte dalle basi', 'Focus su movimento e abitudini alimentari', 'Allenamenti da 45-60 minuti, intensità crescente', 'Check settimanali per monitorare i progressi']
      program = 'Percorso Trasformazione 12 Settimane'
    } else {
      recommendations = ['Intensificazione strategica degli allenamenti', 'Protocolli metabolici avanzati', 'Nutrizione periodizzata', 'Tracking preciso della composizione corporea']
      program = 'Percorso Definizione Avanzata'
    }
  } else if (goal === 'tonificare') {
    profile = 'Lo Scultore'
    description = 'Vuoi un corpo tonico, definito, che ti faccia sentire bene quando ti guardi allo specchio. È un obiettivo raggiungibile con il giusto mix di allenamento e alimentazione.'
    recommendations = ['Allenamento con sovraccarichi mirati', 'Protocolli di ipertrofia funzionale', 'Cardio strategico (non eccessivo)', 'Piano alimentare per la ricomposizione']
    program = 'Percorso Tonificazione'
  } else if (goal === 'forza') {
    profile = 'Il Guerriero'
    description = 'Vuoi diventare più forte, punto. La forza è la base di tutto: migliora la postura, previene infortuni, aumenta il metabolismo. Ottima scelta.'
    recommendations = ['Programmazione basata sui fondamentali', 'Progressione lineare dei carichi', 'Tecnica impeccabile sui movimenti chiave', 'Recupero e alimentazione adeguati']
    program = 'Percorso Forza Fondamentale'
  } else {
    profile = 'Il Rinato'
    description = 'Stare bene è la priorità. Postura corretta, meno dolori, più energia. È il punto di partenza per tutto il resto, e spesso il più sottovalutato.'
    recommendations = ['Valutazione posturale approfondita', 'Esercizi correttivi personalizzati', 'Mobilità e stabilità articolare', 'Costruzione graduale della base atletica']
    program = 'Percorso Benessere & Postura'
  }

  if (blocker === 'tempo') recommendations.push('Allenamenti ottimizzati per il tuo tempo disponibile')
  else if (blocker === 'motivazione') recommendations.push('Sistema di accountability e check-in regolari')
  else if (blocker === 'infortuni' || issues !== 'no') recommendations.push('Approccio prudente con focus sulla prevenzione')

  cta = (answers.timing === 'subito' || answers.timing === 'settimana') ? 'Prenota la tua Consulenza Gratuita' : 'Richiedi Maggiori Informazioni'

  return { profile, description, recommendations, program, cta }
}

export default function TribuQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const totalQuestions = questions.length
  const progress = currentStep === 0 ? 0 : (currentStep / totalQuestions) * 100

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    setTimeout(() => {
      if (currentStep < totalQuestions) setCurrentStep(currentStep + 1)
      else setShowResults(true)
    }, 300)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
    else if (currentStep === 1) setCurrentStep(0)
  }

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const results = calculateResults(answers)

    try {
      const { error: supabaseError } = await supabase
        .from('quiz_leads')
        .insert({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim() || null,
          answers: answers,
          profile: results.profile,
          program: results.program,
          recommendations: results.recommendations,
          source: 'tribustudio-quiz',
          status: 'new'
        })

      if (supabaseError && supabaseError.code !== '23505') throw supabaseError
      setSubmitted(true)
    } catch (err: unknown) {
      console.error('Errore:', err)
      setError('Errore nell\'invio. Riprova o contattaci su WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  const results = showResults ? calculateResults(answers) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {currentStep > 0 && !showResults && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-700 z-50">
          <motion.div className="h-full bg-gradient-to-r from-orange-500 to-red-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold">Scopri il Tuo<span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Percorso Ideale</span></h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">Rispondi a 10 domande veloci e scopri quale programma è perfetto per te. Nessun impegno, solo chiarezza.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-400">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>2 minuti</span></div>
                <div className="flex items-center gap-2"><Target className="w-4 h-4" /><span>10 domande</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /><span>Risultato personalizzato</span></div>
              </div>
              <button onClick={() => setCurrentStep(1)} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-orange-500/25">
                Inizia il Quiz<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-gray-500">I tuoi dati sono al sicuro. Niente spam, promesso.</p>
            </motion.div>
          )}

          {currentStep > 0 && currentStep <= totalQuestions && !showResults && (
            <motion.div key={`q-${currentStep}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" />Indietro</button>
              <div className="text-sm text-gray-400">Domanda {currentStep} di {totalQuestions}</div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-bold">{questions[currentStep - 1].question}</h2>
                {questions[currentStep - 1].subtitle && <p className="text-gray-400 text-lg">{questions[currentStep - 1].subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentStep - 1].options.map((opt) => (
                  <motion.button key={opt.id} onClick={() => handleSelectOption(questions[currentStep - 1].id, opt.id)} className={`p-6 rounded-2xl border-2 text-left transition-all ${answers[questions[currentStep - 1].id] === opt.id ? 'border-orange-500 bg-orange-500/20' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${answers[questions[currentStep - 1].id] === opt.id ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{opt.icon}</div>
                      <div className="flex-1"><h3 className="text-lg font-semibold">{opt.label}</h3>{opt.description && <p className="text-sm text-gray-400 mt-1">{opt.description}</p>}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {showResults && results && !submitted && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium"><Star className="w-4 h-4" />Il tuo profilo</div>
                <h2 className="text-4xl md:text-5xl font-bold">{results.profile}</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">{results.description}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700">
                <h3 className="text-lg text-orange-400 font-medium mb-2">Percorso consigliato</h3>
                <p className="text-2xl font-bold mb-6">{results.program}</p>
                <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-4">Cosa includerà il tuo percorso:</h4>
                <ul className="space-y-3">{results.recommendations.map((rec, i) => <li key={i} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-gray-300">{rec}</span></li>)}</ul>
              </div>
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-2">Ricevi il tuo piano personalizzato</h3>
                <p className="text-gray-400 mb-6">Lascia i tuoi dati per ricevere il report completo e prenotare una consulenza gratuita.</p>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div><label className="block text-sm text-gray-400 mb-2">Nome *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Il tuo nome" /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Email *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500" placeholder="la.tua@email.com" /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Telefono (opzionale)</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500" placeholder="+39 333 1234567" /></div>
                  {error && <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm">{error}</div>}
                  <button type="submit" disabled={submitting || !name || !email} className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50">
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Invio...</> : <>{results.cta}<ArrowRight className="w-5 h-5" /></>}
                  </button>
                  <p className="text-xs text-gray-500 text-center">Cliccando accetti la nostra Privacy Policy. Niente spam.</p>
                </form>
              </div>
            </motion.div>
          )}

          {submitted && (
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-16">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"><CheckCircle className="w-10 h-10 text-green-500" /></div>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Grazie, {name.split(' ')[0]}!</h2>
                <p className="text-xl text-gray-300 max-w-xl mx-auto">Ti contatteremo entro 24 ore per fissare la tua consulenza gratuita.</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-gray-400 text-sm">Non vuoi aspettare? Scrivici subito su WhatsApp.</p>
                <a href="https://wa.me/393332847282" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full font-semibold transition-colors">Scrivici su WhatsApp</a>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300">Torna al sito<ArrowRight className="w-4 h-4" /></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}