# Usage Guide

## CLI Command: `gquota`

The standalone CLI provides the most detailed visual representation of your quotas.

### Syntax

```bash
gquota [options]
```

### Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--refresh` | `-r` | **Force Refresh:** Ignore the 10-minute cache and fetch fresh data from Google. Useful if you just switched accounts or want real-time data. |
| `--account <n>` | `-a` | **Single Account View:** Show detailed breakdown for a specific account index (e.g., `1`, `2`). |
| `--help` | `-h` | Show help information. |

### Examples

**Check all accounts (Default):**
```bash
gquota
```

**Force refresh data:**
```bash
gquota --refresh
```

**View specific details for Account #2:**
```bash
gquota --account 2
```

---

## OpenCode Plugin Usage

If installed as a plugin, you can interact with it via OpenCode's chat interface.

### Natural Language
Simply ask OpenCode to check your status:

> "Check my Google quota."
> "How much quota do I have left on Gemini?"
> "Is my Claude quota exhausted?"

### Slash Command
You can configure a custom slash command in your OpenCode setup (e.g., `/quota`) that maps to the `google_quota` tool.

---

## Understanding the Output

The output is organized into a **Pivot Table** for easy comparison.

### 1. Quota Pools

Google organizes quotas into specific "pools". We group models accordingly:

*   **ANTIGRAVITY QUOTA POOL**:
    *   Contains **Claude** models (Opus, Sonnet).
    *   Contains **Gemini 3** models (Flash, Pro).
    *   *These models usually share the same "Antigravity" daily limit.*

*   **GEMINI CLI QUOTA POOL**:
    *   Contains **Gemini 2.5** models.
    *   Contains **Gemini 3 Preview** models.
    *   *These are typically managed under the standard Gemini API quota.*

### 2. Status Indicators

We use visual progress bars to show remaining quota:

*   `[██████████] 100%` - **Healthy** (Green)
*   `[██████░░░░]  60%` - **Warning** (Yellow)
*   `[░░░░░░░░░░]   0%` - **Critical/Exhausted** (Red)

### 3. Reset Time

At the bottom of each pool, you'll see a `Reset: 5h` indicator. This tells you approximately when your daily quota will replenish.
