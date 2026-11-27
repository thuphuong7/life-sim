import type { Entry, Save, Skill } from '../types';
import { DEFAULT_SET, QUESTS, WEEK } from '../data/plan';
import { CHALLENGES } from '../data/french';
import { today } from './dates';

const KEY = 'phuong-lifesim-v1'; // same key as v1, so old local progress is picked up and migrated
const DOC = 'game/state';

export type SyncStatus = 'local' | 'connecting' | 'synced' | 'saving' | 'offline' | 'error';
export const SYNC_TXT: Record<SyncStatus, string> = {
  local: 'chỉ trên trình duyệt này. Dùng Sao lưu để chuyển sang máy khác.',
  connecting: 'đang kết nối tài khoản claude.ai…',
  synced: 'đã đồng bộ với tài khoản claude.ai, mở trên máy nào cũng thấy.',
  saving: 'đang lưu…',
  offline: 'đang offline; sẽ đồng bộ khi có mạng.',
  error: 'chưa đồng bộ được, tiến độ vẫn lưu trên trình duyệt này.',
};

export const blank = (): Save => ({
  v: 3,
  done: {},
  log: [],
  fr: { g: {}, v: {}, err: [], mocks: [], ch: {}, days: {}, blk: {}, imm: {}, base: '' },
  set: { ...DEFAULT_SET },
  ci: {},
  hist: [],
  updated: '',
});

const validEntry = (e: unknown): e is Entry => {
  const x = e as Entry;
  return !!x && typeof x.id === 'string' && typeof x.d === 'string' && ['quest', 'ch', 'blk', 'min'].includes(x.kind);
};

/** v1/v2 had one-tap checkmarks. They become history entries flagged as unproven, worth 0 XP, so they can be reviewed and undone. */
function legacyHist(s: Save, d0: string): Entry[] {
  const out: Entry[] = [];
  const mk = (e: Pick<Entry, 'd' | 'kind' | 'ref' | 'title'> & Partial<Entry>): Entry =>
    ({ id: `legacy-${out.length}`, at: `${d0}T00:00:00.000Z`, xp: 0, proof: '', link: '', legacy: true, ...e });
  for (const id of Object.keys(s.done)) out.push(mk({ d: d0, kind: 'quest', ref: id, title: QUESTS.find((q) => q.id === id)?.t ?? id }));
  for (const [wk, ids] of Object.entries(s.fr.ch)) for (const id of ids) out.push(mk({ d: wk, kind: 'ch', ref: id, wk, title: CHALLENGES.find((c) => c.id === id)?.t ?? id }));
  const left: Record<string, Partial<Record<Skill, number>>> = JSON.parse(JSON.stringify(s.fr.days));
  for (const [d, ids] of Object.entries(s.fr.blk)) {
    for (const id of ids) {
      const b = WEEK.flatMap((w) => w.s).find((x) => x.id === id);
      if (!b?.sk) continue;
      out.push(mk({ d, kind: 'blk', ref: id, title: b.n, sk: b.sk, min: b.min ?? 0 }));
      const day = left[d] ?? (left[d] = {});
      day[b.sk] = Math.max(0, (day[b.sk] ?? 0) - (b.min ?? 0));
    }
  }
  for (const [d, day] of Object.entries(left)) {
    for (const k of Object.keys(day) as Skill[]) {
      const m = day[k] ?? 0;
      if (m > 0) out.push(mk({ d, kind: 'min', ref: k, title: 'Giờ học tiếng Pháp ghi trước đây', sk: k, min: m }));
    }
  }
  return out.sort((a, b) => b.d.localeCompare(a.d));
}

