import { useState, type FormEvent } from 'react';
import type { Ask, Entry, Go, Kind, LootItem, QTab, Quest, Revert, Save, Update } from '../types';
import { CEC_H, LOOT, QUESTS, TABS } from '../data/plan';
import { SKILLS } from '../data/french';
import { avgTeer, cecDate, sumTeer, xpOf } from '../lib/calc';
import { latestFor } from '../lib/actions';
import { WEEKDAY, fmtDMY, fmtMY, parseISO, today, weekKey } from '../lib/dates';
import { Ext, Icon, Tabs } from '../components/ui';
import { RevertButton } from '../components/Revert';
import { safeUrl } from '../components/Submit';

function Proof({ e }: { e: Entry }) {
  const url = safeUrl(e.link);
  if (e.legacy) return <p className="proof warn">Được đánh dấu trước khi có bước nộp bằng chứng nên chưa tính XP. Lỡ tay thì hoàn tác; làm thật thì hoàn tác rồi nộp lại kèm bằng chứng.</p>;
  if (!e.proof && !url) return null;
  return <p className="proof">{e.proof}{url && <> <Ext href={url}>Xem link</Ext></>}</p>;
}

export function QuestRow({ q, s, ask, revert }: { q: Quest; s: Save; ask: Ask; revert: Revert }) {
  const e = latestFor(s, 'quest', q.id);
  return (
    <li className={`q row${e ? ' done' : ''}`}>
      <span className="st" aria-hidden="true">{e ? '✓' : ''}</span>
      <span className="t">{q.t}</span>
      <span className="xp">+{q.xp} XP</span>
      <span className="d">{q.d}</span>
      <span className="due">{e ? `Xong ${fmtDMY(parseISO(e.d))}` : `Hạn: ${q.due}`}</span>
      {e && <Proof e={e} />}
      <div className="acts">
        {e ? (
          <RevertButton onRevert={() => revert(e.id)} />
        ) : (
          <button type="button" className="btn sm" onClick={() => ask({ kind: 'quest', ref: q.id, title: q.t, xp: q.xp })}>Nộp hoàn thành</button>
        )}
      </div>
    </li>
  );
}

function Switch({ cur, s, go }: { cur: 'quests' | 'history'; s: Save; go: Go }) {
  return <Tabs items={[['quests', 'Nhiệm vụ'], ['history', `Lịch sử hoàn thành (${s.hist.length})`]] as const} value={cur} onChange={(k) => go(k)} label="Nhiệm vụ hoặc lịch sử" />;
}

const FILTERS = [['all', 'Tất cả'], ['free', 'Miễn phí'], ['cheap', 'Dưới $1.000'], ['online', 'Online'], ['lock', 'Mở khi có PR']] as const;
type Filter = (typeof FILTERS)[number][0];
const cheap = (it: LootItem) => it.free || /^~?(US)?\$\d{1,3}(?![\d.])/.test(it.c.replace(/[–\s].*$/, ''));
const show = (f: Filter, it: LootItem) =>
  f === 'all' ||
  (f === 'free' && it.free && it.tier !== 'L') ||
  (f === 'cheap' && it.tier !== 'L' && it.tier !== 'B' && cheap(it)) ||
  (f === 'online' && it.on && it.tier !== 'L') ||
  (f === 'lock' && it.tier === 'L');

