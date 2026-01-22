#!/usr/bin/env node
/**
 * CLI command to check Google Antigravity quota
 * Shows formatted output with colors and progress bars
 */

import { readAccountsFile } from '../dist/auth.js';
import { getAccountQuota } from '../dist/quota.js';
import { readCache, writeCache, formatCacheAge, clearCache } from '../dist/cache.js';
import { formatTableView, formatDetailedView, formatSingleAccount } from '../dist/format.js';
import { parseCliArgs, showHelp } from '../dist/cli-args.js';

async function main() {
  // Parse CLI arguments
  const options = parseCliArgs(process.argv.slice(2));

  // Show help if requested
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // 1. Check cache first (unless --refresh flag is used)
  if (!options.refresh) {
    const cache = readCache();
    if (cache) {
      const results = Object.values(cache.data);
      const cacheAge = formatCacheAge(cache.timestamp);
      
      // Filter by account if requested
      let filteredResults = results;
      if (options.account !== undefined) {
        if (options.account < 1 || options.account > results.length) {
          console.error(`Error: Account #${options.account} does not exist (only ${results.length} accounts available)`);
          process.exit(1);
        }
        const singleResult = results[options.account - 1];
        console.log(formatSingleAccount(singleResult, options.account - 1, cacheAge));
        return;
      }
      
      // Format output based on mode
      if (options.verbose) {
        console.log(formatDetailedView(filteredResults, cacheAge));
      } else {
        console.log(formatTableView(filteredResults, cacheAge));
      }
      return;
    }
  } else {
    // Clear cache when refresh is requested
    clearCache();
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

  // 3. Fetch quota for all accounts or single account
  let accountsToFetch = accountsFile.accounts;
  if (options.account !== undefined) {
    if (options.account < 1 || options.account > accountsFile.accounts.length) {
      console.error(`Error: Account #${options.account} does not exist (only ${accountsFile.accounts.length} accounts available)`);
      process.exit(1);
    }
    accountsToFetch = [accountsFile.accounts[options.account - 1]];
    console.log(`Fetching quota for account #${options.account}...\n`);
  } else {
    console.log('Fetching quota for', accountsFile.accounts.length, 'accounts...\n');
  }

  const results = await Promise.all(
    accountsToFetch.map(account => getAccountQuota(account))
  );

  // 4. Cache results (always cache all accounts for future lookups)
  const cacheData = {};
  for (const account of accountsFile.accounts) {
    // If we fetched this account, use fresh data; otherwise check existing cache
    const freshResult = results.find(r => r.email === account.email);
    if (freshResult) {
      cacheData[account.email] = freshResult;
    } else {
      // Try to preserve existing cache for accounts we didn't fetch
      const existingCache = readCache();
      if (existingCache && existingCache.data[account.email]) {
        cacheData[account.email] = existingCache.data[account.email];
      }
    }
  }
  writeCache(cacheData);

  // 5. Format and display output
  if (options.account !== undefined) {
    console.log(formatSingleAccount(results[0], options.account - 1));
  } else if (options.verbose) {
    console.log(formatDetailedView(results));
  } else {
    console.log(formatTableView(results));
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
