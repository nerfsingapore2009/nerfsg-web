import { useMemo, useState } from 'react';
import { extractParticipants } from '../hooks/useGamedays';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── Sparkline ──────────────────────────────────────────────────────── */
function Sparkline({ values = [], width = 260, height = 56, color = '#e03131' }) {
  if (!values.length) return <div className="h-14 bg-border/40 rounded animate-pulse"></div>;
  const max = Math.max(1, ...values);
  const xs  = values.map((_, i) => (i / Math.max(1, values.length - 1)) * width);
  const ys  = values.map(v => height - 4 - ((v / max) * (height - 12)));
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L${xs[xs.length-1].toFixed(1)} ${height} L0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <path d={fillPath} fill={color} fillOpacity=".12"/>
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={values[i] > 0 ? 1.6 : 0} fill={color}/>)}
      <line x1="0" y1={height-2} x2={width} y2={height-2} stroke="rgba(15,23,42,.08)" strokeWidth="1"/>
    </svg>
  );
}

/* ── Trends row ─────────────────────────────────────────────────────── */
function computeMonthlyTrends(all, year) {
  const games = new Array(12).fill(0);
  const rsvps = new Array(12).fill(0);
  for (const g of all) {
    const ts = g.scheduledFor || g.createdAt;
    if (!ts) continue;
    const d = new Date(ts);
    if (d.getFullYear() !== year) continue;
    const m = d.getMonth();
    games[m]++;
    rsvps[m] += extractParticipants(g).length;
  }
  return { games, rsvps };
}

function TrendCard({ label, values, color, hi, hiLabel }) {
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-muted tracking-widest uppercase">{label}</span>
        <span className="text-sm font-semibold text-ink tabular">{total.toLocaleString()}</span>
      </div>
      <Sparkline values={values} color={color}/>
      <div className="flex items-center justify-between mt-1">
        <div className="grid grid-cols-12 gap-px w-full">
          {MONTH_LABELS.map((m, i) => (
            <span key={m} className={`text-[8.5px] text-center ${i === new Date().getMonth() ? 'text-red font-bold' : 'text-muted'}`}>
              {m[0]}
            </span>
          ))}
        </div>
      </div>
      <div className="text-[11px] text-muted mt-1.5">{hiLabel}: <span className="text-ink font-semibold tabular">{hi}</span></div>
    </div>
  );
}

export function TrendsRow({ all, year }) {
  const trends = useMemo(() => computeMonthlyTrends(all, year), [all, year]);
  const cur    = new Date().getMonth();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <TrendCard label="Games per month" values={trends.games} color="#e03131" hi={trends.games[cur]} hiLabel={`${MONTH_LABELS[cur]} so far`}/>
      <TrendCard label="RSVPs per month" values={trends.rsvps} color="#16a34a" hi={trends.rsvps[cur]} hiLabel={`${MONTH_LABELS[cur]} so far`}/>
    </div>
  );
}

/* ── Year-over-year block ───────────────────────────────────────────── */

// Historical game counts from Google Calendar ICS export (events not in Firebase)
const HISTORICAL_GAME_COUNTS = { 2021: 31, 2022: 60, 2023: 41, 2024: 50, 2025: 21 }

function computeYearStats(all, year) {
  const start = new Date(year, 0, 1).getTime();
  const end   = new Date(year + 1, 0, 1).getTime();
  const inYear = all.filter(g => { const ts = g.scheduledFor || g.createdAt; return ts && ts >= start && ts < end; });
  let rsvps = 0; const ops = new Set();
  for (const g of inYear) { extractParticipants(g).forEach(p => { rsvps++; ops.add(p.id); }); }
  const firebaseGames = inYear.length;
  // Fall back to ICS-derived historical data for years where Firebase has no records
  const games = firebaseGames > 0 ? firebaseGames : (HISTORICAL_GAME_COUNTS[year] || 0);
  const historical = firebaseGames === 0 && HISTORICAL_GAME_COUNTS[year] > 0;
  return { year, games, rsvps: historical ? null : rsvps, ops: historical ? null : ops.size, historical };
}

