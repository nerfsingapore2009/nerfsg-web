import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import Photo from '../components/Photo'
import { getFieldGallery, getPagePhoto } from '../lib/media'
import { usePageTitle } from '../lib/usePageTitle'

const GENERAL_RULES = [
  'Blaster hits do not count. Getting shot anywhere else on the body or gear counts (depends on host)',
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
    title: 'Death clicks',
    win: 'Team with fewest clicks wins',
    time: '3 min',
    lives: 'Unlimited respawn',
    description: 'A counter is placed at each starting point. Click it when shot to respawn. The team with the least clicks at the end wins.',
  },
  {
    title: 'Flux',
    win: 'Team captured most zones wins',
    time: '5 min',
    lives: 'Unlimited respawn',
    description: 'Objectives placed in middle of field, stack your assigned coloured cones to capture zone. Team with most captured zone at the end wins',
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
    <div className="flex flex-col items-center bg-surface border border-border px-3 py-2 min-w-[80px]">
      <span className="text-red font-semibold text-sm">{value}</span>
      <span className="text-muted text-xs mt-0.5">{label}</span>
    </div>
  )
}

export default function GameModes() {
  usePageTitle('Game Modes')
  const headerPhoto = getPagePhoto('gameModes')
  const modePhotos = useMemo(
    () => getFieldGallery([], 24)
      .filter(p => p.src !== headerPhoto?.src && p.width > p.height)
      .slice(0, GAME_MODES.length),
    [headerPhoto],
  )
  return (
    <div className="min-h-screen page-enter">
      <PageHeader
        eyebrow="Formats"
        title="Game modes."
        subtitle="The formats we run at NerfSG events."
        photo={headerPhoto}
      />

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
        {/* General Rules Banner */}
        <div className="bg-red/[.04] border border-red/20 p-5 mb-8">
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

        {/* Game Mode Cards — each opens on a real field photo, echoing the
            homepage flip cards (mode-photo + scrim classes). */}
        <div className="flex flex-col gap-4">
          {GAME_MODES.map((mode, i) => {
            const photo = modePhotos.length ? modePhotos[i % modePhotos.length] : null
            return (
              <div
                key={mode.title}
                className="card card-hover overflow-hidden"
              >
                {photo && (
                  <div className="relative h-32 photo-placeholder">
                    <Photo photo={photo} alt="" className="mode-photo"
                      sizes="(min-width: 896px) 832px, 100vw"
                      style={{ objectPosition: `center ${photo.focalY || '30%'}` }} />
                    <div className="mode-photo-scrim" />
                    <h3 className="absolute bottom-3 left-5 z-10 font-display text-2xl text-white uppercase tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,.5)]">
                      {mode.title}
                    </h3>
                    {/* Top-right: the mode title sits bottom-left, and on narrow
                        cards a bottom-anchored badge collides with it. */}
                    {photo.credit && <span className="credit-badge !bottom-auto top-2 !left-auto right-2">📷 {photo.credit}</span>}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      {!photo && <h3 className="text-ink font-bold text-lg">{mode.title}</h3>}
                      <p className="text-red text-sm mt-0.5 font-medium">{mode.win}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <StatPill label="Time" value={mode.time} />
                      <StatPill label="Lives" value={mode.lives} />
                    </div>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{mode.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
