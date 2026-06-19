# Design

## Color

### Strategy
Committed. One saturated red carries the action energy; ink + white + light surface handle everything else. No secondary palette, no gradients on type, no tinted beige. The red is the voice.

### Palette

| Token | Value | Role |
|-------|-------|------|
| `--red` | `#e03131` | Primary accent: CTAs, section labels, active states, emphasis |
| `--red2` | `#c92a2a` | Hover / pressed state for red elements |
| `--ink` | `#0f172a` | Body text, headings, primary text on light backgrounds |
| `--ink2` | `#0a0f1d` | Hero background, dark overlays, cinema mode |
| `--muted` | `#64748b` | Secondary text, captions, placeholder labels |
| `--border` | `#e2e8f0` | Card borders, dividers, input borders |
| `surface` | `#f8fafc` | Page header strips, alternate row bg, subtle containers |
| `white` | `#ffffff` | Card backgrounds, page background |

### Tailwind mapping (tailwind.config.js)
```js
colors: {
  red:    '#e03131',
  red2:   '#c92a2a',
  ink:    '#0f172a',
  ink2:   '#0a0f1d',
  muted:  '#64748b',
  border: '#e2e8f0',
  border2:'#cbd5e1',
  surface:'#f8fafc',
  foam:   '#38bdf8',  // legacy, avoid
  panel:  '#f8fafc',  // legacy alias for surface
}
```

