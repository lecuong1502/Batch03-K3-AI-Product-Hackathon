# Ôn tập cá nhân hoá VLearn — Tài liệu dự án

**Mini Hackathon AI — Batch 03** · Nhóm Cường Độ Đức Trí · Zone D303
**Hướng:** C — Làn mở · **Loại:** Tính năng mới

---

## 1. Tổng quan

Học viên VLearn thường hỏi lại tutor nhiều lần trong cùng một bài giảng, nhưng không có cách nào biết câu trả lời cũ nào đáng tin để ôn lại. Sản phẩm này tự động tổng hợp lịch sử hỏi-đáp của học viên trong một bài giảng thành một bản ôn tập có trích dẫn xác thực từ transcript gốc, ưu tiên xử lý những câu trả lời cũ **thiếu căn cứ** (không có citation).

**Lát cắt một câu:** Học viên chọn một bài giảng đã học → hệ thống lấy các turn của học viên đó trong bài này, ưu tiên turn có `citations` rỗng → đối chiếu lại transcript sạch để tìm đúng đoạn `[Txx-NNN]` → sinh bản tóm tắt ôn tập có trích dẫn thật, thay thế câu trả lời thiếu căn cứ trước đó.

---

## 2. Vấn đề & bằng chứng

**Job executor:** Học viên đang ôn lại một bài giảng cụ thể mà mình từng hỏi tutor nhiều lần.

**Problem statement:** Học viên hỏi lại cùng một bài giảng nhiều lần nhưng không biết câu trả lời cũ nào đáng tin để ôn lại, và không có bản tổng hợp các điểm mình hay hỏi để ôn tập có trọng tâm.

### Bằng chứng (mining — chuẩn B)

**Phương pháp:** Group theo (`user_id`, `day_code`) trong `chat_history_anonymized_for_hackathon.csv`; loại `day_code = "New learning material"` (placeholder không map được transcript) và loại turn chỉ là câu chào hỏi; lọc nhóm có ≥3 turn (proxy "hỏi lại nhiều lần trong cùng 1 bài").

**Kết quả:**
- **96 nhóm** (user × bài giảng), thuộc **73 học viên** khác nhau (trên tổng 369 user)
- **476 turn** trong các nhóm này
- **196 turn (41.2%)** không có `citations` — tutor trả lời không có căn cứ

**Ví dụ turn_id thật (tra lại trong CSV):** T0905, T0092, T0702, T0569, T1116, T0650, T1035, T0884, T0776, T0229, T1022, T0802

### Bảng impact — 3 ứng viên đã cân nhắc

| Ứng viên | Quy mô | Khả thi | Kết quả |
|---|---|---|---|
| **Ôn tập cá nhân hoá theo bài giảng** | 73 học viên | Cao — chỉ cần map `day_code` ↔ transcript | ✅ Chọn |
| Cảnh báo real-time khi tutor thiếu grounding | 46.2% turn toàn hệ thống | Trung bình — trùng hướng A, phạm vi hẹp hơn | ❌ Loại |
| Dashboard chất lượng tutor cho vận hành | Toàn bộ 585 hội thoại | Thấp — sai lát cắt "1 user · 1 việc" | ❌ Loại |

---

## 3. Giải pháp tương tự đã nghiên cứu

| Sản phẩm | Đáng học | Đáng né | Khác biệt của nhóm |
|---|---|---|---|
| **NotebookLM** | Citation luôn hiện diện cạnh câu trả lời | Vẫn cố trả lời khi tài liệu không đủ | Chủ động xử lý turn *thiếu* citation từ lịch sử cũ |
| **ChatGPT Study Mode** | Kiểm soát mức độ đưa thông tin | Không gắn cứng với 1 nguồn tài liệu cụ thể | Bám 100% vào transcript đúng buổi học |
| **Khanmigo** | Gắn AI với đúng ngữ cảnh bài học hiện tại | Dẫn dắt từng bước tốn nhiều lượt, không hợp ôn nhanh | Tối ưu cho *ôn lại sau khi học*, tổng hợp 1 lần thay vì hội thoại |
| **Quizlet AI** | Biến nội dung có sẵn thành ôn tập chủ động | Flashcard tách rời khỏi nguồn, không verify lại được | Ôn theo *lịch sử tương tác cá nhân*, không phải tài liệu tĩnh chung |

