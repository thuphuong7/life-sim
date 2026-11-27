import { useMemo, useState } from 'react';
import type { Save, Update } from '../types';
import { ACH, APP_URL, CASH_BY, CASH_GOAL, GMQ, RULES, SRC, TREE, WEEK } from '../data/plan';
import { SKILLS } from '../data/french';
import { achievements } from '../lib/calc';
import { blank, migrate, SYNC_TXT, type SyncStatus } from '../lib/storage';
import { addDays, fmtDMY, monthsUntil, today } from '../lib/dates';
import { Ext, Meter } from '../components/ui';

const money = (n: number) => `$${Math.round(n).toLocaleString('vi-VN')}`;
const STATE_TXT = { have: 'đã có', grow: 'đang luyện', next: 'sắp học' } as const;

function nextGm() {
  const d = new Date();
  let x = addDays(d, (8 - d.getDay()) % 7);
  if (x.getDay() === 1 && isSameDay(x, d) && (d.getHours() > 9 || (d.getHours() === 9 && d.getMinutes() >= 39))) x = addDays(x, 7);
  return x;
}
const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function Week() {
  return (
    <ol className="week">
      {WEEK.map((d) => (
        <li key={d.d} className="day">
          <div><b>{d.d}</b><span className="tag">{d.tag}</span></div>
          <div>
            {d.s.map((b, i) => (
              <div key={i} className="slot">
                <span>{b.t}</span>
                <span>{b.n}{b.k === 'fr' && b.sk && <span className="sk"> · {SKILLS[b.sk].vi}, {b.min} phút</span>}</span>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Treasure({ s, update }: { s: Save; update: Update }) {
  const n = monthsUntil(CASH_BY);
  const r = s.set.rate / 100 / 12;
  const g = (1 + r) ** n;
  const proj = r ? s.set.saved * g + s.set.monthly * ((g - 1) / r) : s.set.saved + s.set.monthly * n;
  const need = Math.max(0, r ? ((CASH_GOAL - s.set.saved * g) * r) / (g - 1) : (CASH_GOAL - s.set.saved) / n);
  const field = (k: 'saved' | 'monthly' | 'rate', v: string) => update((x) => { x.set[k] = Math.max(0, Number(v) || 0); });
  return (
    <div className="panel">
      <h3 className="first">Kho báu: 800.000 CAD tiền mặt trước 11/2041</h3>
      <div className="stat"><div className="row"><span>Đang có</span><b className="nw">{money(s.set.saved)} / {money(CASH_GOAL)}</b></div><Meter v={s.set.saved} max={CASH_GOAL} goal /></div>
      <form className="log" onSubmit={(e) => e.preventDefault()}>
        <label>Đang có ($)<input type="number" min={0} step={100} inputMode="numeric" value={s.set.saved || ''} onChange={(e) => field('saved', e.target.value)} /></label>
        <label>Để dành mỗi tháng ($)<input type="number" min={0} step={50} inputMode="numeric" value={s.set.monthly || ''} onChange={(e) => field('monthly', e.target.value)} /></label>
        <label>Lãi giả định (%/năm)<input type="number" min={0} max={15} step={0.5} inputMode="decimal" value={s.set.rate || ''} placeholder="0" onChange={(e) => field('rate', e.target.value)} /></label>
      </form>
      <p>Còn {n} tháng. Với số đang có, mỗi tháng cần để dành khoảng <b>{money(need)}</b>. Giữ mức {money(s.set.monthly)}/tháng thì tới 11/2041 có khoảng <b>{money(proj)}</b>.</p>
      <p className="small">Đây chỉ là phép tính với số bạn nhập, không phải lời khuyên đầu tư. Lãi 0% nghĩa là để tiền mặt.</p>
    </div>
  );
}

function Phone() {
  const base = __ARTIFACT__ ? APP_URL : location.href.split('#')[0];
  const url = `${base}#focus`;
  const [copied, setCopied] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied('Đã chép link.'); } catch { setCopied('Trình duyệt chặn chép; bấm giữ vào link để chép tay.'); }
  };
  return (
    <div className="gmgrid">
      <div>
        <h3 className="first">iPhone: app Phím tắt (Shortcuts)</h3>
        <ol className="steps">
          <li>Mở <b>Phím tắt</b> → tab <b>Tự động hoá</b> (Automation) → <b>+</b> → <b>Ứng dụng</b> (App).</li>
          <li>Chọn các app bạn hay mở để lướt (Instagram, TikTok, YouTube, Facebook…), chọn <b>Được mở</b> (Is Opened) và <b>Chạy ngay lập tức</b> (Run Immediately).</li>
          <li>Thêm tác vụ <b>Chọn từ menu</b> (Choose from Menu), lời nhắc “Có việc gấp không?”, hai mục “Có, việc gấp” và “Không gấp”.</li>
          <li>Dưới “Không gấp”, thêm <b>Mở URL</b> (Open URLs) với link bên dưới. Dưới “Có, việc gấp” để trống.</li>
        </ol>
        <p className="small">iPhone không có trigger “mở khoá màn hình”, nên pop-up bật khi bạn mở các app đã chọn.</p>
      </div>
      <div>
        <h3 className="first">Android: app MacroDroid (bản miễn phí)</h3>
        <ol className="steps">
          <li>Cài MacroDroid → <b>Add Macro</b>.</li>
          <li>Trigger: <b>Screen Unlocked</b>, chạy mỗi lần mở khoá máy.</li>
          <li>Action: <b>If Confirmed Then</b>, tiêu đề “Có việc gấp không?”; nút đồng ý “Không gấp, vào Life Sim”, nút huỷ “Có, việc gấp”.</li>
          <li>Bên trong khối đó thêm <b>Open Website</b> với link bên dưới.</li>
        </ol>
      </div>
      <div className="span-all">
        <p>Link mở thẳng màn hình tập trung:</p>
        <p className="url"><code>{url}</code> <button type="button" className="btn ghost sm" onClick={copy}>Chép link</button></p>
        {copied && <p className="small" role="status">{copied}</p>}
        <p className="small">Lần đầu mở link trên điện thoại, đăng nhập claude.ai trong trình duyệt. Đổi đuôi <code>#focus</code> thành <code>#checkin</code> nếu muốn app tự hỏi câu “Có việc gấp không?”.</p>
      </div>
    </div>
  );
}

function Data({ s, update, replace, sync }: { s: Save; update: Update; replace: (n: Save) => void; sync: SyncStatus }) {
  const [txt, setTxt] = useState('');
  const [ask, setAsk] = useState<null | 'reset' | 'import'>(null);
  const [pending, setPending] = useState<Save | null>(null);
  const [msg, setMsg] = useState('');
  const json = useMemo(() => JSON.stringify(s), [s]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setMsg('Đã chép dữ liệu. Dán vào ghi chú hoặc email để cất.'); } catch { setMsg('Trình duyệt chặn chép.'); }
  };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = `life-sim-${today()}.json`;
    a.click();
  };
  const parse = (t: string) => {
    try { setPending(migrate(JSON.parse(t))); setAsk('import'); setMsg(''); } catch { setMsg('Không đọc được dữ liệu này.'); }
  };
  const num = (k: 'teerPlan' | 'frPlan' | 'frNeed', v: string) => update((x) => { x.set[k] = Math.max(0, Number(v) || 0); });
  return (
    <div className="cols">
      <div className="panel">
        <h3 className="first">Cài đặt</h3>
        <form className="log" onSubmit={(e) => e.preventDefault()}>
          <label>Giờ làm bánh dự kiến/tuần<input type="number" min={0} max={60} step={0.5} inputMode="decimal" value={s.set.teerPlan} onChange={(e) => num('teerPlan', e.target.value)} /></label>
          <label>Giờ tiếng Pháp dự kiến/tuần<input type="number" min={0} max={60} step={0.5} inputMode="decimal" value={s.set.frPlan} onChange={(e) => num('frPlan', e.target.value)} /></label>
          <label>Giờ tiếng Pháp cần có<input type="number" min={0} max={2000} step={10} inputMode="numeric" value={s.set.frNeed} onChange={(e) => num('frNeed', e.target.value)} /></label>
        </form>
        <p className="small">Dự báo dùng các số này cho tới khi có 4 tuần dữ liệu. 28 giờ/tuần là khi có thêm nửa ca thứ 6.</p>
        <p className="small" role="status">Lưu trữ: {SYNC_TXT[sync]}</p>
      </div>
      <div className="panel">
        <h3 className="first">Sao lưu dữ liệu</h3>
        <div className="acts">
          <button type="button" className="btn" onClick={copy}>Chép dữ liệu (JSON)</button>
          {!__ARTIFACT__ && <button type="button" className="btn ghost" onClick={download}>Tải file</button>}
        </div>
        <label className="fld">Nhập lại từ JSON
          <textarea rows={3} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder='{"v":2, …}' />
        </label>
        <div className="acts">
          <button type="button" className="btn ghost" disabled={!txt.trim()} onClick={() => parse(txt)}>Nhập</button>
          <label className="btn ghost file">Chọn file<input type="file" accept="application/json,.json" onChange={async (e) => { const f = e.target.files?.[0]; if (f) parse(await f.text()); }} /></label>
          <button type="button" className="btn ghost danger" onClick={() => setAsk('reset')}>Xoá hết tiến độ</button>
        </div>
        {ask && (
          <div className="confirm" role="alertdialog" aria-label="Xác nhận">
            <p>{ask === 'reset' ? 'Xoá toàn bộ tiến độ? Không hoàn tác được.' : 'Thay toàn bộ tiến độ hiện tại bằng dữ liệu vừa nhập?'}</p>
            <div className="acts">
              <button type="button" className="btn danger" onClick={() => { replace(ask === 'reset' || !pending ? blank() : pending); setMsg(ask === 'reset' ? 'Đã xoá tiến độ.' : 'Đã nhập dữ liệu.'); setAsk(null); setTxt(''); }}>Đồng ý</button>
              <button type="button" className="btn ghost" onClick={() => setAsk(null)}>Huỷ</button>
            </div>
          </div>
        )}
        {msg && <p className="small" role="status">{msg}</p>}
      </div>
    </div>
  );
}

export function More({ s, update, replace, sync }: { s: Save; update: Update; replace: (n: Save) => void; sync: SyncStatus }) {
  const dyn = achievements(s);
  return (
    <>
      <section className="band" aria-labelledby="week-h">
        <div className="wrap">
          <h2 id="week-h">Một tuần trong game</h2>
          <p className="lead">Ca JJ Bean 5:00–13:00 thứ 3–5, thêm nửa ca thứ 6 nếu được duyệt. Tiếng Pháp khoảng 9,5 giờ mỗi tuần, chia đều 7 ngày. Dưới 8 giờ/tuần thì mốc NCLC 7 lùi về sau đợt đủ giờ CEC.</p>
          <Week />
        </div>
      </section>
      <section className="band alt" aria-labelledby="gold-h">
        <div className="wrap cols">
          <div>
            <h2 id="gold-h">Kho báu</h2>
            <Treasure s={s} update={update} />
          </div>
          <div>
            <h2>Cây kỹ năng mang theo được</h2>
            <p className="lead">●●● dùng được ở hầu hết các nước. ●● chủ yếu ở Bắc Mỹ. ● chứng chỉ chỉ có giá trị ở BC, nhưng kỹ năng vẫn mang theo.</p>
            <div className="treegrid">
              {TREE.map((b) => (
                <div key={b.b} className="branch">
                  <h3>{b.b}</h3>
                  {b.n.map(([name, st, port]) => (
                    <div key={name} className="node"><span>{name} <span aria-label={`${port} trên 3`}>{'●'.repeat(port)}</span></span><em className={st}>{STATE_TXT[st]}</em></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="band" aria-labelledby="ach-h">
        <div className="wrap">
          <h2 id="ach-h">Thành tựu</h2>
          <div className="achgrid">
            {ACH.map(([n, d, earned, q]) => {
              const on = earned === 1 || (!!q && !!s.done[q]);
              return <div key={n} className={`ach${on ? '' : ' off'}`}><b>{n}</b>{on ? d : 'Chưa mở'}</div>;
            })}
            {dyn.map((a) => <div key={a.n} className={`ach${a.on ? '' : ' off'}`}><b>{a.n}</b>{a.d}</div>)}
          </div>
        </div>
      </section>
      <section className="band alt" aria-labelledby="phone-h">
        <div className="wrap">
          <h2 id="phone-h">Pop-up trên điện thoại</h2>
          <p className="lead">Mỗi lần mở điện thoại, máy hỏi “Có việc gấp không?”. Chọn không gấp thì máy mở thẳng màn hình tập trung của game.</p>
          <Phone />
        </div>
      </section>
      <section className="band gm" aria-labelledby="gm-h">
        <div className="wrap gmgrid">
          <div>
            <h2 id="gm-h">Phiên Game Master</h2>
            <p>Mỗi thứ 2 lúc 9:39 sáng, Claude mở một phiên phỏng vấn ngắn để cập nhật bản đồ. Phiên tới: {fmtDMY(nextGm())}.</p>
            <h3>Câu hỏi cho phiên tới</h3>
            <ol>{GMQ.map((q) => <li key={q}>{q}</li>)}</ol>
          </div>
          <div>
            <h2>Luật chơi</h2>
            <ul>{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="small">Bốn luật đầu lấy từ sách 《高性价比人生指南》, mục 23, điều 9, 10, 14 và 15.</p>
          </div>
        </div>
      </section>
      <section className="band" aria-labelledby="data-h">
        <div className="wrap">
          <h2 id="data-h">Cài đặt và dữ liệu</h2>
          <Data s={s} update={update} replace={replace} sync={sync} />
        </div>
      </section>
      <footer className="band src alt">
        <div className="wrap">
          <h2>Nguồn</h2>
          <ul>{SRC.map(([n, u]) => <li key={u}><Ext href={u}>{n}</Ext></li>)}</ul>
        </div>
      </footer>
    </>
  );
}
