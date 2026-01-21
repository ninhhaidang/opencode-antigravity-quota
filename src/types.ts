/**
 * Type definitions for opencode-antigravity-quota plugin
 */

// Account structure from antigravity-accounts.json
export interface AntigravityAccount {
  email: string;
  refreshToken: string;
  projectId: string;
  managedProjectId: string;
  addedAt: number;
  lastUsed: number;
  rateLimitResetTimes: Record<string, number>;
}

export interface AntigravityAccountsFile {
  version: number;
  accounts: AntigravityAccount[];
  activeIndex: number;
  activeIndexByFamily: {
    claude: number;
    gemini: number;
  };
}

// API Response types
export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface QuotaInfo {
  remainingFraction: number;
  resetTime: string;
}

export interface ModelInfo {
  displayName: string;
  quotaInfo?: QuotaInfo;
  supportsThinking?: boolean;
  recommended?: boolean;
}

export interface QuotaAPIResponse {
  models: Record<string, ModelInfo>;
}

export interface LoadProjectResponse {
  cloudaicompanionProject?: string;
  currentTier?: {
    id: string;
    name: string;
  };
}

// Result types
export interface ModelQuota {
  name: string;
  displayName: string;
  remainingPercent: number;
  usedPercent: number;
  resetTime: string;
  resetIn: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface AccountQuotaResult {
  success: boolean;
  email: string;
  projectId?: string;
  tier?: string;
  lastUsed: number;
  models?: ModelQuota[];
  error?: string;
  suggestion?: string;
}

export interface QuotaSummary {
  totalAccounts: number;
  healthyAccounts: number;
  warningAccounts: number;
  failedAccounts: number;
  cacheValidFor?: string;
}

export interface QuotaCache {
  timestamp: number;
  ttlMs: number;
  data: Record<string, AccountQuotaResult>;
}
