import { useState } from 'react';

const PALETTE = ['#ed1c24','#ff4754','#94e472','#3ca4ff','#e7c44e','#c084fc','#fb923c','#22d3ee'];

function colorFromId(id = '') {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function initialsFrom(name, id, idx = 0) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0][0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '·';
  }
  return (id || '').slice(0, 2).toUpperCase() || `${idx + 1}`;
}

export default function AvatarChip({ name, id, idx = 0, size = 'sm', src = null }) {
  const color  = colorFromId(id || name || String(idx));
  const text   = initialsFrom(name, id, idx);
  const dims   = size === 'lg' ? 'w-10 h-10 text-[12px]' : 'w-8 h-8 text-[10.5px]';
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img src={src} alt={name || 'Operator'} title={name || `Operator ${(id||'').slice(0,6)}`}
        className={`${dims} rounded-full ring-2 ring-ink object-cover`}
        style={{ border: `1px solid ${color}66` }}
        onError={() => setFailed(true)} />
    );
  }
  return (
    <div title={name || `Operator ${(id||'').slice(0,6)}`}
      className={`${dims} rounded-full ring-2 ring-ink flex items-center justify-center font-mono font-bold tabular-nums tracking-tight uppercase`}
      style={{ background: `${color}22`, color, border: `1px solid ${color}66` }}>
      {text}
    </div>
  );
}
