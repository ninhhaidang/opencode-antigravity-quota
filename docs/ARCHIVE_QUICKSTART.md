# 🚀 Quick Start Guide - opencode-antigravity-quota

Hướng dẫn nhanh để sử dụng plugin check quota Google Antigravity.

---

## ⚡ Cài Đặt Nhanh (5 phút)

### 1. Cài Plugin vào OpenCode

```bash
# Vào thư mục OpenCode config
cd ~/.config/opencode  # Windows: C:\Users\Dang\.config\opencode

# Install plugin từ local
npm install D:\ninhhaidang\Workspace\opencode-antigravity-quota
```

### 2. Thêm vào Config

Mở `~/.config/opencode/opencode.json` và thêm:

```json
{
  "plugin": [
    "opencode-antigravity-auth@beta",
    "opencode-antigravity-quota"  ← Thêm dòng này
  ]
}
```

### 3. Cài CLI Command (Optional)

```bash
cd D:\ninhhaidang\Workspace\opencode-antigravity-quota
npm link
```

**Done!** ✅

---

## 📱 Cách Dùng

### Cách 1: CLI Command (Đẹp Nhất) ⭐

```bash
gquota
```

hoặc

```bash
node D:\ninhhaidang\Workspace\opencode-antigravity-quota\bin\cli.mjs
```

**Output:**
- ✅ Full colors
- ✅ Progress bars
- ✅ Chi tiết từng account

### Cách 2: OpenCode Slash Command

Trong OpenCode, gõ:

```
/gquota
```

**Output:**
- ❌ Không có colors
- ❌ Không có progress bars
- ✅ LLM tóm tắt info

---

## 🎯 Khi Nào Dùng Gì?

| Tình Huống | Dùng |
|------------|------|
| Muốn xem quota chi tiết, đẹp | **CLI: `gquota`** |
| Đang code trong OpenCode, check nhanh | **/gquota** |
| Hỏi về quota 1 model cụ thể | Natural language trong OpenCode |

---

## 📊 Hiểu Output

```
✅ = 80-100% quota (OK)
⚠️  = 20-79% quota (Cảnh báo)
🔴 = 0-19% quota (Nguy hiểm!)

[████████████████████] = 100% remaining
[████████░░░░░░░░░░░░] = 42% remaining
```

---

## ❓ FAQ

### Q: Tôi gõ `/gquota` nhưng không thấy màu sắc?

**A:** Đúng rồi! OpenCode's LLM chỉ tóm tắt text. Muốn xem màu sắc → dùng CLI `gquota`.

### Q: CLI command `gquota` không work?

**A:** Bạn chưa `npm link`. Chạy:
```bash
cd D:\ninhhaidang\Workspace\opencode-antigravity-quota
npm link
```

### Q: Cache là gì? Tại sao lần 2 nhanh hơn?

**A:** Plugin cache kết quả trong 10 phút để giảm API calls. Clear cache:
```bash
del "%LOCALAPPDATA%\opencode\quota-cache.json"
```

### Q: Account hiển thị ⚠️ warning?

**A:** Re-authenticate:
```bash
opencode auth login
```

---

## 🔗 Chi Tiết Hơn

Đọc full guide: [USAGE_VI.md](USAGE_VI.md)

---

## 🆘 Cần Help?

1. Check log: `~/.config/opencode/`
2. Clear cache
3. Re-auth: `opencode auth login`
4. [Report issue](https://github.com/ninhhaidang/opencode-antigravity-quota/issues)

---

**Happy coding!** 🚀
