import { Link } from 'react-router-dom'
import { SOCIALS } from '../lib/links'

const FOOTER_LINKS = [
  { to: '/events',     label: 'Events' },
  { to: '/gallery',    label: 'Gallery' },
  { to: '/game-modes', label: 'Game Modes' },
  { to: '/guides',     label: 'How to Play' },
  { to: '/ruleset',    label: 'Rule Set' },
  { to: '/faq',        label: 'FAQ' },
  { to: '/contact',    label: 'Contact' },
]

const footerLinkClass =
  'text-sm text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40'

/* Shared site footer — rendered on every route from App.jsx. */
export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <img src="/nerfsingapore.webp" alt="NERF Singapore" className="h-12 w-[108px] object-cover object-center" width="240" height="160" />
          <p className="text-sm text-muted mt-3 max-w-xs">
            Weekly foam dart games in Singapore, open to all skill levels. Bring a blaster or borrow one from us.
          </p>
          <p className="text-xs text-muted mt-3">Est. 2009 · Singapore</p>
        </div>

        {/* Site links */}
        <nav aria-label="Footer">
          <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-3">Explore</div>
          <ul className="flex flex-col gap-2">
            {FOOTER_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={footerLinkClass}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials */}
        <div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-3">Connect</div>
          <ul className="flex flex-col gap-2">
            {SOCIALS.map(({ name, href }) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-muted">© {new Date().getFullYear()} NerfSG · See you on the field.</p>
          <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-red hover:text-red2 transition-colors">
            Get the NerfSG Hub app →
          </a>
        </div>
      </div>
    </footer>
  )
}
