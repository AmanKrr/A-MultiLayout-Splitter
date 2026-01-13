/**
 * Throttle function - limits function execution to once per specified time period
 * Replaces lodash throttle to reduce bundle size
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastRun = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastRun >= wait) {
      func(...args);
      lastRun = now;
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
        lastRun = Date.now();
      }, wait - (now - lastRun));
    }
  };
}

/**
 * Debounce function - delays function execution until after specified time has elapsed
 * since the last invocation. Replaces lodash debounce.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
