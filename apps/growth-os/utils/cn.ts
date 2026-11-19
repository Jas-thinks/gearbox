import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without conflicts.
 * Drop-in replacement for classnames/clsx with Tailwind support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
