import { useState } from 'react'
import { usePageTitle } from '../lib/usePageTitle'

const MapPin = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
)
const Calendar = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
)
const Trophy = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
)
const Users = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)
const Star = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
)
const ArrowRight = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)
const Activity = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
)
const Zap = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)
const Camera = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
)
const Heart = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
)
const Instagram = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const Facebook = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
const Discord = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18.894 4.344a16.035 16.035 0 0 0-4.04-1.246 11.233 11.233 0 0 0-.583 1.187 14.8 14.8 0 0 0-4.542 0 11.233 11.233 0 0 0-.583-1.187 16.035 16.035 0 0 0-4.04 1.246 16.096 16.096 0 0 0-2.822 10.978 16.142 16.142 0 0 0 5.035 2.536 11.75 11.75 0 0 0 1.084-1.748 9.38 9.38 0 0 1-2.458-1.184 9.61 9.61 0 0 0 .917-.687 11.69 11.69 0 0 0 9.03 0 9.61 9.61 0 0 0 .917.687 9.38 9.38 0 0 1-2.458 1.184 11.75 11.75 0 0 0 1.084 1.748 16.142 16.142 0 0 0 5.035-2.536 16.096 16.096 0 0 0-2.822-10.978z"/><path d="M8.913 14.072c-1.127 0-2.062-1.01-2.062-2.25 0-1.239.907-2.25 2.062-2.25 1.169 0 2.086 1.01 2.062 2.25 0 1.24-.893 2.25-2.062 2.25z"/><path d="M15.087 14.072c-1.169 0-2.062-1.01-2.062-2.25 0-1.239.893-2.25 2.062-2.25 1.155 0 2.086 1.01 2.062 2.25 0 1.24-.907 2.25-2.062 2.25z"/></svg>
)
const Telegram = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
)

const LOCATIONS = [
  { name: 'Hong Lim', count: 9, image: 'https://i.imgur.com/oCvb9W3.jpeg' },
  { name: 'Radin Mas CC', count: 7, image: 'https://i.imgur.com/Hp21ZZ3.jpeg' },
  { name: 'Harmony Park', count: 6, image: 'https://i.imgur.com/XKuG485.jpeg' },
  { name: 'Bukit Purmei Hillock Park', count: 5, image: 'https://i.imgur.com/jrVsl3n.jpeg' },
  { name: 'Jalan Membina Rooftop', count: 4, image: 'https://i.imgur.com/VuZEIhx.jpeg' },
  { name: 'Sunshine Park', count: 3, image: 'https://i.imgur.com/Il4slRS.jpeg' },
  { name: 'Tanglin Halt', count: 3, image: 'https://i.imgur.com/Znk86ap.jpeg' },
  { name: 'Tactsim', count: 3, image: 'https://i.imgur.com/g1Abyb3.jpeg' },
  { name: 'Red Dynasty', count: 2, image: 'https://i.imgur.com/1OfB3s3.jpeg' },
  { name: 'Sengkang Future Park', count: 2, image: 'https://i.imgur.com/7yXFaJG.jpeg' },
  { name: 'Tzu Chi Youth Centre', count: 2, image: 'https://i.imgur.com/O2rIx6A.jpeg' },
  { name: 'Bishan Harmony Park', count: 2, image: 'https://i.imgur.com/UcwEZZT.jpeg' },
  { name: 'Road Safety Park', count: 1, image: 'https://i.imgur.com/qafvz9q.jpeg' },
  { name: 'Serangoon Comm. Park', count: 1, image: 'https://i.imgur.com/OC7v2Bm.jpeg' },
]

