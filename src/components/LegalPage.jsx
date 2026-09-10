import PageHeader from './PageHeader'

/* Shared shell for /privacy and /terms.
 *
 * These pages are read, not browsed: no photo header, generous measure, and a
 * plain document rhythm. `updated` is rendered rather than hidden in a comment
 * because "when was this last changed" is the first thing anyone checks on a
 * policy page. */
export default function LegalPage({ title, subtitle, updated, children }) {
  return (
    <div className="min-h-screen page-enter">
      <PageHeader eyebrow="Legal" title={title} subtitle={subtitle} width="max-w-3xl" />
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        <p className="text-xs text-muted uppercase tracking-widest">Last updated {updated}</p>
        <div className="mt-8 flex flex-col gap-8">{children}</div>
      </div>
    </div>
  )
}

export function Section({ heading, children }) {
  return (
    <section>
      <h2 className="font-display text-xl lg:text-2xl text-ink uppercase tracking-tight">{heading}</h2>
      <div className="mt-3 flex flex-col gap-3 text-ink/80 leading-relaxed">{children}</div>
    </section>
  )
}

export function List({ items }) {
  return (
    <ul className="flex flex-col gap-2 pl-5 list-disc marker:text-red">
      {items.map((item, i) => (
        <li key={i} className="text-ink/80 leading-relaxed">{item}</li>
      ))}
    </ul>
  )
}
