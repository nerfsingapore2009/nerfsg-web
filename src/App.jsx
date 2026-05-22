import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ReticleCursor, HitMarkerLayer, CornerBrackets, MissionTicker, ToastStack } from './components/Hud'
import { signInAnon } from './firebase/config'
import Home from './pages/Home'
import Events from './pages/Events'
import HvZ from './pages/HvZ'
import RuleSet from './pages/RuleSet'
import GameModes from './pages/GameModes'
import Guides from './pages/Guides'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Review2025 from './pages/Review2025'

const TICKER_ITEMS = [
  { tag: '[INTEL]',   text: 'New HvZ ruleset v2.1 published' },
  { tag: '[GEAR]',    text: '120 fps cap enforced · half-darts only at indoor venues' },
  { tag: '[SCRIM]',   text: 'Tuesday range night · tune your blasters' },
  { tag: '[NETWORK]', text: '1,247 on Telegram · 4.8k on Facebook' },
  { tag: '[SAFETY]',  text: 'Eye-pro required · ANSI-rated only' },
  { tag: '[GEAR]',    text: 'Loaners available at every open game for first-timers' },
]

export default function App() {
  useEffect(() => { signInAnon() }, [])

  return (
    <BrowserRouter>
      <CornerBrackets />
      <ReticleCursor />
      <HitMarkerLayer />
      <ToastStack />

      <div className="min-h-screen bg-ink text-gray-200">
        <MissionTicker items={TICKER_ITEMS} />
        <Navbar />

        {/* fixed side gutter coords */}
        <div className="gutter l">
          <span>NERFSG // 01°22′ N · 103°48′ E</span>
          <span>CHANNEL FOAM-1 // LIVE</span>
        </div>
        <div className="gutter r">
          <span>EST. 2009 // SINGAPORE</span>
          <span>GMT+8 // STAY SHARP</span>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hvz" element={<HvZ />} />
            <Route path="/ruleset" element={<RuleSet />} />
            <Route path="/game-modes" element={<GameModes />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/2025-review" element={<Review2025 />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
