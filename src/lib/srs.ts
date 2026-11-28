/**
 * Spaced repetition for the phrase cards, after Anki's SM-2 scheduler:
 * learning steps 10 min and 1 h, graduating interval 1 day (4 days on "Dễ"),
 * ease 2.5 that drops on "Khó"/"Quên" and rises on "Dễ", relearning step 10 min after a lapse.
 * New cards are limited per day; everything else comes back when it is due.
 */
import type { PCard, PhraseState } from '../types';
import { PHRASES, type Phrase } from '../data/phrases';
import { isoDate } from './dates';

export type Grade = 0 | 1 | 2 | 3; // Quên, Khó, Nhớ, Dễ
export const GRADE_TXT = ['Quên', 'Khó', 'Nhớ', 'Dễ'] as const;

const MIN = 60_000;
export const LEARN_STEPS = [10 * MIN, 60 * MIN];
export const RELEARN_STEPS = [10 * MIN];
const GRAD_IVL = 1;
const EASY_IVL = 4;
const START_EASE = 2.5;
const MIN_EASE = 1.3;
const HARD_FACTOR = 1.2;
const EASY_BONUS = 1.3;
const MAX_IVL = 365;
export const MATURE = 21;
export const NEW_PER_DAY = 30;

export const emptyPhrases = (): PhraseState => ({ cards: {}, days: {} });

/** Local midnight of the day `days` after the day of `t`. */
const dayStart = (t: number, days = 0) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days).getTime();
};
const daysLate = (c: PCard, now: number) => Math.max(0, Math.floor((dayStart(now) - dayStart(c.due)) / 86_400_000));
const clampIvl = (n: number) => Math.min(MAX_IVL, Math.max(1, Math.round(n)));

/** What each button would do to the card, without changing it. */
export function preview(c: PCard | undefined, now: number): PCard[] {
  return ([0, 1, 2, 3] as Grade[]).map((g) => answer(c, g, now));
}

/**
 * The card after an answer. A missing card is a new phrase seen for the first time:
 * "Nhớ" puts it on the first learning step, "Dễ" graduates it at once.
 */
export function answer(c: PCard | undefined, g: Grade, now: number): PCard {
  if (!c) {
    const base: PCard = { st: 'learn', due: now, ivl: 0, ease: START_EASE, step: 0, reps: 0, lapses: 0, first: isoDate(new Date(now)), last: now };
    if (g === 3) return { ...base, st: 'review', ivl: EASY_IVL, due: dayStart(now, EASY_IVL), reps: 1 };
    return { ...base, due: now + LEARN_STEPS[0], reps: 1 };
  }
  const n: PCard = { ...c, reps: c.reps + 1, last: now };
  if (c.st === 'learn' || c.st === 'relearn') {
    const steps = c.st === 'learn' ? LEARN_STEPS : RELEARN_STEPS;
    const graduate = (ivl: number): PCard => ({ ...n, st: 'review', step: 0, ivl, due: dayStart(now, ivl) });
    if (g === 0) return { ...n, step: 0, due: now + steps[0] };
    if (g === 1) {
      const wait = c.step === 0 && steps.length > 1 ? (steps[0] + steps[1]) / 2 : steps[c.step] ?? steps[0];
      return { ...n, due: now + wait };
    }
    if (g === 2) {
      const next = c.step + 1;
      if (next < steps.length) return { ...n, step: next, due: now + steps[next] };
      return graduate(c.st === 'learn' ? GRAD_IVL : Math.max(1, c.ivl));
    }
    return graduate(c.st === 'learn' ? EASY_IVL : Math.max(2, c.ivl + 1));
  }
  // review
  if (g === 0) {
    return { ...n, st: 'relearn', step: 0, lapses: c.lapses + 1, ease: Math.max(MIN_EASE, c.ease - 0.2), ivl: 1, due: now + RELEARN_STEPS[0] };
  }
  const late = daysLate(c, now);
  const hard = clampIvl(Math.max(c.ivl + 1, (c.ivl + late / 4) * HARD_FACTOR));
  if (g === 1) return { ...n, ease: Math.max(MIN_EASE, c.ease - 0.15), ivl: hard, due: dayStart(now, hard) };
  const good = clampIvl(Math.max(hard + 1, (c.ivl + late / 2) * c.ease));
  if (g === 2) return { ...n, ivl: good, due: dayStart(now, good) };
  const easy = clampIvl(Math.max(good + 1, (c.ivl + late) * c.ease * EASY_BONUS));
  return { ...n, ease: c.ease + 0.15, ivl: easy, due: dayStart(now, easy) };
}

