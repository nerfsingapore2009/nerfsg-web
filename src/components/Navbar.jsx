import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/hvz', label: 'HvZ' },
  { to: '/ruleset', label: 'Rule Set' },
  { to: '/game-modes', label: 'Game Modes' },
  { to: '/guides', label: 'Guides' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/2025-review', label: '2025 Review' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-orange-500 font-medium'
      : 'text-gray-400 hover:text-white transition-colors'

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <span className="text-orange-500">NERF</span>SG
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Download App CTA */}
        <div className="hidden lg:block">
          <a
            href="https://nerf-singapore.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Download App
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-gray-400 hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://nerf-singapore.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors text-center mt-2"
          >
            Download App
          </a>
        </div>
      )}
    </nav>
  )
}
