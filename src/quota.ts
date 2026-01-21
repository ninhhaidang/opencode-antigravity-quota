/**
 * Quota fetching and parsing logic
 */

import type {
  AntigravityAccount,
  AccountQuotaResult,
  ModelQuota,
  QuotaAPIResponse,
  LoadProjectResponse,
} from './types.js';
import { refreshAccessToken } from './auth.js';
import { QUOTA_API_URL, LOAD_PROJECT_URL, API_HEADERS, QUOTA_HEALTHY, QUOTA_WARNING } from './constants.js';

/**
 * Fetch project information from Google API
 */
async function fetchProjectInfo(accessToken: string): Promise<LoadProjectResponse | null> {
  try {
    const response = await fetch(LOAD_PROJECT_URL, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        metadata: {
          ideType: 'IDE_UNSPECIFIED',
          platform: 'PLATFORM_UNSPECIFIED',
          pluginType: 'GEMINI',
        },
      }),
    });

    if (!response.ok) return null;
    return response.json() as Promise<LoadProjectResponse>;
  } catch {
    return null;
  }
}

/**
 * Fetch quota information from Google Antigravity API
 */
async function fetchQuota(accessToken: string, projectId: string): Promise<QuotaAPIResponse> {
  const response = await fetch(QUOTA_API_URL, {
    method: 'POST',
    headers: {
      ...API_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      project: projectId || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Quota fetch failed: ${response.status} - ${error}`);
  }

  return response.json() as Promise<QuotaAPIResponse>;
}

/**
 * Format ISO timestamp to human-readable relative time
 */
function formatResetTime(resetTimeISO: string): string {
  if (!resetTimeISO) return 'N/A';
  
  try {
    const resetDate = new Date(resetTimeISO);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'now';
    
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    } else if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      return `${Math.max(1, minutes)}m`;
    }
  } catch {
    return 'N/A';
  }
}

/**
 * Determine quota status based on remaining percentage
 */
function getQuotaStatus(remainingPercent: number): 'healthy' | 'warning' | 'critical' {
  if (remainingPercent >= QUOTA_HEALTHY) return 'healthy';
  if (remainingPercent >= QUOTA_WARNING) return 'warning';
  return 'critical';
}

/**
 * Get error-specific suggestions for common issues
 */
function getSuggestion(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  
  if (message.includes('token') || message.includes('401') || message.includes('403')) {
    return "Re-authenticate with 'opencode auth login'";
  }
  if (message.includes('network') || message.includes('timeout')) {
    return 'Check your internet connection and try again';
  }
  if (message.includes('project')) {
    return 'Verify your project ID in antigravity-accounts.json';
  }
  return 'Check the error message above for details';
}

/**
 * Get quota information for a single account
 * Uses Option C error handling: returns error info but doesn't throw
 */
export async function getAccountQuota(account: AntigravityAccount): Promise<AccountQuotaResult> {
  try {
    // 1. Refresh access token
    const tokenResponse = await refreshAccessToken(account.refreshToken);
    const accessToken = tokenResponse.access_token;

    // 2. Fetch project info
    const projectInfo = await fetchProjectInfo(accessToken);
    const tier = projectInfo?.currentTier?.name || 'Unknown';

    // 3. Fetch quota
    const quotaResponse = await fetchQuota(accessToken, account.projectId);

    // 4. Parse models
    const models: ModelQuota[] = [];
    
    for (const [name, info] of Object.entries(quotaResponse.models)) {
      // Only include Gemini and Claude models with quota info
      if (!info.quotaInfo) continue;
      if (!name.includes('gemini') && !name.includes('claude')) continue;

      const remainingPercent = Math.round(info.quotaInfo.remainingFraction * 100);
      const usedPercent = 100 - remainingPercent;

      models.push({
        name,
        displayName: info.displayName,
        remainingPercent,
        usedPercent,
        resetTime: info.quotaInfo.resetTime,
        resetIn: formatResetTime(info.quotaInfo.resetTime),
        status: getQuotaStatus(remainingPercent),
      });
    }

    // Sort: Gemini first, then Claude
    models.sort((a, b) => {
      const aIsGemini = a.name.includes('gemini');
      const bIsGemini = b.name.includes('gemini');
      if (aIsGemini && !bIsGemini) return -1;
      if (!aIsGemini && bIsGemini) return 1;
      return a.name.localeCompare(b.name);
    });

    return {
      success: true,
      email: account.email,
      projectId: account.projectId,
      tier,
      lastUsed: account.lastUsed,
      models,
    };
  } catch (error) {
    // Error handling - Option C: Return error but don't halt
    return {
      success: false,
      email: account.email,
      lastUsed: account.lastUsed,
      error: error instanceof Error ? error.message : String(error),
      suggestion: getSuggestion(error),
    };
  }
}
