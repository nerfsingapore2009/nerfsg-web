/**
 * optimize-gallery.mjs — prepare gallery photos for the web.
 *
 * Two passes:
 *   1. Compress originals in place to MAX_WIDTH / QUALITY jpeg.
 *      Idempotent: files already within budget are skipped, so re-running the
 *      script does not re-encode (and degrade) photos that are already done.
 *   2. Derive responsive WebP + AVIF variants into gallery/derived/, and write
 *      a manifest of intrinsic dimensions so <img> tags can declare width and
 *      height and stop the page shifting as 124 photos resolve.
 *
 * Run:  npm run optimize:gallery
 *
 * The derived/ folder is a build input, not source — it is safe to delete and
 * regenerate. media.js picks both up automatically via import.meta.glob.
 */

import sharp from 'sharp'
import { readdir, stat, mkdir, rename, unlink, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROOT     = resolve(fileURLToPath(import.meta.url), '../..')
const GALLERY  = join(ROOT, 'src/assets/gallery')
const DERIVED  = join(GALLERY, 'derived')
const MANIFEST = join(ROOT, 'src/lib/gallery-manifest.json')

const MAX_WIDTH = 1200
const QUALITY   = 78

/* Widths that matter: 640 covers phones at 1x-2x, 1200 covers everything else.
   More breakpoints would mean more build time for bytes nobody downloads. */
const WIDTHS = [640, 1200]

const stemOf = f => f.replace(/\.[^.]+$/, '')

const files = (await readdir(GALLERY)).filter(f => /\.(jpg|jpeg)$/i.test(f))
console.log(`Gallery: ${files.length} source images in ${GALLERY}\n`)

/* ── Pass 1: compress originals (idempotent) ─────────────────────────── */
console.log('Pass 1 — compressing originals')
let totalBefore = 0, totalAfter = 0, skipped = 0

for (const file of files) {
  const path   = join(GALLERY, file)
  const before = (await stat(path)).size
  const meta   = await sharp(path).metadata()

  // Already within budget — re-encoding would only lose quality.
  if (meta.width <= MAX_WIDTH && before <= 300 * 1024) {
    skipped++
    continue
  }

  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(path + '.tmp')

  const after = (await stat(path + '.tmp')).size

  if (after < before) {
    await rename(path + '.tmp', path)
    totalBefore += before
    totalAfter  += after
    console.log(`  ${file}: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`)
  } else {
    await unlink(path + '.tmp')
    skipped++
  }
}
console.log(`  ${skipped} already optimal, ${files.length - skipped} recompressed`)
if (totalBefore) {
  console.log(`  saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB`)
}

/* ── Pass 2: responsive derivatives + dimension manifest ─────────────── */
console.log('\nPass 2 — deriving responsive variants')
await mkdir(DERIVED, { recursive: true })

const manifest = {}
let derivedBytes = 0, built = 0, reused = 0

for (const file of files) {
  const path = join(GALLERY, file)
  const stem = stemOf(file)
  const meta = await sharp(path).metadata()

  manifest[stem] = { w: meta.width, h: meta.height }

  for (const width of WIDTHS) {
    // Never upscale: a 1200px source has no 1200px variant worth more than itself,
    // but we still emit it so srcset has a full-width modern-format candidate.
    if (width > meta.width) continue

    for (const [format, options] of [
      ['webp', { quality: 76, effort: 4 }],
      ['avif', { quality: 50, effort: 4 }],
    ]) {
      const out = join(DERIVED, `${stem}-${width}.${format}`)

      // Skip work already done — this runs on every build, and AVIF encoding
      // 124 photos from scratch each time would dominate build duration.
      let existing = null
      try { existing = await stat(out) } catch { /* not built yet */ }
      if (existing && existing.mtimeMs >= (await stat(path)).mtimeMs) {
        derivedBytes += existing.size
        reused++
        continue
      }

      await sharp(path).resize({ width, withoutEnlargement: true })[format](options).toFile(out)
      derivedBytes += (await stat(out)).size
      built++
    }
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

console.log(`  ${built} variants built, ${reused} reused from a previous run`)
console.log(`  wrote ${Object.keys(manifest).length} entries to ${MANIFEST}`)
console.log(`  derived variants total ${(derivedBytes / 1024 / 1024).toFixed(1)} MB on disk`)
console.log('\nDone.')