### Dark surface (hero / cinematic)
The hero uses `--ink2` (#0a0f1d) as the background with a radial gradient. Overlaid text is always white. The hero scrim is a double linear-gradient (bottom fade + left vignette). Film grain is added via SVG `feTurbulence` at 50% opacity, `mix-blend-mode: soft-light`.

### Contrast targets
- Body text on white bg: `#0f172a` on `#ffffff` → 19.7:1 ✓
- Muted text on white: `#64748b` on `#ffffff` → 5.1:1 ✓
- White text on ink2 hero: `#ffffff` on `#0a0f1d` → 19.8:1 ✓
- Red on white: `#e03131` on `#ffffff` → 4.6:1 ✓ (large text)

## Typography

### Families
- **Body / UI**: Inter, system-ui, sans-serif — the sole family used throughout. No display face loaded separately.
- **Display**: Inter at weight 800–900 with `tracking-tight` serves as the de-facto display face.
- No mono stack intentionally (Tailwind's mono utilities exist but no brand use case).

### Scale (Tailwind defaults, augmented)
| Step | Class | Approx size |
|------|-------|-------------|
| xs | `text-xs` | 12px |
| sm | `text-sm` | 14px |
| base | `text-base` | 16px |
| lg | `text-lg` | 18px |
| xl | `text-xl` | 20px |
| 2xl | `text-2xl` | 24px |
| 3xl | `text-3xl` | 30px |
| 4xl | `text-4xl` | 36px |
| Hero h1 | CSS `clamp(2.6rem,5vw,4.5rem)` | 42–72px |

### Rules
- `text-wrap: balance` on h1–h3.
- Hero headline: Inter Black (900), letter-spacing `-0.03em`, line-height 1.05.
- Section labels (`.section-label`): 11px, weight 700, tracking 0.1em, uppercase. Used sparingly — not on every section.
- Body copy max-width: `max-w-2xl` (65ch equivalent).
- Light text on dark hero: line-height bumped to 1.1 (tighter than body, looser than pure condensed).

## Spacing

Uses Tailwind's default 4px base scale. Key rhythm landmarks:
- Section vertical padding: `py-16` to `py-24` (64–96px)
- Card padding: `p-4` to `p-6` (16–24px)
- Content max-width: `max-w-6xl` for full-width sections, `max-w-4xl` for content pages, `max-w-3xl` for reading pages
- Horizontal padding: `px-5 lg:px-8`
- Gap between cards: `gap-4` to `gap-6`

## Components

### Buttons
```css
.btn-red   /* primary: red bg, white text, 8px radius, 0.625rem×1.25rem padding */
.btn-ghost /* secondary: transparent, ink text, 1.5px border-border */
```
Both use `focus-visible` ring (red/40 for primary, ink/12 for ghost). Active: `scale(0.98)`.

### Cards
```css
.card        /* white bg, 1px border-border, 12px radius, 0 1px 3px shadow */
.card-hover  /* adds lift: -2px translateY + wider shadow on hover */
.glass-card  /* hero overlay only: rgba(255,255,255,0.92) + backdrop-blur(18px) */
```
Cards max-radius: 12px. Never 24px+. Never nest cards.

### Section label
```css
.section-label  /* red, 11px/700/0.1em tracking/uppercase; ::before = 18px red bar */
```
Used as the eyebrow for major homepage sections only. Inner pages use it in the `bg-surface` header strip. Not on every section — deliberate cadence.

### Page header strip
Pattern used on all inner pages:
```jsx
<div className="bg-surface border-b border-border">
  <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
    <p className="section-label">Category</p>
    <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">Page Title</h1>
    <p className="text-muted mt-2">Subtitle.</p>
  </div>
</div>
```

### Hero (cinematic)
Full-bleed section with `min-height: 100dvh`. Layers (bottom to top):
1. `radial-gradient` dark bg (`--ink2`)
2. `.hero-photo` — `<img>` at `object-fit: cover`, Ken Burns animation (`@keyframes kenburns`), opacity 0.62
3. `.hero-scrim` — double linear-gradient (fade-to-bottom + left vignette)
4. `.grain` — SVG feTurbulence noise, `mix-blend-mode: soft-light`
5. Content (white text, red accents)

### Countdown boxes
```css
.countdown-box  /* surface bg, border-border, 8px radius, centered */
.countdown-box .num  /* 28px, weight 800, tabular-nums */
.countdown-box .lbl  /* 10px, weight 600, tracking 0.1em, uppercase, #94a3b8 */
```

### Flip cards (game modes)
`.flip-card` > `.flip-inner` > `.flip-face` + `.flip-back`
Perspective: 900px. Transition: 0.5s cubic-bezier(0.65,0.05,0.36,1). Backface hidden.

### Device frame (app carousel)
248×510px phone frame with 2.75rem border-radius, `--ink2` background, inner `.carousel-track` slides with 0.6s ease transition. Dot indicators use 22px tap targets with `::before` pseudo-elements. Auto-advances every 3200ms; respects `prefers-reduced-motion`.

### Marquee (photo gallery)
`.marquee-track` — 70s linear infinite `translateX(-50%)`. Pauses on hover. Photos in `src/assets/gallery/` with `by-<handle>-NN.jpg` naming for auto-credit badges.

### Social links
```css
.social-link  /* flex, white bg, 1px border-border, 10px radius, lift on hover */
```

### Data components (Archive / Stats)
- Light theme throughout: `card`, `text-ink`, `text-muted`, `text-red`
- HeatmapCalendar: `#eef2f7` empty cells, `rgba(224,49,49,...)` active
- Sparklines: red (#e03131) or green (#16a34a) strokes on transparent SVG

## Motion

### Scroll reveal
`[data-reveal]` — opacity 0 + translateY 26px → `.is-visible` (opacity 1 + translateY 0). Duration 0.7s cubic-bezier(0.2,0.6,0.2,1). Driven by `useReveal.js` (IntersectionObserver). Stagger via `--reveal-delay` CSS custom property.

### Page load
- Hero photo: Ken Burns `@keyframes kenburns` — scale 1.08→1.2 + slight translate, 22s alternate. Reduced-motion: static scale(1.05).
- Gallery marquee: `translateX(-50%)` 70s linear infinite.
- Pulse dot: `pulseDot` 1.6s ease-in-out (for live-game indicator).
- Reveal: `reveal` 0.5s cubic-bezier(0.2,0.6,0.2,1) with delay variants (`.reveal-d1/d2/d3`).

### Rules
- `@media (prefers-reduced-motion: reduce)` fallbacks on every animation.
- `will-change: transform` only on `.hero-photo` and `[data-reveal]`.
- No CSS layout property animation.
- Flip cards: 0.5s cubic-bezier easing, not linear. Reduced-motion: `transition: none`.

## Assets

### Community logo
`/nerfsingapore.webp` (1800×1200, transparent background). Used in navbar (`h-9 w-[80px] object-cover object-center`) and footer (`h-12 w-[108px] object-cover object-center`). Content crops to the logo mark, removing large white margin areas.

### Photo gallery
Drop landscape action photos (≥1600px) into `src/assets/gallery/`. Name `by-<handle>-NN.jpg` for auto-credit overlays. First alphabetically becomes hero backdrop.

### App screenshots
Drop portrait NerfSG Hub screenshots into `src/assets/app/`. Name `01-xxx.jpg`, `02-xxx.jpg` etc. for carousel order. 3-6 screens recommended.
