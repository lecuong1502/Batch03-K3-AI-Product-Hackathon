import os
 
env_path = os.path.join(os.path.dirname(__file__), ".env")
if not os.path.exists(env_path):
    raise SystemExit("Chưa có file .env — chạy: cp .env.example .env, rồi điền key vào đó.")
 
env = {}
with open(env_path, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()
 
key = env.get("OPENROUTER_API_KEY", "")
if not key or key == "your_key_here":
    raise SystemExit("OPENROUTER_API_KEY chưa được điền trong .env")
 
config_path = os.path.join(os.path.dirname(__file__), "config.js")
with open(config_path, "w", encoding="utf-8") as f:
    f.write(f"window.OPENROUTER_API_KEY = {key!r};\n")
 
print(f"Đã sinh {config_path} — index.html giờ có thể đọc key mà không cần nhập tay.")
print("⚠️ config.js đã nằm trong .gitignore — không commit file này lên repo.")