'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, Scale, Ruler, Target, Flame, 
  Clock, Dumbbell, Apple, TrendingDown, TrendingUp,
  ChevronRight, RotateCcw, Zap, Heart, ArrowRight
} from 'lucide-react'

type Goal = 'dimagrire' | 'tonificare' | 'massa' | null
type Gender = 'uomo' | 'donna' | null
type ActivityLevel = 'sedentario' | 'leggero' | 'moderato' | 'attivo' | 'molto_attivo' | null

interface Results {
  bmr: number
  tdee: number
  targetCalories: number
  proteinGrams: number
  weeksToGoal: number
  workoutType: string
  workoutFrequency: string
  weeklyChange: number
  targetWeight: number
}

export default function CalcolatoreTraformazione() {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState<Gender>(null)
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [goal, setGoal] = useState<Goal>(null)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [showResults, setShowResults] = useState(false)

  const activityMultipliers = {
    sedentario: 1.2,
    leggero: 1.375,
    moderato: 1.55,
    attivo: 1.725,
    molto_attivo: 1.9
  }

  const activityLabels = {
    sedentario: { label: 'Sedentario', desc: 'Lavoro da scrivania, poco movimento' },
    leggero: { label: 'Leggermente attivo', desc: '1-2 allenamenti a settimana' },
    moderato: { label: 'Moderatamente attivo', desc: '3-4 allenamenti a settimana' },
    attivo: { label: 'Molto attivo', desc: '5-6 allenamenti a settimana' },
    molto_attivo: { label: 'Atleta', desc: 'Allenamento intenso quotidiano' }
  }

  const calculateResults = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseFloat(age)
    const tw = parseFloat(targetWeight)

    // BMR (Mifflin-St Jeor)
    let bmr: number
    if (gender === 'uomo') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161
    }

    // TDEE
    const tdee = bmr * activityMultipliers[activityLevel!]

    // Target calories based on goal
    let targetCalories: number
    let weeklyChange: number
    let workoutType: string
    let workoutFrequency: string

    if (goal === 'dimagrire') {
      targetCalories = tdee - 500 // Deficit 500 cal/giorno = ~0.5kg/settimana
      weeklyChange = -0.5
      workoutType = 'Cardio HIIT + Pesi'
      workoutFrequency = '4-5 sessioni/settimana'
    } else if (goal === 'massa') {
      targetCalories = tdee + 300 // Surplus 300 cal/giorno
      weeklyChange = 0.25
      workoutType = 'Forza + Ipertrofia'
      workoutFrequency = '4-5 sessioni/settimana'
    } else {
      targetCalories = tdee // Mantenimento per tonificare
      weeklyChange = 0
      workoutType = 'Funzionale + Pesi moderati'
      workoutFrequency = '3-4 sessioni/settimana'
    }

    // Protein (1.6-2g per kg peso corporeo)
    const proteinGrams = Math.round(w * 1.8)

    // Weeks to goal
    const weightDiff = Math.abs(tw - w)
    const weeksToGoal = goal === 'tonificare' 
      ? 12 // Standard 12 settimane per tonificazione
      : Math.round(weightDiff / Math.abs(weeklyChange))

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinGrams,
      weeksToGoal: Math.min(weeksToGoal, 52), // Max 1 anno
      workoutType,
      workoutFrequency,
      weeklyChange,
      targetWeight: tw
    })
    setShowResults(true)
  }

  const resetCalculator = () => {
    setStep(1)
    setGender(null)
    setAge('')
    setHeight('')
    setWeight('')
    setTargetWeight('')
    setGoal(null)
    setActivityLevel(null)
    setResults(null)
    setShowResults(false)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return gender !== null
      case 2: return age !== '' && parseInt(age) > 14 && parseInt(age) < 100
      case 3: return height !== '' && parseInt(height) > 100 && parseInt(height) < 250
      case 4: return weight !== '' && parseFloat(weight) > 30 && parseFloat(weight) < 300
      case 5: return goal !== null
      case 6: return targetWeight !== '' && parseFloat(targetWeight) > 30 && parseFloat(targetWeight) < 300
      case 7: return activityLevel !== null
      default: return false
    }
  }

  const totalSteps = 7

  return (
    <section id="calcolatore" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container-custom mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Strumento Gratuito
          </div>
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-white mb-4">
            Calcola la Tua <span className="text-orange-400">Trasformazione</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Scopri in quanto tempo puoi raggiungere il tuo obiettivo e qual è il piano perfetto per te
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-gray-700"
              >
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Step {step} di {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1: Gender */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Sei uomo o donna?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {(['uomo', 'donna'] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`p-6 rounded-2xl border-2 transition-all ${
                              gender === g 
                                ? 'border-orange-500 bg-orange-500/20' 
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800/50'
                            }`}
                          >
                            <div className="text-4xl mb-2">{g === 'uomo' ? '👨' : '👩'}</div>
                            <div className="text-white font-semibold capitalize">{g}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Age */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Quanti anni hai?</h3>
                      <div className="flex justify-center">
                        <div className="relative">
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="35"
                            className="w-32 text-center text-4xl font-bold bg-gray-900 border-2 border-gray-600 rounded-2xl py-4 text-white focus:border-orange-500 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">anni</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Height */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Quanto sei alto/a?</h3>
                      <div className="flex justify-center">
                        <div className="relative">
                          <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="175"
                            className="w-40 text-center text-4xl font-bold bg-gray-900 border-2 border-gray-600 rounded-2xl py-4 pl-12 text-white focus:border-orange-500 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Current Weight */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Qual è il tuo peso attuale?</h3>
                      <div className="flex justify-center">
                        <div className="relative">
                          <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                          <input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="80"
                            className="w-40 text-center text-4xl font-bold bg-gray-900 border-2 border-gray-600 rounded-2xl py-4 pl-12 text-white focus:border-orange-500 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Goal */}
                  {step === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Qual è il tuo obiettivo?</h3>
                      <div className="grid gap-3">
                        {[
                          { id: 'dimagrire', icon: TrendingDown, label: 'Dimagrire', desc: 'Perdere peso e grasso' },
                          { id: 'tonificare', icon: Zap, label: 'Tonificare', desc: 'Definizione muscolare' },
                          { id: 'massa', icon: TrendingUp, label: 'Mettere Massa', desc: 'Aumentare muscoli' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setGoal(item.id as Goal)}
                            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                              goal === item.id 
                                ? 'border-orange-500 bg-orange-500/20' 
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800/50'
                            }`}
                          >
                            <div className={`p-3 rounded-xl ${goal === item.id ? 'bg-orange-500' : 'bg-gray-700'}`}>
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-semibold">{item.label}</div>
                              <div className="text-gray-400 text-sm">{item.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Target Weight */}
                  {step === 6 && (
                    <motion.div
                      key="step6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">
                        {goal === 'dimagrire' ? 'Quanto vorresti pesare?' : 
                         goal === 'massa' ? 'Quale peso vuoi raggiungere?' :
                         'Qual è il tuo peso ideale?'}
                      </h3>
                      <div className="flex justify-center">
                        <div className="relative">
                          <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                          <input
                            type="number"
                            step="0.1"
                            value={targetWeight}
                            onChange={(e) => setTargetWeight(e.target.value)}
                            placeholder={goal === 'dimagrire' ? '70' : '85'}
                            className="w-40 text-center text-4xl font-bold bg-gray-900 border-2 border-gray-600 rounded-2xl py-4 pl-12 text-white focus:border-orange-500 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
                        </div>
                      </div>
                      <p className="text-center text-gray-400 text-sm">
                        Peso attuale: {weight} kg → Differenza: {targetWeight ? Math.abs(parseFloat(targetWeight) - parseFloat(weight)).toFixed(1) : '0'} kg
                      </p>
                    </motion.div>
                  )}

                  {/* Step 7: Activity Level */}
                  {step === 7 && (
                    <motion.div
                      key="step7"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-white text-center">Quanto sei attivo/a attualmente?</h3>
                      <div className="grid gap-2">
                        {(Object.keys(activityLabels) as ActivityLevel[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => setActivityLevel(level)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              activityLevel === level 
                                ? 'border-orange-500 bg-orange-500/20' 
                                : 'border-gray-600 hover:border-orange-400 bg-gray-800/50'
                            }`}
                          >
                            <div className="text-white font-semibold">{activityLabels[level!].label}</div>
                            <div className="text-gray-400 text-sm">{activityLabels[level!].desc}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      step === 1 
                        ? 'opacity-0 pointer-events-none' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ← Indietro
                  </button>
                  
                  {step < totalSteps ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canProceed()}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      Avanti <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={calculateResults}
                      disabled={!canProceed()}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Calcola <Calculator className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-8 border border-orange-500/30 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {results!.weeksToGoal} settimane
                  </h3>
                  <p className="text-xl text-gray-300">
                    per raggiungere <span className="text-orange-400 font-bold">{results!.targetWeight} kg</span>
                  </p>
                  <p className="text-gray-400 mt-2">
                    Partendo da {weight} kg → {goal === 'dimagrire' ? '-' : '+'}{Math.abs(parseFloat(weight) - results!.targetWeight).toFixed(1)} kg
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <Flame className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-3xl font-bold text-white">{results!.targetCalories}</div>
                    <div className="text-gray-400">kcal/giorno</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <Apple className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-3xl font-bold text-white">{results!.proteinGrams}g</div>
                    <div className="text-gray-400">proteine/giorno</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <Dumbbell className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-lg font-bold text-white">{results!.workoutType}</div>
                    <div className="text-gray-400">tipo allenamento</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <Clock className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="text-lg font-bold text-white">{results!.workoutFrequency}</div>
                    <div className="text-gray-400">frequenza</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center">
                  <h4 className="text-xl font-bold text-white mb-2">Vuoi iniziare il tuo percorso?</h4>
                  <p className="text-gray-400 mb-4">Prenota una consulenza gratuita e creiamo insieme il tuo piano personalizzato</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a 
                      href="#contatti"
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      Prenota Consulenza Gratuita <ArrowRight className="w-5 h-5" />
                    </a>
                    <button
                      onClick={resetCalculator}
                      className="px-6 py-4 border border-gray-600 rounded-xl font-semibold text-gray-300 flex items-center justify-center gap-2 hover:border-gray-500 transition-all"
                    >
                      <RotateCcw className="w-5 h-5" /> Ricalcola
                    </button>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-gray-500 text-sm">
                  * I risultati sono stime basate su formule scientifiche. I risultati reali possono variare in base a fattori individuali.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}