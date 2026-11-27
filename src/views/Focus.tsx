import { useEffect, useRef, useState } from 'react';
import type { Ask, Go, Save, Update } from '../types';
import { countFocus, dayPlan, latestFor } from '../lib/actions';
import { isoDate } from '../lib/dates';
import { Ext } from '../components/ui';

/**
 * Landing screen for the phone automation.
 * #focus: the phone already asked "anything urgent?" and the answer was no.
 * #checkin: the page asks the question itself.
 * It only counts the choice; XP still needs a submission with proof.
 */
export function Focus({ s, update, ask, mode, close, go }: { s: Save; update: Update; ask: Ask; mode: 'ask' | 'focus'; close: () => void; go: Go }) {
  const [step, setStep] = useState<'ask' | 'urgent' | 'pick'>(mode === 'ask' ? 'ask' : 'pick');
  const counted = useRef(false);
  const d = isoDate(new Date());
  const count = () => {
    if (counted.current) return;
    counted.current = true;
    update((x) => countFocus(x, d));
  };
  useEffect(() => {
    if (mode === 'focus') count();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextFr = dayPlan()?.s.find((b) => b.k === 'fr' && b.id && !latestFor(s, 'blk', b.id, d));
  const leave = (h: string) => { close(); go(h); };

  return (
    <div className="focus" role="dialog" aria-modal="true" aria-labelledby="focus-t">
      <div className="focus-card">
        {step === 'ask' && (
          <>
            <h2 id="focus-t">Có việc gấp cần dùng điện thoại không?</h2>
            <div className="focus-acts">
              <button type="button" className="btn big ghost-l" onClick={() => setStep('urgent')}>Có, việc gấp</button>
              <button type="button" className="btn big" onClick={() => { count(); setStep('pick'); }}>Không gấp</button>
            </div>
          </>
        )}
        {step === 'urgent' && (
          <>
            <h2 id="focus-t">Vậy làm nhanh việc đó nhé.</h2>
            <p>Xong thì cất điện thoại, hoặc quay lại đây.</p>
            <div className="focus-acts"><button type="button" className="btn big" onClick={close}>Vào app</button></div>
          </>
        )}
        {step === 'pick' && (
          <>
            <h2 id="focus-t">Chọn không lướt</h2>
            <p>Hôm nay bạn đã chọn không lướt {s.ci[d] ?? 0} lần.</p>
            {nextFr ? (
              <div className="focus-next">
                <p className="small">Việc tiếng Pháp tiếp theo · {nextFr.min} phút</p>
                <p className="t">{nextFr.n}</p>
                <div className="focus-acts">
                  {nextFr.u && <Ext href={nextFr.u} className="btn big">Mở {nextFr.app}</Ext>}
                  <button type="button" className="btn big ghost-l" onClick={() => ask({ kind: 'blk', ref: nextFr.id!, title: nextFr.n, xp: 0, sk: nextFr.sk, min: nextFr.min, d })}>
                    Xong? Nộp bằng chứng
                  </button>
                </div>
              </div>
            ) : (
              <p>Phần tiếng Pháp trong lịch hôm nay đã nộp đủ.</p>
            )}
            <div className="focus-links">
              <button type="button" className="btn ghost-l" onClick={() => leave('today')}>Việc hôm nay</button>
              <button type="button" className="btn ghost-l" onClick={() => leave('french-errors')}>Ghi sổ lỗi</button>
              <button type="button" className="btn ghost-l" onClick={() => leave('quests')}>Ghi giờ làm</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
