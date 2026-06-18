import { useMemo, useState, useEffect } from 'react'
import { useAllGamedays, deriveStats, extractParticipants } from '../hooks/useGamedays'
import { useCountUp, useCountdown } from '../components/Hud'
import AvatarChip from '../components/AvatarChip'
import { TrendsRow, YoYBlock, HeatmapCalendar } from '../components/Extras'
import PastGames from '../components/Archive'

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
                <div className="mb-4 -mt-1 rounded-lg overflow-hidden border border-border aspect-[16/8]">
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
                        <AvatarChip key={p.id} name={p.name} id={p.id} idx={i} src={p.avatarUrl} />
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
  const { loading, error, stats } = data
  const upcoming  = stats?.upcoming || []
  const nextEvent = upcoming[0] || null
  const queue     = upcoming.slice(1, 4)

  const yearGames   = useCountUp(stats?.yearGames || 0, 1400)
  const yearPlayers = useCountUp(stats?.yearOperators || 0, 1600)
  const totalAll    = useCountUp(stats?.totalAllTime || 0, 1200)

  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-12 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-2 gap-10 items-start">

        {/* Text + next game card */}
        <div className="reveal flex flex-col gap-8">
          <div>
            <p className="section-label">Singapore's Nerf community · Est. 2009</p>
            <h1 className="font-display font-black text-ink leading-[.92] tracking-tight mt-3 uppercase">
              <span className="block text-[clamp(52px,7vw,100px)]">Play.</span>
              <span className="block text-[clamp(52px,7vw,100px)] text-red">Shoot.</span>
              <span className="block text-[clamp(52px,7vw,100px)]">Have fun.</span>
            </h1>
            <p className="text-muted text-base lg:text-lg mt-5 max-w-lg">
              Weekly foam dart games in Singapore — open to all skill levels.
              Bring a blaster or borrow one from us, grab some darts, and come hang out.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red">
                Join the next game
              </a>
              <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
                className="btn-ghost">
                Facebook group
              </a>
            </div>
          </div>

          {/* Stat mini-strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { lbl: `Games in ${stats?.year || new Date().getFullYear()}`, val: yearGames.toLocaleString() },
              { lbl: 'Players this year', val: yearPlayers.toLocaleString() },
              { lbl: 'Games all-time',    val: totalAll.toLocaleString() },
            ].map(s => (
              <div key={s.lbl} className="stat-chip">
                <div className="font-display font-black text-2xl lg:text-3xl text-ink tabular leading-none">
                  {loading ? '—' : s.val}
                </div>
                <div className="text-xs text-muted mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next game card */}
        <div className="reveal reveal-d2">
          <NextGameCard event={nextEvent} loading={loading} error={error} queue={queue} />
        </div>
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

