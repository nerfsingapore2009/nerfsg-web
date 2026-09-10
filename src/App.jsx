import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
import CookieBanner from './components/CookieBanner'
import ErrorBoundary from './components/ErrorBoundary'
import { signInAnon } from './firebase/config'
import { useRouteMeta } from './lib/usePageMeta'
import Home from './pages/Home'

/* Home stays in the entry bundle — it is the landing page, and a lazy chunk
   there would only add a round trip in front of the LCP. Everything else is
   split: a visitor reading the FAQ has no reason to download the 2025 review's
   charts, the gallery lightbox, or the ruleset embed. */
const Events      = lazy(() => import('./pages/Events'))
const HvZ         = lazy(() => import('./pages/HvZ'))
const RuleSet     = lazy(() => import('./pages/RuleSet'))
const GameModes   = lazy(() => import('./pages/GameModes'))
const Guides      = lazy(() => import('./pages/Guides'))
const FAQ         = lazy(() => import('./pages/FAQ'))
const Contact     = lazy(() => import('./pages/Contact'))
const Review2025  = lazy(() => import('./pages/Review2025'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Roadmap     = lazy(() => import('./pages/Roadmap'))
const Gallery     = lazy(() => import('./pages/Gallery'))
const Privacy     = lazy(() => import('./pages/Privacy'))
const Terms       = lazy(() => import('./pages/Terms'))
const NotFound    = lazy(() => import('./pages/NotFound'))

/* Holds the viewport height while a route chunk arrives, so the footer does not
   fly up the page and back down again on every navigation. */
function RouteFallback() {
  return <div className="min-h-screen" aria-hidden="true" />
}

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

/* Title, description, canonical and robots for the current route. Lives in its
   own component because useRouteMeta needs a Router above it. */
function RouteMeta() {
  useRouteMeta()
  return null
}

export default function App() {
  useEffect(() => { signInAnon() }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-ink">
        <ScrollToTop />
        <RouteMeta />
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main">
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/hvz" element={<HvZ />} />
                <Route path="/ruleset" element={<RuleSet />} />
                {/* Every other multi-word route is hyphenated (/game-modes,
                    /2025-review), so /rule-set is the URL people actually type
                    and share. Keep it working instead of 404ing. */}
                <Route path="/rule-set" element={<Navigate to="/ruleset" replace />} />
                <Route path="/game-modes" element={<GameModes />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/2025-review" element={<Review2025 />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <SiteFooter />
        <CookieBanner />
      </div>
    </BrowserRouter>
  )
}
