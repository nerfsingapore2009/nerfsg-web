import { useState, useEffect, useMemo } from 'react';
import { extractParticipants } from '../hooks/useGamedays';
import { Brk } from './Hud';

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
  const [view, setView] = useState('table');
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
      <section className="relative border-b border-line bg-panel/30">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16">
          <div className="animate-pulse h-32 bg-line/30 rounded"></div>
        </div>
      </section>
    );
  }
  if (past.length === 0) return null;

  return (
    <section className="relative border-b border-line bg-panel/30">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-3">
          <div>
            <Brk>// Archive</Brk>
            <h2 className="font-display text-4xl lg:text-5xl text-white mt-2 uppercase tracking-tight">Past games.</h2>
            <p className="text-zinc-400 mt-2 max-w-xl">Every game we&apos;ve run. Click any row for the full roster, RSVPs, and host notes.</p>
          </div>
          <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.18em]">
            {filtered.length} OF {past.length} GAMES
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-panel border border-line2 rounded-lg p-3 mb-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, venue, host…"
              className="w-full bg-ink border border-line rounded-md pl-9 pr-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:border-foam/50 focus:outline-none font-mono"/>
          </div>

          <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
            className="bg-ink border border-line rounded-md px-3 py-2 text-[12px] text-white focus:border-foam/50 focus:outline-none font-mono">
            <option value="all">All months</option>
            {monthsAvailable.map(k => {
              const [y, m] = k.split('-');
              return <option key={k} value={k}>{MONTHS_FULL[+m]} {y}</option>;
            })}
          </select>

          <select value={hostFilter} onChange={e => setHostFilter(e.target.value)}
            className="bg-ink border border-line rounded-md px-3 py-2 text-[12px] text-white focus:border-foam/50 focus:outline-none font-mono">
            <option value="all">All hosts</option>
            {hostsAvailable.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <div className="flex bg-ink border border-line rounded-md overflow-hidden">
            <button data-hit onClick={() => setView('table')}
              className={`px-3 py-2 text-[11px] font-mono tracking-[.16em] ${view === 'table' ? 'bg-foam text-white' : 'text-zinc-400 hover:text-white'}`}>
              TABLE
            </button>
            <button data-hit onClick={() => setView('wall')}
              className={`px-3 py-2 text-[11px] font-mono tracking-[.16em] ${view === 'wall' ? 'bg-foam text-white' : 'text-zinc-400 hover:text-white'}`}>
              WALL
            </button>
          </div>

          {(search || monthFilter !== 'all' || hostFilter !== 'all') && (
            <button data-hit onClick={() => { setSearch(''); setMonthFilter('all'); setHostFilter('all'); }}
              className="font-mono text-[10px] text-foam hover:text-foam2 px-2 py-2 tracking-[.16em]">
              CLEAR ALL
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="bg-panel border border-line2 rounded-lg p-12 text-center">
            <div className="font-mono text-[11px] text-zinc-500 tracking-[.18em]">// NO GAMES MATCH YOUR FILTERS</div>
          </div>
        ) : view === 'table' ? (
          <PastGamesTable items={visible} onOpen={setOpenId} />
        ) : (
          <PastGamesWall items={visible} onOpen={setOpenId} />
        )}

        {filtered.length > visible.length && !showAll && (
          <div className="text-center mt-5">
            <button data-hit onClick={() => setShowAll(true)}
              className="bg-panel hover:bg-panel2 border border-line hover:border-foam/40 text-white font-mono text-[11px] tracking-[.18em] px-5 py-2.5 rounded-md transition-colors">
              + SHOW ALL · {filtered.length - visible.length} HIDDEN
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
    <div className="bg-panel border border-line2 rounded-lg overflow-hidden">
      <div className="hidden md:grid grid-cols-[44px_120px_1fr_140px_120px_80px_60px] gap-3 px-4 py-2.5 bg-ink/50 border-b border-line font-mono text-[9.5px] text-zinc-500 tracking-[.18em]">
        <span></span><span>DATE</span><span>NAME</span><span>VENUE</span><span>HOST</span>
        <span className="text-right">OPS</span><span></span>
      </div>
      <ul className="divide-y divide-line">
        {items.map(g => {
          const parts = extractParticipants(g);
          const ts = g.scheduledFor || g.createdAt;
          const dateStr = ts ? new Date(ts).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
          return (
            <li key={g.id} data-hit onClick={() => onOpen(g.id)}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[44px_120px_1fr_140px_120px_80px_60px] gap-3 px-4 py-3 hover:bg-panel2 transition-colors items-center cursor-pointer">
              <div className="hidden md:block w-9 h-9 rounded overflow-hidden border border-line bg-ink shrink-0">
                {g.groupPhoto
                  ? <img src={g.groupPhoto} loading="lazy" decoding="async" className="w-full h-full object-cover" alt=""/>
                  : <div className="ph-stripes w-full h-full"></div>}
              </div>
              <span className="font-mono text-[11px] text-zinc-400 tabular-nums">{dateStr}</span>
              <span className="font-display text-base text-white tracking-tight uppercase truncate">
                {g.name || <span className="text-zinc-500">Untitled</span>}
              </span>
              <span className="hidden md:block font-mono text-[11px] text-zinc-400 truncate">{g.location || '—'}</span>
              <span className="hidden md:block font-mono text-[11px] text-foam truncate">
                {g.hostName ? g.hostName.toUpperCase() : '—'}
              </span>
              <span className="font-mono text-sm text-white tabular-nums text-right">{parts.length}</span>
              <span className="hidden md:block font-mono text-[11px] text-zinc-500 text-right">→</span>
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
          <div key={g.id} data-hit onClick={() => onOpen(g.id)}
            className="bg-panel border border-line2 rounded-lg overflow-hidden flex flex-col cursor-pointer lift hover:border-foam/40">
            <div className="relative h-32 bg-ink overflow-hidden">
              {g.groupPhoto
                ? <img src={g.groupPhoto} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={g.name || ''}/>
                : <div className="ph-stripes w-full h-full"></div>}
              <div className="absolute top-2 left-2 bg-ink/85 border border-line px-2 py-1 rounded font-mono text-[9.5px] text-foam tracking-[.16em] pointer-events-none">
                {dateStr.toUpperCase()}
              </div>
              <div className="absolute top-2 right-2 bg-ink/85 border border-line px-2 py-1 rounded font-mono text-[9.5px] text-white tracking-[.16em] tabular-nums pointer-events-none">
                {parts.length} OPS
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <div className="font-display text-base text-white uppercase tracking-tight truncate leading-tight">
                {g.name || 'Untitled'}
              </div>
              <div className="font-mono text-[10px] text-zinc-500 truncate mt-1">
                {g.hostName ? `BY ${g.hostName.toUpperCase()}` : ''}{g.location ? ` · ${g.location}` : ''}
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
      <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm"></div>

      <div className="relative bg-panel border border-line2 rounded-lg max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 pb-3 border-b border-line bg-panel2/50">
          <div className="min-w-0">
            <div className="font-mono text-[10px] text-foam tracking-[.18em] mb-1">
              FILE #{game.id.slice(0,8).toUpperCase()} {isPast ? '· ARCHIVED' : '· UPCOMING'}
            </div>
            <h3 className="font-display text-3xl text-white tracking-tight truncate">{game.name || 'Untitled game'}</h3>
            <div className="text-zinc-400 text-sm mt-1.5">
              {ts ? `${formatDayLong(ts)} · ${formatTime(ts)}` : 'No date set'}
              {game.location ? ` · ${game.location}` : ''}
            </div>
            {game.hostName && (
              <div className="font-mono text-[10.5px] text-zinc-500 tracking-[.14em] mt-1.5">
                HOSTED BY <span className="text-foam">{game.hostName.toUpperCase()}</span>
                {game.sessionType === 'paid' && game.entryFee > 0 && (
                  <span className="ml-3 text-zinc-400">· ENTRY <span className="text-white">${game.entryFee}</span></span>
                )}
                {game.maxSlots && <span className="ml-3 text-zinc-400">· CAP <span className="text-white">{game.maxSlots}</span></span>}
              </div>
            )}
          </div>
          <button data-hit onClick={onClose}
            className="text-zinc-500 hover:text-white text-2xl font-mono leading-none px-2 -mt-1">×</button>
        </div>

        {/* body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-5">
          {(game.note || game.fieldNotes) && (
            <div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">HOST NOTES</div>
              <div className="bg-ink border border-line rounded p-3 text-[13px] text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {game.note || game.fieldNotes}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">CONFIRMED · {yesIds.size}</div>
            {game.maxSlots && <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">{yesIds.size}/{game.maxSlots} SLOTS</div>}
          </div>

          {maybeIds.size > 0 && (
            <div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">MAYBE · {maybeIds.size}</div>
              <div className="flex flex-wrap gap-1.5">
                {[...maybeIds].map(uid => (
                  <span key={uid} className="font-mono text-[10px] text-zinc-300 bg-ink border border-line rounded px-2 py-1">
                    {nameFor(uid) || `OP-${uid.slice(0,5).toUpperCase()}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(payments).length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">
                PAYMENT SUBMISSIONS · {Object.keys(payments).length}
              </div>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="font-mono text-[9.5px] text-zinc-500 tracking-[.16em] text-left">
                    <th className="py-1.5 font-normal">OPERATOR</th>
                    <th className="py-1.5 font-normal">METHOD</th>
                    <th className="py-1.5 font-normal text-right">WHEN</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(payments).map(([uid, p]) => (
                    <tr key={uid} className="border-t border-line">
                      <td className="py-1.5 font-display text-white uppercase tracking-tight">{p.name || `OP-${uid.slice(0,5).toUpperCase()}`}</td>
                      <td className="py-1.5 font-mono text-zinc-300">{(p.method || '—').toUpperCase()}</td>
                      <td className="py-1.5 font-mono text-zinc-500 text-right">{p.submittedAt ? formatDayLong(p.submittedAt) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em] mb-2">PHOTO</div>
            <div className="aspect-[16/9] bg-ink border border-line rounded overflow-hidden">
              {game.groupPhoto
                ? <img src={game.groupPhoto} className="w-full h-full object-cover" alt={game.name || 'Game photo'} loading="lazy" decoding="async"/>
                : <div className="ph-stripes w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[10px] text-zinc-600 tracking-[.16em]">// NO PHOTO</span>
                  </div>}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-line p-4 flex items-center justify-between bg-panel2/50">
          <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">ESC TO CLOSE</div>
          {!isPast && (
            <a data-hit href="https://nerf-singapore.web.app" target="_blank" rel="noopener noreferrer"
              className="bg-foam hover:bg-foam2 text-white font-bold uppercase tracking-[.18em] text-[11px] px-4 py-2 rounded-md transition-colors">
              Open in app →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
