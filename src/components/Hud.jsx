import { useEffect, useRef, useState } from 'react';
import { onToast } from '../hooks/useGamedays';

/* ── Reticle cursor + dart trail ────────────────────────────────────── */
export function ReticleCursor({ enabled = true, trail = true }) {
  const reticleRef = useRef(null);
  const lastTrail  = useRef(0);

  useEffect(() => {
    document.body.classList.toggle('no-reticle', !enabled);
    return () => document.body.classList.remove('no-reticle');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) { if (reticleRef.current) reticleRef.current.style.opacity = '0'; return; }
    function onMove(e) {
      if (reticleRef.current) {
        reticleRef.current.style.opacity = '1';
        reticleRef.current.style.left    = e.clientX + 'px';
        reticleRef.current.style.top     = e.clientY + 'px';
      }
      if (trail) {
        const now = performance.now();
        if (now - lastTrail.current > 28) {
          lastTrail.current = now;
          const d = document.createElement('div');
          d.className = 'dart';
          d.style.left = (e.clientX - 3) + 'px';
          d.style.top  = (e.clientY - 3) + 'px';
          d.style.transition = 'opacity .8s linear, transform .8s ease-out';
          document.body.appendChild(d);
          requestAnimationFrame(() => {
            d.style.opacity   = '0';
            d.style.transform = `translate(${(Math.random()-.5)*14}px,${10+Math.random()*20}px) scale(.4)`;
          });
          setTimeout(() => d.remove(), 850);
        }
      }
    }
    function onLeave() { if (reticleRef.current) reticleRef.current.style.opacity = '0'; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, [enabled, trail]);

  if (!enabled) return null;
  return (
    <div ref={reticleRef} className="reticle" style={{ opacity: 0 }}>
      <svg viewBox="0 0 34 34" width="34" height="34">
        <circle cx="17" cy="17" r="11" fill="none" stroke="#ed1c24" strokeWidth="1.1" strokeDasharray="3 3" opacity=".7"/>
        <circle cx="17" cy="17" r="1.6" fill="#ff4754"/>
        <line x1="17" y1="0"  x2="17" y2="6"  stroke="#ff4754" strokeWidth="1.2"/>
        <line x1="17" y1="28" x2="17" y2="34" stroke="#ff4754" strokeWidth="1.2"/>
        <line x1="0"  y1="17" x2="6"  y2="17" stroke="#ff4754" strokeWidth="1.2"/>
        <line x1="28" y1="17" x2="34" y2="17" stroke="#ff4754" strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

/* ── Hit marker layer ───────────────────────────────────────────────── */
let audioCtx = null;
function playHit(volume = 0.18) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const o1 = audioCtx.createOscillator(); const g1 = audioCtx.createGain();
    o1.type = 'square'; o1.frequency.setValueAtTime(2200, t); o1.frequency.exponentialRampToValueAtTime(700, t+.08);
    g1.gain.setValueAtTime(volume, t); g1.gain.exponentialRampToValueAtTime(0.001, t+.09);
    o1.connect(g1).connect(audioCtx.destination); o1.start(t); o1.stop(t+.1);
    const o2 = audioCtx.createOscillator(); const g2 = audioCtx.createGain();
    o2.type = 'sine'; o2.frequency.setValueAtTime(140, t); o2.frequency.exponentialRampToValueAtTime(60, t+.12);
    g2.gain.setValueAtTime(volume*.8, t); g2.gain.exponentialRampToValueAtTime(0.001, t+.14);
    o2.connect(g2).connect(audioCtx.destination); o2.start(t); o2.stop(t+.15);
  } catch (e) {}
}

export function HitMarkerLayer({ sfx = false }) {
  useEffect(() => {
    function onClick(e) {
      if (!e.target.closest('[data-hit]')) return;
      const mk = document.createElement('div');
      mk.className = 'hitmark';
      mk.style.left = e.clientX + 'px';
      mk.style.top  = e.clientY + 'px';
      document.body.appendChild(mk);
      requestAnimationFrame(() => mk.classList.add('play'));
      setTimeout(() => mk.remove(), 480);
      if (sfx) playHit();
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [sfx]);
  return null;
}

/* ── Corner brackets ────────────────────────────────────────────────── */
export function CornerBrackets() {
  return (
    <>
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>
    </>
  );
}

/* ── Mission ticker ─────────────────────────────────────────────────── */
export function MissionTicker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative border-b border-line bg-panel/70 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-1.5">
        <span className="font-mono text-[10px] tracking-[.18em] uppercase text-foam shrink-0 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-foam pulse-dot"></span>
          LIVE OPS
        </span>
        <div className="flex-1 overflow-hidden relative">
          <div className="marquee-track flex items-center gap-10 whitespace-nowrap w-[200%]">
            {doubled.map((it, i) => (
              <span key={i} className="font-mono text-[11px] text-zinc-400 flex items-center gap-2 shrink-0">
                <span className="text-foam/70">{it.tag}</span>
                <span>{it.text}</span>
                <span className="text-line2">·</span>
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-panel to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-panel to-transparent pointer-events-none"></div>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 hidden md:block shrink-0">
          GMT+8 · {new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

/* ── Tactical bracket label ─────────────────────────────────────────── */
export function Brk({ children, color }) {
  return (
    <span className="brk" style={color ? { color } : null}>
      <span>{children}</span>
    </span>
  );
}

/* ── Count-up hook ──────────────────────────────────────────────────── */
export function useCountUp(target, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    function step(t) {
      const k     = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

/* ── Countdown hook (to absolute timestamp) ─────────────────────────── */
export function useCountdown(targetMs) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const s    = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60, raw: s };
}

/* ── Toast stack ────────────────────────────────────────────────────── */
export function ToastStack() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return onToast((t) => {
      setToasts(cur => [...cur, t]);
      setTimeout(() => setToasts(cur => cur.filter(x => x.id !== t.id)), 6500);
    });
  }, []);
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-6 z-[200] flex flex-col gap-2.5 max-w-[360px]" style={{ transform: 'translateZ(0)' }}>
      {toasts.slice(-5).map(t => <ToastCard key={t.id} toast={t} onClose={() => setToasts(s => s.filter(x => x.id !== t.id))} />)}
    </div>
  );
}

function ToastCard({ toast, onClose }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }, []);
  const isRsvp  = toast.kind === 'new-rsvp';
  const isGame  = toast.kind === 'new-game';
  const accent  = isRsvp ? '#94e472' : '#ed1c24';
  const label   = isRsvp ? 'NEW RSVP' : isGame ? 'NEW GAME' : 'ACTIVITY';
  return (
    <div className="bg-panel border border-line2 rounded-lg p-3.5 shadow-xl pointer-events-auto"
      style={{ transform: shown ? 'translateX(0)' : 'translateX(24px)', opacity: shown ? 1 : 0,
        transition: 'transform .35s cubic-bezier(.22,.7,.28,1), opacity .35s ease', borderLeft: `3px solid ${accent}` }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: accent }}></span>
            <span className="font-mono text-[9.5px] tracking-[.2em] uppercase" style={{ color: accent }}>{label}</span>
            <span className="font-mono text-[9.5px] text-zinc-600 ml-auto">just now</span>
          </div>
          {isRsvp && <div className="text-sm text-zinc-200 leading-snug"><span className="font-bold text-white">{toast.opName || `OP ${(toast.opId||'').slice(0,5).toUpperCase()}`}</span> joined <span className="font-mono text-foam">{toast.gameName}</span></div>}
          {isGame && <div className="text-sm text-zinc-200 leading-snug"><span className="font-bold text-white">{toast.host || 'A host'}</span> posted a new game <span className="font-mono text-foam">{toast.gameName}</span></div>}
        </div>
        <button data-hit onClick={onClose} className="text-zinc-600 hover:text-zinc-300 font-mono text-base leading-none -mt-1">×</button>
      </div>
    </div>
  );
}
