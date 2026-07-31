# Reflection — [Nguyễn Công Trí] — [2A202601715]
 
**Vai trò trong nhóm:** _Evidence & mining_
 
## Phần mình đã làm
 
Mình phụ trách phần bằng chứng theo chuẩn B — mining trực tiếp từ `chat_history_anonymized_for_hackathon.csv`. Cụ thể:
 
- Đọc 30-50 mẫu hội thoại trước khi định nghĩa tiêu chí đếm, để biết loại pattern nào thực sự tồn tại (câu hỏi lặp lại, tutor trả lời không có `citations`, `day_code` placeholder không map được transcript...).
- Viết phương pháp đếm: group theo (`user_id`, `day_code`), loại `day_code = "New learning material"` và turn chỉ là câu chào hỏi, lọc nhóm có ≥3 turn để làm proxy cho "hỏi lại nhiều lần trong cùng một bài".
- Ra được số liệu chính: 96 nhóm (user × bài giảng) / 73 học viên khác nhau / 476 turn, trong đó 196 turn (41.2%) không có `citations` — đây là con số pain chính dùng xuyên suốt spec và slide demo.
- Giữ lại ≥5 ví dụ nguyên văn (mã turn_id tra lại được: T0905, T0092, T0702, T0569, T1116...) để người khác kiểm chứng lại được.
## AI hỗ trợ như thế nào
 
Mình dùng AI để hỗ trợ ở bước xử lý dữ liệu, không phải để tự ra kết luận: nhờ AI viết nháp đoạn group-by/lọc điều kiện trên CSV, rồi mình tự chạy lại và đối chiếu tay với vài dòng dữ liệu gốc trước khi tin số liệu. AI cũng giúp mình soát lại logic loại trừ (`day_code` placeholder, turn chào hỏi) xem có bỏ sót case nào không. Quyết định cuối về tiêu chí đếm là do mình và nhóm tự chọn sau khi đọc mẫu thật, AI không tự quyết thay.
 
## Một bài học từ case fail của chính nhóm
 
Sau khi có transcript thật, nhóm phát hiện nhóm demo ban đầu (chọn theo 6 bài bị hỏi nhiều nhất) không khớp với nội dung 6 transcript đã được cấp — nghĩa là mining đúng về mặt số liệu nhưng chọn sai đối tượng để minh hoạ, không thể kiểm chứng được bằng chứng ① (nguồn sự thật). Bài học: đếm được nhiều chưa chắc đã *dùng được* — phải kiểm tra chéo với dữ liệu khác (ở đây là transcript) trước khi chốt tập demo, chứ không chỉ tin vào con số đếm một mình.
 
## Vibe-coding check
 
Mình có thể giải thích lại bất cứ lúc nào: cách group-by hoạt động, vì sao loại `day_code` placeholder, vì sao ngưỡng là ≥3 turn chứ không phải 2 hay 5, và cách tra lại từng turn_id trong CSV gốc để đối chiếu. Nếu TA hỏi ngẫu nhiên về phần mining, mình trả lời được cả logic lẫn số liệu, không chỉ nhớ kết quả cuối.
 