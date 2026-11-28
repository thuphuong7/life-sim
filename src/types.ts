export type Skill = 'co' | 'ce' | 'ee' | 'eo' | 'gv';
export type TestId = 'co' | 'ce' | 'ee' | 'eo';
export type QTab = 'main' | 'side' | 'biz' | 'life';

export interface Quest { id: string; g: QTab; t: string; d: string; due: string; xp: number }
export interface LootItem {
  tier: 'S' | 'A' | 'B' | 'L'; n: string; c: string; f: string; fit: string;
  el: 'ok' | 'ask' | 'lock'; elt: string; u: string; h: string; free: boolean; on: boolean;
}
/** One slot of the weekly schedule. French slots (k = 'fr') carry a skill, minutes and an app link. */
export interface Block { t: string; n: string; k: 'work' | 'fr' | 'life' | 'rest'; id?: string; sk?: Skill; min?: number; u?: string; app?: string }
export interface Day { d: string; tag: string; wd: number[]; s: Block[] }
export interface WeekLog { iso: string; label: string; teer: number; fr: number }
export interface ErrEntry { id: string; d: string; k: 'g' | 'v' | 'p'; ref: string; wrong: string; right: string; note: string }
export interface Mock { id: string; d: string; co: number | null; ce: number | null; ee: number | null; eo: number | null; src: string }

/** quest = a quest, ch = a weekly challenge, blk = a French slot of the schedule, min = French study outside the schedule */
export type Kind = 'quest' | 'ch' | 'blk' | 'min';

/** One confirmed completion. XP is only ever earned through an entry, after the player submits proof. */
export interface Entry {
  id: string;
  /** day it was done (ISO date) */
  d: string;
  /** when it was submitted (ISO time) */
  at: string;
  kind: Kind;
  ref: string;
  title: string;
  xp: number;
  proof: string;
  link: string;
  sk?: Skill;
  min?: number;
  /** Monday of the week, for weekly challenges */
  wk?: string;
  /** Marked done before proof was required (migrated from v1/v2); earns no XP. */
  legacy?: boolean;
}
/** What the submit dialog is about to confirm. */
export interface Pending { kind: Kind; ref: string; title: string; xp: number; sk?: Skill; min?: number; wk?: string; d?: string }

export interface FrState {
  /** grammar point id → stars 0–3, last review date, review count */
  g: Record<string, { s: number; last: string; n: number }>;
  /** vocabulary theme id → stars and words learned */
  v: Record<string, { s: number; w: number }>;
  err: ErrEntry[];
  mocks: Mock[];
  /** Monday ISO date → challenge ids done that week */
  ch: Record<string, string[]>;
  /** ISO date → minutes per skill */
  days: Record<string, Partial<Record<Skill, number>>>;
  /** ISO date → schedule block ids done */
  blk: Record<string, string[]>;
  imm: Record<string, boolean>;
  base: string;
}
export interface Settings { teerPlan: number; frPlan: number; frNeed: number; saved: number; monthly: number; rate: number; pNew: number }

/** One phrase card's schedule (Anki-style). Times are epoch ms; a review card is due from local midnight of its day. */
export interface PCard {
  st: 'learn' | 'review' | 'relearn';
  due: number;
  /** interval in days (review cards) */
  ivl: number;
  ease: number;
  /** current learning or relearning step */
  step: number;
  reps: number;
  lapses: number;
  /** ISO date the phrase was first shown */
  first: string;
  last: number;
}
export interface PhraseState {
  /** phrase id → its card; a phrase with no card has not been shown yet */
  cards: Record<string, PCard>;
  /** ISO date → new phrases shown and reviews answered that day */
  days: Record<string, { n: number; r: number }>;
}

/** The whole saved game: one JSON document, schema v3. */
export interface Save {
  v: 3;
  done: Record<string, boolean>;
  log: WeekLog[];
  fr: FrState;
  set: Settings;
  /** ISO date → times the old focus screen was chosen over scrolling (kept from before the phrase cards) */
  ci: Record<string, number>;
  /** phrase cards shown when the phone is unlocked */
  pc: PhraseState;
  /** confirmed completions, newest first */
  hist: Entry[];
  updated: string;
}

export type Update = (fn: (draft: Save) => void) => void;
export type Go = (hash: string) => void;
export type Ask = (p: Pending) => void;
export type Revert = (id: string) => void;
