import { useState } from 'react';

/** Two-step undo, so a stray tap never removes a completion. */
export function RevertButton({ onRevert }: { onRevert: () => void }) {
  const [sure, setSure] = useState(false);
  if (!sure) {
    return <button type="button" className="btn ghost sm" onClick={() => setSure(true)}>Hoàn tác</button>;
  }
  return (
    <span className="sure" role="group" aria-label="Xác nhận hoàn tác">
      <span className="small">Đưa việc này về chưa xong và trừ XP?</span>
      <button type="button" className="btn danger sm" onClick={onRevert}>Hoàn tác</button>
      <button type="button" className="btn ghost sm" onClick={() => setSure(false)}>Giữ lại</button>
    </span>
  );
}
