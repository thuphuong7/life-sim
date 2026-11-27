export type ThemePref = 'light' | 'dark' | 'auto';

const KEY = 'phuong-lifesim-theme';
export const THEME_TXT: Record<ThemePref, string> = { light: 'Sáng', dark: 'Tối', auto: 'Theo máy' };
export const nextTheme = (t: ThemePref): ThemePref => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light');

/** Light unless the player picked otherwise. A per-device convenience, so it lives in localStorage. */
export function loadTheme(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'dark' || v === 'auto' ? v : 'light';
  } catch {
    return 'light';
  }
}

let pref: ThemePref = 'light';

/** 'auto' follows claude.ai's data-theme when the page runs there, otherwise the device setting. */
function resolve(): 'light' | 'dark' {
  if (pref !== 'auto') return pref;
  const v = document.documentElement.getAttribute('data-theme');
  if (v === 'light' || v === 'dark') return v;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** The stylesheet holds plain colours for each data-app-theme value, so no browser feature can override the choice. */
function paint() {
  const eff = resolve();
  const root = document.documentElement;
  if (root.getAttribute('data-app-theme') !== eff) root.setAttribute('data-app-theme', eff);
}

export function applyTheme(t: ThemePref) {
  pref = t;
  paint();
  try { localStorage.setItem(KEY, t); } catch { /* storage can be missing in some frames */ }
}

/** Call once before the first render. Repaints when the device or the claude.ai viewer changes theme. */
export function initTheme() {
  pref = loadTheme();
  paint();
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', paint);
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
