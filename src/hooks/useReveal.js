import { useEffect } from 'react'

/**
 * Attaches one IntersectionObserver to every [data-reveal] element under the
 * page and toggles `.is-visible` (see `.reveal-up` in index.css) as they enter
 * the viewport — giving sections a staggered cinematic entrance on scroll.
 *
 * Pass a dependency (e.g. `loading`) so it re-scans once async content mounts.
 */
export function useReveal(dep) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!els.length) return

    // Respect reduced-motion: reveal everything immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}
