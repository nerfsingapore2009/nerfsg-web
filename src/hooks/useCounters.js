import { useState, useEffect } from 'react'

/* Animated counters, moved out of components/Hud.jsx.
 *
 * They lived alongside the HUD components, which meant that file exported both
 * components and non-components — enough to disable Fast Refresh for the whole
 * module. They are also the only two things in Hud.jsx anything still imports. */

/** Counts 0 → target once on mount, eased. */
export function useCountUp(target, dur = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const t0 = performance.now()
    function step(t) {
      const k     = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - k, 3)
      setV(Math.round(target * eased))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, dur])
  return v
}

/** Ticking breakdown of the time left until an absolute timestamp. */
export function useCountdown(targetMs) {
  // Lazy initialiser: reading the clock during render proper would make the
  // component's output depend on when React happened to re-run it.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])

  const diff = Math.max(0, targetMs - now)
  const s    = Math.floor(diff / 1000)
  return {
    days:  Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins:  Math.floor((s % 3600) / 60),
    secs:  s % 60,
    raw:   s,
  }
}
