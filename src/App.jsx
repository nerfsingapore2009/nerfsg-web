import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
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
import Leaderboard from './pages/Leaderboard'
import Roadmap from './pages/Roadmap'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'

/* SPA route changes keep the previous scroll position by default — jump to
   top on every navigation. Instant, not smooth: html has scroll-behavior:
   smooth globally, and an animated scroll on page change is disorienting.
   scroll-behavior is forced to auto for the jump so any in-flight smooth
   scroll (e.g. an anchor link mid-animation) is cancelled rather than
   resumed on the new page. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    root.style.scrollBehavior = prev
  }, [pathname])
  return null
}

export default function App() {
  useEffect(() => { signInAnon() }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-ink">
        <ScrollToTop />
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
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}
