# CP2 · Bấm được


## Mức prototype: **Mock**

Flow bấm được hết, dùng **data thật** từ `chat_history_anonymized_for_hackathon.csv` (không phải data giả), phần sinh AI đang **mock** — sẽ nối lời gọi AI thật ở CP3.

## Flow chính — bấm đi hết được

1. Chọn nhóm **học viên × bài giảng** (chỉ hiện các nhóm đã hỏi lại ≥3 lần — đúng theo pattern đã mining ở CP1)
2. Xem **thống kê nhanh**: bao nhiêu lượt hỏi, bao nhiêu % không có trích dẫn
3. Bấm **"Xem lịch sử hỏi gốc"** → xem từng câu hỏi/trả lời thật, có nhãn màu:
   - 🔴 đỏ = tutor trả lời không có trích dẫn
   - 🟢 xanh = có trích dẫn (kèm số trang)
4. Bấm **"Sinh bản ôn tập"** → nhận bản tổng hợp (hiện đang **mock**, gắn nhãn rõ ràng "MOCK — chưa gọi AI thật" để không gây hiểu nhầm)

## Dữ liệu dùng trong prototype

Trích từ data thật, 6 nhóm (user × day_code) có số lượt hỏi lại nhiều nhất, tổng 90 record — xem `codebase/demo_data.json`.

| user_id | day_code | Số lượt hỏi |
|---|---|---|
| U0106 | Lecture_material_ms2lb2ke_c1je8j | cao nhất |
| U0270 | Lecture_material_ms2044ey_k6uor3 | |
| U0149 | Lecture_material_ms2039d0_hnxpxy | |
| U0153 | Lecture_material_ms204i6x_gqwyya | |
| U0131 | Lecture_material_ms2lb2ke_c1je8j | |
| U0106 | Lecture_material_ms204yc9_gxpg9y | |

## Non-goals thể hiện trong prototype (footer UI)

- Không tự chấm điểm/đánh giá năng lực học viên
- Không sửa đè câu trả lời cũ của tutor
- Không bịa nội dung ngoài transcript

## File trong repo

```
codebase/
├── index.html       ← prototype Mock (mở trực tiếp bằng trình duyệt)
└── demo_data.json   ← data thật trích từ chatlog, 90 record
```

## Commit đầu

```
git add codebase/
git commit -m "CP2: mock prototype - flow chinh bam duoc het"
git push
```

## Việc còn lại cho CP3 — "AI thật + đo lượt đầu"

1. **Thay hàm `generateReview()`** (đang mock trong `index.html`) bằng lời gọi AI thật:
   - Input: câu hỏi học viên + các turn thiếu trích dẫn trong nhóm đã chọn
   - Cần: nội dung transcript sạch (`transcript-0X-clean.md`) để đối chiếu và lấy đúng mã đoạn `[Txx-NNN]`
   - Output: bản ôn tập có trích dẫn xác thực, thay thế câu trả lời cũ thiếu căn cứ
2. **Golden set ≥20 case** — bắt đầu từ 12 turn_id thật đã lọc (T0905, T0092, T0702, T0569, T1116, T0650, T1035, T0884, T0776, T0229, T1022, T0802) + bổ sung case cho 4 kịch bản ③④ (hiện chưa có case thật)
3. **Bảng kết quả lượt chạy đầu tiên** — chạy golden set qua AI thật, ghi % đạt, lưu vào `eval/`

