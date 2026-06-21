import { useMemo, useState, useEffect } from 'react'
import { useAllGamedays, deriveStats, extractParticipants } from '../hooks/useGamedays'
import { useCountUp, useCountdown } from '../components/Hud'
import { useReveal } from '../hooks/useReveal'
import { getFieldGallery, getHeroPhoto, getAppScreens } from '../lib/media'
import AvatarChip from '../components/AvatarChip'
import { TrendsRow, YoYBlock, HeatmapCalendar } from '../components/Extras'
import PastGames from '../components/Archive'
import { HeroCinematic } from './HeroCinematic'

/* ── helpers ──────────────────────────────────────────────────────── */
function formatGameday(ev) {
  const ts = ev.scheduledFor || ev.createdAt
  const d  = new Date(ts)
  return {
    date: d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false }),
    dt: d,
  }
}

/* ── NEXT GAME CARD ───────────────────────────────────────────────── */
function NextGameCard({ event, loading, error, queue = [] }) {
  const targetMs = event?.scheduledFor || (Date.now() + 86400000)
  const cd  = useCountdown(targetMs)
  const fmt = event ? formatGameday(event) : null

  return (
    <div className="card overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-border2' : 'bg-green-500 pulse-dot'}`}></span>
          <span className="text-xs font-semibold tracking-widest uppercase text-muted">
            {loading ? 'Loading…' : event ? 'Next game' : 'No upcoming games'}
          </span>
        </div>
        <span className="text-xs text-muted font-mono">
          {loading ? 'live' : event ? `#${(event.id || '').slice(0, 6).toUpperCase()}` : 'TBA'}
        </span>
      </div>

      <div className="p-5">
        {loading && (
          <div className="animate-pulse">
            <div className="h-7 bg-border rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-border rounded w-1/2 mb-5"></div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[0, 1, 2, 3].map(i => <div key={i} className="h-16 bg-surface rounded"></div>)}
            </div>
            <div className="h-9 bg-surface rounded"></div>
          </div>
        )}

        {!loading && !event && (
          <div className="py-2">
            <h3 className="font-display text-2xl text-ink tracking-tight">No upcoming games right now</h3>
            <p className="text-muted text-sm mt-2">
              Games are usually announced on Facebook first. Check the group for the next drop.
            </p>
            {error && <p className="text-xs text-red mt-3">Error: {error}</p>}
            <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
              className="btn-red mt-4">
              Check Facebook →
            </a>
          </div>
        )}

        {!loading && event && (() => {
          const participants = extractParticipants(event)
          const yesCount = participants.length
          const maxSlots = event.maxSlots || null
          const isPaid   = event.sessionType === 'paid' || event.entryFee > 0
          return (
            <>
              {event.groupPhoto && (
                <div className="mb-4 -mt-1 overflow-hidden border border-border aspect-[16/8]">
                  <img src={event.groupPhoto} alt={event.name || 'Game photo'} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-display text-3xl text-ink tracking-tight truncate">{event.name || 'Untitled game'}</h3>
                  <div className="text-muted text-sm mt-1">
                    {fmt.date} · {fmt.time}{event.location ? ` · ${event.location}` : ''}
                  </div>
                  {event.hostName && (
                    <div className="text-xs text-muted mt-1.5">
                      Hosted by <span className="font-semibold text-ink">{event.hostName}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-semibold text-green-700 border border-green-200 bg-green-50 px-2 py-1 rounded-full tabular">
                    {maxSlots ? `${yesCount}/${maxSlots}` : `${yesCount} going`}
                  </span>
                  {isPaid && event.entryFee > 0 && (
                    <span className="text-xs font-semibold text-red border border-red/30 bg-red/5 px-2 py-1 rounded-full">
                      ${event.entryFee}
                    </span>
                  )}
                </div>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[{ v: cd.days, l: 'Days' }, { v: cd.hours, l: 'Hrs' }, { v: cd.mins, l: 'Min' }, { v: cd.secs, l: 'Sec' }].map((c, i) => (
                  <div key={i} className="countdown-box">
                    <span className="num">{String(c.v).padStart(2, '0')}</span>
                    <span className="lbl">{c.l}</span>
                  </div>
                ))}
              </div>

              {(event.note || event.fieldNotes) && (
                <>
                  <div className="text-xs font-semibold text-muted mb-2">Notes</div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(event.note || event.fieldNotes).split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map((tag, i) => (
                      <span key={i} className="text-xs bg-surface border border-border rounded-full px-2.5 py-1 text-muted">{tag}</span>
                    ))}
                  </div>
                </>
              )}

              {participants.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-muted mb-2">Going</div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {participants.slice(0, 6).map((p, i) => (
                        <div key={p.id} className="relative" style={{ zIndex: 6 - i }}>
                          <AvatarChip name={p.name} id={p.id} idx={i} src={p.avatarUrl} />
                        </div>
                      ))}
                    </div>
                    {participants.length > 6 && (
                      <span className="text-sm text-muted ml-1">+{participants.length - 6} more</span>
                    )}
                  </div>
                </div>
              )}

              <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer"
                className="btn-red w-full justify-center">
                RSVP — open in app
              </a>

              {queue.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-muted mb-2">Upcoming</div>
                  <ul className="flex flex-col gap-1.5">
                    {queue.map(q => {
                      const qf = formatGameday(q)
                      return (
                        <li key={q.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-ink truncate font-medium">{q.name || 'Untitled'}</span>
                          <span className="text-muted text-xs shrink-0">{qf.date} · {qf.time}</span>
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

/* ── HERO ─────────────────────────────────────────────────────────── */
function Hero({ data }) {
  const { loading, error, stats, all = [] } = data
  const upcoming  = stats?.upcoming || []
  const nextEvent = upcoming[0] || null
  const queue     = upcoming.slice(1, 4)
  const heroPhoto = useMemo(() => getHeroPhoto(all), [all])

  const yearGames   = useCountUp(stats?.yearGames || 0, 1400)
  const yearPlayers = useCountUp(stats?.yearOperators || 0, 1600)

  const statStrip = [
    { lbl: `Games in ${stats?.year || new Date().getFullYear()}`, val: yearGames.toLocaleString() },
    { lbl: 'Players this year', val: yearPlayers.toLocaleString() },
    { lbl: 'Games all-time',    val: '600+' },
  ]

  return (
    <section className="hero-cinematic text-white">
      {heroPhoto && (
        <img src={heroPhoto} alt="" aria-hidden="true" className="hero-photo"
          fetchPriority="high" decoding="async" />
      )}
      <div className="hero-scrim" />
      <div className="grain" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 min-h-[100dvh]
                      flex flex-col justify-center pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Headline + CTAs + stats */}
          <div className="reveal flex flex-col gap-8 lg:col-span-7">
            <div>
              <p className="section-label">Singapore's Nerf community · Est. 2009</p>
              <h1 className="font-display font-black leading-[.88] tracking-tight mt-3 uppercase
                             [text-shadow:0_2px_30px_rgba(0,0,0,.35)]">
                <span className="block text-[clamp(48px,7vw,96px)]">Play.</span>
                <span className="block text-[clamp(48px,7vw,96px)] text-red">Shoot.</span>
                <span className="block text-[clamp(48px,7vw,96px)]">Have fun.</span>
              </h1>
              <p className="text-white/80 text-base lg:text-lg mt-5 max-w-lg">
                Weekly foam dart games in Singapore — open to all skill levels.
                Bring a blaster or borrow one from us, grab some darts, and come hang out.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red">
                  Join the next game
                </a>
                <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 font-semibold text-sm
                             text-white border border-white/30 hover:bg-white/10 transition-colors">
                  Facebook group
                </a>
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15 pt-6 max-w-md">
              {statStrip.map(s => (
                <div key={s.lbl}>
                  <div className="font-display font-black text-3xl lg:text-4xl tabular leading-none">
                    {loading ? '—' : s.val}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-1.5 tracking-wide">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live next-game card, floated as glass over the photo */}
          <div className="reveal reveal-d2 lg:col-span-5 w-full lg:justify-self-end max-w-md">
            <NextGameCard event={nextEvent} loading={loading} error={error} queue={queue} />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2
                        text-white/50 reveal reveal-d3" aria-hidden="true">
          <span className="text-[10px] font-semibold tracking-[.22em] uppercase">Scroll</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
            <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8" cy="7" r="1.6" fill="currentColor">
              <animate attributeName="cy" values="7;13;7" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  )
}

/* ── FIELD GALLERY ───────────────────────────────────────────────── */
function FieldGallery({ data }) {
  const { all = [] } = data
  const photos = useMemo(() => getFieldGallery(all, 10), [all])
  // Honest empty state: only show when we have real photos to show.
  if (photos.length < 3) return null
  const loop = [...photos, ...photos] // duplicated for a seamless marquee

  return (
    <section className="bg-ink2 text-white overflow-hidden border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-16 lg:pt-20 pb-8" data-reveal>
        <p className="section-label">On the field</p>
        <h2 className="font-display text-4xl lg:text-5xl uppercase tracking-tight mt-2">Foam, in motion.</h2>
        <p className="text-white/60 mt-2 max-w-xl">
          Real shots from recent games — captured by the community's photographers.
        </p>
      </div>

      <div className="relative pb-16 lg:pb-20">
        <div className="marquee-track flex gap-4 w-max px-5 lg:px-8">
          {loop.map((p, i) => (
            <figure key={i}
              className="relative w-[280px] sm:w-[360px] aspect-[4/3] overflow-hidden
                         border border-white/10 shrink-0 shadow-lg">
              <img src={p.src} alt={p.name || 'NerfSG game action'} loading="lazy" decoding="async"
                className="w-full h-full object-cover"
                style={{ objectPosition: `center ${p.focalY || '30%'}` }} />
              {p.credit && <figcaption className="credit-badge">📷 {p.credit}</figcaption>}
            </figure>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink2 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink2 to-transparent"></div>
      </div>
    </section>
  )
}

/* ── APP SHOWCASE ─────────────────────────────────────────────────── */
const APP_FEATURES = [
  {
    title: 'RSVP for games',
    desc: 'See upcoming games and lock in your spot — takes about 10 seconds.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Leaderboards',
    desc: 'Track your stats and see how you rank across the whole community.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 14v2M8 10v6M12 12v4M16 6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Game history',
    desc: 'Browse results, photos, and past game summaries.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

/* Polished mock screen — fallback shown only when no real screenshots exist */
function FauxAppScreen() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-2 px-5">
      <div className="font-display font-black text-3xl text-ink tracking-tight">
        <span className="text-red">NERF</span>SG
      </div>
      <div className="text-xs text-muted">Hub</div>
      <div className="mt-6 w-full space-y-2">
        {['Next game: Sat 14 Jun', 'Leaderboard', 'Past games'].map(label => (
          <div key={label} className="w-full bg-surface px-3 py-2.5 text-xs text-ink font-medium border border-border">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Real screenshots in a device frame, auto-advancing carousel */
function AppCarousel() {
  const screens = useMemo(() => getAppScreens(), [])
  const [idx, setIdx] = useState(0)
  const hasShots = screens.length > 0

  useEffect(() => {
    if (screens.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIdx(i => (i + 1) % screens.length), 3200)
    return () => clearInterval(t)
  }, [screens.length])

  return (
    <div className="device-frame">
      <div className="device-notch" />
      <div className="device-screen">
        {hasShots ? (
          <>
            <div className="carousel-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {screens.map((src, i) => (
                <div key={i} className="carousel-slide">
                  <img src={src} alt={`NerfSG Hub app screen ${i + 1}`} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
            {screens.length > 1 && (
              <div className="carousel-dots">
                {screens.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    aria-label={`Show app screen ${i + 1}`}
                    className={`carousel-dot ${i === idx ? 'active' : ''}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <FauxAppScreen />
        )}
      </div>
    </div>
  )
}

function AppShowcase() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Real app screenshots in a device frame */}
        <div className="flex justify-center order-2 lg:order-1" data-reveal>
          <AppCarousel />
        </div>

        {/* Text side */}
        <div className="order-1 lg:order-2" data-reveal style={{ '--reveal-delay': '0.1s' }}>
          <p className="section-label">NerfSG Hub app</p>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-ink uppercase tracking-tight mt-2 leading-[.92]">
            Your games,<br /><span className="text-red">on your phone.</span>
          </h2>
          <p className="text-muted mt-4 max-w-lg">
            NerfSG Hub is the community app — RSVP for games, track your stats, and stay up to date with what's going on.
          </p>
          <div className="flex flex-col gap-4 mt-7">
            {APP_FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="feature-icon shrink-0">{f.icon}</div>
                <div>
                  <div className="font-semibold text-ink text-sm">{f.title}</div>
                  <div className="text-muted text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red mt-7">
            Open the app
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── WHAT TO BRING ────────────────────────────────────────────────── */
const ESSENTIALS = [
  { code: '01', name: 'Eye protection', req: 'Required',
    note: 'ANSI-rated goggles or ballistic eye-pro. Sunglasses don\'t count.' },
  { code: '02', name: 'Covered shoes',  req: 'Required',
    note: 'You will sprint, slide, and dive. Sandals get you sat out for safety.' },
  { code: '03', name: 'A blaster',      req: 'Must have',
    note: 'Stock or modded? Both are welcomed, need loaners? Inform game host early.' },
  { code: '04', name: 'Foam darts',     req: 'Else how you shoot?',
    note: 'Dart sweep to be done at the end of event, pick everything up then sort after.' },
  { code: '05', name: 'FPS limit',      req: 'CHRONO CHECK',
    note: 'Check events details for the fps limits.' },
  { code: '06', name: 'Hydration',      req: 'Bring it',
    note: 'Bring your own water!' },
]

function WhatToBring() {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl text-ink uppercase tracking-tight">What to bring.</h2>
            <p className="text-muted mt-2 max-w-xl">Six things to sort before your first game. Hosts will chrono blasters at the door.</p>
          </div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase">Safety · Gear · Logistics</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESSENTIALS.map(e => {
            const isRequired = e.req === 'Required'
            return (
              <div key={e.code} className="card card-hover p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-4xl text-red/20 leading-none">{e.code}</span>
                  <span className={`text-xs font-semibold tracking-wide px-2 py-1 rounded-full border ${
                    isRequired ? 'text-red border-red/30 bg-red/5' : 'text-muted border-border bg-surface'
                  }`}>{e.req}</span>
                </div>
                <h3 className="font-display text-xl text-ink uppercase tracking-tight">{e.name}</h3>
                <p className="text-muted text-sm leading-relaxed">{e.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── COMMUNITY STATS ──────────────────────────────────────────────── */
function CommunityStats({ data }) {
  const { loading, stats, all = [] } = data
  const year  = stats?.year || new Date().getFullYear()
  const games = useCountUp(stats?.yearGames || 0, 1400)
  const ops   = useCountUp(stats?.yearOperators || 0, 1500)
  const rsvps = useCountUp(stats?.yearRsvps || 0, 1700)

  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <p className="section-label">Live from the community</p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">
              {year} in numbers.
            </h2>
            <p className="text-muted mt-2 max-w-xl">Tallied across every game in the system. Updates the moment a new game is posted.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-600 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></span>
            Live data
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { lbl: 'Games run',    val: games.toLocaleString(), hint: `out of ${stats?.totalAllTime || 0} all-time` },
            { lbl: 'Unique players', val: ops.toLocaleString(),   hint: 'distinct players' },
            { lbl: 'Total RSVPs', val: rsvps.toLocaleString(), hint: 'seats filled' },
          ].map(s => (
            <div key={s.lbl} className="card p-5">
              <div className="text-xs font-semibold text-muted tracking-widest uppercase">{s.lbl}</div>
              <div className="font-display font-black text-4xl lg:text-5xl text-ink mt-2 tabular leading-none">
                {loading ? '—' : s.val}
              </div>
              <div className="text-xs text-muted mt-3">{s.hint}</div>
            </div>
          ))}
        </div>

        {!loading && all.length > 0 && <TrendsRow all={all} year={year} />}
        {!loading && all.length > 0 && <YoYBlock all={all} />}
        {!loading && all.length > 0 && <HeatmapCalendar all={all} />}
      </div>
    </section>
  )
}

/* ── GAME MODES ───────────────────────────────────────────────────── */
const MODES = [
  { id: 'tdm',  code: '01', name: 'Team Death Match',   time: '3 min',     lives: '1+ lives',
    blurb: 'Last team standing wins.',
    desc: 'Both teams try to tag each other out. Time runs out — most players remaining wins.' },
  { id: 'ctf',  code: '02', name: 'Capture the Flag',   time: '3 min',     lives: '1+ lives',
    blurb: 'Bring it home.',
    desc: 'Return the centre flag to your start point to win immediately. Flag-carrier tagged — flag drops.' },
  { id: 'dom',  code: '03', name: 'Domination',         time: '3 min',     lives: '∞ respawn',
    blurb: 'Fewest clicks wins.',
    desc: 'Counter at each start point. Click when tagged to respawn. Lowest count at time-out takes it.' },
  { id: 'koth', code: '04', name: 'King of the Hill',   time: '5 min',     lives: '∞ respawn',
    blurb: 'Hold the chess clock.',
    desc: 'A chess clock sits centre. Press your side to start your timer. Longest hold wins.' },
  { id: 'cd',   code: '05', name: 'Clicker Domination', time: '3 min',     lives: '∞ respawn',
    blurb: 'Most clicks wins.',
    desc: 'Two clickers at centre, one per team. Click yours to score. Highest count wins.' },
  { id: 'hvz',  code: '06', name: 'Humans vs Zombies',  time: '15–30 min', lives: 'convert on tag',
    blurb: 'Foam vs the horde.',
    desc: 'Humans run blasters and stun timers. Zombies tag bare-handed to convert. Survive — or build the swarm.' },
]

function GameModesSection({ data }) {
  const { all = [] } = data
  const [flipped, setFlipped] = useState(null)
  const modePhotos = useMemo(() => getFieldGallery(all, MODES.length), [all])
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl text-ink uppercase tracking-tight">Game modes.</h2>
            <p className="text-muted mt-2 max-w-xl">Tap a card to flip and read the rules.</p>
          </div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase">6 formats</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map((m, i) => {
            const isFlipped = flipped === m.id
            const photo = modePhotos.length ? modePhotos[i % modePhotos.length] : null
            return (
              <button
                key={m.id}
                onClick={() => setFlipped(isFlipped ? null : m.id)}
                className="flip-card h-[300px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40"
                aria-label={isFlipped ? `${m.name} — click to flip back` : `${m.name} — click to see rules`}
              >
                <div className="flip-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* Front */}
                  <div className="flip-face card card-hover overflow-hidden flex flex-col">
                    {/* Top area */}
                    <div className="relative h-36 photo-placeholder rounded-none">
                      {photo && (
                        <>
                          <img src={photo.src} alt="" aria-hidden="true" className="mode-photo" loading="lazy" decoding="async"
                           style={{ objectPosition: `center ${photo.focalY || '30%'}` }} />
                        </>
                      )}
                      <span className={`relative z-10 font-display font-black text-5xl select-none ${
                        photo ? 'text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.55)]' : 'text-border2'
                      }`}>{m.code}</span>
                      <div className="absolute top-3 right-3 z-10 text-xs font-semibold text-muted bg-white border border-border rounded-full px-2 py-1">
                        {m.time}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-display text-xl text-ink uppercase tracking-tight leading-tight">{m.name}</h3>
                      <p className="text-muted text-sm mt-1">{m.blurb}</p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <span className="text-xs text-muted">{m.lives}</span>
                        <span className="text-xs font-semibold text-red">Tap for rules →</span>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="flip-back flip-face bg-red text-white p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold tracking-widest uppercase text-white/70">{m.code}</span>
                      <span className="text-xs font-semibold text-white/70">← flip back</span>
                    </div>
                    <h3 className="font-display text-3xl uppercase tracking-tight mt-3 leading-none">{m.name}</h3>
                    <p className="text-white/90 text-sm mt-3 leading-relaxed flex-1">{m.desc}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30 text-xs font-semibold text-white/70">
                      <span>{m.time}</span>
                      <span>{m.lives}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}


/* ── COMMUNITY / SOCIALS ──────────────────────────────────────────── */
const SOCIALS = [
  { name: 'Telegram',  handle: 't.me/nerfsg',                          members: '200+', href: 'https://t.me/+MbMLovtcLyVmYzhl' },
  { name: 'Facebook',  handle: 'facebook.com/groups/nerfsingapore',    members: '5.8k', href: 'https://www.facebook.com/groups/nerfsingapore/' },
  { name: 'TikTok',    handle: '@nerfsingapore',                       members: '200+', href: 'https://www.tiktok.com/@nerfsingapore' },
  { name: 'YouTube',   handle: '@project_argus_films',                 members: '1.1k', href: 'https://www.youtube.com/@project_argus_films/videos' },
]

function WatchAndConnect() {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* YouTube embed */}
        <div className="lg:col-span-7" data-reveal>
          <h2 className="font-display text-4xl lg:text-5xl text-ink uppercase tracking-tight">See how it looks.</h2>
          <p className="text-muted mt-2">Highlights and gameplay from recent games.</p>
          <div className="mt-6 aspect-video overflow-hidden border border-border bg-ink2
                          shadow-2xl ring-1 ring-black/5">
            <iframe
              src="https://www.youtube.com/embed?list=UUtZBMjqSgVEICxwIuOWL3dw&listType=playlist"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="NerfSG highlights"
              loading="lazy"
            />
          </div>
        </div>

        {/* Social links */}
        <div className="lg:col-span-5" data-reveal style={{ '--reveal-delay': '0.12s' }}>
          <p className="section-label">Connect</p>
          <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">Join the community.</h2>
          <p className="text-muted mt-2">Event updates, game invites, and community chat.</p>

          <div className="mt-6 flex flex-col gap-2.5">
            {SOCIALS.map(c => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link card-hover"
              >
                <div className="font-display text-base text-ink uppercase tracking-tight font-bold w-20 shrink-0">{c.name}</div>
                <div className="text-sm text-muted truncate flex-1 min-w-0">{c.handle}</div>
                <div className="text-sm font-semibold text-ink tabular shrink-0">{c.members}</div>
                <span className="text-red text-sm shrink-0">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ───────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/nerfsingapore.webp" alt="NERF Singapore" className="h-12 w-[108px] object-cover object-center" width="240" height="160" />
          <span className="text-xs text-muted">Est. 2009 · Singapore</span>
        </div>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} NerfSG · See you on the field.
        </p>
      </div>
    </footer>
  )
}

/* ── HOME PAGE ────────────────────────────────────────────────────── */
export default function Home() {
  const { loading, all, error } = useAllGamedays()

  const [tickMin, setTickMin] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setTickMin(x => x + 1), 60000)
    return () => clearInterval(i)
  }, [])

  const stats = useMemo(() => deriveStats(all), [all, tickMin])
  const data  = { loading, error, stats, all }

  // Re-scan for scroll-reveal targets once async game data has resolved.
  useReveal(loading)

  return (
    <>
      <HeroCinematic data={data} />
      <FieldGallery data={data} />
      <AppShowcase />
      <WhatToBring />
      <CommunityStats data={data} />
      <GameModesSection data={data} />
      <PastGames data={data} />
      <WatchAndConnect />
      <SiteFooter />
    </>
  )
}
