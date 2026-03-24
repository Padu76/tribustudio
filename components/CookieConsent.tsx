'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

// Carica Google Analytics dinamicamente
function loadGA() {
  if (document.getElementById('ga-script')) return;
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3N4DQKS9KK';
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) { window.dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', 'G-3N4DQKS9KK');
  };
}

// Carica Umami analytics dinamicamente
function loadUmami() {
  if (document.getElementById('umami-script')) return;
  const script = document.createElement('script');
  script.id = 'umami-script';
  script.src = 'https://analytics.tornoinforma.it/script.js';
  script.defer = true;
  script.dataset.websiteId = 'be4aeae8-effd-4717-8cc3-ba88e7d50332';
  document.head.appendChild(script);
}

// Rimuove script e cookie analytics
function removeAnalytics() {
  document.getElementById('ga-script')?.remove();
  document.getElementById('umami-script')?.remove();
  // Rimuovi cookie GA
  document.cookie.split(';').forEach((c) => {
    const name = c.trim().split('=')[0];
    if (name.startsWith('_ga')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.tribustudio.it`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
}

// Tipo globale per window.dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

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

      // Callback quando l'utente accetta/rifiuta
      onConsent: () => {
        if (CookieConsent.acceptedCategory('analytics')) {
          loadGA();
          loadUmami();
        }
      },

      onChange: () => {
        if (CookieConsent.acceptedCategory('analytics')) {
          loadGA();
          loadUmami();
        } else {
          removeAnalytics();
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
