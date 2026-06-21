import { useMemo, useState, useEffect } from 'react'
import { useAllGamedays, extractParticipants } from '../hooks/useGamedays'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function LightboxModal({ game, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const ts = game.scheduledFor || game.createdAt
  const ops = extractParticipants(game).length

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-10" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm" />
      <div className="relative max-w-4xl w-full flex flex-col gap-3" onClick={e => e.stopPropagation()}>
        <img
          src={game.groupPhoto}
          alt={game.name || 'Game photo'}
          className="w-full max-h-[75vh] object-contain"
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl text-white uppercase tracking-tight">
              {game.name || 'Untitled game'}
            </div>
            <div className="text-sm text-white/50 mt-0.5">
              {ts ? formatDate(ts) : '—'}
              {game.location ? ` · ${game.location}` : ''}
              {` · ${ops} operators`}
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none shrink-0 px-2">×</button>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { loading, all } = useAllGamedays()
  const [selected, setSelected] = useState(null)

  const photos = useMemo(() => {
    const now = Date.now()
    return all
      .filter(g => {
        const ts = g.scheduledFor || g.createdAt
        return g.groupPhoto && ts && ts <= now
      })
      .sort((a, b) => (b.scheduledFor || b.createdAt) - (a.scheduledFor || a.createdAt))
  }, [all])

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <p className="section-label">On the field</p>
          <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">Gallery.</h1>
          <p className="text-muted mt-2 max-w-xl">Group photos from every game. {!loading && photos.length > 0 && `${photos.length} photos and counting.`}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-sm text-muted">No group photos yet. They appear here after each game.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {photos.map(g => {
              const ts = g.scheduledFor || g.createdAt
              const ops = extractParticipants(g).length
              return (
                <button
                  key={g.id}
                  onClick={() => setSelected(g)}
                  className="group relative aspect-[4/3] overflow-hidden bg-surface border border-border text-left cursor-pointer"
                >
                  <img
                    src={g.groupPhoto}
                    alt={g.name || 'Game photo'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="font-display text-sm text-white uppercase tracking-tight truncate">
                      {g.name || 'Untitled'}
                    </div>
                    <div className="text-[11px] text-white/60 mt-0.5">
                      {ts ? formatDate(ts) : '—'}{ops > 0 ? ` · ${ops} ops` : ''}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {selected && <LightboxModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
