import type { Skill, TestId } from '../types';

export const SKILLS: Record<Skill, { n: string; vi: string }> = {
  co: { n: 'CO', vi: 'Nghe' },
  ce: { n: 'CE', vi: 'Đọc' },
  ee: { n: 'EE', vi: 'Viết' },
  eo: { n: 'EO', vi: 'Nói' },
  gv: { n: 'G/V', vi: 'Ngữ pháp, từ vựng' },
};

export const FEI = 'https://www.france-education-international.fr/test/tcf-canada';
export const FEI_SAMPLES = 'https://www.france-education-international.fr/test/exemples-epreuves-tcf?langue=fr';

/** Format from France Éducation international; targets are NCLC 7 from IRCC's table. */
export const TESTS: { id: TestId; fr: string; vi: string; fmt: string; need: number; max: number }[] = [
  { id: 'co', fr: 'Compréhension orale', vi: 'Nghe', fmt: '39 câu trắc nghiệm, 35 phút. Mỗi bài nghe chỉ phát một lần, câu khó dần.', need: 458, max: 699 },
  { id: 'ce', fr: 'Compréhension écrite', vi: 'Đọc', fmt: '39 câu trắc nghiệm, 60 phút, câu khó dần.', need: 453, max: 699 },
  { id: 'ee', fr: 'Expression écrite', vi: 'Viết', fmt: '3 bài viết trong 60 phút, chấm trên 20.', need: 10, max: 20 },
  { id: 'eo', fr: 'Expression orale', vi: 'Nói', fmt: '3 phần, 12 phút nói trực tiếp với giám khảo (có 2 phút chuẩn bị), chấm trên 20.', need: 10, max: 20 },
];

/** IRCC equivalency for TCF Canada: [lowest score, NCLC level]. */
const NCLC: Record<TestId, [number, number][]> = {
  ce: [[549, 10], [524, 9], [499, 8], [453, 7], [406, 6], [375, 5], [342, 4]],
  co: [[549, 10], [523, 9], [503, 8], [458, 7], [398, 6], [369, 5], [331, 4]],
  ee: [[16, 10], [14, 9], [12, 8], [10, 7], [7, 6], [6, 5], [4, 4]],
  eo: [[16, 10], [14, 9], [12, 8], [10, 7], [7, 6], [6, 5], [4, 4]],
};
/** NCLC level for a score: 0 means below NCLC 4, null means no score. */
export function nclcOf(k: TestId, score: number | null): number | null {
  if (score == null || Number.isNaN(score)) return null;
  for (const [min, lv] of NCLC[k]) if (score >= min) return lv;
  return 0;
}
export const fmtNclc = (lv: number | null) => (lv == null ? '–' : lv === 0 ? 'dưới 4' : `NCLC ${lv}`);

export const EE_TASKS = [
  { t: 'Tâche 1', d: 'Viết một tin nhắn để mô tả, kể hoặc giải thích, gửi cho một hay nhiều người (60–120 từ).', tip: 'Ví dụ: mời bạn bè tới tiệc, kể về một ngày làm việc ở lò bánh.' },
  { t: 'Tâche 2', d: 'Viết một bài báo, blog hoặc thư cho nhiều người đọc, kể lại một trải nghiệm hay sự kiện kèm nhận xét (120–150 từ).', tip: 'Dùng passé composé cho hành động, imparfait cho bối cảnh, thêm cảm nhận của bạn.' },
  { t: 'Tâche 3', d: 'Đọc 2 đoạn có quan điểm trái ngược về một vấn đề xã hội, tóm tắt hai quan điểm rồi nêu ý kiến của bạn (120–180 từ).', tip: 'Nhiều sách luyện chia khoảng 40–60 từ tóm tắt và 80–120 từ ý kiến. Đây là chỗ từ nối và subjonctif ăn điểm.' },
];
export const EO_TASKS = [
  { t: 'Tâche 1 · 2 phút, không chuẩn bị', d: 'Giám khảo hỏi về bạn: gia đình, công việc, sở thích, dự định.', tip: 'Soạn sẵn 2 phút về bản thân và nghề làm bánh, rồi luyện tới khi nói trôi.' },
  { t: 'Tâche 2 · 5 phút 30, có 2 phút chuẩn bị', d: 'Đóng vai: bạn đặt câu hỏi để lấy thông tin trong một tình huống đời thường (thuê nhà, đăng ký lớp, mua vé…).', tip: 'Luyện đủ kiểu câu hỏi và câu lịch sự: « Je voudrais savoir si… », « Est-ce qu’il serait possible de… ».' },
  { t: 'Tâche 3 · 4 phút 30, không chuẩn bị', d: 'Nêu và bảo vệ quan điểm của bạn về một câu hỏi giám khảo chọn.', tip: 'Khung 4 bước: ý kiến, 2 lý do có ví dụ, một phản biện, kết luận.' },
];

