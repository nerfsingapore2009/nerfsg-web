import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',            label: 'Home',        end: true },
  { to: '/events',      label: 'Events' },
  { to: '/hvz',         label: 'HvZ' },
  { to: '/ruleset',     label: 'Rule Set' },
  { to: '/game-modes',  label: 'Game Modes' },
  { to: '/guides',      label: 'Guides' },
  { to: '/faq',         label: 'FAQ' },
  { to: '/contact',     label: 'Contact' },
  { to: '/2025-review', label: '2025 Review' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors relative ${
      isActive ? 'text-foam' : 'text-zinc-400 hover:text-white'
    }`

  return (
    <nav className="border-b border-line bg-ink/85 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-3 flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0" data-hit>
          <span className="font-display font-black text-xl tracking-tight text-white">
            <span className="text-foam">NERF</span>SG
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 ml-2">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} data-hit>
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && <span className="block h-[2px] w-full bg-foam mt-0.5 rounded-full"></span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex-1"></div>

        {/* Online indicator */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-zinc-500 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zombie pulse-dot"></span>
          <span>LIVE OPS</span>
        </div>

        {/* Download App CTA */}
        <a href="https://nerf-singapore.web.app" target="_blank" rel="noopener noreferrer"
          data-hit className="hidden lg:block bg-foam hover:bg-foam2 text-white font-semibold text-[13px] px-4 py-2 rounded-md transition-colors">
          Download App
        </a>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-zinc-400 hover:text-white p-2" aria-label="Toggle menu">
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-panel2 border-t border-line px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${isActive ? 'text-foam bg-foam/10' : 'text-zinc-400 hover:text-white'}`
              }>
              {label}
            </NavLink>
          ))}
          <a href="https://nerf-singapore.web.app" target="_blank" rel="noopener noreferrer"
            className="mt-2 bg-foam hover:bg-foam2 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors text-center">
            Download App
          </a>
        </div>
      )}
    </nav>
  )
}
