import { useState, useEffect, useMemo } from 'react';
import { extractParticipants } from '../hooks/useGamedays';

const MONTHS_FULL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDayLong(ms) {
  const d = new Date(ms);
  return d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(ms) {
  return new Date(ms).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function PastGames({ data }) {
  const { loading, stats } = data;
  const past = stats?.past || [];

  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [hostFilter, setHostFilter] = useState('all');
  const [view, setView] = useState('wall');           // image-first by default
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const monthsAvailable = useMemo(() => {
    const set = new Set();
    past.forEach(g => {
      const ts = g.scheduledFor || g.createdAt;
      if (!ts) return;
      const d = new Date(ts);
      set.add(`${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`);
    });
    return [...set].sort().reverse();
  }, [past]);

  const hostsAvailable = useMemo(() => {
    const set = new Set();
    past.forEach(g => { if (g.hostName) set.add(g.hostName); });
    return [...set].sort();
  }, [past]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return past.filter(g => {
      if (q) {
        const hay = `${g.name || ''} ${g.location || ''} ${g.hostName || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (monthFilter !== 'all') {
        const ts = g.scheduledFor || g.createdAt;
        if (!ts) return false;
        const d = new Date(ts);
        const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`;
        if (key !== monthFilter) return false;
      }
      if (hostFilter !== 'all' && g.hostName !== hostFilter) return false;
      return true;
    });
  }, [past, search, monthFilter, hostFilter]);

  const pageSize = view === 'wall' ? 12 : 10;
  const visible = showAll ? filtered : filtered.slice(0, pageSize);
  const openGame = openId ? past.find(g => g.id === openId) : null;

  if (loading) {
    return (
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
          <div className="animate-pulse h-32 bg-border"></div>
        </div>
      </section>
    );
  }
  if (past.length === 0) return null;

  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-20" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-3">
          <div>
            <p className="section-label">Archive</p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink mt-2 uppercase tracking-tight">Past games.</h2>
            <p className="text-muted mt-2 max-w-xl">Every game we&apos;ve run. Click any card for the full roster, RSVPs, and host notes.</p>
          </div>
          <div className="text-xs font-semibold text-muted tracking-widest uppercase tabular">
            {filtered.length} of {past.length} games
          </div>
        </div>

        {/* CONTROLS */}
        <div className="card p-3 mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, venue, host…"
              className="w-full bg-surface border border-border pl-9 pr-3 py-2 text-sm text-ink placeholder:text-muted focus:border-red/50 focus:outline-none focus:ring-2 focus:ring-red/15"/>
          </div>

          <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
            className="bg-surface border border-border px-3 py-2 text-sm text-ink focus:border-red/50 focus:outline-none">
            <option value="all">All months</option>
            {monthsAvailable.map(k => {
              const [y, m] = k.split('-');
              return <option key={k} value={k}>{MONTHS_FULL[+m]} {y}</option>;
            })}
          </select>

          <select value={hostFilter} onChange={e => setHostFilter(e.target.value)}
            className="bg-surface border border-border px-3 py-2 text-sm text-ink focus:border-red/50 focus:outline-none">
            <option value="all">All hosts</option>
            {hostsAvailable.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <div className="flex bg-surface border border-border overflow-hidden">
            <button onClick={() => setView('wall')}
              className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${view === 'wall' ? 'bg-red text-white' : 'text-muted hover:text-ink'}`}>
              Wall
            </button>
            <button onClick={() => setView('table')}
              className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${view === 'table' ? 'bg-red text-white' : 'text-muted hover:text-ink'}`}>
              Table
            </button>
          </div>

          {(search || monthFilter !== 'all' || hostFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setMonthFilter('all'); setHostFilter('all'); }}
              className="text-xs font-semibold text-red hover:text-red2 px-2 py-2 tracking-wide uppercase">
              Clear all
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-sm text-muted">No games match your filters.</div>
          </div>
        ) : view === 'table' ? (
          <PastGamesTable items={visible} onOpen={setOpenId} />
        ) : (
          <PastGamesWall items={visible} onOpen={setOpenId} />
        )}

        {filtered.length > visible.length && !showAll && (
          <div className="text-center mt-6">
            <button onClick={() => setShowAll(true)} className="btn-ghost">
              Show all · {filtered.length - visible.length} more
            </button>
          </div>
        )}
      </div>

      {openGame && <GameDetailModal game={openGame} onClose={() => setOpenId(null)} />}
    </section>
  );
}

