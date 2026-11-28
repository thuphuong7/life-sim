import type { Mock, Save, Skill, TestId } from '../types';
import { CEC_H, START, WEEK } from '../data/plan';
import { GRAMMAR, nclcOf } from '../data/french';
import { DAY, addDays, isoDate, mondayOf, parseISO } from './dates';

const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const sumTeer = (s: Save) => total(s.log.map((r) => r.teer || 0));
export const dayMin = (s: Save, d: string) => total(Object.values(s.fr.days[d] ?? {}).map((v) => v ?? 0));
/** Weekly French hours typed in the log (v1 style) plus minutes logged per day. */
export const frHours = (s: Save) => total(s.log.map((r) => r.fr || 0)) + total(Object.keys(s.fr.days).map((d) => dayMin(s, d))) / 60;

export function weekMinutes(s: Save, wk: string) {
  const out: Record<Skill, number> = { co: 0, ce: 0, ee: 0, eo: 0, gv: 0 };
  const m = parseISO(wk);
  for (let i = 0; i < 7; i++) {
    const day = s.fr.days[isoDate(addDays(m, i))] ?? {};
    for (const k of Object.keys(day) as Skill[]) out[k] += day[k] ?? 0;
  }
  return out;
}
const weekFrHours = (s: Save, wk: string) => (s.log.find((r) => r.iso === wk)?.fr ?? 0) + total(Object.values(weekMinutes(s, wk))) / 60;

/** Planned minutes per skill in one week of the schedule. */
export const PLAN_MIN: Record<Skill, number> = (() => {
  const o: Record<Skill, number> = { co: 0, ce: 0, ee: 0, eo: 0, gv: 0 };
  for (const d of WEEK) for (const b of d.s) if (b.k === 'fr' && b.sk) o[b.sk] += (b.min ?? 0) * d.wd.length;
  return o;
})();

/** Average of the last four logged weeks; the plan value until there is data. */
export function avgTeer(s: Save) {
  const rows = s.log.filter((r) => r.teer > 0).slice(-4);
  return rows.length ? total(rows.map((r) => r.teer)) / rows.length : s.set.teerPlan;
}
export function avgFr(s: Save) {
  const cur = mondayOf(new Date());
  const vals: number[] = [];
  for (let i = 1; i <= 8 && vals.length < 4; i++) {
    const h = weekFrHours(s, isoDate(addDays(cur, -7 * i)));
    if (h > 0) vals.push(h);
  }
  return vals.length ? total(vals) / vals.length : s.set.frPlan;
}
/** IRCC counts at most 30 hours a week toward CEC. */
export function cecDate(s: Save) {
  const left = CEC_H - Math.min(sumTeer(s), CEC_H);
  const per = Math.min(Math.max(avgTeer(s), 1), 30);
  return new Date(Math.max(Date.now(), START.getTime()) + (left / per) * 7 * DAY);
}
export function frDate(s: Save) {
  const left = Math.max(s.set.frNeed - frHours(s), 0);
  return new Date(Date.now() + (left / Math.max(avgFr(s), 0.5)) * 7 * DAY);
}

/** XP comes only from completions confirmed with proof. */
export const xpOf = (s: Save) => total(s.hist.map((e) => e.xp || 0));

export function streak(s: Save) {
  let d = new Date();
  if (!dayMin(s, isoDate(d))) d = addDays(d, -1);
  let n = 0;
  while (dayMin(s, isoDate(d)) > 0) { n++; d = addDays(d, -1); }
  return n;
}
export function bestStreak(s: Save) {
  let best = 0, run = 0, prev = '';
  for (const d of Object.keys(s.fr.days).filter((k) => dayMin(s, k) > 0).sort()) {
    run = prev && isoDate(addDays(parseISO(prev), 1)) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

/** Spaced review: 1 star → after 2 days, 2 stars → 7, 3 stars → 21. */
const REVIEW = [0, 2, 7, 21];
export function dueGrammar(s: Save) {
  const t = isoDate(new Date());
  return GRAMMAR.filter((g) => {
    const st = s.fr.g[g.id];
    if (!st || !st.s) return false;
    if (!st.last) return true;
    return isoDate(addDays(parseISO(st.last), REVIEW[st.s])) <= t;
  });
}
export function errCount(s: Save) {
  const c: Record<string, number> = {};
  for (const e of s.fr.err) c[e.ref] = (c[e.ref] ?? 0) + 1;
  return c;
}
export const weakPoints = (s: Save, n = 5) => Object.entries(errCount(s)).sort((a, b) => b[1] - a[1]).slice(0, n);

export function mockMin(m: Mock) {
  const lv = (['co', 'ce', 'ee', 'eo'] as const).map((k) => nclcOf(k, m[k]));
  return lv.some((v) => v == null) ? null : Math.min(...(lv as number[]));
}
/** Latest score for one test across all mocks (mocks are kept in date order). */
export function lastScore(s: Save, k: TestId) {
  for (let i = s.fr.mocks.length - 1; i >= 0; i--) {
    const v = s.fr.mocks[i][k];
    if (v != null) return v;
  }
  return null;
}

export function achievements(s: Save) {
  const h = frHours(s), t = sumTeer(s), best = bestStreak(s);
  const mature = Object.values(s.pc.cards).filter((c) => c.st === 'review' && c.ivl >= 21).length;
  const b1 = GRAMMAR.filter((g) => g.lv === 'B1').every((g) => (s.fr.g[g.id]?.s ?? 0) >= 2);
  const f = Math.floor;
  return [
    { n: 'Bonjour !', d: 'Ghi phút tiếng Pháp đầu tiên', on: h > 0 },
    { n: '50 giờ tiếng Pháp', d: `${f(Math.min(h, 50))}/50 giờ`, on: h >= 50 },
    { n: '200 giờ tiếng Pháp', d: `${f(Math.min(h, 200))}/200 giờ`, on: h >= 200 },
    { n: 'Chuỗi 7 ngày', d: `Kỷ lục: ${best} ngày`, on: best >= 7 },
    { n: 'Chuỗi 30 ngày', d: `Kỷ lục: ${best} ngày`, on: best >= 30 },
    { n: 'Thợ săn lỗi', d: `${Math.min(s.fr.err.length, 20)}/20 lỗi đã ghi`, on: s.fr.err.length >= 20 },
    { n: 'Ngữ pháp B1 vững', d: 'Mọi chủ điểm B1 từ 2 sao', on: b1 },
    { n: 'Đề thi thử đầu tiên', d: 'Ghi điểm 1 đề thử', on: s.fr.mocks.length > 0 },
    { n: 'NCLC 7 trong đề thử', d: 'Cả 4 phần trong cùng 1 đề', on: s.fr.mocks.some((m) => (mockMin(m) ?? 0) >= 7) },
    { n: 'Tuần hoàn hảo', d: '5/5 thử thách trong 1 tuần', on: Object.values(s.fr.ch).some((l) => l.length >= 5) },
    { n: 'Thuộc 50 cụm từ', d: `${Math.min(mature, 50)}/50 cụm, ôn cách nhau từ 21 ngày`, on: mature >= 50 },
    { n: '100 giờ lò bánh', d: `${f(Math.min(t, 100))}/100 giờ`, on: t >= 100 },
    { n: 'Nửa đường CEC', d: `${f(Math.min(t, 780))}/780 giờ`, on: t >= 780 },
  ];
}
