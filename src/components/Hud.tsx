import type { Save } from '../types';
import { CEC_H, PERMIT, PLAYER } from '../data/plan';
import { cecDate, frDate, frHours, streak, sumTeer } from '../lib/calc';
import { daysUntil, fmtMY } from '../lib/dates';
import { Icon } from './ui';

const nf = (n: number) => Math.round(n).toLocaleString('vi-VN');

export function Avatar({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <circle cx="32" cy="34" r="22" fill="#ffd9c2" />
      <path d="M14 22c0-8 8-12 13-9 2-5 12-6 15 0 6-2 12 3 9 10z" fill="#fff" />
      <rect x="16" y="20" width="32" height="8" rx="3" fill="#fff" />
      <circle cx="25" cy="36" r="2.6" fill="#1d1512" />
      <circle cx="39" cy="36" r="2.6" fill="#1d1512" />
      <path d="M26 44q6 5 12 0" stroke="#1d1512" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="41" r="3" fill="#ff9a8a" opacity=".7" />
      <circle cx="44" cy="41" r="3" fill="#ff9a8a" opacity=".7" />
    </svg>
  );
}

/** Core numbers only: XP from proven completions, the permit clock, CEC hours, French hours. */
export function Hud({ s, xp }: { s: Save; xp: number }) {
  const st = streak(s);
  const proven = s.hist.filter((e) => !e.legacy).length;
  return (
    <header className="hud band">
      <div className="wrap">
        <div className="who">
          <Avatar />
          <div>
            <h1>{PLAYER}</h1>
            <p className="lvl">
              {nf(xp)} XP từ {proven} việc đã nộp bằng chứng
              {st > 0 && <span className="streak"><Icon n="flame" />{st} ngày liền học tiếng Pháp</span>}
            </p>
          </div>
        </div>
        <div className="chips">
          <div className="chip"><b>{Math.max(daysUntil(PERMIT), 0)}</b><span>ngày work permit còn lại</span></div>
          <div className="chip"><b>{nf(Math.min(sumTeer(s), CEC_H))}</b><span>/ 1.560 giờ CEC, đủ ~{fmtMY(cecDate(s))}</span></div>
          <div className="chip"><b>{nf(frHours(s))}</b><span>/ {s.set.frNeed} giờ tiếng Pháp, NCLC 7 ~{fmtMY(frDate(s))}</span></div>
        </div>
      </div>
    </header>
  );
}
