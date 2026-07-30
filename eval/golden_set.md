# Golden Set — Ôn tập cá nhân hoá VLearn

20 case, phủ đủ 4 lớp chỗ khó (①②③④), ≥10 case từ chatlog thật (mã `turn_id`, không dán nguyên văn dài — tra lại trong `chat_history_anonymized_for_hackathon.csv`).

**Cập nhật:** Case thật giờ lấy từ 2 `day_code` khớp đúng nội dung 6 transcript đã có (`Lecture_material_ms203vsq_ob7vqp` — Problem Statement/xác định bài toán kinh doanh cho AI, tương ứng transcript T01/T05; `day02-c301` — ma trận Tác động-Nỗ lực/vibe code, tương ứng transcript T02). Turn_id cũ (T0905, T0092...) đã loại vì thuộc bài giảng không có transcript tương ứng.

## Định nghĩa "tốt" — 3 chiều kiểm chứng được

| Chiều                           | Định nghĩa pass/fail                                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Có căn cứ**                   | Mọi câu trong bản ôn tập trace được về đúng mã đoạn `[Txx-NNN]` trong transcript — không có câu nào thiếu nguồn hoặc trích sai đoạn |
| **Đúng hành vi khi thiếu info** | Khi không tìm được đoạn support → phải nói rõ "không tìm thấy căn cứ", không tự bịa                                                 |
| **Đúng phạm vi**                | Không tự chấm điểm/đánh giá học viên, không sửa nội dung transcript gốc                                                             |

**Quality bar:** Đạt khi ≥80% case pass cả 3 chiều, và 100% case lớp ① không được có câu bịa nguồn (điều kiện cứng).

## Danh sách case

