import { Component } from 'react'

/* Last line of defence around the routed pages.
 *
 * Without one, a render error anywhere — a malformed Firestore document, a
 * third-party embed misbehaving, a typo in a rarely-visited page — unmounts the
 * whole React tree and leaves a white screen with no way out. The visitor gets
 * a page that at least tells them what happened and keeps the nav and footer,
 * so they can go somewhere that works.
 *
 * Scoped to <main> rather than the whole app deliberately: Navbar and
 * SiteFooter stay mounted, so the site still looks like the site.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[render error]', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
        <p className="section-label">Something broke</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink uppercase tracking-tight mt-2">
          This page didn&apos;t load.
        </h1>
        <p className="text-muted mt-3 max-w-sm">
          Sorry — that one is on us. The rest of the site should still work, and the game schedule is
          always on Telegram.
        </p>
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button type="button" onClick={() => window.location.reload()} className="btn-red">
            Reload the page
          </button>
          <a href="/" className="btn-ghost">Back to home</a>
        </div>
      </div>
    )
  }
}
