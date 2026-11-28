import { useEffect, useState, type FormEvent } from 'react';
import type { Ask, Go, Mock, Revert, Save, Skill, TestId, Update } from '../types';
import {
  BASES, EE_TASKS, EO_TASKS, FEI_SAMPLES, GRAMMAR, IMMERSION, IMM_SETUP, PRON, ROADMAP, SKILLS, TESTS, VOCAB, VOCAB_TARGET,
  fmtNclc, learnUrl, nclcOf, weekChallenges, type Level,
} from '../data/french';
import { PLAN_MIN, avgFr, dueGrammar, errCount, frDate, frHours, lastScore, mockMin, weakPoints, weekMinutes } from '../lib/calc';
import { latestFor } from '../lib/actions';
import { PLAN_START } from '../data/plan';
import { RevertButton } from '../components/Revert';
import { addDays, fmtDM, fmtDMY, fmtMY, isoDate, parseISO, today, weekIndex, weekKey } from '../lib/dates';
import { Ext, Icon, Meter, Stars, Tabs } from '../components/ui';
import { PHRASES } from '../data/phrases';
import { stats, statusOf } from '../lib/srs';
import { ACCENT_TXT, canSpeak, loadAccent, saveAccent, speak, useFrenchVoice, type Accent } from '../lib/speak';

type P = { s: Save; update: Update };
const SUBS = [['overview', 'Tổng quan'], ['phrases', 'Cụm từ'], ['grammar', 'Ngữ pháp'], ['vocab', 'Từ vựng'], ['errors', 'Sổ lỗi'], ['challenges', 'Thử thách'], ['mocks', 'Thi thử'], ['immersion', 'Immersion']] as const;
type Sub = (typeof SUBS)[number][0];
type Pref = { k: 'g' | 'v'; ref: string } | null;

const refName = (ref: string) =>
  GRAMMAR.find((g) => g.id === ref)?.fr ?? VOCAB.find((v) => v.id === ref)?.vi ?? PRON.find((p) => p[0] === ref)?.[1] ?? ref;

export function French({ s, update, sub, go, ask, revert, onPhrase }: P & { sub: string; go: Go; ask: Ask; revert: Revert; onPhrase: () => void }) {
  const cur: Sub = SUBS.some(([k]) => k === sub) ? (sub as Sub) : 'overview';
  const [pref, setPref] = useState<Pref>(null);
  const addErr = (k: 'g' | 'v', ref: string) => { setPref({ k, ref }); go('french-errors'); };
  return (
    <section className="band fr" aria-labelledby="fr-h">
      <div className="wrap">
        <h2 id="fr-h">Tiếng Pháp: đường tới NCLC 7 trong TCF Canada</h2>
        <p className="lead">Mục tiêu là NCLC 7 cả 4 phần: Nghe từ 458, Đọc từ 453, Viết và Nói từ 10/20. Học bằng các app sẵn có; ở đây chỉ theo dõi sao ngữ pháp, từ vựng, lỗi sai và điểm thi thử.</p>
        <Tabs items={SUBS} value={cur} onChange={(k) => go(k === 'overview' ? 'french' : `french-${k}`)} label="Phần tiếng Pháp" scroll />
        {cur === 'overview' && <Overview s={s} update={update} />}
        {cur === 'phrases' && <Phrases s={s} update={update} onPhrase={onPhrase} />}
        {cur === 'grammar' && <Grammar s={s} update={update} addErr={addErr} />}
        {cur === 'vocab' && <Vocab s={s} update={update} addErr={addErr} />}
        {cur === 'errors' && <Errors s={s} update={update} pref={pref} clearPref={() => setPref(null)} />}
        {cur === 'challenges' && <Challenges s={s} ask={ask} revert={revert} />}
        {cur === 'mocks' && <Mocks s={s} update={update} />}
        {cur === 'immersion' && <Immersion s={s} update={update} />}
      </div>
    </section>
  );
}

