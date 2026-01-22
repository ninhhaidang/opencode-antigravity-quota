#!/usr/bin/env node
/**
 * CLI command to check Google Antigravity quota
 * Shows formatted output with colors and progress bars
 */

import { readAccountsFile } from '../dist/auth.js';
import { getAccountQuota } from '../dist/quota.js';
import { readCache, writeCache, formatCacheAge } from '../dist/cache.js';
import { formatQuotaOutput } from '../dist/format.js';

async function main() {
  // 1. Check cache first
  const cache = readCache();
  if (cache) {
    const results = Object.values(cache.data);
    const cacheAge = formatCacheAge(cache.timestamp);
    console.log(formatQuotaOutput(results, cacheAge));
    return;
  }

  // 2. Read accounts file
  const accountsFile = readAccountsFile();
  if (!accountsFile || accountsFile.accounts.length === 0) {
    console.error('Error: No authenticated accounts found.\n');
    console.error('Please authenticate with:');
    console.error('  opencode auth login\n');
    console.error('Make sure you are using the opencode-antigravity-auth plugin.');
    process.exit(1);
  }

  // 3. Fetch quota for all accounts
  console.log('Fetching quota for', accountsFile.accounts.length, 'accounts...\n');
  const results = await Promise.all(
    accountsFile.accounts.map(account => getAccountQuota(account))
  );

  // 4. Cache results
  const cacheData = {};
  for (const result of results) {
    cacheData[result.email] = result;
  }
  writeCache(cacheData);

  // 5. Format and display output
  console.log(formatQuotaOutput(results));
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
