import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

/* ── tiny pub/sub for activity toasts ─────────────────────────────── */
const _toastListeners = new Set();
let _toastId = 0;
export function emitToast(toast) {
  const id = ++_toastId;
  _toastListeners.forEach(fn => fn({ id, ts: Date.now(), ...toast }));
}
export function onToast(fn) {
  _toastListeners.add(fn);
  return () => _toastListeners.delete(fn);
}

/* ── helpers ───────────────────────────────────────────────────────── */

export function extractParticipants(event) {
  const byId = new Map();
  const push = (id, name, avatarUrl) => {
    if (!id) return;
    if (!byId.has(id)) byId.set(id, { id, name: name || null, avatarUrl: avatarUrl || null });
    else {
      const cur = byId.get(id);
      if (!cur.name && name) cur.name = name;
      if (!cur.avatarUrl && avatarUrl) cur.avatarUrl = avatarUrl;
    }
  };
  (event.attendees || []).forEach(a => push(a.id, a.name || a.nickname, a.avatarUrl));
  Object.entries(event.paymentSubmissions || {}).forEach(([uid, sub]) =>
    push(uid, sub?.name, sub?.avatarUrl));
  Object.entries(event.rsvps || {}).forEach(([uid, status]) => {
    if (status === 'yes') push(uid, null, null);
  });
  return [...byId.values()];
}

function diffGamedays(prev, next) {
  const events = [];
  const prevById = new Map((prev || []).map(g => [g.id, g]));
  for (const g of next) {
    const p = prevById.get(g.id);
    if (!p) {
      events.push({ kind: 'new-game', gameId: g.id, gameName: g.name || 'New game', host: g.hostName || null, whenMs: g.scheduledFor });
    } else {
      const before = extractParticipants(p);
      const after  = extractParticipants(g);
      const beforeIds = new Set(before.map(x => x.id));
      after.filter(x => !beforeIds.has(x.id)).forEach(a =>
        events.push({ kind: 'new-rsvp', gameId: g.id, gameName: g.name || 'Game', opName: a.name, opId: a.id }));
    }
  }
  return events;
}

export function deriveStats(all, year = new Date().getFullYear()) {
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd   = new Date(year + 1, 0, 1).getTime();
  const isInYear  = e => { const t = e.scheduledFor || e.createdAt; return t != null && t >= yearStart && t < yearEnd; };
  const inYear    = all.filter(isInYear);
  const now       = Date.now();
  const past      = all.filter(e => e.status === 'ended' || (e.scheduledFor && e.scheduledFor < now));
  const upcoming  = all.filter(e => e.status !== 'ended' && e.scheduledFor && e.scheduledFor >= now);

  let totalRsvps = 0, totalRevenue = 0;
  const hosts = new Set(), operators = new Set();
  for (const e of inYear) {
    const parts = extractParticipants(e);
    totalRsvps += parts.length;
    parts.forEach(p => operators.add(p.id));
    if (e.hostName) hosts.add(e.hostName);
    if (e.entryFee > 0) totalRevenue += e.entryFee * (e.attendees?.length || 0);
  }

  const hostCounts = new Map();
  for (const e of all) if (e.hostName) hostCounts.set(e.hostName, (hostCounts.get(e.hostName) || 0) + 1);
  const topHosts = [...hostCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tsKey = e => e.scheduledFor || e.createdAt || 0;
  past.sort((a, b) => tsKey(b) - tsKey(a));
  upcoming.sort((a, b) => a.scheduledFor - b.scheduledFor);

  return { year, totalAllTime: all.length, yearGames: inYear.length, yearRsvps: totalRsvps,
    yearRevenue: totalRevenue, yearHosts: hosts.size, yearOperators: operators.size,
    upcoming, past, topHosts };
}

/* ── main hook ─────────────────────────────────────────────────────── */

export function useAllGamedays() {
  const [state, setState] = useState({ loading: true, all: [], error: null });
  const prevRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'gamedays'), limit(500));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        all.sort((a, b) => (b.scheduledFor || b.createdAt || 0) - (a.scheduledFor || a.createdAt || 0));
        const prev = prevRef.current;
        if (prev !== null) diffGamedays(prev, all).forEach(emitToast);
        prevRef.current = all;
        setState({ loading: false, all, error: null });
      },
      (err) => {
        console.error('[gamedays]', err.code, err.message);
        setState({ loading: false, all: [], error: err.message });
      }
    );
    return unsub;
  }, []);

  return state;
}