export type Level = 'A2' | 'B1' | 'B2';
export const GRAMMAR: { id: string; lv: Level; fr: string; vi: string; use: string[] }[] = [
  { id: 'g01', lv: 'A2', fr: 'Présent des verbes irréguliers', vi: 'Hiện tại của être, avoir, aller, faire, pouvoir, vouloir, devoir, prendre, venir', use: ['EO1'] },
  { id: 'g02', lv: 'A2', fr: 'Passé composé avec avoir ou être', vi: 'Quá khứ kép, chọn trợ động từ', use: ['EE2', 'EO1'] },
  { id: 'g03', lv: 'A2', fr: 'Imparfait et passé composé', vi: 'Kể chuyện: bối cảnh và hành động', use: ['EE2', 'EO1'] },
  { id: 'g04', lv: 'A2', fr: 'Futur proche et futur simple', vi: 'Nói về kế hoạch', use: ['EE1', 'EO1'] },
  { id: 'g05', lv: 'A2', fr: 'Articles définis, indéfinis et partitifs', vi: 'le, un, du; « de » sau phủ định', use: ['EE1'] },
  { id: 'g06', lv: 'A2', fr: 'Pronoms COD, COI, y et en', vi: 'Đại từ bổ ngữ', use: ['EO2', 'EE1'] },
  { id: 'g07', lv: 'A2', fr: 'Comparatif et superlatif', vi: 'So sánh hơn, nhất', use: ['EE3', 'EO3'] },
  { id: 'g08', lv: 'A2', fr: 'La négation', vi: 'ne… pas, plus, jamais, rien, personne, que', use: ['EO1'] },
  { id: 'g09', lv: 'A2', fr: 'Poser des questions', vi: 'est-ce que, đảo ngữ, từ để hỏi', use: ['EO2'] },
  { id: 'g10', lv: 'A2', fr: 'Prépositions de lieu et de temps', vi: 'à, en, au; depuis, il y a, pendant, dans', use: ['EE1', 'EO1'] },
  { id: 'g11', lv: 'B1', fr: 'Pronoms relatifs qui, que, dont, où', vi: 'Mệnh đề quan hệ', use: ['EE2', 'EE3'] },
  { id: 'g12', lv: 'B1', fr: 'Plus-que-parfait', vi: 'Quá khứ của quá khứ', use: ['EE2'] },
  { id: 'g13', lv: 'B1', fr: 'Conditionnel présent', vi: 'Lịch sự, gợi ý, mong muốn', use: ['EO2', 'EE1'] },
  { id: 'g14', lv: 'B1', fr: 'Hypothèse avec si', vi: 'si + présent, si + imparfait', use: ['EO3', 'EE3'] },
  { id: 'g15', lv: 'B1', fr: 'Subjonctif présent', vi: 'il faut que, vouloir que, cảm xúc', use: ['EE3', 'EO3'] },
  { id: 'g16', lv: 'B1', fr: 'Exprimer son opinion', vi: 'je pense que + indicatif; je ne pense pas que + subjonctif', use: ['EE3', 'EO3'] },
  { id: 'g17', lv: 'B1', fr: 'Cause et conséquence', vi: 'parce que, puisque, grâce à, donc, c’est pourquoi', use: ['EE3', 'EO3'] },
  { id: 'g18', lv: 'B1', fr: 'Opposition et concession', vi: 'mais, pourtant, alors que, même si, bien que', use: ['EE3', 'EO3'] },
  { id: 'g19', lv: 'B1', fr: 'Discours rapporté au présent', vi: 'Il dit que…, il demande si…', use: ['CO', 'EE3'] },
  { id: 'g20', lv: 'B1', fr: 'Gérondif', vi: 'en + -ant', use: ['EE2'] },
  { id: 'g21', lv: 'B1', fr: 'Pronoms démonstratifs et possessifs', vi: 'celui-ci, le mien', use: ['EE3'] },
  { id: 'g22', lv: 'B1', fr: 'Double pronom', vi: 'Thứ tự: me le, le lui, y en', use: ['EO2'] },
  { id: 'g23', lv: 'B2', fr: 'Conditionnel passé et si + plus-que-parfait', vi: 'Tiếc nuối, giả định trong quá khứ', use: ['EO3', 'EE2'] },
  { id: 'g24', lv: 'B2', fr: 'Subjonctif après les conjonctions', vi: 'pour que, avant que, à moins que, bien que', use: ['EE3'] },
  { id: 'g25', lv: 'B2', fr: 'Pronoms relatifs composés', vi: 'lequel, auquel, duquel', use: ['EE3'] },
  { id: 'g26', lv: 'B2', fr: 'Voix passive', vi: 'Câu bị động', use: ['CE', 'EE3'] },
  { id: 'g27', lv: 'B2', fr: 'Discours rapporté au passé', vi: 'Phối hợp thì khi tường thuật', use: ['EE2'] },
  { id: 'g28', lv: 'B2', fr: 'Accord du participe passé', vi: 'Hợp giống số, kể cả khi COD đứng trước', use: ['EE1', 'EE2', 'EE3'] },
  { id: 'g29', lv: 'B2', fr: 'Nominalisation et mise en relief', vi: 'Danh từ hoá; c’est… qui, ce qui… c’est', use: ['EE3'] },
  { id: 'g30', lv: 'B2', fr: 'Articulateurs du discours', vi: 'd’une part… d’autre part, en revanche, néanmoins, en somme', use: ['EE3', 'EO3'] },
];
export const learnUrl = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(`${q} exercices FLE`)}`;

export const VOCAB_TARGET = 60;
export const VOCAB: { id: string; fr: string; vi: string; use: string[] }[] = [
  { id: 'v01', fr: 'Se présenter, la famille', vi: 'Bản thân, gia đình', use: ['EO1'] },
  { id: 'v02', fr: 'Le travail et l’emploi', vi: 'Công việc', use: ['EO1', 'EO3', 'EE3'] },
  { id: 'v03', fr: 'Les études et la formation', vi: 'Học tập', use: ['EO1', 'EE2'] },
  { id: 'v04', fr: 'Le logement et la ville', vi: 'Nhà ở, thành phố', use: ['EO2', 'EE1'] },
  { id: 'v05', fr: 'Les transports', vi: 'Giao thông', use: ['CO', 'EO2'] },
  { id: 'v06', fr: 'La cuisine et la boulangerie', vi: 'Ẩm thực, làm bánh', use: ['EO1', 'EE2'] },
  { id: 'v07', fr: 'La santé et le sport', vi: 'Sức khoẻ, thể thao', use: ['CO', 'EO3'] },
  { id: 'v08', fr: 'Les voyages et les fêtes', vi: 'Du lịch, lễ hội', use: ['EE1', 'EE2'] },
  { id: 'v09', fr: 'La culture et les loisirs', vi: 'Văn hoá, giải trí', use: ['EE2', 'EO2'] },
  { id: 'v10', fr: 'Le numérique et les réseaux sociaux', vi: 'Công nghệ, mạng xã hội, AI', use: ['EE3', 'EO3'] },
  { id: 'v11', fr: 'L’environnement', vi: 'Môi trường', use: ['EE3', 'EO3'] },
  { id: 'v12', fr: 'La consommation et l’argent', vi: 'Tiêu dùng, tiền bạc', use: ['CE', 'EO3'] },
  { id: 'v13', fr: 'La société et l’immigration', vi: 'Xã hội, nhập cư, tình nguyện', use: ['EE3', 'EO3'] },
  { id: 'v14', fr: 'L’éducation et les enfants', vi: 'Giáo dục, trẻ em', use: ['EE3'] },
  { id: 'v15', fr: 'Les démarches et les services', vi: 'Thủ tục, ngân hàng, dịch vụ', use: ['CO', 'CE', 'EO2'] },
  { id: 'v16', fr: 'Les mots pour argumenter', vi: 'Từ nối, diễn đạt ý kiến', use: ['EE3', 'EO3'] },
  { id: 'v17', fr: 'Le français du Canada', vi: 'Tiếng Pháp Canada: từ và giọng', use: ['CO'] },
];
export const PRON: [string, string][] = [
  ['p1', 'Âm u và ou'], ['p2', 'Âm mũi an, on, in'], ['p3', 'Âm r'], ['p4', 'Nối âm (liaison)'], ['p5', 'Ngữ điệu câu hỏi'],
];

export const CHALLENGES: { id: string; sk: Skill; t: string; xp: number }[] = [
  { id: 'c01', sk: 'ee', t: 'Viết 1 bài Tâche 3 (120–180 từ) rồi nhờ Claude chấm theo thang 20', xp: 30 },
  { id: 'c02', sk: 'ee', t: 'Viết 1 tin nhắn Tâche 1 (60–120 từ)', xp: 15 },
  { id: 'c03', sk: 'ee', t: 'Viết 1 bài Tâche 2 (120–150 từ), kể chuyện bằng passé composé và imparfait', xp: 20 },
  { id: 'c04', sk: 'eo', t: 'Ghi âm 2 phút Tâche 1 giới thiệu bản thân, nghe lại và ghi 3 lỗi', xp: 15 },
  { id: 'c05', sk: 'eo', t: 'Tâche 2: soạn 10 câu hỏi cho một tình huống (thuê nhà, đăng ký lớp…) rồi nói to', xp: 20 },
  { id: 'c06', sk: 'eo', t: 'Tâche 3: nói 4 phút 30 nêu và bảo vệ ý kiến, có ví dụ', xp: 25 },
  { id: 'c13', sk: 'eo', t: 'Nói chuyện 30 phút với người thật (Tandem, gia sư hoặc nhóm nói)', xp: 30 },
  { id: 'c07', sk: 'co', t: 'Nghe 5 bản tin Journal en français facile', xp: 20 },
  { id: 'c08', sk: 'co', t: 'Làm 1 bài Nghe thử (39 câu, 35 phút) và ghi điểm', xp: 40 },
  { id: 'c14', sk: 'co', t: 'Xem 1 tập phim tiếng Pháp với phụ đề tiếng Pháp', xp: 15 },
  { id: 'c09', sk: 'ce', t: 'Làm 1 bài Đọc thử (39 câu, 60 phút) và ghi điểm', xp: 40 },
  { id: 'c10', sk: 'ce', t: 'Đọc 3 bài báo tiếng Pháp, tóm tắt mỗi bài 3 câu', xp: 20 },
  { id: 'c11', sk: 'gv', t: 'Học 40 từ mới của 1 chủ đề', xp: 20 },
  { id: 'c12', sk: 'gv', t: 'Ôn 10 lỗi trong sổ lỗi, viết lại câu đúng', xp: 15 },
  { id: 'c15', sk: 'gv', t: 'Học xong 2 chủ điểm ngữ pháp và làm bài tập', xp: 25 },
];
const ORDER: Skill[] = ['ee', 'eo', 'co', 'ce', 'gv'];
/** Five challenges a week, one per skill, rotating each Monday. */
export function weekChallenges(i: number) {
  return ORDER.map((sk) => {
    const list = CHALLENGES.filter((c) => c.sk === sk);
    return list[((i % list.length) + list.length) % list.length];
  });
}

export const IMMERSION: { cat: string; items: { n: string; d: string; u: string }[] }[] = [
  { cat: 'Nghe', items: [
    { n: 'Journal en français facile (RFI)', d: 'Bản tin 10 phút mỗi ngày, có transcript và bài tập.', u: 'https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/' },
    { n: 'Mauril (CBC/Radio-Canada)', d: 'App miễn phí, video tiếng Pháp Canada theo trình độ.', u: 'https://mauril.ca/' },
    { n: 'ICI Radio-Canada OHdio', d: 'Radio và podcast tiếng Pháp Canada.', u: 'https://ici.radio-canada.ca/ohdio' },
    { n: 'InnerFrench', d: 'Podcast B1–B2 nói chậm, nhiều chủ đề xã hội hợp với phần 3.', u: 'https://innerfrench.com/' },
    { n: 'Easy French (YouTube)', d: 'Phỏng vấn người thật trên phố, có phụ đề.', u: 'https://www.youtube.com/@EasyFrench' },
  ] },
  { cat: 'Đọc', items: [
    { n: 'TV5MONDE Apprendre le français', d: 'Bài đọc và nghe theo trình độ A1–B2, miễn phí.', u: 'https://apprendre.tv5monde.com/fr' },
    { n: 'RFI: hiểu tin tức, trình độ B1', d: 'Bài đọc và nghe có câu hỏi.', u: 'https://francaisfacile.rfi.fr/fr/comprendre-actualit%C3%A9-fran%C3%A7ais/b1/' },
    { n: 'Radio-Canada Info', d: 'Tin tức Canada; mỗi ngày đọc 1 bài.', u: 'https://ici.radio-canada.ca/info' },
  ] },
  { cat: 'Viết', items: [
    { n: 'LanguageTool', d: 'Bắt lỗi chính tả và ngữ pháp tiếng Pháp; bản miễn phí đủ dùng.', u: 'https://languagetool.org/fr' },
    { n: 'Bonpatron', d: 'Sửa lỗi tiếng Pháp, giải thích từng lỗi.', u: 'https://bonpatron.com/' },
    { n: 'Claude', d: 'Dán bài và nhờ chấm theo thang 0–20 của TCF, rồi ghi lỗi vào sổ.', u: 'https://claude.ai/new' },
  ] },
  { cat: 'Nói', items: [
    { n: 'Tandem', d: 'Trao đổi ngôn ngữ miễn phí với người nói tiếng Pháp.', u: 'https://www.tandem.net/' },
    { n: 'italki', d: 'Gia sư cộng đồng; chọn người có kinh nghiệm luyện TCF.', u: 'https://www.italki.com/' },
    { n: 'Alliance Française Vancouver', d: 'Lớp học, câu lạc bộ và sự kiện tiếng Pháp.', u: 'https://www.alliancefrancaise.ca/' },
  ] },
  { cat: 'Từ vựng và ngữ pháp', items: [
    { n: 'Anki', d: 'Flashcard lặp lại ngắt quãng; miễn phí trên máy tính và Android.', u: 'https://apps.ankiweb.net/' },
    { n: 'Kwiziq French', d: 'Bài kiểm tra ngữ pháp ngắn theo trình độ.', u: 'https://french.kwiziq.com/' },
    { n: 'Le Point du FLE', d: 'Rất nhiều bài tập ngữ pháp miễn phí theo chủ điểm.', u: 'https://www.lepointdufle.net/' },
    { n: 'Reverso Context', d: 'Tra từ trong câu thật.', u: 'https://context.reverso.net/' },
  ] },
  { cat: 'Đề TCF', items: [
    { n: 'Đề mẫu chính thức (France Éducation international)', d: 'Đề mẫu của chính đơn vị ra đề; dùng làm bài test đầu vào.', u: FEI_SAMPLES },
    { n: 'Trang TCF Canada (FEI)', d: 'Định dạng, thời lượng, quy định ngày thi.', u: FEI },
  ] },
];

export const IMM_SETUP = [
  { id: 'i1', t: 'Đổi ngôn ngữ điện thoại sang tiếng Pháp (Canada)' },
  { id: 'i2', t: 'Theo dõi 5 tài khoản tiếng Pháp trên Instagram hoặc TikTok (Radio-Canada, TV5MONDE…)' },
  { id: 'i3', t: 'Netflix và YouTube: âm thanh và phụ đề tiếng Pháp' },
  { id: 'i4', t: 'Để Mauril, Anki và RFI ở màn hình chính' },
  { id: 'i5', t: 'Đổi Siri hoặc Google Assistant sang tiếng Pháp' },
  { id: 'i6', t: 'Cài pop-up “Có việc gấp không?” (hướng dẫn ở mục Thêm)' },
];

export const ROADMAP = [
  { id: 'p0', from: '2026-11-30', to: '2026-12-06', n: 'Giai đoạn 0: đo trình độ', d: 'Làm phần Nghe và Đọc trong đề mẫu chính thức, chọn trình độ bắt đầu ở ô bên cạnh để app tính lại ngày đạt NCLC 7.', goal: 'Biết mình đang ở A2 hay B1' },
  { id: 'p1', from: '2026-12-07', to: '2027-03-28', n: 'Giai đoạn 1: nền B1', d: 'Ôn hết A2, học 12 chủ điểm B1 và 8 chủ đề từ vựng đầu. Viết Tâche 1–2, nói Tâche 1–2.', goal: 'Đề thử đạt NCLC 5–6' },
  { id: 'p2', from: '2027-03-29', to: '2027-07-25', n: 'Giai đoạn 2: lên B2', d: 'Ngữ pháp B2 và các chủ đề xã hội. Mỗi tuần một bài Tâche 3 viết và một bài nói. Đề thử 2 tuần một lần.', goal: 'Đề thử đạt NCLC 7 ở Nghe và Đọc' },
  { id: 'p3', from: '2027-07-26', to: '2027-10-31', n: 'Giai đoạn 3: chế độ thi', d: 'Đặt lịch thi ngay đầu giai đoạn. Mỗi tuần một đề thử đủ 4 phần, chữa Viết và Nói với gia sư hoặc Claude.', goal: 'NCLC 7 cả 4 phần ở 2 đề thử liên tiếp' },
  { id: 'p4', from: '2027-11-01', to: '2027-12-15', n: 'Thi TCF Canada', d: 'Kết quả có sau khoảng 15 ngày làm việc. Nếu thiếu điểm, thi lại sau ít nhất 20 ngày.', goal: 'Có kết quả trước khi đủ 1.560 giờ (~01/2028)' },
];

/** Hours still needed to reach B2 (≈ NCLC 7), from Alliance Française's cumulative guide: A2 160–200, B1 360–400, B2 560–650. */
export const BASES = [
  { id: '', n: 'Chưa test', need: 600 },
  { id: 'A1', n: 'A1', need: 520 },
  { id: 'A2', n: 'A2', need: 420 },
  { id: 'B1', n: 'B1', need: 220 },
  { id: 'B2', n: 'B2', need: 60 },
];
