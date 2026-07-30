# Lượt đo thứ 3 — Golden Set (CP3)

**Model:** openai/gpt-4o (qua OpenRouter) · **Thay đổi so với lượt 2:** thêm rule 8 (chống "bịa cấu trúc" — cấm tự dựng danh sách/định nghĩa có cấu trúc rõ ràng nếu transcript không có cấu trúc đó).

## Bảng kết quả

| # | Lớp | Có căn cứ | Đúng hành vi thiếu info | Đúng phạm vi | Đạt | Ghi chú |
|---|---|:---:|:---:|:---:|:---:|---|
| 1 | ① | ✅ | ✅ | ✅ | ✅ | |
| 2 | ① | ✅ | ✅ | ✅ | ✅ | |
| 3 | ① | ✅ | ✅ | ✅ | ✅ | |
| 4 | ① | ✅ | ✅ | ✅ | ✅ | Đã sửa — không còn tự đúc kết định nghĩa hoa mỹ, bám sát T01-017 |
| 5 | ① | ✅ | ✅ | ✅ | ✅ | |
| 6 | ② | ✅ | ✅ | ✅ | ✅ | |
| 7 | ② | ✅ | ✅ | ✅ | ✅ | |
| 8 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 9 | ② | ✅ | ✅ | ✅ | ✅ | |
| 10 | ③ | ✅ | — | ✅ | ✅ | |
| 11 | ③ | ✅ | — | ✅ | ✅ | |
| 12 | ③ | ✅ | — | ✅ | ✅ | |
| 13 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 14 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 15 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 16 | ④ | ✅ | ✅ | ✅ | ✅ | |
| 17 | thường | ✅ | ✅ | ✅ | ✅ | Đã sửa — từ chối bịa cấu trúc "4 câu hỏi trọng tâm" |
| 18 | thường | ✅ | ✅ | ✅ | ✅ | |
| 19 | thường | ✅ | ✅ | ✅ | ✅ | |
| 20 | hiếm | N/A | N/A | N/A | N/A | Cần thiết kế lại cách test (không đổi so với lượt 2) |

## Tổng kết

- **% đạt: 19/19 case hợp lệ = 100%** — vượt xa quality bar 80%
- **Điều kiện cứng lớp ① (không bịa nguồn): Đạt tuyệt đối** — 5/5 case
- Cả 2 failure nghiêm trọng phát hiện ở lượt 1-2 (viết lại toàn bộ bài giảng, bịa cấu trúc) đã được vá và xác nhận hết

## Tiến trình 3 lượt đo (dùng cho slide demo §5.1 mục 4)

| Lượt | % đạt | Thay đổi | Failure đau nhất tại lượt đó |
|---|---|---|---|
| 1 | 60% (12/20) | — | Lỗi thiết kế test (input là mô tả case, không phải câu hỏi thật) + AI đồng ý viết lại toàn bộ bài giảng khi được yêu cầu |
| 2 | 89.5% (17/19) | Sửa câu hỏi thành tự nhiên, thêm rule cấm viết lại bài giảng | "Bịa cấu trúc" — AI tự dựng định nghĩa/danh sách đánh số không có nguyên trong transcript |
| 3 | 100% (19/19) | Thêm rule 8 cấm bịa cấu trúc | Không còn failure nghiêm trọng — case 20 vẫn cần thiết kế lại (giới hạn của phương pháp test, không phải lỗi AI) |

## Việc còn lại

- Case 20 (test hành vi gộp câu hỏi lặp lại) cần chạy qua chính `index.html` (có gộp nhóm turn thật) thay vì script gọi API độc lập — để trong backlog, không chặn tiến độ nộp spec.