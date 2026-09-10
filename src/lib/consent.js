/**
 * consent.js — analytics consent, stored per browser.
 *
 * The one thing this site stores without permission is the permission answer
 * itself. Everything else waits: firebase/config.js does not call
 * getAnalytics() until this module reports 'granted', so declining means no
 * analytics SDK, no analytics cookies, nothing to withdraw later.
 *
 * A tiny pub/sub rather than React state, because the subscriber that matters
 * (firebase/config.js) is not a component and must not depend on one.
 *
 * The key is versioned. Bumping it re-asks everyone, which is the correct
 * behaviour if we ever add a category of tracking they have not seen.
 */

const KEY = 'nerfsg-consent-v1'

/** 'granted' | 'denied' | null (never answered). */
let current = read()
const listeners = new Set()

function read() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    // Private mode, blocked site data, or a browser that throws on access.
    // Treat an unreadable store as "never answered" — we ask again, and the
    // answer simply will not stick. Failing closed is the safe direction.
    return null
  }
}

export function getConsent() {
  return current
}

/** True only on an explicit yes — an unanswered banner is not consent. */
export function hasAnalyticsConsent() {
  return current === 'granted'
}

export function setConsent(value) {
  if (value !== 'granted' && value !== 'denied') return
  current = value
  try { localStorage.setItem(KEY, value) } catch { /* choice holds for this page only */ }
  listeners.forEach(fn => fn(current))
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function onConsentChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/* ── Re-opening the banner ────────────────────────────────────────────
 * The privacy policy needs a way to bring the banner back so a decision is
 * reversible. Clearing the stored value and notifying puts the app back in the
 * "never answered" state the banner renders for.
 *
 * Note what this cannot do: a granted session has already loaded the Google
 * Analytics SDK, and there is no supported way to unload it mid-page. Revoking
 * therefore stops analytics from the next page load, which the banner says. */
export function openConsentSettings() {
  current = null
  try { localStorage.removeItem(KEY) } catch { /* nothing stored to clear */ }
  listeners.forEach(fn => fn(current))
}
