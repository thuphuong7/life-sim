/**
 * French phrase deck for the phrase card (#phrase). New cards are introduced in this order,
 * at most a few per day, then come back on an Anki-style schedule (src/lib/srs.ts).
 * Each phrase: the chunk as it is said, its meaning, when to use it, one example with its translation.
 */
export type PLevel = 'A2' | 'B1' | 'B2';
export interface Phrase {
  id: string;
  /** the phrase, as it is said */
  fr: string;
  /** meaning in Vietnamese */
  vi: string;
  /** when to use it, register, what follows it */
  ctx: string;
  /** one example sentence */
  ex: string;
  exVi: string;
  lv: PLevel;
  tag: string;
  /** parts of the example to show in bold, separated by | */
  hl: string;
}

type Row = [fr: string, vi: string, ctx: string, ex: string, exVi: string, lv: PLevel, tag: string, hl: string];

const ROWS: Row[] = [
  // 1
  ['à mon avis', 'theo tôi, theo ý tôi', 'Mở đầu khi nêu ý kiến riêng; rất hay dùng ở Nói và Viết Tâche 3. Đừng nói « à mon avis, je pense que » trong cùng một câu.', 'À mon avis, le télétravail est pratique, mais il isole un peu.', 'Theo tôi, làm việc từ xa tiện, nhưng hơi cô lập.', 'B1', 'Nêu ý kiến', 'À mon avis'],
  ['avoir besoin de', 'cần (cái gì, làm gì)', 'Theo sau là danh từ hoặc động từ nguyên mẫu: j’ai besoin d’aide, j’ai besoin de dormir. Trước nguyên âm, « de » thành « d’ ».', 'J’ai besoin de dormir tôt parce que je commence à cinq heures.', 'Tôi cần ngủ sớm vì tôi bắt đầu làm lúc 5 giờ.', 'A2', 'Đời sống', 'J’ai besoin de'],
  ['par contre', 'ngược lại, còn … thì', 'Nối hai ý trái nhau, hay dùng khi nói. Khi viết trang trọng thì dùng « en revanche ».', 'Le loyer est cher à Vancouver ; par contre, les salaires sont plus élevés.', 'Tiền thuê nhà ở Vancouver đắt; còn lương thì cao hơn.', 'A2', 'Nối ý', 'par contre'],
  // 2
  ['est-ce que vous pourriez', 'anh/chị có thể … được không?', 'Nhờ vả lịch sự (conditionnel), theo sau là động từ nguyên mẫu. Rất cần cho Nói Tâche 2 (đóng vai hỏi thông tin).', 'Est-ce que vous pourriez m’envoyer les horaires par courriel ?', 'Anh/chị có thể gửi giờ giấc cho tôi qua email được không?', 'A2', 'Hỏi lịch sự', 'Est-ce que vous pourriez'],
  ['être en train de', 'đang (làm gì)', 'Nhấn mạnh việc đang diễn ra ngay lúc nói. Theo sau là động từ nguyên mẫu.', 'Je suis en train de préparer les croissants, je te rappelle plus tard.', 'Mình đang làm bánh sừng bò, lát nữa mình gọi lại nhé.', 'A2', 'Đời sống', 'Je suis en train de'],
  ['c’est pourquoi', 'vì thế, đó là lý do', 'Nêu kết quả của ý vừa nói. Dùng được cả khi nói lẫn khi viết.', 'Je veux obtenir la résidence permanente ; c’est pourquoi j’apprends le français.', 'Tôi muốn có thường trú nhân; vì thế tôi học tiếng Pháp.', 'A2', 'Nối ý', 'c’est pourquoi'],
  // 3
  ['je trouve que', 'tôi thấy (rằng)', 'Nêu cảm nhận cá nhân; tự nhiên hơn « je pense que » khi nói về điều mình đã trải qua.', 'Je trouve que les gens sont très polis à Vancouver.', 'Tôi thấy người ở Vancouver rất lịch sự.', 'A2', 'Nêu ý kiến', 'Je trouve que'],
  ['venir de', 'vừa mới (làm gì)', 'venir (chia theo người) + de + động từ nguyên mẫu. Đừng nhầm với « venir de » + nơi chốn = đến từ.', 'Je viens de finir ma journée de travail.', 'Tôi vừa mới xong ngày làm việc.', 'A2', 'Thời gian', 'Je viens de'],
  ['grâce à', 'nhờ có', 'Nêu nguyên nhân tốt, theo sau là danh từ. Nguyên nhân xấu thì dùng « à cause de ».', 'Grâce à mes collègues, j’apprends vite le métier.', 'Nhờ đồng nghiệp, tôi học nghề rất nhanh.', 'B1', 'Nối ý', 'Grâce à'],
  // 4
  ['je voudrais savoir si', 'tôi muốn biết liệu …', 'Hỏi gián tiếp, lịch sự. Sau « si » là câu bình thường, không đảo chủ ngữ.', 'Je voudrais savoir si le cours est proposé le soir.', 'Tôi muốn biết lớp học có mở buổi tối không.', 'B1', 'Hỏi lịch sự', 'Je voudrais savoir si'],
  ['avoir l’habitude de', 'có thói quen, quen (làm gì)', 'Theo sau là động từ nguyên mẫu. « J’ai l’habitude » đứng một mình nghĩa là: tôi quen rồi.', 'J’ai l’habitude de me lever à quatre heures, ce n’est plus difficile.', 'Tôi quen dậy lúc 4 giờ rồi, không còn khó nữa.', 'A2', 'Đời sống', 'J’ai l’habitude de'],
  ['à cause de', 'vì, do (nguyên nhân xấu)', 'Nêu nguyên nhân tiêu cực, theo sau là danh từ. Nguyên nhân tốt dùng « grâce à ».', 'Le SkyTrain est en retard à cause de la neige.', 'SkyTrain bị trễ vì tuyết.', 'A2', 'Nối ý', 'à cause de'],
  // 5
  ['il me semble que', 'tôi có cảm giác là, hình như', 'Nêu ý kiến nhẹ nhàng, không khẳng định mạnh; lịch sự khi tranh luận.', 'Il me semble que les loyers ont encore augmenté cette année.', 'Hình như năm nay tiền thuê nhà lại tăng nữa.', 'B1', 'Nêu ý kiến', 'Il me semble que'],
  ['avoir du mal à', 'khó khăn khi, vất vả mới (làm được gì)', 'Theo sau là động từ nguyên mẫu. Rất hay dùng khi kể trải nghiệm (Viết Tâche 2, Nói Tâche 3).', 'Au début, j’avais du mal à comprendre l’accent québécois.', 'Lúc đầu, tôi rất khó hiểu giọng Québec.', 'B1', 'Đời sống', 'j’avais du mal à'],
  ['au lieu de', 'thay vì', 'Theo sau là danh từ hoặc động từ nguyên mẫu.', 'Au lieu de regarder mon téléphone, j’écoute un podcast en français.', 'Thay vì xem điện thoại, tôi nghe một podcast tiếng Pháp.', 'B1', 'Nối ý', 'Au lieu de'],
  // 6
  ['pourriez-vous me dire', 'anh/chị có thể cho tôi biết …', 'Câu hỏi rất lịch sự (đảo chủ ngữ). Theo sau là où, quand, combien, si…', 'Pourriez-vous me dire où se trouve le bureau de Service Canada ?', 'Anh/chị có thể cho tôi biết văn phòng Service Canada ở đâu không?', 'B1', 'Hỏi lịch sự', 'Pourriez-vous me dire'],
  ['se rendre compte que', 'nhận ra rằng', 'Khoảnh khắc hiểu ra điều gì. Ở quá khứ: je me suis rendu compte que (không thêm e, kể cả người nói là nữ).', 'Je me suis rendu compte que je comprenais presque tout le podcast.', 'Tôi nhận ra là mình hiểu gần hết cả podcast.', 'B1', 'Đời sống', 'Je me suis rendu compte que'],
  ['de plus', 'hơn nữa', 'Thêm một lý do cùng chiều. Viết trang trọng hơn thì dùng « en outre ».', 'Ce travail est près de chez moi ; de plus, les horaires me conviennent.', 'Công việc này gần nhà tôi; hơn nữa, giờ giấc hợp với tôi.', 'B1', 'Nối ý', 'de plus'],
  // 7
  ['je suis d’accord avec', 'tôi đồng ý với', 'Theo sau là người hoặc ý kiến. Đồng ý một phần: je suis plutôt d’accord.', 'Je suis d’accord avec toi : il faut pratiquer tous les jours.', 'Mình đồng ý với bạn: phải luyện mỗi ngày.', 'A2', 'Nêu ý kiến', 'Je suis d’accord avec'],
  ['prendre rendez-vous', 'đặt lịch hẹn', 'Dùng với bác sĩ, ngân hàng, văn phòng chính phủ: prendre rendez-vous chez le médecin, avec quelqu’un.', 'Je dois prendre rendez-vous chez le dentiste la semaine prochaine.', 'Tuần sau tôi phải đặt lịch hẹn nha sĩ.', 'A2', 'Thủ tục', 'prendre rendez-vous'],
  ['pourtant', 'thế nhưng, vậy mà', 'Diễn tả điều trái với mong đợi; thường đứng đầu câu hoặc sau động từ.', 'J’ai bien dormi ; pourtant, je suis encore fatiguée.', 'Tôi đã ngủ ngon; vậy mà vẫn còn mệt.', 'B1', 'Nối ý', 'pourtant'],
  // 8
  ['ça vous dérange si', 'anh/chị có phiền không nếu …', 'Xin phép lịch sự. Sau « si » dùng thì hiện tại.', 'Ça vous dérange si j’ouvre la fenêtre ?', 'Anh/chị có phiền không nếu tôi mở cửa sổ?', 'A2', 'Hỏi lịch sự', 'Ça vous dérange si'],
  ['avoir envie de', 'muốn, thèm (làm gì, cái gì)', 'Mong muốn tự nhiên, thân mật hơn « vouloir ». Theo sau là danh từ hoặc động từ nguyên mẫu.', 'Ce soir, j’ai envie de manger un bon phở.', 'Tối nay tôi thèm ăn một tô phở ngon.', 'A2', 'Đời sống', 'j’ai envie de'],
  ['en effet', 'quả thật, thật vậy', 'Đưa ra lời giải thích hoặc bằng chứng cho câu vừa nói. Rất hữu ích ở Viết Tâche 3.', 'Le vélo est idéal ici. En effet, il y a des pistes cyclables partout.', 'Xe đạp rất hợp ở đây. Thật vậy, chỗ nào cũng có làn xe đạp.', 'B1', 'Nối ý', 'En effet'],
  // 9
  ['d’un côté… de l’autre', 'một mặt … mặt khác', 'Trình bày hai mặt của vấn đề; rất hợp với Tâche 3 (Viết và Nói).', 'D’un côté, la ville est chère ; de l’autre, il y a beaucoup d’emplois.', 'Một mặt, thành phố đắt đỏ; mặt khác, có rất nhiều việc làm.', 'B1', 'Nêu ý kiến', 'D’un côté|de l’autre'],
  ['faire la queue', 'xếp hàng', 'Cách nói ở Pháp. Ở Québec người ta hay nói « faire la file ».', 'Le samedi matin, les clients font la queue devant la boulangerie.', 'Sáng thứ bảy, khách xếp hàng trước tiệm bánh.', 'A2', 'Đời sống', 'font la queue'],
  ['même si', 'dù cho, cho dù', 'Theo sau là thì bình thường (không dùng subjonctif), khác với « bien que ». Trước « il » thành « même s’il ».', 'Même s’il pleut, je vais au travail à vélo.', 'Dù trời mưa, tôi vẫn đạp xe đi làm.', 'B1', 'Nối ý', 'Même s’'],
  // 10
  ['je vous appelle au sujet de', 'tôi gọi về việc …', 'Mở đầu cuộc gọi hoặc tin nhắn trang trọng; theo sau là danh từ.', 'Bonjour, je vous appelle au sujet de l’annonce pour l’appartement.', 'Xin chào, tôi gọi về tin đăng cho thuê căn hộ.', 'B1', 'Hỏi lịch sự', 'je vous appelle au sujet de'],
  ['avoir hâte de', 'nóng lòng, rất mong (được làm gì)', 'Thể hiện sự háo hức; theo sau là động từ nguyên mẫu.', 'J’ai hâte de commencer mon nouveau travail chez JJ Bean.', 'Tôi rất mong được bắt đầu công việc mới ở JJ Bean.', 'B1', 'Cảm xúc', 'J’ai hâte de'],
  ['par conséquent', 'do đó, vì vậy', 'Nêu hệ quả, trang trọng hơn « donc »; hợp với Viết Tâche 3.', 'Les transports sont gratuits pour les enfants ; par conséquent, les familles les utilisent davantage.', 'Phương tiện công cộng miễn phí cho trẻ em; do đó các gia đình dùng nhiều hơn.', 'B2', 'Nối ý', 'par conséquent'],
  // 11
  ['pour ma part', 'về phần tôi', 'Đưa ra ý kiến riêng sau khi đã nêu ý người khác; hay dùng ở Tâche 3.', 'Certains préfèrent la ville ; pour ma part, je préfère la campagne.', 'Có người thích thành phố; về phần tôi, tôi thích nông thôn hơn.', 'B1', 'Nêu ý kiến', 'pour ma part'],
  ['être sur le point de', 'sắp sửa (làm gì)', 'Việc sắp xảy ra ngay; theo sau là động từ nguyên mẫu.', 'J’étais sur le point de partir quand mon gérant m’a appelée.', 'Tôi vừa định đi thì quản lý gọi tôi.', 'B1', 'Thời gian', 'J’étais sur le point de'],
  ['en ce qui concerne', 'về (vấn đề), liên quan đến', 'Giới thiệu chủ đề muốn nói; trang trọng, hợp với thư và bài viết.', 'En ce qui concerne le salaire, nous pouvons en discuter pendant l’entretien.', 'Về mức lương, chúng ta có thể bàn trong buổi phỏng vấn.', 'B1', 'Nối ý', 'En ce qui concerne'],
  // 12
  ['qu’est-ce que vous me conseillez ?', 'anh/chị khuyên tôi nên chọn gì?', 'Xin lời khuyên ở cửa hàng, nhà hàng, ngân hàng. Câu trả lời thường là « je vous conseille de » + động từ nguyên mẫu.', 'Je cherche un forfait pas cher. Qu’est-ce que vous me conseillez ?', 'Tôi tìm gói cước điện thoại rẻ. Anh/chị khuyên tôi chọn gì?', 'A2', 'Hỏi lịch sự', 'Qu’est-ce que vous me conseillez'],
  ['faire attention à', 'chú ý, cẩn thận với', 'Theo sau là danh từ (à + le = au). « Fais attention ! » = Cẩn thận!', 'Fais attention au four, il est très chaud.', 'Cẩn thận cái lò, nó rất nóng.', 'A2', 'Công việc', 'Fais attention au'],
  ['bien que', 'mặc dù', 'Luôn theo sau là subjonctif: bien que je sois, bien qu’il fasse. Hay dùng khi viết.', 'Bien que ce soit difficile, je continue à étudier chaque jour.', 'Mặc dù khó, tôi vẫn tiếp tục học mỗi ngày.', 'B2', 'Nối ý', 'Bien que'],
  // 13
  ['je ne suis pas du tout d’accord', 'tôi hoàn toàn không đồng ý', 'Phản đối mạnh. Nhẹ hơn: je ne suis pas tout à fait d’accord (không hoàn toàn đồng ý).', 'Je ne suis pas du tout d’accord : les réseaux sociaux ne remplacent pas les vrais amis.', 'Tôi hoàn toàn không đồng ý: mạng xã hội không thay được bạn bè thật.', 'B1', 'Nêu ý kiến', 'Je ne suis pas du tout d’accord'],
  ['ça fait… que', 'đã … rồi (tính từ lúc bắt đầu)', 'Nói một việc kéo dài tới giờ: ça fait + khoảng thời gian + que + câu ở thì hiện tại.', 'Ça fait trois ans que j’habite à Vancouver.', 'Tôi sống ở Vancouver đã ba năm rồi.', 'A2', 'Thời gian', 'Ça fait|que'],
  ['à long terme', 'về lâu dài', 'Nói về kế hoạch hoặc hậu quả lâu dài. Ngược lại: à court terme (trước mắt).', 'À long terme, je voudrais ouvrir ma propre boulangerie.', 'Về lâu dài, tôi muốn mở tiệm bánh của riêng mình.', 'B1', 'Công việc', 'À long terme'],
  // 14
  ['excusez-moi de vous déranger', 'xin lỗi đã làm phiền anh/chị', 'Mở lời lịch sự khi bắt chuyện với người lạ hoặc nhân viên.', 'Excusez-moi de vous déranger, est-ce que ce bus va au centre-ville ?', 'Xin lỗi làm phiền, xe buýt này có đi vào trung tâm không?', 'A2', 'Hỏi lịch sự', 'Excusez-moi de vous déranger'],
  ['ça ne me dérange pas', 'tôi không phiền đâu, không sao', 'Đáp lại khi ai đó xin phép hoặc đề nghị: « Ça vous dérange ? » → « Non, ça ne me dérange pas. »', 'Travailler le samedi, ça ne me dérange pas.', 'Làm thứ bảy thì tôi không ngại.', 'A2', 'Đời sống', 'ça ne me dérange pas'],
  ['en revanche', 'ngược lại, trái lại', 'Như « par contre » nhưng trang trọng hơn; nên dùng khi viết bài.', 'Le télétravail fait gagner du temps ; en revanche, il limite les échanges.', 'Làm việc từ xa tiết kiệm thời gian; trái lại, nó hạn chế giao lưu.', 'B2', 'Nối ý', 'en revanche'],
  // 15
  ['il est vrai que… mais', 'đúng là … nhưng', 'Công nhận ý kiến đối lập rồi phản bác; cấu trúc ăn điểm ở Tâche 3.', 'Il est vrai que l’avion pollue, mais il est parfois indispensable.', 'Đúng là máy bay gây ô nhiễm, nhưng đôi khi không thể thiếu.', 'B1', 'Nêu ý kiến', 'Il est vrai que|mais'],
  ['faire les courses', 'đi chợ, mua đồ ăn hằng ngày', 'Mua thực phẩm, đồ dùng hằng ngày. Mua sắm quần áo ở Québec gọi là « magasiner ».', 'Je fais les courses le lundi, quand le magasin est calme.', 'Tôi đi chợ vào thứ hai, lúc cửa hàng vắng.', 'A2', 'Đời sống', 'Je fais les courses'],
  ['afin de', 'để, nhằm (làm gì)', 'Như « pour » nhưng trang trọng hơn; theo sau là động từ nguyên mẫu.', 'Je prends des notes afin de retenir les nouveaux mots.', 'Tôi ghi chép để nhớ từ mới.', 'B1', 'Nối ý', 'afin de'],
  // 16
  ['je viens du Vietnam', 'tôi đến từ Việt Nam', 'Câu cho Nói Tâche 1 (giới thiệu bản thân). Việt Nam là giống đực: « du Vietnam »; sống ở Việt Nam là « au Vietnam ».', 'Je m’appelle Phương et je viens du Vietnam.', 'Tôi tên là Phương và tôi đến từ Việt Nam.', 'A2', 'Giới thiệu', 'je viens du Vietnam'],
  ['travailler à temps partiel', 'làm bán thời gian', 'Ngược lại: à temps plein (toàn thời gian). Hay gặp trong tin tuyển dụng.', 'Je travaille à temps partiel dans un café le week-end.', 'Tôi làm bán thời gian ở quán cà phê vào cuối tuần.', 'A2', 'Công việc', 'Je travaille à temps partiel'],
  ['c’est-à-dire', 'nghĩa là, tức là', 'Giải thích rõ hơn điều vừa nói.', 'Je travaille tôt, c’est-à-dire de cinq heures à treize heures.', 'Tôi làm sớm, tức là từ 5 giờ đến 13 giờ.', 'A2', 'Nối ý', 'c’est-à-dire'],
  // 17
  ['je suis convaincue que', 'tôi tin chắc rằng', 'Khẳng định mạnh ý kiến. Người nói là nữ viết « convaincue », nam viết « convaincu ».', 'Je suis convaincue que le français va m’ouvrir des portes.', 'Tôi tin chắc tiếng Pháp sẽ mở ra nhiều cơ hội cho tôi.', 'B1', 'Nêu ý kiến', 'Je suis convaincue que'],
  ['de temps en temps', 'thỉnh thoảng', 'Tần suất vừa phải. Thường xuyên: souvent; hiếm khi: rarement.', 'De temps en temps, je regarde un film québécois sans sous-titres.', 'Thỉnh thoảng tôi xem một phim Québec không phụ đề.', 'A2', 'Thời gian', 'De temps en temps'],
  ['d’ailleurs', 'vả lại, mà nói thêm', 'Thêm một chi tiết ủng hộ ý vừa nói; hay dùng khi trò chuyện.', 'J’adore cette boulangerie. D’ailleurs, je vais y travailler bientôt.', 'Tôi rất thích tiệm bánh này. Mà nói thêm, tôi sắp làm ở đó.', 'B1', 'Nối ý', 'D’ailleurs'],
  // 18
  ['est-ce qu’il faut réserver ?', 'có cần đặt trước không?', 'Hỏi thông tin ở Nói Tâche 2: lớp học, nhà hàng, hoạt động. Thêm « à l’avance » = trước.', 'Pour le cours de cuisine, est-ce qu’il faut réserver à l’avance ?', 'Lớp nấu ăn có cần đặt chỗ trước không?', 'A2', 'Hỏi lịch sự', 'est-ce qu’il faut réserver'],
  ['poser sa candidature', 'nộp đơn ứng tuyển', 'poser sa candidature pour un poste; ở Canada cũng hay nói « postuler ».', 'J’ai posé ma candidature pour un poste d’adjointe administrative.', 'Tôi đã nộp đơn cho vị trí trợ lý hành chính.', 'B1', 'Công việc', 'J’ai posé ma candidature'],
  ['tandis que', 'trong khi (đối lập)', 'So sánh hai việc trái ngược nhau.', 'Mon amie aime la ville, tandis que moi, je préfère la nature.', 'Bạn tôi thích thành phố, trong khi tôi lại thích thiên nhiên.', 'B1', 'Nối ý', 'tandis que'],
  // 19
  ['il vaut mieux', 'tốt hơn là, nên', 'Khuyên nhủ; theo sau là động từ nguyên mẫu, hoặc « que » + subjonctif.', 'Il vaut mieux s’inscrire à l’examen deux mois à l’avance.', 'Tốt hơn là đăng ký thi trước hai tháng.', 'B1', 'Nêu ý kiến', 'Il vaut mieux'],
  ['se lever tôt', 'dậy sớm', 'Động từ phản thân: je me lève, tu te lèves. Ngược lại: se coucher tard (ngủ muộn).', 'Pour mon travail, je dois me lever très tôt.', 'Vì công việc, tôi phải dậy rất sớm.', 'A2', 'Đời sống', 'me lever très tôt'],
  ['en fait', 'thật ra', 'Sửa lại hoặc làm rõ một ý; rất hay nghe trong hội thoại.', 'Je pensais que c’était difficile, mais en fait, c’est assez simple.', 'Tôi tưởng khó, nhưng thật ra khá đơn giản.', 'A2', 'Nối ý', 'en fait'],
  // 20
  ['c’est compris dans le prix ?', 'có bao gồm trong giá không?', 'Hỏi chi phí ở Nói Tâche 2. Trả lời: « Oui, c’est inclus » hoặc « Non, c’est en supplément ».', 'Le matériel, c’est compris dans le prix ?', 'Dụng cụ có bao gồm trong giá không?', 'A2', 'Hỏi lịch sự', 'c’est compris dans le prix'],
  ['passer un entretien', 'đi phỏng vấn (xin việc)', 'Ở Canada hay nói « passer une entrevue ». « Passer » ở đây là trải qua, không phải thi đỗ.', 'Demain, je passe un entretien dans une clinique.', 'Ngày mai tôi đi phỏng vấn ở một phòng khám.', 'A2', 'Công việc', 'je passe un entretien'],
  ['tant mieux', 'càng tốt, may quá', 'Phản ứng vui khi nghe tin tốt. Ngược lại: tant pis (thôi đành vậy).', '— Le cours est gratuit. — Tant mieux !', '— Lớp học miễn phí. — Càng tốt!', 'A2', 'Cảm xúc', 'Tant mieux'],
  // 21
  ['il ne faut pas oublier que', 'không được quên rằng', 'Nhấn mạnh một luận điểm quan trọng khi tranh luận.', 'Il ne faut pas oublier que beaucoup d’immigrants travaillent dans la santé.', 'Không được quên rằng nhiều người nhập cư làm trong ngành y tế.', 'B1', 'Nêu ý kiến', 'Il ne faut pas oublier que'],
  ['tant pis', 'thôi đành vậy, kệ', 'Chấp nhận điều không như ý. « Tant pis pour lui » = kệ anh ta.', 'Le magasin est fermé ? Tant pis, je reviendrai demain.', 'Cửa hàng đóng rồi à? Thôi đành, mai tôi quay lại.', 'A2', 'Cảm xúc', 'Tant pis'],
  ['dès que', 'ngay khi', 'Hai việc nối tiếp nhau ngay. Nói về tương lai thì dùng thì tương lai: dès que j’aurai fini…', 'Dès que je rentre, je prends une douche et je fais une sieste.', 'Vừa về đến nhà là tôi tắm rồi ngủ trưa.', 'B1', 'Thời gian', 'Dès que'],
  // 22
  ['je n’ai pas bien compris, pouvez-vous répéter ?', 'tôi chưa hiểu rõ, anh/chị nhắc lại được không?', 'Câu cứu nguy khi nghe không kịp, dùng được cả trong bài thi Nói.', 'Pardon, je n’ai pas bien compris. Pouvez-vous répéter plus lentement ?', 'Xin lỗi, tôi chưa hiểu rõ. Anh/chị nhắc lại chậm hơn được không?', 'A2', 'Hỏi lịch sự', 'je n’ai pas bien compris|Pouvez-vous répéter'],
  ['avoir de l’expérience en', 'có kinh nghiệm về', 'Dùng trong CV, thư xin việc, phỏng vấn: de l’expérience en service à la clientèle, en administration.', 'J’ai deux ans d’expérience en service à la clientèle.', 'Tôi có hai năm kinh nghiệm chăm sóc khách hàng.', 'B1', 'Công việc', 'd’expérience en'],
  ['bref', 'tóm lại, nói chung là', 'Tóm gọn khi kể chuyện dài; thân mật. Viết trang trọng thì dùng « en somme » hoặc « pour conclure ».', 'Bref, c’était une journée fatigante mais géniale.', 'Tóm lại, đó là một ngày mệt nhưng tuyệt vời.', 'A2', 'Nối ý', 'Bref'],
  // 23
  ['ça dépend de', 'còn tuỳ vào', 'Trả lời một cách cân nhắc. Nói ngắn: « Ça dépend. »', 'Ça dépend de mon horaire, mais je peux venir samedi.', 'Còn tuỳ lịch làm của tôi, nhưng tôi có thể đến thứ bảy.', 'A2', 'Nêu ý kiến', 'Ça dépend de'],
  ['laisser lever la pâte', 'để bột nở (ủ bột)', 'Từ nghề làm bánh: lever = nở. Nhào bột là « pétrir la pâte », tạo hình là « façonner ».', 'On laisse lever la pâte pendant deux heures avant de façonner les pains.', 'Mình để bột nở hai tiếng trước khi tạo hình bánh.', 'B1', 'Làm bánh', 'laisse lever la pâte'],
  ['pour conclure', 'để kết luận', 'Mở đầu đoạn kết của bài viết hoặc phần nói. Cũng dùng: en conclusion, en somme.', 'Pour conclure, je pense que les avantages sont plus importants que les inconvénients.', 'Để kết luận, tôi nghĩ ưu điểm quan trọng hơn nhược điểm.', 'B1', 'Nối ý', 'Pour conclure'],
  // 24
  ['ça te dit de', 'bạn có muốn … không? (rủ rê)', 'Rủ bạn bè, thân mật; theo sau là động từ nguyên mẫu. Hợp với Viết Tâche 1 (tin nhắn cho bạn).', 'Ça te dit d’aller marcher à Stanley Park dimanche ?', 'Chủ nhật bạn có muốn đi dạo Stanley Park không?', 'A2', 'Rủ rê', 'Ça te dit d’'],
  ['à peu près', 'khoảng chừng, gần như', 'Số lượng hoặc mức độ ước chừng. Đồng nghĩa: environ.', 'Il faut à peu près quarante minutes pour aller à North Vancouver.', 'Đi North Vancouver mất khoảng bốn mươi phút.', 'A2', 'Đời sống', 'à peu près'],
  ['néanmoins', 'tuy nhiên, dù vậy', 'Trang trọng, dùng khi viết để đưa ra ý đối lập; gần nghĩa với « cependant ».', 'Le projet est coûteux ; néanmoins, il améliorera la vie du quartier.', 'Dự án tốn kém; tuy nhiên, nó sẽ cải thiện cuộc sống của khu phố.', 'B2', 'Nối ý', 'néanmoins'],
  // 25
  ['il serait préférable de', 'sẽ tốt hơn nếu, nên', 'Đề xuất một cách lịch sự; hợp với thư và Tâche 3. Theo sau là động từ nguyên mẫu.', 'Il serait préférable de réduire le prix des transports pour les étudiants.', 'Nên giảm giá vé đi lại cho sinh viên.', 'B2', 'Nêu ý kiến', 'Il serait préférable de'],
  ['s’installer à', 'đến sống, định cư ở', '« à » + thành phố, « au » + nước giống đực (au Canada), « en » + nước giống cái (en France).', 'Beaucoup de jeunes s’installent à Vancouver pour le travail.', 'Nhiều người trẻ đến Vancouver sinh sống vì công việc.', 'B1', 'Xã hội', 's’installent à'],
  ['au moins', 'ít nhất', 'Mức tối thiểu. Đừng nhầm với « du moins » (ít ra thì, dùng để sửa ý).', 'J’écoute au moins vingt minutes de français par jour.', 'Mỗi ngày tôi nghe tiếng Pháp ít nhất hai mươi phút.', 'A2', 'Đời sống', 'au moins'],
  // 26
  ['je vous écris pour', 'tôi viết thư này để …', 'Câu mở đầu thư hoặc email trang trọng (Viết Tâche 1); theo sau là động từ nguyên mẫu.', 'Madame, je vous écris pour avoir des renseignements sur vos cours du soir.', 'Thưa bà, tôi viết thư để hỏi thông tin về các lớp buổi tối.', 'B1', 'Viết thư', 'je vous écris pour'],
  ['faire des heures supplémentaires', 'làm thêm giờ', 'Từ hay dùng ở nơi làm việc; nói tắt thân mật: faire des heures sup.', 'Cette semaine, j’ai fait des heures supplémentaires pour Noël.', 'Tuần này tôi làm thêm giờ vì Giáng sinh.', 'B1', 'Công việc', 'fait des heures supplémentaires'],
  ['pas de souci', 'không sao đâu, không vấn đề gì', 'Đáp thân mật khi được cảm ơn hoặc xin lỗi. Trang trọng hơn: « Je vous en prie ».', '— Désolée pour le retard ! — Pas de souci.', '— Xin lỗi vì đến trễ! — Không sao đâu.', 'A2', 'Cảm xúc', 'Pas de souci'],
  // 27
  ['le pour et le contre', 'mặt lợi và mặt hại', 'Cân nhắc trước khi quyết định: peser le pour et le contre.', 'Avant de déménager, j’ai pesé le pour et le contre.', 'Trước khi chuyển nhà, tôi đã cân nhắc lợi hại.', 'B1', 'Nêu ý kiến', 'le pour et le contre'],
  ['il y a (+ thời gian)', 'cách đây', 'Với một mốc trong quá khứ: il y a deux ans = cách đây hai năm. Khác « depuis » (kéo dài tới giờ).', 'J’ai commencé le français il y a longtemps, puis j’ai arrêté.', 'Tôi bắt đầu học tiếng Pháp từ lâu rồi, rồi bỏ dở.', 'A2', 'Thời gian', 'il y a'],
  ['cependant', 'tuy nhiên', 'Đưa ra ý đối lập; dùng tốt khi viết lẫn khi nói trang trọng.', 'Les réseaux sociaux sont utiles ; cependant, ils prennent trop de temps.', 'Mạng xã hội có ích; tuy nhiên, chúng chiếm quá nhiều thời gian.', 'B1', 'Nối ý', 'cependant'],
  // 28
  ['n’hésitez pas à', 'đừng ngần ngại …', 'Lời mời lịch sự cuối thư hoặc tin nhắn; theo sau là động từ nguyên mẫu.', 'N’hésitez pas à me contacter si vous avez des questions.', 'Đừng ngần ngại liên hệ tôi nếu có câu hỏi.', 'B1', 'Viết thư', 'N’hésitez pas à'],
  ['être chargée de', 'phụ trách, được giao (việc gì)', 'Mô tả nhiệm vụ trong công việc (CV, phỏng vấn). Người nói là nữ: chargée; nam: chargé.', 'Au bureau, j’étais chargée de l’accueil et des rendez-vous.', 'Ở văn phòng, tôi phụ trách lễ tân và lịch hẹn.', 'B1', 'Công việc', 'j’étais chargée de'],
  ['quand même', 'dù sao vẫn, vẫn cứ', 'Làm điều gì bất chấp trở ngại; cũng để nhấn mạnh: c’est quand même cher !', 'Il pleuvait, mais on est sortis quand même.', 'Trời mưa, nhưng tụi mình vẫn đi chơi.', 'A2', 'Đời sống', 'quand même'],
  // 29
  ['avoir tendance à', 'có xu hướng, hay (làm gì)', 'Nói về thói quen hoặc xu hướng chung; hay dùng ở Tâche 3. Theo sau là động từ nguyên mẫu.', 'Les jeunes ont tendance à s’informer sur les réseaux sociaux.', 'Người trẻ có xu hướng cập nhật tin tức trên mạng xã hội.', 'B1', 'Nêu ý kiến', 'ont tendance à'],
  ['bienvenue !', 'không có chi! (Québec)', 'Ở Québec, « bienvenue » còn dùng để đáp lời cảm ơn, như « de rien ». Ở Pháp chỉ có nghĩa chào mừng.', '— Merci pour le café ! — Bienvenue !', '— Cảm ơn vì ly cà phê! — Không có chi!', 'A2', 'Canada', 'Bienvenue'],
  ['en outre', 'ngoài ra, hơn nữa', 'Trang trọng, dùng khi viết để thêm luận điểm. Thân mật hơn: de plus.', 'Ce programme est gratuit. En outre, il offre un stage en entreprise.', 'Chương trình này miễn phí. Ngoài ra, nó có thực tập ở công ty.', 'B2', 'Nối ý', 'En outre'],
  // 30
  ['il y a une réduction pour', 'có giảm giá cho … không?', 'Hỏi ưu đãi (sinh viên, người mới đến, nhóm); lên giọng ở cuối câu.', 'Il y a une réduction pour les étudiants ?', 'Có giảm giá cho sinh viên không?', 'A2', 'Hỏi lịch sự', 'Il y a une réduction pour'],
  ['s’adapter à', 'thích nghi với', 'Theo sau là danh từ; danh từ là l’adaptation. Chủ đề quen thuộc của TCF: nhập cư, công việc mới.', 'Je me suis vite adaptée à la vie au Canada.', 'Tôi đã nhanh chóng thích nghi với cuộc sống ở Canada.', 'B1', 'Xã hội', 'me suis vite adaptée à'],
  ['tout de suite', 'ngay lập tức', 'Làm ngay bây giờ. « À tout de suite ! » = Gặp lại ngay nhé!', 'Je réponds tout de suite à ton message.', 'Mình trả lời tin nhắn của bạn ngay.', 'A2', 'Thời gian', 'tout de suite'],
  // 31
  ['faire face à', 'đối mặt với', 'Đối diện khó khăn, thử thách; theo sau là danh từ (à + le = au).', 'Les nouveaux arrivants doivent faire face au coût élevé du logement.', 'Người mới đến phải đối mặt với giá nhà ở cao.', 'B2', 'Xã hội', 'faire face au'],
  ['magasiner', 'đi mua sắm (Québec)', 'Tiếng Pháp Canada; ở Pháp nói « faire du shopping » hoặc « faire les magasins ».', 'Samedi, on va magasiner au centre-ville ?', 'Thứ bảy mình đi mua sắm ở trung tâm nhé?', 'A2', 'Canada', 'magasiner'],
  ['donc', 'vì vậy, nên', 'Từ nối kết quả thông dụng nhất. Trang trọng hơn: par conséquent.', 'Je finis à treize heures, donc j’étudie l’après-midi.', 'Tôi xong việc lúc 13 giờ, nên tôi học vào buổi chiều.', 'A2', 'Nối ý', 'donc'],
  // 32
  ['je pense que', 'tôi nghĩ là', 'Ý kiến cơ bản. Ở thể phủ định, « je ne pense pas que » đi với subjonctif.', 'Je pense que je vais réussir le TCF l’année prochaine.', 'Tôi nghĩ năm sau tôi sẽ đậu TCF.', 'A2', 'Nêu ý kiến', 'Je pense que'],
  ['trouver un logement', 'tìm chỗ ở', 'Chủ đề hay gặp trong TCF (nhà ở). Logement = chỗ ở nói chung; ở ghép là la colocation.', 'Trouver un logement abordable à Vancouver, ce n’est pas facile.', 'Tìm được chỗ ở giá phải chăng ở Vancouver không dễ.', 'B1', 'Xã hội', 'Trouver un logement'],
  ['de nos jours', 'ngày nay', 'Mở đầu bài viết về một hiện tượng xã hội (Tâche 3). Đồng nghĩa: aujourd’hui, à notre époque.', 'De nos jours, presque tout le monde travaille avec un ordinateur.', 'Ngày nay gần như ai cũng làm việc với máy tính.', 'B1', 'Nối ý', 'De nos jours'],
  // 33
  ['faire du bénévolat', 'làm tình nguyện', 'Chủ đề phổ biến trong TCF (xã hội). Người tình nguyện: un/une bénévole.', 'Le dimanche, je fais du bénévolat dans une banque alimentaire.', 'Chủ nhật tôi làm tình nguyện ở ngân hàng thực phẩm.', 'B1', 'Xã hội', 'je fais du bénévolat'],
  ['ça vaut la peine', 'đáng công, đáng bỏ thời gian', 'Đánh giá một việc là đáng làm. Phủ định: ça ne vaut pas la peine.', 'Le cours coûte cher, mais ça vaut la peine.', 'Khoá học đắt, nhưng đáng tiền.', 'B1', 'Cảm xúc', 'ça vaut la peine'],
  ['les transports en commun', 'phương tiện giao thông công cộng', 'Luôn ở số nhiều: prendre les transports en commun.', 'Je prends les transports en commun pour économiser de l’argent.', 'Tôi đi phương tiện công cộng để tiết kiệm tiền.', 'A2', 'Giao thông', 'les transports en commun'],
  // 34
  ['dans l’attente de votre réponse', 'trong khi chờ hồi âm của anh/chị', 'Câu kết thư trang trọng, thường đi trước lời cảm ơn hoặc « Cordialement ».', 'Dans l’attente de votre réponse, je vous remercie de votre attention.', 'Trong khi chờ hồi âm, tôi xin cảm ơn sự quan tâm của anh/chị.', 'B2', 'Viết thư', 'Dans l’attente de votre réponse'],
  ['il faut que', 'phải (ai đó làm gì)', 'Luôn theo sau là subjonctif: il faut que je parte, il faut que tu viennes.', 'Il faut que je finisse ce dossier avant vendredi.', 'Tôi phải làm xong hồ sơ này trước thứ sáu.', 'B1', 'Subjonctif', 'Il faut que'],
  ['protéger l’environnement', 'bảo vệ môi trường', 'Chủ đề rất hay ra ở Viết và Nói Tâche 3. Từ liên quan: le recyclage, les déchets, le climat.', 'Pour protéger l’environnement, j’utilise une tasse réutilisable.', 'Để bảo vệ môi trường, tôi dùng cốc tái sử dụng.', 'B1', 'Môi trường', 'protéger l’environnement'],
  // 35
  ['se débrouiller', 'xoay xở được, tự lo được', 'Thân mật: tự làm được dù khó. « Je me débrouille en français » = tôi xoay xở được bằng tiếng Pháp.', 'Je ne parle pas parfaitement, mais je me débrouille au travail.', 'Tôi nói chưa hoàn hảo, nhưng ở chỗ làm tôi vẫn xoay xở được.', 'B1', 'Đời sống', 'je me débrouille'],
  ['enfin', 'cuối cùng; rốt cuộc thì', 'Ý cuối trong chuỗi « d’abord… ensuite… enfin ». Cũng nghĩa là « rốt cuộc thì » sau khi chờ lâu.', 'D’abord, je pétris la pâte, ensuite je la façonne, enfin je la fais cuire.', 'Đầu tiên tôi nhào bột, sau đó tạo hình, cuối cùng nướng.', 'A2', 'Nối ý', 'enfin'],
  ['le coût de la vie', 'chi phí sinh hoạt', 'Chủ đề kinh tế, nhập cư. Động từ hay đi kèm: augmenter (tăng), baisser (giảm).', 'Le coût de la vie augmente plus vite que les salaires.', 'Chi phí sinh hoạt tăng nhanh hơn lương.', 'B1', 'Xã hội', 'Le coût de la vie'],
  // 36
  ['j’en ai marre', 'tôi chán ngấy rồi', 'Rất thân mật, chỉ dùng với bạn bè. Thêm « de » + danh từ hoặc động từ: j’en ai marre de la pluie.', 'J’en ai marre de la pluie ! Vivement l’été.', 'Chán mưa quá rồi! Mong mùa hè tới ghê.', 'B1', 'Cảm xúc', 'J’en ai marre'],
  ['avoir lieu', 'diễn ra, được tổ chức', 'Dùng cho sự kiện, cuộc họp, kỳ thi. Không nói « prendre place ».', 'L’examen aura lieu le 15 novembre à Vancouver.', 'Kỳ thi sẽ diễn ra ngày 15 tháng 11 ở Vancouver.', 'B1', 'Đời sống', 'aura lieu'],
  ['bonne fin de semaine !', 'cuối tuần vui vẻ! (Québec)', 'Ở Québec, cuối tuần là « la fin de semaine »; ở Pháp nói « le week-end ».', 'Bonne fin de semaine ! On se voit lundi.', 'Cuối tuần vui vẻ nhé! Thứ hai gặp lại.', 'A2', 'Canada', 'Bonne fin de semaine'],
  // 37
  ['mettre en place', 'triển khai, thiết lập', 'Hay dùng khi nói về chính sách, giải pháp ở Tâche 3. Danh từ: la mise en place.', 'La ville devrait mettre en place plus de logements sociaux.', 'Thành phố nên triển khai thêm nhà ở xã hội.', 'B2', 'Xã hội', 'mettre en place'],
  ['avoir peur de', 'sợ', 'Theo sau là danh từ hoặc động từ nguyên mẫu: j’ai peur de me tromper (tôi sợ mình sai).', 'Avant, j’avais peur de parler français en public.', 'Trước đây tôi sợ nói tiếng Pháp trước đám đông.', 'A2', 'Cảm xúc', 'j’avais peur de'],
  ['à condition que', 'với điều kiện là', 'Theo sau là subjonctif. Khi hai vế cùng chủ ngữ thì dùng « à condition de » + động từ nguyên mẫu.', 'Je veux bien venir, à condition que tu m’aides avec le dessert.', 'Mình sẵn lòng đến, với điều kiện bạn giúp mình làm món tráng miệng.', 'B2', 'Subjonctif', 'à condition que'],
  // 38
  ['faire partie de', 'là một phần của, thuộc về', 'Thuộc một nhóm, đội, cộng đồng. Trước nguyên âm: faire partie d’un groupe.', 'Je fais partie d’un groupe de conversation en français.', 'Tôi tham gia một nhóm luyện nói tiếng Pháp.', 'B1', 'Đời sống', 'fais partie d’'],
  ['selon moi', 'theo tôi', 'Đồng nghĩa « à mon avis ». « Selon » + người khác để dẫn ý: selon les experts.', 'Selon moi, apprendre une langue, c’est surtout pratiquer.', 'Theo tôi, học ngoại ngữ chủ yếu là luyện tập.', 'B1', 'Nêu ý kiến', 'Selon moi'],
  ['compter sur', 'trông cậy vào', '« Tu peux compter sur moi » = bạn có thể tin cậy mình.', 'Tu peux compter sur moi pour t’aider à déménager.', 'Bạn cứ trông cậy vào mình giúp bạn chuyển nhà.', 'B1', 'Đời sống', 'compter sur'],
  // 39
  ['être fière de', 'tự hào về', 'Người nói là nữ: fière; nam: fier. Theo sau là danh từ hoặc động từ nguyên mẫu.', 'Je suis fière de mes progrès en français.', 'Tôi tự hào về sự tiến bộ tiếng Pháp của mình.', 'A2', 'Cảm xúc', 'Je suis fière de'],
  ['le télétravail', 'làm việc từ xa', 'Chủ đề rất hay gặp trong TCF. Động từ: télétravailler, travailler à distance.', 'Le télétravail permet de mieux concilier vie privée et vie professionnelle.', 'Làm việc từ xa giúp cân bằng đời tư và công việc tốt hơn.', 'B1', 'Công nghệ', 'Le télétravail'],
  ['les réseaux sociaux', 'mạng xã hội', 'Chủ đề TCF quen thuộc (công nghệ). Động từ hay đi kèm: publier (đăng), partager (chia sẻ).', 'Je passe moins de temps sur les réseaux sociaux depuis que j’étudie.', 'Từ khi học, tôi dành ít thời gian hơn cho mạng xã hội.', 'A2', 'Công nghệ', 'les réseaux sociaux'],
  // 40
  ['se faire du souci', 'lo lắng', '« Ne te fais pas de souci » = đừng lo. Đồng nghĩa: s’inquiéter.', 'Ne te fais pas de souci, tout va bien se passer.', 'Đừng lo, mọi chuyện sẽ ổn thôi.', 'B1', 'Cảm xúc', 'Ne te fais pas de souci'],
  ['faire de son mieux', 'cố gắng hết sức', 'Chia theo người: je fais de mon mieux, tu fais de ton mieux.', 'Je fais de mon mieux pour parler français tous les jours.', 'Tôi cố gắng hết sức để nói tiếng Pháp mỗi ngày.', 'A2', 'Cảm xúc', 'Je fais de mon mieux'],
  ['cordialement', 'trân trọng (cuối email)', 'Lời chào cuối email trang trọng, ngắn gọn. Thư rất trang trọng dùng « Veuillez agréer… ».', 'Merci d’avance pour votre aide. Cordialement.', 'Cảm ơn trước sự giúp đỡ. Trân trọng.', 'A2', 'Viết thư', 'Cordialement'],
];

/** French puts a narrow no-break space before ? ! : ; — written here with plain spaces and fixed once. */
const nb = (t: string) => t.replace(/ ([?!:;])/g, ' $1');

export const PHRASES: Phrase[] = ROWS.map(([fr, vi, ctx, ex, exVi, lv, tag, hl], i) => ({
  id: `p${String(i + 1).padStart(3, '0')}`,
  fr: nb(fr), vi, ctx, ex: nb(ex), exVi, lv, tag, hl: nb(hl),
}));

/** Splits the example into plain and bold parts, following hl. */
export function marks(ex: string, hl: string): { t: string; b: boolean }[] {
  const out: { t: string; b: boolean }[] = [];
  let rest = ex;
  for (const part of hl.split('|').filter(Boolean)) {
    const i = rest.indexOf(part);
    if (i < 0) continue;
    if (i > 0) out.push({ t: rest.slice(0, i), b: false });
    out.push({ t: part, b: true });
    rest = rest.slice(i + part.length);
  }
  if (rest) out.push({ t: rest, b: false });
  return out;
}
