/**
 * Merges class names, filtering falsy values.
 * Usage: cn('px-4 py-2', isActive && 'bg-primary-500', className)
 * 
 * This is a lightweight implementation — no extra dependencies needed.
 * For Tailwind conflict resolution, install: npm i clsx tailwind-merge
 * Then replace this file with the clsx+twMerge version.
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim()
}
