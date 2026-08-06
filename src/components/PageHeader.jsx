/* Canonical inner-page header strip (see DESIGN.md → Page header strip).
   Keeps every page speaking the homepage's display-type language:
   red eyebrow label → condensed uppercase h1 → muted subtitle. */
export default function PageHeader({ eyebrow, title, subtitle, width = 'max-w-4xl', children }) {
  return (
    <section className="bg-surface border-b border-border">
      <div className={`${width} mx-auto px-5 lg:px-8 py-12 lg:py-16`}>
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <h1 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
