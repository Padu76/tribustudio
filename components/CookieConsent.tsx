'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

export default function CookieBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box inline',
          position: 'bottom right'
        },
        preferencesModal: {
          layout: 'box'
        }
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true
        },
        analytics: {
          enabled: false
        }
      },

      language: {
        default: 'it',
        translations: {
          it: {
            consentModal: {
              title: 'Utilizziamo i cookie 🍪',
              description: 'Utilizziamo i cookie per garantire le funzionalità di base del sito e migliorare la tua esperienza online. Puoi scegliere di accettare o rifiutare ciascuna categoria quando vuoi.',
              acceptAllBtn: 'Accetta tutto',
              acceptNecessaryBtn: 'Rifiuta tutto',
              showPreferencesBtn: 'Gestisci preferenze',
              footer: '<a href="/privacy-policy">Privacy Policy</a>\n<a href="/cookie-policy">Cookie Policy</a>'
            },
            preferencesModal: {
              title: 'Gestisci le tue preferenze',
              acceptAllBtn: 'Accetta tutto',
              acceptNecessaryBtn: 'Rifiuta tutto',
              savePreferencesBtn: 'Salva preferenze',
              closeIconLabel: 'Chiudi',
              serviceCounterLabel: 'Servizio|Servizi',
              sections: [
                {
                  title: 'Utilizzo dei Cookie',
                  description: 'Utilizziamo i cookie per garantire le funzionalità di base del sito web e per migliorare la tua esperienza online. Puoi scegliere per ogni categoria di accettare o rifiutare quando vuoi.'
                },
                {
                  title: 'Cookie Strettamente Necessari <span class="pm__badge">Sempre Abilitati</span>',
                  description: 'Questi cookie sono essenziali per il corretto funzionamento del sito. Senza questi cookie il sito web non funzionerebbe correttamente.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Cookie Analitici',
                  description: 'Questi cookie ci permettono di contare le visite e le sorgenti di traffico, in modo da poter misurare e migliorare le prestazioni del nostro sito.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    headers: {
                      name: 'Nome',
                      domain: 'Dominio',
                      desc: 'Descrizione'
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: 'tribustudio.it',
                        desc: 'Google Analytics - Identificatore univoco'
                      },
                      {
                        name: '_ga_*',
                        domain: 'tribustudio.it',
                        desc: 'Google Analytics - Dati di sessione'
                      }
                    ]
                  }
                },
                {
                  title: 'Maggiori informazioni',
                  description: 'Per qualsiasi domanda riguardo la nostra politica sui cookie e le tue scelte, <a href="/contatti">contattaci</a>.'
                }
              ]
            }
          }
        }
      }
    })
  }, [])

  return null
}
