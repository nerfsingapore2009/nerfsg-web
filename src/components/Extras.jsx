import { useMemo, useState } from 'react';
import { extractParticipants } from '../hooks/useGamedays';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── Sparkline ──────────────────────────────────────────────────────── */
function Sparkline({ values = [], width = 260, height = 56, color = '#ed1c24' }) {
  if (!values.length) return <div className="h-14 bg-line/20 rounded animate-pulse"></div>;
  const max = Math.max(1, ...values);
  const xs  = values.map((_, i) => (i / Math.max(1, values.length - 1)) * width);
  const ys  = values.map(v => height - 4 - ((v / max) * (height - 12)));
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L${xs[xs.length-1].toFixed(1)} ${height} L0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <path d={fillPath} fill={color} fillOpacity=".15"/>
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={values[i] > 0 ? 1.6 : 0} fill={color}/>)}
      <line x1="0" y1={height-2} x2={width} y2={height-2} stroke="rgba(255,255,255,.06)" strokeWidth="1"/>
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
    <div className="bg-panel border border-line2 rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9.5px] text-zinc-500 tracking-[.18em]">{label}</span>
        <span className="font-mono text-[10px] text-white tabular-nums">{total.toLocaleString()}</span>
      </div>
      <Sparkline values={values} color={color}/>
      <div className="flex items-center justify-between mt-1">
        <div className="grid grid-cols-12 gap-px w-full">
          {MONTH_LABELS.map((m, i) => (
            <span key={m} className={`font-mono text-[8.5px] text-center ${i === new Date().getMonth() ? 'text-foam font-bold' : 'text-zinc-600'}`}>
              {m[0]}
            </span>
          ))}
        </div>
      </div>
      <div className="font-mono text-[10px] text-zinc-500 mt-1.5">{hiLabel}: <span className="text-white tabular-nums">{hi}</span></div>
    </div>
  );
}

