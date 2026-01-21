/**
 * Constants and configuration for opencode-antigravity-quota plugin
 */

// OAuth credentials (from opencode-antigravity-auth)
export const GOOGLE_CLIENT_ID = "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET = "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";

// API Endpoints
export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels";
export const LOAD_PROJECT_URL = "https://cloudcode-pa.googleapis.com/v1internal:loadCodeAssist";

// Headers
export const USER_AGENT = "antigravity/1.11.5 windows/amd64";
export const API_HEADERS = {
  "User-Agent": USER_AGENT,
  "Content-Type": "application/json",
};

// Cache settings
export const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Quota thresholds
export const QUOTA_HEALTHY = 80;   // 80-100%: ✅ Green
export const QUOTA_WARNING = 20;   // 20-79%: ⚠️ Yellow
// 0-19%: 🔴 Red

// ANSI color codes (for terminal output)
export const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};
