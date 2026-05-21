export default function EventCard({ event }) {
  const date = new Date(event.scheduledFor)

  const formatted = date.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const time = date.toLocaleTimeString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3 hover:border-orange-500/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-lg leading-tight">{event.name}</h3>
        <span className="shrink-0 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-2 py-0.5">
          Upcoming
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatted} · {time}</span>
        </div>
        {event.location ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        ) : null}
      </div>

      {event.note ? (
        <p className="text-sm text-gray-500 line-clamp-2">{event.note}</p>
      ) : null}

      <a
        href="https://nerf-singapore.web.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block text-center bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Join on App
      </a>
    </div>
  )
}