function PastGamesTable({ items, onOpen }) {
  return (
    <div className="card overflow-hidden">
      <div className="hidden md:grid grid-cols-[44px_120px_1fr_140px_120px_80px_60px] gap-3 px-4 py-2.5 bg-surface border-b border-border text-xs font-semibold text-muted tracking-widest uppercase">
        <span></span><span>Date</span><span>Name</span><span>Venue</span><span>Host</span>
        <span className="text-right">Ops</span><span></span>
      </div>
      <ul className="divide-y divide-border">
        {items.map(g => {
          const parts = extractParticipants(g);
          const ts = g.scheduledFor || g.createdAt;
          const dateStr = ts ? new Date(ts).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
          return (
            <li key={g.id} onClick={() => onOpen(g.id)}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[44px_120px_1fr_140px_120px_80px_60px] gap-3 px-4 py-3 hover:bg-surface transition-colors items-center cursor-pointer">
              <div className="hidden md:block w-9 h-9 overflow-hidden border border-border bg-surface shrink-0">
                {g.groupPhoto
                  ? <img src={g.groupPhoto} loading="lazy" decoding="async" className="w-full h-full object-cover" alt=""/>
                  : <div className="photo-placeholder w-full h-full"></div>}
              </div>
              <span className="text-xs text-muted tabular">{dateStr}</span>
              <span className="font-display text-base text-ink tracking-tight uppercase truncate">
                {g.name || <span className="text-muted">Untitled</span>}
              </span>
              <span className="hidden md:block text-sm text-muted truncate">{g.location || '—'}</span>
              <span className="hidden md:block text-sm font-semibold text-red truncate">
                {g.hostName || '—'}
              </span>
              <span className="text-sm font-semibold text-ink tabular text-right">{parts.length}</span>
              <span className="hidden md:block text-muted text-right">→</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PastGamesWall({ items, onOpen }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(g => {
        const parts = extractParticipants(g);
        const ts = g.scheduledFor || g.createdAt;
        const dateStr = ts ? new Date(ts).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';
        return (
          <div key={g.id} onClick={() => onOpen(g.id)}
            className="card card-hover overflow-hidden flex flex-col cursor-pointer">
            <div className="relative h-32 bg-surface overflow-hidden">
              {g.groupPhoto
                ? <img src={g.groupPhoto} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={g.name || ''}/>
                : <div className="photo-placeholder w-full h-full"></div>}
              <div className="absolute top-2 left-2 bg-ink/80 text-white px-2 py-1 text-[10px] font-semibold tracking-wide uppercase pointer-events-none">
                {dateStr}
              </div>
              <div className="absolute top-2 right-2 bg-ink/80 text-white px-2 py-1 text-[10px] font-semibold tracking-wide tabular pointer-events-none">
                {parts.length} ops
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <div className="font-display text-base text-ink uppercase tracking-tight truncate leading-tight">
                {g.name || 'Untitled'}
              </div>
              <div className="text-xs text-muted truncate mt-1">
                {g.hostName ? `by ${g.hostName}` : ''}{g.location ? ` · ${g.location}` : ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GameDetailModal({ game, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const payments = game.paymentSubmissions || {};
  const rsvps    = game.rsvps || {};

  const yesIds   = new Set();
  const maybeIds = new Set();
  Object.entries(rsvps).forEach(([uid, status]) => {
    if (status === 'yes') yesIds.add(uid);
    else if (status === 'maybe') maybeIds.add(uid);
  });
  (game.attendees || []).forEach(a => yesIds.add(a.id));
  Object.keys(payments).forEach(uid => yesIds.add(uid));

  const nameFor = uid => {
    const att = (game.attendees || []).find(a => a.id === uid);
    if (att?.name) return att.name;
    if (payments[uid]?.name) return payments[uid].name;
    return null;
  };

  const ts = game.scheduledFor || game.createdAt;
  const isPast = !ts || ts < Date.now() || game.status === 'ended';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm"></div>

      <div className="relative bg-white border border-border max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 pb-3 border-b border-border bg-surface">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-red tracking-widest uppercase mb-1">
              File #{game.id.slice(0,8).toUpperCase()} {isPast ? '· Archived' : '· Upcoming'}
            </div>
            <h3 className="font-display text-3xl text-ink tracking-tight truncate">{game.name || 'Untitled game'}</h3>
            <div className="text-muted text-sm mt-1.5">
              {ts ? `${formatDayLong(ts)} · ${formatTime(ts)}` : 'No date set'}
              {game.location ? ` · ${game.location}` : ''}
            </div>
            {game.hostName && (
              <div className="text-xs text-muted tracking-wide mt-1.5">
                Hosted by <span className="text-red font-semibold">{game.hostName}</span>
                {game.sessionType === 'paid' && game.entryFee > 0 && (
                  <span className="ml-3">· Entry <span className="text-ink font-semibold">${game.entryFee}</span></span>
                )}
                {game.maxSlots && <span className="ml-3">· Cap <span className="text-ink font-semibold">{game.maxSlots}</span></span>}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close"
            className="text-muted hover:text-ink text-2xl leading-none px-2 -mt-1">×</button>
        </div>

        {/* body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-5">
          {(game.note || game.fieldNotes) && (
            <div>
              <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-2">Host notes</div>
              <div className="bg-surface border border-border p-3 text-sm text-ink leading-relaxed whitespace-pre-wrap">
                {game.note || game.fieldNotes}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-muted tracking-widest uppercase">Confirmed · {yesIds.size}</div>
            {game.maxSlots && <div className="text-xs font-semibold text-muted tracking-widest uppercase">{yesIds.size}/{game.maxSlots} slots</div>}
          </div>

          {maybeIds.size > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-2">Maybe · {maybeIds.size}</div>
              <div className="flex flex-wrap gap-1.5">
                {[...maybeIds].map(uid => (
                  <span key={uid} className="text-xs text-ink bg-surface border border-border rounded-full px-2.5 py-1">
                    {nameFor(uid) || `OP-${uid.slice(0,5).toUpperCase()}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(payments).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-2">
                Payment submissions · {Object.keys(payments).length}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted tracking-wide uppercase text-left">
                    <th className="py-1.5 font-semibold">Operator</th>
                    <th className="py-1.5 font-semibold">Method</th>
                    <th className="py-1.5 font-semibold text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(payments).map(([uid, p]) => (
                    <tr key={uid} className="border-t border-border">
                      <td className="py-1.5 font-display text-ink uppercase tracking-tight">{p.name || `OP-${uid.slice(0,5).toUpperCase()}`}</td>
                      <td className="py-1.5 text-muted">{(p.method || '—')}</td>
                      <td className="py-1.5 text-muted text-right">{p.submittedAt ? formatDayLong(p.submittedAt) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-muted tracking-widest uppercase mb-2">Photo</div>
            <div className="aspect-[16/9] bg-surface border border-border overflow-hidden">
              {game.groupPhoto
                ? <img src={game.groupPhoto} className="w-full h-full object-cover" alt={game.name || 'Game photo'} loading="lazy" decoding="async"/>
                : <div className="photo-placeholder w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted">No photo</span>
                  </div>}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-border p-4 flex items-center justify-between bg-surface">
          <div className="text-xs text-muted tracking-wide uppercase">Esc to close</div>
          {!isPast && (
            <a href="https://nerfsg.app" target="_blank" rel="noopener noreferrer" className="btn-red text-xs">
              Open in app →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
