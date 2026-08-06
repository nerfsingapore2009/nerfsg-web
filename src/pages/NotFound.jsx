import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="font-display font-black text-[120px] lg:text-[180px] text-border leading-none select-none">404</div>
      <h1 className="font-display text-2xl lg:text-3xl text-ink uppercase tracking-tight -mt-4">Page not found.</h1>
      <p className="text-muted mt-3 max-w-sm">This page doesn't exist or has been moved. Head back to the home base.</p>
      <div className="flex gap-3 mt-6">
        <Link to="/" className="btn-red">Back to home</Link>
        <Link to="/events" className="btn-ghost">
          View events
        </Link>
      </div>
    </div>
  )
}
