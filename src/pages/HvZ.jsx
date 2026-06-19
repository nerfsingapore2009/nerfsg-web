import { usePageTitle } from '../lib/usePageTitle'

export default function HvZ() {
  usePageTitle('Humans vs Zombies')
  return (
    <div className="min-h-screen page-enter">
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">Humans vs Zombies</h1>
          <p className="text-muted mt-2">The ultimate survival game mode.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col gap-5">
          {/* What is HvZ */}
          <div className="card p-6">
            <h2 className="text-ink font-bold text-xl mb-3">What is Humans vs Zombies?</h2>
            <p className="text-muted leading-relaxed">
              Humans vs Zombies (HvZ) is a large-scale game mode where the players are split into two teams —
              <span className="text-ink font-medium"> Humans</span> and{' '}
              <span className="text-red font-medium">Zombies</span>. Humans are armed with blasters
              and try to survive. Zombies spread by tagging humans — once tagged, a human becomes a zombie
              and turns against their former teammates.
            </p>
            <p className="text-muted leading-relaxed mt-3">
              The game ends when all humans have been converted, or when the humans survive until time runs out.
              It's chaotic, intense, and one of the most popular formats in the NerfSG community.
            </p>
          </div>

          {/* How it works */}
          <div className="card p-6">
            <h2 className="text-ink font-bold text-xl mb-4">How it works</h2>
            <div className="flex flex-col gap-4">
              {[
                { role: 'Humans', colour: 'text-blue-600 bg-blue-50 border-blue-100', desc: 'Use blasters to stun zombies. A stunned zombie is out for a short period before returning.' },
                { role: 'Zombies', colour: 'text-red bg-red/[.04] border-red/15', desc: 'Tag humans with your hand to convert them. No blasters — just teamwork and persistence.' },
                { role: 'Conversion', colour: 'text-orange-600 bg-orange-50 border-orange-100', desc: 'A tagged human immediately becomes a zombie and must switch to the zombie team.' },
              ].map(({ role, colour, desc }) => (
                <div key={role} className={`flex items-start gap-4 p-4 border ${colour}`}>
                  <span className="font-bold shrink-0 w-24 text-sm mt-0.5">{role}</span>
                  <span className="text-muted text-sm leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules CTA */}
          <div className="bg-red/[.04] border border-red/20 p-6 text-center">
            <h2 className="text-ink font-bold text-lg mb-2">Full HvZ Rules</h2>
            <p className="text-muted text-sm mb-5">
              Read the complete ruleset before playing — it covers tagging rules, stun timers, special roles, and more.
            </p>
            <a
              href="https://drive.google.com/open?id=12YXXUESkzAW_N2D8Wxc7_wa6XaPmeemO7l8zkNzKOA8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read HvZ Rules
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
