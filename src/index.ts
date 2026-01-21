/**
 * OpenCode Antigravity Quota Plugin
 * 
 * Main plugin export for checking Google Antigravity quota across multiple accounts.
 * 
 * @author NinhHaiDang
 * @license MIT
 */

import type { Plugin } from '@opencode-ai/plugin';
import { tool } from '@opencode-ai/plugin';
import { readAccountsFile } from './auth.js';
import { getAccountQuota } from './quota.js';
import { readCache, writeCache, formatCacheAge } from './cache.js';
import { formatQuotaOutput } from './format.js';
import type { AccountQuotaResult } from './types.js';

/**
 * OpenCode plugin for checking Google Antigravity quota
 * Compatible with opencode-antigravity-auth@beta
 */
const AntigravityQuotaPlugin: Plugin = async () => {
  return {
    tool: {
      google_quota: tool({
        description: 'Check Google/Antigravity subscription quota for all authenticated accounts. Shows remaining quota percentage, reset times, and per-account breakdown.',
        args: {},
        async execute() {
          // 1. Check cache first
          const cache = readCache();
          if (cache) {
            const results = Object.values(cache.data);
            const cacheAge = formatCacheAge(cache.timestamp);
            return formatQuotaOutput(results, cacheAge);
          }
          
          // 2. Read accounts file
          const accountsFile = readAccountsFile();
          if (!accountsFile || accountsFile.accounts.length === 0) {
            return 'Error: No authenticated accounts found.\n\nPlease authenticate with:\n  opencode auth login\n\nMake sure you are using the opencode-antigravity-auth plugin.';
          }
          
          // 3. Fetch quota for all accounts (in parallel for speed)
          const results: AccountQuotaResult[] = await Promise.all(
            accountsFile.accounts.map(account => getAccountQuota(account))
          );
          
          // 4. Cache results
          const cacheData: Record<string, AccountQuotaResult> = {};
          for (const result of results) {
            cacheData[result.email] = result;
          }
          writeCache(cacheData);
          
          // 5. Format and return output
          return formatQuotaOutput(results);
        },
      }),
    },
  };
};

export default AntigravityQuotaPlugin;