**Điểm chung của NotebookLM & Study Mode:** cả hai đều kiểm soát chặt cách AI đưa thông tin ra và ưu tiên minh bạch quá trình, nhưng đều chưa xử lý trọn vẹn trường hợp thiếu căn cứ. Đây chính là khoảng trống nhóm lấp bằng nguyên tắc G10 + G11.

---

## 4. Thiết kế

**Non-goals:**
1. Không tự chấm điểm/đánh giá năng lực học viên
2. Không sửa đè/thay thế nội dung transcript gốc
3. Không cung cấp thông tin cá nhân của học viên khác
4. Không tự dựng cấu trúc (định nghĩa, danh sách) không có nguyên trong transcript

**Automation: Augment** — nếu bản ôn tập trích sai đoạn, học viên học sai kiến thức ngay trước kỳ kiểm tra, sửa lại tốn nhiều công. AI chỉ gợi ý, luôn hiện `[Txx-NNN]` để học viên tự kiểm, không tự quyết là "đúng tuyệt đối".

**Nguyên tắc HAX/PAIR áp dụng:**

| Nguyên tắc | Vị trí áp dụng |
|---|---|
| G2 — Làm rõ nó làm tốt đến đâu | Badge đỏ/xanh trên từng turn (`index.html`) |
| G10 — Thu hẹp phạm vi khi nghi ngờ | `day_code` placeholder → báo rõ, không đoán |
| G11 — Giải thích vì sao | Bản ôn tập luôn kèm `[Txx-NNN]` (rule 3 trong system prompt) |
| G9 — Sửa dễ dàng | Nút "Xem lịch sử hỏi gốc" |
| PAIR Explainability + Trust | Tách rõ turn có/không có trích dẫn |

---

## 5. Kiến trúc kỹ thuật

```
codebase/
├── index.html              ← Prototype Mock, flow chính bấm được hết
├── demo_data.json          ← 43 turn thật (excerpt ngắn), 8 nhóm thuộc 2 day_code có transcript
├── transcript_chunks.json  ← 67 chunks parse từ 6 transcript, mã hoá theo [Txx-NNN]
├── .env.example / .env     ← Key OpenRouter (key thật không commit)
└── generate_config.py      ← Sinh config.js từ .env cho index.html đọc
```

**AI call:** `openai/gpt-4o` qua OpenRouter API. Quyết định AI phải ra: *câu trả lời cũ (turn thiếu citation) có tìm được đoạn hỗ trợ thực sự trong transcript hay không — nếu có thì trích đúng mã đoạn, nếu không thì từ chối bịa và báo rõ giới hạn.*

**System prompt** ép buộc 8 rule: chỉ dùng transcript được cấp, báo rõ khi thiếu căn cứ, luôn kèm mã đoạn, không chấm điểm, không viết lại toàn bộ bài giảng, không lộ thông tin cá nhân, báo giới hạn khi transcript rỗng, không tự dựng cấu trúc (định nghĩa/danh sách) không có nguyên trong transcript.

**Mapping day_code → transcript:**
```js
{
  'Lecture_material_ms203vsq_ob7vqp': ['T01', 'T05'],  // Problem Statement
  'day02-c301': ['T02'],                                 // Ma trận tác động-nỗ lực
}
```

---

## 6. Bốn lớp chỗ khó & 12 kịch bản rủi ro

| Lớp | Số kịch bản | Ví dụ tiêu biểu |
|---|---|---|
| ① Nguồn sự thật | 3 | AI tự dựng cấu trúc không có nguyên trong transcript |
| ② Mơ hồ/thiếu thông tin | 3 | `day_code` placeholder — không map được bài giảng |
| ③ Ngoài phạm vi | 3 | Yêu cầu "viết lại toàn bộ bài giảng" |
| ④ Đặc thù domain | 3 | Từ khoá trùng giữa 2 transcript khác nhau (vd. "vibe code" ở cả T02, T06) |

**Kịch bản đáng sợ nhất khi demo:** #3 (bịa cấu trúc) — câu trả lời trông đáng tin (có trích dẫn hẳn hoi) nhưng thực chất AI đang "làm đẹp" nguồn thay vì trích nguyên văn.

---

## 7. Kiểm thử — Golden Set & 3 lượt đo

**Golden set:** 20 case, ≥2 case/lớp × 4 lớp, 12/20 case từ turn_id thật. **Quality bar:** ≥80% pass cả 3 chiều (có căn cứ / đúng hành vi thiếu info / đúng phạm vi), và 100% case lớp ① không được bịa nguồn (điều kiện cứng).

