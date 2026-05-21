export default function RuleSet() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Rule Set</h1>
      <p className="text-gray-400 mb-8">The official NerfSG master ruleset.</p>

      <div className="flex flex-col gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-bold text-xl mb-3">Official NerfSG Ruleset</h2>
          <p className="text-gray-400 leading-relaxed">
            This is the master ruleset that governs all NerfSG games. It covers blaster limits, hit rules,
            respawn mechanics, safety requirements, and player conduct. All participants are expected to
            read and follow these rules before joining any event.
          </p>
          <p className="text-gray-400 leading-relaxed mt-3">
            Rules may be adjusted by the game host on the day — always listen to the host's briefing
            before each game.
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">Key principles</h2>
          <ul className="flex flex-col gap-3">
            {[
              'Safety first — approved eye protection is mandatory at all times during games',
              'Honesty — call your hits, even when no one sees them',
              'Respect — other players, bystanders, and the venue',
              'FPS limits — blasters are chronographed before play; exceeding limits means sitting out',
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-orange-500 mt-0.5 shrink-0">›</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
          <h2 className="text-white font-bold text-lg mb-2">Full Ruleset Document</h2>
          <p className="text-gray-400 text-sm mb-5">
            The complete ruleset is maintained as a living document. Read it before your first game.
          </p>
          <a
            href="https://drive.google.com/open?id=1IC8DDEb1rZJhWhnLwJpA5Banug8wC-WiOK4qzxDwC5I"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Read Full Ruleset
          </a>
        </div>
      </div>
    </div>
  )
}
