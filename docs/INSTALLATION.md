# Installation Guide

## Prerequisites

Before installing `opencode-antigravity-quota`, ensure you have:

1.  **Node.js**: Version 20.0.0 or higher.
2.  **OpenCode**: Installed and configured.
3.  **opencode-antigravity-auth**: This plugin depends on the auth plugin to manage credentials.
    *   Repo: [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
    *   Ensure you have authenticated at least one account using `opencode auth login`.

## Installation Methods

### Option 1: Global Installation (Recommended for CLI)

This allows you to run the `gquota` command from anywhere in your terminal.

```bash
npm install -g opencode-antigravity-quota
```

### Option 2: Install as OpenCode Plugin

To use it within OpenCode (via slash commands or natural language):

1.  Navigate to your OpenCode configuration directory:
    *   **Windows:** `%USERPROFILE%\.config\opencode`
    *   **macOS/Linux:** `~/.config/opencode`

2.  Install the package:
    ```bash
    npm install opencode-antigravity-quota
    ```

3.  Add it to your `opencode.json` config file:
    ```json
    {
      "plugins": [
        "opencode-antigravity-quota"
      ]
    }
    ```

### Option 3: Install from Source (For Development)

1.  Clone the repository:
    ```bash
    git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
    cd opencode-antigravity-quota
    ```

2.  Install dependencies and build:
    ```bash
    npm install
    npm run build
    ```

3.  Link globally (optional):
    ```bash
    npm link
    ```

## Verification

To verify installation, run:

```bash
gquota --help
```

If you see the help message, you are ready to go!
