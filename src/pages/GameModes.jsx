const GENERAL_RULES = [
  'Blaster hits do not count — getting shot anywhere else on the body or gear counts (depends on host)',
  'Respawns require player to go back to the starting point after they get shot',
  'Flags must be returned to the same spot if the holder gets shot',
]

const GAME_MODES = [
  {
    title: 'Team Death Match',
    win: 'Last team standing wins',
    time: '3 min',
    lives: '1+ lives',
    description: 'Both teams try to tag each other out. If time runs out, the team with the most players remaining wins.',
  },
  {
    title: 'Capture the Flag',
    win: 'Team with flag capture wins',
    time: '3 min',
    lives: '1+ lives',
    description: 'Bring the flag from the middle back to your starting point to win immediately.',
  },
  {
    title: 'Domination',
    win: 'Team with fewest clicks wins',
    time: '3 min',
    lives: 'Unlimited respawn',
    description: 'A counter is placed at each starting point. Click it when shot to respawn. The team with the least clicks at the end wins.',
  },
  {
    title: 'King of the Hill',
    win: 'Team holding timer longest wins',
    time: '5 min',
    lives: 'Unlimited respawn',
    description: 'A chess clock sits in the middle. Press your side to start your timer. Hold the hill longest to win.',
  },
  {
    title: 'Clicker Domination',
    win: 'Most clicks wins',
    time: '3 min',
    lives: 'Unlimited respawn',
    description: 'Two clickers in the middle, one per team. Click your clicker to score points for your team.',
  },
]

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-surface border border-border rounded-lg px-3 py-2 min-w-[80px]">
      <span className="text-red font-semibold text-sm">{value}</span>
      <span className="text-muted text-xs mt-0.5">{label}</span>
    </div>
  )
}

export default function GameModes() {
  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
          <p className="section-label">How We Play</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">Game Modes</h1>
          <p className="text-muted mt-2">The formats we run at NerfSG events.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
        {/* General Rules Banner */}
        <div className="bg-red/[.04] border border-red/20 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-ink font-semibold">General Rules</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {GENERAL_RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-red mt-0.5 shrink-0 font-bold">›</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Game Mode Cards */}
        <div className="flex flex-col gap-4">
          {GAME_MODES.map((mode) => (
            <div
              key={mode.title}
              className="card card-hover p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-ink font-bold text-lg">{mode.title}</h3>
                  <p className="text-red text-sm mt-0.5 font-medium">{mode.win}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatPill label="Time" value={mode.time} />
                  <StatPill label="Lives" value={mode.lives} />
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed">{mode.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
