/**
 * FitAlex Timestamp & Date Utility Helpers
 * All timestamp logging uses exact JavaScript new Date() executions
 */

/**
 * Format timestamp to high-readability standard: "Oct 01, 2026, 07:15 PM"
 */
export function formatFullTimestamp(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'Never';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format natural check-in time: "Today at 04:12 PM", "Yesterday at 09:30 AM", or "Oct 01 at 07:15 PM"
 */
export function formatFriendlyCheckIn(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'Never checked in';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  if (isToday) return `Today at ${timePart}`;
  if (isYesterday) return `Yesterday at ${timePart}`;

  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date);

  return `${datePart} at ${timePart}`;
}

/**
 * Format date only: "Oct 01, 2026"
 */
export function formatDateOnly(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format time only: "07:15:23 PM"
 */
export function formatTimeWithSeconds(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Dynamic humanized relative time (e.g. "Just now", "2 mins ago", "1 hour ago")
 */
export function formatTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return 'in the future';
  }
  if (diffInSeconds < 10) {
    return 'Just now';
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  return formatDateOnly(date);
}

/**
 * Calculate difference in days from current time to expiration
 */
export function getDaysRemaining(expirationDateInput: string | Date): number {
  const expDate = typeof expirationDateInput === 'string' ? new Date(expirationDateInput) : expirationDateInput;
  const now = new Date();
  const diffTime = expDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a membership expires within 7 days and is not yet expired
 */
export function isUrgentExpiration(expirationDateInput: string | Date): boolean {
  const days = getDaysRemaining(expirationDateInput);
  return days >= 0 && days <= 7;
}

/**
 * Checks if an expiration date is already in the past
 */
export function isExpired(expirationDateInput: string | Date): boolean {
  const expDate = typeof expirationDateInput === 'string' ? new Date(expirationDateInput) : expirationDateInput;
  return expDate.getTime() < new Date().getTime();
}

/**
 * Calculate future date string given duration in days
 */
export function addDaysToCurrentDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/**
 * Add days to an existing expiration or today, whichever is later
 */
export function extendExpirationDate(currentExpISO: string, daysToAdd: number): string {
  const currentExp = new Date(currentExpISO);
  const now = new Date();
  const base = currentExp.getTime() > now.getTime() ? currentExp : now;
  const extended = new Date(base);
  extended.setDate(extended.getDate() + daysToAdd);
  return extended.toISOString();
}