const MAJOR_OPS = [
  {
    id: 'anniversary',
    title: 'Sweet 16 Anniversary',
    description: 'Sixteen years of foam flinging! We celebrated this massive milestone with a community chalet and BBQ.',
    tags: ['Chalet', 'BBQ', 'Community'],
    Icon: Calendar,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-900/30',
    link: 'https://www.facebook.com/media/set/?set=oa.4206768849538687&type=3',
    image: 'https://i.imgur.com/aNGYbVE.jpeg',
  },
  {
    id: 'hobbiesfair',
    title: 'Hobbies Fair 2025',
    description: 'We took the hobby to the public! Our boothing effort at Hobbies Fair 2025 introduced a new generation to the sport.',
    tags: ['Outreach', 'Exhibition'],
    Icon: Users,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-900/30',
    link: 'https://www.facebook.com/media/set/?set=oa.1103687404812859&type=3',
    image: 'https://i.imgur.com/rNFknPi.jpeg',
  },
]

const FOAM_INVADERS = {
  title: 'Foam Invaders',
  subtitle: 'Challenge 2025',
  description: 'The highlight of the year. We hosted top teams from the USA, Canada and Germany to face off against Singapore\'s legendary community.',
  image: 'https://i.imgur.com/0T1nHyG.jpeg',
  days: [
    {
      label: 'Day 1',
      title: 'Friday Night Lights',
      description: 'CQB in the dark. Tracer rounds and glow darts lit up the arena for an intense start to the weekend.',
      borderColor: 'border-red-500',
      textColor: 'text-red-500',
      image: 'https://i.imgur.com/BhmrrAc.jpeg',
      link: 'https://www.facebook.com/media/set/?set=oa.1885999878825024&type=3',
    },
    {
      label: 'Day 2',
      title: 'Hold the Hill',
      description: 'The Main Event. A King of the Hill tournament where local strategy met international aggression.',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-500',
      image: 'https://i.imgur.com/nvrSchV.jpeg',
      link: 'https://www.facebook.com/media/set/?set=oa.2141398926336017&type=3',
    },
    {
      label: 'Day 3',
      title: '11th Hour SST',
      description: 'Casual games on iconic maps. A celebration of friendship and the global Nerf spirit to wrap it all up.',
      borderColor: 'border-white',
      textColor: 'text-white',
      image: 'https://i.imgur.com/4T8PKbt.jpeg',
      link: 'https://www.facebook.com/media/set/?set=oa.1403910457292636&type=3',
    },
  ],
}

const PHOTOGRAPHERS = [
  { name: '@yalamphotos', link: 'https://www.instagram.com/yalamphotos/', type: 'ig' },
  { name: '@skijishoots', link: 'https://www.instagram.com/skijishoots/', type: 'ig' },
  { name: '@argus_photos', link: 'https://www.instagram.com/argus_photos/', type: 'ig' },
  { name: '@klseiji.nerf.foam', link: 'https://www.instagram.com/klseiji.nerf.foam/', type: 'ig' },
  { name: 'Tactikal Photography', link: 'https://www.facebook.com/tactikalphotography', type: 'fb' },
]

const TOTAL_GAMES = LOCATIONS.reduce((a, l) => a + l.count, 0)
const TOP_LOCATION = LOCATIONS[0]

function StatCard({ label, value, sub, Icon }) {
  return (
    <div className="bg-gray-900/50 border border-white/10 p-6 rounded-lg relative overflow-hidden group hover:border-red-500/50 transition-all duration-300">
      <div className="absolute right-4 top-4 text-gray-800 group-hover:text-red-900/50 transition-colors">
        <Icon size={60} strokeWidth={1} />
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</h3>
        <p className="text-5xl font-black text-white italic tracking-tighter">{value}</p>
        {sub && <p className="text-red-500 text-sm mt-2 font-bold uppercase tracking-wide">{sub}</p>}
      </div>
    </div>
  )
}

