/**
 * Output formatting with pivot table display
 */

import type { AccountQuotaResult, QuotaSummary, ModelQuota } from './types.js';
import { COLORS } from './constants.js';

/**
 * Create a colored progress bar for quota visualization
 * Fixed width output with consistent ANSI codes
 */
function createProgressBar(percent: number, width: number = 10): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  
  // Color based on percentage
  let color = COLORS.green;
  if (percent < 50) color = COLORS.red;
  else if (percent < 80) color = COLORS.yellow;
  
  // Use single color for entire bar to ensure consistent ANSI code length
  const filledPart = '█'.repeat(filled);
  const emptyPart = '░'.repeat(empty);
  
  return `${color}[${filledPart}${emptyPart}]${COLORS.reset}`;
}

/**
 * Get color for percentage based on threshold
 */
function getPercentColor(percent: number): string {
  if (percent < 50) return COLORS.red;
  if (percent < 80) return COLORS.yellow;
  return COLORS.green;
}

/**
 * Format percentage with color and padding
 */
function formatPercent(percent: number): string {
  const color = getPercentColor(percent);
  const percentStr = `${percent}%`.padStart(4);
  return `${color}${percentStr}${COLORS.reset}`;
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
    
    const hasWarning = result.models?.some(m => m.remainingPercent < 80);
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
  const parts: string[] = [];
  
  if (summary.healthyAccounts === summary.totalAccounts) {
    parts.push(`${COLORS.green}${summary.totalAccounts}/${summary.totalAccounts} accounts healthy${COLORS.reset}`);
  } else {
    if (summary.healthyAccounts > 0) {
      parts.push(`${COLORS.green}${summary.healthyAccounts} healthy${COLORS.reset}`);
    }
    if (summary.warningAccounts > 0) {
      parts.push(`${COLORS.yellow}${summary.warningAccounts} warning${COLORS.reset}`);
    }
    if (summary.failedAccounts > 0) {
      parts.push(`${COLORS.red}${summary.failedAccounts} failed${COLORS.reset}`);
    }
  }
  
  let result = `Summary: ${parts.join(', ')}`;
  if (cacheAge) {
    result += ` ${COLORS.dim}• Cache: ${cacheAge}${COLORS.reset}`;
  }
  
  return result;
}

/**
 * Get all unique model names across all accounts
 */
function getAllModelNames(results: AccountQuotaResult[]): string[] {
  const modelSet = new Set<string>();
  for (const result of results) {
    if (result.models) {
      for (const model of result.models) {
        modelSet.add(model.name);
      }
    }
  }
  return Array.from(modelSet).sort();
}

/**
 * Group models by quota pool
 */
function groupModelsByPool(modelNames: string[]): { antigravity: string[]; geminiCli: string[] } {
  const antigravity: string[] = [];
  const geminiCli: string[] = [];
  
  for (const name of modelNames) {
    if (name.includes('claude') || (name.startsWith('gemini-3-') && !name.includes('preview'))) {
      antigravity.push(name);
    } else if (name.startsWith('gemini-2.5-') || name.includes('preview')) {
      geminiCli.push(name);
    }
  }
  
  return { antigravity, geminiCli };
}

/**
 * Get model quota for a specific account
 */
function getModelQuota(result: AccountQuotaResult, modelName: string): ModelQuota | undefined {
  return result.models?.find(m => m.name === modelName);
}

/**
 * Format a cell in the pivot table (fixed width, accounts for ANSI codes)
 * Target visible width: 19 chars (acctColWidth - 2 - 1 trailing space in template)
 */
function formatCell(quota: ModelQuota | undefined, targetWidth: number = 19): string {
  if (!quota) {
    // "N/A" = 3 chars, need to pad to targetWidth
    const padding = ' '.repeat(targetWidth - 3);
    return `${COLORS.dim}N/A${COLORS.reset}${padding}`;
  }
  
  // Fixed format: [██████████] 100%
  // Bar: 10 chars, brackets: 2, space: 1, percent: 4 = 17 visible chars
  const bar = createProgressBar(quota.remainingPercent, 10);
  const percentStr = `${quota.remainingPercent}%`.padStart(4);
  const color = getPercentColor(quota.remainingPercent);
  
  // Content is 17 visible chars, pad to targetWidth
  const padding = ' '.repeat(targetWidth - 17);
  return `${bar} ${color}${percentStr}${COLORS.reset}${padding}`;
}

/**
 * Format pivot table for a quota pool
 */
