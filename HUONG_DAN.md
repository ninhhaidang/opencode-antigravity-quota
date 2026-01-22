# 📖 Hướng Dẫn Sử Dụng Plugin - TÓM TẮT

## 🎯 Plugin Đã Sẵn Sàng!

Plugin **opencode-antigravity-quota** đã được cài đặt thành công vào OpenCode của bạn!

---

## ⚡ Cách Dùng Nhanh

### 1️⃣ CLI Command (Khuyên Dùng) ⭐

**Command:**
```bash
gquota
```

hoặc đường dẫn đầy đủ:
```bash
node D:\ninhhaidang\Workspace\opencode-antigravity-quota\bin\cli.mjs
```

**Kết quả:**
```
Google/Antigravity Quota - Multi-Account
════════════════════════════════════════════════════════════

Account #1: ninhhaidangg@gmail.com
  Project: opencode-antigravity-485009
  Tier: Antigravity
  Last used: 3 minutes ago

  Gemini Models:
    ✅ Gemini 2.5 Flash
       [████████████████████] 100% remaining
       Resets in: 5h

    ✅ Claude Sonnet 4.5
       [████████████████████] 100% remaining
       Resets in: 4h 56m

────────────────────────────────────────────────────────────
Account #2: ...
Account #3: ...
════════════════════════════════════════════════════════════
Summary:
✅ 3/3 accounts healthy
💾 Cache valid for: 8 minutes
```

**Ưu điểm:**
- ✅ Full colors (xanh/vàng/đỏ)
- ✅ Progress bars đẹp
- ✅ Chi tiết từng account
- ✅ Dễ đọc

---

### 2️⃣ OpenCode Slash Command

**Command trong OpenCode:**
```
/gquota
```

**Kết quả:**
```
Your Antigravity quota check is complete! Here's a summary:

Quota Status:
- All accounts at 100% quota for both Claude and Gemini models
- Quotas reset in approximately 5 hours
- 3 accounts available: ninhhaidangg, ninhhailongg, bonglantrungmuoj

Your quota is fully available and all systems are ready to use!
```

**Ưu điểm:**
- ✅ Quick check trong lúc code
- ✅ LLM tóm tắt dễ hiểu
- ❌ Không có colors/progress bars

---

### 3️⃣ Natural Language (OpenCode)

**Hỏi tự nhiên:**
```
> Check my Google quota
> Tôi còn bao nhiêu quota?
> Show me Claude quota
```

**LLM sẽ tự gọi tool và trả lời.**

---

## 📊 So Sánh

| Method | Colors | Progress Bars | Chi Tiết | Khuyên Dùng Khi |
|--------|--------|---------------|----------|-----------------|
| **CLI `gquota`** | ✅ | ✅ | ✅✅✅ | Muốn xem quota đầy đủ |
| **/gquota** | ❌ | ❌ | ✅✅ | Đang code, check nhanh |
| Natural Language | ❌ | ❌ | ✅ | Hỏi về model cụ thể |

---

## 🔑 Hiểu Kết Quả

### Status Icons
- ✅ **Green** = 80-100% quota → OK, dùng thoải mái
- ⚠️  **Yellow** = 20-79% quota → Cảnh báo, cân nhắc chuyển account
- 🔴 **Red** = 0-19% quota → Nguy hiểm, sắp hết!

### Progress Bars
```
[████████████████████] 100% = Full quota
[████████████░░░░░░░░]  60% = Còn 60%
[████░░░░░░░░░░░░░░░░]  20% = Sắp hết!
```

---

## ❌ Xử Lý Lỗi Thường Gặp

### Lỗi 1: "No authenticated accounts found"

**Giải pháp:**
```bash
opencode auth login
```

### Lỗi 2: "Token refresh failed"

**Giải pháp:**
```bash
opencode auth login  # Re-authenticate account
```

### Lỗi 3: Account hiển thị ⚠️ warning

**Ví dụ:**
```
Account #3: bonglantrungmuoj@gmail.com
  ⚠️  Status: Could not fetch quota
  Suggestion: Re-authenticate with 'opencode auth login'
```

**Giải pháp:** Làm theo suggestion → `opencode auth login`

**Lưu ý:** Plugin sẽ **tiếp tục check các accounts khác**, không bị dừng!

---

## 💡 Tips Hữu Ích

### 1. Tạo Alias Ngắn

Thêm vào `.bashrc` hoặc `.zshrc`:

```bash
alias q='gquota'
```

Sau đó chỉ cần gõ `q` thay vì `gquota`!

### 2. Cache 10 Phút

Plugin tự động cache để giảm API calls. Lần check thứ 2 sẽ nhanh hơn!

**Clear cache khi cần:**
```bash
# Windows
del "%LOCALAPPDATA%\opencode\quota-cache.json"

# Linux/Mac
rm ~/.cache/opencode/quota-cache.json
```

### 3. Check Trước Khi Run Task Lớn

Trước khi chạy task tốn nhiều tokens:
```bash
gquota  # Check xem account nào còn nhiều quota
```

---

## 📁 File Locations

### Plugin Code
```
D:\ninhhaidang\Workspace\opencode-antigravity-quota\
```

### Cache File
```
C:\Users\Dang\AppData\Local\opencode\quota-cache.json
```

### Command File
```
C:\Users\Dang\.config\opencode\commands\gquota.md
```

### Config File
```
C:\Users\Dang\.config\opencode\opencode.json
```

---

## 📚 Tài Liệu Chi Tiết

- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Full Guide:** [USAGE_VI.md](USAGE_VI.md)
- **README:** [README.md](README.md)

---

## 🚀 Next Steps (Push to GitHub)

Khi bạn sẵn sàng push lên GitHub:

```bash
# 1. Tạo repo trên GitHub: opencode-antigravity-quota

# 2. Add remote và push
cd D:\ninhhaidang\Workspace\opencode-antigravity-quota
git remote add origin https://github.com/ninhhaidang/opencode-antigravity-quota.git
git branch -M main
git push -u origin main

# 3. Tag version
git tag v1.0.0
git push --tags
```

---

## ✅ Summary

**Plugin hoạt động ở 2 modes:**

1. **OpenCode Plugin** → LLM summarize quota info
2. **Standalone CLI** → Full colors & progress bars

**Cả 2 đều dùng chung:**
- Same authentication (antigravity-auth)
- Same cache (10 min TTL)
- Same API endpoints

**Khuyến nghị:**
- Dùng **CLI `gquota`** cho experience tốt nhất
- Dùng **/gquota** khi đang code trong OpenCode

---

**Happy coding!** 🎉

*Plugin version: 1.0.0*  
*Last updated: 2026-01-22*
