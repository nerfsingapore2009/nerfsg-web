import { useCallback, useRef } from 'react'

/**
 * useParallax — subtle scroll-linked vertical drift for photos.
 *
 * Usage:
 *   const ref = useParallax(0.06)
 *   <div className="relative overflow-hidden">      // clipping frame
 *     <div ref={ref} className="absolute -inset-y-[8%] inset-x-0">
 *       <Photo ... />
 *     </div>
 *   </div>
 *
 * The ref goes on an element that is rendered TALLER than its clipping frame
 * (the -inset-y-[8%] overhang) so the drift never exposes edges. The hook
 * transforms that element but measures its PARENT (the frame), so the
 * feedback loop of measuring your own transform never happens.
 *
 * `factor` is the drift as a fraction of the frame height per viewport-height
 * of scroll (0.06 ≈ 6% drift). Shift is clamped to 7% of the frame height —
 * inside the 8% overhang.
 *
 * One shared scroll/resize listener + rAF drives every registered element;
 * an IntersectionObserver gates work to on-screen photos. prefers-reduced-
 * motion disables the whole thing (photos stay static).
 */

const items = new Map() // el -> { factor, frame, visible }
let rafPending = false
let listening = false

const reduced = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

const io = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        for (const item of items.values()) {
          if (item.frame === entry.target) item.visible = entry.isIntersecting
        }
      }
      schedule()
    }, { rootMargin: '10% 0px' })
  : null

function update() {
  const vh = window.innerHeight
  for (const [el, item] of items) {
    if (!item.visible) continue
    const rect = item.frame.getBoundingClientRect()
    const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2)
    const drift = -progress * item.factor * rect.height
    const max = rect.height * 0.07
    const shift = Math.max(-max, Math.min(max, drift))
    el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
  }
}

function schedule() {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => { rafPending = false; update() })
}

function startListening() {
  if (listening) return
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  listening = true
}

function stopListening() {
  if (!listening || items.size > 0) return
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  listening = false
}

/* If the user flips reduced-motion on mid-session, freeze everything. */
reduced?.addEventListener?.('change', e => {
  if (!e.matches) return
  for (const el of items.keys()) el.style.transform = ''
  items.clear()
  stopListening()
})

function register(el, factor) {
  if (reduced?.matches) return () => {}
  const frame = el.parentElement
  if (!frame) return () => {}
  items.set(el, { factor, frame, visible: false })
  io?.observe(frame)
  startListening()
  schedule()
  return () => {
    items.delete(el)
    io?.unobserve(frame)
    el.style.transform = ''
    stopListening()
  }
}

export function useParallax(factor = 0.06) {
  const cleanupRef = useRef(null)
  return useCallback(el => {
    cleanupRef.current?.()
    cleanupRef.current = el ? register(el, factor) : null
  }, [factor])
}
