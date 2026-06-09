import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally join classNames together
 * and merge Tailwind classes safely without style conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
