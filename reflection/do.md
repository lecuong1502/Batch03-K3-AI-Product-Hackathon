# Reflection — [Xuân Thế Độ] — [2A202601847]

**Vai trò trong nhóm:** _Spec & validation_

## Phần mình đã làm

- CP5: Xây dựng và thực hiện `validation/dry-run-checklist.md`, kiểm tra các điều kiện trước demo, chia thời lượng cho 6 phần trình bày và chọn case ngoài phạm vi để kiểm tra AI có từ chối đúng hay không.
- Trực tiếp chạy dry run, bấm giờ và ghi nhận vấn đề phát sinh. Sau lượt thử đầu, mình cùng nhóm rút gọn phần giới thiệu, bổ sung câu chuyển ý, kiểm tra lại API key và chuẩn bị video dự phòng; lượt chạy cuối hoàn thành trong **4 phút 52 giây**, không có lỗi chặn demo.
- Rà soát nội dung trình bày bám sát `spec.md`: pain point có số liệu, quyết định augment thay vì automate, quality bar ≥80%, failure nguy hiểm nhất là "bịa cấu trúc" và phản hồi từ validation.

## AI hỗ trợ như thế nào

_AI hỗ trợ hệ thống hoá checklist dry run theo yêu cầu CP5, gợi ý cách chia thời lượng cho từng phần và rà soát sự nhất quán giữa kịch bản demo, `spec.md`, kết quả golden set và feedback validation. AI cũng giúp đề xuất phương án dự phòng khi API phản hồi chậm; mình là người kiểm tra lại nội dung, trực tiếp chạy thử và xác nhận thời gian thực tế._

## Một bài học từ case fail của chính nhóm

_Lượt đo 2 phát hiện AI có thể "bịa cấu trúc": tự dựng định nghĩa hoặc danh sách trông hợp lý dù transcript không trình bày như vậy. Bài học mình rút ra là một câu trả lời có trích dẫn vẫn chưa chắc trung thực với nguồn; khi validation và demo cần kiểm tra cả mức độ bám sát cấu trúc nguyên bản, không chỉ kiểm tra câu trả lời có citation hay không. Vì vậy nhóm chọn một câu hỏi ngoài phạm vi làm case khó trong dry run để xác nhận AI biết nói rõ khi không đủ căn cứ thay vì tự suy diễn._

## Vibe-coding check

Mình có thể giải thích được phần mình làm nếu bị hỏi ngẫu nhiên tại CP5/CP6: [x] Có [ ] Chưa chắc — cần ôn lại phần: _(không)_
