/**
 * HeroCinematic.jsx — drop-in replacement for the Hero section in Home.jsx
 *
 * Integration (3 steps):
 *   1. In Home.jsx, add at top:
 *        import { HeroCinematic } from './HeroCinematic'
 *   2. Replace <Hero data={data} /> with <HeroCinematic data={data} />
 *   3. Copy video files to public/video/ and append hero.css.additions to index.css
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import { extractParticipants } from '../hooks/useGamedays'
import { useCountdown } from '../components/Hud'
import AvatarChip from '../components/AvatarChip'

/* ── helpers ─────────────────────────────────────────────────── */
function formatGameday(ev) {
  const ts = ev.scheduledFor || ev.createdAt
  const d  = new Date(ts)
  return {
    date: d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}

/* ── Particle burst ──────────────────────────────────────────── */
function spawnParticles(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top  + rect.height / 2
  for (let i = 0; i < 22; i++) {
    const p    = document.createElement('div')
    const size = 5 + Math.random() * 6
    p.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:${Math.random() > .5 ? '50%' : '0'};background:${Math.random() > .6 ? '#fff' : 'var(--red, #e03131)'};left:${cx}px;top:${cy}px;pointer-events:none;z-index:9999;`
    document.body.appendChild(p)
    const angle = Math.random() * Math.PI * 2
    const dist  = 40 + Math.random() * 90
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 40
    p.style.transition = `all ${0.5 + Math.random() * 0.25}s cubic-bezier(0.16,1,0.3,1)`
    p.offsetHeight // reflow
    p.style.transform = `translate(${dx}px,${dy}px) scale(0) rotate(${Math.random() * 180}deg)`
    p.style.opacity = '0'
    setTimeout(() => p.remove(), 850)
  }
  const ring = document.createElement('div')
  ring.style.cssText = `position:fixed;width:10px;height:10px;left:${cx - 5}px;top:${cy - 5}px;border-radius:50%;border:1.5px solid var(--red,#e03131);pointer-events:none;z-index:9998;transition:all .5s cubic-bezier(.16,1,.3,1)`
  document.body.appendChild(ring)
  ring.offsetHeight
  ring.style.width = '100px'; ring.style.height = '100px'
  ring.style.left  = `${cx - 50}px`; ring.style.top = `${cy - 50}px`
  ring.style.opacity = '1'
  setTimeout(() => { ring.style.opacity = '0' }, 150)
  setTimeout(() => ring.remove(), 600)
}

/* ── Video background with clip cycling ─────────────────────── */
const VIDEO_A = '/video/nerf-action-hero.mp4'
const VIDEO_B = '/video/nerf-hvz-hero.mp4'

// Curated highlight clips from Hold the Hill video [startSec, durationSec]
const VIDEO_B_CLIPS = [
  [6.5,  16.2],  // "are you ready"
  [38.5,  6.7],
  [63.1,  5.9],
  [85.2,  5.8],
]

function VideoBg({ src, clips }) {
  const ref     = useRef(null)
  const [opacity, setOpacity] = useState(1)
  const clipIdx = useRef(0)
  const jumping = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    if (!clips || clips.length === 0) {
      v.currentTime = 0
      v.play().catch(() => {})
      return
    }

    clipIdx.current = 0
    jumping.current = false

    function goClip(idx) {
      const [start] = clips[idx % clips.length]
      jumping.current = true
      v.currentTime = start
    }

    function onSeeked() {
      if (jumping.current) {
        jumping.current = false
        v.play().catch(() => {})
        setOpacity(1)
      }
    }

    function onTimeUpdate() {
      if (jumping.current) return
      const [start, dur] = clips[clipIdx.current % clips.length]
      if (v.currentTime >= start + dur) {
        jumping.current = true
        setOpacity(0)
        clipIdx.current = (clipIdx.current + 1) % clips.length
        v.pause()
        setTimeout(() => goClip(clipIdx.current), 380)
      }
    }

    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('seeked', onSeeked)

    function onReady() { goClip(0) }
    if (v.readyState >= 2) onReady()
    else v.addEventListener('canplay', onReady, { once: true })

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('seeked', onSeeked)
      v.removeEventListener('canplay', onReady)
      v.pause()
    }
  }, [src, clips])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={ref}
        key={src}
        src={src}
        muted
        playsInline
        preload="auto"
        loop={!clips || clips.length === 0}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '100vw', height: '56.25vw',
          minHeight: '100vh', minWidth: '177.78vh',
          transform: 'translate(-50%,-50%)',
          objectFit: 'cover',
          opacity: opacity * 0.68,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* ── Odometer stat ───────────────────────────────────────────── */
function OdoStat({ value, label, delay = 0 }) {
  const stripped  = String(value).replace('+', '')
  const suffix    = String(value).includes('+') ? '+' : ''
  const digits    = stripped.split('')
  const stripRefs = useRef([])

  useEffect(() => {
    const t = setTimeout(() => {
      stripRefs.current.forEach((strip, i) => {
        if (!strip) return
        const target = parseInt(digits[i])
        const h = strip.children[0]?.offsetHeight || 0
        strip.style.transition = `transform 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`
        strip.style.transform  = `translateY(-${target * h}px)`
      })
    }, delay)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  return (
    <div>
      <div className="odo-wrap font-display font-black tabular-nums leading-none"
        style={{ fontSize: 32, color: '#fff', overflow: 'visible' }}>
        {digits.map((_, i) => (
          <div key={i} className="odo-digit">
            <div className="odo-strip" ref={el => stripRefs.current[i] = el}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => <span key={n}>{n}</span>)}
            </div>
          </div>
        ))}
        {suffix && <span style={{ fontSize: 26 }}>{suffix}</span>}
      </div>
      <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,.38)' }}>{label}</div>
    </div>
  )
}

