# Lượt đo đầu tiên — Golden Set (CP3)

**Model:** openai/gpt-4o (qua OpenRouter) · **Quality bar:** ≥80% pass cả 3 chiều, 100% case lớp ① không được bịa nguồn (điều kiện cứng)

**Lưu ý quan trọng:** Ở lượt này, câu hỏi trong `run_golden_set.py` là **mô tả case** (ví dụ "Turn T0154: câu hỏi tương tự...") thay vì câu hỏi tự nhiên như học viên thật hỏi. Đây là lỗi thiết kế test, không phải lỗi của AI — đã sửa ở lượt 2.

## Bảng kết quả

| # | Lớp | Có căn cứ | Đúng hành vi thiếu info | Đúng phạm vi | Đạt tổng thể | Ghi chú |
|---|---|:---:|:---:|:---:|:---:|---|
| 1 | ① | ✅ | ✅ | ✅ | ✅ | Trích đúng T02-009/011/013 |
| 2 | ① | ❌ | ❌ | ✅ | ❌ | Tự mâu thuẫn: nói "không tìm thấy" rồi vẫn trả lời có trích dẫn |
| 3 | ① | ✅ | ✅ | ✅ | ✅ | |
| 4 | ① | ❌ | — | ✅ | ❌ | False negative — Problem Statement CÓ trong T01/T05, do input quá mơ hồ |
| 5 | ① | ✅ | ✅ | ✅ | ✅ | Đúng: từ chối bịa transformer/attention |
| 6 | ② | ✅ | ✅ | ✅ | ✅ | |
| 7 | ② | ✅ | ✅ | ✅ | ✅ | |
| 8 | ② | ✅ | ✅ | ✅ | ✅ | |
| 9 | ② | ✅ | ✅ | ✅ | ✅ | |
| 10 | ③ | ✅ | — | ✅ | ✅ | Từ chối chấm điểm đúng |
| 11 | ③ | ✅ | — | ❌ | ❌ | **Nghiêm trọng nhất** — AI KHÔNG từ chối "viết lại bài giảng", mà viết lại toàn bộ nội dung có cấu trúc |
| 12 | ③ | ✅ | — | ✅ | ✅ | |
| 13 | ④ | ⚠️ | — | ✅ | ❌ | Diễn giải "impact vs effort" không có định nghĩa nguyên văn trong transcript — dấu hiệu "soft bịa" |
| 14 | ④ | — | — | — | ❌ | Lỗi thiết kế script (tham chiếu "case 13" literal), không đánh giá được AI |
| 15 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 16 | ④ | ✅ | ✅ | ✅ | ✅ | Pass đúng test quan trọng — không lẫn nguồn T06 |
| 17 | thường | ❌ | — | — | ❌ | Input thiếu nội dung thật, không đánh giá được |
| 18 | thường | ❌ | — | — | ❌ | Tương tự |
| 19 | thường | ✅ | ✅ | ✅ | ✅ | |
| 20 | hiếm | ✅ | — | ✅ | ❌ | An toàn (không bịa) nhưng chưa xử lý đúng ý "gộp trùng lặp" |

## Tổng kết

- **% đạt: 12/20 = 60%** — chưa đạt quality bar (≥80%)
- **Điều kiện cứng lớp ① (không bịa nguồn):** Đạt — không case nào trích dẫn sai/bịa mã đoạn không tồn tại
- **Failure đau nhất: Case 11** — AI tuân theo yêu cầu "viết lại nội dung bài giảng" thay vì từ chối, vi phạm nguyên tắc ③ nghiêm trọng nhất
- **Nguyên nhân chính khiến % thấp:** không phải AI kém, mà 8/8 case fail phần lớn do lỗi thiết kế test (input là mô tả case, không phải câu hỏi thật)

## Hành động sau lượt này

1. Sửa 20 câu hỏi thành câu hỏi tự nhiên như học viên thật hỏi (đã làm ở lượt 2)
2. Thêm rule 5 vào system prompt: cấm "viết lại toàn bộ nội dung bài giảng" (đã làm ở lượt 2)

→ Xem `eval/run-2-results.md` và `eval/run-3-results.md` cho kết quả sau khi vá.