import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Events from './pages/Events'
import HvZ from './pages/HvZ'
import RuleSet from './pages/RuleSet'
import GameModes from './pages/GameModes'
import Guides from './pages/Guides'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
        <Navbar />
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
          </Routes>
        </main>
        <footer className="border-t border-[#2a2a2a] text-center py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} NerfSG. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  )
}
