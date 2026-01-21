# opencode-antigravity-quota

Check Google Antigravity quota for multi-account setups in OpenCode.

[![npm version](https://img.shields.io/npm/v/opencode-antigravity-quota.svg)](https://www.npmjs.com/package/opencode-antigravity-quota)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- ✅ **Multi-account support** - Checks all authenticated accounts
- 📊 **Per-account quota breakdown** - Gemini & Claude models
- 🎨 **Colored terminal output** - Progress bars and status indicators
- ⚡ **Smart caching** - 10-minute TTL to reduce API calls
- 🔄 **Auto token refresh** - Handles expired tokens automatically
- ⚠️  **Detailed error messages** - With actionable suggestions

## Installation

### Prerequisites

This plugin requires:
- **[opencode-antigravity-auth@beta](https://github.com/NoeFabris/opencode-antigravity-auth)** plugin installed and configured
- At least one authenticated Google account
- Node.js >= 20.0.0

### As NPM Package

```bash
npm install -g opencode-antigravity-quota
```

Then add to your OpenCode config (`~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-quota"]
}
```

### From Source

1. Clone this repo:
```bash
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota
```

2. Build:
```bash
npm install
npm run build
```

3. Link globally:
```bash
npm link
```

4. Add to OpenCode config (same as above)

## Usage

### Via Slash Command

Create `~/.config/opencode/commands/gquota.md`:

```markdown
---
description: Check Google/Antigravity quota for all accounts
---

Check my Google/Antigravity quota using the google_quota tool.
```

Then run in OpenCode:
```
/gquota
```

### Via Natural Language

In OpenCode chat:
```
> Check my Google quota
> How much Gemini quota do I have left?
> Show me my Claude model quotas
```

## Output Example

```
Google/Antigravity Quota - Multi-Account
════════════════════════════════════════════════════════════

Account #1: ninhhaidangg@gmail.com
  Project: opencode-antigravity-485009
  Tier: GEMINI_1_5_PRO_AND_EXPERIMENTAL
  Last used: 2 hours ago

  Gemini Models:
    ✅ Gemini 3 Pro
       [████████████████████] 100% remaining
       Resets in: 23h 45m

    ⚠️  Gemini 3 Flash
       [████████░░░░░░░░░░░░] 42% remaining
       Resets in: 5h 12m

  Claude Models:
    ✅ Claude Sonnet 4.5
       [██████████████████░░] 95% remaining
       Resets in: 1d 3h

────────────────────────────────────────────────────────────

Account #2: ninhhailongg@gmail.com
  Project: coherent-window-485009-f4
  Tier: GEMINI_1_5_PRO_AND_EXPERIMENTAL
  Last used: 5 hours ago

  ...

────────────────────────────────────────────────────────────

Account #3: bonglantrungmuoj@gmail.com
  ⚠️  Status: Could not fetch quota
  Reason: Token refresh failed: 401 - invalid_grant
  Last used: 3 days ago
  Suggestion: Re-authenticate with 'opencode auth login'

════════════════════════════════════════════════════════════
Summary:
✅ 2/3 accounts healthy
❌ 1 account needs attention
💾 Cache valid for: 8 minutes
```

## Configuration

No configuration needed! The plugin automatically:
- Reads accounts from `antigravity-accounts.json`
- Uses OAuth credentials from `opencode-antigravity-auth`
- Caches results for 10 minutes

### Cache Location

- **Windows:** `%LOCALAPPDATA%\opencode\quota-cache.json`
- **Linux/Mac:** `~/.cache/opencode/quota-cache.json`

To clear cache manually:
```bash
# Windows
del "%LOCALAPPDATA%\opencode\quota-cache.json"

# Linux/Mac
rm ~/.cache/opencode/quota-cache.json
```

## Quota Status Indicators

- ✅ **Green (80-100%)** - Healthy quota
- ⚠️  **Yellow (20-79%)** - Warning - consider switching accounts
- 🔴 **Red (0-19%)** - Critical - quota almost exhausted

## Error Handling

This plugin uses **graceful error handling**:
- If one account fails, it continues checking other accounts
- Each error includes specific suggestions for fixing the issue
- Common errors (token expired, network issues) are detected and explained

### Common Issues

#### "No authenticated accounts found"

**Solution:** Authenticate with:
```bash
opencode auth login
```

#### "Token refresh failed"

**Cause:** Refresh token expired or invalid.

**Solution:** Re-authenticate:
```bash
opencode auth login
```

#### "Quota fetch failed: 403"

**Cause:** Project permissions issue.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable "Cloud AI Companion API"

## Architecture

```
Plugin Flow:
1. Check cache (10 min TTL)
2. If cache miss → Read antigravity-accounts.json
3. For each account (in parallel):
   a. Refresh OAuth token
   b. Fetch project info (tier, etc.)
   c. Fetch quota from Antigravity API
   d. Parse models (Gemini + Claude)
4. Format output with colors
5. Cache results
6. Return formatted string
```

## API Reference

### Tool: `google_quota`

**Description:** Check Google/Antigravity quota for all accounts

**Parameters:** None

**Returns:** Formatted string with quota information

**Example:**
```typescript
// In OpenCode plugin
await context.client.tool.execute('google_quota', {});
```

## Development

### Setup

```bash
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota
npm install
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Test Locally

```bash
npm link
```

Then test in OpenCode with `/gquota` command.

## Related Projects

- [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) - Multi-account Google OAuth plugin (required)
- [opencode-google-quota](https://github.com/nguyenngothuong/opencode-google-quota) - Single-account quota checker (inspiration)

## Contributing

PRs welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR

## License

MIT License - see [LICENSE](LICENSE) file

## Author

**NinhHaiDang**
- GitHub: [@ninhhaidang](https://github.com/ninhhaidang)

## Acknowledgments

- Inspired by [opencode-google-quota](https://github.com/nguyenngothuong/opencode-google-quota)
- Uses APIs from [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
- Built for the [OpenCode](https://opencode.ai) community

---

**Last updated:** 2026-01-21 | **Version:** 1.0.0
