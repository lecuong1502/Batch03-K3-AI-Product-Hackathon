# Reflection — [Trần Công Đức] — [2A202601423]

**Vai trò trong nhóm:** _Evidence & mining_

## Phần mình đã làm

- CP1: Mining `chat_history_anonymized_for_hackathon.csv` để tìm bằng chứng cho pain point — group theo (`user_id`, `day_code`), loại `day_code = "New learning material"` (placeholder không map được transcript) và loại turn chỉ là câu chào hỏi, lọc nhóm có ≥3 turn. Ra số: 96 nhóm (user × bài giảng) / 73 học viên (trên 369 user) / 476 turn / **196 turn (41.2%) không có `citations`**, kèm ≥5 ví dụ nguyên văn theo mã `turn_id` (T0905, T0092, T0702...) — đây là căn cứ để nhóm chọn hướng "ôn tập cá nhân hoá ưu tiên turn thiếu citation" thay vì 2 hướng còn lại.
- CP3: Chunk 6 transcript bài giảng đã làm sạch thành `codebase/transcript_chunks.json` — mỗi đoạn gán mã `[Txx-NNN]` để làm nguồn trích dẫn cho AI, tránh tình trạng "trích mà không biết trích vào đâu".

## AI hỗ trợ như thế nào

_Hỗ trợ đếm turn theo (`user_id`, `day_code`) và lọc noise (câu chào hỏi, placeholder day_code) nhanh hơn tự đếm tay; hỗ trợ rà lại 20 case golden set xem đã phủ đủ 4 lớp chưa và có case nào vô tình dán nguyên văn chatlog (vi phạm luật bảo mật) không; hỗ trợ đối chiếu mã đoạn `[Txx-NNN]` trong transcript_chunks.json khớp với case nào trong golden set để không bị lệch tham chiếu._

## Một bài học từ case fail của chính nhóm

_Lượt đo 1 chỉ đạt 60% — case 11 (lớp ③, "viết lại bài giảng cho dễ hiểu hơn") lộ ra AI không từ chối mà viết lại toàn bộ nội dung có cấu trúc, đây là lỗi nghiêm trọng nhất vì vi phạm đúng nguyên tắc phạm vi mà golden set được thiết kế để bắt._

## Vibe-coding check

Mình có thể giải thích được phần mình làm nếu bị hỏi ngẫu nhiên tại CP5/CP6: [x] Có [ ] Chưa chắc — cần ôn lại phần: _(điền nếu có)_
