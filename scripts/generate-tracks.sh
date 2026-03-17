#!/bin/bash
# scripts/generate-tracks.sh
# Script per generare tracce musicali via API
# Uso: ./scripts/generate-tracks.sh <canale> [numero_tracce] [durata_ms]
#
# Esempi:
#   ./scripts/generate-tracks.sh gym-energy        # 1 traccia da 3 min
#   ./scripts/generate-tracks.sh coffee-chill 3     # 3 tracce da 3 min
#   ./scripts/generate-tracks.sh lounge-bar 2 300000  # 2 tracce da 5 min
#   ./scripts/generate-tracks.sh all 2              # 2 tracce per OGNI canale

set -e

# Configurazione
API_URL="${SITE_URL:-http://localhost:3000}"
ADMIN_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$ADMIN_KEY" ]; then
  # Prova a caricare da .env.local
  if [ -f .env.local ]; then
    ADMIN_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d'=' -f2)
  fi
fi

if [ -z "$ADMIN_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY non trovata. Imposta la variabile o crea .env.local"
  exit 1
fi

CHANNEL="${1}"
COUNT="${2:-1}"
DURATION="${3:-180000}"

if [ -z "$CHANNEL" ]; then
  echo "Uso: $0 <canale|all> [numero_tracce] [durata_ms]"
  echo ""
  echo "Canali disponibili:"
  echo "  gym-energy       - Musica energica per palestre"
  echo "  coffee-chill     - Atmosfera rilassata per caffetterie"
  echo "  beauty-relax     - Suoni rilassanti per spa"
  echo "  lounge-bar       - Vibes lounge per cocktail bar"
  echo "  retail-background - Sottofondo per negozi"
  echo "  all              - Genera per tutti i canali"
  exit 1
fi

generate_for_channel() {
  local ch="$1"
  echo ""
  echo "🎵 Generazione $COUNT tracce per [$ch] (durata: ${DURATION}ms)..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/radio/generate" \
    -H "Content-Type: application/json" \
    -H "x-admin-key: ${ADMIN_KEY}" \
    -d "{
      \"channel\": \"${ch}\",
      \"count\": ${COUNT},
      \"duration_ms\": ${DURATION},
      \"force_instrumental\": false
    }")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Successo!"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  else
    echo "❌ Errore HTTP $HTTP_CODE"
    echo "$BODY"
  fi
}

if [ "$CHANNEL" = "all" ]; then
  CHANNELS=("gym-energy" "coffee-chill" "beauty-relax" "lounge-bar" "retail-background")
  echo "🎶 Generazione per TUTTI i canali ($COUNT tracce ciascuno)"
  for ch in "${CHANNELS[@]}"; do
    generate_for_channel "$ch"
  done
  echo ""
  echo "🎉 Generazione completata per tutti i canali!"
else
  generate_for_channel "$CHANNEL"
fi
