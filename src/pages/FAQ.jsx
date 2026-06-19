import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'What are the proper terminologies?',
    a: 'We say "blasters", not guns. We say "darts", not bullets. Using the correct terms helps keep our hobby approachable and avoids unnecessary attention in public spaces.',
  },
  {
    q: 'What should a new player bring?',
    a: 'Safety eyewear (NERF-branded goggles or impact-rated glasses — non-impact rated eyewear is NOT allowed), covered footwear, your blaster, plenty of darts, water, and a comfortable sports outfit.',
  },
  {
    q: 'Can I wear military uniforms or use milsim blasters?',
    a: 'No. Milsim gear and mostly-black blasters are not allowed at NerfSG events. Police have checked on us before — brightly coloured blasters and civilian clothing keep everyone safe and welcome.',
  },
  {
    q: 'What is a dart sweep?',
    a: 'A short break between games where everyone stops to collect darts off the ground. Since we play in public locations, keeping the area clean is important — everyone pitches in.',
  },
  {
    q: 'When are games held?',
    a: 'Games are held weekly on weekends. Check the Events page or nerfsg.com/events for the latest schedule.',
  },
  {
    q: 'What is the minimum age to join?',
    a: 'Regular games: 12 years old and above. Players under 14 must have parental consent and be supervised. Family-friendly games: 6 years and up.',
  },
  {
    q: 'What if I am below the minimum age?',
    a: 'Contact the game host directly. Exceptions are handled on a case-by-case basis.',
  },
  {
    q: 'What is the best blaster to buy?',
    a: "There's no single best blaster — it depends on your play style and budget. Come down to a game, try different blasters, and find what works for you.",
  },
  {
    q: 'How do I improve or modify my blaster?',
    a: 'Check out our Guides page for tips, or join the NerfSG Facebook group where the community shares builds and modifications.',
  },
  {
    q: 'I have more questions — who do I contact?',
    a: null,
    cta: true,
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-surface transition-colors"
      >
        <span className="text-ink font-medium text-sm md:text-base">{item.q}</span>
        <svg
          className={`w-4 h-4 text-red shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-surface border-t border-border">
          {item.cta ? (
            <p className="text-muted text-sm">
              Head over to our{' '}
              <Link to="/contact" className="text-red hover:text-red2 underline underline-offset-2">
                Contact Us
              </Link>{' '}
              page and we'll get back to you.
            </p>
          ) : (
            <p className="text-muted text-sm leading-relaxed">{item.a}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          <p className="section-label">Help</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mt-1">FAQ</h1>
          <p className="text-muted mt-2">Frequently asked questions about NerfSG events.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
