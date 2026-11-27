import { useEffect, useRef, useState } from 'react';
import type { Save } from '../types';
import { STATIONS } from '../data/plan';
import { cecDate, frDate } from '../lib/calc';
import { fmtDMY, fmtMY } from '../lib/dates';

/** The route board: horizontal from 640px, vertical below. The token sits on the last station reached in order. */
export function Board({ s }: { s: Save }) {
  const fig = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = fig.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const st = STATIONS.map((x) => ({
    ...x,
    date: x.d === 'today' ? fmtDMY(new Date()) : x.d === 'cec' ? `~${fmtMY(cecDate(s))}` : x.d === 'fr' ? `~${fmtMY(frDate(s))}` : x.d,
    done: x.id === 'now' || !!s.done[x.id],
  }));
  let tok = 0;
  while (tok + 1 < st.length && st[tok + 1].done) tok++;
  const n = st.length;
  const horiz = w >= 640;
  const H = horiz ? 290 : 40 + n * 74;
  const pos = st.map((_, i) => (horiz ? { x: 58 + (i * (w - 130)) / (n - 1), y: H / 2 } : { x: 34, y: 36 + i * 74 }));
  const far = st.findIndex((x) => x.far);
  const [p0, pt, pn] = [pos[0], pos[tok], pos[n - 1]];

  return (
    <div className="fig" ref={fig} style={{ height: H }}>
      <svg role="img" aria-label={`Bản đồ nhiệm vụ chính: ${st.map((x) => `${x.t.replace('|', ' ')} ${x.date}`).join(', ')}`} viewBox={`0 0 ${w || 1} ${H}`}>
        {w > 0 && (
          <>
            {far > 0 && (horiz
              ? <rect className="farzone" x={pos[far].x - 34} y={H / 2 - 108} width={pn.x - pos[far].x + 68} height={216} rx={18} />
              : <rect className="farzone" x={6} y={pos[far].y - 32} width={w - 12} height={pn.y - pos[far].y + 64} rx={18} />)}
            <line className="route rest" x1={p0.x} y1={p0.y} x2={pn.x} y2={pn.y} />
            <line className="route done" x1={p0.x} y1={p0.y} x2={pt.x} y2={pt.y} />
            {st.map((x, i) => {
              const p = pos[i];
              const up = horiz && i % 2 === 0;
              const lines = x.t.split('|');
              const tx = horiz ? p.x : p.x + 28;
              const ty = horiz ? (up ? p.y - 42 - 16 * lines.length : p.y + 40) : p.y - 2;
              return (
                <g key={x.id}>
                  <circle className={x.done ? 'stn done' : 'stn'} cx={p.x} cy={p.y} r={x.done ? 13 : 11} />
                  <text x={tx} y={ty} textAnchor={horiz ? 'middle' : 'start'} className="st-t">
                    {lines.map((l, j) => <tspan key={j} x={tx} dy={j ? 16 : 0}>{l}</tspan>)}
                    <tspan className="st-d" x={tx} dy={16}>{x.date}</tspan>
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${pt.x} ${pt.y})`}>
              <g className="token">
                <circle r="19" fill="var(--yel)" stroke="var(--ink)" strokeWidth="3" />
                <path d="M-9 -2c-4-1-4-8 1-8 1-4 7-5 9-1 3-3 9 0 7 5 3 1 2 5-1 5v5h-16z" fill="#fff" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
              </g>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
