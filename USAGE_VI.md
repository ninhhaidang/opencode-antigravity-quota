# Hướng Dẫn Sử Dụng - opencode-antigravity-quota

Plugin để check quota Google Antigravity cho multi-account setup.

## 📋 Yêu Cầu

Trước khi sử dụng, bạn cần:
- ✅ Đã cài `opencode-antigravity-auth@beta`
- ✅ Đã authenticate ít nhất 1 Google account
- ✅ Node.js >= 20.0.0

## 🚀 Cài Đặt

### Bước 1: Clone và Build

```bash
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota
npm install
npm run build
```

### Bước 2: Install Plugin

```bash
# Install globally để dùng CLI command
npm link

# Install vào OpenCode
cd ~/.config/opencode  # Windows: C:\Users\<User>\.config\opencode
npm install D:\ninhhaidang\Workspace\opencode-antigravity-quota
```

### Bước 3: Cấu Hình OpenCode

Thêm vào `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-antigravity-auth@beta",
    "opencode-antigravity-quota"
  ]
}
```

### Bước 4: Tạo Slash Command (Optional)

Tạo file `~/.config/opencode/commands/gquota.md`:

```markdown
---
description: Check Google/Antigravity quota for all accounts  
---

Use the google_quota tool to check my quota.
```

## 💡 Cách Sử Dụng

### Phương Pháp 1: CLI Command ⭐ (Khuyên Dùng)

**Ưu điểm:** Hiển thị đầy đủ màu sắc, progress bars, đẹp nhất!

```bash
# Nếu đã npm link:
gquota

# Hoặc chạy trực tiếp:
node D:\ninhhaidang\Workspace\opencode-antigravity-quota\bin\cli.mjs
```

**Output mẫu:**

