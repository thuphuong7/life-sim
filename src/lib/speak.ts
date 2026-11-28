import { useEffect, useState } from 'react';

/**
 * Reads French aloud with the phone's own voices (Web Speech API).
 * Phones only allow it after a tap, so every call comes from a button.
 * The accent is a setting of this device, like the theme, because each device has its own voices.
 */
export type Accent = 'fr-FR' | 'fr-CA';
export const ACCENT_TXT: Record<Accent, string> = { 'fr-FR': 'Pháp (giống đề TCF)', 'fr-CA': 'Canada (Québec)' };
const KEY = 'phuong-lifesim-voice';

export function loadAccent(): Accent {
  try { return localStorage.getItem(KEY) === 'fr-CA' ? 'fr-CA' : 'fr-FR'; } catch { return 'fr-FR'; }
}
export function saveAccent(a: Accent) {
  try { localStorage.setItem(KEY, a); } catch { /* storage refused: the choice lasts until the page closes */ }
}

export const canSpeak = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

const lc = (l: string) => l.replace('_', '-').toLowerCase();
export const frenchVoices = () => (canSpeak() ? window.speechSynthesis.getVoices().filter((v) => lc(v.lang).startsWith('fr')) : []);

function voiceFor(a: Accent) {
  const all = frenchVoices();
  const same = all.filter((v) => lc(v.lang) === a.toLowerCase());
  return same.find((v) => /google|natural|premium|enhanced/i.test(v.name)) ?? same[0] ?? all[0];
}

export function speak(text: string, slow = false): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  const a = loadAccent();
  const u = new SpeechSynthesisUtterance(text.replace(/ /g, ' ').replace(/—/g, ','));
  u.lang = a;
  const v = voiceFor(a);
  if (v) u.voice = v;
  u.rate = slow ? 0.7 : 0.95;
  // Cancelling an idle queue right before speaking drops the new utterance on some Android builds.
  if (synth.speaking || synth.pending) synth.cancel();
  synth.speak(u);
  return true;
}

/** true / false once the device has listed its voices; null while it has not. */
export function useFrenchVoice(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(() => {
    if (!canSpeak()) return false;
    return window.speechSynthesis.getVoices().length ? frenchVoices().length > 0 : null;
  });
  useEffect(() => {
    if (!canSpeak()) return;
    const synth = window.speechSynthesis;
    const on = () => { if (synth.getVoices().length) setOk(frenchVoices().length > 0); };
    synth.addEventListener?.('voiceschanged', on);
    const t = window.setTimeout(on, 1500);
    return () => { synth.removeEventListener?.('voiceschanged', on); window.clearTimeout(t); };
  }, []);
  return ok;
}
