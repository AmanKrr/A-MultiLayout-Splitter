/**
 * throttle
 * 
 * Ensures a function is called at most once per specified time interval.
 * Replaces heavier utility libraries to maintain a minimal bundle size.
 * 
 * @param func - The function to execute
 * @param wait - Milliseconds to wait between executions
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
 * debounce
 * 
 * Postpones function execution until after a specified silence period.
 * 
 * @param func - The function to execute
 * @param wait - Milliseconds of silence to wait for
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
