export type ThemePref = 'light' | 'dark';

const KEY = 'phuong-lifesim-theme';
export const THEME_TXT: Record<ThemePref, string> = { light: 'Sáng', dark: 'Tối' };
export const nextTheme = (t: ThemePref): ThemePref => (t === 'light' ? 'dark' : 'light');

/** Light unless the player picked dark (an old "auto" choice becomes light). A per-device convenience, so it lives in localStorage. */
export function loadTheme(): ThemePref {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

let pref: ThemePref = 'light';

/** The stylesheet holds plain colours for each data-app-theme value, so no browser feature can override the choice. */
function paint() {
  const root = document.documentElement;
  if (root.getAttribute('data-app-theme') !== pref) root.setAttribute('data-app-theme', pref);
}

export function applyTheme(t: ThemePref) {
  pref = t;
  paint();
  try { localStorage.setItem(KEY, t); } catch { /* storage can be missing in some frames */ }
}

/** Call once before the first render. */
export function initTheme() {
  pref = loadTheme();
  paint();
}
