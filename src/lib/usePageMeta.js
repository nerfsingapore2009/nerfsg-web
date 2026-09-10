import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { metaForPath } from './routes'

const SITE_TITLE = 'NerfSG | Singapore Nerf Community'
const ORIGIN = 'https://nerfsg.com'

/* Upsert a <meta> / <link> in <head>, creating it if index.html has none.
   Returns the element so callers can restore or remove it. */
function head(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setMeta(name, content) {
  head(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  }).setAttribute('content', content)
}

function setProperty(property, content) {
  head(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', property)
    return m
  }).setAttribute('content', content)
}

/**
 * useRouteMeta — keeps <title>, description, canonical and robots in step with
 * the current route. Called once, from App, rather than page by page.
 *
 * Central beats per-page here for two reasons the old per-page usePageTitle
 * showed: Home never called it, so the tab kept the previous page's title
 * forever; and index.html's single canonical pointed every route at the
 * homepage, which tells crawlers the other thirteen pages are duplicates of /.
 *
 * This is still client-side, so it does not help the social-card crawlers that
 * never run JS — the static og: tags in index.html remain the shared-link story.
 * It does help Googlebot, which renders, and it fixes what a human sees in
 * their tab and their bookmarks.
 */
export function useRouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = metaForPath(pathname)

    document.title = meta?.title ? `${meta.title} | NerfSG` : SITE_TITLE

    if (meta) {
      setMeta('description', meta.description)
      head('link[rel="canonical"]', () => {
        const l = document.createElement('link')
        l.setAttribute('rel', 'canonical')
        return l
      }).setAttribute('href', `${ORIGIN}${meta.path}`)
      setProperty('og:url', `${ORIGIN}${meta.path}`)
      setMeta('robots', 'index, follow')
      return
    }

    /* Unlisted path — the 404 route. Vercel's SPA rewrite serves index.html
       with HTTP 200 for these, so a crawler sees a successful page rather than
       a missing one. noindex is what stops a soft 404 being indexed; it is the
       only signal available to a static SPA. */
    document.title = 'Page not found | NerfSG'
    setMeta('robots', 'noindex, follow')
    setMeta('description', 'This NerfSG page does not exist or has been moved.')

    // Drop the canonical rather than leaving index.html's homepage one in
    // place: a 404 that declares itself canonical-to-/ invites a crawler to
    // fold the bad URL into the homepage instead of dropping it.
    document.head.querySelector('link[rel="canonical"]')?.remove()
  }, [pathname])
}