function formatPoolTable(
  poolName: string,
  poolDescription: string,
  modelNames: string[],
  results: AccountQuotaResult[],
  resetTime: string
): string[] {
  const lines: string[] = [];
  const numAccounts = results.length;
  
  // Column widths (visible characters only)
  const modelColWidth = 30;
  const acctColWidth = 22; // [██████████] 100% = 17 chars + 2 padding + 3 for "Account" vs "Acct"
  
  // Table header
  lines.push(`${COLORS.bright}${poolName}${COLORS.reset} ${COLORS.dim}(${poolDescription})${COLORS.reset}`);
  
  // Build header row
  let headerBorder = `┌${'─'.repeat(modelColWidth)}`;
  let headerRow = `│ ${'Model'.padEnd(modelColWidth - 2)} `;
  for (let i = 0; i < numAccounts; i++) {
    headerBorder += `┬${'─'.repeat(acctColWidth)}`;
    headerRow += `│ ${`Account #${i + 1}`.padEnd(acctColWidth - 2)} `;
  }
  headerBorder += '┐';
  headerRow += '│';
  
  lines.push(headerBorder);
  lines.push(headerRow);
  
  // Separator row
  let sepRow = `├${'─'.repeat(modelColWidth)}`;
  for (let i = 0; i < numAccounts; i++) {
    sepRow += `┼${'─'.repeat(acctColWidth)}`;
  }
  sepRow += '┤';
  lines.push(sepRow);
  
  // Data rows
  for (const modelName of modelNames) {
    // Get display name from first account that has this model
    let displayName = modelName;
    for (const result of results) {
      const quota = getModelQuota(result, modelName);
      if (quota) {
        displayName = quota.displayName;
        break;
      }
    }
    
    // Truncate if too long
    if (displayName.length > modelColWidth - 3) {
      displayName = displayName.substring(0, modelColWidth - 5) + '...';
    }
    
    let row = `│ ${displayName.padEnd(modelColWidth - 2)} `;
    
    for (const result of results) {
      if (!result.success) {
        row += `│ ${COLORS.red}${'ERROR'.padEnd(acctColWidth - 2)}${COLORS.reset} `;
      } else {
        const quota = getModelQuota(result, modelName);
        row += `│ ${formatCell(quota)} `;
      }
    }
    row += '│';
    lines.push(row);
  }
  
  // Bottom border
  let bottomBorder = `└${'─'.repeat(modelColWidth)}`;
  for (let i = 0; i < numAccounts; i++) {
    bottomBorder += `┴${'─'.repeat(acctColWidth)}`;
  }
  bottomBorder += '┘';
  lines.push(bottomBorder);
  
  // Reset time
  lines.push(`${COLORS.dim}Reset: ${resetTime}${COLORS.reset}`);
  
  return lines;
}

/**
 * Get reset time info for a pool
 */
function getPoolResetTime(results: AccountQuotaResult[], modelNames: string[]): string {
  // Get unique reset times
  const resetTimes = new Set<string>();
  
  for (const result of results) {
    if (!result.models) continue;
    for (const model of result.models) {
      if (modelNames.includes(model.name) && model.resetIn) {
        resetTimes.add(model.resetIn);
      }
    }
  }
  
  const times = Array.from(resetTimes);
  if (times.length === 0) return 'N/A';
  if (times.length === 1) return times[0];
  return times.slice(0, 2).join(' - '); // Show range
}

/**
 * Format pivot table view (main output format)
 */
export function formatPivotTable(results: AccountQuotaResult[], cacheAge?: string): string {
  const lines: string[] = [];
  
  // Get all model names and group by pool
  const allModelNames = getAllModelNames(results);
  const { antigravity, geminiCli } = groupModelsByPool(allModelNames);
  
  // Antigravity Pool Table
  if (antigravity.length > 0) {
    const resetTime = getPoolResetTime(results, antigravity);
    const poolLines = formatPoolTable(
      'ANTIGRAVITY QUOTA POOL',
      'Claude + Gemini 3',
      antigravity,
      results,
      resetTime
    );
    lines.push(...poolLines);
    lines.push('');
  }
  
  // Gemini CLI Pool Table
  if (geminiCli.length > 0) {
    const resetTime = getPoolResetTime(results, geminiCli);
    const poolLines = formatPoolTable(
      'GEMINI CLI QUOTA POOL',
      'Gemini 2.5 + 3 Preview',
      geminiCli,
      results,
      resetTime
    );
    lines.push(...poolLines);
    lines.push('');
  }
  
  // Account legend
  lines.push('═'.repeat(80));
  lines.push(`${COLORS.bright}Accounts:${COLORS.reset}`);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const projectId = result.projectId || 'unknown';
    lines.push(`  #${i + 1}: ${result.email} ${COLORS.dim}(${projectId})${COLORS.reset}`);
  }
  lines.push('');
  
  // Summary
  const summary = generateSummary(results);
  lines.push(formatSummary(summary, cacheAge));
  lines.push('');
  
  // Help hints
  lines.push(`${COLORS.dim}gquota --account 1     Show only account #1 details${COLORS.reset}`);
  lines.push(`${COLORS.dim}gquota --refresh       Force refresh (bypass cache)${COLORS.reset}`);
  lines.push(`${COLORS.dim}gquota --help          Show help message${COLORS.reset}`);
  
  return lines.join('\n');
}

