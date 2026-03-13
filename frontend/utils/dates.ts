/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Format a date string into date + time.
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
}

/**
 * Format a date string into time only.
 */
export function formatTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
}

/**
 * Return how many minutes ago a timestamp was.
 */
export function minutesAgo(dateString: string): number {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  return Math.floor((now - then) / 60000);
}

/**
 * Check if a date is within N days from now.
 */
export function isWithinDays(dateString: string, days: number): boolean {
  const date = new Date(dateString).getTime();
  const limit = Date.now() + days * 24 * 60 * 60 * 1000;
  return date <= limit;
}
