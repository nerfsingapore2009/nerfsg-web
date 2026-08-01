/**
 * ics.js — minimal iCalendar export for a single gameday.
 *
 * Deliberately dependency-free: one event, no timezone database. Times are
 * written as UTC stamps (trailing Z), which every calendar app resolves back
 * into the viewer's local zone — correct for our Singapore-only audience and
 * for anyone reading the site while travelling.
 *
 * Exists so people who are interested but not ready to install the app still
 * have something to click.
 */

const pad = n => String(n).padStart(2, '0')

function toUtcStamp(ms) {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
         `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

/* RFC 5545 escaping for TEXT values: backslash, comma, semicolon, newline. */
function esc(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/[,;]/g, m => '\\' + m)
    .replace(/\r?\n/g, '\\n')
}

/* Gamedays carry a start time but no end time, so assume a typical session. */
const ASSUMED_DURATION_MS = 3 * 60 * 60 * 1000

export function buildGamedayIcs(event, { url = '' } = {}) {
  const start = event?.scheduledFor || event?.createdAt
  if (!start) return null
  const end = event.endsAt || start + ASSUMED_DURATION_MS

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NerfSG//Gameday//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${esc(event.id || String(start))}@nerfsg`,
    `DTSTAMP:${toUtcStamp(Date.now())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${esc(event.name || 'NerfSG game')}`,
  ]
  if (event.location) lines.push(`LOCATION:${esc(event.location)}`)

  const description = [
    event.hostName ? `Hosted by ${event.hostName}` : '',
    url,
  ].filter(Boolean).join('\n')
  if (description) lines.push(`DESCRIPTION:${esc(description)}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

/* Builds the file in-memory and triggers a download. No network round trip. */
export function downloadGamedayIcs(event) {
  const ics = buildGamedayIcs(event, { url: window.location.origin })
  if (!ics) return

  const href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = href
  a.download = `${(event.name || 'nerfsg-game').replace(/[^\w-]+/g, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}
