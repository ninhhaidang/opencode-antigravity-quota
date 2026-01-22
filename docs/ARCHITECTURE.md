# Architecture

This document describes the internal structure and flow of `opencode-antigravity-quota`.

## Overview

The plugin is a TypeScript-based CLI tool and OpenCode plugin that:
1.  Reads account credentials managed by `opencode-antigravity-auth`.
2.  Refreshes OAuth tokens using Google's internal endpoints.
3.  Queries the internal Antigravity Quota API.
4.  Processes and formats the data for display.

## Directory Structure

```
src/
├── index.ts       # Entry point for OpenCode plugin
├── cli-args.ts    # CLI argument parsing (commander/yargs style)
├── auth.ts        # Credential management & token refresh
├── quota.ts       # API fetching logic
├── format.ts      # Output formatting (ANSI colors, tables)
├── cache.ts       # File-based caching system
├── constants.ts   # Config, URLs, colors
└── types.ts       # TypeScript interfaces
bin/
└── cli.mjs        # Executable entry point for 'gquota'
```

## Data Flow

1.  **Initialization (`bin/cli.mjs`)**:
    *   Parses command line arguments (`--refresh`, `--account`).
    *   Calls `checkQuota()` from `index.ts`.

2.  **Quota Check (`src/index.ts`)**:
    *   Checks cache (`src/cache.ts`). If valid and not forced refresh, returns cached data.
    *   If no cache:
        *   Reads `antigravity-accounts.json`.
        *   Iterates through accounts (Promise.all for parallelism).

3.  **Account Processing (`src/quota.ts` & `src/auth.ts`)**:
    *   **Refresh Token:** Calls `https://account.google.com/o/oauth2/token`.
    *   **Project Info:** Fetches project tier/ID.
    *   **Quota API:** POST to `https://clients6.google.com/.../quota`.
    *   **Parsing:** Filters models (Gemini/Claude) and calculates percentages.

4.  **Formatting (`src/format.ts`)**:
    *   **Pivot Table:** Groups models by "Pools" (Antigravity vs Gemini CLI).
    *   **Progress Bars:** Generates Unicode block bars (`[████░░]`).
    *   **Colors:** Applies ANSI color codes based on health (Green > 80%, Red < 50%).

5.  **Output**:
    *   Prints to `stdout`.
    *   Saves result to `quota-cache.json`.

## Key Dependencies

*   **Runtime:** Node.js >= 20.0.0
*   **Dev:** TypeScript, `@types/node`
*   **Peer:** `@opencode-ai/plugin` (only for type definitions, run-time is standalone)

## Caching Strategy

*   **Storage:** JSON file in OS-specific config directory.
*   **TTL:** 10 minutes (default).
*   **Key:** Global cache (all accounts are cached together).
*   **Invalidation:** Automatic on TTL expiry or manual via `--refresh`.
