import type { Entry, Kind, Save, Skill } from '../types';
import { WEEK } from '../data/plan';

/** Keeps only the newest `keep` date keys of a date-keyed record. */
const trim = (o: Record<string, unknown>, keep: number) => {
  const ks = Object.keys(o).sort();
  while (ks.length > keep) delete o[ks.shift()!];
};

export const dayPlan = (d = new Date()) => WEEK.find((w) => w.wd.includes(d.getDay())) ?? WEEK[0];

export function addMinutes(x: Save, d: string, sk: Skill, min: number) {
  const day = x.fr.days[d] ?? (x.fr.days[d] = {});
  day[sk] = Math.max(0, (day[sk] ?? 0) + min);
}

/** Newest confirmed entry for a quest, challenge (scope = week) or schedule slot (scope = day). */
export const latestFor = (s: Save, kind: Kind, ref: string, scope?: string) =>
  s.hist.find((e) => e.kind === kind && e.ref === ref && (scope == null || (kind === 'ch' ? e.wk === scope : e.d === scope))) ?? null;

/** Records a confirmed completion and applies its effect. The only place XP is earned. */
export function applyEntry(x: Save, e: Entry) {
  if (e.kind === 'quest') x.done[e.ref] = true;
  if (e.kind === 'ch' && e.wk) {
    const list = x.fr.ch[e.wk] ?? (x.fr.ch[e.wk] = []);
    if (!list.includes(e.ref)) list.push(e.ref);
  }
  if (e.kind === 'blk') {
    const list = x.fr.blk[e.d] ?? (x.fr.blk[e.d] = []);
    if (!list.includes(e.ref)) list.push(e.ref);
    trim(x.fr.blk, 45);
  }
  if ((e.kind === 'blk' || e.kind === 'min') && e.sk) addMinutes(x, e.d, e.sk, e.min ?? 0);
  x.hist.unshift(e);
  if (x.hist.length > 1000) x.hist.length = 1000;
}

/** Undoes one entry: the item goes back to not done and its XP and minutes are removed. */
export function revertEntry(x: Save, id: string) {
  const e = x.hist.find((h) => h.id === id);
  if (!e) return;
  x.hist = x.hist.filter((h) => h.id !== id);
  if (e.kind === 'quest' && !x.hist.some((h) => h.kind === 'quest' && h.ref === e.ref)) delete x.done[e.ref];
  if (e.kind === 'ch' && e.wk && x.fr.ch[e.wk]) x.fr.ch[e.wk] = x.fr.ch[e.wk].filter((r) => r !== e.ref);
  if (e.kind === 'blk' && x.fr.blk[e.d]) x.fr.blk[e.d] = x.fr.blk[e.d].filter((r) => r !== e.ref);
  if ((e.kind === 'blk' || e.kind === 'min') && e.sk) addMinutes(x, e.d, e.sk, -(e.min ?? 0));
}

export function countFocus(x: Save, d: string) {
  x.ci[d] = (x.ci[d] ?? 0) + 1;
  trim(x.ci, 120);
}
