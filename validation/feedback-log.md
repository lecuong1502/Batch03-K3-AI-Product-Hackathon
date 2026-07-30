# Validation Log — CP5

**Người dẫn phiên (giao task, quan sát, hỏi 3 câu):** Cường
**Người ghi log nguyên văn:** Trí
**Ngày chạy:** 30/07/2026

## Cách thực hiện (theo guide §4.2)

Với mỗi người thử (10 phút/người):
1. **Giao task thật:** "Hãy dùng cái này để ôn lại bài [X] mà bạn từng học" — không thuyết minh, không gợi ý
2. **Quan sát im lặng** — ghi lại họ bấm gì, kẹt ở đâu
3. **Hỏi đúng 3 câu, ghi nguyên văn:**
   - "Điều gì khó hiểu hoặc khó chịu nhất?"
   - "Kết quả này bạn có tin không — vì sao?"
   - "Bạn có dùng thật không — vì sao / vì sao chưa?"

**Người thử:** ≥5 người ngoài nhóm, ưu tiên 3 willing users đã khai ở CP1 (Bùi Văn Khởi — D301, Lê Viết Hoàng — D302, Nguyễn Duy Lâm — C303) + 2 người từ zone khác (đổi chéo).

⚠️ Nếu mọi phản hồi đều là lời khen, phiên test chưa đạt — giao lại task khó hơn hoặc đổi người thử.

## Log từng người thử

| Người thử (tên/vai — willing user?) | Task giao | Quan sát (bấm gì, kẹt đâu) | Quote nguyên văn (3 câu) | Mức nghiêm trọng |
|---|---|---|---|---|
| Bùi Văn Khởi — C401, willing user | "Dùng cái này để ôn lại bài ma trận tác động-nỗ lực bạn từng học" | Chọn đúng nhóm ngay từ dropdown đầu tiên; đọc phần "lịch sử hỏi gốc" trước khi bấm sinh ôn tập; hơi khựng lại ~5 giây ở màn hình loading, tưởng bị treo | *"Khó hiểu nhất là mình không biết đang chờ cái gì lúc nó loading — nên có chữ 'đang gọi AI' rõ hơn."* / *"Tin, vì thấy nó ghi rõ [T02-009] với mấy cái mình có thể bấm xem lại."* / *"Có dùng thật, nhất là trước hôm thi vì mình hay quên đúng mấy chỗ mình hay hỏi lại."* | Trung bình — vấn đề UX (thiếu chỉ báo loading rõ), không phải lỗi logic/nội dung |
| Lê Viết Hoàng — D302, willing user | "Dùng cái này để ôn lại bài Problem Statement bạn từng hỏi nhiều lần" | Thử bấm vào citation `[T01-017]` mong nó nhảy tới đúng đoạn transcript nhưng không có gì xảy ra; phải tự đọc lại toàn bộ transcript_chunks.json để đối chiếu | *"Khó chịu nhất là thấy có mã trích dẫn mà bấm vào không dẫn đi đâu cả — tưởng là link được."* / *"Tin nội dung, nhưng hơi nghi vì không tự kiểm tra được ngay tại chỗ."* / *"Sẽ dùng nếu sau này bấm vào trích dẫn nó nhảy thẳng tới đoạn đó."* | Cao — kỳ vọng UX (citation nên clickable) chưa được đáp ứng, ảnh hưởng trực tiếp đến khả năng tự kiểm chứng (nguyên tắc G9) |
| Nguyễn Duy Lâm — C303, willing user | "Dùng cái này để ôn lại bất kỳ bài nào bạn từng hỏi tutor nhiều lần" | Chọn nhóm `day02-c301`; đọc bản ôn tập AI sinh ra; sau đó chủ động gõ thử câu hỏi ngoài phạm vi ("chấm điểm bài mình đi") dù không được yêu cầu, để xem phản ứng | *"Không khó hiểu gì, dễ dùng."* / *"Tin — thích cái vụ nó từ chối chấm điểm luôn, thấy nó rõ ràng phạm vi."* / *"Có, nhưng sẽ dùng nhiều hơn nếu làm được trên điện thoại — hiện đang phải mở máy tính."* | Thấp — phản hồi tích cực, chỉ có 1 gợi ý mở rộng (mobile), không phải lỗi |
| DƯƠNG NGỌC TIẾN — D301, zone khác | "Dùng cái này để ôn lại một bài giảng bất kỳ bạn từng học" | Loay hoay ở màn hình chọn nhóm ~15 giây vì không hiểu `day_code` như `Lecture_material_ms203vsq_ob7vqp` nghĩa là bài nào; phải hỏi lại nhóm demo | *"Khó hiểu nhất là cái tên bài giảng, toàn mã code không đọc được là bài gì."* / *"Tin nội dung ôn tập, nhưng lúc chọn bài thì không tự tin lắm."* / *"Chưa chắc dùng, vì nếu không biết chọn đúng bài thì hơi mất công."* | Cao — tên hiển thị (`day_code` thô) là rào cản chọn đúng bài ngay từ bước đầu tiên, ảnh hưởng trực tiếp đến khả năng dùng được |
| Lê Việt Hoàng — D302, zone khác | "Dùng cái này để ôn lại bài bạn hay hỏi lại tutor" | Bấm "Sinh bản ôn tập" 3 lần liên tiếp cho cùng 1 nhóm để xem kết quả có đổi không; nhận thấy nội dung gần như giống nhau mỗi lần | *"Không khó hiểu, nhưng thấy hơi lo là mỗi lần bấm lại ra hơi khác nhau chút — không biết bản nào mới đúng."* / *"Tin, vì đều có trích dẫn giống nhau ở các lần."* / *"Có dùng, nhưng muốn biết tại sao kết quả không y hệt nhau mỗi lần."* | Trung bình — biến thiên output giữa các lần gọi AI (đặc tính vốn có của LLM) chưa được giải thích rõ cho người dùng (thiếu G2 — làm rõ giới hạn) |

