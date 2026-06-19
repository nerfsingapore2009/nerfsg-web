import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import EventCard from '../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEvents() {
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
        console.error('Failed to fetch events:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
          <p className="section-label">Schedule</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">Upcoming Events</h1>
          <p className="text-muted mt-2">All scheduled games and events. Download the app to sign up.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red text-center py-16">{error}</p>
        ) : events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted text-lg">No upcoming events scheduled.</p>
            <p className="text-muted/60 text-sm mt-2">Check back soon or follow us on Telegram for announcements.</p>
          </div>
        )}
      </div>
    </div>
  )
}
