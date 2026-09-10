/**
 * routes.js — the public route table.
 *
 * One list, three consumers:
 *   1. usePageMeta() reads `description` to set the per-route <meta name="description">.
 *   2. scripts/generate-sitemap.mjs turns it into public/sitemap.xml.
 *   3. SiteFooter/Navbar can label links from it rather than repeating strings.
 *
 * Kept as plain data — no imports — so the sitemap script can read it in Node
 * without pulling React or Vite's asset pipeline in with it.
 *
 * Adding a page means adding a row here as well as a <Route> in App.jsx. Routes
 * deliberately absent: /rule-set (a redirect) and the 404 catch-all, neither of
 * which belongs in a sitemap.
 */

export const ROUTES = [
  {
    path: '/',
    title: null, // Home uses the bare site title, not "Home | NerfSG"
    description:
      'Weekly foam dart games in Singapore, open to all skill levels. Bring a blaster or borrow one from us — find the next game and just turn up.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/events',
    title: 'Events',
    description:
      'Upcoming NerfSG games — weekends at parks across Singapore, open to all skill levels. See the schedule and RSVP on the app.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/gallery',
    title: 'Gallery',
    description:
      'Group photos from every NerfSG game day, going back years. Faces, fields and foam from the Singapore Nerf community.',
    priority: '0.7',
    changefreq: 'weekly',
  },
  {
    path: '/leaderboard',
    title: 'Leaderboard',
    description:
      'Top NerfSG operators ranked by games attended, updated live from every RSVP in the system.',
    priority: '0.6',
    changefreq: 'weekly',
  },
  {
    path: '/roadmap',
    title: 'Roadmap',
    description:
      "What NerfSG is building next — shaped by players, not a boardroom. What's in the works, what's next, and what just dropped.",
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/game-modes',
    title: 'Game Modes',
    description:
      'The formats we run at NerfSG events — from team deathmatch to objective games and Humans vs Zombies.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/guides',
    title: 'Guides',
    description:
      'How to play, what to bring, and how to mod your blaster. Resources for new and experienced Nerfers alike.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/hvz',
    title: 'Humans vs Zombies',
    description:
      'Humans vs Zombies at NerfSG — the survival game mode. How infection works, what the rules are, and how to last the round.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/faq',
    title: 'FAQ',
    description:
      'Frequently asked questions about NerfSG events — what to bring, what it costs, safety eyewear, and whether you need your own blaster.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/ruleset',
    title: 'Rule Set',
    description:
      'The official NerfSG master ruleset — safety rules, chrono limits, hit calling and game conduct.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/2025-review',
    title: '2025 Year in Review',
    description:
      'NerfSG in 2025 — the games we ran, the parks we played, and the numbers behind a year of foam.',
    priority: '0.4',
    changefreq: 'yearly',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch with NerfSG. Questions, feedback, or want to get involved? Telegram and Facebook get the fastest answers.',
    priority: '0.6',
    changefreq: 'yearly',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'How NerfSG collects, uses and stores your personal data, and the choices you have under the Singapore PDPA.',
    priority: '0.2',
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions',
    description:
      'The terms you agree to when using the NerfSG website and attending NerfSG game days.',
    priority: '0.2',
    changefreq: 'yearly',
  },
]

/** Meta row for a pathname, or null if the route is unlisted (e.g. the 404). */
export function metaForPath(pathname) {
  return ROUTES.find(r => r.path === pathname) || null
}
