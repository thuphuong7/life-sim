import type { Day, LootItem, QTab, Quest } from '../types';
import content from './content.json';

// Everything personal lives in src/data. Replace this file and content.json to make the game yours.

export const PLAYER = 'Phương';
export const BIRTH = new Date(2004, 10, 7);
export const PERMIT = new Date(2029, 2, 6);
/** First baker shift; CEC hours count from here. */
export const START = new Date(2026, 11, 8);
/** The daily schedule and weekly challenges start on Monday 30/11/2026 (French phase 0). */
export const PLAN_START = '2026-11-30';
export const CEC_H = 1560;
/** The claude.ai link of the live game, used for the phone shortcut. */
export const APP_URL = 'https://claude.ai/artifact/PNGegPGqUGvEE5rYMCobvE';
export const CASH_GOAL = 800000;
export const CASH_BY = new Date(2041, 10, 1);

export const QUESTS = content.QUESTS as unknown as Quest[];
export const LOOT = content.LOOT as unknown as LootItem[];
export const TREE = content.TREE as unknown as { b: string; n: [string, 'have' | 'grow' | 'next', number][] }[];
export const SRC = content.SRC as unknown as [string, string][];
/** [name, detail, earned (1/0), quest id that unlocks it] */
export const ACH = content.ACH as unknown as [string, string, number, string?][];

export const TABS: [QTab, string][] = [['main', 'Chính'], ['side', 'Kỹ năng'], ['biz', 'Quầy bánh mì'], ['life', 'Đời sống']];
/** 28 h/week assumes the extra Friday half shift. */
export const DEFAULT_SET = { teerPlan: 28, frPlan: 9.5, frNeed: 600, saved: 0, monthly: 0, rate: 0, newPerDay: 30 };

/** CRS estimates from Kế hoạch v1.3 against the 2026 draw cut-offs. */
export const CRS = {
  min: 350, max: 560,
  bands: [[391, 435, 'var(--tbg)', 'Đợt rút nhóm tiếng Pháp 2026: 391–435'], [507, 523, 'var(--redbg)', 'Đợt rút CEC 2026: 507–523']] as [number, number, string, string][],
  dots: [[386, 'var(--lock)', 'Không có tiếng Pháp: ~386'], [448, 'var(--teal)', 'NCLC 7 + IELTS hiện tại: ~448'], [487, 'var(--red)', 'NCLC 7 + CLB 9: ~487']] as [number, string, string][],
};

const RFI = 'https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/';
const TV5 = 'https://apprendre.tv5monde.com/fr';
const LT = 'https://languagetool.org/fr';
const MAURIL = 'https://mauril.ca/';
const TANDEM = 'https://www.tandem.net/';
const ANKI = 'https://apps.ankiweb.net/';
const INNER = 'https://innerfrench.com/';
const KWIZIQ = 'https://french.kwiziq.com/';

/** One week: about 9.5 hours of French, spread over seven days. */
export const WEEK: Day[] = [
  { d: 'Thứ 2', tag: 'Cả ngày rảnh', wd: [1], s: [
    { t: '09:00', n: 'Học lái xe (tháng 12), BC Newcomer hoặc WorkBC', k: 'life' },
    { t: '11:00', id: 'mo-gv', n: 'Ngữ pháp: 1 chủ điểm và bài tập, rồi gập sách tự kiểm tra 10 phút', k: 'fr', sk: 'gv', min: 60, u: KWIZIQ, app: 'Kwiziq' },
    { t: '12:15', id: 'mo-ce', n: 'Đọc hiểu: 1 bài TV5MONDE, tóm tắt 3 câu', k: 'fr', sk: 'ce', min: 45, u: TV5, app: 'TV5MONDE' },
    { t: '14:30', id: 'mo-ee', n: 'Viết 1 tâche TCF, sửa bằng LanguageTool rồi nhờ Claude chấm', k: 'fr', sk: 'ee', min: 60, u: LT, app: 'LanguageTool' },
    { t: '16:00', n: 'Đi chợ, nấu ăn cả tuần', k: 'life' },
    { t: '19:00', id: 'mo-co', n: 'Nghe nhẹ: 1 tập InnerFrench', k: 'fr', sk: 'co', min: 30, u: INNER, app: 'InnerFrench' },
    { t: '20:30', n: 'Lên giường (mai ca 5:00)', k: 'rest' },
  ] },
  { d: 'Thứ 3–5', tag: 'Ca JJ Bean', wd: [2, 3, 4], s: [
    { t: '03:45', n: 'Dậy, sang North Van', k: 'life' },
    { t: '05:00', n: 'Làm bánh tới 13:00 (giờ CEC)', k: 'work' },
    { t: '13:15', id: 'tt-co', n: 'Trên đường về: Journal en français facile, nghe lần 2 với transcript', k: 'fr', sk: 'co', min: 25, u: RFI, app: 'RFI' },
    { t: '15:00', id: 'tt-gv', n: 'Từ vựng 20 phút trên Anki, rồi 1 video Mauril', k: 'fr', sk: 'gv', min: 40, u: MAURIL, app: 'Mauril' },
    { t: '15:45', n: 'Nhiệm vụ nhẹ: 1 bài Coursera hoặc LinkedIn; gym 2 buổi trong tuần', k: 'life' },
    { t: '20:30', n: 'Lên giường', k: 'rest' },
  ] },
  { d: 'Thứ 6', tag: 'Ca JJ Bean nếu được xếp thêm, xong lúc 13:00', wd: [5], s: [
    { t: 'Sáng', n: 'Ca làm bánh nếu JJ Bean xếp thêm thứ 6, xong lúc 13:00 (giờ CEC)', k: 'work' },
    { t: '13:15', id: 'fr-co', n: 'Trên đường về: Journal en français facile, nghe lần 2 với transcript', k: 'fr', sk: 'co', min: 25, u: RFI, app: 'RFI' },
    { t: '15:00', id: 'fr-eo', n: 'Nói: 3 phần EO, ghi âm rồi nghe lại; hoặc 1 buổi Tandem hay gia sư', k: 'fr', sk: 'eo', min: 45, u: TANDEM, app: 'Tandem' },
    { t: '16:00', id: 'fr-gv', n: 'Ôn sổ lỗi và các chủ điểm đến hạn ôn', k: 'fr', sk: 'gv', min: 30 },
    { t: '20:30', n: 'Lên giường sớm', k: 'rest' },
  ] },
  { d: 'Thứ 7–CN', tag: 'Ca barista', wd: [6, 0], s: [
    { t: 'Giờ nghỉ', id: 'we-gv', n: 'Flashcard tiếng Pháp 15 phút', k: 'fr', sk: 'gv', min: 15, u: ANKI, app: 'Anki' },
    { t: 'Tối', id: 'we-co', n: 'Podcast tiếng Pháp 30 phút; tối CN ghi giờ tuần vào bảng', k: 'fr', sk: 'co', min: 30, u: INNER, app: 'InnerFrench' },
  ] },
];