export function TrendsRow({ all, year }) {
  const trends = useMemo(() => computeMonthlyTrends(all, year), [all, year]);
  const cur    = new Date().getMonth();
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-3">
      <TrendCard label="GAMES PER MONTH" values={trends.games} color="#ed1c24" hi={trends.games[cur]} hiLabel={`${MONTH_LABELS[cur]} so far`}/>
      <TrendCard label="RSVPS PER MONTH" values={trends.rsvps} color="#94e472" hi={trends.rsvps[cur]} hiLabel={`${MONTH_LABELS[cur]} so far`}/>
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
  return (
    <div className="mt-6 bg-panel border border-line2 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">YEAR-OVER-YEAR</div>
        <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">
          {years.length > 1 ? `${years[0]}–${years[years.length-1]}` : `SINCE ${years[0]}`}
        </div>
      </div>
      <div className={`grid gap-3 ${years.length <= 1 ? 'grid-cols-1' : years.length === 2 ? 'grid-cols-2' : years.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {stats.map(s => {
          const isCur = s.year === thisYear;
          return (
            <div key={s.year} className={`p-3 rounded border ${isCur ? 'border-foam/40 bg-foam/[.04]' : 'border-line bg-ink'}`}>
              <div className={`font-display font-black text-3xl tracking-tight ${isCur ? 'text-foam' : 'text-white'}`}>{s.year}</div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[.16em] mt-2">GAMES</div>
              <div className="font-display text-2xl text-white tabular-nums">{s.games}</div>
              <div className="h-1 bg-ink/80 border border-line rounded-sm overflow-hidden mt-1.5">
                <div className={`h-full ${isCur ? 'bg-foam' : 'bg-zinc-600'}`} style={{ width: `${(s.games/maxGames)*100}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div><div className="font-mono text-[9.5px] text-zinc-500 tracking-[.16em]">OPS</div><div className="font-mono text-sm text-white tabular-nums">{s.historical ? '—' : s.ops}</div></div>
                <div><div className="font-mono text-[9.5px] text-zinc-500 tracking-[.16em]">RSVPS</div><div className="font-mono text-sm text-white tabular-nums">{s.historical ? '—' : s.rsvps}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Heatmap calendar ───────────────────────────────────────────────── */
function buildHeatmapData(all, year) {
  const byDay = new Map();
  for (const g of all) {
    const ts = g.scheduledFor || g.createdAt;
    if (!ts) continue;
    const d = new Date(ts);
    if (d.getFullYear() !== year) continue;
    const key = d.toISOString().slice(0, 10);
    const cur = byDay.get(key) || { games: 0, attendees: 0, names: [] };
    cur.games++;
    cur.attendees += extractParticipants(g).length;
    cur.names.push(g.name || 'Game');
    byDay.set(key, cur);
  }
  return byDay;
}

export function HeatmapCalendar({ all }) {
  const [hover, setHover] = useState(null);
  const year       = new Date().getFullYear();
  const byDay      = useMemo(() => buildHeatmapData(all, year), [all, year]);
  const start      = new Date(year, 0, 1);
  const startDow   = start.getDay();
  const daysInYear = Math.floor((new Date(year, 11, 31) - new Date(year, 0, 1)) / 86400000) + 1;
  const weeks      = Math.ceil((startDow + daysInYear) / 7);
  const maxAtt     = Math.max(1, ...[...byDay.values()].map(v => v.attendees));

  const monthCols = [];
  for (let m = 0; m < 12; m++) {
    const first  = new Date(year, m, 1);
    const dayIdx = Math.floor((first - new Date(year, 0, 1)) / 86400000) + startDow;
    monthCols.push({ month: m, col: Math.floor(dayIdx / 7) });
  }

  const cells = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const idx    = w * 7 + d;
      const dayIdx = idx - startDow;
      if (dayIdx < 0 || dayIdx >= daysInYear) { cells.push({ empty: true }); continue; }
      const date = new Date(year, 0, 1 + dayIdx);
      const key  = date.toISOString().slice(0, 10);
      cells.push({ date, key, data: byDay.get(key) });
    }
  }

  return (
    <div className="mt-6 bg-panel border border-line2 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] text-zinc-500 tracking-[.18em]">ACTIVITY CALENDAR · {year}</div>
        <div className="flex items-center gap-2 font-mono text-[9.5px] text-zinc-500 tracking-[.16em]">
          LESS
          <div className="flex gap-1">
            {[0,.2,.4,.7,1].map((a, i) => (
              <span key={i} className="w-3 h-3 rounded-sm" style={{ background: a === 0 ? '#1a1a1d' : `rgba(237,28,36,${a})`, border: '1px solid #26262c' }}></span>
            ))}
          </div>
          MORE
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <div className="relative h-4 mb-1" style={{ paddingLeft: 28 }}>
          {monthCols.map(({ month, col }) => (
            <span key={month} className="absolute font-mono text-[9.5px] text-zinc-500" style={{ left: col * 14 + 'px', top: 0 }}>
              {MONTH_LABELS[month]}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5" style={{ minWidth: weeks * 14 + 28 }}>
          <div className="flex flex-col gap-1 mr-1 pt-0.5">
            {['Mon','Wed','Fri'].map(d => (
              <div key={d} className="font-mono text-[9px] text-zinc-600 leading-none" style={{ height: '12px', marginTop: '12px' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {cells.map((c, i) => {
              if (c.empty) return <div key={i} className="w-3 h-3"></div>;
              const a  = c.data ? Math.min(1, c.data.attendees / maxAtt) : 0;
              const bg = a === 0 ? '#15151a' : `rgba(237,28,36,${0.18 + a * 0.7})`;
              return (
                <div key={i} onMouseEnter={() => setHover({ ...c })} onMouseLeave={() => setHover(null)}
                  className="w-3 h-3 rounded-sm transition-colors cursor-default"
                  style={{ background: bg, border: '1px solid #26262c' }}></div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 h-5 font-mono text-[10.5px] text-zinc-400">
          {hover ? (
            hover.data
              ? <span><span className="text-foam">{hover.key}</span> — {hover.data.games} game{hover.data.games > 1 ? 's' : ''}, {hover.data.attendees} ops — {hover.data.names.join(', ')}</span>
              : <span><span className="text-zinc-500">{hover.key}</span> — no games</span>
          ) : <span className="text-zinc-600">// hover a day for details</span>}
        </div>
      </div>
    </div>
  );
}
