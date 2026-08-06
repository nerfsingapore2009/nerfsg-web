import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAllGamedays, deriveStats } from '../hooks/useGamedays'
import { SOCIALS, TELEGRAM_URL } from '../lib/links'
import { useCountUp } from '../components/Hud'
import { useReveal } from '../hooks/useReveal'
import { getFieldGallery, getAppScreens, getPagePhoto } from '../lib/media'
import { useParallax } from '../hooks/useParallax'
import { TrendsRow, YoYBlock, HeatmapCalendar } from '../components/Extras'
import Photo from '../components/Photo'
import PastGames from '../components/Archive'
import InstagramFeed from '../components/InstagramFeed'
import { HeroCinematic } from './HeroCinematic'

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
          Real shots from recent games, captured by the community.
        </p>
      </div>

      <div className="relative pb-16 lg:pb-20">
        <div className="marquee-track flex gap-4 w-max px-5 lg:px-8">
          {loop.map((p, i) => (
            <figure key={i}
              className="relative w-[280px] sm:w-[360px] aspect-[4/3] overflow-hidden
                         border border-white/10 shrink-0 shadow-lg">
              <Photo photo={p} alt={p.name || 'NerfSG game action'}
                sizes="(min-width: 640px) 360px, 280px"
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

/* The questions newcomers actually hesitate on are social, not logistical —
   answer those before the gear checklist, not after it. */
const FIRST_TIMER = [
  { q: 'Never played?',        a: 'Open to all skill levels. That is the format, not a slogan.' },
  { q: 'Coming alone?',        a: 'So did most people here, once. You will be on a team by the first round.' },
  { q: 'No blaster?',          a: 'Tell the host early and borrow one. Darts sorted too.' },
  { q: 'What does it cost?',   a: 'Every game lists its entry. Free ones say free, paid ones show the price.' },
]

function WhatToBring() {
  const portrait = getPagePhoto('firstTimer')
  const parallaxRef = useParallax(0.07)
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20" data-reveal>

        {/* First-timer reassurance: the photo answers "does this look fun?",
            the copy answers "can I show up?". */}
        <div className="mb-14 lg:mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-center">
          <div className="lg:col-span-7">
            <p className="section-label">Your first game</p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink uppercase tracking-tight mt-2">
              Just turn up.
            </h2>
            <p className="text-muted mt-3 max-w-xl">
              The hardest part is deciding to come. Everything else we sort out at the field.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mt-8">
              {FIRST_TIMER.map(item => (
                <div key={item.q} className="border-l-2 border-red pl-4">
                  <dt className="font-display text-lg text-ink uppercase tracking-tight">{item.q}</dt>
                  <dd className="text-muted text-sm leading-relaxed mt-1">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
          {portrait && (
            <figure className="relative overflow-hidden border border-border aspect-[4/3] lg:aspect-[3/4] lg:col-span-5">
              <div ref={parallaxRef} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
                <Photo photo={portrait} alt="A first-time player grins while peeking around a barricade"
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `center ${portrait.focalY || '30%'}` }} />
              </div>
              {portrait.credit && <figcaption className="credit-badge">📷 {portrait.credit}</figcaption>}
            </figure>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3 pt-12 border-t border-border">
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
                        <Photo photo={photo} alt="" className="mode-photo"
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                          style={{ objectPosition: `center ${photo.focalY || '30%'}` }} />
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

        <InstagramFeed />
      </div>
    </section>
  )
}

/* ── FINAL CTA ────────────────────────────────────────────────────────
   The page's whole job is converting curiosity into attendance — close
   with the ask instead of trailing off after the socials grid. */
function FinalCta() {
  return (
    <section className="bg-ink2 text-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20 text-center" data-reveal>
        <p className="section-label justify-center">Your move</p>
        <h2 className="font-display text-4xl lg:text-6xl uppercase tracking-tight mt-2">
          See you on the field.
        </h2>
        <p className="text-white/60 mt-3 max-w-md mx-auto">
          Find the next game, turn up, and we'll sort out the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/events" className="btn-red justify-center">Find the next game</Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost justify-center !text-white !border-white/25 hover:!bg-white/10"
          >
            Join the Telegram
          </a>
        </div>
      </div>
    </section>
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
      {/* Order matters: photos prove it's fun, WhatToBring proves it's achievable,
          stats prove it's real — only then do we ask anyone to install the app. */}
      <HeroCinematic data={data} />
      <FieldGallery data={data} />
      <WhatToBring />
      <CommunityStats data={data} />
      <AppShowcase />
      <GameModesSection data={data} />
      <PastGames data={data} />
      <WatchAndConnect />
      <FinalCta />
    </>
  )
}
