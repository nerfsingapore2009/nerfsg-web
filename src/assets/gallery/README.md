# Field action photos

Drop landscape action photos here and they appear automatically on the homepage
(hero backdrop, "From the field" gallery, and game-mode card photos). No code
change needed — Vite picks them up at build time.

## Guidelines
- **Format:** `.jpg`, `.webp`, `.png`, or `.avif`
- **Size:** ≥ 1600px wide, landscape. Put your single strongest wide shot first
  (filenames load in alphabetical order; the first becomes the hero backdrop).
- **Credit:** name files `by-<handle>-NN.jpg` to auto-attach a photographer credit.
  - `by-yalamphotos-01.jpg`  → shows "📷 @yalamphotos"
  - `by-skijishoots-02.jpg`  → shows "📷 @skijishoots"
- Get permission from the photographer before bundling their work.

Until real photos are added, the homepage falls back to live Firestore game
photos, then to dev-only placeholders (never shipped to production).
