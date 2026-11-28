import { useEffect, useRef, useState } from 'react';
import type { Save, Update } from '../types';
import { marks, type Phrase } from '../data/phrases';
import { GRADE_TXT, pickCard, preview, record, stats, whenTxt, type Grade, type Pick } from '../lib/srs';
import { canSpeak, speak, useFrenchVoice } from '../lib/speak';
import { Icon } from '../components/ui';

/** Two buttons: say it at normal speed, and slowly. */
function Say({ text, what }: { text: string; what: string }) {
  if (!canSpeak()) return null;
  return (
    <div className="acts">
      <button type="button" className="btn ghost sm" onClick={() => speak(text)}><Icon n="sound" />{what === 'cụm' ? 'Nghe' : 'Nghe câu'}</button>
      <button type="button" className="btn ghost sm" aria-label={`Nghe chậm ${what}`} onClick={() => speak(text, true)}>Chậm</button>
    </div>
  );
}

function Example({ p }: { p: Phrase }) {
  return (
    <div className="panel">
      <p className="ex" lang="fr">{marks(p.ex, p.hl).map((m, i) => (m.b ? <b key={i}>{m.t}</b> : <span key={i}>{m.t}</span>))}</p>
      <Say text={p.ex} what="câu" />
    </div>
  );
}

/**
 * The phrase card, opened by the phone on unlock (#phrase) or from the app.
 * One card per opening: a due card first, then one of today's new phrases, otherwise extra practice.
 * Nothing here adds XP; the schedule is the reward.
 */
export function PhrasePop({ s, update, close }: { s: Save; update: Update; close: () => void }) {
  const limit = s.set.pNew;
  const [pick, setPick] = useState<Pick | null>(() => pickCard(s.pc, limit, Date.now()));
  const [shown, setShown] = useState(false);
  const [saved, setSaved] = useState<{ when: string; id: string } | null>(null);
  const voice = useFrenchVoice();
  const first = useRef<HTMLButtonElement>(null);

  const rate = (g: Grade) => {
    if (!pick) return;
    const now = Date.now();
    const after = pick.kind === 'extra' && pick.c?.st === 'review' && g > 0 ? null : preview(pick.c, now)[g];
    update((x) => record(x.pc, pick, g, now));
    setSaved({ when: after ? whenTxt(after, now) : 'lịch cũ', id: pick.p.id });
  };
  const next = () => {
    setPick(pickCard(s.pc, limit, Date.now(), saved?.id));
    setShown(false);
    setSaved(null);
  };

  // Keyboard: Escape closes; on the answer side 1–4 rate like Anki.
  const keys = useRef<(e: KeyboardEvent) => void>(() => {});
  keys.current = (e) => {
    if (e.key === 'Escape') close();
    else if (pick && !saved && (shown || pick.kind === 'new') && /^[1-4]$/.test(e.key) && !e.repeat) {
      const g = (Number(e.key) - 1) as Grade;
      if (pick.kind !== 'new' || g >= 2) rate(g);
    }
  };
  useEffect(() => {
    const on = (e: KeyboardEvent) => keys.current(e);
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);
  useEffect(() => { first.current?.focus(); }, [pick, shown, saved]);

  const now = Date.now();
  const st = stats(s.pc, limit, now);
  const p = pick?.p;
  const kicker = !pick ? '' : pick.kind === 'new'
    ? `Cụm mới ${st.newToday + 1}/${limit} hôm nay · ${pick.p.lv} · ${pick.p.tag}`
    : pick.kind === 'extra'
      ? `Ôn thêm, không bắt buộc · ${pick.p.lv} · ${pick.p.tag}`
      : `${pick.c?.st === 'review' ? 'Đến hạn ôn' : 'Đang học'} · ${pick.p.lv} · ${pick.p.tag}`;
  const opts = pick && pick.kind !== 'new' ? preview(pick.c, now) : [];
  const keeps = pick?.kind === 'extra' && pick.c?.st === 'review';

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pc-h" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="sheet pc">
        {!p && (
          <>
            <h2 id="pc-h">Chưa có cụm nào để ôn</h2>
            <p className="lead">Hôm nay đã đủ {limit} cụm mới. Thẻ sẽ quay lại khi đến hạn.</p>
            <div className="acts"><button ref={first} type="button" className="btn" onClick={close}>Đóng</button></div>
          </>
        )}
        {p && saved && (
          <>
            <p className="small">{p.lv} · {p.tag}</p>
            <h2 id="pc-h" lang="fr">{p.fr}</h2>
            <p className="lead">Đã lưu. {saved.when === 'lịch cũ' ? 'Cụm này giữ nguyên lịch ôn.' : `Cụm này quay lại sau ${saved.when}.`}</p>
            <p className="small">Hôm nay: mới {st.newToday}/{limit} · {st.due} thẻ đến hạn ôn · đã học {st.seen}/{st.total} cụm.</p>
            <div className="acts">
              <button ref={first} type="button" className="btn" onClick={next}>Thẻ tiếp theo</button>
              <button type="button" className="btn ghost" onClick={close}>Đóng</button>
            </div>
          </>
        )}
        {p && !saved && (
          <>
            <p className="small">{kicker}</p>
            <h2 id="pc-h" lang="fr">{p.fr}</h2>
            <Say text={p.fr} what="cụm" />
            {voice === false && canSpeak() && (
              <p className="meta">Máy chưa có giọng tiếng Pháp. Cài trong Cài đặt → Quản lý chung → Chuyển văn bản thành giọng nói (Text-to-speech), xem hướng dẫn ở mục Thêm → Điện thoại.</p>
            )}
            {pick.kind === 'new' || shown ? (
              <>
                <p className="mean">{p.vi}</p>
                <p className="meta"><b>Dùng khi:</b> {p.ctx}</p>
                <Example p={p} />
                <p className="meta">{p.exVi}</p>
              </>
            ) : (
              <>
                <Example p={p} />
                <p className="meta">Cụm này nghĩa là gì, dùng khi nào? Nghĩ ra câu trả lời, nói to câu ví dụ, rồi xem đáp án.</p>
              </>
            )}
            {pick.kind === 'new' ? (
              <div className="rate two" role="group" aria-label="Bạn biết cụm này chưa?">
                <button type="button" className="btn ghost" onClick={() => rate(3)}>Biết rồi<small>ôn lại sau 4 ngày</small></button>
                <button ref={first} type="button" className="btn" onClick={() => rate(2)}>Đã hiểu<small>kiểm tra sau 10 phút</small></button>
              </div>
            ) : shown ? (
              <div className="rate" role="group" aria-label="Bạn nhớ cụm này thế nào?">
                {([0, 1, 2, 3] as Grade[]).map((g) => (
                  <button key={g} ref={g === 2 ? first : undefined} type="button" className={g === 2 ? 'btn' : g === 0 ? 'btn ghost danger' : 'btn ghost'} onClick={() => rate(g)}>
                    {GRADE_TXT[g]}<small>{keeps && g > 0 ? 'giữ lịch' : whenTxt(opts[g], now)}</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="acts"><button ref={first} type="button" className="btn" onClick={() => setShown(true)}>Xem đáp án</button></div>
            )}
            <div className="acts"><button type="button" className="btn ghost sm" onClick={close}>Để sau</button></div>
          </>
        )}
      </div>
    </div>
  );
}
