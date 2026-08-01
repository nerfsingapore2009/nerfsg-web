/**
 * Photo.jsx — renders a gallery photo object from lib/media.js.
 *
 * Serves AVIF, then WebP, then the original JPEG, and always declares intrinsic
 * width/height so the page does not shift as photos resolve. Photos without
 * derived variants (Firestore group photos, dev placeholders) degrade to a
 * plain <img> — so this is safe to use everywhere media.js supplies photos.
 *
 * `sizes` matters: without it the browser assumes 100vw and downloads a
 * larger variant than the slot needs. Pass the CSS width the photo occupies.
 */
export default function Photo({
  photo,
  alt = '',
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  style,
}) {
  if (!photo) return null

  const img = (
    <img
      src={photo.src}
      alt={alt}
      width={photo.width || undefined}
      height={photo.height || undefined}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      className={className}
      style={style}
    />
  )

  if (!photo.sources) return img

  return (
    // display:contents keeps <picture> out of layout, so the <img> still sizes
    // against the figure/grid cell exactly as it did before this wrapper existed.
    <picture style={{ display: 'contents' }}>
      {photo.sources.avif && <source type="image/avif" srcSet={photo.sources.avif} sizes={sizes} />}
      {photo.sources.webp && <source type="image/webp" srcSet={photo.sources.webp} sizes={sizes} />}
      {img}
    </picture>
  )
}