/** Weekdays before the first JJ Bean shift: the free Monday plan, without the early-night reminder. */
export const FREE_DAY: Day = {
  d: 'Ngày rảnh', tag: 'Chưa đi làm, ca JJ Bean bắt đầu thứ 3, 08/12', wd: [],
  s: WEEK[0].s.filter((b) => b.k !== 'rest'),
};

/** Route board. `d`: a fixed label, or 'today' / 'cec' / 'fr' for dates the game computes. "|" breaks a title. */
export const STATIONS: { id: string; t: string; d: string; far?: boolean }[] = [
  { id: 'now', t: 'Hôm nay', d: 'today' },
  { id: 'm1', t: 'Ca đầu JJ Bean', d: '08/12/2026' },
  { id: 'm3', t: 'CELPIP', d: 'trước 05/2027' },
  { id: 'm5', t: 'NCLC 7 (TCF)', d: 'fr' },
  { id: 'm6', t: '1.560 giờ CEC', d: 'cec' },
  { id: 'm8', t: 'ITA, nộp PR', d: '2028' },
  { id: 'm9', t: 'Thường trú', d: 'trước 03/2029' },
  { id: 'm10', t: 'Quốc tịch', d: '~2030–31' },
  { id: 'w30', t: 'Working|holiday ≤ 30', d: 'tới 11/2035', far: true },
  { id: 'w35', t: 'Working|holiday ≤ 35', d: 'tới 11/2040', far: true },
];

export const GMQ = [
  'Bài test đầu vào tiếng Pháp cho ra trình độ nào (A1, A2, B1 hay B2)?',
  'JJ Bean đã chốt nửa ca thứ 6 chưa, và ca bắt đầu lúc mấy giờ?',
  'Ca barista cuối tuần là mấy giờ, và bạn có giữ nó khi bắt đầu JJ Bean không?',
  'Bạn dùng iPhone hay Android? Pop-up đã cài chưa, một ngày nó bật bao nhiêu lần?',
  'Luyện nói: bạn muốn Tandem miễn phí, gia sư italki hay nhóm nói ở Alliance Française?',
  'Tuần này chủ điểm ngữ pháp nào làm bạn sai nhiều nhất?',
  'Bạn đi North Van lúc 4 giờ sáng bằng gì, và mấy giờ thì ngủ được?',
  'Tiền tiết kiệm hiện tại là bao nhiêu, và mỗi tháng bạn dành được bao nhiêu?',
];

export const RULES = [
  'Học xong một phần thì gập sách, tự kiểm tra 10 phút rồi mới xem lại đáp án.',
  'Chia nhỏ ra nhiều ngày: 3 buổi × 30 phút tốt hơn 1 buổi 90 phút.',
  'Trước khi trả tiền cho khoá nào, tìm bản miễn phí hoặc có tài trợ trước.',
  'Ưu tiên kỹ năng cần tay nghề và xử lý tại chỗ (làm bánh, chăm sóc): khó bị máy thay thế và mang đi nước nào cũng dùng được.',
  'Mỗi lỗi sai là một điểm kinh nghiệm: ghi vào sổ lỗi, thứ 6 ôn lại.',
  'Ngủ là chỉ số máu: đêm trước ca 5:00 thì lên giường sớm.',
];