export default function Review2025() {
  usePageTitle('2025 Year in Review')
  const [activeTab, setActiveTab] = useState('overview')

  function TabButton({ id, label, Icon }) {
    const isActive = activeTab === id
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-5 py-3 font-black uppercase tracking-widest transition-all duration-200 relative overflow-hidden text-sm ${
          isActive ? 'text-white' : 'text-gray-500 hover:text-red-400'
        }`}
      >
        {isActive && (
          <div className="absolute inset-0 bg-red-600 -skew-x-12 z-0" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Icon size={16} />
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen -mt-px pb-16">

      {/* Hero */}
      <header className="relative h-[380px] flex flex-col justify-center overflow-hidden border-b border-red-900/30">
        <div className="absolute inset-0 bg-gradient-radial from-red-900/40 via-black to-black" style={{ background: 'radial-gradient(ellipse at top, rgba(127,29,29,0.4) 0%, #000 60%)' }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
          <div className="inline-block bg-red-600 text-white text-[10px] font-black px-3 py-1 mb-6 uppercase tracking-[0.3em] -skew-x-12 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            Mission Report // 2025
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
            <span className="block text-white">Year In</span>
            <span className="block text-red-600" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)', textShadow: '0 0 20px rgba(220,38,38,0.5)' }}>Foam</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
            Nerf Singapore • Annual Debrief
          </p>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="sticky top-16 z-40 border-b border-white/5 bg-black/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-2 min-w-max">
            <TabButton id="overview" label="Stats" Icon={Activity} />
            <TabButton id="locations" label="Zones" Icon={MapPin} />
            <TabButton id="events" label="Ops" Icon={Trophy} />
            <TabButton id="invaders" label="Invaders" Icon={Zap} />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* STATS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Ops" value={TOTAL_GAMES} sub="Games Played" Icon={Zap} />
              <StatCard label="Battle Zones" value={LOCATIONS.length} sub="Unique Locations" Icon={MapPin} />
              <StatCard label="Top Stronghold" value={TOP_LOCATION.name} sub={`${TOP_LOCATION.count} Sessions`} Icon={Star} />
            </div>

            <div className="bg-gray-900/40 border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3 tracking-wide">
                <Activity className="text-red-500" size={24} /> Activity Breakdown
              </h2>
              <div className="space-y-6">
                {LOCATIONS.slice(0, 5).map((loc, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold uppercase mb-2 tracking-wider">
                      <span className="text-gray-300">{idx + 1}. {loc.name}</span>
                      <span className="text-red-500">{loc.count} Games</span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                        style={{ width: `${(loc.count / TOP_LOCATION.count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <button
                  onClick={() => setActiveTab('locations')}
                  className="text-white hover:text-red-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto transition-colors group"
                >
                  Full Location Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ZONES TAB */}
        {activeTab === 'locations' && (
          <div className="space-y-8">
            <div className="bg-red-900/15 border border-red-900/30 p-8">
              <h3 className="text-red-500 font-bold uppercase tracking-[0.2em] text-xs mb-3">Dominant Terrain</h3>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
                <span className="font-black text-red-500">Hong Lim Park</span> remained our primary operating base, hosting nearly{' '}
                <span className="font-bold border-b border-red-500">20%</span> of all games this year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LOCATIONS.map((loc, idx) => (
                <div
                  key={idx}
                  className="relative h-48 bg-gray-900 rounded-xl overflow-hidden border border-white/5 group hover:border-red-500/50 transition-all duration-500"
                >
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <span className="bg-black/50 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">
                      Rank #{idx + 1}
                    </span>
                    <div className="flex justify-between items-end">
                      <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors uppercase italic">{loc.name}</h3>
                      <div className="text-right">
                        <span className="block text-3xl font-black text-white italic leading-none">{loc.count}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ops</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OPS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-12">
            {MAJOR_OPS.map((op) => (
              <div key={op.id} className="relative group overflow-hidden rounded-2xl border border-white/10 hover:border-red-500/30 transition-all duration-500">
                <img src={op.image} alt={op.title} className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className={`flex-shrink-0 ${op.iconBg} p-5 rounded-2xl ${op.iconColor} border border-white/5`}>
                      <op.Icon size={40} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-4xl md:text-5xl font-black uppercase italic mb-4 text-white tracking-tighter">{op.title}</h3>
                      <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl font-light">{op.description}</p>
                      <div className="flex flex-wrap gap-3 mb-8">
                        {op.tags.map((tag, i) => (
                          <span key={i} className="bg-white/5 border border-white/10 text-xs px-3 py-1 rounded uppercase tracking-wider text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={op.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded -skew-x-12 transition-all hover:translate-x-1 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      >
                        <span className="skew-x-12 flex items-center gap-2 uppercase tracking-wider text-sm">
                          <Camera size={18} /> View Album
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVADERS TAB */}
        {activeTab === 'invaders' && (
          <div className="space-y-8">
            <div className="relative overflow-hidden bg-red-700 rounded-2xl border border-red-500/50 group">
              <img
                src={FOAM_INVADERS.image}
                alt="Foam Invaders"
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="relative p-10 md:p-16 text-center md:text-left">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-2 text-white tracking-tighter" style={{ textShadow: '4px 4px 0px rgba(0,0,0,1)', WebkitTextStroke: '1px #000' }}>
                  {FOAM_INVADERS.title}
                </h2>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-widest mb-6 text-black opacity-80">
                  {FOAM_INVADERS.subtitle}
                </h3>
                <p className="font-medium text-xl leading-relaxed max-w-2xl text-white drop-shadow-md">
                  {FOAM_INVADERS.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FOAM_INVADERS.days.map((day, idx) => (
                <div key={idx} className={`relative overflow-hidden bg-gray-900 rounded-xl flex flex-col group hover:-translate-y-2 transition-transform duration-300 shadow-2xl`}>
                  <img src={day.image} alt={day.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent" />
                  <div className="relative z-10 flex flex-col h-full p-8">
                    <h4 className={`${day.textColor} font-black uppercase tracking-[0.2em] mb-3 text-xs`}>{day.label}</h4>
                    <h3 className="text-2xl font-black text-white mb-4 italic uppercase">{day.title}</h3>
                    <p className="text-sm text-gray-300 mb-6 flex-grow leading-relaxed font-light">{day.description}</p>
                    <a
                      href={day.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-center ${day.textColor} border border-white/20 bg-black/50 hover:bg-white hover:text-black py-3 rounded text-xs font-bold uppercase tracking-widest transition-all`}
                    >
                      View Photos
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Volunteer Salute */}
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl p-10 text-center group hover:border-red-500/30 transition-all">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4">
            <Heart size={32} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Volunteer Salute</h3>
          <p className="text-gray-400 text-base max-w-2xl mx-auto font-light">
            Thank you to everyone that helped made the year's events successful and keeping the hobby spirit alive, especially to those that helped in the shadows.
          </p>
        </div>
      </div>

      {/* Join the Squad */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px bg-gray-800 w-20" />
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Join the Squad</h3>
          <div className="h-px bg-gray-800 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="https://t.me/+MbMLovtcLyVmYzhl" target="_blank" rel="noopener noreferrer"
            className="bg-[#0088cc]/5 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-[#0088cc] transition-all hover:-translate-y-1">
            <Telegram size={32} />
            <span className="font-bold uppercase tracking-wider text-sm">Telegram Chat</span>
          </a>
          <a href="https://www.facebook.com/groups/nerfsingapore" target="_blank" rel="noopener noreferrer"
            className="bg-[#1877F2]/5 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-[#1877F2] transition-all hover:-translate-y-1">
            <Facebook size={32} />
            <span className="font-bold uppercase tracking-wider text-sm">Facebook Group</span>
          </a>
          <a href="https://discord.gg/FmrBkf4" target="_blank" rel="noopener noreferrer"
            className="bg-[#5865F2]/5 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 p-6 rounded-xl flex flex-col items-center justify-center gap-4 text-[#5865F2] transition-all hover:-translate-y-1">
            <Discord size={32} />
            <span className="font-bold uppercase tracking-wider text-sm">Discord Server</span>
          </a>
        </div>
      </div>

      {/* Photographer Credits */}
      <div className="max-w-5xl mx-auto px-6 py-10 border-t border-white/5">
        <h3 className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          Media Coverage Provided By
        </h3>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {PHOTOGRAPHERS.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group">
              <span className="group-hover:text-red-500 transition-colors">
                {p.type === 'ig' ? <Instagram size={18} /> : <Facebook size={18} />}
              </span>
              <span className="font-bold text-sm tracking-wide">{p.name}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
