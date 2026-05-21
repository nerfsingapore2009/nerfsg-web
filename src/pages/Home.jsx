import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import EventCard from '../components/EventCard'

const SOCIAL_LINKS = [
  {
    label: 'Telegram',
    href: 'https://t.me/nerfsg',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.67l-2.906-.907c-.63-.197-.643-.63.136-.93l11.35-4.376c.526-.19.987.13.124.764z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nerfsg',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@nerfsg',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
]

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        // DEBUG: no date filter — fetch all events to confirm Firestore is returning data
        const now = Date.now()
        const q = query(
          collection(db, 'gamedays'),
          where('scheduledFor', '>=', now),
          orderBy('scheduledFor', 'asc'),
          limit(6)
        )
        const snap = await getDocs(q)
        const upcoming = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(e => e.status !== 'ended')
          .slice(0, 3)
        setUpcomingEvents(upcoming)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 py-24 md:py-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
            Singapore's Nerf Community
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Gear Up. Show Up.<br />
            <span className="text-orange-500">Blast Away.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join hundreds of Nerfers across Singapore for organised events, HvZ games, and foam-flinging fun.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://nerf-singapore.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Download the App
            </a>
            <Link
              to="/events"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Upcoming Games</h2>
          <Link to="/events" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No upcoming events right now. Check back soon!</p>
        )}
      </section>

      {/* YouTube Section */}
      <section className="px-4 py-16 bg-[#1a1a1a] border-y border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Watch the Action</h2>
          <p className="text-gray-400 mb-8">Catch highlights and gameplay footage from our community events.</p>
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#2a2a2a]">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLZubcuDLCLdmFUJJuhe0Gy-g3Nf5jdWsj"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="NerfSG footage"
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="px-4 py-16 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Join the Community</h2>
        <p className="text-gray-400 mb-8">Stay connected for event announcements, tips, and more.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 hover:text-white px-5 py-3 rounded-lg transition-colors font-medium"
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
