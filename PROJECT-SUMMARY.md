# Tribù Radio - Riassunto Progetto

## Cos'è
Piattaforma di **streaming radio con musica generata da AI** per attività commerciali (palestre, caffetterie, spa, lounge bar, negozi). Il sistema genera musica automaticamente tramite ElevenLabs e la riproduce via web player.

## Tech Stack
- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL + Storage per file audio)
- **AI Music:** ElevenLabs API (generazione musica + TTS per annunci DJ)
- **Pagamenti:** PayPal (piani Starter $9/mese, Business $19/mese)
- **Deploy:** Vercel → `https://tribu-radio.vercel.app`

## I 5 Canali Radio

| Canale | Genere | BPM | Energia |
|--------|--------|-----|---------|
| gym-energy | EDM/Electronic | 128-150 | 9/10 |
| coffee-chill | Lo-fi/Chill | 70-95 | 3/10 |
| beauty-relax | Ambient/Spa | 60-80 | 2/10 |
| lounge-bar | Lounge/Downtempo | 85-105 | 4/10 |
| retail-background | Pop/Easy Listening | 95-115 | 4/10 |

## Funzionalità Implementate

1. **Player completo** - Play/Pause/Stop, Prev/Next, seek bar, volume, loop (nessuno/tutti/singolo)
2. **Generazione AI** - Tracce da 3 min generate via ElevenLabs con prompt specifici per canale (5 varianti ciascuno)
3. **Sistema DJ virtuale** - Annunci vocali ogni 3 tracce con 4 voci ElevenLabs
4. **Admin** - Eliminazione tracce, spostamento tra canali
5. **Landing page** - Hero, features, pricing con PayPal
6. **Playlist shuffle** - Riproduzione casuale con Fisher-Yates

## Database (3 tabelle)

### tribu_radio_tracks
Tracce musicali: title, genre, channel, bpm, energy, duration_sec, file_url, prompt_used, is_published, quality_score

### tribu_radio_subscribers
Abbonati: email, business_name, plan (starter/business), is_active, stripe_customer_id, stripe_subscription_id

### tribu_radio_announcements
Annunci DJ: channel, text, voice_id, file_url, duration_sec, is_active

## API Endpoints (6)

| Metodo | Endpoint | Funzione |
|--------|----------|----------|
| GET | `/api/radio/channels` | Lista canali con conteggio tracce |
| GET | `/api/radio/tracks?channel=X` | Tracce random per canale |
| DELETE | `/api/radio/tracks/[id]` | Elimina traccia (soft delete) |
| PATCH | `/api/radio/tracks/[id]` | Sposta traccia su altro canale |
| POST | `/api/radio/generate` | Genera nuove tracce (auth admin) |
| POST | `/api/radio/announcements/generate` | Genera annunci DJ (auth admin) |

## Struttura Cartelle

```
app/                  → Pagine e API routes
components/radio/     → 5 componenti React (Player, Controls, NowPlaying, ChannelSelector, TrackList)
lib/radio/            → Logica business (types, constants, prompts, elevenlabs, tracks)
supabase/migrations/  → Schema DB (3 migration files)
scripts/              → Script generazione tracce (bash + PowerShell)
```

## Variabili d'Ambiente (.env.local)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
PAYPAL_PLAN_STARTER=
PAYPAL_PLAN_PRO=
PAYPAL_PLAN_POWER=

# App
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_HUB_URL=
NEXT_PUBLIC_TOOL_SLUG=
```

## Come Generare Tracce

Con il dev server attivo (`npm run dev`), da CMD Windows:

```cmd
set ADMIN_KEY=la-tua-SUPABASE_SERVICE_ROLE_KEY

curl -X POST http://localhost:3000/api/radio/generate -H "Content-Type: application/json" -H "x-admin-key: %ADMIN_KEY%" -d "{\"channel\":\"gym-energy\",\"count\":2,\"duration_ms\":180000}"
```

Canali disponibili: `gym-energy`, `coffee-chill`, `beauty-relax`, `lounge-bar`, `retail-background`

## Componenti React

1. **RadioPlayer** (`components/radio/RadioPlayer.tsx`) - Orchestratore principale, gestisce stato player, audio element, coda tracce, annunci DJ
2. **PlayerControls** (`components/radio/PlayerControls.tsx`) - Controlli playback, seek bar, volume, loop
3. **NowPlaying** (`components/radio/NowPlaying.tsx`) - Display traccia corrente con titolo, genere, BPM
4. **ChannelSelector** (`components/radio/ChannelSelector.tsx`) - Griglia selezione canali con icone
5. **TrackList** (`components/radio/TrackList.tsx`) - Playlist scrollabile con controlli admin (elimina, sposta)

## Librerie Principali

- `next@15.4.8` - Framework
- `react@19.1.0` - UI
- `@supabase/supabase-js@^2.86.0` - Database client
- `lucide-react@^0.536.0` - Icone
- `tailwindcss@^3.4.1` - CSS
- `tsx@^4.21.0` - Esecuzione script TypeScript
- `dotenv@^17.3.1` - Variabili ambiente