/** Short label for when the card comes back: "10 phút", "1 giờ", "3 ngày", "2 tháng". */
export function whenTxt(c: PCard, now: number): string {
  const ms = c.due - now;
  if (c.st !== 'review') {
    const m = Math.max(1, Math.round(ms / MIN));
    return m < 60 ? `${m} phút` : `${Math.round(m / 60)} giờ`;
  }
  if (c.ivl < 30) return `${c.ivl} ngày`;
  if (c.ivl < 365) return `${Math.round(c.ivl / 30)} tháng`;
  return `${Math.round(c.ivl / 365)} năm`;
}

export type Pick = { p: Phrase; kind: 'new' | 'due' | 'extra'; c?: PCard };

const today = (now: number) => isoDate(new Date(now));
export const newToday = (ps: PhraseState, now: number) => ps.days[today(now)]?.n ?? 0;

/**
 * The card to show now, in Anki's order: learning cards that are due, then reviews due today,
 * then a new phrase while today's limit lasts, and when nothing is due, any phrase already learned (extra practice).
 * `skip` keeps the card just answered from coming straight back as extra practice.
 */
export function pickCard(ps: PhraseState, limit: number, now: number, skip = ''): Pick | null {
  const end = dayStart(now, 1);
  const seen = PHRASES.filter((p) => ps.cards[p.id]);
  const by = (a: Phrase, b: Phrase) => ps.cards[a.id].due - ps.cards[b.id].due;
  const learning = seen.filter((p) => ps.cards[p.id].st !== 'review' && ps.cards[p.id].due <= now).sort(by);
  if (learning.length) return { p: learning[0], kind: 'due', c: ps.cards[learning[0].id] };
  const reviews = seen.filter((p) => ps.cards[p.id].st === 'review' && ps.cards[p.id].due < end).sort(by);
  if (reviews.length) return { p: reviews[0], kind: 'due', c: ps.cards[reviews[0].id] };
  if (newToday(ps, now) < limit) {
    const fresh = PHRASES.find((p) => !ps.cards[p.id]);
    if (fresh) return { p: fresh, kind: 'new' };
  }
  const pool = seen.filter((p) => p.id !== skip);
  if (!pool.length) return seen.length ? { p: seen[0], kind: 'extra', c: ps.cards[seen[0].id] } : null;
  // Learning cards first (they come back soonest), then a random learned phrase, weighted to the weaker ones.
  const soon = pool.filter((p) => ps.cards[p.id].st !== 'review').sort(by);
  if (soon.length) return { p: soon[0], kind: 'extra', c: ps.cards[soon[0].id] };
  const weight = (p: Phrase) => { const c = ps.cards[p.id]; return 1 + c.lapses * 2 + (c.ivl < MATURE ? 2 : 0); };
  let r = Math.random() * pool.reduce((a, p) => a + weight(p), 0);
  for (const p of pool) { r -= weight(p); if (r <= 0) return { p, kind: 'extra', c: ps.cards[p.id] }; }
  const last = pool[pool.length - 1];
  return { p: last, kind: 'extra', c: ps.cards[last.id] };
}

/**
 * Records an answer. Extra practice on a review card only counts when the phrase was forgotten
 * (it goes back to relearning); otherwise the schedule stays as it was, so practising early never pushes a card far out.
 */
export function record(ps: PhraseState, pick: Pick, g: Grade, now: number) {
  const d = today(now);
  const day = ps.days[d] ?? (ps.days[d] = { n: 0, r: 0 });
  const c = ps.cards[pick.p.id];
  if (pick.kind === 'extra' && c && c.st === 'review' && g > 0) {
    ps.cards[pick.p.id] = { ...c, last: now };
  } else {
    ps.cards[pick.p.id] = answer(c, g, now);
  }
  if (pick.kind === 'new') day.n += 1;
  else day.r += 1;
  const keys = Object.keys(ps.days).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - 120))) delete ps.days[k];
}

export function stats(ps: PhraseState, limit: number, now: number) {
  const end = dayStart(now, 1);
  const cards = Object.values(ps.cards);
  return {
    seen: cards.length,
    total: PHRASES.length,
    mature: cards.filter((c) => c.st === 'review' && c.ivl >= MATURE).length,
    learning: cards.filter((c) => c.st !== 'review').length,
    due: cards.filter((c) => (c.st === 'review' ? c.due < end : c.due <= now)).length,
    newToday: Math.min(limit, newToday(ps, now)),
    limit,
    left: PHRASES.length - cards.length,
  };
}

/** Status of one phrase for the list. */
export function statusOf(c: PCard | undefined, now: number): 'new' | 'due' | 'learning' | 'mature' | 'young' {
  if (!c) return 'new';
  if (c.st === 'review' ? c.due < dayStart(now, 1) : c.due <= now) return 'due';
  if (c.st !== 'review') return 'learning';
  return c.ivl >= MATURE ? 'mature' : 'young';
}

export const nextDue = (c: PCard) => isoDate(new Date(c.due));
