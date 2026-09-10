import PageHeader from '../components/PageHeader'
import { getPagePhoto } from '../lib/media'

/* The ruleset is maintained as a living Google Doc, so the page embeds it
   rather than copying its text — the doc stays the single source of truth.
   `/preview` is the embeddable read-only render; `/edit` ships the editor
   chrome and refuses to frame. The doc must be shared "anyone with the link
   can view" for this to render for visitors, hence the fallback link below. */
const DOC_ID = '1IC8DDEb1rZJhWhnLwJpA5Banug8wC-WiOK4qzxDwC5I'
const DOC_EMBED = `https://docs.google.com/document/d/${DOC_ID}/preview`
const DOC_LINK  = `https://docs.google.com/document/d/${DOC_ID}/edit?usp=sharing`

function DocIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export default function RuleSet() {
  return (
    <div className="min-h-screen page-enter">
      <PageHeader
        eyebrow="Play fair"
        title="Rule set."
        subtitle="The official NerfSG master ruleset."
        photo={getPagePhoto('ruleset')}
      />

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="text-ink font-bold text-xl mb-3">Official NerfSG Ruleset</h2>
            <p className="text-muted leading-relaxed">
              This is the master ruleset that governs all NerfSG games. It covers blaster limits, hit rules,
              respawn mechanics, safety requirements, and player conduct. All participants are expected to
              read and follow these rules before joining any event.
            </p>
            <p className="text-muted leading-relaxed mt-3">
              Rules may be adjusted by the game host on the day — always listen to the host's briefing
              before each game.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-ink font-bold text-lg mb-4">Key principles</h2>
            <ul className="flex flex-col gap-3">
              {[
                'Safety first — approved eye protection is mandatory at all times during games',
                'Honesty — call your hits, even when no one sees them',
                'Respect — other players, bystanders, and the venue',
                'FPS limits — blasters are chronographed before play; exceeding limits means sitting out',
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red/10 text-red flex items-center justify-center font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* The document itself — read it here, no detour to Drive. */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
              <div>
                <p className="section-label">The document</p>
                <h2 className="text-ink font-bold text-lg">Full ruleset</h2>
              </div>
              <a
                href={DOC_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-red hover:text-red2 transition-colors"
              >
                Open in Google Docs →
              </a>
            </div>

            <div className="card overflow-hidden">
              <iframe
                src={DOC_EMBED}
                title="NerfSG master ruleset"
                className="w-full h-[75vh] min-h-[520px] block"
                frameBorder="0"
              >
                Loading…
              </iframe>
            </div>

            <p className="text-muted text-xs mt-3">
              Can't see the document? Some browsers block embedded content —{' '}
              <a
                href={DOC_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:text-red2 underline underline-offset-2"
              >
                open it directly
              </a>{' '}
              instead.
            </p>
          </div>

          <div className="bg-red/[.04] border border-red/20 p-6 text-center">
            <h2 className="text-ink font-bold text-lg mb-2">Read it before your first game</h2>
            <p className="text-muted text-sm mb-5">
              The ruleset is a living document — check back before events, and ask your host if anything is unclear.
            </p>
            <a href={DOC_LINK} target="_blank" rel="noopener noreferrer" className="btn-red">
              <DocIcon />
              Open the full ruleset
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
