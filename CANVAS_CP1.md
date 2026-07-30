# CP1 · Canvas — Mini Hackathon AI Batch 03

## 1. Hướng
**C — Làn mở**, dùng data pack VLearn đã cấp (chatlog tutor + transcript bài giảng).

## 2. Job executor
Học viên đang ôn lại một bài giảng cụ thể mà mình từng hỏi tutor nhiều lần.

## 3. Pain
Trong 369 học viên, có **73 học viên** hỏi lại tutor ≥3 lần trong cùng một bài giảng — trong các lượt đó, **41.2% câu trả lời của tutor không có trích dẫn trang tài liệu** (đã loại các câu chào hỏi để không thổi phồng số). Học viên không biết câu nào đáng tin để ôn lại, và không có bản tổng hợp các điểm mình hay hỏi để ôn tập có trọng tâm, bám đúng nguồn transcript.

## 4. Bằng chứng đầu (chuẩn B — mining)

**Phương pháp đếm:**
1. Group theo (`user_id`, `day_code`)
2. Loại `day_code = "New learning material"` (không map được về transcript nào — placeholder/bug)
3. Loại turn chỉ là câu chào hỏi (không tính vào lỗi thiếu grounding)
4. Lọc nhóm có ≥3 turn (proxy "hỏi lại nhiều lần trong cùng 1 bài")

**Kết quả:**
- 96 nhóm (user × bài giảng) / **73 user** khác nhau (trên tổng 369 user)
- 476 turn trong các nhóm này
- **196 turn (41.2%) không có `citations`** — tutor trả lời không có căn cứ

**Ví dụ trong dataset (mã turn_id):**
T0905, T0092, T0702, T0569, T1116, T0650, T1035, T0884, T0776, T0229, T1022, T0802

## 5. Lát cắt — MỘT CÂU
Học viên chọn một bài giảng đã học → hệ thống lấy các turn của học viên đó trong `day_code` này, ưu tiên turn có `citations` rỗng → đối chiếu lại transcript sạch để tìm đúng đoạn `[Txx-NNN]` → sinh bản tóm tắt ôn tập có trích dẫn thật, thay thế câu trả lời thiếu căn cứ trước đó.

## 6. Automation + lý do · Willing users dự kiến

**Automation: Augment** — vì cost-of-error cao: nếu bản ôn tập trích sai đoạn, học viên học sai kiến thức ngay trước kỳ kiểm tra. AI chỉ gợi ý, không tự quyết là "đúng tuyệt đối"; luôn hiện mã đoạn `[Txx-NNN]` để học viên tự kiểm lại.

**Willing users dự kiến (≥3 người, điền tên thật):**
- [x] Bùi Văn Khởi — D301
- [x] Lê Viết Hoàng — D302
- [x] Nguyễn Duy Lâm — C303

## 7. Phân công có tên

| Tên | Mã HV | Phần phụ trách |
|---|---|---|
| Trần Công Đức | 2A202601423 | Evidence & mining (tiếp tục lên chuẩn A/B) |
| Lê Kiên Cường | 2A202601427 | Build flow chính (prototype) |
| Nguyễn Công Trí | 2A202601715 | Prompt + golden set |
| Xuân Thế Độ | 2A202601847 | Spec.md + chuẩn bị validation |