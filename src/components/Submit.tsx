import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Entry, Kind, Pending, Skill } from '../types';
import { SKILLS } from '../data/french';
import { today } from '../lib/dates';

/** Only plain web links are kept as proof links. */
export const safeUrl = (u: string) => (/^https?:\/\/\S+\.\S+/i.test(u.trim()) ? u.trim() : '');

const HINT: Record<Kind, string> = {
  quest: 'Ví dụ: Đã thi xong MarketSafe ngày 27/11, đạt 92%, mã chứng chỉ …',
  ch: 'Ví dụ: Viết bài Tâche 3 về làm việc từ xa, Claude chấm 11/20, sai 3 lỗi subjonctif',
  blk: 'Ví dụ: Nghe bản tin RFI ngày 27/11, ghi 5 từ mới: la grève, le loyer…',
  min: 'Ví dụ: Xem 1 tập Easy French về giá nhà ở Paris, ghi 6 từ mới',
};

/** Completing anything goes through this dialog: proof first, XP only after confirming. */
export function Submit({ p, onCancel, onConfirm }: { p: Pending; onCancel: () => void; onConfirm: (e: Entry) => void }) {
  const [proof, setProof] = useState('');
  const [link, setLink] = useState('');
  const [d, setD] = useState(p.d ?? today());
  const [min, setMin] = useState(p.min != null ? String(p.min) : '');
  const [sk, setSk] = useState<Skill>(p.sk ?? 'co');
  const box = useRef<HTMLTextAreaElement>(null);
  const cancel = useRef(onCancel);
  cancel.current = onCancel;
  useEffect(() => {
    box.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') cancel.current(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  const timed = p.kind === 'blk' || p.kind === 'min';
  const minutes = Math.max(0, Math.round(Number(min) || 0));
  const xp = timed ? Math.round(minutes / 6) : p.xp; // French study: 10 XP per hour
  const url = safeUrl(link);
  const ok = (proof.trim().length >= 15 || !!url) && (!timed || minutes > 0) && !!d && d <= today();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const skill = p.kind === 'min' ? sk : p.sk;
    onConfirm({
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      d, at: new Date().toISOString(), kind: p.kind, ref: p.kind === 'min' ? sk : p.ref, title: p.title, xp,
      proof: proof.trim(), link: url,
      ...(timed && skill ? { sk: skill, min: minutes } : {}),
      ...(p.wk ? { wk: p.wk } : {}),
    });
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sub-h" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <form className="sheet" onSubmit={submit}>
        <h2 id="sub-h">Nộp bằng chứng</h2>
        <p className="lead">{p.title}</p>
        <div className="fields">
          {timed && (
            <label>Số phút<input type="number" min={1} max={600} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} required /></label>
          )}
          {p.kind === 'min' && (
            <label>Kỹ năng
              <select value={sk} onChange={(e) => setSk(e.target.value as Skill)}>
                {(Object.keys(SKILLS) as Skill[]).map((k) => <option key={k} value={k}>{SKILLS[k].vi}</option>)}
              </select>
            </label>
          )}
          <label>Ngày hoàn thành<input type="date" value={d} max={today()} onChange={(e) => setD(e.target.value)} required /></label>
          <label className="span-all">Bằng chứng: bạn đã làm gì, kết quả ra sao
            <textarea ref={box} rows={3} value={proof} onChange={(e) => setProof(e.target.value)} placeholder={HINT[p.kind]} />
          </label>
          <label className="span-all">Link bằng chứng, nếu có (ảnh, chứng chỉ, email…)
            <input type="text" inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
          </label>
        </div>
        <p className="small">Cần ít nhất 15 ký tự mô tả, hoặc một link bắt đầu bằng https://. XP chỉ được cộng khi bạn xác nhận: <b>+{xp} XP</b>.</p>
        <div className="acts">
          <button type="submit" className="btn" disabled={!ok}>Xác nhận hoàn thành</button>
          <button type="button" className="btn ghost" onClick={onCancel}>Huỷ</button>
        </div>
      </form>
    </div>
  );
}
