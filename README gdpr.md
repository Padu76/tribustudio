# 🍪 Pacchetto Cookie Consent GDPR Compliant

Pacchetto completo per gestire cookie consent, privacy policy e cookie policy per Tribù Studio.

## 📦 Contenuto del Pacchetto

```
cookie-consent/
├── components/
│   └── CookieConsent.tsx          # Componente banner cookie
├── app/
│   ├── privacy-policy/
│   │   └── page.tsx               # Pagina Privacy Policy
│   └── cookie-policy/
│       └── page.tsx               # Pagina Cookie Policy
└── styles/
    └── cookieconsent-custom.css   # Stili personalizzati
```

## 🚀 Installazione

### 1. Installa il pacchetto

```bash
npm install vanilla-cookieconsent
```

### 2. Copia i file nel tuo progetto

Copia i file nelle rispettive cartelle del tuo progetto:

- `components/CookieConsent.tsx` → `src/components/CookieConsent.tsx`
- `app/privacy-policy/page.tsx` → `src/app/privacy-policy/page.tsx`
- `app/cookie-policy/page.tsx` → `src/app/cookie-policy/page.tsx`
- `styles/cookieconsent-custom.css` → `src/styles/cookieconsent-custom.css`

### 3. Importa gli stili nel layout principale

Nel tuo `app/layout.tsx`:

```typescript
import '@/styles/cookieconsent-custom.css'
```

### 4. Aggiungi il componente CookieConsent al layout

Nel tuo `app/layout.tsx`:

```typescript
import CookieConsent from '@/components/CookieConsent'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
```

### 5. Aggiungi i link nel footer

Nel tuo componente Footer:

```typescript
<footer>
  {/* ... altro contenuto footer ... */}
  
  <div className="links-legali">
    <Link href="/privacy-policy">Privacy Policy</Link>
    <Link href="/cookie-policy">Cookie Policy</Link>
  </div>
</footer>
```

## 🎨 Personalizzazione

### Modificare i colori del banner

Modifica le variabili CSS in `cookieconsent-custom.css`:

```css
:root {
  --cc-btn-primary-bg: #TUO_COLORE;
  --cc-btn-primary-hover-bg: #TUO_COLORE_HOVER;
}
```

### Modificare i testi

I testi sono già in italiano e personalizzati per Tribù Studio. Per modificarli, edita il file `components/CookieConsent.tsx` nella sezione `translations`.

### Aggiungere altri cookie

Nel file `CookieConsent.tsx`, aggiungi nuove categorie:

```typescript
categories: {
  necessary: { enabled: true, readOnly: true },
  analytics: { enabled: false },
  marketing: { enabled: false }, // ← Nuova categoria
}
```

E aggiungi la traduzione corrispondente nella sezione `sections`.

## 📝 Configurazione Google Analytics

Se usi Google Analytics, aggiungi questo codice condizionale:

```typescript
// In components/CookieConsent.tsx, dopo CookieConsent.run()

if (CookieConsent.acceptedCategory('analytics')) {
  // Attiva Google Analytics
  window.gtag('consent', 'update', {
    'analytics_storage': 'granted'
  })
}
```

## ✅ Checklist GDPR

- ✅ Cookie banner con consenso esplicito
- ✅ Privacy Policy completa
- ✅ Cookie Policy dettagliata
- ✅ Gestione preferenze cookie
- ✅ Link facilmente accessibili
- ✅ Informazioni su durata e finalità
- ✅ Diritti dell'utente chiaramente spiegati

## 🔒 Conformità GDPR

Questo pacchetto è conforme al GDPR e include:

1. **Consenso esplicito**: L'utente deve accettare attivamente i cookie non necessari
2. **Informazioni chiare**: Privacy e Cookie Policy dettagliate
3. **Gestione preferenze**: L'utente può modificare le sue scelte in qualsiasi momento
4. **Cookie tecnici**: Sempre attivi e spiegati
5. **Cookie analitici**: Richiedono consenso esplicito
6. **Diritti utente**: Spiegati chiaramente nella Privacy Policy

## 🛠️ Troubleshooting

### Il banner non appare

Verifica che:
- Il pacchetto `vanilla-cookieconsent` sia installato
- Gli import CSS siano corretti
- Il componente sia incluso nel layout

### Gli stili non funzionano

Assicurati di aver importato `cookieconsent-custom.css` DOPO il CSS di default del pacchetto.

### Il link alla privacy non funziona

Verifica che le route `/privacy-policy` e `/cookie-policy` siano accessibili e che le pagine siano create correttamente.

## 📱 Responsive

Il banner è completamente responsive e si adatta automaticamente a:
- Desktop
- Tablet
- Mobile

## 🌐 Multi-lingua

Per aggiungere altre lingue, modifica la sezione `language` in `CookieConsent.tsx`:

```typescript
language: {
  default: 'it',
  translations: {
    it: { /* ... */ },
    en: { /* traduzioni inglese */ }
  }
}
```

## 📞 Supporto

Per problemi o domande:
- Email: info@tribustudio.it
- Tel: 347 888 1515

## 📄 Licenza

Questo pacchetto utilizza vanilla-cookieconsent (MIT License).

---

**Tribù Studio** - Via Albere 27/B, 37138 Verona (VR)
