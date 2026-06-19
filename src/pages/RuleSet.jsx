export default function RuleSet() {
  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          <p className="section-label">Rules</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">Rule Set</h1>
          <p className="text-muted mt-2">The official NerfSG master ruleset.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
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

          <div className="bg-red/[.04] border border-red/20 rounded-xl p-6 text-center">
            <h2 className="text-ink font-bold text-lg mb-2">Full Ruleset Document</h2>
            <p className="text-muted text-sm mb-5">
              The complete ruleset is maintained as a living document. Read it before your first game.
            </p>
            <a
              href="https://drive.google.com/open?id=1IC8DDEb1rZJhWhnLwJpA5Banug8wC-WiOK4qzxDwC5I"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read Full Ruleset
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
