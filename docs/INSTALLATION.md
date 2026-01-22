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

## 1. Global Installation (Recommended)

Installing globally allows you to use the `gquota` command from any terminal window.

```bash
# Install via npm
npm install -g opencode-antigravity-quota

# Verify installation
gquota --help
```

## 2. Install as OpenCode Plugin

To use the quota checker directly inside the OpenCode AI interface (Chat or Slash commands).

### Step 1: Install Package
Navigate to your OpenCode configuration directory and install the package.

**Windows (PowerShell):**
```powershell
cd $env:USERPROFILE\.config\opencode
npm install opencode-antigravity-quota
```

**macOS / Linux:**
```bash
cd ~/.config/opencode
npm install opencode-antigravity-quota
```

### Step 2: Configure Plugin
Add the plugin to your `opencode.json` configuration file.

```json
{
  "plugins": [
    "opencode-antigravity-quota"
  ]
}
```

## 3. Install from Source (Development)

For developers who want to modify or contribute to the project.

```bash
# Clone repository
git clone https://github.com/ninhhaidang/opencode-antigravity-quota.git
cd opencode-antigravity-quota

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link
```

## Next Steps

Once installed, proceed to the [**Usage Guide**](./USAGE.md) to learn how to check your quotas.
