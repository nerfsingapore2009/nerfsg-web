import { useMemo } from 'react'
import Photo from './Photo'
import { getFieldGallery } from '../lib/media'
import { useParallax } from '../hooks/useParallax'

function StripPhoto({ photo, factor }) {
  const ref = useParallax(factor)
  return (
    <figure className="relative overflow-hidden border border-border aspect-[4/3]">
      <div ref={ref} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
        <Photo
          photo={photo}
          alt="NerfSG game action"
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="w-full h-full object-cover"
          style={{ objectPosition: `center ${photo.focalY || '30%'}` }}
        />
      </div>
      {photo.credit && <figcaption className="credit-badge">📷 {photo.credit}</figcaption>}
    </figure>
  )
}

/* Alternating drift factors separate the photos into depth layers. */
const FACTORS = [0.05, 0.08, 0.06]

/**
 * PhotoStrip — a slim band of three field photos to break up long text pages.
 * Third photo is hidden on the smallest screens (2-up grid there).
 * `exclude` keeps it from repeating the page's header photo.
 */
export default function PhotoStrip({ exclude = null, className = '' }) {
  const photos = useMemo(() => {
    return getFieldGallery([], 12)
      .filter(p => p.src !== exclude?.src && p.width > p.height)
      .slice(0, 3)
  }, [exclude])

  if (photos.length < 3) return null

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`} data-reveal>
      {photos.map((p, i) => (
        <div key={p.src} className={i === 2 ? 'hidden sm:block' : ''}>
          <StripPhoto photo={p} factor={FACTORS[i]} />
        </div>
      ))}
    </div>
  )
}
