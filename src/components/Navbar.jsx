import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/events',     label: 'Events' },
  { to: '/game-modes', label: 'Game Modes' },
  { to: '/guides',     label: 'How to Play' },
  { to: '/hvz',        label: 'HvZ' },
  { to: '/faq',        label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Transparent only while sitting over the home hero (top, menu closed).
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 ${
      isActive
        ? (transparent ? 'text-white font-semibold' : 'text-red font-semibold')
        : (transparent ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink')
    }`

  return (
    <nav
      aria-label="Main navigation"
      className={`${isHome ? 'fixed' : 'sticky'} top-0 inset-x-0 z-40 transition-colors duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md border-b border-border'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-3 flex items-center gap-6">

        {/* Logo */}
        <NavLink to="/" aria-label="NERF Singapore — home" className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 rounded-lg">
          <img src="/nerfsingapore.webp" alt="NERF Singapore" className="h-9 w-[80px] object-cover object-center block" width="240" height="160" />
        </NavLink>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 ml-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex-1" />

        {/* Get the app CTA */}
        <a
          href="https://nerfsg.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex btn-red text-sm"
        >
          Get the app
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`lg:hidden p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 ${
            transparent ? 'text-white hover:text-white/80' : 'text-muted hover:text-ink'
          }`}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="lg:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 ${
                  isActive ? 'text-red bg-red/5 font-semibold' : 'text-muted hover:text-ink hover:bg-surface'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://nerfsg.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 btn-red text-center justify-center"
          >
            Get the app
          </a>
        </div>
      )}
    </nav>
  )
}