/** Accepts a v1, v2 or v3 document (or anything else) and returns a complete v3 save. */
export function migrate(raw: unknown): Save {
  const b = blank();
  if (!raw || typeof raw !== 'object') return b;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const r = raw as any;
  const obj = (x: unknown): any => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);
  const fr = obj(r.fr);
  const num = (x: unknown, d: number) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
  const set = obj(r.set);
  const s: Save = {
    v: 3,
    done: Object.fromEntries(Object.entries(obj(r.done)).filter(([, v]) => !!v).map(([k]) => [k, true])),
    log: arr(r.log)
      .filter((x) => x && typeof x.iso === 'string')
      .map((x) => ({ iso: x.iso, label: String(x.label ?? x.iso), teer: Number(x.teer) || 0, fr: Number(x.fr) || 0 })),
    fr: {
      g: obj(fr.g), v: obj(fr.v), err: arr(fr.err), mocks: arr(fr.mocks), ch: obj(fr.ch),
      days: obj(fr.days), blk: obj(fr.blk), imm: obj(fr.imm), base: typeof fr.base === 'string' ? fr.base : '',
    },
    set: {
      teerPlan: num(set.teerPlan, b.set.teerPlan), frPlan: num(set.frPlan, b.set.frPlan), frNeed: num(set.frNeed, b.set.frNeed),
      saved: num(set.saved, 0), monthly: num(set.monthly, 0), rate: num(set.rate, 0),
    },
    ci: obj(r.ci),
    hist: [],
    updated: typeof r.updated === 'string' ? r.updated : '',
  };
  s.hist = r.v === 3 ? arr(r.hist).filter(validEntry) : legacyHist(s, s.updated.slice(0, 10) || today());
  return s;
}

export function loadLocal(): Save | null {
  try {
    const t = localStorage.getItem(KEY);
    return t ? migrate(JSON.parse(t)) : null;
  } catch {
    return null;
  }
}
export function saveLocal(s: Save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage can be missing in some frames; the remote copy still works */
  }
}

interface DocRef {
  set(data: unknown): Promise<unknown>;
  onSnapshot(next: (snap: { exists: boolean; data(): unknown; metadata?: { fromCache?: boolean } }) => void, err: (e: unknown) => void): unknown;
}
declare global {
  interface Window { claude?: { use(name: 'db'): Promise<{ doc(path: string): DocRef }> } }
}

export interface Remote { push(s: Save): void }

/**
 * Connects to the claude.ai artifact database when the page runs as an artifact.
 * Elsewhere (GitHub Pages, local dev) it reports 'local' and push() does nothing.
 * Writes are debounced and chained so they land in order.
 */
export function connectRemote(onData: (s: Save) => void, onStatus: (st: SyncStatus) => void): Remote {
  let ref: DocRef | null = null;
  let pending: Save | null = null;
  let timer = 0;
  let chain: Promise<unknown> = Promise.resolve();
  const flush = () => {
    if (!ref || !pending) return;
    const body = JSON.parse(JSON.stringify(pending));
    pending = null;
    const r = ref;
    onStatus('saving');
    chain = chain.then(() => r.set(body)).then(() => onStatus('synced'), () => onStatus('error'));
  };
  const start = (tries: number) => {
    const c = window.claude;
    if (!c?.use) {
      if (tries < 25) window.setTimeout(() => start(tries + 1), 120);
      else onStatus('local');
      return;
    }
    onStatus('connecting');
    const guard = window.setTimeout(() => onStatus('error'), 10000);
    c.use('db').then(
      (db) => {
        ref = db.doc(DOC);
        ref.onSnapshot(
          (snap) => {
            window.clearTimeout(guard);
            if (snap.exists) onData(migrate(snap.data()));
            onStatus(snap.metadata?.fromCache ? 'offline' : 'synced');
          },
          () => { window.clearTimeout(guard); onStatus('error'); },
        );
        if (pending) timer = window.setTimeout(flush, 700);
      },
      () => { window.clearTimeout(guard); onStatus('error'); },
    );
  };
  start(0);
  return {
    push(s) {
      pending = s;
      window.clearTimeout(timer);
      timer = window.setTimeout(flush, 700);
    },
  };
}
