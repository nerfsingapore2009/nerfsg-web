import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent, onConsentChange } from '../lib/consent'

/* Analytics consent bar.
 *
 * A bar, not a modal: nothing here is essential to using the site, and blocking
 * the page over an analytics question would be out of proportion. It sits above
 * the footer, does not trap focus, and leaves the page usable behind it.
 *
 * "Decline" is styled as an equal sibling of "Accept" deliberately — a greyed
 * out or hidden decline button is the pattern regulators single out, and both
 * outcomes here are genuinely fine with us.
 */
export default function CookieBanner() {
  const [choice, setChoice] = useState(getConsent)

  useEffect(() => onConsentChange(setChoice), [])

  if (choice !== null) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,.06)]"
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
        <p className="text-sm text-ink/80 leading-relaxed flex-1">
          We&apos;d like to use Google Analytics to see which pages people actually read. It sets
          cookies. Nothing loads unless you say yes, and the site works the same either way — see our{' '}
          <Link
            to="/privacy"
            className="text-red font-semibold underline underline-offset-2 hover:text-red2 transition-colors"
          >
            privacy policy
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => setConsent('denied')} className="btn-ghost flex-1 justify-center">
            Decline
          </button>
          <button type="button" onClick={() => setConsent('granted')} className="btn-red flex-1 justify-center">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
