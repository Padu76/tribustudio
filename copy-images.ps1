$src = 'E:\tribu-private-gym\public'
$dst = 'E:\tribustudio\.claude\worktrees\confident-swirles\public\images\private-gym'

$folders = @('studio', 'postazioni', 'attrezzature', 'spogliatoi', 'attesa', 'esterno')

foreach ($f in $folders) {
    $dstFolder = Join-Path $dst $f
    New-Item -ItemType Directory -Force -Path $dstFolder | Out-Null
    $srcFolder = Join-Path $src $f
    if (Test-Path $srcFolder) {
        Copy-Item -Path "$srcFolder\*" -Destination $dstFolder -Force
    }
}

Write-Host "COPY COMPLETE"
Get-ChildItem $dst -Recurse | Select-Object FullName