function AppShowcase() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Phone mockup */}
        <div className="flex justify-center order-2 lg:order-1">
          <div className="relative w-52 h-[420px]">
            <div className="w-full h-full bg-ink rounded-[2.5rem] shadow-md border-4 border-ink overflow-hidden flex flex-col">
              {/* Notch bar */}
              <div className="h-7 bg-ink flex items-center justify-center shrink-0">
                <div className="w-16 h-1 bg-white/20 rounded-full"></div>
              </div>
              {/* Screen */}
              <div className="flex-1 bg-white flex flex-col items-center justify-center gap-2 px-4">
                <div className="font-display font-black text-3xl text-ink tracking-tight">
                  <span className="text-red">NERF</span>SG
                </div>
                <div className="text-xs text-muted">Hub</div>
                <div className="mt-6 w-full space-y-2">
                  {['Next game: Sat 14 Jun', 'Leaderboard', 'Past games'].map(label => (
                    <div key={label} className="w-full bg-surface rounded-lg px-3 py-2.5 text-xs text-ink font-medium border border-border">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="order-1 lg:order-2">
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
    note: 'ANSI-rated goggles or ballistic eye-pro. Sunglasses don\'t count. We sell spares on-site for $5.' },
  { code: '02', name: 'A blaster',      req: 'BYO',
    note: 'Stock or modded — both welcome. New? You can borrow loaners at any open game. Chrono done before play.' },
  { code: '03', name: 'Foam darts',     req: '~300',
    note: 'Half-darts only at indoor venues. Full-length OK outdoors. Lost darts are part of the deal.' },
  { code: '04', name: 'FPS limit',      req: '120 FPS',
    note: 'Standard cap. HvZ outdoor goes up to 150 with PVP rules. Chrono check at the door.' },
  { code: '05', name: 'Closed shoes',   req: 'Required',
    note: 'You will sprint, slide, and dive. Sandals get you sat out for safety.' },
  { code: '06', name: 'Hydration',      req: 'Bring it',
    note: 'Singapore humidity is no joke. Refills available at most venues.' },
]

function WhatToBring() {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <p className="section-label">Before you show up</p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">What to bring.</h2>
            <p className="text-muted mt-2 max-w-xl">Six things to sort before your first game. Hosts will chrono blasters at the door.</p>
          </div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase">Safety · Gear · Logistics</div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
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

function GameModesSection() {
  const [flipped, setFlipped] = useState(null)
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <p className="section-label">How we play</p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">Game modes.</h2>
            <p className="text-muted mt-2 max-w-xl">Tap a card to flip and read the rules.</p>
          </div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase">6 formats</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map(m => {
            const isFlipped = flipped === m.id
            return (
              <button
                key={m.id}
                onClick={() => setFlipped(isFlipped ? null : m.id)}
                className="flip-card h-[300px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 rounded-xl"
                aria-label={isFlipped ? `${m.name} — click to flip back` : `${m.name} — click to see rules`}
              >
                <div className="flip-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* Front */}
                  <div className="flip-face card card-hover rounded-xl overflow-hidden flex flex-col">
                    {/* Top area */}
                    <div className="relative h-36 photo-placeholder rounded-none">
                      <span className="font-display font-black text-5xl text-border2 select-none">{m.code}</span>
                      <div className="absolute top-3 right-3 text-xs font-semibold text-muted bg-white border border-border rounded-full px-2 py-1">
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
                  <div className="flip-back flip-face bg-red text-white rounded-xl p-5 flex flex-col">
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

/* ── ROSTER MARQUEE ───────────────────────────────────────────────── */
function Roster({ data }) {
  const { loading, stats } = data

  const handles = useMemo(() => {
    if (!stats) return []
    const recent = [...(stats.upcoming || []).slice(0, 8), ...(stats.past || []).slice(0, 12)]
    const seen = new Map()
    for (const ev of recent) {
      const parts = extractParticipants(ev)
      for (const p of parts) {
        if (!seen.has(p.id)) {
          seen.set(p.id, { ...p, lastGame: ev.name || 'Game' })
        } else if (!seen.get(p.id).avatarUrl && p.avatarUrl) {
          seen.get(p.id).avatarUrl = p.avatarUrl
        }
      }
    }
    return [...seen.values()].slice(0, 24)
  }, [stats])

  const items = handles.length > 0 ? [...handles, ...handles] : []

  return (
    <section className="border-b border-border bg-surface py-12 lg:py-14">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 mb-6 flex items-end justify-between">
        <div>
          <p className="section-label">Community</p>
          <h2 className="font-display text-3xl lg:text-4xl text-ink mt-2 uppercase tracking-tight">Recent players.</h2>
        </div>
        <div className="text-xs font-semibold text-muted tracking-widest uppercase hidden sm:block">
          {loading ? 'Loading…' : `${handles.length} players · last 20 games`}
        </div>
      </div>

      {loading || handles.length === 0 ? (
        <div className="max-w-6xl mx-auto px-5 lg:px-8 text-sm text-muted">
          {loading ? 'Loading player data…' : 'No RSVP data yet'}
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="marquee-track flex gap-3 w-[200%]" style={{ animationDuration: '80s' }}>
            {items.map((h, i) => (
              <div key={`${h.id}-${i}`} className="roster-chip shrink-0">
                <AvatarChip name={h.name} id={h.id} idx={i} size="lg" src={h.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-ink truncate">
                    {h.name || 'Anonymous'}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {h.lastGame}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-12 pointer-events-none bg-gradient-to-r from-surface to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-surface to-transparent"></div>
        </div>
      )}
    </section>
  )
}

/* ── COMMUNITY / SOCIALS ──────────────────────────────────────────── */
const SOCIALS = [
  { name: 'Telegram',  handle: 't.me/nerfsg',                          members: '1.2k', href: 'https://t.me/nerfsg' },
  { name: 'Facebook',  handle: 'facebook.com/groups/nerfsingapore',    members: '4.8k', href: 'https://www.facebook.com/groups/nerfsingapore/' },
  { name: 'TikTok',    handle: '@nerfsg',                              members: '920',  href: 'https://www.tiktok.com/@nerfsg' },
  { name: 'YouTube',   handle: '@nerfsg',                              members: '1.5k', href: 'https://www.youtube.com/@nerfsg' },
]

function WatchAndConnect() {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-12 gap-10">
        {/* YouTube embed */}
        <div className="lg:col-span-7">
          <p className="section-label">Watch</p>
          <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">See how it looks.</h2>
          <p className="text-muted mt-2">Highlights and gameplay from recent games.</p>
          <div className="mt-6 aspect-video rounded-xl overflow-hidden border border-border bg-surface">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLZubcuDLCLdmFUJJuhe0Gy-g3Nf5jdWsj"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="NerfSG highlights"
              loading="lazy"
            />
          </div>
        </div>

        {/* Social links */}
        <div className="lg:col-span-5">
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
                <div className="text-sm text-muted truncate flex-1">{c.handle}</div>
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
          <span className="font-display font-black text-xl text-ink tracking-tight">
            <span className="text-red">NERF</span>SG
          </span>
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

  return (
    <>
      <Hero data={data} />
      <AppShowcase />
      <WhatToBring />
      <CommunityStats data={data} />
      <GameModesSection />
      <Roster data={data} />
      <PastGames data={data} />
      <WatchAndConnect />
      <SiteFooter />
    </>
  )
}
