import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
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

export default function App() {
  useEffect(() => { signInAnon() }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-ink">
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main">
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
