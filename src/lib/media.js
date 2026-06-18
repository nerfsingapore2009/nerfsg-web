/**
 * media.js — central image source for the homepage.
 *
 * Photos are sourced, in priority order:
 *   1. Curated files bundled in src/assets/gallery (and /app for screenshots).
 *      Drop files in and they appear automatically — no code change needed
 *      (Vite picks them up via import.meta.glob at build time).
 *   2. Live Firestore `groupPhoto` images from past games.
 *   3. Seeded placeholders — DEV ONLY, so local previews are never empty.
 *      These are never shipped to production.
 *
 * Credit attribution: name a file `by-<handle>-NN.jpg`
 *   e.g. by-yalamphotos-01.jpg  ->  credit "@yalamphotos"
 */

const DEV = import.meta.env.DEV

/* Eagerly resolve bundled assets to their final URLs. Empty folders -> {} */
const galleryModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})
const appModules = import.meta.glob('../assets/app/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

function creditFromName(path) {
  const file = path.split('/').pop().replace(/\.[^.]+$/, '')
  const m = file.match(/by[-_]([a-z0-9._]+?)(?:[-_]\d+)?$/i)
  return m ? '@' + m[1] : null
}

function sortedEntries(modules) {
  return Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))
}

const bundledGallery = sortedEntries(galleryModules).map(([path, src]) => ({
  src,
  credit: creditFromName(path),
}))

const bundledScreens = sortedEntries(appModules).map(([, src]) => src)

/* Real game photos already flowing through Firestore. */
function firestorePhotos(all = []) {
  return all
    .filter(g => typeof g.groupPhoto === 'string' && g.groupPhoto.startsWith('http'))
    .map(g => ({ src: g.groupPhoto, credit: null, name: g.name || null }))
}

/* DEV-only seeded placeholders (deterministic, so layout is stable). */
const devLandscape = n =>
  Array.from({ length: n }, (_, i) => ({
    src: `https://picsum.photos/seed/nerfsg-field-${i + 1}/1200/800`,
    credit: null,
  }))
const devPortrait = n =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/nerfsg-app-${i + 1}/420/900`)

/**
 * Field action gallery — bundled first, then live Firestore photos.
 * Returns [] in production when nothing is available (caller hides section).
 */
export function getFieldGallery(all = [], max = 10) {
  const out = [...bundledGallery]
  if (out.length < max) {
    const seen = new Set(out.map(p => p.src))
    for (const p of firestorePhotos(all)) {
      if (out.length >= max) break
      if (!seen.has(p.src)) { out.push(p); seen.add(p.src) }
    }
  }
  if (out.length === 0 && DEV) return devLandscape(8)
  return out.slice(0, max)
}

/** Single wide photo for the hero backdrop, or null (caller uses gradient base). */
export function getHeroPhoto(all = []) {
  if (bundledGallery[0]) return bundledGallery[0].src
  const fs = firestorePhotos(all)
  if (fs[0]) return fs[0].src
  return DEV ? 'https://picsum.photos/seed/nerfsg-hero/1920/1080' : null
}

/** Portrait app screenshots for the carousel, or [] (caller shows faux fallback). */
export function getAppScreens() {
  if (bundledScreens.length) return bundledScreens
  return DEV ? devPortrait(3) : []
}
