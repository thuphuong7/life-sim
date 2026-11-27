export const DAY = 864e5;
const pad = (n: number) => String(n).padStart(2, '0');

export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
export const weekKey = (d = new Date()) => isoDate(mondayOf(d));
export const today = () => isoDate(new Date());

export const fmtDMY = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
export const fmtDM = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
export const fmtMY = (d: Date) => `${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
export const daysUntil = (d: Date) => Math.ceil((d.getTime() - Date.now()) / DAY);
export const monthsUntil = (d: Date, from = new Date()) =>
  Math.max(1, (d.getFullYear() - from.getFullYear()) * 12 + d.getMonth() - from.getMonth());

export const WEEKDAY = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

/** Whole weeks since Monday 30/11/2026; rotates the weekly challenges. */
export const weekIndex = (d = new Date()) =>
  Math.round((mondayOf(d).getTime() - new Date(2026, 10, 30).getTime()) / (7 * DAY));
