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

import dimensions from './gallery-manifest.json'

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

/* Responsive variants + intrinsic dimensions, both produced by
   `npm run optimize:gallery`. Missing derivatives are not an error — photos
   simply fall back to the plain JPEG, so dropping a new file into
   assets/gallery/ still works without running the script first. */
const derivedModules = import.meta.glob('../assets/gallery/derived/*.{webp,avif}', {
  eager: true,
  import: 'default',
})

/* stem -> { avif: 'url 640w, url 1200w', webp: '...' } */
const derivedByStem = (() => {
  const out = {}
  for (const [path, url] of Object.entries(derivedModules)) {
    const m = path.match(/\/([^/]+)-(\d+)\.(webp|avif)$/)
    if (!m) continue
    const [, stem, width, format] = m
    out[stem] ??= {}
    out[stem][format] ??= []
    out[stem][format].push({ url, width: Number(width) })
  }
  for (const stem of Object.keys(out)) {
    for (const format of Object.keys(out[stem])) {
      out[stem][format] = out[stem][format]
        .sort((a, b) => a.width - b.width)
        .map(v => `${v.url} ${v.width}w`)
        .join(', ')
    }
  }
  return out
})()

/**
 * Per-photo vertical focal point (CSS %).
 * Key = filename without extension.
 * Default (unlisted) = '30%' — keeps heads in frame for most action shots.
 * '50%' = centre, '75%' = lower body/ground, '15%' = very top of frame.
 */
const FOCAL_Y = {
  // Adjust these after reviewing each photo.
  // Format: 'filename-without-extension': 'percentage'
  'by-yalamphotos-002': '25%',
  'by-yalamphotos-003': '30%',
  'by-yalamphotos-006': '35%',
  'by-yalamphotos-008': '20%',
  'by-yalamphotos-011': '30%',
  'by-yalamphotos-013': '25%',
  'by-yalamphotos-016': '30%',
  'by-yalamphotos-023': '20%',
  'by-yalamphotos-024': '30%',
  'by-yalamphotos-029': '25%',
}

function focalYFromPath(path) {
  const stem = path.split('/').pop().replace(/\.[^.]+$/, '')
  return FOCAL_Y[stem] || '30%'
}

function creditFromName(path) {
  const file = path.split('/').pop().replace(/\.[^.]+$/, '')
  const m = file.match(/by[-_]([a-z0-9._]+?)(?:[-_]\d+)?$/i)
  return m ? '@' + m[1] : null
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function sortedEntries(modules) {
  return Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))
}

function stemFromPath(path) {
  return path.split('/').pop().replace(/\.[^.]+$/, '')
}

/* Stable stem -> photo object lookup, built BEFORE the shuffle so pages can
   pin a specific photo (headers need a stable visual identity per page). */
const photosByStem = Object.fromEntries(
  sortedEntries(galleryModules).map(([path, src]) => {
    const stem = stemFromPath(path)
    const dim  = dimensions[stem]
    return [stem, {
      src,
      credit:  creditFromName(path),
      focalY:  focalYFromPath(path),
      sources: derivedByStem[stem] || null,
      width:   dim?.w ?? null,
      height:  dim?.h ?? null,
    }]
  })
)

const bundledGallery = shuffle(Object.values(photosByStem))

/**
 * Curated header/inline photo per page — hand-picked action shots so every
 * page opens on the game itself (not every gallery file qualifies; some are
 * social close-ups). Landscape stems for wide headers, portrait for columns.
 */
export const PAGE_PHOTOS = {
  events:      'by-yalamphotos-007', // two players aiming, NerfSG jerseys
  gallery:     'by-yalamphotos-001', // signature slide-out-of-cover grin
  leaderboard: 'by-yalamphotos-085', // sprinting between barrels
  roadmap:     'by-yalamphotos-100', // aiming down sights, looking ahead
  gameModes:   'by-yalamphotos-026', // firing over a barricade
  guides:      'by-yalamphotos-004', // lever-action in the rain
  faq:         'by-yalamphotos-120', // peeking around cover at the camera
  hvz:         'by-yalamphotos-053', // masked player stalking behind cover
  hvzPortrait: 'by-yalamphotos-024', // bare-handed tag dodge — very HvZ
  ruleset:     'by-yalamphotos-070', // kneeling, kitted, chrono-serious
  contact:     'by-yalamphotos-017', // smiling in the rain, mid-field
  firstTimer:  'by-yalamphotos-006', // grinning peek around the barricade
}

/** Photo object for a bundled gallery stem, or null. */
export function getPhotoByStem(stem) {
  return photosByStem[stem] || null
}

/** Curated photo for a PAGE_PHOTOS key, or null (caller falls back to flat UI). */
export function getPagePhoto(key) {
  return getPhotoByStem(PAGE_PHOTOS[key])
}

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
export function getFieldGallery(all = [], max = 50) {
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

/** Single wide photo for the hero backdrop — app event photos only, or null. */
export function getHeroPhoto(all = []) {
  const fs = firestorePhotos(all)
  if (fs[0]) return fs[0].src
  return DEV ? 'https://picsum.photos/seed/nerfsg-hero/1920/1080' : null
}

/** Portrait app screenshots for the carousel, or [] (caller shows faux fallback). */
export function getAppScreens() {
  if (bundledScreens.length) return bundledScreens
  return DEV ? devPortrait(3) : []
}
