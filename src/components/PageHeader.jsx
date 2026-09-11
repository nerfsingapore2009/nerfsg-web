import Photo from './Photo'
import { useParallax } from '../hooks/useParallax'

/* Canonical inner-page header strip (see DESIGN.md → Page header strip).
   Keeps every page speaking the homepage's display-type language:
   red eyebrow label → condensed uppercase h1 → muted subtitle.

   With a `photo` (from lib/media.js, usually getPagePhoto) the strip goes
   cinematic: dark ink2 surface, full-bleed field photo with a bottom-heavy
   scrim, white type, photographer credit badge, and a subtle scroll parallax
   drift on the photo. Without one it stays the flat light strip. */
export default function PageHeader({ eyebrow, title, subtitle, photo, width = 'max-w-4xl', children }) {
  const parallaxRef = useParallax(0.06)

  if (!photo) {
    return (
      <section className="bg-surface border-b border-border">
        <div className={`${width} mx-auto px-5 lg:px-8 py-12 lg:py-16`}>
          {eyebrow && <p className="section-label">{eyebrow}</p>}
          <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
          {children}
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-ink2 border-b border-white/10">
      {/* Oversized photo layer: the -inset-y overhang gives the parallax
          drift room, so it never exposes an edge. */}
      <div ref={parallaxRef} className="absolute -inset-y-[8%] inset-x-0 will-change-transform" aria-hidden="true">
        <Photo
          photo={photo}
          alt=""
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-60"
          style={{ objectPosition: `center ${photo.focalY || '30%'}` }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,8,15,0.55) 0%, rgba(6,8,15,0.25) 45%, rgba(6,8,15,0.82) 100%),' +
            'linear-gradient(90deg, rgba(6,8,15,0.55) 0%, rgba(6,8,15,0.05) 65%)',
        }}
      />
      {photo.credit && <span className="credit-badge !left-auto right-2">📷 {photo.credit}</span>}

      <div className={`relative ${width} mx-auto px-5 lg:px-8 py-16 lg:py-24`}>
        {eyebrow && <p className="section-label section-label--on-dark">{eyebrow}</p>}
        <h1 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/70 mt-2 max-w-xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
