# Installation Guide

This guide covers how to install and configure `opencode-antigravity-quota`.

## Prerequisites

Before starting, ensure you have the following installed:

1.  **Node.js** (v20.0.0 or later)
2.  **OpenCode CLI** (Installed and configured)
3.  **Authentication Plugin**:
    *   This plugin relies on `opencode-antigravity-auth` for credential management.
    *   Ensure you have installed it and logged in via `opencode auth login`.

---

## 1. Install from Source (Global CLI)

Since this package is currently in development, you need to install it from source.

```bash
# 1. Clone the repository
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Link globally to use 'gquota' command
npm link
```

Verify the installation:
```bash
gquota --help
```

## 2. Install as OpenCode Plugin

To use the quota checker directly inside the OpenCode AI interface.

### Step 1: Link the Package
First, follow the steps in **Section 1** to build the project. Then, navigate to your OpenCode configuration directory and link the local package.

**Windows (PowerShell):**
```powershell
cd $env:USERPROFILE\.config\opencode
npm install D:\path\to\opencode-antigravity-quota
```

**macOS / Linux:**
```bash
cd ~/.config/opencode
npm install /path/to/opencode-antigravity-quota
```

*(Replace `/path/to/...` with the actual path where you cloned the repository)*

### Step 2: Configure Plugin
Add the plugin to your `opencode.json` configuration file.

```json
{
  "plugins": [
    "opencode-antigravity-quota"
  ]
}
```

## Next Steps

Once installed, proceed to the [**Usage Guide**](./USAGE.md) to learn how to check your quotas.
