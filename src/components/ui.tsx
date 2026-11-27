import type { ReactNode } from 'react';

export function Meter({ v, max, goal }: { v: number; max: number; goal?: boolean }) {
  const p = max > 0 ? Math.max(0, Math.min(100, (v / max) * 100)) : 0;
  return (
    <div className="meter">
      <i className={goal ? 'goal' : undefined} style={{ width: `${p}%` }} />
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange, label, scroll }: {
  items: readonly (readonly [T, string])[]; value: T; onChange: (v: T) => void; label: string; scroll?: boolean;
}) {
  return (
    <div className={scroll ? 'tabs scroll' : 'tabs'} role="tablist" aria-label={label}>
      {items.map(([k, n]) => (
        <button key={k} type="button" role="tab" className="tab" aria-selected={value === k} onClick={() => onChange(k)}>
          {n}
        </button>
      ))}
    </div>
  );
}

const STAR_NAMES = ['Chưa học', 'Đang học', 'Ổn', 'Vững'];
/** Three-star mastery. Clicking the highest lit star again lowers it by one. */
export function Stars({ v, onChange, label }: { v: number; onChange: (n: number) => void; label: string }) {
  return (
    <span className="stars" role="group" aria-label={`${label}: ${STAR_NAMES[v] ?? STAR_NAMES[0]}`}>
      {[1, 2, 3].map((i) => (
        <button key={i} type="button" className={i <= v ? 'on' : undefined} aria-pressed={i <= v} title={STAR_NAMES[i]}
          aria-label={STAR_NAMES[i]} onClick={() => onChange(v === i ? i - 1 : i)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" /></svg>
        </button>
      ))}
    </span>
  );
}

export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

const PATHS: Record<string, string> = {
  today: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  french: 'M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5',
  quests: 'M5 4h14v16H5zM9 12l2 2 4-4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  flame: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1.5 1 2.5 2.5 3 4 .5-2 0-4 0-7z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
};
export function Icon({ n }: { n: string }) {
  return <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d={PATHS[n]} /></svg>;
}
