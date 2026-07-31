# Reflection — [Nguyễn Công Trí] — [2A202601715]

**Vai trò trong nhóm:** _Prompt_Goldenset_

## Phần mình đã làm

Mình phụ trách phần prompt hệ thống và golden set — bộ đo để biết AI có làm đúng việc hay không. Cụ thể:

- Chạy tay 10-20 input qua prototype trước, đọc từng output để chưng cất ra các nhóm lỗi có tên (thiếu căn cứ, đoán khi thiếu thông tin, vượt thẩm quyền, "bịa cấu trúc"...) — không đặt tiêu chí "tốt" từ đầu mà từ lỗi thật đã thấy.
- Xây golden set 20 case trong `eval/golden-set.md`: ≥2 case cho mỗi lớp trong 4 lớp chỗ khó (①=5, ②=4, ③=3, ④=4) + 3 case thường + 1 case hiếm; 12/20 case lấy hoặc phát triển từ turn_id thật trong chatlog, không tự bịa hết.
- Viết system prompt cho `generateReview()`, trong đó có rule 3 ép buộc luôn kèm mã trích dẫn `[Txx-NNN]`, và rule 8 (thêm sau lượt đo 2) chống việc AI tự dựng định nghĩa/danh sách không có nguyên trong transcript.
- Chốt quality bar cùng nhóm trước 23:59 N1: đạt khi ≥80% case pass cả 3 chiều, và 100% case lớp ① không được bịa nguồn — điều kiện cứng, không đổi sau khi chốt.
- Chạy 3 lượt đo trọn bộ golden set: lượt 1 đạt 60% (12/20) — phát hiện câu hỏi test viết chưa tự nhiên và AI từng đồng ý viết lại toàn bộ bài giảng; lượt 2 đạt 89.5% (17/19) sau khi sửa câu hỏi và thêm rule cấm viết lại bài giảng, nhưng lộ ra lỗi mới là "bịa cấu trúc"; lượt 3 đạt 100% (19/19) sau khi thêm rule 8 — đạt quality bar và điều kiện cứng lớp ①.

## AI hỗ trợ như thế nào

Mình dùng AI để nháp phiên bản đầu của system prompt và để sinh thử case golden set dựa trên 4 lớp chỗ khó đã định nghĩa, nhưng không lấy nguyên — mọi case đều được mình đọc lại, đối chiếu với turn thật trong chatlog hoặc transcript trước khi đưa vào bộ chính thức. Khi AI trong prototype trả lời sai (ví dụ đồng ý viết lại toàn bộ bài giảng ở lượt 1), mình không tự sửa mò mà đọc kỹ output để đặt tên đúng loại lỗi trước, rồi mới viết rule chặn — quyết định thêm rule nào, chặn ở đâu là do mình và nhóm tự chọn sau khi đọc lỗi thật, AI không tự quyết thay.

## Một bài học từ case fail của chính nhóm

Lỗi đáng nhớ nhất là "bịa cấu trúc" phát hiện ở lượt đo 2 (case 4, 17): AI tự dựng ra định nghĩa và danh sách đánh số không hề có nguyên văn trong transcript, nhưng vẫn kèm trích dẫn nên trông rất đáng tin — golden set lượt 1 không bắt được lỗi này vì case lúc đó chưa đủ "hiểm". Bài học: một golden set đạt tỷ lệ cao ở lượt đầu chưa chắc đã tốt — phải liên tục nhìn vào output thật qua từng lượt để phát hiện loại lỗi mới, không dừng lại khi thấy % đẹp. Tụi em rút ra là: sửa xong luôn phải chạy lại trọn bộ, vì vá lỗi này có thể làm lộ hoặc gây ra lỗi khác.

## Vibe-coding check

Mình có thể giải thích lại bất cứ lúc nào: vì sao golden set cần phủ đủ cả 4 lớp thay vì chỉ toàn case dễ, cách chấm "đạt" theo từng chiều chất lượng cụ thể ra sao, vì sao quality bar chốt từ 23:59 N1 không được đổi dù kết quả lượt đầu thấp, và rule 8 chặn "bịa cấu trúc" hoạt động theo cơ chế nào trong system prompt. Nếu TA hỏi ngẫu nhiên về phần prompt/eval, mình trả lời được cả lý do thiết kế lẫn số liệu từng lượt đo, không chỉ nhớ kết quả cuối cùng.