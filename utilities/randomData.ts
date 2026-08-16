/**
 * Generates unique values for forms and test data.
 */

export function randomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function randomEmail(prefix = 'user'): string {
  return `${prefix}.${randomString(6)}@example.com`;
}

export function randomNumber(min = 1, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Unique suffix useful for usernames, titles, etc. */
export function uniqueId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${randomString(4)}`;
}
