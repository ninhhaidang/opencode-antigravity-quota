# Troubleshooting

Common issues and how to resolve them.

## 1. "No authenticated accounts found"

**Error:**
```
Error: No authenticated accounts found in .../antigravity-accounts.json
```

**Cause:**
The plugin cannot find the credentials file created by `opencode-antigravity-auth`.

**Solution:**
You need to authenticate using the auth plugin first. Run:
```bash
opencode auth login
```
Follow the browser instructions to log in.

## 2. "Quota fetch failed: 403"

**Error:**
```
Error: Quota fetch failed: 403 - Forbidden
```

**Cause:**
The Google Cloud Project associated with the account does not have the necessary APIs enabled.

**Solution:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select the project ID shown in the error (or list it via `gquota --account <n>`).
3.  Navigate to **APIs & Services > Library**.
4.  Search for **"Cloud AI Companion API"** (or Antigravity API).
5.  Click **Enable**.

## 3. "Token refresh failed"

**Error:**
```
Error: Token refresh failed
```

**Cause:**
The refresh token for the account has expired or been revoked.

**Solution:**
Re-authenticate the account:
```bash
opencode auth login
```

## 4. Output Alignment Issues

**Issue:**
Columns in the table look misaligned (e.g., lines are broken or shifted).

**Cause:**
This is usually due to:
*   **Font:** Your terminal font doesn't support the Unicode block characters (`█`, `░`) or box-drawing characters (`│`, `─`) correctly.
*   **Width:** The terminal window is too narrow.

**Solution:**
*   Try using a Nerd Font (e.g., FiraCode, JetBrains Mono).
*   Widen your terminal window.
*   The plugin uses fixed-width formatting (19 chars for account columns), so standard monospaced fonts should work fine.

## 5. Cache Issues

**Issue:**
Data seems stale or outdated.

**Cause:**
The plugin caches results for 10 minutes to avoid hitting API rate limits.

**Solution:**
Force a refresh:
```bash
gquota --refresh
```

To manually clear the cache file:
*   **Windows:** Delete `%LOCALAPPDATA%\opencode\quota-cache.json`
*   **Mac/Linux:** Delete `~/.cache/opencode/quota-cache.json`
