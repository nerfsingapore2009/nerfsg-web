import { useEffect, useState, useCallback } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import EventCard from '../components/EventCard'
import PageHeader from '../components/PageHeader'
import { TelegramIcon } from '../components/icons'
import { usePageTitle } from '../lib/usePageTitle'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  usePageTitle('Events')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const now = Date.now()
      const q = query(
        collection(db, 'gamedays'),
        where('scheduledFor', '>=', now),
        orderBy('scheduledFor', 'asc')
      )
      const snap = await getDocs(q)
      const upcoming = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(e => e.status !== 'ended')
      setEvents(upcoming)
    } catch (err) {
      setError('Could not load events.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return (
    <div className="min-h-screen page-enter">
      <PageHeader
        eyebrow="Schedule"
        title="Upcoming games."
        subtitle="Weekends at parks across Singapore. Open to all skill levels. Sign up on the NerfSG app to RSVP."
        width="max-w-6xl"
      />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" aria-label="Loading events" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-muted">{error}</p>
            <button onClick={fetchEvents} className="btn-ghost mt-5">
              Try again
            </button>
          </div>
        ) : events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <div key={event.id} className="card-enter" style={{ '--i': i }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-20 max-w-sm mx-auto">
      <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-ink font-semibold text-lg">No games scheduled yet</h2>
      <p className="text-muted text-sm mt-2 leading-relaxed">
        Game dates are announced on Telegram first. Join to get notified when the next session drops.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-7 w-full justify-center">
        <a
          href="https://t.me/+MbMLovtcLyVmYzhl"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red justify-center"
        >
          <TelegramIcon />
          Join Telegram
        </a>
        <a
          href="https://nerfsg.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost justify-center"
        >
          Get the app
        </a>
      </div>
    </div>
  )
}
