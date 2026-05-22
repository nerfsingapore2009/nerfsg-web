import { useMemo, useState, useEffect } from 'react'
import { useAllGamedays, deriveStats, extractParticipants } from '../hooks/useGamedays'
import { Brk, useCountUp, useCountdown } from '../components/Hud'
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

/* ── NEXT OP CARD ─────────────────────────────────────────────────── */
function NextOpCard({ event, loading, error, queue = [] }) {
  const targetMs = event?.scheduledFor || (Date.now() + 86400000)
  const cd  = useCountdown(targetMs)
  const fmt = event ? formatGameday(event) : null

  return (
    <div className="relative bg-panel border border-line2 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-panel2 border-b border-line">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-zinc-500' : 'bg-foam pulse-dot'}`}></span>
          <span className="font-mono text-[10.5px] tracking-[.2em] uppercase text-foam">
            {loading ? 'Connecting…' : event ? 'Next Game' : 'No upcoming games'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">
          {loading ? 'LIVE·DB' : event ? `#${(event.id || '').slice(0,6).toUpperCase()}` : 'TBA'}
        </span>
      </div>

      <div className="p-5">
        {loading && (
          <div className="animate-pulse">
            <div className="h-7 bg-line/60 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-line/40 rounded w-1/2 mb-5"></div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[0,1,2,3].map(i => <div key={i} className="h-16 bg-line/30 rounded"></div>)}
            </div>
            <div className="h-9 bg-line/40 rounded"></div>
          </div>
        )}

        {!loading && !event && (
          <div className="py-2">
            <h3 className="font-display text-2xl text-white tracking-tight">No upcoming games right now</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Games are usually announced on Facebook first. Check the group for the next drop.
            </p>
            {error && <p className="font-mono text-[10px] text-danger mt-3">// err: {error}</p>}
            <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
              data-hit className="mt-4 inline-flex items-center gap-2 bg-foam hover:bg-foam2 text-white font-bold uppercase tracking-[.18em] text-[12px] px-4 py-2.5 rounded-md transition-colors">
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
                <div className="mb-4 -mt-1 rounded overflow-hidden border border-line aspect-[16/8]">
                  <img src={event.groupPhoto} alt={event.name || 'Game photo'} className="w-full h-full object-cover" loading="lazy" decoding="async"/>
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-display text-3xl text-white tracking-tight truncate">{event.name || 'Untitled game'}</h3>
                  <div className="text-zinc-400 text-sm mt-1">
                    {fmt.date} · {fmt.time}{event.location ? ` · ${event.location}` : ''}
                  </div>
                  {event.hostName && (
                    <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.14em] mt-1.5">
                      HOSTED BY <span className="text-foam">{event.hostName.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-zombie border border-zombie/40 bg-zombie/10 px-2 py-1 rounded">
                    {maxSlots ? `${yesCount}/${maxSlots}` : `${yesCount} IN`}
                  </span>
                  {isPaid && event.entryFee > 0 && (
                    <span className="font-mono text-[10px] text-foam border border-foam/40 bg-foam/10 px-2 py-1 rounded">
                      ${event.entryFee}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {[{v:cd.days,l:'DAYS'},{v:cd.hours,l:'HRS'},{v:cd.mins,l:'MIN'},{v:cd.secs,l:'SEC'}].map((c,i) => (
                  <div key={i} className="bg-ink border border-line rounded text-center py-3">
                    <div className="font-display font-bold text-3xl text-white tabular-nums">{String(c.v).padStart(2,'0')}</div>
                    <div className="font-mono text-[9.5px] text-zinc-500 tracking-[.18em] mt-1">{c.l}</div>
                  </div>
                ))}
              </div>

              {(event.note || event.fieldNotes) && (
                <>
                  <div className="text-[11px] font-mono text-zinc-500 tracking-[.16em] mb-2">FIELD NOTES</div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(event.note || event.fieldNotes).split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map((tag, i) => (
                      <span key={i} className="chip">{tag}</span>
                    ))}
                  </div>
                </>
              )}

              {participants.length > 0 && (
                <div className="mb-5">
                  <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">ON THE ROSTER</div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {participants.slice(0, 6).map((p, i) => (
                        <AvatarChip key={p.id} name={p.name} id={p.id} idx={i} src={p.avatarUrl} />
                      ))}
                    </div>
                    {participants.length > 6 && (
                      <span className="font-mono text-[11px] text-zinc-400 tracking-[.14em] ml-1">
                        +{participants.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <a href="https://nerf-singapore.web.app" target="_blank" rel="noopener noreferrer"
                data-hit className="w-full bg-foam hover:bg-foam2 text-white font-bold uppercase tracking-[.2em] text-[13px] py-3 rounded-md transition-colors flex items-center justify-center gap-2">
                <span>RSVP on the app</span>
                <span className="font-mono text-[10px] opacity-80">↵</span>
              </a>

              {queue.length > 0 && (
                <div className="mt-5 pt-4 border-t border-line">
                  <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">UPCOMING GAMES</div>
                  <ul className="flex flex-col gap-1.5">
                    {queue.map(q => {
                      const qf = formatGameday(q)
                      return (
                        <li key={q.id} className="flex items-center justify-between gap-2 text-[12px]">
                          <span className="text-zinc-300 truncate font-medium">{q.name || 'Untitled'}</span>
                          <span className="font-mono text-[10px] text-zinc-500 shrink-0">{qf.date} · {qf.time}</span>
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

  const yearGames = useCountUp(stats?.yearGames || 0, 1400)
  const yearOps   = useCountUp(stats?.yearOperators || 0, 1600)
  const yearRsvps = useCountUp(stats?.yearRsvps || 0, 1800)
  const totalAll  = useCountUp(stats?.totalAllTime || 0, 1200)

  return (
    <section className="relative grid-bg-strong overflow-hidden border-b border-line">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="wordmark">NERFSG</span>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 reveal">
          <Brk>EST. 2009 · SINGAPORE · GMT+8</Brk>
          <h1 className="font-display font-black text-white leading-[.9] tracking-tight mt-5 uppercase">
            <span className="block text-[clamp(48px,7vw,108px)]">Singapore&apos;s</span>
            <span className="block text-[clamp(48px,7vw,108px)]">
              <span className="text-foam">Foam</span>
              <span className="mx-2 text-zinc-700">/</span>
              <span>Front Line.</span>
            </span>
          </h1>
          <p className="text-zinc-400 text-base lg:text-lg mt-6 max-w-xl">
            Weekly indoor &amp; outdoor games, HvZ runs, and open community blasts — from CBD parks to abandoned camps.
            Bring a blaster, bring eye-pro, find your people.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <a href="https://nerf-singapore.web.app" target="_blank" rel="noopener noreferrer"
              data-hit className="bg-foam hover:bg-foam2 text-white font-bold uppercase tracking-wider text-sm px-6 py-3.5 rounded-md transition-colors flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
              </svg>
              Join next game
            </a>
            <a href="https://www.facebook.com/groups/nerfsingapore/" target="_blank" rel="noopener noreferrer"
              data-hit className="bg-panel2 hover:bg-line border border-line hover:border-foam/40 text-white font-bold uppercase tracking-wider text-sm px-6 py-3.5 rounded-md transition-colors">
              View briefings
            </a>
          </div>

          <div className="grid grid-cols-4 gap-px mt-10 bg-line rounded-lg overflow-hidden border border-line">
            {[
              { lbl: `GAMES · ${stats?.year || new Date().getFullYear()}`, val: yearGames.toLocaleString() },
              { lbl: 'OPERATORS YTD', val: yearOps.toLocaleString() },
              { lbl: 'RSVPS YTD',     val: yearRsvps.toLocaleString() },
              { lbl: 'ALL-TIME',      val: totalAll.toLocaleString() },
            ].map(s => (
              <div key={s.lbl} className="bg-panel px-3 py-3">
                <div className="font-mono text-[9.5px] text-zinc-500 tracking-[.16em]">{s.lbl}</div>
                <div className="font-display font-bold text-2xl lg:text-3xl text-white mt-1 tabular-nums">
                  {loading ? '—' : s.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 reveal d2">
          <NextOpCard event={nextEvent} loading={loading} error={error} queue={queue} />
        </div>
      </div>
    </section>
  )
}

/* ── FIELD ESSENTIALS ─────────────────────────────────────────────── */
const ESSENTIALS = [
  { code:'01', name:'Eye protection', req:'REQUIRED',
    note:'ANSI-rated goggles or ballistic eye-pro. Sunglasses don\'t count. We sell spares on-site for $5.' },
  { code:'02', name:'A blaster', req:'BYO',
    note:'Stock or modded — both welcome. New? Borrow loaners at any open game. Chrono done before play.' },
  { code:'03', name:'Foam darts', req:'BYO ~300',
    note:'Half-darts only at indoor venues. Full-length OK outdoors. Lost darts are part of the deal.' },
  { code:'04', name:'FPS limit', req:'120 FPS',
    note:'Standard cap. HvZ outdoor goes up to 150 with PVP rules. Sniper class? Chrono at the door.' },
  { code:'05', name:'Closed shoes', req:'REQUIRED',
    note:'You will sprint, slide, and dive. Sandals get you sat out.' },
  { code:'06', name:'Hydration', req:'BRING IT',
    note:'SG humidity is no joke. Refills available at most venues.' },
]

function FieldEssentials() {
  return (
    <section className="relative border-b border-line bg-panel/30">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <Brk>// Before you show up</Brk>
            <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">Field Essentials.</h2>
            <p className="text-zinc-400 mt-2 max-w-xl">Six things to sort before your first game. Hosts will chrono blasters at the door.</p>
          </div>
          <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.18em]">SAFETY · GEAR · LOGISTICS</div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESSENTIALS.map(e => {
            const isRequired = e.req === 'REQUIRED'
            return (
              <div key={e.code} className="bg-panel border border-line2 rounded-lg p-5 flex flex-col gap-3 lift hover:border-foam/40">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-4xl text-foam/20 leading-none">{e.code}</span>
                  <span className={`font-mono text-[10px] tracking-[.18em] px-2 py-1 rounded border ${
                    isRequired ? 'text-danger border-danger/40 bg-danger/10' : 'text-zinc-400 border-line bg-ink'
                  }`}>{e.req}</span>
                </div>
                <h3 className="font-display text-xl text-white uppercase tracking-tight">{e.name}</h3>
                <p className="text-zinc-400 text-[13px] leading-relaxed">{e.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── YEAR IN FOAM ─────────────────────────────────────────────────── */
function YearInFoam({ data }) {
  const { loading, stats, all = [] } = data
  const year  = stats?.year || new Date().getFullYear()
  const games = useCountUp(stats?.yearGames || 0, 1400)
  const ops   = useCountUp(stats?.yearOperators || 0, 1500)
  const rsvps = useCountUp(stats?.yearRsvps || 0, 1700)

  return (
    <section className="relative border-b border-line">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <Brk>// Live from Firestore</Brk>
            <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">
              Year in foam · <span className="text-foam">{year}</span>
            </h2>
            <p className="text-zinc-400 mt-2 max-w-xl">Tallied across every game in the system. Updates the moment a new game is posted.</p>
          </div>
          <div className="font-mono text-[10.5px] text-foam tracking-[.18em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-foam pulse-dot"></span>
            LIVE DATA
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { lbl: 'GAMES RUN',   val: games.toLocaleString(), hint: `out of ${stats?.totalAllTime || 0} all-time` },
            { lbl: 'UNIQUE OPS',  val: ops.toLocaleString(),   hint: 'distinct operators' },
            { lbl: 'TOTAL RSVPS', val: rsvps.toLocaleString(), hint: 'seats filled' },
          ].map(s => (
            <div key={s.lbl} className="bg-panel border border-line2 rounded-lg p-5">
              <div className="font-mono text-[9.5px] text-zinc-500 tracking-[.18em]">{s.lbl}</div>
              <div className="font-display font-black text-4xl lg:text-5xl text-white mt-2 tabular-nums leading-none">
                {loading ? '—' : s.val}
              </div>
              <div className="font-mono text-[10px] text-zinc-500 mt-3">{s.hint}</div>
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
  { id:'tdm',  code:'01', name:'Team Death Match',    time:'3 min',     lives:'1+ lives',
    blurb:'Last team standing wins.',
    desc:'Both teams try to tag each other out. Time runs out → most players remaining wins.' },
  { id:'ctf',  code:'02', name:'Capture the Flag',    time:'3 min',     lives:'1+ lives',
    blurb:'Bring it home.',
    desc:'Return the centre flag to your start point to win immediately. Flag-carrier tagged → flag drops.' },
  { id:'dom',  code:'03', name:'Domination',          time:'3 min',     lives:'∞ respawn',
    blurb:'Fewest clicks wins.',
    desc:'Counter at each start point. Click when tagged to respawn. Lowest count at time-out takes it.' },
  { id:'koth', code:'04', name:'King of the Hill',    time:'5 min',     lives:'∞ respawn',
    blurb:'Hold the chess clock.',
    desc:'A chess clock sits centre. Press your side to start your timer. Longest hold wins.' },
  { id:'cd',   code:'05', name:'Clicker Domination',  time:'3 min',     lives:'∞ respawn',
    blurb:'Most clicks wins.',
    desc:'Two clickers at centre, one per team. Click yours to score. Highest count wins.' },
  { id:'hvz',  code:'06', name:'Humans vs Zombies',   time:'15-30 min', lives:'convert on tag',
    blurb:'Foam vs the horde.',
    desc:'Humans run blasters & stun timers. Zombies tag bare-handed to convert. Survive — or build the swarm.' },
]

function GameModes() {
  const [flipped, setFlipped] = useState(null)
  return (
    <section className="relative border-b border-line">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-3">
          <div>
            <Brk>// How we play</Brk>
            <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">Game Modes</h2>
            <p className="text-zinc-400 mt-2 max-w-xl">Tap a card to flip and read the rules.</p>
          </div>
          <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.18em]">06 STANDARD FORMATS</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map(m => {
            const isFlipped = flipped === m.id
            return (
              <div key={m.id} className="flip-card h-[320px]" data-hit onClick={() => setFlipped(isFlipped ? null : m.id)}>
                <div className="flip-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* FRONT */}
                  <div className="flip-face bg-panel border border-line2 rounded-lg overflow-hidden flex flex-col lift hover:border-foam/40 cursor-pointer">
                    <div className="relative h-44 bg-ink overflow-hidden">
                      <div className="ph-stripes w-full h-full"></div>
                      <div className="absolute top-2 left-2 bg-ink/85 border border-line px-2 py-1 rounded font-mono text-[10px] text-foam tracking-[.18em]">
                        FILE-{m.code}
                      </div>
                      <div className="absolute top-2 right-2 bg-ink/85 border border-line px-2 py-1 rounded font-mono text-[10px] text-zinc-400 tracking-[.18em]">
                        {m.time}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-display text-xl text-white uppercase tracking-tight leading-tight">{m.name}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{m.blurb}</p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
                        <span className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">{m.lives}</span>
                        <span className="font-mono text-[10px] text-foam tracking-[.18em]">FLIP →</span>
                      </div>
                    </div>
                  </div>
                  {/* BACK */}
                  <div className="flip-back flip-face bg-foam text-white rounded-lg p-5 flex flex-col cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] tracking-[.2em] uppercase">// FILE-{m.code}</span>
                      <span className="font-mono text-[10px] tracking-[.18em]">← FLIP</span>
                    </div>
                    <h3 className="font-display text-3xl uppercase tracking-tight mt-3 leading-none">{m.name}</h3>
                    <p className="text-white/95 text-sm mt-3 leading-relaxed flex-1">{m.desc}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30 font-mono text-[10px] tracking-[.18em]">
                      <span>{m.time.toUpperCase()}</span>
                      <span>{m.lives.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
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
    <section className="relative border-b border-line py-12 lg:py-14">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 mb-6 flex items-end justify-between">
        <div>
          <Brk>// On the field</Brk>
          <h2 className="font-display text-3xl lg:text-4xl text-white mt-2 uppercase tracking-tight">Recent operators.</h2>
        </div>
        <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.18em] hidden sm:block">
          {loading ? 'CONNECTING…' : `${handles.length} OPERATORS · LAST 20 GAMES`}
        </div>
      </div>

      {loading || handles.length === 0 ? (
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 font-mono text-[11px] text-zinc-500">
          {loading ? '// loading rsvp data…' : '// no rsvp data yet'}
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="marquee-track flex gap-3 w-[200%]" style={{ animationDuration: '80s' }}>
            {items.map((h, i) => (
              <div key={`${h.id}-${i}`} className="shrink-0 w-64 bg-panel border border-line rounded-lg p-3 flex items-center gap-3">
                <AvatarChip name={h.name} id={h.id} idx={i} size="lg" src={h.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base text-white tracking-tight uppercase truncate">
                    {h.name || `OP-${(h.id || '').slice(0,4).toUpperCase()}`}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 tracking-[.14em] truncate">
                    LAST: {h.lastGame.toUpperCase()}
                  </div>
                </div>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-zombie pulse-dot shrink-0"></span>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-12 pointer-events-none"
            style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)', background: 'var(--color-ink, #0a0a0b)' }}></div>
          <div className="absolute inset-y-0 right-0 w-12 pointer-events-none"
            style={{ maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)', background: 'var(--color-ink, #0a0a0b)' }}></div>
        </div>
      )}
    </section>
  )
}

/* ── WATCH + JOIN ─────────────────────────────────────────────────── */
function WatchAndJoin() {
  return (
    <section className="relative border-b border-line">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Brk>// Footage</Brk>
          <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">Watch the action.</h2>
          <p className="text-zinc-400 mt-2">Highlights and gameplay from recent games.</p>
          <div className="mt-6 aspect-video rounded-lg overflow-hidden border border-line2 bg-ink">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLZubcuDLCLdmFUJJuhe0Gy-g3Nf5jdWsj"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="NerfSG footage"
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Brk>// Comms</Brk>
          <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">Join comms.</h2>
          <p className="text-zinc-400 mt-2">Event drops, scrim invites, gear talk.</p>

          <div className="mt-6 flex flex-col gap-2.5">
            {[
              { name:'Telegram', handle:'t.me/nerfsg',                           members:'1.2k', color:'#33a3e0', icon:'TG', href:'https://t.me/nerfsg' },
              { name:'Facebook', handle:'facebook.com/groups/nerfsingapore',     members:'4.8k', color:'#3b75f1', icon:'FB', href:'https://www.facebook.com/groups/nerfsingapore/' },
              { name:'TikTok',   handle:'@nerfsg',                               members:'920',  color:'#ffffff', icon:'TT', href:'https://www.tiktok.com/@nerfsg' },
              { name:'YouTube',  handle:'@nerfsg',                               members:'1.5k', color:'#ff3d57', icon:'YT', href:'https://www.youtube.com/@nerfsg' },
            ].map(c => (
              <a data-hit key={c.name} href={c.href} target="_blank" rel="noopener noreferrer"
                className="lift bg-panel border border-line hover:border-foam/40 rounded-lg p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded flex items-center justify-center font-display font-black text-sm"
                  style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}66` }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg text-white uppercase tracking-tight">{c.name}</div>
                  <div className="font-mono text-[11px] text-zinc-500 truncate">{c.handle}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-white tabular-nums">{c.members}</div>
                  <div className="font-mono text-[10px] text-zinc-500 tracking-[.16em]">MEMBERS</div>
                </div>
                <span className="text-foam font-mono text-sm">→</span>
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
    <footer className="border-t border-line bg-panel/40">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-xl text-white tracking-tight">
            <span className="text-foam">NERF</span>SG
          </span>
          <span className="font-mono text-[11px] text-zinc-500 tracking-[.16em]">// EST. 2009 · SG</span>
        </div>
        <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.16em]">
          © {new Date().getFullYear()} NerfSG · stay foam, stay sharp.
        </div>
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
      <div className="tick-row"></div>
      <FieldEssentials />
      <div className="tick-row"></div>
      <YearInFoam data={data} />
      <div className="tick-row"></div>
      <GameModes />
      <div className="tick-row"></div>
      <Roster data={data} />
      <div className="tick-row"></div>
      <PastGames data={data} />
      <div className="tick-row"></div>
      <WatchAndJoin />
      <SiteFooter />
    </>
  )
}