function Overview({ s, update }: P) {
  const t = today();
  const phase = ROADMAP.find((p) => t >= p.from && t <= p.to) ?? (t < ROADMAP[0].from ? ROADMAP[0] : ROADMAP[ROADMAP.length - 1]);
  const wm = weekMinutes(s, weekKey());
  return (
    <div className="cols">
      <div>
        <div className="testgrid">
          {TESTS.map((x) => {
            const v = lastScore(s, x.id);
            const lv = nclcOf(x.id, v);
            return (
              <div className="panel test" key={x.id}>
                <p className="small">{x.fr}</p>
                <h3 className="first">{x.vi}</h3>
                <p className="meta">{x.fmt}</p>
                <div className="stat">
                  <div className="row"><span>Đề thử gần nhất</span><b className="nw">{v ?? '–'} / cần {x.need}</b></div>
                  <Meter v={v ?? 0} max={x.max} goal={lv != null && lv >= 7} />
                </div>
                <span className={`badge ${lv != null && lv >= 7 ? 'ok' : 'ask'}`}>{v == null ? 'Chưa có điểm' : fmtNclc(lv)}</span>
              </div>
            );
          })}
        </div>
        <h3>Ba bài Viết (60 phút)</h3>
        <ol className="tasks">{EE_TASKS.map((x) => <li key={x.t}><b>{x.t}.</b> {x.d}<span className="small"> {x.tip}</span></li>)}</ol>
        <h3>Ba phần Nói (12 phút)</h3>
        <ol className="tasks">{EO_TASKS.map((x) => <li key={x.t}><b>{x.t}.</b> {x.d}<span className="small"> {x.tip}</span></li>)}</ol>
      </div>
      <aside>
        <div className="panel">
          <h3 className="first">Dự báo NCLC 7</h3>
          <p className="big">~{fmtMY(frDate(s))}</p>
          <p className="small">{Math.round(frHours(s))}/{s.set.frNeed} giờ, trung bình {avgFr(s).toFixed(1)} giờ/tuần.</p>
          <label className="fld">Trình độ bắt đầu
            <select value={s.fr.base} onChange={(e) => { const b = BASES.find((x) => x.id === e.target.value) ?? BASES[0]; update((x) => { x.fr.base = b.id; x.set.frNeed = b.need; }); }}>
              {BASES.map((b) => <option key={b.id} value={b.id}>{b.n} (cần thêm ~{b.need} giờ)</option>)}
            </select>
          </label>
          <p className="small">Chưa biết trình độ thì làm phần Nghe và Đọc trong <Ext href={FEI_SAMPLES}>đề mẫu chính thức</Ext>. Số giờ theo mốc của Alliance Française: B2 cần khoảng 560–650 giờ học tính từ đầu.</p>
        </div>
        <div className="panel">
          <h3 className="first">Tuần này theo kỹ năng</h3>
          {(Object.keys(SKILLS) as Skill[]).map((k) => (
            <div className="stat" key={k}>
              <div className="row"><span>{SKILLS[k].vi}</span><b className="nw">{wm[k]}/{PLAN_MIN[k]} phút</b></div>
              <Meter v={wm[k]} max={PLAN_MIN[k]} goal={wm[k] >= PLAN_MIN[k]} />
            </div>
          ))}
        </div>
        <div className="panel">
          <h3 className="first">Lộ trình</h3>
          <ol className="road">
            {ROADMAP.map((p) => (
              <li key={p.id} className={p.id === phase.id ? 'now' : t > p.to ? 'past' : undefined}>
                <b>{p.n}</b> <span className="small nw">{fmtDM(parseISO(p.from))}–{fmtDMY(parseISO(p.to))}</span>
                <p>{p.d}</p>
                <p className="small">Mục tiêu: {p.goal}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <h3 className="first">Đặt lịch thi</h3>
          <p>Vancouver: Ashton Testing, $395 cho cả 4 phần. Victoria: Alliance Française, $390. Đăng ký mở khoảng 2–2,5 tháng trước và hay hết chỗ.</p>
          <p className="small">Kết quả có sau khoảng 15 ngày làm việc và còn hạn 2 năm. Thi lại phải cách lần trước ít nhất 20 ngày.</p>
        </div>
      </aside>
    </div>
  );
}

function Grammar({ s, update, addErr }: P & { addErr: (k: 'g' | 'v', ref: string) => void }) {
  const [f, setF] = useState<'all' | 'due' | 'weak'>('all');
  const due = new Set(dueGrammar(s).map((g) => g.id));
  const errs = errCount(s);
  const setStar = (id: string, v: number) => update((x) => { const g = x.fr.g[id] ?? (x.fr.g[id] = { s: 0, last: '', n: 0 }); g.s = v; g.last = today(); });
  const review = (id: string) => update((x) => { const g = x.fr.g[id]; if (g) { g.last = today(); g.n += 1; } });
  const rows = GRAMMAR.filter((g) => f === 'all' || (f === 'due' && due.has(g.id)) || (f === 'weak' && (errs[g.id] ?? 0) > 0));
  return (
    <>
      <p className="lead">Mỗi chủ điểm có 3 sao: đang học, ổn, vững. App nhắc ôn lại sau 2, 7 rồi 21 ngày tuỳ số sao. Sai ở chủ điểm nào thì bấm “+ Lỗi”.</p>
      <Tabs items={[['all', 'Tất cả'], ['due', `Đến hạn ôn (${due.size})`], ['weak', 'Hay sai']] as const} value={f} onChange={setF} label="Lọc ngữ pháp" />
      {rows.length === 0 && <p className="small">Không có chủ điểm nào trong mục này.</p>}
      {(['A2', 'B1', 'B2'] as Level[]).map((lv) => {
        const list = rows.filter((r) => r.lv === lv);
        if (!list.length) return null;
        const all = GRAMMAR.filter((r) => r.lv === lv);
        const ok = all.filter((r) => (s.fr.g[r.id]?.s ?? 0) >= 2).length;
        return (
          <div key={lv}>
            <h3>{lv} · {ok}/{all.length} chủ điểm từ 2 sao</h3>
            <ul className="quests">
              {list.map((r) => {
                const v = s.fr.g[r.id]?.s ?? 0;
                return (
                  <li key={r.id} className={`q gram${v === 3 ? ' done' : ''}`}>
                    <Stars v={v} onChange={(n) => setStar(r.id, n)} label={r.fr} />
                    <div>
                      <p className="t" lang="fr">{r.fr}</p>
                      <p className="d">{r.vi}</p>
                      <p className="tags">
                        {r.use.map((u) => <span key={u} className="badge tag">{u}</span>)}
                        {due.has(r.id) && <span className="badge ask">Đến hạn ôn</span>}
                        {(errs[r.id] ?? 0) > 0 && <span className="badge err">{errs[r.id]} lỗi</span>}
                      </p>
                    </div>
                    <div className="acts">
                      <Ext href={learnUrl(r.fr)} className="btn ghost sm">Bài tập</Ext>
                      {v > 0 && <button type="button" className="btn ghost sm" onClick={() => review(r.id)}>Đã ôn</button>}
                      <button type="button" className="btn ghost sm" onClick={() => addErr('g', r.id)}>+ Lỗi</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function Phrases({ s, update, onPhrase }: P & { onPhrase: () => void }) {
  const now = Date.now();
  const st = stats(s.pc, s.set.newPerDay, now);
  const [f, setF] = useState<'learned' | 'due' | 'all'>(st.seen ? 'learned' : 'all');
  const [accent, setAccent] = useState<Accent>(loadAccent);
  const voice = useFrenchVoice();
  const rows = PHRASES.filter((p) => {
    const k = statusOf(s.pc.cards[p.id], now);
    return f === 'all' || (f === 'due' && k === 'due') || (f === 'learned' && k !== 'new');
  });
  const STATUS = { due: ['ask', 'Đến hạn ôn'], mature: ['ok', 'Đã thuộc'], new: ['lock', 'Chưa học'] } as const;
  return (
    <>
      <p className="lead">Mỗi lần mở khoá điện thoại, app bật một thẻ cụm từ: có nghĩa, lúc nào dùng, câu ví dụ và nút nghe. Mỗi ngày tối đa {s.set.newPerDay} cụm mới; ngày nào chưa xem hết thì phần còn lại để sang hôm sau. Cụm đã học quay lại đúng lúc sắp quên, theo cách của Anki. Thẻ cụm từ không cộng XP.</p>
      <div className="cols">
        <div className="panel">
          <h3 className="first">Tiến độ</h3>
          <div className="stat"><div className="row"><span>Đã học</span><b className="nw">{st.seen}/{st.total} cụm</b></div><Meter v={st.seen} max={st.total} goal={st.seen >= st.total} /></div>
          <div className="stat"><div className="row"><span>Đã thuộc (ôn cách nhau từ 21 ngày)</span><b className="nw">{st.mature} cụm</b></div><Meter v={st.mature} max={st.total} goal={st.mature >= st.total} /></div>
          <p className="small">Hôm nay: mới {st.newToday}/{st.limit} · {st.due} thẻ đến hạn ôn.</p>
          <button type="button" className="btn sm" onClick={onPhrase}>Học ngay</button>
        </div>
        <div className="panel">
          <h3 className="first">Cài đặt thẻ</h3>
          <label className="fld">Cụm mới mỗi ngày
            <select value={s.set.newPerDay} onChange={(e) => update((x) => { x.set.newPerDay = Number(e.target.value) || 30; })}>
              {[3, 5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} cụm</option>)}
            </select>
          </label>
          <label className="fld">Giọng đọc trên máy này
            <select value={accent} onChange={(e) => { const a = e.target.value as Accent; saveAccent(a); setAccent(a); }}>
              {(Object.keys(ACCENT_TXT) as Accent[]).map((a) => <option key={a} value={a}>{ACCENT_TXT[a]}</option>)}
            </select>
          </label>
          {canSpeak()
            ? <button type="button" className="btn ghost sm" onClick={() => speak('Bonjour, je m’appelle Phương et j’apprends le français.')}><Icon n="sound" />Nghe thử</button>
            : <p className="small">Trình duyệt này không đọc được thành tiếng.</p>}
          {voice === false && canSpeak() && <p className="small">Máy chưa có giọng tiếng Pháp: xem cách cài ở mục Thêm → Điện thoại.</p>}
        </div>
      </div>
      <Tabs items={[['learned', `Đã học (${st.seen})`], ['due', `Đến hạn ôn (${st.due})`], ['all', `Tất cả (${st.total})`]] as const} value={f} onChange={setF} label="Lọc cụm từ" />
      {rows.length === 0 && <p className="small">Không có cụm nào trong mục này.</p>}
      {(['A2', 'B1', 'B2'] as Level[]).map((lv) => {
        const list = rows.filter((p) => p.lv === lv);
        if (!list.length) return null;
        const all = PHRASES.filter((p) => p.lv === lv);
        const learned = all.filter((p) => s.pc.cards[p.id]).length;
        return (
          <div key={lv}>
            <h3>{lv} · {learned}/{all.length} cụm đã học</h3>
            <ul className="quests">
              {list.map((p) => {
                const c = s.pc.cards[p.id];
                const k = statusOf(c, now);
                const badge = k === 'due' || k === 'mature' || k === 'new' ? STATUS[k] : null;
                return (
                  <li key={p.id} className="q gram">
                    {canSpeak() && <button type="button" className="btn ghost sm" aria-label={`Nghe: ${p.fr}`} onClick={() => speak(p.fr)}><Icon n="sound" /></button>}
                    <div>
                      <p className="t" lang="fr">{p.fr}</p>
                      <p className="d">{p.vi}</p>
                      <p className="tags">
                        <span className="badge tag">{p.tag}</span>
                        {badge && <span className={`badge ${badge[0]}`}>{badge[1]}</span>}
                        {c && k !== 'due' && <span className="small">Ôn lại {fmtDM(new Date(c.due))}</span>}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function Vocab({ s, update, addErr }: P & { addErr: (k: 'g' | 'v', ref: string) => void }) {
  const get = (x: Save, id: string) => x.fr.v[id] ?? (x.fr.v[id] = { s: 0, w: 0 });
  const add = (id: string, n: number) => update((x) => { const v = get(x, id); v.w = Math.max(0, v.w + n); });
  const total = Object.values(s.fr.v).reduce((a, v) => a + (v.w || 0), 0);
  return (
    <>
      <p className="lead">Mục tiêu {VOCAB_TARGET} từ mỗi chủ đề. Chỉ đếm từ đã nhớ được (ví dụ thẻ Anki đã trả lời đúng 2 lần). Tổng hiện có: {total} từ.</p>
      <ul className="vgrid">
        {VOCAB.map((v) => {
          const st = s.fr.v[v.id];
          const w = st?.w ?? 0;
          return (
            <li key={v.id} className="panel vcard">
              <div className="row"><b>{v.vi}</b><Stars v={st?.s ?? 0} onChange={(n) => update((x) => { get(x, v.id).s = n; })} label={v.vi} /></div>
              <p className="small"><span lang="fr">{v.fr}</span> · {v.use.join(', ')}</p>
              <div className="stat"><div className="row"><span>{w}/{VOCAB_TARGET} từ</span></div><Meter v={w} max={VOCAB_TARGET} goal={w >= VOCAB_TARGET} /></div>
              <div className="acts">
                <button type="button" className="btn sm" onClick={() => add(v.id, 10)}>+10 từ</button>
                <button type="button" className="btn ghost sm" onClick={() => add(v.id, -5)}>−5</button>
                <button type="button" className="btn ghost sm" onClick={() => addErr('v', v.id)}>+ Lỗi</button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const optionsFor = (k: 'g' | 'v' | 'p'): [string, string][] =>
  k === 'g' ? GRAMMAR.map((g) => [g.id, `${g.lv} · ${g.fr}`]) : k === 'v' ? VOCAB.map((v) => [v.id, v.vi]) : PRON;

function Errors({ s, update, pref, clearPref }: P & { pref: Pref; clearPref: () => void }) {
  const [k, setK] = useState<'g' | 'v' | 'p'>(pref?.k ?? 'g');
  const [ref, setRef] = useState(pref?.ref ?? GRAMMAR[0].id);
  const [wrong, setWrong] = useState('');
  const [right, setRight] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'g' | 'v' | 'p'>('all');
  useEffect(() => {
    if (pref) { setK(pref.k); setRef(pref.ref); clearPref(); }
  }, [pref, clearPref]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!wrong.trim() && !right.trim()) return;
    const entry = { id: Date.now().toString(36), d: today(), k, ref, wrong: wrong.trim(), right: right.trim(), note: note.trim() };
    update((x) => { x.fr.err.unshift(entry); if (x.fr.err.length > 500) x.fr.err.length = 500; });
    setWrong(''); setRight(''); setNote('');
  };
  const weak = weakPoints(s, 6);
  const list = s.fr.err.filter((e) => filter === 'all' || e.k === filter);
  return (
    <div className="cols">
      <div>
        <p className="lead">Mỗi lần sai, ghi câu sai và câu đúng. App đếm lỗi theo chủ điểm để biết cần ôn gì; phiên Game Master thứ 2 cũng đọc sổ này.</p>
        <div className="panel">
          <form className="log" onSubmit={submit}>
            <label>Loại
              <select value={k} onChange={(e) => { const nk = e.target.value as 'g' | 'v' | 'p'; setK(nk); setRef(optionsFor(nk)[0][0]); }}>
                <option value="g">Ngữ pháp</option><option value="v">Từ vựng</option><option value="p">Phát âm</option>
              </select>
            </label>
            <label className="span2">Chủ điểm
              <select value={ref} onChange={(e) => setRef(e.target.value)}>
                {optionsFor(k).map(([id, n]) => <option key={id} value={id}>{n}</option>)}
              </select>
            </label>
            <label className="span3">Câu sai<input type="text" lang="fr" value={wrong} onChange={(e) => setWrong(e.target.value)} placeholder="Hier, je suis allé à la boulangerie." /></label>
            <label className="span3">Câu đúng<input type="text" lang="fr" value={right} onChange={(e) => setRight(e.target.value)} placeholder="Hier, je suis allée à la boulangerie." /></label>
            <label className="span3">Ghi chú<input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Đi với être thì participe passé hợp với chủ ngữ nữ: thêm -e" /></label>
            <button className="btn span3" type="submit">Ghi lỗi</button>
          </form>
        </div>
      </div>
      <aside>
        <div className="panel">
          <h3 className="first">Hay sai nhất</h3>
          {weak.length ? (
            <ol className="weak">{weak.map(([r, n]) => <li key={r}><span>{refName(r)}</span><b>{n}</b></li>)}</ol>
          ) : (
            <p className="small">Chưa có lỗi nào. Lỗi đầu tiên bạn ghi sẽ hiện ở đây.</p>
          )}
        </div>
      </aside>
      <div className="span-all">
        <Tabs items={[['all', `Tất cả (${s.fr.err.length})`], ['g', 'Ngữ pháp'], ['v', 'Từ vựng'], ['p', 'Phát âm']] as const} value={filter} onChange={setFilter} label="Lọc sổ lỗi" />
        <ul className="errlist">
          {list.slice(0, 120).map((e) => (
            <li key={e.id}>
              <div>
                <p className="small">{fmtDMY(parseISO(e.d))} · {refName(e.ref)}</p>
                {e.wrong && <p className="wrong" lang="fr">{e.wrong}</p>}
                {e.right && <p className="right" lang="fr">{e.right}</p>}
                {e.note && <p className="small">{e.note}</p>}
              </div>
              <button type="button" className="x" aria-label="Xoá lỗi này" onClick={() => update((x) => { x.fr.err = x.fr.err.filter((y) => y.id !== e.id); })}>×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** This week's five challenges; shared by Today and the Challenges tab. */
export function ChallengeList({ s, ask, revert }: { s: Save; ask: Ask; revert: Revert }) {
  const wk = weekKey();
  if (wk < PLAN_START) return <p className="small">Thử thách tuần bắt đầu từ thứ 2, 30/11.</p>;
  return (
    <ul className="quests">
      {weekChallenges(weekIndex()).map((c) => {
        const e = latestFor(s, 'ch', c.id, wk);
        return (
          <li key={c.id} className={`q row${e ? ' done' : ''}`}>
            <span className="st" aria-hidden="true">{e ? '✓' : ''}</span>
            <span className="t">{c.t}</span>
            <span className="xp">+{c.xp} XP</span>
            <span className="d">{SKILLS[c.sk].vi}{e ? ` · xong ${fmtDM(parseISO(e.d))}` : ''}</span>
            <div className="acts">
              {e ? (
                <RevertButton onRevert={() => revert(e.id)} />
              ) : (
                <button type="button" className="btn sm" onClick={() => ask({ kind: 'ch', ref: c.id, title: c.t, xp: c.xp, wk })}>Nộp bằng chứng</button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Challenges({ s, ask, revert }: { s: Save; ask: Ask; revert: Revert }) {
  const wk = weekKey();
  const n = (s.fr.ch[wk] ?? []).length;
  const prev = (s.fr.ch[isoDate(addDays(parseISO(wk), -7))] ?? []).length;
  const perfect = Object.values(s.fr.ch).filter((l) => l.length >= 5).length;
  return (
    <div className="cols">
      <div>
        <p className="lead">Mỗi tuần 5 thử thách: một cho mỗi kỹ năng và một cho ngữ pháp hoặc từ vựng. Thứ 2 đổi bộ mới. Xong thì nộp bằng chứng mới được cộng XP.</p>
        <ChallengeList s={s} ask={ask} revert={revert} />
      </div>
      <aside>
        <div className="panel">
          <h3 className="first">Tuần này {n}/5</h3>
          <Meter v={n} max={5} goal={n >= 5} />
          <p className="small">Tuần trước: {prev}/5. Số tuần hoàn hảo: {perfect}.</p>
        </div>
      </aside>
    </div>
  );
}

const SCORE_FIELDS: { k: TestId; n: string; max: number }[] = [
  { k: 'co', n: 'Nghe (100–699)', max: 699 }, { k: 'ce', n: 'Đọc (100–699)', max: 699 },
  { k: 'ee', n: 'Viết (0–20)', max: 20 }, { k: 'eo', n: 'Nói (0–20)', max: 20 },
];

function Mocks({ s, update }: P) {
  const [d, setD] = useState(today());
  const [v, setV] = useState<Record<TestId, string>>({ co: '', ce: '', ee: '', eo: '' });
  const [src, setSrc] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const num = (t: string) => (t.trim() === '' ? null : Number(t));
    const m: Mock = { id: Date.now().toString(36), d, co: num(v.co), ce: num(v.ce), ee: num(v.ee), eo: num(v.eo), src: src.trim() };
    if ([m.co, m.ce, m.ee, m.eo].every((x) => x == null)) return;
    update((x) => { x.fr.mocks.push(m); x.fr.mocks.sort((a, b) => a.d.localeCompare(b.d)); });
    setV({ co: '', ce: '', ee: '', eo: '' });
    setSrc('');
  };
  return (
    <div className="cols">
      <div>
        <p className="lead">Ghi điểm mỗi lần thi thử; app đổi sang NCLC theo bảng của IRCC. Đạt NCLC 7 cả 4 phần ở 2 đề liên tiếp rồi hãy đi thi thật.</p>
        {s.fr.mocks.length ? (
          <div className="scroll">
            <table className="mocks">
              <thead><tr><th>Ngày</th><th>Nghe</th><th>Đọc</th><th>Viết</th><th>Nói</th><th>Thấp nhất</th><th><span className="sr">Xoá</span></th></tr></thead>
              <tbody>
                {[...s.fr.mocks].reverse().map((m) => (
                  <tr key={m.id}>
                    <td>{fmtDMY(parseISO(m.d))}{m.src && <span className="small"> · {m.src}</span>}</td>
                    {(['co', 'ce', 'ee', 'eo'] as const).map((k) => (
                      <td key={k} className="num">{m[k] ?? '–'}{m[k] != null && <span className="small"> ({fmtNclc(nclcOf(k, m[k]))})</span>}</td>
                    ))}
                    <td className="num"><b>{fmtNclc(mockMin(m))}</b></td>
                    <td><button type="button" className="x" aria-label={`Xoá đề ngày ${fmtDMY(parseISO(m.d))}`} onClick={() => update((x) => { x.fr.mocks = x.fr.mocks.filter((y) => y.id !== m.id); })}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="small">Chưa có đề thử nào. Đề mẫu chính thức nằm ở tab Immersion.</p>
        )}
      </div>
      <aside>
        <div className="panel">
          <h3 className="first">Ghi đề thử</h3>
          <form className="log two" onSubmit={submit}>
            <label className="span3">Ngày<input type="date" value={d} onChange={(e) => setD(e.target.value)} required /></label>
            {SCORE_FIELDS.map((f) => (
              <label key={f.k}>{f.n}
                <input type="number" min={0} max={f.max} inputMode="numeric" value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
              </label>
            ))}
            <label className="span3">Nguồn đề<input type="text" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="Đề mẫu FEI, sách, gia sư…" /></label>
            <button className="btn span3" type="submit">Ghi điểm</button>
          </form>
          <p className="small">Mốc NCLC 7 của IRCC: Nghe từ 458, Đọc từ 453, Viết và Nói từ 10.</p>
        </div>
      </aside>
    </div>
  );
}

function Immersion({ s, update }: P) {
  return (
    <>
      <p className="lead">Không cần thêm app học: mỗi khối tiếng Pháp trong lịch đã có nút mở đúng app. Đây là cả bộ, cộng 6 bước biến điện thoại thành môi trường tiếng Pháp.</p>
      <div className="cols">
        <div className="immgrid">
          {IMMERSION.map((c) => (
            <div key={c.cat} className="panel">
              <h3 className="first">{c.cat}</h3>
              <ul className="links">{c.items.map((i) => <li key={i.n}><Ext href={i.u}>{i.n}</Ext><span className="small">{i.d}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <aside>
          <div className="panel">
            <h3 className="first">Điện thoại tiếng Pháp</h3>
            <ul className="quests">
              {IMM_SETUP.map((i) => (
                <li key={i.id}>
                  <label className={`q${s.fr.imm[i.id] ? ' done' : ''}`}>
                    <input type="checkbox" checked={!!s.fr.imm[i.id]} onChange={() => update((x) => { x.fr.imm[i.id] = !x.fr.imm[i.id]; })} />
                    <span className="t">{i.t}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
