/**
 * generate-sitemap.mjs — write public/sitemap.xml from the route table.
 *
 * Runs as part of `npm run build`, so the sitemap cannot drift from the routes
 * that actually exist: adding a row to src/lib/routes.js is enough.
 *
 * <lastmod> is the date of the build. That is honest for this site — the pages
 * are driven by live Firestore data, so their content genuinely does change
 * between deploys — and it avoids committing a hand-maintained date per route
 * that nobody would remember to update.
 */

import { writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

import { ROUTES } from '../src/lib/routes.js'

const ROOT   = resolve(fileURLToPath(import.meta.url), '../..')
const OUT    = join(ROOT, 'public/sitemap.xml')
const ORIGIN = 'https://nerfsg.com'

const lastmod = new Date().toISOString().slice(0, 10)

const urls = ROUTES.map(({ path, priority, changefreq }) =>
  [
    '  <url>',
    `    <loc>${ORIGIN}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

await writeFile(OUT, xml)
console.log(`sitemap: wrote ${ROUTES.length} URLs to ${OUT}`)
