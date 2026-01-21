/**
 * Authentication utilities for opencode-antigravity-quota plugin
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { AntigravityAccountsFile, TokenResponse } from './types.js';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TOKEN_URL } from './constants.js';

/**
 * Get the path to antigravity-accounts.json file
 * Location differs by OS:
 * - Windows: %APPDATA%/opencode/antigravity-accounts.json
 * - Linux/Mac: ~/.config/opencode/antigravity-accounts.json
 */
export function getAccountsFilePath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'opencode', 'antigravity-accounts.json');
  } else {
    const configHome = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
    return path.join(configHome, 'opencode', 'antigravity-accounts.json');
  }
}

/**
 * Read and parse the antigravity-accounts.json file
 * @returns Parsed accounts file or null if not found/invalid
 */
export function readAccountsFile(): AntigravityAccountsFile | null {
  const filePath = getAccountsFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read accounts file:', error);
    return null;
  }
}

/**
 * Refresh an OAuth access token using a refresh token
 * @param refreshToken The refresh token from antigravity-accounts.json
 * @returns Token response with new access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${error}`);
  }

  return response.json() as Promise<TokenResponse>;
}
