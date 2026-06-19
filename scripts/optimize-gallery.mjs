import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const GALLERY = resolve(fileURLToPath(import.meta.url), '../../src/assets/gallery')
const MAX_WIDTH = 1200
const QUALITY = 78

const files = (await readdir(GALLERY)).filter(f => /\.(jpg|jpeg)$/i.test(f))
console.log(`Optimizing ${files.length} images in ${GALLERY}\n`)

let totalBefore = 0, totalAfter = 0

for (const file of files) {
  const path = join(GALLERY, file)
  const before = (await stat(path)).size

  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(path + '.tmp')

  const after = (await stat(path + '.tmp')).size

  // Only replace if we actually saved space (sharp always should, but safety net)
  if (after < before) {
    const { rename } = await import('fs/promises')
    await rename(path + '.tmp', path)
    totalBefore += before
    totalAfter += after
    const saved = Math.round((1 - after / before) * 100)
    console.log(`  ${file}: ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB  (-${saved}%)`)
  } else {
    const { unlink } = await import('fs/promises')
    await unlink(path + '.tmp')
    console.log(`  ${file}: skipped (already optimal)`)
  }
}

const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)
const savePct = Math.round((1 - totalAfter / totalBefore) * 100)
console.log(`\nDone. Saved ${savedMB} MB total (${savePct}% reduction)`)
console.log(`Before: ${(totalBefore/1024/1024).toFixed(1)} MB → After: ${(totalAfter/1024/1024).toFixed(1)} MB`)
