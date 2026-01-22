# opencode-antigravity-quota

**Multi-account Google/Antigravity quota checker for OpenCode.**

[![npm version](https://img.shields.io/npm/v/opencode-antigravity-quota.svg)](https://www.npmjs.com/package/opencode-antigravity-quota)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This plugin helps you monitor usage quotas across multiple Google accounts for Antigravity (Gemini & Claude) directly from your terminal or OpenCode interface.

![Demo](https://via.placeholder.com/800x400?text=Placeholder+for+Screenshot)

## ✨ Features

- **Multi-Account:** Checks all your authenticated accounts at once.
- **Pivot Table View:** Compare models across accounts side-by-side.
- **Visual Indicators:** Color-coded progress bars and status checks.
- **Smart Caching:** Reduces API calls with 10-minute caching.
- **Auto-Refresh:** Handles token refreshing automatically.

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g opencode-antigravity-quota

# OR run directly via npx
npx opencode-antigravity-quota
```

### Usage

**CLI Command (Recommended for full view):**
```bash
gquota
```

**Options:**
- `gquota --refresh`: Force refresh data (bypass cache)
- `gquota --account 1`: Show details for specific account #1

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) directory:

- [**Installation Guide**](./docs/INSTALLATION.md) - Detailed setup instructions.
- [**Usage Guide**](./docs/USAGE.md) - How to use the CLI and OpenCode plugin.
- [**Troubleshooting**](./docs/TROUBLESHOOTING.md) - Common errors and fixes.
- [**Architecture**](./docs/ARCHITECTURE.md) - How it works under the hood.

## 🤝 Contributing

Contributions are welcome! Please check the [repository](https://github.com/ninhhaidang/opencode-antigravity-quota) for details.

## 📄 License

MIT © [NinhHaiDang](https://github.com/ninhhaidang)
