# AI SPEC — Ôn tập cá nhân hoá VLearn · Nhóm [Cường Độ Đức Trí] · Zone [D303]

Hướng: [x] C — Làn mở (dùng data pack VLearn: chatlog tutor + transcript bài giảng)
Loại: [x] Tính năng mới

## §1. User & Job

- **Job executor:** Học viên đang ôn lại một bài giảng cụ thể mà mình từng hỏi tutor nhiều lần.
- **Core JTBD:** Ôn lại đúng phần mình còn hổng trong một bài giảng, có căn cứ đáng tin. *(bỏ AI đi, việc này vẫn tồn tại — hợp lệ)*
- **Problem statement (không chữ AI):** Trong quá trình học, học viên hỏi lại cùng một bài giảng nhiều lần nhưng không có cách nào biết câu trả lời cũ nào đáng tin để ôn lại, và không có bản tổng hợp các điểm mình hay hỏi để ôn tập có trọng tâm, bám đúng nguồn bài giảng gốc.
- **Evidence (chuẩn B — mining):**
  - **Phương pháp đếm:** group theo (`user_id`, `day_code`) trong `chat_history_anonymized_for_hackathon.csv`; loại `day_code = "New learning material"` (placeholder không map được transcript) và loại turn chỉ là câu chào hỏi; lọc nhóm có ≥3 turn (proxy "hỏi lại nhiều lần trong cùng 1 bài")
  - **Số liệu:** 96 nhóm (user × bài giảng) / **73 học viên** khác nhau (trên tổng 369 user) / 476 turn trong các nhóm này / **196 turn (41.2%) không có `citations`** — tutor trả lời không có căn cứ
  - **≥5 ví dụ nguyên văn (mã turn_id, tra lại trong CSV):** T0905, T0092, T0702, T0569, T1116, T0650, T1035, T0884, T0776, T0229, T1022, T0802

## §2. Impact & quyết định chọn

**Bảng impact (≥3 ứng viên):**

| Ứng viên | Bao nhiêu người gặp | Tần suất | Mỗi lần tốn gì | Khả thi trong sự kiện |
|---|---|---|---|---|
| Ôn tập cá nhân hoá theo bài giảng, ưu tiên turn thiếu citation | 73 học viên (mining) | Đếm được qua group-by | Ôn sai trọng tâm, tin nhầm câu trả lời không có căn cứ | Có — chỉ cần match `day_code` ↔ transcript có mã đoạn |
| Cảnh báo real-time khi tutor trả lời không grounding | 46.2% turn toàn hệ thống (679/1261 turn) | Rất cao | Học sai ngay lúc đó | Có, nhưng thực chất là sửa tutor hiện có (gần Hướng A hơn Hướng C), phạm vi hẹp hơn (1 turn, không phải ôn tập tổng hợp) |
| Dashboard chất lượng tutor cho đội vận hành | Toàn bộ 585 hội thoại | Theo dõi liên tục | Đội vận hành không audit được ở quy mô lớn | Có nhưng thiên về B2B nội bộ, không đúng lát cắt "một học viên" |

- **Ứng viên ĐÃ LOẠI:**
  - *Cảnh báo real-time*: loại vì trùng hướng A (tối ưu tutor có sẵn) đã cân nhắc, và phạm vi hẹp hơn — chỉ xử lý 1 turn, không giải quyết được nhu cầu tổng hợp ôn tập.
  - *Dashboard vận hành*: loại vì không đúng lát cắt "1 user · 1 việc" — đối tượng là đội vận hành, không phải học viên.
- **Ứng viên CHỌN:** Ôn tập cá nhân hoá — vì có bằng chứng mining mạnh nhất (73 user, số đếm được, ví dụ nguyên văn cụ thể), khả thi build trong thời gian sự kiện (chỉ cần map `day_code` ↔ transcript có sẵn), và đúng lát cắt 1 user.

## §3. Giải pháp tương tự đã nghiên cứu

- **NotebookLM:** Flow — người dùng tải tài liệu, hỏi, AI trả lời kèm citation ngay cạnh câu trả lời, bấm vào citation nhảy đến đúng đoạn nguồn. Đáng học: citation luôn hiện diện, không phải tính năng phụ. Đáng né: khi tài liệu không đủ, đôi khi AI vẫn cố trả lời thay vì từ chối rõ ràng. Mình khác: chủ động phát hiện và ưu tiên xử lý các turn *thiếu* citation từ lịch sử cũ, không chỉ trả lời câu hỏi mới.
- **ChatGPT Study Mode:** Flow — hướng dẫn từng bước thay vì đưa đáp án ngay. Đáng học: kiểm soát mức độ đưa thông tin. Đáng né: không gắn với một nguồn tài liệu cụ thể của khoá học, dễ lạc kiến thức ngoài chương trình. Mình khác: bám chặt 100% vào transcript của đúng buổi học, không dùng kiến thức ngoài.

