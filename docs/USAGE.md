# Usage Guide

## CLI Usage (Standalone)

The CLI tool `gquota` provides the richest visual experience with colored progress bars and tables.

### Basic Command

```bash
gquota
```

**Output:**
Displays a pivot table showing all your accounts and their quota status for each model.

### Options

| Option | Description |
|--------|-------------|
| `--refresh` | Force a fresh fetch from Google API, bypassing the 10-minute cache. |
| `--account <index>` | Show detailed view for a single account (e.g., `gquota --account 1`). |
| `--help` | Show help message. |

### Examples

**Force refresh data:**
```bash
gquota --refresh
```

**View details for Account #2:**
```bash
gquota --account 2
```

---

## OpenCode Plugin Usage

If installed as a plugin, you can interact with it directly inside OpenCode.

### Slash Command

You can configure a slash command (e.g., `/quota`) in OpenCode to trigger the check.

**Example Task:**
```
/quota
```

OpenCode will execute the tool and summarize the results for you in natural language.

### Natural Language

You can ask OpenCode directly:

> "Check my Google quota status."
> "Which Gemini models have quota left?"
> "Are any of my accounts out of quota?"

---

## Understanding the Output

### Quota Pools

The output is grouped into two main pools based on how Google manages quotas:

1.  **ANTIGRAVITY QUOTA POOL**:
    *   Includes **Claude** models (Sonnet, Opus).
    *   Includes **Gemini 3** models (Flash, Pro).
    *   *Note: These typically share a common quota limit.*

2.  **GEMINI CLI QUOTA POOL**:
    *   Includes **Gemini 2.5** models.
    *   Includes **Gemini 3 Preview** models.

### Indicators

*   `[██████████] 100%`: **Healthy**. Plenty of quota remaining.
*   `[██████░░░░]  60%`: **Warning**. Quota is being used up.
*   `[░░░░░░░░░░]   0%`: **Critical**. Quota exhausted.

### Colors
*   **Green**: > 80% remaining.
*   **Yellow**: 50% - 79% remaining.
*   **Red**: < 50% remaining.
