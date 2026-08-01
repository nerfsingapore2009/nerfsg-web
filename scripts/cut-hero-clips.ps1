# cut-hero-clips.ps1 — regenerate the hero background clips and poster.
#
# The hero used to stream one 18 MB source and seek to four timestamps, which
# cost an HTTP range request per jump and left the hero blank until `canplay`.
# This cuts those four moments into standalone faststart files plus a poster
# frame, so playback is sequential and first paint is immediate.
#
# Requires ffmpeg on PATH (winget install Gyan.FFmpeg).
# Run from the repo root:  pwsh scripts/cut-hero-clips.ps1

$ErrorActionPreference = 'Stop'

# Source lives outside public/ on purpose: it is a build input, not a runtime
# asset, and public/ is copied verbatim into every deploy.
$src = 'media-src/nerf-hvz-hero.mp4'
$out = 'public/video/hero'

# [startSec, durationSec] — curated highlight moments from the source video.
$clips = @(
  @(6.5, 16.2),   # "are you ready"
  @(38.5, 6.7),
  @(63.1, 5.9),
  @(85.2, 5.8)
)

if (-not (Test-Path $src)) { throw "Source video not found: $src" }
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

for ($i = 0; $i -lt $clips.Count; $i++) {
  $start = $clips[$i][0]
  $dur   = $clips[$i][1]
  $n     = $i + 1
  Write-Host "Cutting clip-$n (${start}s +${dur}s)..."
  ffmpeg -v error -y -ss $start -t $dur -i $src `
    -an -vf "scale=1280:-2" `
    -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p `
    -movflags +faststart "$out/clip-$n.mp4"
}

Write-Host 'Extracting poster frame...'
ffmpeg -v error -y -ss 1.0 -i "$out/clip-1.mp4" -frames:v 1 -q:v 4 "$out/poster.jpg"

Get-ChildItem $out | Select-Object Name, @{n = 'KB'; e = { [math]::Round($_.Length / 1KB, 1) } }
Write-Host ("Total: {0} KB" -f [math]::Round((Get-ChildItem $out | Measure-Object Length -Sum).Sum / 1KB, 1))
