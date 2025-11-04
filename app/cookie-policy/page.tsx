import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Tribù Studio',
  description: 'Informativa sui cookie utilizzati dal sito Tribù Studio',
  robots: 'noindex, nofollow'
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: 4 Novembre 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cosa sono i Cookie</h2>
            <p className="text-gray-700 leading-relaxed">
              I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell&apos;utente, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie possono essere utilizzati per diverse finalità, come l&apos;esecuzione di autenticazioni informatiche, il monitoraggio di sessioni e la memorizzazione di informazioni riguardanti le attività degli utenti che accedono ad un sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie utilizzati da questo sito</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Cookie Tecnici (Sempre Attivi)</h3>
            <p className="text-gray-700 leading-relaxed">
              Questi cookie sono strettamente necessari per il funzionamento del sito e non possono essere disabilitati. Vengono impostati solo in risposta ad azioni da te effettuate che costituiscono una richiesta di servizi, come l&apos;impostazione delle tue preferenze sulla privacy, il login o la compilazione di moduli.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Nome Cookie</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Finalità</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 text-gray-700">cc_cookie</td>
                    <td className="py-2 px-2 text-gray-700">Memorizza le preferenze sui cookie</td>
                    <td className="py-2 px-2 text-gray-700">6 mesi</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 text-gray-700">PHPSESSID</td>
                    <td className="py-2 px-2 text-gray-700">Gestione della sessione utente</td>
                    <td className="py-2 px-2 text-gray-700">Sessione</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">Cookie Analitici</h3>
            <p className="text-gray-700 leading-relaxed">
              Questi cookie ci permettono di contare le visite e le sorgenti di traffico, in modo da poter misurare e migliorare le prestazioni del nostro sito. Ci aiutano a sapere quali sono le pagine più e meno popolari e a capire come i visitatori navigano nel sito.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Puoi accettare o rifiutare questi cookie.</strong> Se li rifiuti, non sapremo quando hai visitato il nostro sito e non saremo in grado di monitorarne le prestazioni.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Nome Cookie</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Provider</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Finalità</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-900">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 text-gray-700">_ga</td>
                    <td className="py-2 px-2 text-gray-700">Google Analytics</td>
                    <td className="py-2 px-2 text-gray-700">Distingue gli utenti</td>
                    <td className="py-2 px-2 text-gray-700">2 anni</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-2 text-gray-700">_ga_*</td>
                    <td className="py-2 px-2 text-gray-700">Google Analytics</td>
                    <td className="py-2 px-2 text-gray-700">Mantiene lo stato della sessione</td>
                    <td className="py-2 px-2 text-gray-700">2 anni</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-sm text-blue-900">
                <strong>Google Analytics:</strong> Utilizziamo Google Analytics per analizzare il traffico del sito. 
                Google Analytics utilizza cookie per raccogliere informazioni in forma anonima e aggregata. 
                Per maggiori informazioni: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Google Privacy Policy</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie di Terze Parti</h2>
            <p className="text-gray-700 leading-relaxed">
              Il nostro sito potrebbe contenere collegamenti a siti web di terze parti. Non abbiamo alcun controllo sui cookie che potrebbero essere utilizzati da questi siti di terze parti. Per maggiori informazioni sui cookie di terze parti, ti invitiamo a consultare le rispettive politiche sulla privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Gestire i Cookie</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Tramite il nostro Banner</h3>
            <p className="text-gray-700 leading-relaxed">
              Puoi gestire le tue preferenze sui cookie in qualsiasi momento cliccando sul pulsante delle impostazioni cookie presente nel footer del sito o ricaricando la pagina e modificando le tue scelte nel banner che appare.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Tramite il Browser</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Puoi anche controllare e/o eliminare i cookie attraverso le impostazioni del tuo browser. Ecco i link alle istruzioni per i browser più comuni:
            </p>
            
            <ul className="space-y-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Safari (Mac)
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/it-it/HT201265" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Safari (iPhone/iPad)
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <p className="text-sm text-yellow-900">
                <strong>Attenzione:</strong> La disabilitazione di alcuni cookie tecnici potrebbe impedire il corretto funzionamento del sito.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aggiornamenti</h2>
            <p className="text-gray-700 leading-relaxed">
              Questa Cookie Policy può essere aggiornata periodicamente per riflettere modifiche nelle nostre pratiche relative ai cookie o per altri motivi operativi, legali o normativi. Ti invitiamo quindi a consultare regolarmente questa pagina.
            </p>
          </section>

          <section className="bg-gray-100 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hai domande?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Per qualsiasi domanda riguardo l&apos;uso dei cookie sul nostro sito, contattaci:
            </p>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Tribù Studio</strong></p>
              <p className="text-gray-700">Via Albere 27/B, 37138 Verona (VR)</p>
              <p className="text-gray-700">Email: <a href="mailto:info@tribustudio.it" className="text-blue-600 hover:underline">info@tribustudio.it</a></p>
              <p className="text-gray-700">Tel: <a href="tel:+393478881515" className="text-blue-600 hover:underline">347 888 1515</a></p>
            </div>
            <p className="text-gray-700 mt-4">
              Consulta anche la nostra <a href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}