| Lượt | % đạt | Thay đổi | Failure phát hiện |
|---|---|---|---|
| **1** | 60% (12/20) | — | Lỗi thiết kế test (input là mô tả case, không phải câu hỏi thật) + AI đồng ý viết lại toàn bộ bài giảng khi bị yêu cầu |
| **2** | 89.5% (17/19) | Sửa câu hỏi thành tự nhiên; thêm rule cấm viết lại bài giảng | "Bịa cấu trúc" — AI tự dựng định nghĩa/danh sách đánh số không có nguyên trong transcript |
| **3** | **100% (19/19)** | Thêm rule 8 chống bịa cấu trúc | Không còn failure nghiêm trọng |

*Lưu ý: case 20 (test hành vi gộp câu hỏi lặp lại) chưa đánh giá được qua script độc lập — cần chạy qua `index.html` thật. % tính trên 19 case hợp lệ.*

Chi tiết từng lượt: `eval/run-1-results.md`, `eval/run-2-results.md`, `eval/run-3-results.md`. Golden set đầy đủ: `eval/golden-set.md`.

---

## 8. Bốn đường đi trải nghiệm

- **Happy path:** Chọn nhóm có ≥3 turn, phần lớn có citation → tổng hợp gọn, trích đúng mã đoạn.
- **Low-confidence (②):** `day_code` placeholder/dữ liệu chưa đủ → báo giới hạn, không đoán.
- **Failure/không căn cứ (①):** Hỏi ngoài phạm vi transcript → báo "không tìm thấy căn cứ".
- **Correction:** Bấm "Xem lịch sử hỏi gốc" để tự đối chiếu bất cứ lúc nào.
- **Ngoài phạm vi (③):** Yêu cầu chấm điểm/viết lại/xin info người khác → từ chối rõ ràng.
- **Đặc thù domain (④):** Khái niệm dễ nhầm/từ khoá trùng nguồn → ưu tiên chính xác, hiện gốc để đối chiếu.

---

## 9. Đội ngũ & phân công

| Mã HV | Tên | Phụ trách |
|---|---|---|
| 2A202601423 | Trần Công Đức | Evidence & mining |
| 2A202601427 | Lê Kiên Cường | Build flow (prototype) |
| 2A202601715 | Nguyễn Công Trí | Prompt + golden set |
| 2A202601847 | Xuân Thế Độ | Spec + validation |

**Willing users:** Bùi Văn Khởi (D301), Lê Viết Hoàng (D302), Nguyễn Duy Lâm (C303)

**Vòng validation CP5:** Cường dẫn phiên · Trí ghi log · Độ chạy dry run

---

## 10. Trạng thái hiện tại & việc còn lại

**Đã hoàn thành:**
- ✅ Evidence chuẩn B, đủ log + ví dụ nguyên văn
- ✅ Spec.md đầy đủ §1-§9
- ✅ Prototype Mock chạy được, AI thật (gpt-4o qua OpenRouter)
- ✅ Golden set 20 case, đạt quality bar 100% ở lượt 3
- ✅ README.md, .env setup an toàn (không commit key)
- ✅ Validation với ≥5 người thật ngoài nhóm (`validation/feedback-log.md` — template sẵn, cần điền data thật)
- ✅ Dry run bấm giờ (`validation/dry-run-checklist.md` — template sẵn)
- ✅ Reflection cá nhân, mỗi thành viên 1 file (`reflection/`)
- ✅ `demo-slides.pdf` (6 trang, theo khung trong dry-run-checklist.md)
- ✅ Case 20 cần thiết kế lại cách test (gộp câu hỏi lặp lại) qua `index.html` thay vì script độc lập

---

## 11. Cấu trúc repo

```
repo/
├── README.md
├── spec.md
├── docs/full-documentation.md    ← file này
├── demo-slides.pdf       
├── codebase/
│   ├── index.html
│   ├── demo_data.json
│   ├── transcript_chunks.json
│   ├── .env.example / .gitignore
│   └── generate_config.py
├── eval/
│   ├── golden-set.md
│   ├── run_golden_set.py
│   └── run-1/2/3-results.md
├── validation/
│   ├── feedback-log.md    
│   └── dry-run-checklist.md
└── reflection/
    └── TEMPLATE.md              
```