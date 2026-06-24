import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// Public roadmap = the READ side of the in-app voting board. Voting/proposing
// stays in the app (real identity + attendance gating); this page is a curated,
// read-only window for newcomers and regulars.
//
// COST: reads ONE summary document (`public/roadmap`), not the whole
// featureRequests collection — and caches it for an hour, so repeat visits do
// zero Firestore reads. At community scale this stays comfortably inside the
// Firestore free tier (~$0). No realtime listener, no Cloud Function.
//
// The app's admin writes/refreshes `public/roadmap` with the curated items
// (statuses: in_progress | planned | shipped). Until that doc exists, the read
// falls back to the static plan below.
const CACHE_KEY = 'nerfsg_roadmap_v1'
const TTL = 60 * 60 * 1000 // 1 hour

const FALLBACK = [
  { id: 'f1', status: 'in_progress', category: 'Community', title: 'Feature voting board',
    blurb: 'Propose ideas and upvote what you want next — right inside the app.' },
  { id: 'f2', status: 'planned', category: 'Squads', title: 'Squad Wars season',
    blurb: 'Squad-vs-squad standings and a fresh season to climb.' },
  { id: 'f3', status: 'planned', category: 'Newcomers', title: 'Bring-a-friend onboarding',
    blurb: 'A smoother first-game flow, plus perks for bringing a mate along.' },
  { id: 'f4', status: 'planned', category: 'Between games', title: 'Daily & weekly missions',
    blurb: 'Little challenges to keep the streak going between meetups.' },
  { id: 'f5', status: 'shipped', category: 'Live', title: 'Quiz nights', shippedAt: 5,
    blurb: 'Kahoot-style trivia you can host and play on the field.' },
  { id: 'f6', status: 'shipped', category: 'Compete', title: 'Tournament brackets', shippedAt: 4,
    blurb: 'Single & double elim, round robin, and Swiss — all in-app.' },
  { id: 'f7', status: 'shipped', category: 'Profile', title: 'Operator stats & ranks', shippedAt: 3,
    blurb: 'Career stats, ranks and medals that build up every game day.' },
  { id: 'f8', status: 'shipped', category: 'Share', title: 'Stats card to IG story', shippedAt: 2,
    blurb: 'Export your operator card and post it straight to your story.' },
]

const COLUMNS = [
  { key: 'in_progress', label: 'Building now' },
  { key: 'planned',     label: 'Up next' },
  { key: 'shipped',     label: 'Just shipped' },
]

function readCache() {
  try {
    const { t, items } = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') || {}
    if (!items || Date.now() - t > TTL) return null
    return items
  } catch { return null }
}
function writeCache(items) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items })) } catch { /* private mode */ }
}

function Badge({ status }) {
  if (status === 'in_progress')
    return <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red/10 text-red border border-red/20">Building</span>
  if (status === 'planned')
    return <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface text-muted border border-border">Planned</span>
  return <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20">Shipped</span>
}

function rank(r) {
  return (r.voteCount ?? r.shippedAt ?? 0)
}

export default function Roadmap() {
  // Cache hit → render instantly with ZERO Firestore reads.
  const [items, setItems] = useState(() => readCache())

  useEffect(() => {
    if (items) return // fresh cache → skip the network entirely
    let alive = true
    ;(async () => {
      let resolved = FALLBACK
      try {
        const snap = await getDoc(doc(db, 'public', 'roadmap')) // single doc, one-time read
        const live = snap.exists() ? (snap.data().items || []) : null
        if (live && live.length) resolved = live
      } catch { /* not published / offline → static fallback */ }
      if (alive) { setItems(resolved); writeCache(resolved) } // cache bounds reads to ≤1/visitor/hour
    })()
    return () => { alive = false }
  }, [items])

  const loading = items === null
  const byStatus = (key) =>
    (items || []).filter(r => r.status === key).sort((a, b) => rank(b) - rank(a)).slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Header strip */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <p className="section-label">The Roadmap</p>
          <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">What we're building.</h1>
          <p className="text-muted mt-2 max-w-xl">Shaped by players, not a boardroom. Here's what's in the works, what's next, and what just dropped. Want a say? The voting lives in the app.</p>
        </div>
      </section>

      {/* Columns */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COLUMNS.map(col => {
            const rows = byStatus(col.key)
            return (
              <div key={col.key}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl uppercase tracking-tight text-ink">{col.label}</h2>
                  {!loading && <span className="text-xs font-semibold text-muted tabular">{rows.length}</span>}
                </div>

                {loading ? (
                  <div className="card divide-y divide-border">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 animate-pulse">
                        <div className="h-4 w-2/3 bg-border rounded" />
                        <div className="h-3 w-full bg-border rounded mt-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card divide-y divide-border">
                    {rows.map(r => (
                      <div key={r.id} className="px-4 py-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold text-ink text-balance">{r.title}</span>
                          <Badge status={r.status} />
                        </div>
                        {r.blurb && <p className="text-sm text-muted mt-1">{r.blurb}</p>}
                        {r.category && (
                          <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-muted mt-2">{r.category}</span>
                        )}
                      </div>
                    ))}
                    {rows.length === 0 && (
                      <div className="p-8 text-center text-sm text-muted">Nothing here yet.</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 card p-6 lg:p-8 border-red/20 bg-red/[.02] text-center">
          <h3 className="font-display text-2xl uppercase tracking-tight text-ink">Got an idea?</h3>
          <p className="text-muted mt-2 max-w-md mx-auto">This roadmap is voted on by the people who show up. Suggest a feature and upvote what you want next — it's all in the app.</p>
          <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red mt-4 inline-flex">
            Suggest &amp; vote in the app →
          </a>
        </div>
      </section>
    </div>
  )
}
