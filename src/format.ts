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
  
  // Group models by quota pool
  // Antigravity Quota: Claude + Gemini 3 (non-preview)
  // Gemini CLI Quota: Gemini 2.5 + Gemini 3 preview
  
  const antigravityModels = result.models?.filter(m => {
    // Claude models use Antigravity quota
    if (m.name.includes('claude')) return true;
    // Gemini 3 non-preview models use Antigravity quota
    if (m.name.startsWith('gemini-3-') && !m.name.includes('preview')) return true;
    return false;
  }) || [];
  
  const geminiCliModels = result.models?.filter(m => {
    // Gemini 2.5 models use Gemini CLI quota
    if (m.name.startsWith('gemini-2.5-')) return true;
    // Gemini 3 preview models use Gemini CLI quota
    if (m.name.includes('preview')) return true;
    return false;
  }) || [];
  
  if (antigravityModels.length > 0) {
    lines.push(`  ${COLORS.bright}${COLORS.cyan}Antigravity Quota${COLORS.reset} ${COLORS.dim}(Claude + Gemini 3)${COLORS.reset}`);
    for (const model of antigravityModels) {
      lines.push(`    ${getStatusIcon(model.status)} ${model.displayName}`);
      lines.push(`       ${createProgressBar(model.remainingPercent)} ${model.remainingPercent}% remaining`);
      lines.push(`       ${COLORS.dim}Resets in: ${model.resetIn}${COLORS.reset}`);
    }
    lines.push('');
  }
  
  if (geminiCliModels.length > 0) {
    lines.push(`  ${COLORS.bright}${COLORS.cyan}Gemini CLI Quota${COLORS.reset} ${COLORS.dim}(Gemini 2.5 + 3 Preview)${COLORS.reset}`);
    for (const model of geminiCliModels) {
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
 * Calculate average quota for a pool across models
 */
function getPoolQuota(models: ModelQuota[]): { percent: number; total: number; status: 'healthy' | 'warning' | 'critical' } {
  if (models.length === 0) return { percent: 0, total: 0, status: 'critical' };
  
  const avgPercent = Math.round(
    models.reduce((sum, m) => sum + m.remainingPercent, 0) / models.length
  );
  
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (avgPercent < 50) status = 'critical';
  else if (avgPercent < 80) status = 'warning';
  
  return { percent: avgPercent, total: models.length, status };
}

/**
 * Format table view (compact overview)
 */
export function formatTableView(results: AccountQuotaResult[], cacheAge?: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push('');
  lines.push(`╔${'═'.repeat(59)}╗`);
  lines.push(`║${' '.repeat(9)}Google/Antigravity Quota - Multi-Account${' '.repeat(9)}║`);
  lines.push(`╚${'═'.repeat(59)}╝`);
  lines.push('');
  
  // Table header
  lines.push(`┌${'─'.repeat(27)}┬${'─'.repeat(16)}┬${'─'.repeat(16)}┐`);
  lines.push(`│ Account${' '.repeat(19)}│ Antigravity Pool │ Gemini CLI Pool  │`);
  lines.push(`├${'─'.repeat(27)}┼${'─'.repeat(16)}┼${'─'.repeat(16)}┤`);
  
  // Table rows
  const issues: string[] = [];
  for (const result of results) {
    let displayEmail = result.email;
    if (displayEmail.length > 25) {
      displayEmail = displayEmail.substring(0, 22) + '...';
    }
    displayEmail = displayEmail.padEnd(25);
    
    if (!result.success) {
      lines.push(`│ ${displayEmail}│ ${COLORS.red}❌ Error${COLORS.reset}${' '.repeat(7)}│ ${COLORS.red}❌ Error${COLORS.reset}${' '.repeat(7)}│`);
      issues.push(`  ${result.email}: ${result.error}`);
      continue;
    }
    
    // Group models by quota pool
    const antigravityModels = result.models?.filter(m =>
      m.name.includes('claude') || (m.name.startsWith('gemini-3-') && !m.name.includes('preview'))
    ) || [];
    
    const geminiCliModels = result.models?.filter(m =>
      m.name.startsWith('gemini-2.5-') || m.name.includes('preview')
    ) || [];
    
    const antigravityQuota = getPoolQuota(antigravityModels);
    const geminiCliQuota = getPoolQuota(geminiCliModels);
    
    // Format pool status
    const formatPool = (quota: ReturnType<typeof getPoolQuota>): string => {
      const icon = getStatusIcon(quota.status);
      const percent = `${quota.percent}%`.padStart(4);
      const count = `(${quota.total})`.padEnd(5);
      return `${icon} ${percent} ${count}`;
    };
    
    const antigravityCell = formatPool(antigravityQuota).padEnd(16 + 10); // +10 for ANSI codes
    const geminiCliCell = formatPool(geminiCliQuota).padEnd(16 + 10);
    
    lines.push(`│ ${displayEmail}│ ${antigravityCell}│ ${geminiCliCell}│`);
    
    // Track issues
    if (antigravityQuota.status !== 'healthy' || geminiCliQuota.status !== 'healthy') {
      let issue = `  ${result.email}:`;
      if (antigravityQuota.status === 'critical') {
        issue += ` Antigravity quota CRITICAL at ${antigravityQuota.percent}%`;
      } else if (antigravityQuota.status === 'warning') {
        issue += ` Antigravity quota at ${antigravityQuota.percent}%`;
      }
      if (geminiCliQuota.status === 'critical') {
        issue += ` ${antigravityQuota.status !== 'healthy' ? '•' : ''} Gemini CLI quota CRITICAL at ${geminiCliQuota.percent}%`;
      } else if (geminiCliQuota.status === 'warning') {
        issue += ` ${antigravityQuota.status !== 'healthy' ? '•' : ''} Gemini CLI quota at ${geminiCliQuota.percent}%`;
      }
      issues.push(issue);
    }
  }
  
  lines.push(`└${'─'.repeat(27)}┴${'─'.repeat(16)}┴${'─'.repeat(16)}┘`);
  lines.push('');
  
  // Quota pools explanation
  lines.push('Quota Pools:');
  lines.push(`  ${COLORS.cyan}🔵 Antigravity:${COLORS.reset} Claude (3) + Gemini 3 (4)`);
  lines.push(`  ${COLORS.cyan}🟢 Gemini CLI:${COLORS.reset}  Gemini 2.5 (4)`);
  lines.push('');
  
  // Issues
  if (issues.length > 0) {
    lines.push(`${COLORS.yellow}⚠️ Issues Detected:${COLORS.reset}`);
    lines.push(...issues);
    lines.push('');
    lines.push(`${COLORS.dim}💡 Use \`gquota -v\` to see detailed breakdown${COLORS.reset}`);
    lines.push('');
  }
  
  // Summary footer
  lines.push('═'.repeat(60));
  const summary = generateSummary(results);
  lines.push(formatSummary(summary, cacheAge));
  lines.push('');
  lines.push(`${COLORS.dim}💡 gquota -v              Show all models (detailed view)${COLORS.reset}`);
  lines.push(`${COLORS.dim}💡 gquota --account 1     Show only account #1 details${COLORS.reset}`);
  lines.push(`${COLORS.dim}💡 gquota --refresh       Force refresh (bypass cache)${COLORS.reset}`);
  
  return lines.join('\n');
}

/**
 * Format single account detailed view
 */
export function formatSingleAccount(result: AccountQuotaResult, index: number, cacheAge?: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push('');
  lines.push(`╔${'═'.repeat(59)}╗`);
  lines.push(`║${' '.repeat(9)}Google/Antigravity Quota - Account #${index + 1}${' '.repeat(13)}║`);
  lines.push(`╚${'═'.repeat(59)}╝`);
  lines.push('');
  
  // Account info
  lines.push(formatAccountResultCompact(result));
  
  // Footer
  lines.push('');
  lines.push('═'.repeat(60));
  
  if (result.success) {
    const allHealthy = result.models?.every(m => m.status === 'healthy');
    if (allHealthy) {
      lines.push(`Status: ${COLORS.green}✅ All models healthy (${result.models?.length || 0}/${result.models?.length || 0})${COLORS.reset}`);
    } else {
      const healthyCount = result.models?.filter(m => m.status === 'healthy').length || 0;
      lines.push(`Status: ${COLORS.yellow}⚠️ ${healthyCount}/${result.models?.length || 0} models healthy${COLORS.reset}`);
    }
  }
  
  if (cacheAge) {
    lines.push(`${COLORS.dim}💾 Cache: ${cacheAge}${COLORS.reset}`);
  }
  
  return lines.join('\n');
}

/**
 * Format account result in compact format (1 line per model)
 */
function formatAccountResultCompact(result: AccountQuotaResult): string {
  const lines: string[] = [];
  
  if (!result.success) {
    lines.push(`${COLORS.bright}${result.email} ${COLORS.red}❌${COLORS.reset}`);
    lines.push(`${COLORS.red}Error: ${result.error}${COLORS.reset}`);
    if (result.suggestion) {
      lines.push(`${COLORS.cyan}Suggestion: ${result.suggestion}${COLORS.reset}`);
    }
    return lines.join('\n');
  }
  
  lines.push(`Account: ${COLORS.bright}${result.email} ${COLORS.green}✅${COLORS.reset}`);
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
    // Get reset time from first model
    const resetTime = antigravityModels[0]?.resetIn || 'N/A';
    lines.push(`${COLORS.cyan}🔵 Antigravity Quota${COLORS.reset} ${COLORS.dim}(Claude + Gemini 3) • Reset: ${resetTime}${COLORS.reset}`);
    for (const model of antigravityModels) {
      const name = model.displayName.padEnd(24);
      lines.push(`  ${getStatusIcon(model.status)} ${name} ${createProgressBar(model.remainingPercent)} ${model.remainingPercent}%`);
    }
    lines.push('');
  }
  
  if (geminiCliModels.length > 0) {
    const resetTime = geminiCliModels[0]?.resetIn || 'N/A';
    lines.push(`${COLORS.cyan}🟢 Gemini CLI Quota${COLORS.reset} ${COLORS.dim}(Gemini 2.5 + 3 Preview) • Reset: ${resetTime}${COLORS.reset}`);
    for (const model of geminiCliModels) {
      const name = model.displayName.padEnd(24);
      lines.push(`  ${getStatusIcon(model.status)} ${name} ${createProgressBar(model.remainingPercent)} ${model.remainingPercent}%`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Format detailed quota output with all accounts (verbose mode)
 */
export function formatDetailedView(results: AccountQuotaResult[], cacheAge?: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push('');
  lines.push(`╔${'═'.repeat(59)}╗`);
  lines.push(`║${' '.repeat(9)}Google/Antigravity Quota - Multi-Account${' '.repeat(9)}║`);
  lines.push(`║${' '.repeat(20)}(Detailed View)${' '.repeat(24)}║`);
  lines.push(`╚${'═'.repeat(59)}╝`);
  lines.push('');
  
  // Format each account
  for (let i = 0; i < results.length; i++) {
    lines.push('━'.repeat(60));
    lines.push(`${COLORS.bright}Account #${i + 1}: ${results[i].email} ${results[i].success ? COLORS.green + '✅' : COLORS.red + '❌'}${COLORS.reset}`);
    lines.push('━'.repeat(60));
    lines.push(formatAccountResultCompact(results[i]));
    
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

/**
 * Format complete quota output with all accounts (deprecated - use formatTableView or formatDetailedView)
 */
export function formatQuotaOutput(results: AccountQuotaResult[], cacheAge?: string): string {
  // Default to table view for backwards compatibility
  return formatTableView(results, cacheAge);
}
