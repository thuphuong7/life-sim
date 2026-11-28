import { useEffect, useRef, useState } from 'react';
import type { Entry, Pending, Save } from './types';
import { Avatar, Hud } from './components/Hud';
import { Icon } from './components/ui';
import { Submit } from './components/Submit';
import { useStore } from './lib/store';
import { xpOf } from './lib/calc';
import { applyEntry, revertEntry } from './lib/actions';
import { Today } from './views/Today';
import { PhrasePop } from './views/Phrase';
import { MapView } from './views/MapView';
import { French } from './views/French';
import { History, Quests } from './views/Quests';
import { More } from './views/More';

const NAV = [['today', 'Hôm nay'], ['map', 'Bản đồ'], ['french', 'Tiếng Pháp'], ['quests', 'Nhiệm vụ'], ['more', 'Thêm']] as const;
type Main = (typeof NAV)[number][0];

/** Routes are plain #names: #today, #map, #french, #french-grammar…, #quests, #history, #more, and #phrase for the phrase card
 *  (#focus and #checkin, the old phone links, open the phrase card too). */
function parse(hash: string) {
  const h = hash.replace(/^#/, '');
  const main: Main = h.startsWith('french') ? 'french' : h === 'history' ? 'quests' : NAV.some(([k]) => k === h) ? (h as Main) : 'today';
  const pop = h === 'phrase' || h === 'focus' || h === 'checkin';
  return { main, sub: h.startsWith('french-') ? h.slice(7) : h === 'history' ? 'history' : '', pop };
}

/** The phone opens #phrase on every unlock. Within 5 minutes of the last card it opened, the card stays closed. */
const POP_KEY = 'phuong-lifesim-pop';
const POP_GAP = 5 * 60_000;
function autoPopOk(now = Date.now()) {
  try {
    const last = Number(localStorage.getItem(POP_KEY)) || 0;
    if (now >= last && now - last < POP_GAP) return false;
    localStorage.setItem(POP_KEY, String(now));
  } catch { /* no storage here: always show */ }
  return true;
}

export default function App() {
  const store = useStore();
  const { s } = store;
  const [route, setRoute] = useState(() => parse(location.hash));
  const [pop, setPop] = useState(() => route.pop && autoPopOk());
  const [pending, setPending] = useState<Pending | null>(null);

  /** Leaves a #phrase address for #today, without adding a history entry. */
  const toToday = () => {
    if (/^#(phrase|focus|checkin)$/.test(location.hash)) {
      try { history.replaceState(null, '', '#today'); } catch { /* some frames refuse; the view still changes */ }
      setRoute(parse('#today'));
    }
  };
  useEffect(() => { if (route.pop && !pop) toToday(); }, []); // opened again within 5 minutes

  useEffect(() => {
    const on = () => {
      const r = parse(location.hash);
      setRoute(r);
      if (r.pop) {
        if (autoPopOk()) setPop(true);
        else toToday();
      }
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = (h: string) => {
    if (location.hash === `#${h}`) setRoute(parse(`#${h}`));
    else location.hash = h;
    window.scrollTo({ top: 0 });
  };
  const closePop = () => {
    setPop(false);
    toToday();
  };

  // "+N XP" appears only right after the player confirms a submission.
  const xp = xpOf(s);
  const prev = useRef(xp);
  const confirmed = useRef(false);
  const [toast, setToast] = useState<{ n: number; k: number } | null>(null);
  useEffect(() => {
    const d = xp - prev.current;
    prev.current = xp;
    if (confirmed.current && d > 0) setToast({ n: d, k: Date.now() });
    confirmed.current = false;
  }, [s]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const update = store.update;
  const ask = (p: Pending) => setPending(p);
  const confirm = (e: Entry) => { confirmed.current = true; update((x: Save) => applyEntry(x, e)); setPending(null); };
  const revert = (id: string) => update((x: Save) => revertEntry(x, id));

  if (!store.ready) {
    return <div className="loading" role="status"><Avatar />Đang tải tiến độ…</div>;
  }

  return (
    <>
      <Hud s={s} xp={xp} />
      <nav className="nav" aria-label="Các màn hình">
        {NAV.map(([k, n]) => (
          <a key={k} href={`#${k}`} aria-current={route.main === k ? 'page' : undefined} onClick={() => window.scrollTo({ top: 0 })}>
            <Icon n={k} /><span>{n}</span>
          </a>
        ))}
      </nav>
      <main>
        {route.main === 'today' && <Today s={s} ask={ask} revert={revert} go={go} onPhrase={() => setPop(true)} />}
        {route.main === 'map' && <MapView s={s} />}
        {route.main === 'french' && <French s={s} update={update} sub={route.sub} go={go} ask={ask} revert={revert} onPhrase={() => setPop(true)} />}
        {route.main === 'quests' && (route.sub === 'history'
          ? <History s={s} revert={revert} go={go} />
          : <Quests s={s} update={update} ask={ask} revert={revert} go={go} />)}
        {route.main === 'more' && <More s={s} update={update} replace={store.replace} sync={store.sync} />}
      </main>
      {pop && <PhrasePop s={s} update={update} close={closePop} />}
      {pending && <Submit p={pending} onCancel={() => setPending(null)} onConfirm={confirm} />}
      {toast && <div className="toast" key={toast.k} role="status">+{toast.n} XP</div>}
    </>
  );
}
