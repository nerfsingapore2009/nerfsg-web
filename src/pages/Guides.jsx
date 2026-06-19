const SECTIONS = [
  {
    title: 'New to the Hobby? Read This First',
    highlight: true,
    links: [
      { label: "NerfSG New Nerfer Starter Pack", url: "https://docs.google.com/document/d/1uiWgPrIlFa5wxCu4LyhY-UL3wND3ibVxxqbsuu9FWAc/edit", desc: "Everything a beginner needs to know — gear, rules, etiquette." },
    ],
  },
  {
    title: 'Communities',
    links: [
      { label: "Nerf Singapore Facebook Group", url: "https://www.facebook.com/groups/nerfsingapore/", desc: "Main community group for events and discussions." },
      { label: "Buy / Sell / Trade", url: "https://www.facebook.com/groups/nerfsingaporetrading", desc: "Marketplace group for buying and selling blasters." },
      { label: "Nerf Singapore Discord", url: "https://discord.gg/ZszbEyg", desc: "Chat with the community in real time." },
      { label: "r/Nerf", url: "https://www.reddit.com/r/Nerf", desc: "International Nerf subreddit for tips, mods, and news." },
    ],
  },
  {
    title: 'Hobby Shops',
    links: [
      { label: "Black Tactical", url: "https://black-tactical.com", desc: "Upgrade parts and accessories." },
      { label: "Idea Foam Blaster", url: "https://idealfoamblaster.com/", desc: "Foam blasters and gear." },
      { label: "SABRE", url: "https://springblasters.com/", desc: "Spring-powered blasters and parts." },
      { label: "Gavin Fuzzy Customs (Etsy)", url: "https://www.etsy.com/sg-en/shop/GavinfuzzyCustoms", desc: "Custom blaster work." },
      { label: "Monkee Mods", url: "https://www.monkeemods.com/", desc: "Mod parts and assembled blasters." },
      { label: "AK BlasterMOD", url: "https://www.ak-blastermod.com/", desc: "Blaster modification parts." },
      { label: "Out of Darts", url: "https://outofdarts.com/", desc: "3D printed parts, darts, and accessories." },
      { label: "Foam Pro Shop", url: "https://foamproshop.com/", desc: "Darts and foam blaster supplies." },
      { label: "SilverFox Industries", url: "https://silverfoxindustries.shop/", desc: "High-performance parts and blasters." },
    ],
  },
  {
    title: 'Springers',
    links: [
      { label: "E404 Thesis — Springer Guide", url: "https://tinyurl.com/y8vowygk", desc: "Comprehensive springer modding reference." },
      { label: "SCAR Database", url: "https://tinyurl.com/y7j38rr9", desc: "Spring and catch reference database." },
      { label: "Longshot Springs Chart", url: "https://docs.google.com/spreadsheets/d/15IKUUPP_DF_vsSbOywN7WesvIq7EE8DASFYt7r4t_G0/edit?usp=sharing", desc: "Google Sheets spring comparison chart." },
      { label: "SCAR Database (Alt)", url: "https://docs.google.com/spreadsheets/d/17RIWsLyIMgDnWpWthvFnOuluI_-uDtFND8da2_5BVe4/edit#gid=0", desc: "Alternative SCAR reference sheet." },
      { label: "3D Printed Blaster Library", url: "https://tinyurl.com/y7ffkm5g", desc: "Library of printable springer designs." },
    ],
  },
  {
    title: 'Flywheel',
    links: [
      { label: "E404 Thesis — Flywheel Guide", url: "https://tinyurl.com/y7bkztsj", desc: "Comprehensive flywheel modding reference." },
      { label: "Wiring Guides", url: "https://docs.google.com/presentation/d/1HziMFTPaK7xaQ1W4Hi1GHOBQGmZDkUQZGVk5I-uBA8Y/edit?usp=sharing", desc: "Slide deck covering wiring diagrams and setups." },
      { label: "Interactive Motor Chart", url: "https://suild.com/tools/motor-chart", desc: "Compare motor specs side by side." },
      { label: "Flywheel Battery Help Video", url: "https://www.youtube.com/watch?v=RLJ-Pu5Kk38", desc: "YouTube guide on choosing and using LiPo batteries." },
      { label: "LiPo Charger Help Video", url: "https://www.youtube.com/watch?v=gkHTcZouvUg", desc: "How to safely charge LiPo batteries." },
      { label: "Flywheel Switch Help Video", url: "https://www.youtube.com/watch?v=xWHQO8e9N0k", desc: "Switch wiring walkthrough." },
      { label: "Suild Tools", url: "https://suild.com/tools", desc: "General flywheel calculators and resources." },
      { label: "Motor Spec Sheet", url: "https://docs.google.com/spreadsheets/d/12gOU-GbuqdGVzpOjZJvQ_gq1Nmw63c_sd13Wt4bfn1E/htmlview", desc: "Detailed motor specifications." },
      { label: "MOSFET Beginner's Guide", url: "https://www.reddit.com/r/Nerf/comments/6ufmm8/the_complete_nerf_blaster_mosfet_wiring_tutorial", desc: "Complete MOSFET wiring tutorial on Reddit." },
      { label: "MOSFET Wiring Diagram", url: "https://imgur.com/a/ESJKKbh", desc: "Visual wiring reference." },
    ],
  },
  {
    title: '3D Printing',
    links: [
      { label: "Basic Troubleshooting Guide", url: "https://tinyurl.com/yd7tp7vk", desc: "Fix common 3D printing issues." },
      { label: "G-code Tutorial", url: "https://tinyurl.com/yacjep5e", desc: "Understand and customise your slicer output." },
      { label: "3D Printed Parts List (Reddit Wiki)", url: "https://www.reddit.com/r/nerf/wiki/3dprinted", desc: "Community-maintained list of printable parts." },
      { label: "3D Printed Homemade Blaster Library", url: "https://drive.google.com/open?id=1YHi-dMucY6FEKNMeTnOKDIbyf-veNf7oJuvx2uj0X1g", desc: "Google Drive library of homemade blaster files." },
    ],
  },
  {
    title: 'Gear',
    links: [
      { label: "Micro Rig Guide by Van James", url: "https://docs.google.com/document/d/1LM_-wDHG7V3Wg9v7MOJSbIdFJ5McvpJMpfxu60pDm9A/edit", desc: "How to build and set up a micro rig loadout." },
    ],
  },
]

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

export default function Guides() {
  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
          <p className="section-label">Resources</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">Guides</h1>
          <p className="text-muted mt-2">Resources for new and experienced Nerfers alike.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className={`text-base font-bold mb-3 ${section.highlight ? 'text-red' : 'text-ink'}`}>
                {section.highlight && <span className="mr-2">🆕</span>}{section.title}
              </h2>
              <div className={`border overflow-hidden divide-y ${
                section.highlight
                  ? 'border-red/20 divide-red/10 bg-red/[.03]'
                  : 'border-border divide-border bg-white'
              }`}>
                {section.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm group-hover:text-red transition-colors truncate">
                        {link.label}
                      </p>
                      {link.desc && (
                        <p className="text-muted text-xs mt-0.5">{link.desc}</p>
                      )}
                    </div>
                    <ExternalIcon />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
