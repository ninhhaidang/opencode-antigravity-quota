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

### Quick Install (Recommended)

```bash
# Clone and build
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota
npm install
npm run build

# Install globally for CLI command
npm link

# Install as OpenCode plugin
cd ~/.config/opencode
npm install /path/to/opencode-antigravity-quota
```

Then add to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-quota"]
}
```

### As NPM Package (When Published)

```bash
# Install globally
npm install -g opencode-antigravity-quota

# Install as OpenCode plugin
cd ~/.config/opencode
npm install opencode-antigravity-quota
```

Then add to OpenCode config (same as above)

## Usage

### ⭐ Recommended: Standalone CLI Command

For the **best experience** with full colors and progress bars, use the standalone CLI:

```bash
# After installation with npm link or global install:
gquota

# Or run directly:
node D:\ninhhaidang\Workspace\opencode-antigravity-quota\bin\cli.mjs
```

**Output:**
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
...
════════════════════════════════════════════════════════════
Summary:
✅ 3/3 accounts healthy
💾 Cache valid for: 8 minutes
```

### Via OpenCode Slash Command

Create `~/.config/opencode/commands/gquota.md`:

```markdown
---
description: Check Google/Antigravity quota for all accounts  
---

Use the google_quota tool to check my quota.
```

Then run in OpenCode:
```
/gquota
```

**Note:** OpenCode's LLM will **summarize** the quota info in natural language. For full formatted output with colors, use the standalone CLI above.

### Via Natural Language (in OpenCode)

In OpenCode chat:
```
> Check my Google quota
> How much Gemini quota do I have left?
> Show me my Claude model quotas
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

## CLI vs OpenCode Plugin

### CLI Command (Full Formatted Output)
```bash
gquota
```
Shows **colored progress bars** and full formatting in terminal.

### OpenCode Plugin (LLM Summary)
```
/gquota
```
OpenCode's LLM **interprets and summarizes** the quota info:
```
Your Antigravity quota check is complete! Here's a summary:

Quota Status:
- All accounts at 100% quota for both Claude and Gemini models
- Quotas reset in approximately 5 hours
- 3 accounts available: ninhhaidangg, ninhhailongg, bonglantrungmuoj

Your quota is fully available and all systems are ready to use!
```

**Recommendation:** Use **CLI** for detailed quota monitoring, use **OpenCode plugin** for quick checks during development.

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
