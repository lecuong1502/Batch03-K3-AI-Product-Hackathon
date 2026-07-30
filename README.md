# Ôn tập cá nhân hoá VLearn

**Nhóm:** Cường Độ Đức Trí · **Zone:** D303

## Thành viên & phân công

| Mã HV | Tên | Phụ trách |
|---|---|---|
| 2A202601423 | Trần Công Đức | Evidence & mining |
| 2A202601427 | Lê Kiên Cường | Build flow (prototype) |
| 2A202601715 | Nguyễn Công Trí | Prompt + golden set |
| 2A202601847 | Xuân Thế Độ | Spec + validation |

## Cấu trúc repo

```
repo/
├── README.md          ← file này
├── spec.md             ← AI Spec đầy đủ §1-§9
├── demo-slides.pdf     ← (chưa tạo — làm trước CP6)
├── codebase/            ← prototype (Mock), ghi rõ phần mock/thật trong spec §4
│   ├── index.html
│   ├── demo_data.json
│   ├── transcript_chunks.json
│   ├── .env.example
│   ├── .gitignore
│   └── generate_config.py
├── eval/                 ← golden set + kết quả 3 lượt chạy
│   ├── golden-set.md
│   ├── run_golden_set.py
│   ├── run-1-results.md
│   ├── run-2-results.md
│   └── run-3-results.md
├── validation/          ← (chưa có — làm ở CP5)
└── reflection/           ← (chưa có — mỗi người 1 file, làm ở CP5)
```

## Tóm tắt lát cắt

Học viên chọn một bài giảng đã học → hệ thống lấy các turn của học viên đó trong `day_code` này, ưu tiên turn có `citations` rỗng → đối chiếu lại transcript sạch để tìm đúng đoạn `[Txx-NNN]` → sinh bản tóm tắt ôn tập có trích dẫn thật, thay thế câu trả lời thiếu căn cứ trước đó.

Chi tiết đầy đủ: xem `spec.md`.

## Kết quả kiểm thử (tóm tắt)

Golden set 20 case, quality bar ≥80% pass + 100% lớp ① không bịa nguồn. Kết quả lượt 3: **100% (19/19 case hợp lệ)**. Chi tiết: `eval/run-3-results.md`.

## Cách chạy prototype

```bash
cd codebase/
cp .env.example .env
# điền OPENROUTER_API_KEY=sk-or-... vào .env
python3 generate_config.py
# mở index.html bằng trình duyệt
```