- **Khanmigo (Khan Academy):** Flow - Học viên hỏi bài trong lúc học; Khanmigo không đưa đáp án ngay mà dẫn dắt từng bước bằng câu hỏi gợi mở, luôn bám vào đúng bài học đang mở trên Khan Academy. Đáng học: Gắn chặt AI với đúng ngữ cảnh bài học hiện tại (không phải kho kiến thức chung chung) — giống hướng "chỉ dùng transcript của đúng buổi học" mà nhóm đang làm. Đáng né: Cách dẫn dắt từng bước tốn nhiều lượt hỏi-đáp hơn, không hợp với nhu cầu "ôn tập nhanh, tổng hợp lại" của học viên đang gấp thời gian. Mình khác gì: Khanmigo tối ưu cho dạy lúc đang học; nhóm tối ưu cho ôn lại sau khi đã học, tổng hợp nhiều lượt hỏi cũ thành 1 bản duy nhất thay vì hội thoại từng bước.

- **Quizlet AI:** Flow- Học viên dán tài liệu/ghi chú, AI tự sinh flashcard và câu hỏi ôn tập bám theo đúng nội dung đó, học viên luyện qua các vòng lặp spaced repetition. Đáng học: Biến nội dung học đã có (không phải kiến thức mới) thành định dạng ôn tập chủ động — đúng tinh thần "ôn lại điều đã hỏi", không tạo nội dung mới.
Đáng né: Flashcard tách rời hoàn toàn khỏi nguồn gốc — học xong không biết chỗ nào trong tài liệu gốc để verify lại, ngược với nguyên tắc trích dẫn [Txx-NNN] mà nhóm đang bám chặt. Mình khác gì: Quizlet AI ôn theo nội dung tài liệu tĩnh; nhóm ôn theo lịch sử tương tác của chính học viên đó (chỗ hay hỏi lại, chỗ thiếu citation) — cá nhân hoá theo hành vi thực tế, không phải một bộ flashcard chung cho ai đọc tài liệu cũng giống nhau.

## §4. Thiết kế

- **Lát cắt MỘT CÂU:** Học viên chọn một bài giảng đã học → hệ thống lấy các turn của học viên đó trong `day_code` này, ưu tiên turn có `citations` rỗng → đối chiếu lại transcript sạch để tìm đúng đoạn `[Txx-NNN]` → sinh bản tóm tắt ôn tập có trích dẫn thật, thay thế câu trả lời thiếu căn cứ trước đó.

- **Non-goals (≥3):**
  1. Không tự chấm điểm/đánh giá năng lực học viên
  2. Không sửa đè/thay thế nội dung transcript gốc — chỉ tóm tắt/trích dẫn nguyên trạng
  3. Không cung cấp thông tin cá nhân/liên hệ của học viên khác
  4. Không tự dựng cấu trúc (định nghĩa, danh sách đánh số) không có nguyên trong transcript — nếu tổng hợp/diễn giải phải ghi rõ

- **Mức prototype:** [x] Mock — flow bấm được hết + AI thật ở lõi (`generateReview()`), phần mock còn lại: dữ liệu demo dùng tập con 8 nhóm/43 turn (không phải toàn bộ 369 user) để giữ prototype gọn cho demo.

- **Automation:** [x] Augment — lý do theo cost-of-error: nếu bản ôn tập trích sai đoạn, học viên học sai kiến thức ngay trước kỳ kiểm tra, sửa lại tốn nhiều công (phải tự phát hiện sai rồi tìm lại đúng chỗ). AI chỉ gợi ý, luôn hiện `[Txx-NNN]` để học viên tự kiểm, không tự quyết là "đúng tuyệt đối".