/**
 * Format single account detailed view
 */
export function formatSingleAccount(result: AccountQuotaResult, index: number, cacheAge?: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push('');
  lines.push(`${COLORS.bright}Google/Antigravity Quota - Account #${index + 1}${COLORS.reset}`);
  lines.push('═'.repeat(60));
  lines.push('');
  
  // Account info
  if (!result.success) {
    lines.push(`Account: ${result.email}`);
    lines.push(`${COLORS.red}Error: ${result.error}${COLORS.reset}`);
    if (result.suggestion) {
      lines.push(`Suggestion: ${result.suggestion}`);
    }
    return lines.join('\n');
  }
  
  lines.push(`Account: ${result.email}`);
  lines.push(`Project: ${result.projectId}`);
  lines.push(`Tier: ${result.tier} ${COLORS.dim}• Last used: ${formatLastUsed(result.lastUsed)}${COLORS.reset}`);
  lines.push('');
  
  // Group models by quota pool
  const antigravityModels = result.models?.filter(m =>
    m.name.includes('claude') || (m.name.startsWith('gemini-3-') && !m.name.includes('preview'))
  ) || [];
  
  const geminiCliModels = result.models?.filter(m =>
    m.name.startsWith('gemini-2.5-') || m.name.includes('preview')
  ) || [];
  
  if (antigravityModels.length > 0) {
    const resetTime = antigravityModels[0]?.resetIn || 'N/A';
    lines.push(`${COLORS.bright}ANTIGRAVITY QUOTA POOL${COLORS.reset} ${COLORS.dim}(Claude + Gemini 3) • Reset: ${resetTime}${COLORS.reset}`);
    for (const model of antigravityModels) {
      const name = model.displayName.padEnd(28);
      const bar = createProgressBar(model.remainingPercent, 12);
      const percent = formatPercent(model.remainingPercent);
      lines.push(`  ${name} ${bar} ${percent}`);
    }
    lines.push('');
  }
  
  if (geminiCliModels.length > 0) {
    const resetTime = geminiCliModels[0]?.resetIn || 'N/A';
    lines.push(`${COLORS.bright}GEMINI CLI QUOTA POOL${COLORS.reset} ${COLORS.dim}(Gemini 2.5 + 3 Preview) • Reset: ${resetTime}${COLORS.reset}`);
    for (const model of geminiCliModels) {
      const name = model.displayName.padEnd(28);
      const bar = createProgressBar(model.remainingPercent, 12);
      const percent = formatPercent(model.remainingPercent);
      lines.push(`  ${name} ${bar} ${percent}`);
    }
  }
  
  // Footer
  lines.push('');
  lines.push('═'.repeat(60));
  
  const allHealthy = result.models?.every(m => m.remainingPercent >= 80);
  if (allHealthy) {
    lines.push(`Status: ${COLORS.green}All models healthy (${result.models?.length || 0}/${result.models?.length || 0})${COLORS.reset}`);
  } else {
    const healthyCount = result.models?.filter(m => m.remainingPercent >= 80).length || 0;
    lines.push(`Status: ${COLORS.yellow}${healthyCount}/${result.models?.length || 0} models healthy${COLORS.reset}`);
  }
  
  if (cacheAge) {
    lines.push(`${COLORS.dim}Cache: ${cacheAge}${COLORS.reset}`);
  }
  
  return lines.join('\n');
}

/**
 * Format complete quota output (alias for formatPivotTable)
 */
export function formatQuotaOutput(results: AccountQuotaResult[], cacheAge?: string): string {
  return formatPivotTable(results, cacheAge);
}
