import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously as _signInAnon } from 'firebase/auth'
import { hasAnalyticsConsent, onConsentChange } from '../lib/consent'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const missing = Object.entries(firebaseConfig)
  .filter(([k, v]) => k !== 'measurementId' && !v)
  .map(([k]) => `VITE_FIREBASE_${k.replace(/[A-Z]/g, c => `_${c}`).toUpperCase()}`)
if (missing.length > 0) {
  console.error('[firebase] Missing env vars — data will not load.\nAdd to .env.local:', missing.join(', '))
}

/* ── Initialisation must not be able to blank the site ───────────────────
 *
 * getAuth() throws synchronously on a missing or malformed apiKey. Because this
 * module is imported at the top of the App tree, that throw happened during
 * module evaluation — before React rendered anything — and took every page down
 * with it, including /faq, /guides, /privacy and the rest that never touch
 * Firebase. One mistyped Vercel environment variable was a fully blank site.
 *
 * So: init defensively, export nulls on failure, and let the data hooks show
 * their existing error states. A site with a broken events list still beats a
 * white screen. */
let app = null
let _db = null
let _auth = null

try {
  const _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  const db_ = getFirestore(_app)
  const auth_ = getAuth(_app)
  // Commit only once every step has succeeded. Assigning as we go would leave
  // a usable `db` behind a failed getAuth(), so firebaseReady would claim the
  // data layer is fine while every query silently timed out against a project
  // the credentials do not open.
  app = _app
  _db = db_
  _auth = auth_
} catch (err) {
  console.error('[firebase] Initialisation failed — live game data is unavailable.', err)
}

export const db = _db
export const auth = _auth

/** True when Firebase came up. Data hooks check this before querying. */
export const firebaseReady = _db !== null

export const signInAnon = () => {
  if (!_auth) return Promise.resolve()
  return _signInAnon(_auth).catch(() => {})
}

/* ── Analytics, only after an explicit yes ───────────────────────────────
 * firebase/analytics is imported dynamically so that declining (or simply not
 * answering) never downloads the Analytics SDK at all — it also keeps ~30 KB
 * out of the initial bundle for everyone. getAnalytics() sets cookies the
 * moment it runs, so it must stay behind the gate.
 *
 * `started` guards the once-only init: the consent listener fires on every
 * change, and initialising twice would double-count every page view. */
let started = false

async function startAnalytics() {
  if (started || !app || !hasAnalyticsConsent()) return
  started = true
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics')
    if (await isSupported()) getAnalytics(app)
  } catch {
    // Blocked by an extension, or no measurementId configured. Analytics is
    // never worth an error the visitor can see.
  }
}

startAnalytics()
onConsentChange(startAnalytics)
