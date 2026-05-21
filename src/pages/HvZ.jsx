export default function HvZ() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Humans vs Zombies</h1>
      <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-8">HvZ</p>

      <div className="flex flex-col gap-6">
        {/* What is HvZ */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-bold text-xl mb-3">What is Humans vs Zombies?</h2>
          <p className="text-gray-400 leading-relaxed">
            Humans vs Zombies (HvZ) is a large-scale game mode where the players are split into two teams —
            <span className="text-white font-medium"> Humans</span> and{' '}
            <span className="text-orange-400 font-medium">Zombies</span>. Humans are armed with blasters
            and try to survive. Zombies spread by tagging humans — once tagged, a human becomes a zombie
            and turns against their former teammates.
          </p>
          <p className="text-gray-400 leading-relaxed mt-3">
            The game ends when all humans have been converted, or when the humans survive until time runs out.
            It's chaotic, intense, and one of the most popular formats in the NerfSG community.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-bold text-xl mb-4">How it works</h2>
          <div className="flex flex-col gap-3">
            {[
              { role: 'Humans', colour: 'text-blue-400', desc: 'Use blasters to stun zombies. A stunned zombie is out for a short period before returning.' },
              { role: 'Zombies', colour: 'text-orange-400', desc: 'Tag humans with your hand to convert them. No blasters — just teamwork and persistence.' },
              { role: 'Conversion', colour: 'text-red-400', desc: 'A tagged human immediately becomes a zombie and must switch to the zombie team.' },
            ].map(({ role, colour, desc }) => (
              <div key={role} className="flex items-start gap-3">
                <span className={`font-bold shrink-0 w-24 ${colour}`}>{role}</span>
                <span className="text-gray-400 text-sm leading-relaxed">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules CTA */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
          <h2 className="text-white font-bold text-lg mb-2">Full HvZ Rules</h2>
          <p className="text-gray-400 text-sm mb-5">
            Read the complete ruleset before playing — it covers tagging rules, stun timers, special roles, and more.
          </p>
          <a
            href="https://drive.google.com/open?id=12YXXUESkzAW_N2D8Wxc7_wa6XaPmeemO7l8zkNzKOA8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Read HvZ Rules
          </a>
        </div>
      </div>
    </div>
  )
}
