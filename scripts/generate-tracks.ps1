# scripts/generate-tracks.ps1
# Script PowerShell per generare tracce musicali via API
# Uso: .\scripts\generate-tracks.ps1 -Channel all -Count 2
#       .\scripts\generate-tracks.ps1 -Channel gym-energy -Count 1 -DurationMs 300000

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("gym-energy","coffee-chill","beauty-relax","lounge-bar","retail-background","all")]
    [string]$Channel,

    [int]$Count = 1,
    [int]$DurationMs = 180000
)

$API_URL = if ($env:SITE_URL) { $env:SITE_URL } else { "http://localhost:3000" }

# Carica SUPABASE_SERVICE_ROLE_KEY da .env.local
$ADMIN_KEY = $env:SUPABASE_SERVICE_ROLE_KEY
if (-not $ADMIN_KEY) {
    $envFile = Join-Path $PSScriptRoot ".." ".env.local"
    if (Test-Path $envFile) {
        $match = Select-String -Path $envFile -Pattern "^SUPABASE_SERVICE_ROLE_KEY=(.+)$"
        if ($match) {
            $ADMIN_KEY = $match.Matches.Groups[1].Value.Trim()
        }
    }
}

if (-not $ADMIN_KEY) {
    Write-Host "SUPABASE_SERVICE_ROLE_KEY non trovata. Imposta la variabile o crea .env.local" -ForegroundColor Red
    exit 1
}

function Generate-ForChannel {
    param([string]$ch)

    Write-Host ""
    Write-Host "Generazione $Count tracce per [$ch] (durata: ${DurationMs}ms)..." -ForegroundColor Cyan
    Write-Host ("=" * 50)

    $body = @{
        channel = $ch
        count = $Count
        duration_ms = $DurationMs
        force_instrumental = $false
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$API_URL/api/radio/generate" `
            -Method POST `
            -ContentType "application/json" `
            -Headers @{ "x-admin-key" = $ADMIN_KEY } `
            -Body $body `
            -TimeoutSec 600

        Write-Host "Successo!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5 | Write-Host
    }
    catch {
        Write-Host "Errore: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
    }
}

$allChannels = @("gym-energy", "coffee-chill", "beauty-relax", "lounge-bar", "retail-background")

if ($Channel -eq "all") {
    Write-Host "Generazione per TUTTI i canali ($Count tracce ciascuno)" -ForegroundColor Yellow
    foreach ($ch in $allChannels) {
        Generate-ForChannel -ch $ch
    }
    Write-Host ""
    Write-Host "Generazione completata per tutti i canali!" -ForegroundColor Green
}
else {
    Generate-ForChannel -ch $Channel
}
