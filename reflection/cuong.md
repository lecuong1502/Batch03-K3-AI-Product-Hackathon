# Reflection — Lê Kiên Cường — 2A202601427

**Vai trò trong nhóm:** Build flow (prototype)

## Phần em đã làm

- **CP2 — dựng flow chính:** Build `index.html`: chọn nhóm (học viên × bài giảng) → xem thống kê nhanh (bao nhiêu % turn thiếu citation) → xem lịch sử hỏi gốc, có badge màu phân biệt turn có/không có trích dẫn → bấm "Sinh bản ôn tập".
- **Xử lý dữ liệu:** Viết code Python để mining từ `chat_history_anonymized_for_hackathon.csv` — group theo `user_id` + `day_code`, lọc turn thiếu citation, loại các trường hợp gây nhiễu. Sau đó phát hiện nhóm demo ban đầu (6 nhóm hỏi nhiều nhất) không khớp với nội dung 6 transcript được cấp — phải quay lại tìm keyword matching để chọn lại đúng 2 `day_code` có transcript tương ứng (`Lecture_material_ms203vsq_ob7vqp` và `day02-c301`), rồi build lại `demo_data.json`.
- **Bảo mật dữ liệu:** Khi nhóm nhận ra repo sẽ public, em rút gọn `demo_data.json` từ excerpt ~200 ký tự xuống ~50 ký tự để tuân thủ luật "không đổ nguyên data pack vào repo, chỉ trích dẫn ngắn".
- **Parse transcript:** Viết script regex để tách 6 file transcript sạch thành `transcript_chunks.json`, mã hoá theo `[Txx-NNN]`, cùng bảng mapping `DAY_CODE_TO_TRANSCRIPT_PREFIX` để đảm bảo AI chỉ lấy đúng nguồn của đúng bài giảng, không bị lẫn nội dung giữa các buổi học khác nhau.
- **Nối AI thật (CP3):** Chuyển từ Gemini sang OpenRouter (model `openai/gpt-4o`) theo yêu cầu đổi model của nhóm, viết logic gọi API kèm system prompt ép AI chỉ dùng transcript được cấp.
- **Quản lý key an toàn:** Build cơ chế đọc key từ `.env` qua `generate_config.py` sinh ra `config.js` (đã đưa vào `.gitignore`), thay vì hardcode hoặc bắt người dùng nhập tay mỗi lần — vừa tiện demo vừa không lộ key khi commit.
- **Code đánh giá golden set:** Viết `run_golden_set.py` để gọi hàng loạt 20 case qua OpenRouter tự động thay vì phải bấm tay từng case trên UI, giúp nhóm chạy lại được nhiều lượt nhanh khi cần sửa prompt.
- **Chỉnh sửa checkpoint:** Hỗ trợ hoàn thiện nội dung Canvas CP1, báo cáo CP2, cùng với việc rà soát checklist trước khi commit spec.md ở CP4.

## AI hỗ trợ như thế nào


- **Phân tích dữ liệu:** AI giúp viết các đoạn code pandas để group, đếm, lọc dữ liệu từ file CSV lớn. Em luôn kiểm tra lại số liệu đầu ra (ví dụ đối chiếu số 73 học viên, 41.2% turn thiếu citation) trước khi đưa vào spec, không tin tuyệt đối vào con số AI đưa ra.
- **Debug code:** Khi `index.html` bị lỗi tham chiếu field sau khi đổi cấu trúc `demo_data.json` (từ `question`/`answer` sang `question_excerpt`/`answer_excerpt`), AI giúp em rà soát nhanh các chỗ cần sửa đồng bộ.
- **Kiểm tra yêu cầu tổng thể:** Mỗi lần chuyển sang mốc mới (CP2 → CP3 → CP4), em nhờ AI đối chiếu lại với rubric và guide để không bỏ sót tiêu chí chấm điểm — ví dụ phát hiện ra `demo_data.json` vi phạm luật bảo mật khi repo chuyển sang public.
- **Chỉnh sửa prompt:** Sau mỗi lượt đo golden set, em mô tả lỗi phát hiện được (ví dụ AI đồng ý viết lại toàn bộ bài giảng, hoặc tự bịa cấu trúc định nghĩa), AI giúp soạn lại rule cụ thể để thêm vào system prompt, rồi em chạy lại để xác nhận đã sửa đúng chưa.
- **Thiết kế lại test cho phù hợp:** Sau lượt đo 1 chỉ đạt 60%, AI giúp em nhận ra vấn đề không nằm ở AI mà ở cách viết câu hỏi test (dùng mô tả case thay vì câu hỏi tự nhiên) — từ đó viết lại toàn bộ 20 câu hỏi trong golden set cho sát với cách học viên thật sẽ hỏi.

## Một bài học từ case fail của chính nhóm

Bài học lớn nhất với em đến từ chuỗi 3 lượt đo golden set, cho thấy rõ ràng việc đo lường không phải làm một lần là xong.

Ở **lượt 1**, kết quả chỉ đạt 60% (12/20), nhưng khi đọc kỹ từng case fail, em nhận ra phần lớn không phải lỗi của AI mà là lỗi thiết kế bộ test — em viết câu hỏi kiểu mô tả case ("Turn T0154: câu hỏi tương tự về ma trận tác động-nỗ lực") thay vì câu hỏi tự nhiên như học viên thật sẽ gõ. Điều này dạy em rằng: nếu không cẩn thận với cách *hỏi* AI trong lúc test, em sẽ đo sai và kết luận sai về chất lượng sản phẩm.

Nhưng trong lượt 1 đó cũng có một case thật sự nghiêm trọng: khi được yêu cầu "viết lại toàn bộ bài giảng cho dễ hiểu hơn", AI đã đồng ý làm — vi phạm trực tiếp non-goal mà nhóm đặt ra (không được tạo bản thay thế nội dung gốc). Đây là lỗi thật, không phải lỗi test. Nó cho em thấy rằng chỉ viết non-goal trong spec là chưa đủ — phải có rule tường minh trong system prompt và phải test được hành vi đó thì mới chắc chắn sản phẩm tuân thủ.

Sau khi sửa cả 2 vấn đề trên, **lượt 2** tăng lên 89.5%, nhưng lại lộ ra một lỗi tinh vi hơn: AI tự "dựng cấu trúc" — ví dụ tự tổng hợp thành "4 câu hỏi trọng tâm" đánh số rõ ràng, trông rất đáng tin vì có trích dẫn kèm theo, nhưng thực ra transcript gốc chỉ là một câu văn xuôi, không hề có cấu trúc đó. Đây là bài học quan trọng nhất với em: **lỗi bịa nguồn không chỉ có dạng "bịa trắng trợn" mà còn có dạng "làm đẹp nguồn"** — AI không nói sai sự kiện, nhưng trình bày theo cách khiến người đọc tin rằng đó là nguyên văn tài liệu. Nếu không có golden set và chấm kỹ theo 3 chiều, nhóm em chắc chắn sẽ bỏ sót lỗi này vì nhìn qua nó "có vẻ đúng".

Sau khi thêm rule 8 để chặn cụ thể hành vi này, lượt 3 đạt 100%. Nhưng bài học không nằm ở con số 100% — mà ở việc em hiểu ra: đo một lần rồi dừng là chưa đủ, phải đo — tìm lỗi đau nhất — sửa — đo lại, và mỗi lượt đo lại có thể lộ ra một tầng lỗi mới mà lượt trước chưa nhìn thấy.

## Vibe-coding check

Em có thể giải thích được phần em làm nếu bị hỏi ngẫu nhiên tại CP5/CP6: [x] Có