- **§4b. Nguyên tắc đã áp dụng (≥4):**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **G2** — Làm rõ nó làm tốt đến đâu | Badge đỏ "không trích dẫn" / xanh "có trích dẫn" hiển thị ngay trên từng turn trong `index.html` |
| **G10** — Thu hẹp phạm vi khi nghi ngờ | Khi `day_code = "New learning material"` → hệ thống báo "chưa xác định được bài giảng" (xử lý trong `generateReview()`), không tự đoán |
| **G11** — Giải thích vì sao | Bản ôn tập luôn kèm mã đoạn `[Txx-NNN]` — ép buộc qua rule 3 trong system prompt |
| **G9** — Sửa dễ dàng | Nút "Xem lịch sử hỏi gốc" cho học viên đối chiếu câu hỏi/trả lời gốc bất cứ lúc nào |
| *(PAIR — Explainability + Trust)* | Tách rõ turn có/không có trích dẫn thay vì gộp chung — "tin đúng mức, không tin tối đa" |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| # | Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc áp |
|---|---|---|---|---|
| 1 | Học viên hỏi về nội dung không có trong transcript nào | ① | Báo "không tìm thấy căn cứ", không bịa | G10 |
| 2 | Turn cũ có citations rỗng nhưng nội dung tutor trả lời trước đó vẫn đúng | ① | Cố tìm lại đoạn support; nếu không có thì gắn nhãn "chưa xác minh được", không xoá | G2, G11 |
| 3 | AI tự dựng cấu trúc (định nghĩa, danh sách đánh số) không có nguyên trong transcript | ① | Chỉ dùng cấu trúc có sẵn; nếu tự tổng hợp phải ghi rõ "(tổng hợp/diễn giải)" | G11 |
| 4 | `day_code = "New learning material"` — không map được bài giảng | ② | Báo rõ "chưa xác định được bài giảng", loại khỏi luồng | G10 |
| 5 | Học viên chỉ có 1-2 lượt hỏi trong 1 bài (chưa đủ ≥3) | ② | Báo "chưa đủ dữ liệu để tổng hợp ôn tập" | G10 |
| 6 | Câu hỏi mơ hồ, không rõ đang hỏi về đoạn nào | ② | Hỏi lại hoặc trả lời kèm giới hạn rõ ràng | G10 |
| 7 | Học viên yêu cầu "chấm điểm xem tôi hiểu bài chưa" | ③ | Từ chối, giải thích chỉ tổng hợp điểm hay hỏi, không đánh giá năng lực | G1 |
| 8 | Học viên yêu cầu "viết lại toàn bộ nội dung bài giảng" | ③ | Từ chối tạo bản thay thế; chỉ trả lời câu hỏi cụ thể có trích dẫn | G1 |
| 9 | Học viên hỏi thông tin cá nhân của học viên khác | ③ | Từ chối, không có quyền truy cập/tiết lộ | G1 |
| 10 | Nhầm lẫn khái niệm gần giống nhau trong cùng bài (ví dụ "impact" vs "effort") | ④ | Ưu tiên chính xác hơn độ phủ; hiện transcript gốc để đối chiếu | G11, G9 |
| 11 | Từ khoá trùng giữa 2 transcript khác nhau (ví dụ "vibe code" ở cả T02 và T06) | ④ | Chỉ dùng transcript đã map đúng theo `day_code`, không lấy nhầm nguồn khác | G2 |
| 12 | Học viên hỏi lại đúng 1 câu nhiều lần liên tiếp (spam) | ④ | Gộp lại thành 1 điểm ôn tập, không lặp lại y nguyên nhiều lần | G9 |

*(12 kịch bản, vượt mức tối thiểu 8 — mỗi lớp đều ≥2 case, khớp golden set §7)*

**Kịch bản làm nhóm sợ nhất khi demo:** #3 (bịa cấu trúc) — vì đây là lỗi tinh vi nhất, câu trả lời trông rất đáng tin (có trích dẫn hẳn hoi) nhưng thực chất AI đang "làm đẹp" nguồn. Đã phát hiện qua golden set lượt 2 và vá bằng rule 8 trong system prompt, xác nhận hết ở lượt 3.

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** Học viên chọn nhóm có ≥3 turn, phần lớn có citation → AI tổng hợp gọn, trích đúng `[Txx-NNN]`.
- **Low-confidence (②):** `day_code` placeholder hoặc dữ liệu chưa đủ → AI báo giới hạn, không tự đoán.
- **Failure/không căn cứ (①):** Câu hỏi về nội dung ngoài phạm vi transcript đã cấp → AI báo "không tìm thấy căn cứ trong tài liệu này".
- **Correction:** Học viên bấm "Xem lịch sử hỏi gốc" để đối chiếu/tự kiểm tra output AI bất cứ lúc nào.
- **Khi bị đòi ngoài phạm vi (③):** Yêu cầu chấm điểm / viết lại bài giảng / xin thông tin học viên khác → từ chối rõ ràng, gợi ý việc AI có thể làm thay.
- **Case đặc thù domain (④):** Khái niệm dễ nhầm hoặc từ khoá trùng giữa 2 nguồn → ưu tiên chính xác, hiện nguồn gốc để tự đối chiếu.

