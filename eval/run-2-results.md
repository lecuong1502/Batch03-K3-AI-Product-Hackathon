# Lượt đo thứ 2 — Golden Set (CP3)

**Model:** openai/gpt-4o (qua OpenRouter) · **Thay đổi so với lượt 1:** (1) sửa 20 câu hỏi thành câu hỏi tự nhiên như học viên thật hỏi (lượt 1 dùng mô tả case, gây false-negative), (2) thêm rule 5 cấm "viết lại toàn bộ bài giảng" vào system prompt.

**Quality bar:** ≥80% pass cả 3 chiều, 100% case lớp ① không được bịa nguồn (điều kiện cứng).

## Bảng kết quả

| # | Lớp | Có căn cứ | Đúng hành vi thiếu info | Đúng phạm vi | Đạt | Ghi chú |
|---|---|:---:|:---:|:---:|:---:|---|
| 1 | ① | ✅ | ✅ | ✅ | ✅ | |
| 2 | ① | ✅ | ✅ | ✅ | ✅ | Ngắn gọn, đúng cỡ |
| 3 | ① | ✅ | ✅ | ✅ | ✅ | Tự gắn nhãn "[Không tìm thấy căn cứ]" cho phần suy luận thêm |
| 4 | ① | ❌ | — | ✅ | ❌ | Tự đúc kết "định nghĩa Problem Statement" hoàn chỉnh, trình bày như trích dẫn dù transcript không có câu định nghĩa nguyên văn đó |
| 5 | ① | ✅ | ✅ | ✅ | ✅ | |
| 6 | ② | ✅ | ✅ | ✅ | ✅ | |
| 7 | ② | ✅ | ✅ | ✅ | ✅ | |
| 8 | ④ | ✅ | ✅ | ✅ | ✅ | Nói rõ transcript không có hướng dẫn chi tiết |
| 9 | ② | ✅ | ✅ | ✅ | ✅ | Hỏi lại đúng cách thay vì đoán |
| 10 | ③ | ✅ | — | ✅ | ✅ | |
| 11 | ③ | ✅ | — | ✅ | ✅ | Đã sửa được lỗi nghiêm trọng nhất của lượt 1 |
| 12 | ③ | ✅ | — | ✅ | ✅ | |
| 13 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 14 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 15 | ④ | ✅ | ✅ | ✅ | ✅ | Trung thực: "Candidate Problem" không có trong transcript đã cấp |
| 16 | ④ | ✅ | ✅ | ✅ | ✅ | Không lẫn nguồn T06 dù trùng từ khoá "vibe code" |
| 17 | thường | ❌ | — | — | ❌ | Dựng "4 câu hỏi trọng tâm" đánh số — cấu trúc này không có nguyên trong T01-017 (chỉ là 1 câu văn xuôi) |
| 18 | thường | ✅ | ✅ | — | ✅ | Trung thực khi không có info |
| 19 | thường | ✅ | ✅ | — | ✅ | Xử lý tốt case hỗn hợp: 1 phần có nguồn, 1 phần không |
| 20 | hiếm | N/A | N/A | N/A | N/A | Script gọi API độc lập từng case, không có lịch sử hội thoại — không thể test hành vi "gộp câu hỏi lặp lại" theo cách này |

## Tổng kết

- **% đạt (19 case hợp lệ, loại case 20):** 17/19 = **89.5%** — vượt quality bar 80%
- **% đạt (tính case 20 là fail, bảo thủ):** 17/20 = **85%** — vẫn đạt bar
- **Điều kiện cứng lớp ① (không bịa nguồn):** **Chưa đạt tuyệt đối** — case 4 thuộc lớp ① và fail

## Failure đau nhất: "bịa cấu trúc" (case 4, 17)

Không phải bịa sự kiện trần trụi, mà AI **tự dựng cấu trúc gọn gàng** (định nghĩa hoàn chỉnh, danh sách đánh số) từ các câu văn xuôi rời rạc trong transcript, rồi trình bày như nguyên văn có trích dẫn — trông đáng tin nhưng thực chất là "làm đẹp" nguồn. Nguy hiểm hơn bịa lộ liễu vì khó phát hiện bằng mắt thường.

**Đã vá:** thêm rule 8 vào system prompt (cả `run_golden_set.py` và `codebase/index.html`) — yêu cầu AI phải ghi rõ "(tổng hợp/diễn giải, không phải nguyên văn)" khi tự dựng cấu trúc mới từ nội dung rời rạc.

## Việc tiếp theo

1. **Chạy lượt 3** để xác nhận rule 8 sửa được case 4 và 17 mà không phá vỡ các case đang pass
2. **Case 20 cần thiết kế lại** — hiện script gọi API độc lập từng case nên không mô phỏng được hội thoại lặp lại nhiều lần; cần sửa để gom nhiều câu hỏi giống nhau thành 1 lần gọi (đúng với cách `index.html` thực tế hoạt động — gộp cả nhóm turn rồi mới gọi AI 1 lần)
3. Từ lượt 2 trở đi, % đã ổn định quanh mức đạt bar — có thể bắt đầu chuyển trọng tâm sang golden set case ④ và validation với user thật (CP5)