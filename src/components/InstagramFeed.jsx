import { useEffect } from 'react'

/* ── Instagram feed (Behold widget) ─────────────────────────────────────
 * Live grid of @nerfsingapore's latest posts, auto-updating.
 *
 * ONE-TIME SETUP (~5 min, free — https://behold.so):
 *   1. Sign up and connect the @nerfsingapore Instagram account.
 *   2. Feeds → "Add feed" → User feed → pick @nerfsingapore → "Widget".
 *   3. Choose the "Flexible grid", style it in the dashboard if you like.
 *   4. Open the feed → "Embed Code", copy the feed-id, paste it below, redeploy.
 *   5. (Optional) Advanced settings → Domain whitelist → add nerfsg.com.
 *
 * Until a feed-id is set this renders nothing (the socials list already links
 * Instagram), so the page never shows an empty widget.
 * ──────────────────────────────────────────────────────────────────── */
const BEHOLD_FEED_ID = '' // ← paste your Behold feed-id here
const BEHOLD_SRC = 'https://w.behold.so/widget.js'

export default function InstagramFeed() {
  useEffect(() => {
    if (!BEHOLD_FEED_ID) return
    if (document.querySelector(`script[src="${BEHOLD_SRC}"]`)) return
    const s = document.createElement('script')
    s.type = 'module'
    s.src = BEHOLD_SRC
    document.head.append(s)
  }, [])

  if (!BEHOLD_FEED_ID) return null

  return (
    <div className="lg:col-span-12" data-reveal style={{ '--reveal-delay': '0.18s' }}>
      <p className="section-label">On Instagram</p>
      <h2 className="font-display text-3xl lg:text-4xl text-ink mt-2 uppercase tracking-tight">@nerfsingapore</h2>
      <p className="text-muted mt-2">Fresh photos from our game days.</p>
      <div className="mt-6">
        <behold-widget feed-id={BEHOLD_FEED_ID} />
      </div>
    </div>
  )
}
