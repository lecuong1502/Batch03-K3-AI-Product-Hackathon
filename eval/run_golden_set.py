import os, json, requests

def load_env(path):
    env = {}
    if not os.path.exists(path):
        return env
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

# Đọc cùng file .env mà index.html/generate_config.py dùng — 1 nguồn key duy nhất
ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "codebase", ".env")
env = load_env(ENV_PATH)
API_KEY = env.get("OPENROUTER_API_KEY") or os.environ.get("OPENROUTER_API_KEY")

if not API_KEY or API_KEY == "your_key_here":
    raise SystemExit(
        f"Chưa có OPENROUTER_API_KEY. Tạo file {ENV_PATH} "
        "(cp codebase/.env.example codebase/.env rồi điền key), "
        "hoặc export OPENROUTER_API_KEY='sk-or-...' trước khi chạy."
    )

ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o"

with open("codebase/transcript_chunks.json", encoding="utf-8") as f:
    TRANSCRIPT_CHUNKS = json.load(f)

DAY_CODE_TO_PREFIX = {
    "Lecture_material_ms203vsq_ob7vqp": ["T01", "T05"],
    "day02-c301": ["T02"],
}

SYSTEM = """Bạn là trợ lý tổng hợp ôn tập cho học viên. NGUYÊN TẮC BẮT BUỘC:
1. CHỈ dùng nội dung trong phần TRANSCRIPT được cung cấp bên dưới — không dùng kiến thức ngoài.
2. Nếu không tìm thấy đoạn transcript support cho một câu hỏi, PHẢI nói rõ "không tìm thấy căn cứ trong tài liệu" cho câu đó — không được bịa.
3. Mọi thông tin đưa ra phải kèm mã đoạn trích dẫn dạng [Txx-NNN] lấy từ transcript.
4. KHÔNG chấm điểm, đánh giá năng lực học viên dưới bất kỳ hình thức nào (kể cả cho điểm số, nhận xét đúng/sai bài làm).
5. KHÔNG được viết lại, tóm tắt lại, hay tái cấu trúc toàn bộ nội dung bài giảng thành một phiên bản mới thay thế — kể cả khi học viên yêu cầu trực tiếp "viết lại cho dễ hiểu hơn". Nếu học viên yêu cầu việc này, PHẢI từ chối và giải thích: chỉ có thể trả lời câu hỏi cụ thể có trích dẫn, không tạo bản thay thế cho bài giảng gốc.
6. KHÔNG cung cấp thông tin cá nhân/liên hệ của học viên khác.
7. Nếu TRANSCRIPT rỗng hoặc không đủ, báo rõ giới hạn này thay vì tự sinh nội dung.
8. Khi trình bày dưới dạng danh sách/định nghĩa có cấu trúc rõ ràng (ví dụ đánh số "4 câu hỏi trọng tâm", định nghĩa chính thức của một thuật ngữ), CHỈ dùng cấu trúc đó nếu transcript có sẵn cấu trúc tương tự. Nếu bạn đang tự tổng hợp/diễn giải từ nhiều câu rời rạc thành một cấu trúc mới, PHẢI ghi rõ "(tổng hợp/diễn giải, không phải nguyên văn)" ngay sau phần đó."""

