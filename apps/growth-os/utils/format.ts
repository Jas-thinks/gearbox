import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/**
 * Format an ISO date string for display.
 */
export function formatDate(
  dateString: string | null | undefined,
  pattern = "MMM d, yyyy"
): string {
  if (!dateString) return "—";
  const date = parseISO(dateString);
  if (!isValid(date)) return "—";
  return format(date, pattern);
}

/**
 * Format an ISO date string as relative time (e.g. "3 hours ago").
 */
export function formatRelativeTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  const date = parseISO(dateString);
  if (!isValid(date)) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a number with K/M/B suffixes for display in stat cards.
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

/**
 * Format a decimal as a percentage string.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case for display.
 */
export function snakeToTitle(str: string): string {
  return str
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Truncate text to a given character limit.
 */
export function truncate(str: string, limit = 100): string {
  if (str.length <= limit) return str;
  return `${str.slice(0, limit).trim()}…`;
}
