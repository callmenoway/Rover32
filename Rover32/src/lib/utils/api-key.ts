import { randomBytes } from 'crypto';

/**
 * Generates a secure random API key with a specified length
 * @param length The length of the API key in bytes (default: 32)
 * @returns A securely generated API key string
 */
export function generateApiKey(length: number = 32): string {
  // Generate random bytes and convert to hex string with a prefix
  const randomString = randomBytes(length).toString('hex');
  return `rk_${randomString}`;
}

/**
 * Validates if a string is in the correct API key format
 * @param key The API key to validate
 * @returns Whether the key is in valid format
 */
export function isValidApiKeyFormat(key: string): boolean {
  return /^rk_[a-f0-9]{64}$/.test(key);
}
