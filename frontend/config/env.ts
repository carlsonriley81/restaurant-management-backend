/**
 * Runtime environment variable validation.
 * Throws at startup if required env vars are missing.
 */
function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000/api/v1'),
  wsUrl: getEnv('NEXT_PUBLIC_WS_URL', 'http://localhost:3000'),
  taxRate: parseFloat(getEnv('NEXT_PUBLIC_TAX_RATE', '0.08')),
} as const;
