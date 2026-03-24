# Piano Restyle tribustudio.it

## Riepilogo modifiche richieste

### 1. MENU — Dropdown "Studio" + pulizia navigazione
**Attuale**: 9 voci separate (Chi Siamo, Servizi, Galleria, Come Funziona, Private Gym, Testimonianze, FAQ, Blog, Contatti)
**Nuovo**: Menu semplificato con dropdown "Studio"

**Struttura navigazione nuova:**
- **Studio** (dropdown con: Chi siamo, FAQ, Galleria, Servizi, Come funziona)
- **Servizi Fitness** → `/servizi-fitness` (nuova pagina)
- **Servizi Benessere** → `/servizi-benessere` (nuova pagina)
- **Private Gym** → `/private-gym` (esistente)
- **Blog** → `/blog` (esistente)
- **Prenota Ora** (CTA, su una riga)

**Rimossi dal menu:** Contatti (i CTA WhatsApp sono già nel sito), Testimonianze (resta nella homepage ma non nel menu)

**SEO boost**: Menu più pulito = crawl budget migliore, meno voci = più peso su ogni link. Le pagine dedicate `/servizi-fitness` e `/servizi-benessere` creano landing pages con keyword specifiche.

### 2. NUOVE PAGINE SERVIZI

#### `/servizi-fitness` — Pagina dedicata
Servizi inclusi:
- **Personal Training 1-to-1** (lezioni individuali con prezzi)
- **Lezioni di Coppia** (con prezzi)
- **Miniclass** (Functional, Posturale, Terza Età, **+ STRAFIT** nuovo!)
- **Private Gym** (link alla pagina esistente)
- **Coaching Online** (link a tornoinforma.it — spostato da pagina indipendente a sotto-servizio fitness)

SEO: Title "Servizi Fitness Verona | Personal Training, Miniclass, Private Gym - Tribù Studio"

#### `/servizi-benessere` — Pagina dedicata
Servizi inclusi:
- **Nutrizionista** (consulenza nutrizionale)
- **Massaggi** (recupero muscolare)

SEO: Title "Servizi Benessere Verona | Nutrizionista, Massaggi Professionali - Tribù Studio"

#### Miniclass STRAFIT (nuova)
- Aggiungere Strafit come quarta miniclass
- Descrizione: allenamento su cuscini instabili Strafit, unici a Verona
- Link reference: https://www.strafit.it/
- Traduzioni IT/EN

### 3. FOOTER — Dati legali
Aggiungere nella bottom bar:
```
Andrea Padoan
C.F. PDNNDR76D16L781P - P.IVA 04058990237
PEC: andreapadoan@pec.it
```

Aggiornare anche i link rapidi nel footer per riflettere la nuova struttura del menu.

### 4. LOGHI — Sfondo trasparente
I file attuali `logo-tribu.png` e `logo-tribu-white.png` hanno uno sfondo.
Devo rimuovere lo sfondo programmaticamente (sharp/imagemagick o script Python con Pillow/rembg).

### 5. SEZIONE SERVIZI HOMEPAGE
La sezione Servizi nella homepage resta come overview/preview ma con link alle due nuove pagine dedicate invece di mostrare tutto in modal. Diventa un "hub" che indirizza verso le due pagine.

## File da modificare

| File | Modifica |
|---|---|
| `components/ui/Header.tsx` | Dropdown "Studio", rimozione Contatti, nuove voci menu, fix "Prenota Ora" su una riga |
| `components/ui/Footer.tsx` | Dati legali, link aggiornati |
| `lib/i18n/translations.ts` | Nuove traduzioni per menu, Strafit, pagine servizi |
| `app/servizi-fitness/page.tsx` | **NUOVO** — Pagina servizi fitness con SEO metadata |
| `app/servizi-benessere/page.tsx` | **NUOVO** — Pagina servizi benessere con SEO metadata |
| `components/sections/Servizi.tsx` | Trasformare in hub con link alle pagine dedicate |
| `next.config.js` | Aggiungere rewrites per le nuove pagine se necessario |
| `public/sitemap.xml` | Si aggiorna automaticamente con next-sitemap |
| Logo files | Rimuovere sfondo con script Python (rembg) |

## Ordine di implementazione

1. Traduzioni (translations.ts) — base per tutto il resto
2. Header con dropdown Studio + menu pulito
3. Footer con dati legali
4. Pagina `/servizi-fitness` con Strafit
5. Pagina `/servizi-benessere`
6. Aggiornamento sezione Servizi homepage come hub
7. Rimozione sfondo loghi
8. next.config.js aggiornamento rewrites
9. Build e test