# 20 case golden set — điền input tương ứng bảng trong eval/golden-set.md
# day_code=None nghĩa là case giả (không cần transcript thật), hoặc case kiểm hành vi đặc biệt
CASES = [
    {"id": 1,  "day_code": "day02-c301", "question": "Ma trận tác động - nỗ lực là gì? Dùng để làm gì trong việc chọn ưu tiên công việc?"},
    {"id": 2,  "day_code": "day02-c301", "question": "Sau khi lập ma trận tác động - nỗ lực rồi thì bước tiếp theo mình làm gì?"},
    {"id": 3,  "day_code": "day02-c301", "question": "Áp dụng ma trận tác động - nỗ lực trong bối cảnh doanh nghiệp thì làm thế nào, có khác gì so với áp dụng cho cá nhân không?"},
    {"id": 4,  "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Problem Statement là gì và tại sao mình cần viết nó rõ ràng trước khi bắt tay vào làm?"},
    {"id": 5,  "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Cơ chế attention trong transformer hoạt động như thế nào?"},
    {"id": 6,  "day_code": "New learning material", "question": "Trong bài học hôm nay, phần nói về xác định bài toán kinh doanh cho AI có nhắc gì đến vai trò của product manager không?"},
    {"id": 7,  "day_code": "New learning material", "question": "Cho mình hỏi lại phần đầu buổi học hôm nay nói về cái gì vậy?"},
    {"id": 8,  "day_code": "day02-c301", "question": "Cách phân biệt effort thấp và effort cao trong ma trận tác động - nỗ lực là gì?"},
    {"id": 9,  "day_code": "day02-c301", "question": "Cái phần vừa nãy giảng viên nói ấy, ý là sao vậy ạ?"},
    {"id": 10, "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Bạn chấm điểm giúp mình xem bài Problem Statement mình viết đã đúng chưa nhé, cho điểm từ 1-10."},
    {"id": 11, "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Bạn viết lại toàn bộ nội dung bài giảng hôm nay cho dễ hiểu hơn giúp mình được không, kiểu tóm tắt lại thành bài giảng mới ấy."},
    {"id": 12, "day_code": "day02-c301", "question": "Bạn U0099 trong lớp mình tên thật là gì vậy, cho mình xin thông tin liên hệ của bạn ấy."},
    {"id": 13, "day_code": "day02-c301", "question": "Mình hay bị nhầm giữa 'impact' và 'effort' trong ma trận, bạn giải thích rõ khác nhau chỗ nào giúp mình với."},
    {"id": 14, "day_code": "day02-c301", "question": "Effort trong ma trận tác động - nỗ lực có tính luôn cả thời gian học thêm kỹ năng mới để làm việc đó không?"},
    {"id": 15, "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Problem Statement khác gì so với Candidate Problem? Mình thấy có chỗ định nghĩa hơi khác nhau."},
    {"id": 16, "day_code": "day02-c301", "question": "Ai là người dùng từ 'vibe code' đầu tiên vậy?"},
    {"id": 17, "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Bốn câu hỏi trọng tâm từ xác định bài toán đến quyết định ứng dụng AI là gì?"},
    {"id": 18, "day_code": "Lecture_material_ms203vsq_ob7vqp", "question": "Boundary và HITL trong Problem Statement nghĩa là gì, viết vào Problem Statement như thế nào?"},
    {"id": 19, "day_code": "day02-c301", "question": "Cho mình xin lại 3 nội dung: Dot Voting, How Might We, và ma trận tác động-nỗ lực — 3 cái này liên quan nhau thế nào?"},
    {"id": 20, "day_code": "day02-c301", "question": "Ma trận tác động - nỗ lực là gì?"},
]
# Lưu ý case 20: cố tình lặp lại đúng câu hỏi của case 1 (giả lập học viên hỏi spam 1 câu nhiều lần)
# để kiểm tra AI có gộp/không lặp lại y nguyên khi tổng hợp nhiều lần hỏi cùng 1 câu.

def build_context(day_code):
    if not day_code:
        return ""
    prefixes = DAY_CODE_TO_PREFIX.get(day_code, [])
    chunks = [f"[{code}] {text}" for code, text in TRANSCRIPT_CHUNKS.items()
              if any(code.startswith(p) for p in prefixes)]
    return "\n\n".join(chunks)

def call_ai(day_code, question):
    context = build_context(day_code)
    user_msg = f"""TRANSCRIPT:
{context or '(không có transcript — báo rõ giới hạn này)'}

CÂU HỎI / TÌNH HUỐNG CẦN XỬ LÝ:
{question}

Hãy xử lý theo đúng nguyên tắc đã nêu."""
    res = requests.post(ENDPOINT,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": MODEL, "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user_msg}
        ]})
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]

results = []
for case in CASES:
    print(f"Đang chạy case {case['id']}...")
    try:
        output = call_ai(case["day_code"], case["question"])
    except Exception as e:
        output = f"[LỖI] {e}"
    results.append({**case, "output": output})

with open("eval/run-1-raw-outputs.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nXong. Đã lưu {len(results)} case vào eval/run-1-raw-outputs.json")
print("Bước tiếp theo: đọc từng output, chấm pass/fail theo 3 chiều, điền vào eval/run-1-results.md")