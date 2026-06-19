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

  const daysUntil = Math.ceil((event.scheduledFor - Date.now()) / (1000 * 60 * 60 * 24))
  const countdown =
    daysUntil <= 0 ? 'Today' :
    daysUntil === 1 ? 'Tomorrow' :
    `${daysUntil} days away`

  const isUrgent = daysUntil <= 3

  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-ink font-semibold text-base leading-snug" style={{ textWrap: 'balance' }}>
          {event.name}
        </h3>
        <span className={`shrink-0 text-xs border rounded-full px-2 py-0.5 whitespace-nowrap font-semibold ${
          isUrgent
            ? 'bg-red/8 text-red border-red/25'
            : 'bg-surface text-muted border-border'
        }`}>
          {countdown}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-muted">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatted} &middot; {time}</span>
        </div>
        {event.location ? (
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        ) : null}
      </div>

      {event.note ? (
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">{event.note}</p>
      ) : null}

      <a
        href="https://nerf-singapore.web.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto btn-red text-center justify-center"
        aria-label={`RSVP for ${event.name}`}
      >
        RSVP on App
      </a>
      <a
        href="https://t.me/+MbMLovtcLyVmYzhl"
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-xs text-muted hover:text-ink transition-colors"
      >
        or get notified on Telegram
      </a>
    </div>
  )
}