/* ── Live tactical clock strip ───────────────────────────────── */
function TacticalStrip() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => {
      const d  = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)
    }
    fmt()
    const i = setInterval(fmt, 1000)
    return () => clearInterval(i)
  }, [])
  return (
    <div className="hero-tactical">
      <span>SGT +8 · BISHAN PARK · OP ACTIVE</span>
      <span className="hero-tactical-right">
        <span>PHOTO 📷 YALAMPHOTOS</span>
        <span>{time}</span>
        <span>NERFSG · EST 2009</span>
      </span>
    </div>
  )
}

/* ── Dark glass countdown box ────────────────────────────────── */
function DarkCbox({ value, label }) {
  const v = typeof value === 'number' ? String(value).padStart(2, '0') : value
  return (
    <div style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', padding: '8px 0', textAlign: 'center', flex: 1 }}>
      <span className="block font-display font-black tabular-nums" style={{ fontSize: '1.55rem', color: '#fff', lineHeight: 1 }}>{v}</span>
      <span className="block font-semibold uppercase tracking-widest" style={{ fontSize: '0.575rem', color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{label}</span>
    </div>
  )
}

/* ── Dark next-game card ─────────────────────────────────────── */
function DarkNextGameCard({ event, loading, error, queue = [] }) {
  const targetMs = event?.scheduledFor || (Date.now() + 86400000)
  const cd       = useCountdown(targetMs)
  const fmt      = event ? formatGameday(event) : null

  return (
    <div style={{ background: 'rgba(6,8,15,.86)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.09)', overflow: 'hidden', animation: 'cardIn .7s cubic-bezier(.22,1,.36,1) 1.2s both' }}>
      {/* strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: 999, background: '#16a34a', display: 'block' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>
            {loading ? 'Loading…' : event ? 'Next game' : 'No upcoming games'}
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', letterSpacing: '.1em' }}>
          {event ? `#${(event.id || '').slice(0, 6).toUpperCase()}` : 'TBA'}
        </span>
      </div>

      <div style={{ padding: '16px 16px 20px' }}>
        {loading && (
          <div className="animate-pulse" style={{ color: '#fff' }}>
            <div style={{ height: 28, background: 'rgba(255,255,255,.08)', borderRadius: 2, width: '66%', marginBottom: 8 }} />
            <div style={{ height: 16, background: 'rgba(255,255,255,.05)', borderRadius: 2, width: '50%', marginBottom: 20 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 20 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ height: 60, background: 'rgba(255,255,255,.06)' }} />)}
            </div>
            <div style={{ height: 38, background: 'rgba(255,255,255,.08)' }} />
          </div>
        )}

        {!loading && !event && (
          <div style={{ paddingTop: 4 }}>
            <h3 className="font-display font-black uppercase tracking-tight" style={{ fontSize: 24, color: '#fff', lineHeight: 1, margin: 0 }}>No upcoming games</h3>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, marginTop: 8 }}>Check the Facebook group for the next drop.</p>
            {error && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 10 }}>Error: {error}</p>}
            <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
              className="btn-red" style={{ marginTop: 14, display: 'inline-flex' }}>Check Facebook →</a>
          </div>
        )}

        {!loading && event && (() => {
          const participants = extractParticipants(event)
          const yesCount     = participants.length
          const maxSlots     = event.maxSlots || null
          const isPaid       = event.sessionType === 'paid' || event.entryFee > 0
          const bannerImg = event.locationImageUrl || event.groupPhoto || null
          return (
            <>
              {bannerImg && (
                <div style={{ margin: '-16px -16px 14px', overflow: 'hidden', aspectRatio: '16/7', position: 'relative' }}>
                  <img src={bannerImg} alt={event.name || 'Game banner'} loading="lazy" decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,8,15,0) 40%, rgba(6,8,15,.72) 100%)' }} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
                <div>
                  <h3 className="font-display font-black uppercase tracking-tight" style={{ fontSize: 26, color: '#fff', lineHeight: 1, margin: 0 }}>
                    {event.name || 'Untitled game'}
                  </h3>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>
                    {fmt.date} · {fmt.time}
                  </div>
                  {event.location && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{event.location}</div>}
                  {event.hostName && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Hosted by <b style={{ color: 'rgba(255,255,255,.6)' }}>{event.hostName}</b></div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, color: '#86efac', border: '1px solid rgba(134,239,172,.25)', background: 'rgba(22,163,74,.12)' }}>
                    {maxSlots ? `${yesCount}/${maxSlots}` : `${yesCount} going`}
                  </span>
                  {isPaid && event.entryFee > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, color: '#fca5a5', border: '1px solid rgba(252,165,165,.25)', background: 'rgba(224,49,49,.12)' }}>
                      ${event.entryFee}
                    </span>
                  )}
                </div>
              </div>

              {/* Countdown */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[{ v: cd.days, l: 'Days' }, { v: cd.hours, l: 'Hrs' }, { v: cd.mins, l: 'Min' }, { v: cd.secs, l: 'Sec' }].map((c, i) => (
                  <DarkCbox key={i} value={c.v} label={c.l} />
                ))}
              </div>

              {/* Roster */}
              {participants.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex' }}>
                    {participants.slice(0, 6).map((p, i) => (
                      <div key={p.id} style={{ marginLeft: i ? -7 : 0, zIndex: 6 - i, position: 'relative' }}>
                        <AvatarChip name={p.name} id={p.id} idx={i} src={p.avatarUrl} />
                      </div>
                    ))}
                  </div>
                  {participants.length > 6 && (
                    <span style={{ marginLeft: 10, fontSize: 13, color: 'rgba(255,255,255,.35)' }}>+{participants.length - 6} more</span>
                  )}
                </div>
              )}

              {/* CTA */}
              <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer"
                onClick={spawnParticles}
                className="btn-red"
                style={{ width: '100%', justifyContent: 'center', display: 'flex', position: 'relative', zIndex: 1 }}>
                RSVP — open in app
              </a>

              {queue.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>Upcoming</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {queue.map(q => {
                      const qf = formatGameday(q)
                      return (
                        <li key={q.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 13 }}>
                          <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{q.name || 'Untitled'}</span>
                          <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, flexShrink: 0 }}>{qf.date} · {qf.time}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}

/* ── Cinematic Hero ──────────────────────────────────────────── */
export function HeroCinematic({ data }) {
  const { loading, error, stats, all = [] } = data
  const upcoming  = stats?.upcoming || []
  const nextEvent = upcoming[0] || null
  const queue     = upcoming.slice(1, 4)

  const yearGames   = stats?.yearGames   || 0
  const yearPlayers = stats?.yearOperators || 0
  const year        = stats?.year || new Date().getFullYear()

  const statStrip = [
    { val: String(yearGames),   label: `Games in ${year}`,    delay: 1500 },
    { val: String(yearPlayers), label: 'Players this year',   delay: 1650 },
    { val: '600+',              label: 'All-time',            delay: 1800 },
  ]

  const lbH = 44

  return (
    <section className="hero-cinematic-section relative text-white overflow-hidden" style={{ background: '#06080f' }}>

      {/* ── Video background ── */}
      <VideoBg src={VIDEO_B} clips={VIDEO_B_CLIPS} />

      {/* ── Scrim ── */}
      <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(180deg, rgba(6,8,15,.5) 0%, rgba(6,8,15,.1) 35%, rgba(6,8,15,.82) 100%), linear-gradient(90deg, rgba(6,8,15,.92) 0%, rgba(6,8,15,.55) 45%, rgba(6,8,15,.78) 100%)' }} />

      {/* ── Film grain ── */}
      <div className="grain" />

      {/* ── Letterbox bars ── */}
      <div className="hero-lb-top" />
      <div className="hero-lb-bottom" />

      {/* ── Nav (inside top bar) — desktop only; mobile uses the main Navbar ── */}
      <div className="hidden lg:flex absolute left-0 right-0 items-center px-10 gap-6" style={{ top: 0, height: lbH, zIndex: 30 }}>
        <img src="/nerfsingapore.webp" alt="NERF Singapore" className="object-cover object-center" style={{ height: 26, width: 59 }} />
        <div style={{ flex: 1 }} />
        <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" onClick={spawnParticles} className="btn-red hidden lg:inline-flex" style={{ fontSize: 13, position: 'relative', zIndex: 1 }}>
          Get the app
        </a>
      </div>

      {/* ── HUD ── */}
      <div className="hud-frame" style={{ top: lbH, bottom: lbH }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />
        <div className="hud-cross"><div className="hud-cross-dot" /></div>
        <div className="hud-counter">
          {/* Could display live game count here */}
        </div>
      </div>

      {/* ── Tactical strip ── */}
      <TacticalStrip />

      {/* ── Scroll nudge ── */}
      <div className="absolute left-1/2 hidden lg:flex flex-col items-center gap-1.5 pointer-events-none" style={{ bottom: lbH + 18, transform: 'translateX(-50%)', zIndex: 9, animation: 'fadeUp .6s ease 1.8s both' }} aria-hidden="true">
        <span className="font-semibold tracking-widest uppercase" style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>Scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'nudge 1.8s ease-in-out 2.2s infinite' }}>
          <path d="M7 2v10M3.5 8.5L7 12l3.5-3.5" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="hero-content-wrap">
        <div className="w-full max-w-[1240px] mx-auto px-5 lg:px-14 grid items-start lg:items-center gap-8 lg:gap-12 hero-main-grid"
          style={{ paddingTop: lbH + 24, paddingBottom: lbH + 80 }}>

          {/* ── Left: headline ── */}
          <div style={{ minWidth: 0 }}>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest" style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 16, animation: 'fadeUp .6s cubic-bezier(.22,1,.36,1) .2s both' }}>
              <div style={{ width: 18, height: 2, background: 'var(--red, #e03131)', flexShrink: 0 }} />
              Singapore's Nerf community · Est. 2009
            </div>

            {/* Red reveal line */}
            <div className="line-reveal" style={{ height: 2, background: 'var(--red, #e03131)', marginBottom: 18 }} />

            {/* Headline */}
            <h1 className="font-display font-black uppercase leading-[.82] m-0" style={{ letterSpacing: '-.03em', fontSize: 'clamp(56px,7.8vw,100px)' }}>
              <span className="word-in word-in-1" style={{ display: 'block', color: '#fff' }}>Play.</span>
              <span className="word-in word-in-2" style={{ display: 'block', color: 'var(--red, #e03131)', animationDelay: '.66s' }}>Shoot.</span>
              <span className="word-in word-in-3" style={{ display: 'block', color: '#fff' }}>Have fun.</span>
            </h1>

            {/* Sub-copy */}
            <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 16, lineHeight: 1.55, marginTop: 18, maxWidth: '24rem', animation: 'fadeUp .7s cubic-bezier(.22,1,.36,1) 1.15s both' }}>
              Weekly foam dart games in Singapore — open to all skill levels.
              Bring a blaster or borrow one from us.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3" style={{ marginTop: 22, animation: 'fadeUp .6s cubic-bezier(.22,1,.36,1) 1.28s both' }}>
              <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer"
                onClick={spawnParticles}
                className="btn-red"
                style={{ position: 'relative', zIndex: 1 }}>
                Join the next game
              </a>
              <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center font-semibold"
                style={{ fontSize: 14, padding: '11px 22px', color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.2)', textDecoration: 'none' }}>
                Facebook group
              </a>
            </div>

            {/* Odometer stat strip */}
            <div className="flex gap-7" style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.1)', animation: 'fadeUp .6s cubic-bezier(.22,1,.36,1) 1.4s both' }}>
              {statStrip.map(s => (
                loading
                  ? <div key={s.label} style={{ color: '#fff', minWidth: 60 }}>
                      <div className="font-display font-black" style={{ fontSize: 32 }}>—</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 4 }}>{s.label}</div>
                    </div>
                  : <OdoStat key={s.label} value={s.val} label={s.label} delay={s.delay} />
              ))}
            </div>
          </div>

          {/* ── Right: dark game card ── */}
          <DarkNextGameCard event={nextEvent} loading={loading} error={error} queue={queue} />
        </div>
      </div>

    </section>
  )
}
