const PREFIX = 'rms_';

/**
 * Safely get an item from localStorage.
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Safely set an item in localStorage.
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFIX + key);
}

export const STORAGE_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  user: 'user',
  offlineQueue: 'offline_queue',
  // Kitchen Display System
  kitchenSettings: 'kitchen_settings',
  kitchenOfflineQueue: 'kitchen_offline_queue',
  kitchenTicketCache: 'kitchen_ticket_cache',
} as const;
