import { useState } from 'react';
import type { Ask, Go, Quest, Revert, Save, Skill } from '../types';
import { QUESTS } from '../data/plan';
import { SKILLS } from '../data/french';
import { dayMin, dueGrammar } from '../lib/calc';
import { dayPlan, latestFor } from '../lib/actions';
import { WEEKDAY, fmtDM, isoDate } from '../lib/dates';
import { Ext, Meter } from '../components/ui';
import { RevertButton } from '../components/Revert';
import { ChallengeList } from './French';
import { QuestRow } from './Quests';

type P = { s: Save; ask: Ask; revert: Revert; go: Go; onFocus: () => void };

export function Today({ s, ask, revert, go, onFocus }: P) {
  const now = new Date();
  const d = isoDate(now);
  const plan = dayPlan(now);
  const target = plan.s.reduce((a, b) => a + (b.k === 'fr' ? b.min ?? 0 : 0), 0);
  const mins = dayMin(s, d);
  const [sk, setSk] = useState<Skill>('co');
  const due = dueGrammar(s);
  const next = (['main', 'side', 'biz', 'life'] as const)
    .map((g) => QUESTS.find((q) => q.g === g && !s.done[q.id]))
    .filter((q): q is Quest => !!q);

  return (
    <section className="band" aria-labelledby="today-h">
      <div className="wrap cols">
        <div>
          <h2 id="today-h">{WEEKDAY[now.getDay()]}, {fmtDM(now)}</h2>
          <p className="lead">{plan.d}: {plan.tag}. Lịch hôm nay có {target} phút tiếng Pháp. Xong việc nào thì nộp bằng chứng việc đó.</p>
          <div className="panel">
            <div className="stat">
              <div className="row"><span>Tiếng Pháp hôm nay (đã nộp)</span><b className="nw">{mins}/{target} phút</b></div>
              <Meter v={mins} max={target || 1} goal={target > 0 && mins >= target} />
            </div>
            <div className="acts">
              <button type="button" className="btn ghost sm" onClick={onFocus}>Mở màn hình tập trung</button>
              <button type="button" className="btn ghost sm" onClick={() => go('history')}>Lịch sử hoàn thành</button>
            </div>
          </div>
          <ol className="blocks">
            {plan.s.map((b, i) => {
              const e = b.id ? latestFor(s, 'blk', b.id, d) : null;
              return (
                <li key={i} className={`blk k-${b.k}${e ? ' done' : ''}`}>
                  <span className="tm">{b.t}</span>
                  <div>
                    <p className="t">{b.n}</p>
                    {b.k === 'fr' && b.sk && b.id && (
                      <>
                        <p className="meta">{SKILLS[b.sk].vi} · {b.min} phút{e ? ` · đã nộp ${e.min} phút` : ''}</p>
                        <div className="acts">
                          {b.u && <Ext href={b.u} className="btn ghost sm">Mở {b.app}</Ext>}
                          {e ? (
                            <RevertButton onRevert={() => revert(e.id)} />
                          ) : (
                            <button type="button" className="btn sm" onClick={() => ask({ kind: 'blk', ref: b.id!, title: b.n, xp: 0, sk: b.sk, min: b.min, d })}>
                              Xong? Nộp bằng chứng
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <aside>
          <div className="panel">
            <h3 className="first">Học ngoài lịch</h3>
            <div className="quick">
              <label className="fld">Kỹ năng
                <select value={sk} onChange={(e) => setSk(e.target.value as Skill)}>
                  {(Object.keys(SKILLS) as Skill[]).map((k) => <option key={k} value={k}>{SKILLS[k].vi}</option>)}
                </select>
              </label>
              <div className="acts">
                {[10, 20, 30].map((m) => (
                  <button key={m} type="button" className="btn ghost sm" onClick={() => ask({ kind: 'min', ref: sk, title: `Học ngoài lịch: ${SKILLS[sk].vi}`, xp: 0, sk, min: m })}>
                    {m} phút
                  </button>
                ))}
              </div>
              <p className="small">Bấm số phút để mở khung nộp bằng chứng; chưa xác nhận thì chưa ghi gì.</p>
            </div>
          </div>
          <div className="panel">
            <h3 className="first">Thử thách tuần này</h3>
            <ChallengeList s={s} ask={ask} revert={revert} />
            <button type="button" className="btn ghost sm" onClick={() => go('french-challenges')}>Xem tiến độ thử thách</button>
          </div>
          {due.length > 0 && (
            <div className="panel">
              <h3 className="first">Đến hạn ôn: {due.length} chủ điểm</h3>
              <p className="small">{due.slice(0, 3).map((g) => g.fr).join(' · ')}</p>
              <button type="button" className="btn ghost sm" onClick={() => go('french-grammar')}>Ôn ngay</button>
            </div>
          )}
          <h3>Nhiệm vụ tiếp theo</h3>
          <ul className="quests">{next.map((q) => <QuestRow key={q.id} q={q} s={s} ask={ask} revert={revert} />)}</ul>
        </aside>
      </div>
    </section>
  );
}