export function YoYBlock({ all }) {
  const startYear = 2024;
  const thisYear  = new Date().getFullYear();
  const years     = [];
  for (let y = startYear; y <= Math.max(startYear, thisYear); y++) years.push(y);
  const stats    = years.map(y => computeYearStats(all, y));
  const maxGames = Math.max(1, ...stats.map(s => s.games));
  const smCols   = years.length <= 1 ? 'sm:grid-cols-1' : years.length === 2 ? 'sm:grid-cols-2' : years.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4';
  return (
    <div className="mt-6 card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold text-muted tracking-widest uppercase">Year over year</div>
        <div className="text-[11px] font-semibold text-muted tracking-widest uppercase tabular">
          {years.length > 1 ? `${years[0]}–${years[years.length-1]}` : `Since ${years[0]}`}
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-3 ${smCols}`}>
        {stats.map(s => {
          const isCur = s.year === thisYear;
          return (
            <div key={s.year} className={`p-3 border ${isCur ? 'border-red/40 bg-red/[.04]' : 'border-border bg-surface'}`}>
              <div className={`font-display font-black text-3xl tracking-tight ${isCur ? 'text-red' : 'text-ink'}`}>{s.year}</div>
              <div className="text-[10px] font-semibold text-muted tracking-widest uppercase mt-2">Games</div>
              <div className="font-display text-2xl text-ink tabular">{s.games}</div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden mt-1.5">
                <div className={`h-full rounded-full ${isCur ? 'bg-red' : 'bg-border2'}`} style={{ width: `${(s.games/maxGames)*100}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div><div className="text-[9.5px] font-semibold text-muted tracking-widest uppercase">Ops</div><div className="text-sm text-ink font-semibold tabular">{s.historical ? '—' : s.ops}</div></div>
                <div><div className="text-[9.5px] font-semibold text-muted tracking-widest uppercase">RSVPs</div><div className="text-sm text-ink font-semibold tabular">{s.historical ? '—' : s.rsvps}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Game calendar (month grid) ─────────────────────────────────────── */
function buildCalendarData(all, year) {
  const now = Date.now();
  const months = Array.from({ length: 12 }, (_, m) => ({ month: m, games: [] }));
  for (const g of all) {
    const ts = g.scheduledFor || g.createdAt;
    if (!ts || ts > now) continue;
    const d = new Date(ts);
    if (d.getFullYear() !== year) continue;
    months[d.getMonth()].games.push({
      day: d.getDate(),
      name: g.name || 'Game',
      attendees: extractParticipants(g).length,
    });
  }
  return months;
}

export function HeatmapCalendar({ all }) {
  const year     = new Date().getFullYear();
  const curMonth = new Date().getMonth();
  const months   = useMemo(() => buildCalendarData(all, year), [all, year]);
  const total    = months.reduce((s, m) => s + m.games.length, 0);

  return (
    <div className="mt-6 card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] font-semibold text-muted tracking-widest uppercase">Game calendar · {year}</div>
          <div className="text-xs text-muted mt-0.5">{total} game{total !== 1 ? 's' : ''} played so far</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {months.map(({ month, games }) => {
          const isCur    = month === curMonth;
          const isFuture = month > curMonth;
          return (
            <div key={month}
              className={`border p-3 transition-opacity ${isCur ? 'border-red/40 bg-red/[.03]' : 'border-border'} ${isFuture ? 'opacity-25' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isCur ? 'text-red' : 'text-ink'}`}>
                  {MONTH_LABELS[month]}
                </span>
                {games.length > 0 && (
                  <span className="text-[10px] font-semibold tabular text-red">{games.length}</span>
                )}
              </div>
              {games.length === 0 ? (
                <div className="text-[10px] text-muted/40">—</div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {games.map((g, i) => (
                    <li key={i} className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-red/70 tabular shrink-0 w-4">
                        {String(g.day).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-muted truncate leading-tight">{g.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