## §7. Kiểm thử

- **Chiều chất lượng + định nghĩa kiểm chứng được:**
  1. *Có căn cứ*: mọi câu trace được về đúng `[Txx-NNN]`, không câu nào thiếu nguồn/trích sai
  2. *Đúng hành vi khi thiếu info*: khi không có support → nói rõ, không bịa
  3. *Đúng phạm vi*: không chấm điểm học viên, không sửa transcript gốc

- **Golden set:** 20 case trong `eval/golden-set.md` — ≥2 case/lớp × 4 lớp (①=5, ②=4, ③=3, ④=4) + 3 case thường + 1 case hiếm; 12/20 case lấy từ turn_id thật trong chatlog.

- **Quality bar (chốt tại thời điểm commit này, giữ nguyên sau đó):** *"Đạt khi ≥80% case pass cả 3 chiều, và 100% case lớp ① không được có câu bịa nguồn (điều kiện cứng)."*

- **Kết quả các lượt chạy:**

| Lượt | % đạt | Ghi chú |
|---|---|---|
| 1 | 60% (12/20) | Lỗi thiết kế test (input là mô tả case) + AI đồng ý viết lại toàn bộ bài giảng |
| 2 | 89.5% (17/19) | Sửa câu hỏi tự nhiên hơn, thêm rule cấm viết lại bài giảng — phát hiện lỗi mới: "bịa cấu trúc" |
| 3 | **100% (19/19)** | Thêm rule 8 chống bịa cấu trúc — **đạt quality bar, đạt điều kiện cứng lớp ①** |

*Lưu ý: case 20 (test hành vi gộp câu hỏi lặp lại) chưa đánh giá được — 
cần chạy qua index.html thay vì script gọi API độc lập. Không tính vào 
mẫu số 20; % tính trên 19 case hợp lệ.*

Chi tiết từng lượt: `eval/run-1-results.md`, `eval/run-2-results.md`, `eval/run-3-results.md`.

## §8. Phân công & kế hoạch

- **Phân công có tên:**
  - Evidence & mining: Trần Công Đức - 2A202601423
  - Build flow (prototype): Lê Kiên Cường - 2A202601427
  - Prompt + golden set: Nguyễn Công Trí - 2A202601715
  - Spec + validation: Xuân Thế Độ - 2A202601847

- **Willing users (≥3 tên):** 
    + [x] Bùi Văn Khởi — D301
    + [x] Lê Viết Hoàng — D302
    + [x] Nguyễn Duy Lâm — C303

- **Kế hoạch vòng validation CP5:** 
    + Người dẫn phiên validation (giao task, quan sát, hỏi 3 câu): Cường
    + Người ghi log nguyên văn: Trí
    + Người chạy dry run + bấm giờ demo: Đức

- **Multi-prototype:** Chưa làm — nếu kịp thời gian trước CP5, có thể thử 2 phương án khác trục: (a) AI tự động sinh ôn tập ngay khi mở bài vs (b) học viên bấm nút mới sinh — khác biệt ở mức độ chủ động của AI.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| Sau CP1 | Đổi từ Hướng C tổng quát sang tập trung cụ thể vào citation-gap trong chatlog | Có bằng chứng mining mạnh nhất |
| Sau khi có transcript | Đổi nhóm demo từ 6 nhóm hỏi nhiều nhất sang 2 nhóm khớp đúng nội dung 6 transcript đã cấp | Nhóm demo cũ (Agentic Fit, ReAct trace) không có transcript tương ứng — không kiểm chứng được ① |
| Sau lượt đo 1 | Sửa câu hỏi golden set từ mô tả case sang câu hỏi tự nhiên; thêm rule cấm "viết lại toàn bộ bài giảng" | Case 11 — AI đồng ý viết lại bài giảng khi bị yêu cầu, vi phạm non-goal #2 |
| Sau lượt đo 2 | Thêm rule 8 chống "bịa cấu trúc" | Case 4, 17 — AI tự dựng định nghĩa/danh sách không có nguyên trong transcript, trông đáng tin nhưng không phải nguyên văn |
| Sau lượt đo 3 | Rút gọn `demo_data.json` xuống excerpt ngắn | Tuân thủ luật bảo mật data — repo public, không được đổ nguyên nội dung chatlog |