/**
 * Cache management for quota results
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { QuotaCache, AccountQuotaResult } from './types.js';
import { CACHE_TTL_MS } from './constants.js';

/**
 * Get the path to quota cache file
 * Location differs by OS:
 * - Windows: %LOCALAPPDATA%/opencode/quota-cache.json
 * - Linux/Mac: ~/.cache/opencode/quota-cache.json
 */
function getCacheFilePath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    return path.join(localAppData, 'opencode', 'quota-cache.json');
  } else {
    const cacheHome = process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache');
    return path.join(cacheHome, 'opencode', 'quota-cache.json');
  }
}

/**
 * Read cache from disk if it exists and is still valid
 * @returns Cache data or null if cache doesn't exist or is expired
 */
export function readCache(): QuotaCache | null {
  const cachePath = getCacheFilePath();
  try {
    if (!fs.existsSync(cachePath)) return null;
    const content = fs.readFileSync(cachePath, 'utf-8');
    const cache: QuotaCache = JSON.parse(content);
    
    // Check if cache is still valid
    const age = Date.now() - cache.timestamp;
    if (age > cache.ttlMs) {
      return null; // Cache expired
    }
    
    return cache;
  } catch {
    return null;
  }
}

/**
 * Write quota results to cache
 * @param data Account quota results to cache
 */
export function writeCache(data: Record<string, AccountQuotaResult>): void {
  const cachePath = getCacheFilePath();
  const cache: QuotaCache = {
    timestamp: Date.now(),
    ttlMs: CACHE_TTL_MS,
    data,
  };
  
  try {
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    // Silent fail - caching is optional
    console.warn('Failed to write cache:', error);
  }
}

/**
 * Clear the quota cache
 */
export function clearCache(): void {
  const cachePath = getCacheFilePath();
  try {
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  } catch {
    // Silent fail
  }
}

/**
 * Format cache age into human-readable time remaining
 * @param timestamp Cache creation timestamp
 * @returns Human-readable string like "8 minutes"
 */
export function formatCacheAge(timestamp: number): string {
  const ageMs = Date.now() - timestamp;
  const ageMinutes = Math.floor(ageMs / 60000);
  const ttlMinutes = Math.floor(CACHE_TTL_MS / 60000);
  const remainingMinutes = ttlMinutes - ageMinutes;
  
  if (remainingMinutes <= 0) return 'expired';
  return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}