*(Thêm dòng nếu thử với >5 người)*

## Tổng hợp

**Chủ đề lặp nhiều nhất:**
> **Thiếu minh bạch trạng thái & khả năng tự kiểm chứng ngay tại chỗ** — xuất hiện ở 4/5 phiên dưới nhiều hình thức khác nhau: loading không rõ đang làm gì (Khởi), citation không nhảy tới nguồn để tự kiểm (Hoàng D302 #1), tên bài giảng hiển thị dạng mã không đọc được nên không chắc mình đang chọn đúng (Tiến), và biến thiên giữa các lần sinh không được giải thích (Hoàng D302 #2). Đây không phải 4 lỗi rời rạc mà cùng một gốc: hệ thống không cho user đủ tín hiệu để biết "chuyện gì đang xảy ra" và "vì sao nên tin" — liên quan trực tiếp đến G2 (làm rõ giới hạn), G9 (sửa/kiểm dễ dàng), G11 (giải thích vì sao).
 
**1-2 thay đổi làm trước demo (→ đưa vào Changelog spec §9):**
> 1. **Hiển thị tên bài giảng dễ đọc thay vì `day_code` thô** ở màn hình chọn nhóm (map từ `DATA_DICTIONARY.md` hoặc `transcript_chunks.json` sang tên người thật đọc được) — mức Cao, chặn ngay bước đầu tiên của flow, sửa nhanh vì chỉ là lớp hiển thị.
> 2. **Thêm chỉ báo trạng thái rõ ràng khi đang gọi AI** (ví dụ: "Đang gọi AI, vui lòng đợi ~5-10s...") thay vì màn hình trống — mức Trung bình, sửa nhanh, giảm cảm giác "treo máy".
 
**Giữ nguyên — có lý do:**
> **Biến thiên nhẹ giữa các lần sinh bản ôn tập cho cùng một input** — đây là đặc tính vốn có của mô hình ngôn ngữ (không phải bug), sửa triệt để (ví dụ cố định seed/cache) tốn thời gian và có thể đánh đổi chất lượng câu trả lời. Quyết định giữ hành vi hiện tại nhưng bổ sung một dòng giải thích ngắn trong UI (theo G2) để user hiểu đây là bản chất của AI chứ không phải lỗi — xử lý bằng text, không phải đổi logic.
 
**Đưa vào backlog (cho slide 6 "nếu có thêm 1 tuần"):**
> - Làm citation clickable — bấm vào `[T01-017]` nhảy thẳng tới đúng đoạn trong transcript gốc (mức Cao nhưng cần xây cơ chế mapping ID → vị trí, không kịp trước demo).
> - Hỗ trợ dùng trên điện thoại (mobile-responsive).
> - Mở rộng giải thích biến thiên AI thành UI rõ ràng hơn (ví dụ hiển thị "phiên bản trả lời #2" kèm ghi chú so sánh).
 
