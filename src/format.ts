/**
 * Output formatting with colors and progress bars
 */

import type { AccountQuotaResult, QuotaSummary, ModelQuota } from './types.js';
import { COLORS } from './constants.js';

/**
 * Create a colored progress bar for quota visualization
 */
function createProgressBar(percent: number, width: number = 20): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return `[${COLORS.green}${'█'.repeat(filled)}${COLORS.gray}${'░'.repeat(empty)}${COLORS.reset}]`;
}

/**
 * Get status icon and color based on quota health
 */
function getStatusIcon(status: 'healthy' | 'warning' | 'critical'): string {
  switch (status) {
    case 'healthy': return `${COLORS.green}✅${COLORS.reset}`;
    case 'warning': return `${COLORS.yellow}⚠️${COLORS.reset}`;
    case 'critical': return `${COLORS.red}🔴${COLORS.reset}`;
  }
}

/**
 * Format timestamp to human-readable relative time
 */
function formatLastUsed(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Format a single account's quota result
 */
function formatAccountResult(result: AccountQuotaResult, index: number): string {
  const lines: string[] = [];
  
  lines.push(`${COLORS.bright}Account #${index + 1}: ${result.email}${COLORS.reset}`);
  
  if (!result.success) {
    lines.push(`  ${COLORS.red}❌ Status: Could not fetch quota${COLORS.reset}`);
    lines.push(`  ${COLORS.dim}Reason: ${result.error}${COLORS.reset}`);
    lines.push(`  ${COLORS.dim}Last used: ${formatLastUsed(result.lastUsed)}${COLORS.reset}`);
    if (result.suggestion) {
      lines.push(`  ${COLORS.cyan}Suggestion: ${result.suggestion}${COLORS.reset}`);
    }
    return lines.join('\n');
  }
  
  lines.push(`  Project: ${COLORS.dim}${result.projectId}${COLORS.reset}`);
  lines.push(`  Tier: ${COLORS.dim}${result.tier}${COLORS.reset}`);
  lines.push(`  Last used: ${COLORS.dim}${formatLastUsed(result.lastUsed)}${COLORS.reset}`);
  lines.push('');
  
  // Group models by type
  const geminiModels = result.models?.filter(m => m.name.includes('gemini')) || [];
  const claudeModels = result.models?.filter(m => m.name.includes('claude')) || [];
  
  if (geminiModels.length > 0) {
    lines.push(`  ${COLORS.bright}Gemini Models:${COLORS.reset}`);
    for (const model of geminiModels) {
      lines.push(`    ${getStatusIcon(model.status)} ${model.displayName}`);
      lines.push(`       ${createProgressBar(model.remainingPercent)} ${model.remainingPercent}% remaining`);
      lines.push(`       ${COLORS.dim}Resets in: ${model.resetIn}${COLORS.reset}`);
    }
    lines.push('');
  }
  
  if (claudeModels.length > 0) {
    lines.push(`  ${COLORS.bright}Claude Models:${COLORS.reset}`);
    for (const model of claudeModels) {
      lines.push(`    ${getStatusIcon(model.status)} ${model.displayName}`);
      lines.push(`       ${createProgressBar(model.remainingPercent)} ${model.remainingPercent}% remaining`);
      lines.push(`       ${COLORS.dim}Resets in: ${model.resetIn}${COLORS.reset}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Generate summary statistics from results
 */
function generateSummary(results: AccountQuotaResult[]): QuotaSummary {
  const summary: QuotaSummary = {
    totalAccounts: results.length,
    healthyAccounts: 0,
    warningAccounts: 0,
    failedAccounts: 0,
  };
  
  for (const result of results) {
    if (!result.success) {
      summary.failedAccounts++;
      continue;
    }
    
    const hasWarning = result.models?.some(m => m.status === 'warning' || m.status === 'critical');
    if (hasWarning) {
      summary.warningAccounts++;
    } else {
      summary.healthyAccounts++;
    }
  }
  
  return summary;
}

/**
 * Format summary section
 */
function formatSummary(summary: QuotaSummary, cacheAge?: string): string {
  const lines: string[] = [];
  
  lines.push(`${COLORS.bright}Summary:${COLORS.reset}`);
  
  if (summary.healthyAccounts > 0) {
    lines.push(`${COLORS.green}✅ ${summary.healthyAccounts}/${summary.totalAccounts} accounts healthy${COLORS.reset}`);
  }
  if (summary.warningAccounts > 0) {
    lines.push(`${COLORS.yellow}⚠️  ${summary.warningAccounts} account${summary.warningAccounts !== 1 ? 's' : ''} with warnings${COLORS.reset}`);
  }
  if (summary.failedAccounts > 0) {
    lines.push(`${COLORS.red}❌ ${summary.failedAccounts} account${summary.failedAccounts !== 1 ? 's' : ''} need attention${COLORS.reset}`);
  }
  
  if (cacheAge) {
    lines.push(`${COLORS.dim}💾 Cache valid for: ${cacheAge}${COLORS.reset}`);
  }
  
  return lines.join('\n');
}

/**
 * Format complete quota output with all accounts
 */
export function formatQuotaOutput(results: AccountQuotaResult[], cacheAge?: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`${COLORS.bright}${COLORS.cyan}Google/Antigravity Quota - Multi-Account${COLORS.reset}`);
  lines.push('═'.repeat(60));
  lines.push('');
  
  // Format each account
  for (let i = 0; i < results.length; i++) {
    lines.push(formatAccountResult(results[i], i));
    if (i < results.length - 1) {
      lines.push('');
      lines.push('─'.repeat(60));
      lines.push('');
    }
  }
  
  // Summary
  lines.push('');
  lines.push('═'.repeat(60));
  const summary = generateSummary(results);
  lines.push(formatSummary(summary, cacheAge));
  
  return lines.join('\n');
}
