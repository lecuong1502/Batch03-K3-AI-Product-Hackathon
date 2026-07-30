# Dry run checklist — CP5

**Người chạy dry run + bấm giờ demo:** Độ
**Ngày chạy:** 30/07/2026 · **Thời gian mục tiêu:** 5 phút trình bày + 5 phút Q&A

## Trước khi dry run

- [x] `spec.md` đã commit, quality bar đã chốt (không đổi nữa)
- [x] Prototype (`codebase/index.html`) chạy được, không lỗi console
- [x] `.env`/`config.js` đã setup đúng máy sẽ demo (test trước, đừng để lúc demo mới cắm key)
- [x] Backup: quay video/chụp màn hình demo phòng khi mạng/API lỗi lúc live

## Kịch bản dry run (bám slide 6 trang — guide §5.1)

| # | Nội dung | Thời gian | Người nói |
|---|---|---|---|
| 1 | User & Job — job executor + JTBD + con số pain (73/369 học viên, 41.2% thiếu citation) | 45s | Độ |
| 2 | Vì sao chọn tính năng này — bảng impact rút gọn 3 ứng viên + lý do loại | 45s | Độ |
| 3 | Giải pháp & demo live — lát cắt 1 câu + demo 1 case chuẩn + 1 case chỗ khó | 2' | Cường |
| 4 | Kết quả đo — % golden set (100%, 19/19) đối chiếu quality bar (≥80%) + failure đáng kể nhất đã tìm thấy (case "bịa cấu trúc") | 45s | Trí |
| 5 | User thật nói gì — ≥2 quote nguyên văn từ validation | 45s | Độ |
| 6 | Nếu có thêm 1 tuần — backlog từ feedback/failure chưa xử | 30s | Đức |

- [x] Case chỗ khó chọn để demo live: hỏi một nội dung không có trong transcript; kỳ vọng AI nói rõ "không tìm thấy căn cứ trong tài liệu" thay vì bịa.
- [x] Đã bấm giờ thử toàn bộ 1 lượt, tổng ≤5 phút
- [x] Mỗi thành viên đã tập nói phần của mình ≥1 lần
- [x] Cả nhóm trả lời được 3 câu hỏi bắt buộc:
  - [x] "Augment hay automate — vì sao?" → Augment, vì cost-of-error cao (học sai kiến thức trước kỳ thi)
  - [x] "Failure nguy hiểm nhất?" → "Bịa cấu trúc" (case 4/17 lượt 2) — AI tự dựng định nghĩa/danh sách trông đáng tin nhưng không nguyên văn
  - [x] "Phần bạn làm là gì?" → Đức: evidence & mining; Cường: build flow/prototype; Trí: prompt + golden set; Độ: spec + validation.

## Kết quả dry run

- **Thời gian thực tế:** 4 phút 52 giây.
- **Vấn đề phát sinh:** Lần chạy đầu phần demo case khó bị chậm khoảng 5 giây do phản hồi API; người trình bày chuyển sang giải thích failure "bịa cấu trúc" trong lúc chờ nên không bị ngắt mạch. Phần chuyển từ kết quả golden set sang quote validation ban đầu còn hơi gấp.
- **Đã sửa trước demo thật chưa:** Đã sửa. Nhóm rút gọn phần giới thiệu 8 giây, thêm một câu chuyển ý trước quote validation, kiểm tra lại API key trên máy demo và chuẩn bị sẵn video backup. Lần chạy cuối hoàn thành trong 4 phút 52 giây, không có lỗi chặn demo.