export function Quests({ s, update, ask, revert, go }: { s: Save; update: Update; ask: Ask; revert: Revert; go: Go }) {
  const [tab, setTab] = useState<QTab>('main');
  const [filt, setFilt] = useState<Filter>('all');
  const [day, setDay] = useState(today());
  const [teer, setTeer] = useState('');
  const [fr, setFr] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const iso = weekKey(parseISO(day));
    const row = { iso, label: fmtDMY(parseISO(iso)), teer: Math.max(0, Number(teer) || 0), fr: Math.max(0, Number(fr) || 0) };
    update((x) => { x.log = x.log.filter((r) => r.iso !== iso).concat(row).sort((a, b) => a.iso.localeCompare(b.iso)); });
    setTeer('');
    setFr('');
  };

  return (
    <>
      <section className="band" aria-labelledby="q-h">
        <div className="wrap cols">
          <div>
            <h2 id="q-h">Nhật ký nhiệm vụ</h2>
            <p className="lead">Xong nhiệm vụ nào thì bấm “Nộp hoàn thành” và ghi bằng chứng. XP chỉ cộng sau khi bạn xác nhận; lỡ tay thì hoàn tác.</p>
            <Switch cur="quests" s={s} go={go} />
            <Tabs items={TABS} value={tab} onChange={setTab} label="Nhóm nhiệm vụ" />
            <ul className="quests">{QUESTS.filter((q) => q.g === tab).map((q) => <QuestRow key={q.id} q={q} s={s} ask={ask} revert={revert} />)}</ul>
          </div>
          <aside>
            <h2>Ghi giờ mỗi tuần</h2>
            <div className="panel">
              <form className="log" onSubmit={submit}>
                <label>Ngày bất kỳ trong tuần<input type="date" value={day} onChange={(e) => setDay(e.target.value)} required /></label>
                <label>Giờ TEER 0–3<input type="number" min={0} max={80} step={0.5} inputMode="decimal" placeholder={String(s.set.teerPlan)} value={teer} onChange={(e) => setTeer(e.target.value)} /></label>
                <label>Giờ tiếng Pháp<input type="number" min={0} max={80} step={0.5} inputMode="decimal" placeholder="0" value={fr} onChange={(e) => setFr(e.target.value)} /></label>
                <button className="btn" type="submit">Ghi tuần này</button>
              </form>
              <p className="small">
                Giờ làm bánh lấy theo phiếu lương (giờ được trả). Tiếng Pháp đã nộp theo từng buổi ở tab Hôm nay thì để trống ô thứ ba.
                Đã có {Math.round(Math.min(sumTeer(s), CEC_H))}/1.560 giờ; trung bình {avgTeer(s).toFixed(1)} giờ/tuần, đủ khoảng {fmtMY(cecDate(s))}.
              </p>
              <ul className="loglist">
                {[...s.log].reverse().map((r) => (
                  <li key={r.iso}>
                    <span>Tuần {r.label}</span>
                    <span className="nw">{r.teer} giờ bánh · {r.fr} giờ Pháp</span>
                    <button type="button" className="x" aria-label={`Xoá tuần ${r.label}`} onClick={() => update((x) => { x.log = x.log.filter((y) => y.iso !== r.iso); })}>×</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <section className="band alt" aria-labelledby="loot-h">
        <div className="wrap">
          <h2 id="loot-h">Kho đồ: khoá học người có work permit dùng được</h2>
          <p className="lead">S: miễn phí, làm ngay. A: rẻ và đáng tiền. B: để sau. Ổ khoá: mở khi có PR. Chi phí là phí công bố lúc kiểm tra (11/2026).</p>
          <Tabs items={FILTERS} value={filt} onChange={setFilt} label="Lọc kho đồ" />
          <div className="grid">
            {LOOT.filter((it) => show(filt, it)).map((it) => (
              <article key={it.n} className={`loot${it.tier === 'L' ? ' isL' : ''}`}>
                <div className="top">
                  <span className={`tier t${it.tier}`} aria-label={it.tier === 'L' ? 'Mở khi có PR' : `Hạng ${it.tier}`}>{it.tier === 'L' ? <Icon n="lock" /> : it.tier}</span>
                  <span className={`badge ${it.el}`}>{it.elt}</span>
                </div>
                <h3>{it.h ? <Ext href={it.h}>{it.n}</Ext> : it.n}</h3>
                <p className="meta"><span className="cost">{it.c}</span> · {it.f}</p>
                <p className="meta">Hợp lịch: {it.fit}</p>
                <p className="meta">Được gì: {it.u}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const KIND_TXT: Record<Kind, string> = { quest: 'Nhiệm vụ', ch: 'Thử thách tuần', blk: 'Học theo lịch', min: 'Học ngoài lịch' };
const HF = [['all', 'Tất cả'], ['quest', 'Nhiệm vụ'], ['ch', 'Thử thách'], ['fr', 'Học tiếng Pháp']] as const;
type HFilter = (typeof HF)[number][0];

/** Every confirmed completion, grouped by day, each with its proof and an undo. */
export function History({ s, revert, go }: { s: Save; revert: Revert; go: Go }) {
  const [f, setF] = useState<HFilter>('all');
  const list = s.hist
    .filter((e) => f === 'all' || (f === 'fr' ? e.kind === 'blk' || e.kind === 'min' : e.kind === f))
    .slice()
    .sort((a, b) => b.d.localeCompare(a.d) || b.at.localeCompare(a.at));
  const days: [string, Entry[]][] = [];
  for (const e of list) {
    const last = days[days.length - 1];
    if (last && last[0] === e.d) last[1].push(e);
    else days.push([e.d, [e]]);
  }
  return (
    <section className="band" aria-labelledby="h-h">
      <div className="wrap">
        <h2 id="h-h">Lịch sử hoàn thành</h2>
        <p className="lead">Mọi việc đã nộp, xếp theo ngày, kèm bằng chứng. Lỡ tay thì bấm “Hoàn tác”: việc đó quay về chưa xong, XP và số phút được trừ lại. Tổng: {xpOf(s).toLocaleString('vi-VN')} XP.</p>
        <Switch cur="history" s={s} go={go} />
        <Tabs items={HF} value={f} onChange={setF} label="Lọc lịch sử" />
        {days.length === 0 && <p className="small">Chưa có gì. Việc bạn nộp bằng chứng sẽ hiện ở đây.</p>}
        {days.map(([d, es]) => (
          <div key={d} className="hday">
            <h3>{WEEKDAY[parseISO(d).getDay()]}, {fmtDMY(parseISO(d))}</h3>
            <ul className="hist">
              {es.map((e) => (
                <li key={e.id}>
                  <div>
                    <p className="small">
                      {KIND_TXT[e.kind]}
                      {e.min ? ` · ${e.min} phút ${e.sk ? SKILLS[e.sk].vi.toLowerCase() : ''}` : ''}
                      {' · '}{e.legacy ? 'chưa có bằng chứng' : `+${e.xp} XP`}
                    </p>
                    <p className="t">{e.title}</p>
                    <Proof e={e} />
                  </div>
                  <RevertButton onRevert={() => revert(e.id)} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