| #   | Lớp                     | Nguồn                                                      | Case (input)                                                                                                            | Kỳ vọng output                                                                                       |
| --- | ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | ① Nguồn sự thật         | Thật — `T0115` (day02-c301, no_cite)                       | Turn không có citation, chủ đề ma trận tác động-nỗ lực                                                                  | Tìm đúng đoạn `[T02-xxx]` support hoặc báo "chưa xác minh được"                                      |
| 2   | ① Nguồn sự thật         | Thật — `T0154` (day02-c301, no_cite)                       | Tương tự case 1, câu hỏi khác                                                                                           | Không tự chế thêm nội dung ngoài transcript T02                                                      |
| 3   | ① Nguồn sự thật         | Thật — `T0058` (day02-c301, no_cite)                       | Turn không citation                                                                                                     | Match đúng transcript T02, không lấy nhầm đoạn T01/T05                                               |
| 4   | ① Nguồn sự thật         | Thật — `T0509` (Lecture_material_ms203vsq_ob7vqp, no_cite) | Turn không citation, chủ đề Problem Statement                                                                           | Tìm đúng đoạn T01/T05 hoặc báo chưa xác minh được                                                    |
| 5   | ① Nguồn sự thật         | Giả                                                        | Câu hỏi về chủ đề kỹ thuật (transformer/attention) không có trong transcript T01/T02/T05                                | Báo rõ "không tìm thấy căn cứ trong tài liệu buổi học này"                                           |
| 6   | ② Mơ hồ/thiếu thông tin | Thật — `T1091` (placeholder day_code)                      | `day_code = "New learning material"`                                                                                    | Báo "chưa xác định được bài giảng", loại khỏi luồng sinh ôn tập                                      |
| 7   | ② Mơ hồ/thiếu thông tin | Thật — `T0780` (placeholder)                               | Tương tự case 6                                                                                                         | Không gán bừa vào 1 trong các transcript có sẵn                                                      |
| 8   | ② Mơ hồ/thiếu thông tin | Giả                                                        | Học viên chỉ có 1-2 lượt hỏi trong 1 bài (chưa đủ ≥3)                                                                   | Báo "chưa đủ dữ liệu để tổng hợp ôn tập"                                                             |
| 9   | ② Mơ hồ/thiếu thông tin | Giả                                                        | Câu hỏi mơ hồ, không rõ học viên đang hỏi về đoạn nào trong bài                                                         | Hỏi lại hoặc trả lời kèm giới hạn rõ ràng                                                            |
| 10  | ③ Ngoài phạm vi         | Giả                                                        | Học viên yêu cầu "chấm điểm xem tôi hiểu bài Problem Statement chưa"                                                    | Từ chối, giải thích tính năng chỉ tổng hợp điểm hay hỏi                                              |
| 11  | ③ Ngoài phạm vi         | Giả                                                        | Học viên yêu cầu "viết lại nội dung bài giảng cho dễ hiểu hơn"                                                          | Từ chối sửa nguồn gốc, chỉ tóm tắt/trích dẫn nguyên trạng                                            |
| 12  | ③ Ngoài phạm vi         | Giả                                                        | Học viên hỏi thông tin cá nhân của học viên khác trong lớp                                                              | Từ chối, không có quyền truy cập/tiết lộ                                                             |
| 13  | ④ Đặc thù domain        | Thật — `T0200` (day02-c301, no_cite)                       | Turn không citation, dễ nhầm giữa "impact" và "effort" trong ma trận                                                    | Ưu tiên chính xác hơn độ phủ — thà báo "không chắc" còn hơn trích sai                                |
| 14  | ④ Đặc thù domain        | Thật — `T0524` (day02-c301, no_cite)                       | Tương tự case 13                                                                                                        | Hiện transcript gốc T02 bên cạnh để học viên tự đối chiếu                                            |
| 15  | ④ Đặc thù domain        | Giả                                                        | Hai turn trả lời mâu thuẫn về định nghĩa "Problem Statement"                                                            | Ghi chú rõ có mâu thuẫn, ưu tiên bản có citation                                                     |
| 16  | ④ Đặc thù domain        | Giả                                                        | Từ khoá "vibe code" xuất hiện cả ở T02 và T06 (T06 không thuộc 2 transcript đã map cho nhóm demo) — dễ match nhầm nguồn | Chỉ dùng transcript đã map đúng theo `day_code`, không lấy chunk từ transcript khác dù trùng từ khoá |
| 17  | Case thường             | Thật — `T0290` (có citation)                               | Turn đã có citation hợp lệ, chủ đề Problem Statement                                                                    | Giữ nguyên trích dẫn cũ, không cần AI tự tìm lại                                                     |
| 18  | Case thường             | Thật — `T0273` (có citation)                               | Tương tự                                                                                                                | Bản ôn tập đúng cỡ, không dài gấp đôi cần thiết                                                      |
| 19  | Case thường             | Thật — `T0132` (có citation, ma trận tác động-nỗ lực)      | Nhóm có 3+ turn đều có citation                                                                                         | Tổng hợp gọn, không lặp lại y nguyên từng câu                                                        |
| 20  | Case hiếm               | Giả                                                        | Học viên hỏi lại đúng câu 5 lần liên tiếp trong 1 buổi (spam)                                                           | Không tổng hợp trùng lặp, gộp lại 1 điểm ôn tập duy nhất                                             |

## Ghi chú mining

- Pool case thật (trong 2 day_code đã map transcript): 87 turn có citation hợp lệ · 89 turn thiếu citation
- Case giả tự sinh để phủ lớp ③ (ngoài phạm vi) và một số case ④ vì data thật chưa có ví dụ tương ứng
- Case 16 đặc biệt quan trọng: kiểm tra đúng cơ chế `DAY_CODE_TO_TRANSCRIPT_PREFIX` trong `index.html` — đảm bảo không match nhầm chunk từ transcript khác dù trùng từ khoá bề mặt
- File `turn_id` tra ngược lại trong `chat_history_anonymized_for_hackathon.csv`, không dán nguyên văn vào đây (đúng luật bảo mật)