![image](https://i.imgur.com/example.png)

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

    ✅ Gemini 3 Pro (High)
       [████████████████████] 100% remaining
       Resets in: 5h

  Claude Models:
    ✅ Claude Sonnet 4.5
       [████████████████████] 100% remaining
       Resets in: 4h 56m

────────────────────────────────────────────────────────────

Account #2: ninhhailongg@gmail.com
  ...

────────────────────────────────────────────────────────────

Account #3: bonglantrungmuoj@gmail.com
  ...

════════════════════════════════════════════════════════════
Summary:
✅ 3/3 accounts healthy
💾 Cache valid for: 8 minutes
```

### Phương Pháp 2: Slash Command trong OpenCode

Trong OpenCode terminal, gõ:

```
/gquota
```

**Output:** OpenCode's LLM sẽ **tóm tắt** quota info:

```
Your Antigravity quota check is complete! Here's a summary:

Quota Status:
- All accounts at 100% quota for both Claude and Gemini models
- Quotas reset in approximately 5 hours
- 3 accounts available

Your quota is fully available and all systems are ready to use!
```

**Lưu ý:** OpenCode không hiển thị màu sắc/progress bars, chỉ tóm tắt text.

### Phương Pháp 3: Natural Language trong OpenCode

Trong OpenCode chat, gõ:

```
> Check my Google quota
> Tôi còn bao nhiêu quota Gemini?
> Show quota for all accounts
```

LLM sẽ tự động gọi tool và trả lời.

## 📊 So Sánh Các Phương Pháp

| Phương Pháp | Màu Sắc | Progress Bars | Chi Tiết | Tốc Độ |
|-------------|---------|---------------|----------|--------|
| **CLI Command** | ✅ | ✅ | ✅✅✅ | ⚡⚡⚡ |
| Slash Command | ❌ | ❌ | ✅✅ | ⚡⚡ |
| Natural Language | ❌ | ❌ | ✅ | ⚡ |

**Khuyến nghị:**
- **Dùng CLI** khi muốn xem chi tiết quota, đẹp, dễ đọc
- **Dùng /gquota** khi đang code trong OpenCode, cần check nhanh
- **Dùng natural language** khi muốn hỏi cụ thể về 1 model

## 🔄 Cache

Plugin tự động cache kết quả trong **10 phút** để:
- Giảm API calls
- Tăng tốc độ check quota
- Tiết kiệm quota của Google API

**Cache location:**
- **Windows:** `C:\Users\<User>\AppData\Local\opencode\quota-cache.json`
- **Linux/Mac:** `~/.cache/opencode/quota-cache.json`

**Clear cache:**
```bash
# Windows
del "%LOCALAPPDATA%\opencode\quota-cache.json"

# Linux/Mac
rm ~/.cache/opencode/quota-cache.json
```

## 📈 Hiểu Output

### Status Icons

- ✅ **Green (80-100%)** - Quota khỏe mạnh, sử dụng thoải mái
- ⚠️  **Yellow (20-79%)** - Cảnh báo, cân nhắc chuyển account
- 🔴 **Red (0-19%)** - Nguy hiểm, quota sắp hết

### Progress Bars

```
[████████████████████] 100% remaining  ← Full quota
[████████████░░░░░░░░]  60% remaining  ← Warning
[████░░░░░░░░░░░░░░░░]  20% remaining  ← Critical
```

### Thông Tin Mỗi Account

- **Project ID:** Google Cloud project đang dùng
- **Tier:** Subscription tier (thường là "Antigravity")
- **Last used:** Lần cuối account được dùng
- **Models:** List các models với quota riêng

## ❌ Xử Lý Lỗi

### Lỗi: "No authenticated accounts found"

**Nguyên nhân:** Chưa authenticate account nào.

**Giải pháp:**
```bash
opencode auth login
```

### Lỗi: "Token refresh failed"

**Nguyên nhân:** Refresh token hết hạn hoặc invalid.

**Giải pháp:**
```bash
opencode auth login
# Chọn account bị lỗi và re-authenticate
```

### Account Hiển Thị ⚠️ Warning

**Ví dụ:**
```
Account #3: bonglantrungmuoj@gmail.com
  ⚠️  Status: Could not fetch quota
  Reason: Token refresh failed: 401 - invalid_grant
  Last used: 3 days ago
  Suggestion: Re-authenticate with 'opencode auth login'
```

**Giải pháp:** Làm theo suggestion, thường là re-authenticate.

**Plugin sẽ tiếp tục check accounts khác** - đây là Option C error handling!

## 🎯 Use Cases

### 1. Monitor Quota Hàng Ngày

Chạy mỗi sáng để check quota:
```bash
gquota
```

### 2. Check Trước Khi Run Task Lớn

Trước khi chạy task tốn nhiều tokens:
```
/gquota
```

### 3. Debug Rate Limiting

Khi bị rate limit, check xem account nào còn quota:
```bash
gquota
```

### 4. Balance Load Across Accounts

Xem account nào còn nhiều quota nhất để chuyển sang dùng.

## 📝 Tips & Tricks

### 1. Alias Ngắn Gọn

Thêm vào `.bashrc` hoặc `.zshrc`:

```bash
alias q='gquota'
```

Sau đó chỉ cần gõ `q` để check quota!

### 2. Auto-Check Quota

Thêm vào startup script để auto-check quota mỗi khi mở terminal:

```bash
# Thêm vào ~/.bashrc
if command -v gquota &> /dev/null; then
  gquota
fi
```

### 3. Combine với Watch

Để monitor quota real-time:

```bash
watch -n 60 gquota  # Update mỗi 60 giây
```

### 4. Export Quota Data

Cache file là JSON, có thể parse:

```bash
cat "$LOCALAPPDATA/opencode/quota-cache.json" | jq '.data'
```

## 🆘 Support

Nếu gặp vấn đề:

1. **Check logs:** OpenCode có logs ở `~/.config/opencode/`
2. **Clear cache:** Thử xóa quota cache file
3. **Re-authenticate:** `opencode auth login`
4. **Report issue:** [GitHub Issues](https://github.com/ninhhaidang/opencode-antigravity-quota/issues)

## 🔗 Links

- **GitHub:** https://github.com/ninhhaidang/opencode-antigravity-quota
- **opencode-antigravity-auth:** https://github.com/NoeFabris/opencode-antigravity-auth
- **OpenCode Docs:** https://opencode.ai/docs

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-22
