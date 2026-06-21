import { useMemo } from 'react'
import { useAllGamedays, extractParticipants, deriveStats } from '../hooks/useGamedays'
import AvatarChip from '../components/AvatarChip'

function buildAttendeeBoard(all) {
  const now = Date.now()
  const map = new Map()
  for (const g of all) {
    const ts = g.scheduledFor || g.createdAt
    if (!ts || ts > now) continue
    for (const p of extractParticipants(g)) {
      if (!map.has(p.id)) map.set(p.id, { id: p.id, name: p.name, avatarUrl: p.avatarUrl, count: 0 })
      const entry = map.get(p.id)
      entry.count++
      if (!entry.name && p.name) entry.name = p.name
      if (!entry.avatarUrl && p.avatarUrl) entry.avatarUrl = p.avatarUrl
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 30)
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { loading, all } = useAllGamedays()

  const { attendees, hosts } = useMemo(() => {
    if (!all.length) return { attendees: [], hosts: [] }
    const stats = deriveStats(all)
    return {
      attendees: buildAttendeeBoard(all),
      hosts: stats.topHosts,
    }
  }, [all])

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <p className="section-label">Community</p>
          <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">Leaderboard.</h1>
          <p className="text-muted mt-2 max-w-xl">Top operators ranked by games attended. Updated live from every RSVP in the system.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top attendees */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl uppercase tracking-tight text-ink">Top Operators</h2>
              <span className="text-xs font-semibold text-muted tracking-widest uppercase">Games attended</span>
            </div>

            {loading ? (
              <div className="card divide-y divide-border">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                    <div className="w-6 h-4 bg-border rounded" />
                    <div className="w-8 h-8 rounded-full bg-border" />
                    <div className="flex-1 h-4 bg-border rounded" />
                    <div className="w-8 h-4 bg-border rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card divide-y divide-border">
                {attendees.map((op, i) => (
                  <div key={op.id} className="flex items-center gap-4 px-4 py-3">
                    <span className="w-6 text-center text-sm shrink-0">
                      {i < 3 ? MEDALS[i] : <span className="text-xs font-semibold text-muted tabular">{i + 1}</span>}
                    </span>
                    <AvatarChip name={op.name} id={op.id} idx={i} src={op.avatarUrl} />
                    <span className="flex-1 text-sm font-semibold text-ink truncate">
                      {op.name || <span className="text-muted italic">Op-{op.id.slice(0, 5).toUpperCase()}</span>}
                    </span>
                    <span className="text-sm font-bold text-red tabular shrink-0">{op.count}</span>
                  </div>
                ))}
                {attendees.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted">No data yet.</div>
                )}
              </div>
            )}
          </div>

          {/* Top hosts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl uppercase tracking-tight text-ink">Top Hosts</h2>
              <span className="text-xs font-semibold text-muted tracking-widest uppercase">Games hosted</span>
            </div>

            {loading ? (
              <div className="card divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                    <div className="w-6 h-4 bg-border rounded" />
                    <div className="flex-1 h-4 bg-border rounded" />
                    <div className="w-8 h-4 bg-border rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card divide-y divide-border">
                {hosts.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-6 text-center text-sm shrink-0">
                      {i < 3 ? MEDALS[i] : <span className="text-xs font-semibold text-muted tabular">{i + 1}</span>}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink truncate">{name}</span>
                    <span className="text-sm font-bold text-red tabular shrink-0">{count}</span>
                  </div>
                ))}
                {hosts.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted">No data yet.</div>
                )}
              </div>
            )}

            <div className="mt-4 card p-4 border-red/20 bg-red/[.02]">
              <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">Want on the board?</div>
              <p className="text-sm text-muted mt-1">Download the NerfSG app and RSVP to the next game to start climbing.</p>
              <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red text-xs mt-3 inline-flex">
                Get the app →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
