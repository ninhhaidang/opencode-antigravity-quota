# Troubleshooting Guide

This page lists common errors and how to resolve them.

## Authentication Errors

### Error: "No authenticated accounts found"
**Message:** `Error: No authenticated accounts found in .../antigravity-accounts.json`

**Solution:**
The plugin cannot find credentials. You must log in using the Auth plugin:
```bash
opencode auth login
```

### Error: "Token refresh failed"
**Message:** `Error: Token refresh failed` or `400 Bad Request`

**Solution:**
Your refresh token has expired or was revoked. Re-authenticate:
```bash
opencode auth login
```

---

## API Errors

### Error: "Quota fetch failed: 403"
**Message:** `403 Forbidden` or `Permission Denied`

**Cause:**
The Google Cloud Project linked to your account does not have the required API enabled.

**Solution:**
1.  Identify the Project ID (shown in `gquota --account <n>`).
2.  Go to [Google Cloud Console](https://console.cloud.google.com/).
3.  Select that project.
4.  Navigate to **APIs & Services > Library**.
5.  Search for **"Cloud AI Companion API"** (or "Antigravity API").
6.  Click **Enable**.

---

## Display Issues

### Misaligned Table Columns
**Symptom:** The table lines look broken or columns don't line up.

**Solution:**
1.  **Font:** Ensure your terminal uses a Monospaced font (e.g., Fira Code, Consolas, JetBrains Mono).
2.  **Width:** Make sure your terminal window is wide enough (at least 100 characters).
3.  **Characters:** The plugin uses Unicode block characters (`█`). If these don't render, try a different terminal emulator (e.g., Windows Terminal, iTerm2).

---

## Cache Issues

### Stale Data
**Symptom:** Quota shows 100% but you know you just used it.

**Cause:**
To protect your API limits, we cache results for 10 minutes.

**Solution:**
Use the refresh flag to force an update:
```bash
gquota --refresh
```

### Clearing Cache Manually
If the cache file is corrupted, you can delete it:

*   **Windows:** `%LOCALAPPDATA%\opencode\quota-cache.json`
*   **macOS/Linux:** `~/.cache/opencode/quota-cache.json`
