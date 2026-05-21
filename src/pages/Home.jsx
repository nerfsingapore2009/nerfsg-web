import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import EventCard from '../components/EventCard'

const SOCIAL_LINKS = [
  {
    label: 'Join Telegram',
    href: 'https://t.me/nerfsg',
    cardClass: 'bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border-[#0088cc]/30 text-[#0088cc]',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.67l-2.906-.907c-.63-.197-.643-.63.136-.93l11.35-4.376c.526-.19.987.13.124.764z" />
      </svg>
    ),
  },
  {
    label: 'Join Facebook Group',
    href: 'https://www.facebook.com/groups/nerfsingapore/',
    cardClass: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 text-[#1877F2]',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Follow TikTok',
    href: 'https://www.tiktok.com/@nerfsg',
    cardClass: 'bg-white/5 hover:bg-white/10 border-white/20 text-white',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
]

const COMMUNITY_STATS = [
  { icon: '🏆', label: 'Est. 2009', desc: '16+ years of foam' },
  { icon: '🎯', label: 'Weekly Games', desc: 'Regular events all year' },
  { icon: '🌏', label: 'International Events', desc: 'Foam Invaders & more' },
  { icon: '👥', label: 'Open Community', desc: 'All skill levels welcome' },
]

const JOIN_STEPS = [
  {
    step: '01',
    emoji: '📱',
    title: 'Download the App',
    desc: 'Get the NerfSG app to browse events, register, and connect with the community.',
    href: 'https://nerf-singapore.web.app',
    linkLabel: 'Get the App →',
  },
  {
    step: '02',
    emoji: '🗓️',
    title: 'Check Upcoming Events',
    desc: 'Browse the events calendar and find a game near you. New sessions added regularly.',
    to: '/events',
    linkLabel: 'View Events →',
  },
  {
    step: '03',
    emoji: '🎯',
    title: 'Show Up & Play',
    desc: 'Bring your blaster, wear eye protection, and have fun. No experience needed.',
  },
]

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
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

      {/* ── HERO ── */}
      <section className="relative px-4 pt-24 pb-20 md:pt-36 md:pb-28 text-center overflow-hidden">
        {/* CSS grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial orange glow from top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 70%)' }}
        />
        {/* Diagonal accent strip */}
        <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none bg-gradient-to-l from-orange-500/5 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.3em] uppercase mb-6 border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 rounded-full">
            Est. 2009 · Singapore
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6 uppercase">
            <span className="block">Singapore's #1</span>
            <span className="block text-orange-500">Nerf Community</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Weekly events, HvZ games, and foam-flinging fun — open to everyone.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a
              href="https://nerf-singapore.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-lg transition-colors text-base"
            >
              Download the App
            </a>
            <Link
              to="/events"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-orange-500/40 text-white font-bold px-8 py-3 rounded-lg transition-all text-base"
            >
              View Events
            </Link>
          </div>

          {/* Live stats bar */}
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-gray-500 border-t border-[#2a2a2a] pt-8">
            <span className="flex items-center gap-1.5"><span>🎯</span> Since 2009</span>
            <span className="text-[#333] hidden sm:block">•</span>
            <span className="flex items-center gap-1.5"><span>📍</span> Singapore</span>
            <span className="text-[#333] hidden sm:block">•</span>
            <span className="flex items-center gap-1.5"><span>🗓️</span> Weekly Games</span>
            <span className="text-[#333] hidden sm:block">•</span>
            <span className="flex items-center gap-1.5"><span>👥</span> Open to All</span>
          </div>
        </div>
      </section>

      {/* ── UPCOMING GAMES ── */}
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
          <div className="flex flex-col items-center justify-center py-16 gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <span className="text-4xl">🎯</span>
            <p className="text-white font-semibold">No upcoming events right now</p>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              Games are announced on Facebook first. Check our group for the latest.
            </p>
            <a
              href="https://www.facebook.com/groups/nerfsingapore/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Check our Facebook →
            </a>
          </div>
        )}
      </section>

      {/* ── COMMUNITY STATS ── */}
      <section className="bg-[#1a1a1a] border-y border-[#2a2a2a] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITY_STATS.map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2 p-6 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] hover:border-orange-500/30 transition-colors"
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-white font-bold text-base">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO JOIN ── */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How to Join</h2>
          <p className="text-gray-400">Three steps to your first game.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {JOIN_STEPS.map(({ step, emoji, title, desc, href, to, linkLabel }) => (
            <div
              key={step}
              className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-3 hover:border-orange-500/30 transition-colors"
            >
              <span className="text-5xl font-black text-orange-500/20 leading-none select-none absolute top-4 right-5">
                {step}
              </span>
              <span className="text-3xl">{emoji}</span>
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-grow">{desc}</p>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 text-sm font-semibold transition-colors mt-1"
                >
                  {linkLabel}
                </a>
              )}
              {to && (
                <Link
                  to={to}
                  className="text-orange-500 hover:text-orange-400 text-sm font-semibold transition-colors mt-1"
                >
                  {linkLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── YOUTUBE ── */}
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

      {/* ── SOCIAL LINKS ── */}
      <section className="px-4 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Join the Community</h2>
        <p className="text-gray-400 mb-10">Stay connected for event announcements, tips, and more.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {SOCIAL_LINKS.map(({ label, href, icon, cardClass }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all hover:-translate-y-1 ${cardClass}`}
            >
              {icon}
              <span className="font-semibold text-sm">{label}</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
