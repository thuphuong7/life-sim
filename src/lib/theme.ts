export type ThemePref = 'auto' | 'light' | 'dark';

const KEY = 'phuong-lifesim-theme';
export const THEME_TXT: Record<ThemePref, string> = { auto: 'Tự động', light: 'Sáng', dark: 'Tối' };
export const nextTheme = (t: ThemePref): ThemePref => (t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto');

/** The choice is a per-device convenience, so it lives in localStorage, not in the synced save. */
export function loadTheme(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

/**
 * 'auto' follows the device (or the claude.ai viewer's data-theme).
 * 'light' / 'dark' set data-app-theme, which the stylesheet ranks above data-theme.
 */
export function applyTheme(t: ThemePref) {
  const root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-app-theme');
  else root.setAttribute('data-app-theme', t);
  try {
    if (t === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, t);
  } catch {
    /* storage can be missing in some frames; the choice still applies until reload */
  }
}
